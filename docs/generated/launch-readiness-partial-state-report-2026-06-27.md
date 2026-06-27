# Launch Readiness Partial-State Report

Generated: 2026-06-27

## Launch posture

- Launch-ready COMPLETE states: `45`
- BLOCKED states held in partial / gated mode: `5`
- Launch index-safe states: `45`
- Incorrectly index-safe states: `[]`
- Partial-state policy artifact: `data/generated/launch_partial_state_policy_v1.json`
- Milestone snapshot: `data/generated/national_initial_scrape_v1.json`

## Partial / gated states

| State | Suppressed families | Allowed surfaces | Suppressed surfaces |
| --- | --- | --- | --- |
| Arizona | `county_local_disability_resources` | `state-hub` | `programs-index`, `program-guide`, `state-counties-hub`, `condition-hub`, `county-hub`, `county-condition`, `school-district`, `city` |
| Alaska | `county_local_disability_resources` | `state-hub` | `programs-index`, `program-guide`, `state-counties-hub`, `condition-hub`, `county-hub`, `county-condition`, `school-district`, `city` |
| Maine | `county_local_disability_resources` | `state-hub` | `programs-index`, `program-guide`, `state-counties-hub`, `condition-hub`, `county-hub`, `county-condition`, `school-district`, `city` |
| Idaho | `district_or_county_education_routing`, `county_local_disability_resources` | `state-hub` | `programs-index`, `program-guide`, `state-counties-hub`, `condition-hub`, `county-hub`, `county-condition`, `school-district`, `city` |
| New Hampshire | `medicaid_state_health_coverage`, `medicaid_waiver_hcbs_disability_services`, `developmental_disability_idd_authority`, `early_intervention_part_c`, `district_or_county_education_routing`, `vocational_rehabilitation_pre_ets`, `county_local_disability_resources` | `state-hub` | `programs-index`, `program-guide`, `state-counties-hub`, `condition-hub`, `county-hub`, `county-condition`, `school-district`, `city` |

## Rendering and SEO contract

- `COMPLETE` + `indexSafe=true` states remain fully launchable and indexable.
- The 5 blocked states remain `BLOCKED` in certification truth and `index_safe=false` in queue truth.
- Partial states may render only gated statewide audit-style surfaces.
- County, district, city, county-diagnosis, and program-guide surfaces for partial states are suppressed and must return noindex metadata.
- Sitemap inclusion continues to flow from central SEO policy and launch truth, not from partial-state visibility.

## Evidence that the launch contract agrees

- `data/generated/all_state_california_grade_audit_v3.json`
  - `COMPLETE=45`
  - `BLOCKED=5`
  - `indexSafeCount=45`
  - `incorrectlyIndexSafeStates=[]`
- `data/generated/all_state_priority_queue_v3.jsonl`
  - all 5 partial states remain `classification=BLOCKED`
  - all 5 partial states remain `index_safe=false`
- `docs/generated/final-website-audit-2026-06-27.md`
  - launch summary now reports `45` launch-ready complete states
  - launch summary now reports `5` launch-blocked partial-gated states
  - audit/queue mismatch count on launch truth fields is `0`

## Commands run

- `npm run setup:local`
- `npm run audit:current-truth`
- `npm run audit:truth-registry`
- `npm run audit:info-confidence`
- `npm run audit:info-completeness`
- `npm run audit:directory-staleness`
- `npm run audit:directory-freshness-gaps`
- `npm run audit:exhaustive-gap-master`
- `npm run audit:final-website`
- `node scripts/test-all-state-california-grade-audit-v3.mjs`
- `node scripts/test-launch-partial-state-policy-v1.mjs`
- `npm run seo:qa`
- `npm run seo:qa:full`

## Current blocker-safe launch backlog

- Arizona
  - publish statewide only; keep Greenlee county-local routing suppressed
- Alaska
  - publish statewide only; keep borough/census-area local routing suppressed
- Maine
  - publish statewide only; keep county-to-office routing suppressed
- Idaho
  - publish statewide only; keep Camas / Clark education routing and county-local routing suppressed
- New Hampshire
  - publish statewide audit presence only; keep programmatic and local families suppressed until public official proof lanes recover

## Remaining validation note

- `npm run build` was started during this pass but did not complete within the interactive monitoring window, so compile proof still needs one clean completed run before treating this as the final launch commit.
