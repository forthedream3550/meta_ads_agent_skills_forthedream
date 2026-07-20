import type { ChangePlan, PolicyConfig, PolicyDecision } from "./types.js";
import { hashPlan } from "./normalization.js";

function numberFromEnv(name: string, fallback: number): number {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadPolicyConfig(): PolicyConfig {
  return {
    writeEnabled: process.env.META_ADS_WRITE_ENABLED === "true",
    dryRun: process.env.META_ADS_DRY_RUN !== "false",
    allowedAccountId: process.env.META_AD_ACCOUNT_ID || undefined,
    maxBudgetIncreasePercent: numberFromEnv("MAX_BUDGET_INCREASE_PERCENT", 10),
    maxBudgetDecreasePercent: numberFromEnv("MAX_BUDGET_DECREASE_PERCENT", 20),
    maxCumulativeBudgetChange24hPercent: numberFromEnv("MAX_CUMULATIVE_BUDGET_CHANGE_24H_PERCENT", 20)
  };
}

function numeric(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function evaluateChangePlan(plan: ChangePlan, config: PolicyConfig): PolicyDecision {
  const reasons: string[] = [];
  let result: PolicyDecision["result"] = "allow_with_approval";
  let riskClass: PolicyDecision["riskClass"] = "R2";

  if (config.allowedAccountId && plan.accountId !== config.allowedAccountId) {
    reasons.push("Account is outside the configured allowlist.");
    result = "reject";
    riskClass = "R4";
  }

  if (!plan.approval.required) {
    reasons.push("Production mutations must declare approval as required.");
    result = "reject";
    riskClass = "R4";
  }

  if (plan.action === "set_status") {
    if (!(["ACTIVE", "PAUSED"] as unknown[]).includes(plan.proposedValue)) {
      reasons.push("Only ACTIVE and PAUSED status changes are supported.");
      result = "reject";
      riskClass = "R4";
    }
  }

  if (plan.action === "set_daily_budget" || plan.action === "set_lifetime_budget") {
    if (plan.objectType !== "adset") {
      reasons.push("Budget changes are supported only for ad sets.");
      result = "reject";
      riskClass = "R4";
    }
    const current = numeric(plan.currentValue);
    const proposed = numeric(plan.proposedValue);
    if (current === null || proposed === null || current <= 0 || proposed <= 0) {
      reasons.push("Budget values must be positive numeric minor-unit amounts.");
      result = "reject";
      riskClass = "R4";
    } else {
      const changePercent = ((proposed - current) / current) * 100;
      if (changePercent > config.maxBudgetIncreasePercent) {
        reasons.push(`Budget increase ${changePercent.toFixed(2)}% exceeds the ${config.maxBudgetIncreasePercent}% operation limit.`);
        result = "reject";
        riskClass = "R3";
      }
      if (changePercent < -config.maxBudgetDecreasePercent) {
        reasons.push(`Budget decrease ${Math.abs(changePercent).toFixed(2)}% exceeds the ${config.maxBudgetDecreasePercent}% operation limit.`);
        result = "reject";
        riskClass = "R3";
      }
    }
  }

  if (plan.evidence.length === 0 || plan.reason.trim().length < 10) {
    reasons.push("The change does not contain sufficient evidence or reasoning.");
    result = "reject";
    riskClass = "R4";
  }

  if (result !== "reject") {
    reasons.push("The action is reversible but changes delivery or spend, so bound approval is required.");
    if (!config.writeEnabled) reasons.push("Writes are disabled in server configuration.");
    if (config.dryRun) reasons.push("Dry-run mode is enabled.");
  }

  return { result, riskClass, reasons, planHash: hashPlan(plan) };
}
