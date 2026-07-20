import test from "node:test";
import assert from "node:assert/strict";
import { analyzeFrequency } from "../src/frequency.js";


test("classifies productive repetition when frequency rises without performance decay", () => {
  const result = analyzeFrequency({
    windowDays: 7,
    reach: 10000,
    impressions: 23000,
    frequency: 2.3,
    ctr: 1.2,
    costPerResult: 15,
    newReachShare: 0.45,
    activeCreativeCount: 3,
    comparison: { frequency: 1.8, ctr: 1.22, costPerResult: 15.2 }
  });
  assert.equal(result.state, "productive_repetition");
});


test("classifies likely creative fatigue with concentrated delivery and thin creative coverage", () => {
  const result = analyzeFrequency({
    windowDays: 7,
    reach: 10000,
    impressions: 39000,
    frequency: 3.9,
    ctr: 0.7,
    costPerResult: 25,
    newReachShare: 0.15,
    activeCreativeCount: 1,
    comparison: { frequency: 2.8, ctr: 1.1, costPerResult: 17 }
  });
  assert.equal(result.state, "creative_fatigue_likely");
});
