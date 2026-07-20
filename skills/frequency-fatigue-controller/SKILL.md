---
name: frequency-fatigue-controller
description: Interpret Meta campaign frequency in context and distinguish underexposure, productive repetition, creative fatigue and audience saturation. Use when a user asks to target, monitor or limit frequency; build brand recognition through repeated exposure; diagnose rising frequency or falling response; decide whether to rotate creative, widen an audience, change pacing or wait for more evidence. Never apply a universal frequency cap without a time window, objective, audience and supporting performance signals.
---

# Frequency and Fatigue Controller

## Workflow

1. Establish the observation window and campaign objective.
2. Fetch reach, impressions, frequency, spend and response signals.
3. Compare with a prior equivalent window where possible.
4. Check creative count, creative age and new-reach share.
5. Classify the state using `references/state-model.md`.
6. List alternative explanations.
7. Recommend one controlled response or explain why no change is justified.
8. Define the next evaluation condition.

## Rules

- Never use frequency alone as a stop signal.
- Treat deliberate recognition and performance delivery as different but related jobs.
- Preserve a control creative during rotation.
- Check provider capabilities before claiming a hard frequency cap can be configured.
- Prefer alert levels over universal limits.
- Use a longer window for longer consideration cycles.

## Output

```text
State:
Window and objective:
Evidence:
Alternative explanations:
Recommended action:
Risk:
Approval required:
Next evaluation condition:
```

For deterministic first-pass classification, run `scripts/classify_frequency.py` with a JSON observation. Use its output as a signal, not as the final strategic judgment.
