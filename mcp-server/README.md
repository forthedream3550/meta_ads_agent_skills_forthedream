# Meta Ads Guardrail MCP

This server provides a narrow MCP tool surface for supervised lead generation operations. It is not a complete mirror of the Meta Marketing API.

## Current capabilities

- inspect configured capabilities;
- fetch raw object insights through the Graph API provider;
- classify frequency and fatigue signals;
- build a normalized lead campaign planning response;
- review change plans against conservative policy;
- execute status and ad set budget changes through a provider;
- run every write as a dry-run by default;
- append audit records.

## Supported write actions

- `set_status` for campaign, ad set or ad, limited to `ACTIVE` and `PAUSED`;
- `set_daily_budget` for an ad set;
- `set_lifetime_budget` for an ad set.

Object creation, deletion, billing, access, datasets, pixels and customer-list operations are intentionally not implemented.

## Install

```bash
npm install
cp ../.env.example .env
npm run build
npm test
```

## Run with stdio

```bash
npm run start
```

## Enable the Graph API provider

Set:

```text
META_ADS_PROVIDER=graph-api
META_ACCESS_TOKEN=...
META_GRAPH_API_VERSION=vXX.X
META_AD_ACCOUNT_ID=act_...
```

Keep `META_ADS_WRITE_ENABLED=false` and `META_ADS_DRY_RUN=true` until the account, permissions, currency units and policy have been tested.

## Approval flow

1. Ask the MCP server to review a change plan.
2. Save the exact normalized plan to a JSON file.
3. Have an authorized reviewer sign the plan outside the AI tool surface:

```bash
META_ADS_APPROVAL_SECRET=... npm run approve -- ./change-plan.json
```

4. Provide the resulting token to `execute_change_plan`.

The token is an HMAC over the normalized plan. Any change to the object, amount or action invalidates approval.

## Important

A Meta access token is never accepted as a tool argument. The provider reads credentials from the server environment only.
