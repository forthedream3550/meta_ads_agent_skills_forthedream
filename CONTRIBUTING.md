# Contributing

Thank you for improving the repository.

## Contribution principles

1. Keep advertising advice evidence-based and conditional.
2. Do not encode universal performance thresholds as facts.
3. Preserve dry-run and approval defaults.
4. Never add access tokens, customer exports or identifiable lead data.
5. Add tests for deterministic policy or scoring changes.
6. Document changes that can spend money or alter delivery.

## Pull request checklist

- Explain the user problem and expected outcome.
- Identify whether the change can read data, spend money or alter delivery.
- Include a rollback path for mutations.
- Add or update schemas when tool inputs change.
- Update documentation and examples.
- Run skill validation and MCP tests.

## Skill contributions

A skill must contain:

- `SKILL.md` with only `name` and `description` in YAML frontmatter;
- imperative instructions;
- a clear input contract;
- a clear output contract;
- explicit evidence and safety rules;
- `agents/openai.yaml` metadata.

## MCP contributions

New write tools must:

- create or accept a change plan;
- pass policy evaluation;
- support dry-run;
- require the configured approval mechanism;
- append an audit record;
- reject fields outside an explicit allowlist.
