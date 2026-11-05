# Private configuration

Keep real credentials in local ignored configuration or the hosting provider's environment settings. Tracked `.env` files and private key payloads are rejected by the source check. Only empty or illustrative `.env.example`, `.env.sample`, and `.env.template` files belong in Git.

Run `python3 .github/scripts/check-secrets.py` before committing. GitHub Actions repeats this check on pushes and pull requests. A failed check reports paths and types, never credential values. Branch protection must require `source-secrets` if merges must be blocked.

Exact path-and-hash exceptions cover reviewed public Firebase web configuration, synthetic fixtures or documented examples. Never add an exception for a real credential. Dependency/vendor directories and Git history are outside this source check. Existing credential values are unchanged by this cleanup.
