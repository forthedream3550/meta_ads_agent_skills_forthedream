# Data model

## Campaign brief

A campaign brief is the business input for planning. See `schemas/lead-campaign-brief.schema.json`.

## Frequency observation

A frequency observation contains a current period, an optional comparison period and contextual signals. See `schemas/frequency-observation.schema.json`.

## Change plan

A change plan is the only accepted input for a production mutation. See `schemas/change-plan.schema.json`.

## Audit record

An audit record should contain:

- timestamp;
- actor and client;
- account and object;
- normalized change-plan hash;
- policy result;
- approval identity or mechanism;
- provider request without secrets;
- provider response summary;
- before and after values;
- rollback status;
- evaluation due condition.

## Customer outcome data

Prefer aggregated or pseudonymous records. A useful table can contain:

- lead source identifier;
- campaign, ad set and ad identifiers;
- submission date;
- outcome stage;
- outcome date;
- optional value band;
- invalid reason taxonomy.

Avoid names, phone numbers, email addresses and free-text notes unless an approved workflow requires them.
