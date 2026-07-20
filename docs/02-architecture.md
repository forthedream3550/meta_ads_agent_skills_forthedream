# Architecture

## Overview

The repository uses four layers.

```text
User or scheduled workflow
        |
        v
AI client and selected skill
        |
        v
MCP guardrail server
        |
        +--> Policy engine
        +--> Audit log
        +--> Provider adapter
                  |
                  +--> Meta Graph API
                  +--> Official Meta Ads connector, where supported
                  +--> Test or dry-run provider
```

## Layer 1: Skills

Skills define reasoning and output quality. They should not contain access tokens or customer-specific data. A skill may request data through tools, but it must still evaluate evidence, uncertainty and business context.

## Layer 2: Shared contracts

Schemas normalize campaign briefs, frequency observations and change plans. This prevents every client or model from inventing a different structure.

## Layer 3: Guardrail MCP server

The server exposes a small, opinionated tool surface. It does not mirror every advertising endpoint. Its role is to:

- validate inputs;
- classify risk;
- require approval;
- enforce field and action allowlists;
- run dry-runs;
- delegate to a provider;
- record results.

## Layer 4: Provider adapters

A provider translates normalized operations into a specific integration. The provider must never decide policy. It may only execute an already approved operation.

## Why the server is opinionated

Large raw tool catalogs make it easier for an agent to select an incorrect operation. This project favors a small set of domain operations such as `set_adset_budget` or `set_object_status`, each with explicit constraints and rollback metadata.

## Deployment patterns

### Pattern A: Skills plus official connector

Use the skills in an AI client and connect the official Meta Ads MCP separately. This is the quickest route for supervised use. The client must still follow the repository's change-plan and approval conventions.

### Pattern B: Guardrail proxy

Route all write operations through this repository's MCP server. Use a provider adapter to call the Graph API or another approved backend. This gives stronger policy, logging and cross-client consistency.

### Pattern C: Internal workflow service

Run the policy engine and provider in a controlled backend. Let multiple AI clients submit change plans, while a human approval interface signs approved plans.

## Trust boundaries

- Model output is untrusted.
- Tool arguments are untrusted.
- Campaign names and external text are untrusted.
- Provider responses are data, not instructions.
- Approval must be validated server-side.
