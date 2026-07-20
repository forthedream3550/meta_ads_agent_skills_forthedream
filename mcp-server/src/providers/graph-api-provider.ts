import type { MetaAdsProvider } from "./provider.js";
import type { ChangePlan, InsightsRequest, ProviderExecutionResult, ProviderObject } from "../types.js";

export class GraphApiProvider implements MetaAdsProvider {
  readonly name = "graph-api";
  private readonly token: string;
  private readonly version: string;

  constructor() {
    this.token = process.env.META_ACCESS_TOKEN || "";
    this.version = process.env.META_GRAPH_API_VERSION || "";
    if (!this.token) throw new Error("META_ACCESS_TOKEN is required for the Graph API provider.");
    if (!/^v[0-9]+\.[0-9]+$/.test(this.version)) {
      throw new Error("META_GRAPH_API_VERSION must be set explicitly, for example vXX.X.");
    }
  }

  private url(path: string): URL {
    return new URL(`https://graph.facebook.com/${this.version}/${path.replace(/^\//, "")}`);
  }

  private async request(url: URL, init?: RequestInit): Promise<unknown> {
    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        ...(init?.headers || {})
      }
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(`Meta Graph API request failed with ${response.status}: ${JSON.stringify(payload)}`);
    }
    return payload;
  }

  async getObject(objectId: string): Promise<ProviderObject> {
    const url = this.url(objectId);
    url.searchParams.set("fields", "id,name,status,effective_status,account_id,daily_budget,lifetime_budget,campaign_id,adset_id");
    return (await this.request(url)) as ProviderObject;
  }

  async getInsights(request: InsightsRequest): Promise<unknown> {
    const url = this.url(`${request.objectId}/insights`);
    const fields = request.fields?.length
      ? request.fields
      : ["reach", "impressions", "frequency", "spend", "clicks", "ctr", "cpc", "actions", "cost_per_action_type"];
    url.searchParams.set("fields", fields.join(","));
    url.searchParams.set("time_range", JSON.stringify({ since: request.since, until: request.until }));
    return this.request(url);
  }

  async execute(plan: ChangePlan): Promise<ProviderExecutionResult> {
    const body = new URLSearchParams();
    if (plan.action === "set_status") {
      body.set("status", String(plan.proposedValue));
    } else if (plan.action === "set_daily_budget") {
      body.set("daily_budget", String(plan.proposedValue));
    } else if (plan.action === "set_lifetime_budget") {
      body.set("lifetime_budget", String(plan.proposedValue));
    } else {
      throw new Error(`Unsupported action: ${String(plan.action)}`);
    }

    const requestSummary = {
      objectId: plan.objectId,
      action: plan.action,
      fields: Object.fromEntries(body.entries())
    };
    const response = await this.request(this.url(plan.objectId), {
      method: "POST",
      body
    });
    return {
      provider: this.name,
      simulated: false,
      success: true,
      request: requestSummary,
      response
    };
  }
}
