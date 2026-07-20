export type ObjectType = "campaign" | "adset" | "ad";
export type ChangeAction = "set_status" | "set_daily_budget" | "set_lifetime_budget";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ChangePlan {
  version: 1;
  idempotencyKey: string;
  accountId: string;
  objectType: ObjectType;
  objectId: string;
  action: ChangeAction;
  currentValue?: unknown;
  proposedValue: unknown;
  currency?: string | null;
  reason: string;
  evidence: string[];
  expectedEffect?: string | null;
  risk?: string | null;
  rollback: Record<string, unknown>;
  evaluationDue?: string | null;
  approval: {
    required: boolean;
    status: ApprovalStatus;
    approvedBy?: string;
  };
}

export interface PolicyConfig {
  writeEnabled: boolean;
  dryRun: boolean;
  allowedAccountId?: string;
  maxBudgetIncreasePercent: number;
  maxBudgetDecreasePercent: number;
  maxCumulativeBudgetChange24hPercent: number;
}

export interface PolicyDecision {
  result: "allow" | "allow_with_approval" | "reject";
  riskClass: "R0" | "R1" | "R2" | "R3" | "R4";
  reasons: string[];
  planHash: string;
}

export interface ProviderObject {
  id: string;
  account_id?: string;
  name?: string;
  status?: string;
  effective_status?: string;
  daily_budget?: string | number;
  lifetime_budget?: string | number;
  [key: string]: unknown;
}

export interface ProviderExecutionResult {
  provider: string;
  simulated: boolean;
  success: boolean;
  request: Record<string, unknown>;
  response: unknown;
}

export interface InsightsRequest {
  objectId: string;
  since: string;
  until: string;
  fields?: string[];
}
