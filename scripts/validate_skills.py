#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def validate_skill(path: Path):
    errors = []
    skill_file = path / "SKILL.md"
    agent_file = path / "agents" / "openai.yaml"
    if not skill_file.exists():
        return ["missing SKILL.md"]
    if not agent_file.exists():
        errors.append("missing agents/openai.yaml")
    text = skill_file.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        errors.append("SKILL.md must start with YAML frontmatter")
        return errors
    parts = text.split("---", 2)
    if len(parts) < 3:
        errors.append("frontmatter is not closed")
        return errors
    frontmatter = parts[1]
    body = parts[2].strip()
    fields = []
    values = {}
    for line in frontmatter.splitlines():
        if not line.strip():
            continue
        if ":" not in line:
            errors.append(f"invalid frontmatter line: {line}")
            continue
        key, value = line.split(":", 1)
        fields.append(key.strip())
        values[key.strip()] = value.strip()
    if set(fields) != {"name", "description"}:
        errors.append("frontmatter must contain only name and description")
    name = values.get("name", "")
    if name != path.name:
        errors.append("frontmatter name must match directory name")
    if not NAME_RE.match(name):
        errors.append("name must use lowercase hyphen-case")
    description = values.get("description", "")
    if len(description) < 80:
        errors.append("description is too short")
    if not body:
        errors.append("skill body is empty")
    if "TODO" in text:
        errors.append("skill contains TODO text")
    return errors


def main():
    failures = 0
    for path in sorted(p for p in SKILLS.iterdir() if p.is_dir()):
        errors = validate_skill(path)
        if errors:
            failures += 1
            print(f"FAIL {path.name}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {path.name}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
