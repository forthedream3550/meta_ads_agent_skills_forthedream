import type { FrequencyObservation } from "./schemas.js";

export type FrequencyState =
  | "insufficient_evidence"
  | "underexposed"
  | "productive_repetition"
  | "watch"
  | "creative_fatigue_likely"
  | "audience_saturation_likely";

function pctChange(current?: number | null, previous?: number | null): number | null {
  if (current == null || previous == null || previous === 0) return null;
  return (current - previous) / Math.abs(previous);
}

export function analyzeFrequency(input: FrequencyObservation): {
  state: FrequencyState;
  signals: string[];
  guidance: string;
} {
  const comparison = input.comparison;
  if (input.windowDays < 3 || !comparison) {
    return {
      state: "insufficient_evidence",
      signals: ["short_or_missing_comparison_window"],
      guidance: "Collect an equivalent comparison window before changing delivery."
    };
  }

  const signals: string[] = [];
  const frequencyChange = pctChange(input.frequency, comparison.frequency);
  const ctrChange = pctChange(input.ctr, comparison.ctr);
  const costChange = pctChange(input.costPerResult, comparison.costPerResult);
  const conversionChange = pctChange(input.conversionRate, comparison.conversionRate);

  if (frequencyChange != null && frequencyChange > 0.10) signals.push("frequency_rising");
  if (ctrChange != null && ctrChange < -0.15) signals.push("response_declining");
  if (costChange != null && costChange > 0.15) signals.push("cost_worsening");
  if (conversionChange != null && conversionChange < -0.15) signals.push("conversion_declining");
  if (input.newReachShare != null && input.newReachShare < 0.25) signals.push("new_reach_low");
  if (input.activeCreativeCount != null && input.activeCreativeCount <= 1) signals.push("creative_coverage_thin");

  const weakResponse = signals.includes("response_declining") || signals.includes("conversion_declining");
  const concentrated = signals.includes("new_reach_low");
  const rising = signals.includes("frequency_rising");
  const worsening = signals.includes("cost_worsening");

  if (rising && weakResponse && worsening && concentrated) {
    if (signals.includes("creative_coverage_thin")) {
      return {
        state: "creative_fatigue_likely",
        signals,
        guidance: "Prepare a controlled creative rotation while preserving the current control."
      };
    }
    return {
      state: "audience_saturation_likely",
      signals,
      guidance: "Review audience size, budget pace, exclusions and objective before increasing spend."
    };
  }

  if (rising && !weakResponse && !worsening) {
    return {
      state: "productive_repetition",
      signals,
      guidance: "Maintain the baseline and continue monitoring quality and new reach."
    };
  }

  if (weakResponse || worsening) {
    return {
      state: "watch",
      signals,
      guidance: "Prepare alternatives, but wait for a consistent pattern or more evidence before changing delivery."
    };
  }

  if (input.frequency < 1.5) {
    return {
      state: "underexposed",
      signals,
      guidance: "Maintain delivery or extend the observation window before concluding that repetition is excessive."
    };
  }

  return {
    state: "productive_repetition",
    signals,
    guidance: "No consistent fatigue pattern is present. Continue monitoring in context."
  };
}
