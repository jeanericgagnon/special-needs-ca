# Lightweight Source Acquisition Staging Status

- Date: `2026-06-17`
- Run ID: `2026-06-17T16-58-43-900Z`
- Mode Verified: `dry-run` and `apply`

## Current Lightweight Coverage

- Accepted validated records: `1881`
- Supported for staging: `1640`
- Unsupported for staging: `241`
- Supported staging coverage: `87.2%`

## Supported Staging Families

- `nonprofit_support`
  - target staging table: `staging_scraped_nonprofit_organizations`
  - supported records: `508`
- `condition_nonprofits`
  - target staging table: `staging_scraped_nonprofit_organizations`
  - supported records: `9`
- `parent_training_nonprofits`
  - target staging table: `staging_scraped_nonprofit_organizations`
  - supported records: `10`
- `dd_routing`
  - target staging table: `staging_scraped_state_resource_agencies`
  - supported records: `74`
- `advocates_legal`
  - target staging table: `staging_scraped_iep_advocates`
  - supported records: `936`
- `providers_care`
  - target staging table: `staging_scraped_resource_providers`
  - supported records: `103`

## Unsupported Families Still Needing Staging Mappings

- `programs_benefits`
- `general_gap_fill`
- `medicaid_hhs_offices`
- `transition_programs`
- `waivers`
- `source_registry`
- `early_intervention_programs`
- `education_routing`
- `geography_counties`
- `california_source_targets`
- `care_independent_living`
- `goods_supplies`
- `housing`
- `jobs_vocational`
- `knowledge_content`
- `legal_aid`

## Apply Run Result

- SQLite DB: `ca_disability_navigator.db`
- Supported records inserted this run: `1640`
- Existing matching staging rows replaced before insert: `1640`

## Promotion Audit Result

- Lightweight staging rows inspected for production promotion: `1605`
- County inference updates applied before promotion audit: `198`
- Auto-promoted to production tables: `2`
- Rejected as existing duplicates: `196`
- Held for manual review: `1407`

Why auto-promotion is blocked right now:

- most nonprofits are still missing safe `county_id` mappings, though `188` were backfilled from explicit county evidence
- providers improved materially:
  - `45 / 81` provider rows are now address-ready for geocoding
  - `33 / 81` provider rows now have county-backed staging locality from Census batch geocoding
  - provider manual review dropped from `81` to `58`
  - `23` provider rows now resolve as duplicates
  - `5` provider rows are safe promotion candidates under the stricter generic-name guardrails
- advocates are missing safe `county_id` mappings and remain manual-review by policy
- many DD routing rows still lack official-domain certainty or trustworthy non-generic page naming

## Advocate Hardening Update

- Scope rerun: `advocates_legal` only
- Parser/validator status: passed after adding advocate-specific relevance filtering and single-state inference
- New advocate validated outcome:
  - parsed: `1074`
  - accepted: `430`
  - rejected: `644`
  - acceptance rate: `40.0%`
- Change from prior advocate lightweight acceptance:
  - accepted rows dropped from `936` to `430`
  - this removed `506` likely weak, hijacked, irrelevant, or low-signal advocate pages from the lightweight accepted set
- Main rejection reasons:
  - `missing_advocate_relevance_signal`: `619`
  - `missing_advocate_contact_signal`: `130`
  - `bad_advocate_topic_signal`: `101`
  - `missing_title_and_heading`: `100`
  - `missing_advocate_name`: `100`
- New state-scope outcome inside accepted advocate rows:
  - still `multi-state`: `238`
  - single-state accepted: `192`
  - top single-state counts: `new-york 21`, `texas 13`, `massachusetts 12`, `new-jersey 11`, `florida 11`, `virginia 11`
- Staging result for rerun:
  - `430` advocate staging rows re-applied into `staging_scraped_iep_advocates`
- Important limitation:
  - advocate rows are cleaner and more state-scoped now, but they still do not carry safe county mappings, so promotion remains manual-review only
- Important guardrail learned:
  - state-code inference must not treat ordinary words like `or` or `in` as state abbreviations; the parser now only accepts uppercase code signals or full state names

## Commands Verified

```bash
node src/db/create_staging_tables.js
npm run test:source-acquisition-stage
npm run run:source-acquisition-stage -- --run-id=2026-06-17T16-58-43-900Z --mode=dry-run
npm run run:source-acquisition-stage -- --run-id=2026-06-17T16-58-43-900Z --mode=apply
npm run test:source-acquisition-county-inference
npm run run:source-acquisition-county-inference -- --run-id=2026-06-17T16-58-43-900Z --mode=dry-run
npm run run:source-acquisition-county-inference -- --run-id=2026-06-17T16-58-43-900Z --mode=apply
npm run test:source-acquisition-provider-geocode
npm run run:source-acquisition-provider-county-geocode -- --run-id=2026-06-17T16-58-43-900Z --mode=dry-run
npm run run:source-acquisition-provider-county-geocode -- --run-id=2026-06-17T16-58-43-900Z --mode=live
npm run test:source-acquisition-promote
npm run run:source-acquisition-promote -- --run-id=2026-06-17T16-58-43-900Z --mode=dry-run
npm run run:source-acquisition-promote -- --run-id=2026-06-17T16-58-43-900Z --mode=apply
```

## Artifact Paths

- Staged index summary:
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/staged/index-summary.json`
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/staged/index-summary.md`
- Example family summaries:
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/staged/nonprofit-support/promotion-summary.md`
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/staged/dd-routing/promotion-summary.md`
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/staged/advocates-legal/promotion-summary.md`
- Promotion audit summaries:
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/promoted/index-summary.json`
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/promoted/staging_scraped_nonprofit_organizations-summary.json`
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/promoted/staging_scraped_state_resource_agencies-summary.json`
- County inference summaries:
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/county-inference/index-summary.json`
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/county-inference/staging_scraped_nonprofit_organizations-summary.json`
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/county-inference/staging_scraped_state_resource_agencies-summary.json`
- Provider geocode summaries:
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/provider-county-geocode/summary.json`
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/provider-county-geocode/summary.md`
  - `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/provider-county-geocode/provider-address-batch.csv`
