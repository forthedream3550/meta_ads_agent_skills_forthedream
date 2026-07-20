---
name: lead-quality-analyzer
description: Analyze lead quality by connecting Meta campaign identifiers with aggregated CRM or sales outcomes. Use when a user needs to compare submitted, contactable, relevant, qualified, opportunity and won leads; diagnose a gap between low cost per lead and weak commercial results; identify follow-up bottlenecks; or decide which campaign, ad set or creative deserves budget. Apply this skill only when stage definitions and denominators are clear, and avoid exposing personal lead data.
---

# Lead Quality Analyzer

## Workflow

1. Confirm stage definitions and reporting window.
2. Confirm the join keys between advertising and outcome data.
3. Remove or label duplicates, invalid records and missing outcomes.
4. Calculate stage volumes and transition rates.
5. Compare cost per submitted, relevant and qualified lead.
6. Separate media quality from response-time and sales-process effects.
7. Identify segments with enough volume for a responsible conclusion.
8. Recommend media or operational actions with confidence levels.

## Rules

- Prefer aggregates or pseudonymous records.
- Never infer lead quality from cost per lead alone.
- Report missing outcome coverage.
- Distinguish uncontacted from unqualified.
- Do not punish a campaign for a sales queue without stating that limitation.
- State sample size and denominator for every rate.

## Output

```text
# Lead quality analysis
## Data coverage
## Funnel by source
## Quality and value findings
## Follow-up findings
## Media implications
## Operational implications
## Recommended changes
## Confidence and limitations
```

Read `references/outcome-taxonomy.md` before normalizing stages.
