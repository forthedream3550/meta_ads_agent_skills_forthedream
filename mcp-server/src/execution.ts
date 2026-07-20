import type { ChangePlan, PolicyConfig, ProviderObject } from "./types.js";
import type { MetaAdsProvider } from "./providers/provider.js";
import { evaluateChangePlan } from "./policy.js";
import { verifyPlanSignature } from "./normalization.js";
import { appendAuditRecord } from "./audit-log.js";
import { DryRunProvider } from "./providers/dry-run-provider.js";

function currentValueForPlan(plan: ChangePlan, object: ProviderObject): unknown {
  if (plan.action === "set_status") return object.status ?? object.effective_status;
  if (plan.action === "set_daily_budget") return object.daily_budget;
  if (plan.action === "set_lifetime_budget") return object.lifetime_budget;
  return undefined;
}

export async function executeChangePlan(
  plan: ChangePlan,
  approvalToken: string,
  provider: MetaAdsProvider,
  config: PolicyConfig
) {
  const decision = evaluateChangePlan(plan, config);
  if (decision.result === "reject") {
    return { status: "rejected", decision };
  }

  const secret = process.env.META_ADS_APPROVAL_SECRET || "";
  if (!secret || secret.length < 24) {
    return { status: "rejected", decision, error: "Approval secret is missing or too short." };
  }
  if (!verifyPlanSignature(plan, secret, approvalToken)) {
    return { status: "rejected", decision, error: "Approval token does not match the exact change plan." };
  }

  const before = await provider.getObject(plan.objectId);
  if (before.account_id && before.account_id !== plan.accountId.replace(/^act_/, "")) {
    return { status: "rejected", decision, error: "Fetched object does not belong to the approved account." };
  }

  const current = currentValueForPlan(plan, before);
  if (plan.currentValue !== undefined && current !== undefined && String(current) !== String(plan.currentValue)) {
    return {
      status: "rejected",
      decision,
      error: "Current object state changed after the plan was prepared.",
      expectedCurrentValue: plan.currentValue,
      fetchedCurrentValue: current
    };
  }

  if (!config.writeEnabled || config.dryRun) {
    const dryRun = new DryRunProvider();
    const result = await dryRun.execute(plan);
    await appendAuditRecord({ status: "dry_run", decision, plan, before, result });
    return { status: "dry_run", decision, before, result };
  }

  const result = await provider.execute(plan);
  const after = await provider.getObject(plan.objectId);
  await appendAuditRecord({ status: "executed", decision, plan, before, after, result });
  return { status: "executed", decision, before, after, result };
}
