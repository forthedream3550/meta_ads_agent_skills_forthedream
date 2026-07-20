# Agent instructions

## Mission

Maintain a public, safety-first repository for AI-assisted Meta lead generation. Improve repeatability and evidence quality without weakening human control over spend, targeting or publication.

## Before changing code or skills

1. Read `README.md`.
2. Read the relevant document under `docs/`.
3. Read `shared/safety-rules.md`.
4. For write-capable changes, read `docs/05-decision-and-approval-policy.md` and `SECURITY.md`.

## Repository rules

- Keep skills provider-independent where possible.
- Keep provider API details behind adapters.
- Never add credentials, customer identifiers or real lead records.
- Do not introduce destructive write actions.
- Do not generate approval tokens through an MCP tool.
- Keep Graph API version configurable.
- Reject unknown fields rather than forwarding them.
- Preserve dry-run as the default.
- Add tests for policy, normalization, approval and scoring changes.
- Update schemas and examples with any contract change.

## Skill rules

- Use imperative instructions.
- Keep YAML frontmatter to `name` and `description`.
- Put detailed taxonomies and templates in `references/`.
- State evidence requirements, uncertainty and safety boundaries.
- Never encode a universal frequency cap as advertising truth.

## Definition of done

Run:

```bash
python scripts/validate_skills.py
cd mcp-server
npm ci
npm run build
npm test
```

Document any write capability, rollback path and approval requirement in the pull request.
