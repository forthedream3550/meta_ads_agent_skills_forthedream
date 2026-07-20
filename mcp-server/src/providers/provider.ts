import type { ChangePlan, InsightsRequest, ProviderExecutionResult, ProviderObject } from "../types.js";

export interface MetaAdsProvider {
  readonly name: string;
  getObject(objectId: string): Promise<ProviderObject>;
  getInsights(request: InsightsRequest): Promise<unknown>;
  execute(plan: ChangePlan): Promise<ProviderExecutionResult>;
}
