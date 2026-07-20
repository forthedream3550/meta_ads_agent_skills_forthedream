---
name: meta-ads-change-reviewer
description: Review proposed Meta Ads mutations before execution. Use when an agent wants to change campaign, ad set or ad status, adjust a budget, publish a prepared object, or perform any action that may alter delivery or spend. Validate the change-plan schema, fetch current state, classify risk, enforce account and field allowlists, require bound approval, confirm rollback and evaluation conditions, and reject destructive or ambiguous operations. Apply this skill immediately before any write-capable MCP or API tool.
---

# Meta Ads Change Reviewer

## Workflow

1. Validate the change plan against `references/change-plan-contract.md`.
2. Fetch the target object and confirm account ownership and object type.
3. Compare current state with the plan.
4. Recompute financial or delivery impact.
5. Classify risk using `references/risk-model.md`.
6. Evaluate configured policy.
7. Require approval bound to the exact normalized plan.
8. Run dry-run and show the user the resulting operation.
9. Execute only after all controls pass.
10. Fetch after-state and append the audit record.

## Reject immediately

- missing or ambiguous account or object identifiers;
- destructive actions;
- billing, access, pixel, dataset or customer-list changes;
- writes outside the allowlist;
- currency-ambiguous budgets;
- approval that does not bind to the exact plan;
- changed current state that invalidates the approved delta;
- unsupported provider capability.

## Output

```text
Policy decision: allow | allow_with_approval | reject
Risk class:
Validated target:
Before and proposed after:
Financial or delivery effect:
Evidence quality:
Approval binding:
Rollback:
Execution status:
Audit reference:
```
