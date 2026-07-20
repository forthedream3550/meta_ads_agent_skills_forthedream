# Maintainer playbook

## Release checks

1. Review all write-capable changes manually.
2. Run skill validation.
3. Run TypeScript build and tests.
4. Confirm `.env.example` contains no real values.
5. Search for token-like strings, account IDs and email addresses.
6. Confirm schemas match tool inputs.
7. Confirm documentation states provider limitations.
8. Tag the release and update `CHANGELOG.md`.

## Graph API version changes

- Read the official version changelog.
- Test reads on a non-production account.
- Test each supported write in dry-run and supervised mode.
- Confirm budget units and accepted statuses.
- Confirm insight field availability.
- Update compatibility notes.
- Never silently change the configured API version.

## Incident response

If an unintended write occurs:

1. disable writes;
2. preserve logs;
3. identify the exact plan, approval and provider request;
4. execute the documented rollback if safe;
5. verify after-state in Ads Manager;
6. rotate credentials if authorization may be compromised;
7. publish a sanitized incident note and corrective test.
