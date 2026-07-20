# Security policy

## Supported versions

Security fixes are applied to the latest minor version on the default branch.

## Reporting a vulnerability

Do not open a public issue for leaked credentials, authorization bypasses or tools that can spend money outside policy. Use a private security advisory in GitHub.

## Threat model

The main risks are:

- leaked Meta access tokens;
- prompt injection from campaign names, comments or external content;
- unauthorized budget or status mutations;
- cross-account operations;
- replayed approvals;
- accidental storage of lead data;
- over-trusting tool descriptions or model-generated arguments.

## Required controls

- Store secrets outside source control.
- Use least-privilege permissions and separate test accounts.
- Validate account, object type and field allowlists server-side.
- Treat all model output as untrusted input.
- Require explicit approval for write actions by default.
- Use idempotency keys for mutations.
- Write append-only audit records.
- Mask tokens and personal data in logs.
- Do not accept tokens in query strings.
- Use HTTPS for remote deployments.

## Data handling

Lead records should remain in the CRM or approved data warehouse. Skills should receive aggregates or pseudonymous outcome labels where possible. This repository does not require storing names, email addresses, phone numbers or message content.
