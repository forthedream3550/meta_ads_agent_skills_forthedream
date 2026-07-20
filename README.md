# For the Dream Meta Ads Skills

A public, safety-first repository for operating Meta lead generation campaigns with reusable AI skills and an optional MCP guardrail server.

The repository is designed for teams that want to automate routine advertising work without turning strategic or financial control over to an unbounded agent. It separates three concerns:

1. **Skills** define how an agent should reason, diagnose and communicate.
2. **Policy** defines what the agent may prepare, recommend or execute.
3. **MCP tools** provide structured access to campaign data and narrowly scoped write actions.

## Initial scope

Version 0.1 focuses on:

- building lead generation campaign plans;
- auditing campaign structure and measurement;
- connecting lead quality to campaign decisions;
- monitoring frequency, reach and creative fatigue;
- planning creative rotation;
- reviewing and executing controlled changes;
- recording every proposed and executed mutation.

## Core principle

> Automate execution, explain the decision, and protect the commercial context.

## Repository structure

```text
.
├── skills/                     Reusable agent skills
├── shared/                     Shared terminology, metrics and contracts
├── config/                     Example account and policy configuration
├── schemas/                    Machine-readable JSON schemas
├── examples/                   Example briefs and change plans
├── docs/                       Product, architecture and operating documents
└── mcp-server/                 Safety and orchestration MCP server
```

## Skills

| Skill | Purpose |
| --- | --- |
| `lead-generation-campaign-builder` | Turn a commercial brief into an executable campaign plan. |
| `lead-generation-campaign-auditor` | Audit structure, tracking, forms, creative and operational readiness. |
| `lead-quality-analyzer` | Connect CRM outcomes and sales feedback to media decisions. |
| `frequency-fatigue-controller` | Distinguish useful repetition from audience or creative fatigue. |
| `creative-rotation-planner` | Design controlled creative refreshes without destroying the baseline. |
| `meta-ads-change-reviewer` | Classify risk, require approval and produce auditable change plans. |

## Quick start

### Use the skills only

Copy the desired directory from `skills/` into the skill location supported by your AI environment. Each directory contains its own `SKILL.md` and UI metadata.

### Run the MCP guardrail server

```bash
cd mcp-server
npm install
cp ../.env.example .env
npm run build
npm run start
```

The server starts in dry-run mode. Real writes remain blocked until a provider, credentials and explicit write controls are configured.

## Safety defaults

- Dry-run is enabled by default.
- Every write action needs an explicit change plan.
- Every change plan receives a risk class.
- Budget changes are bounded by policy.
- Destructive actions are not supported in version 0.1.
- A change without sufficient evidence is rejected, not guessed.
- Account credentials and customer data must never enter the repository.

See [Decision and approval policy](docs/05-decision-and-approval-policy.md) and [Security](SECURITY.md).

## Status

This is an initial public scaffold. The skills, schemas and policy model are usable. The MCP server includes deterministic planning, review and limited provider interfaces, but production deployment still requires account-specific validation, Meta permissions and an operational approval UI.

## License

Apache License 2.0. See [LICENSE](LICENSE).

## Trademarks and Brand Assets

“Meta” and “Facebook” are trademarks of Meta Platforms, Inc.
This project is independent and is not endorsed by or affiliated with Meta.

The For the Dream name, logo and brand assets are not licensed for reuse
unless explicitly stated otherwise.

