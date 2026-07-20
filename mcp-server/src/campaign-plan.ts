import type { LeadBrief } from "./schemas.js";

export function buildLeadCampaignPlan(brief: LeadBrief) {
  const warnings: string[] = [];
  if (!brief.crmFeedbackAvailable) {
    warnings.push("CRM outcome feedback is unavailable, so optimization may stop at submitted leads.");
  }
  if (brief.availableFormats.length < 2) {
    warnings.push("Creative coverage is thin. Add at least one materially different format or opening.");
  }

  return {
    version: 1,
    name: brief.name,
    commercialObjective: brief.businessObjective,
    architecture: {
      campaign: {
        objective: "lead_generation",
        publicationState: "prepare_paused",
        budgetType: brief.budgetType
      },
      adSets: [
        {
          role: "primary_prospecting",
          audience: brief.audienceDescription,
          exclusions: brief.exclusions,
          conversionLocation: brief.conversionLocation
        }
      ],
      creatives: brief.availableFormats.map((format, index) => ({
        variant: `variant_${index + 1}`,
        format,
        hypothesis: "Define a distinct hook, proof type and opening before publication."
      }))
    },
    budget: {
      amount: brief.budgetAmount,
      currency: brief.currency,
      type: brief.budgetType,
      note: "Confirm provider minor-unit requirements before execution."
    },
    measurement: {
      primaryConversion: brief.primaryConversion,
      crmFeedbackAvailable: brief.crmFeedbackAvailable,
      requiredBreakdowns: ["campaign", "adset", "ad", "creative_variant"]
    },
    followUp: {
      owner: brief.followUpOwner,
      targetFirstResponseMinutes: brief.targetFirstResponseMinutes
    },
    constraints: brief.constraints,
    warnings,
    approvals: ["publication", "budget", "status_activation"]
  };
}
