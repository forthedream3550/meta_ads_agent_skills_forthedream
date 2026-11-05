#!/usr/bin/env python3
"""Check tracked source for credentials without printing matched values.

Run: python3 .github/scripts/check-secrets.py
Public Firebase configuration and synthetic fixtures require an exact path/hash
exception in .github/secret-scan-allowlist.json. Never allow a real credential.
Dependency/vendor directories are excluded. This is a source guard, not a history scan.
"""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import urlsplit

PATTERNS = {
    'github_token': r'\b(?:gh[pousr]_[A-Za-z0-9_]{30,255}|github_pat_[A-Za-z0-9_]{40,255})',
    'anthropic_key': r'\bsk-ant-[A-Za-z0-9_-]{30,255}',
    'openai_key': r'\bsk-(?:(?:proj-|svcacct-)[A-Za-z0-9_-]{30,255}|[A-Za-z0-9]{48})',
    'resend_key': r'\bre_[A-Za-z0-9_-]{22,100}',
    'stripe_live_key': r'\b(?:sk|rk)_live_[A-Za-z0-9]{20,100}',
    'google_api_key': r'\bAIza[A-Za-z0-9_-]{30,100}',
    'supabase_secret': r'\bsb_secret_[A-Za-z0-9_-]{20,255}',
    'aws_access_key': r'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b',
    'private_key': r'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\\nr]*[A-Za-z0-9+/]{40,}',
    'database_password_url': r'postgres(?:ql)?://[^\s"\x27`<>]{1,2048}',
    'sensitive_literal': r'''(?<![\w/-])(?:[A-Z][A-Z0-9_]{0,60}(?:API_KEY|SECRET|TOKEN|PASSWORD)[A-Z0-9_]{0,30}|apiKey|api_key|token|mailchimpApiKey|password)["']?\s*[:=]\s*["']([A-Za-z0-9_+./=-]{20,256})["']''',
    'secret_fallback': r'''process[.]env[.](?!NEXT_PUBLIC_|PUBLIC_|VITE_)[A-Z0-9_]{0,60}(?:SECRET|PASSWORD|API_KEY|ACCESS_TOKEN|PRIVATE_KEY|WRITE_TOKEN)[A-Z0-9_]{0,30}\s*(?:\|\||\?\?)\s*["']([^"'\n]{12,256})["']''',
    'service_role_jwt': r'\beyJ[A-Za-z0-9_-]{10,1000}\.[A-Za-z0-9_-]{10,2000}\.[A-Za-z0-9_-]{10,1000}',
}
PATTERNS = {kind: re.compile(pattern) for kind, pattern in PATTERNS.items()}
PLACEHOLDER = re.compile(r'(?i)(example|placeholder|redacted|changeme|replace.?me|your[_-]|x{4,}|dummy|fake|test[_-]key)')
DEPENDENCIES = {'node_modules', 'vendor', '.venv', 'venv', '.next', '__pycache__'}


def is_private_env(path):
    name = Path(path).name
    is_env = name == '.env' or name.startswith('.env.')
    return is_env and not name.endswith(('.example', '.sample', '.template'))


def candidates(text):
    for kind, pattern in PATTERNS.items():
        for match in pattern.finditer(text):
            value = match.group(1) if kind in {'sensitive_literal', 'secret_fallback'} else match.group()
            if PLACEHOLDER.search(value):
                continue
            if kind == 'database_password_url':
                try:
                    password = urlsplit(value).password
                except ValueError:
                    continue
                if not password or '${' in password or PLACEHOLDER.search(password) or password in {'postgres', 'password', 'pass', 'secret', 'p', 'x'}:
                    continue
            if kind == 'service_role_jwt':
                import base64
                try:
                    payload = value.split('.')[1]
                    claims = json.loads(base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4)))
                except (ValueError, UnicodeError):
                    continue
                if not isinstance(claims, dict) or claims.get('role') != 'service_role':
                    continue
            if kind == 'sensitive_literal' and (len(set(value)) < 10 or value.isupper()):
                continue
            yield kind, value, text.count('\n', 0, match.start()) + 1


def main():
    root = Path(subprocess.check_output(['git', 'rev-parse', '--show-toplevel'], text=True).strip())
    allow_path = root / '.github/secret-scan-allowlist.json'
    allow = json.loads(allow_path.read_text()) if allow_path.exists() else []
    allowed = {(item['path'], item['kind'], item['sha256']) for item in allow}
    files = subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0')
    findings = []
    checked = 0
    for relative in filter(None, files):
        path = root / relative
        if DEPENDENCIES.intersection(Path(relative).parts):
            continue
        if is_private_env(relative):
            findings.append({'path': relative, 'line': 1, 'kind': 'tracked_private_env'})
        if path.is_symlink() or not path.is_file():
            continue
        try:
            raw = path.read_bytes()
            if b'\0' in raw:
                continue
            text = raw.decode('utf-8')
        except UnicodeError:
            continue
        checked += 1
        for kind, value, line in candidates(text):
            digest = hashlib.sha256(value.encode()).hexdigest()
            if (relative, kind, digest) not in allowed:
                findings.append({'path': relative, 'line': line, 'kind': kind, 'sha256': digest})
    if '--json' in sys.argv:
        print(json.dumps({'files_checked': checked, 'findings': findings}))
    else:
        for item in findings:
            print(f"{item['path']}:{item['line']}: {item['kind']} (value hidden)")
        print(f"Secret guard: {checked} text files checked; {len(findings)} findings.")
    return bool(findings)


if __name__ == '__main__':
    sys.exit(main())
