import { z } from "zod";

export const changePlanSchema = z.object({
  version: z.literal(1),
  idempotencyKey: z.string().min(8),
  accountId: z.string().regex(/^act_[0-9]+$/),
  objectType: z.enum(["campaign", "adset", "ad"]),
  objectId: z.string().regex(/^[0-9]+$/),
  action: z.enum(["set_status", "set_daily_budget", "set_lifetime_budget"]),
  currentValue: z.unknown().optional(),
  proposedValue: z.unknown(),
  currency: z.string().length(3).nullable().optional(),
  reason: z.string().min(10),
  evidence: z.array(z.string().min(5)).min(1),
  expectedEffect: z.string().nullable().optional(),
  risk: z.string().nullable().optional(),
  rollback: z.record(z.string(), z.unknown()),
  evaluationDue: z.string().nullable().optional(),
  approval: z.object({
    required: z.boolean(),
    status: z.enum(["pending", "approved", "rejected"]),
    approvedBy: z.string().optional()
  })
});

export const frequencyObservationSchema = z.object({
  windowDays: z.number().int().positive(),
  reach: z.number().nonnegative(),
  impressions: z.number().nonnegative(),
  frequency: z.number().nonnegative(),
  ctr: z.number().nonnegative().nullable().optional(),
  costPerResult: z.number().nonnegative().nullable().optional(),
  conversionRate: z.number().nonnegative().nullable().optional(),
  newReachShare: z.number().min(0).max(1).nullable().optional(),
  activeCreativeCount: z.number().int().nonnegative().nullable().optional(),
  comparison: z.object({
    frequency: z.number().nonnegative().nullable().optional(),
    ctr: z.number().nonnegative().nullable().optional(),
    costPerResult: z.number().nonnegative().nullable().optional(),
    conversionRate: z.number().nonnegative().nullable().optional()
  }).nullable().optional()
});

export const leadBriefSchema = z.object({
  name: z.string().min(1),
  businessObjective: z.string().min(1),
  market: z.string().min(1),
  languages: z.array(z.string()).default([]),
  conversionLocation: z.enum(["instant_form", "website", "messaging", "calls", "mixed"]),
  offer: z.string().min(1),
  primaryConversion: z.string().min(1),
  budgetType: z.enum(["daily", "lifetime"]),
  budgetAmount: z.number().positive(),
  currency: z.string().length(3),
  audienceDescription: z.string().min(1),
  exclusions: z.array(z.string()).default([]),
  availableFormats: z.array(z.string()).default([]),
  followUpOwner: z.string().min(1),
  targetFirstResponseMinutes: z.number().int().positive(),
  crmFeedbackAvailable: z.boolean(),
  constraints: z.array(z.string()).default([])
});

export type ChangePlanInput = z.infer<typeof changePlanSchema>;
export type FrequencyObservation = z.infer<typeof frequencyObservationSchema>;
export type LeadBrief = z.infer<typeof leadBriefSchema>;
