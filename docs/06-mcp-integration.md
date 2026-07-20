# MCP integration

## Role of MCP

MCP gives AI clients a structured way to discover and invoke tools. This repository uses MCP as an execution boundary, not as the reasoning method itself.

## Recommended topology

Use the public skills for diagnosis and output structure. Use the MCP server for validated data access, policy checks, dry-runs and narrow write actions.

## Initial tool surface

- `list_capabilities`
- `get_object_insights`
- `analyze_frequency`
- `build_lead_campaign_plan`
- `review_change_plan`
- `execute_change_plan`

The server should expose fewer tools than the underlying advertising API. Provider-specific complexity remains behind the adapter.

## Provider strategy

### Official Meta Ads MCP

Use the official connector directly for supervised workflows when it supports the required operation and client. Apply the same change-plan conventions in the prompt and human review flow.

### Graph API adapter

Use a custom provider when the organization needs server-side policy, an audit trail, account allowlists or integration with internal approval systems. Credentials belong in the deployment environment.

### Dry-run provider

Use for development, examples and tests. It returns a simulated result without touching an ad account.

## Authorization

Remote MCP deployments should follow the current MCP authorization specification and use HTTPS. Local stdio deployments should read credentials from environment variables or an approved secret store.

Meta account authorization and permissions are provider concerns. Do not pass Meta access tokens through model prompts or tool arguments.

## Human review

Write tools must return a readable summary before execution:

- object and account;
- current value;
- proposed value;
- financial effect;
- evidence;
- rollback;
- approval requirement.

## Client configuration

Client-specific setup belongs in future files under `docs/clients/`. Do not hard-code a single AI vendor into skill logic.
