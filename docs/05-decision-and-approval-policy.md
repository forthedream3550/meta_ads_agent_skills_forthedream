# Decision and approval policy

## Objective

Separate model reasoning from execution authority. The model may propose an action. The server decides whether the action is structurally valid and whether approval is required.

## Risk classes

### R0: Read only

Examples: fetch insights, list objects, inspect configuration. No approval required after account authorization.

### R1: Prepare only

Examples: build a campaign plan, produce a draft change plan, create a paused object in a test environment. No production delivery change.

### R2: Reversible delivery change

Examples: pause or activate an ad, adjust a bounded ad set budget, update a schedule. Approval required by default.

### R3: High-impact change

Examples: publish a new campaign, materially expand targeting, change optimization events, modify multiple objects or increase spend beyond a local bound. Strong approval required.

### R4: Prohibited in version 0.1

Examples: billing changes, deleting objects, changing business access, modifying datasets or pixels, uploading customer lists, bypassing approval, or operating outside the configured account allowlist.

## Change-plan contract

Every R2 or R3 action must include:

- account and object identifiers;
- normalized action type;
- current and proposed values;
- evidence;
- expected effect;
- risk and counterfactual;
- rollback operation;
- evaluation due condition;
- idempotency key;
- approval status.

## Budget policy

Repository defaults are deliberately conservative examples. Teams must configure their own limits.

- Reject negative or zero budgets.
- Reject currency-ambiguous values.
- Express API amounts in account minor units where required.
- Limit single-operation increases.
- Limit cumulative change over a rolling period.
- Reject simultaneous budget and targeting changes unless separately approved.
- Never infer an account's acceptable spend from historical maximum alone.

## Approval

An approval must bind to the exact normalized change-plan hash. A general message such as "go ahead" must not authorize a different amount, object or action.

## Execution sequence

1. Validate schema.
2. Fetch current state.
3. Recompute the proposed delta.
4. Evaluate policy.
5. Run dry-run.
6. Verify approval binding.
7. Execute once using an idempotency key.
8. Fetch resulting state.
9. Append the audit record.
10. Schedule or state the evaluation condition.
