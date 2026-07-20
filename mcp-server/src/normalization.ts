import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { ChangePlan } from "./types.js";

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, sortValue(item)])
    );
  }
  return value;
}

export function normalizePlan(plan: ChangePlan): string {
  return JSON.stringify(sortValue(plan));
}

export function hashPlan(plan: ChangePlan): string {
  return createHash("sha256").update(normalizePlan(plan)).digest("hex");
}

export function signPlan(plan: ChangePlan, secret: string): string {
  return createHmac("sha256", secret).update(normalizePlan(plan)).digest("hex");
}

export function verifyPlanSignature(plan: ChangePlan, secret: string, token: string): boolean {
  const expected = Buffer.from(signPlan(plan, secret), "hex");
  const received = Buffer.from(token, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}
