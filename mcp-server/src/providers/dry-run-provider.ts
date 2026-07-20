import type { MetaAdsProvider } from "./provider.js";
import type { ChangePlan, InsightsRequest, ProviderExecutionResult, ProviderObject } from "../types.js";

export class DryRunProvider implements MetaAdsProvider {
  readonly name = "dry-run";

  async getObject(objectId: string): Promise<ProviderObject> {
    return { id: objectId, status: "UNKNOWN", simulated: true };
  }

  async getInsights(request: InsightsRequest): Promise<unknown> {
    return { simulated: true, request, data: [] };
  }

  async execute(plan: ChangePlan): Promise<ProviderExecutionResult> {
    return {
      provider: this.name,
      simulated: true,
      success: true,
      request: { action: plan.action, objectId: plan.objectId, proposedValue: plan.proposedValue },
      response: { success: true, simulated: true }
    };
  }
}
