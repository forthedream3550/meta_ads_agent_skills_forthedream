import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { changePlanSchema, frequencyObservationSchema, leadBriefSchema } from "./schemas.js";
import { createProvider } from "./providers/index.js";
import { analyzeFrequency } from "./frequency.js";
import { buildLeadCampaignPlan } from "./campaign-plan.js";
import { evaluateChangePlan, loadPolicyConfig } from "./policy.js";
import { executeChangePlan } from "./execution.js";

const server = new McpServer({
  name: "for-the-dream-meta-ads-guardrail",
  version: "0.1.0"
});

const provider = createProvider();
const policy = loadPolicyConfig();

function text(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

server.registerTool(
  "list_capabilities",
  {
    description: "List the guardrail server's supported read, analysis and write capabilities.",
    inputSchema: {}
  },
  async () => text({
    provider: provider.name,
    writeEnabled: policy.writeEnabled,
    dryRun: policy.dryRun,
    tools: [
      "get_object_insights",
      "analyze_frequency",
      "build_lead_campaign_plan",
      "review_change_plan",
      "execute_change_plan"
    ],
    supportedWrites: ["set_status", "set_daily_budget", "set_lifetime_budget"],
    prohibited: ["delete_object", "modify_billing", "modify_access", "modify_dataset", "upload_customer_list"]
  })
);

server.registerTool(
  "get_object_insights",
  {
    description: "Fetch raw Meta Ads insights for one object and date range through the configured provider.",
    inputSchema: {
      objectId: z.string().regex(/^[0-9]+$/),
      since: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      fields: z.array(z.string()).optional()
    }
  },
  async (input) => text(await provider.getInsights(input))
);

server.registerTool(
  "analyze_frequency",
  {
    description: "Classify frequency, recognition and fatigue signals without applying a universal cap.",
    inputSchema: frequencyObservationSchema.shape
  },
  async (input) => text(analyzeFrequency(frequencyObservationSchema.parse(input)))
);

server.registerTool(
  "build_lead_campaign_plan",
  {
    description: "Build a normalized, paused-by-default lead generation campaign plan from a commercial brief.",
    inputSchema: leadBriefSchema.shape
  },
  async (input) => text(buildLeadCampaignPlan(leadBriefSchema.parse(input)))
);

server.registerTool(
  "review_change_plan",
  {
    description: "Validate and classify a proposed status or ad set budget mutation before execution.",
    inputSchema: { plan: changePlanSchema }
  },
  async ({ plan }) => text(evaluateChangePlan(changePlanSchema.parse(plan), policy))
);

server.registerTool(
  "execute_change_plan",
  {
    description: "Execute an approved change plan through the configured provider. Dry-run and write policy are enforced server-side.",
    inputSchema: {
      plan: changePlanSchema,
      approvalToken: z.string().regex(/^[a-f0-9]{64}$/)
    }
  },
  async ({ plan, approvalToken }) => text(
    await executeChangePlan(changePlanSchema.parse(plan), approvalToken, provider, policy)
  )
);

const transport = new StdioServerTransport();
await server.connect(transport);
