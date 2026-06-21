# Texas Final District Education Cleanup Report v6

This pass starts from the truthful Texas v5 baseline and retries only the 38 remaining partial counties for direct district-grade education evidence.

## Result history

- v5 PASS/PARTIAL/BLOCKED: 216/38/0
- v6 PASS/PARTIAL/BLOCKED: 224/30/0

## Cleanup outcome

- Remaining 38 attempted: 38
- Number repaired: 8
- Number still partial: 30

## Counties still partial with exact reason

- andrews-tx: weak_student_services_only (weak_student_services_only)
- aransas-tx: search_fallback_exhausted (search_fallback_exhausted)
- coke-tx: search_fallback_exhausted (search_fallback_exhausted)
- collingsworth-tx: search_fallback_exhausted (search_fallback_exhausted)
- concho-tx: search_fallback_exhausted (search_fallback_exhausted)
- crockett-tx: search_fallback_exhausted (search_fallback_exhausted)
- dallam-tx: search_fallback_exhausted (search_fallback_exhausted)
- delta-tx: search_fallback_exhausted (search_fallback_exhausted)
- donley-tx: search_fallback_exhausted (search_fallback_exhausted)
- duval-tx: search_fallback_exhausted (search_fallback_exhausted)
- floyd-tx: search_fallback_exhausted (search_fallback_exhausted)
- franklin-tx: search_fallback_exhausted (search_fallback_exhausted)
- gaines-tx: search_fallback_exhausted (search_fallback_exhausted)
- hamilton-tx: search_fallback_exhausted (search_fallback_exhausted)
- hansford-tx: search_fallback_exhausted (search_fallback_exhausted)
- jim-wells-tx: search_fallback_exhausted (search_fallback_exhausted)
- king-tx: search_fallback_exhausted (search_fallback_exhausted)
- la-salle-tx: district_homepage_broken (district_homepage_broken)
- llano-tx: search_fallback_exhausted (search_fallback_exhausted)
- loving-tx: district_homepage_broken (district_homepage_broken)
- maverick-tx: district_homepage_broken (district_homepage_broken)
- mcmullen-tx: search_fallback_exhausted (search_fallback_exhausted)
- menard-tx: search_fallback_exhausted (search_fallback_exhausted)
- moore-tx: search_fallback_exhausted (search_fallback_exhausted)
- pecos-tx: search_fallback_exhausted (search_fallback_exhausted)
- sabine-tx: search_fallback_exhausted (search_fallback_exhausted)
- shackelford-tx: district_homepage_broken (district_homepage_broken)
- stonewall-tx: search_fallback_exhausted (search_fallback_exhausted)
- washington-tx: search_fallback_exhausted (search_fallback_exhausted)
- winkler-tx: search_fallback_exhausted (search_fallback_exhausted)

## Top failure categories

- weak_student_services_only: 1
- search_fallback_exhausted: 25
- district_homepage_broken: 4

## Texas index-safe

- Texas is index-safe: no

## Tests run

- `npm run test:texas-final-district-education-cleanup-v6`

## Files changed

- `docs/generated/tx-final-district-education-cleanup-report-v6.md`
- `data/generated/tx_education_direct_district_sources_v6.jsonl`
- `data/generated/tx_county_baseline_v6.jsonl`
- `data/generated/tx_verification_summary_v6.json`
- `data/generated/tx_failure_ledger_v6.jsonl`
- `data/generated/tx_next_action_queue_v6.jsonl`
- `scripts/run-texas-final-district-education-cleanup-v6.mjs`
- `scripts/test-texas-final-district-education-cleanup-v6.mjs`

## Next action

- Keep the remaining partial counties gated and repair the residual district-grade evidence gaps county-by-county.
