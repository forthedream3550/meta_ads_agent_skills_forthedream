import "dotenv/config";
import { readFile } from "node:fs/promises";
import { changePlanSchema } from "../src/schemas.js";
import { hashPlan, signPlan } from "../src/normalization.js";

const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run approve -- ./change-plan.json");
  process.exit(1);
}

const secret = process.env.META_ADS_APPROVAL_SECRET || "";
if (secret.length < 24) {
  console.error("META_ADS_APPROVAL_SECRET must contain at least 24 characters.");
  process.exit(1);
}

const parsed = JSON.parse(await readFile(file, "utf8"));
const plan = changePlanSchema.parse(parsed);
console.log(JSON.stringify({ planHash: hashPlan(plan), approvalToken: signPlan(plan, secret) }, null, 2));
