import test from "node:test";
import assert from "node:assert/strict";
import { evaluateChangePlan } from "../src/policy.js";
import type { ChangePlan, PolicyConfig } from "../src/types.js";

const config: PolicyConfig = {
  writeEnabled: false,
  dryRun: true,
  allowedAccountId: "act_123",
  maxBudgetIncreasePercent: 10,
  maxBudgetDecreasePercent: 20,
  maxCumulativeBudgetChange24hPercent: 20
};

function basePlan(): ChangePlan {
  return {
    version: 1,
    idempotencyKey: "example-001",
    accountId: "act_123",
    objectType: "adset",
    objectId: "456",
    action: "set_daily_budget",
    currentValue: 5000,
    proposedValue: 5500,
    currency: "EUR",
    reason: "Stable qualified lead cost with available sales capacity.",
    evidence: ["Seven-day qualified lead cost is stable."],
    rollback: { action: "set_daily_budget", value: 5000 },
    approval: { required: true, status: "pending" }
  };
}


test("allows a bounded budget change with approval", () => {
  const result = evaluateChangePlan(basePlan(), config);
  assert.equal(result.result, "allow_with_approval");
  assert.equal(result.riskClass, "R2");
});


test("rejects a budget increase above the policy limit", () => {
  const plan = basePlan();
  plan.proposedValue = 6000;
  const result = evaluateChangePlan(plan, config);
  assert.equal(result.result, "reject");
});


test("rejects an account outside the allowlist", () => {
  const plan = basePlan();
  plan.accountId = "act_999";
  const result = evaluateChangePlan(plan, config);
  assert.equal(result.result, "reject");
  assert.equal(result.riskClass, "R4");
});
