# Texas Residual District Education Repair Report v7

This pass starts from the truthful Texas v6 baseline and retries only the 30 remaining partial counties for direct district-grade education evidence.

## Result history

- v6 PASS/PARTIAL/BLOCKED: 224/30/0
- v7 PASS/PARTIAL/BLOCKED: 233/21/0

## Residual repair outcome

- Attempted counties: 30
- Repaired counties: 9
- Still partial counties: 21

## Counties still partial with exact reason

- andrews-tx: weak_student_services_only (weak_student_services_only)
- coke-tx: search_fallback_exhausted (search_fallback_exhausted)
- collingsworth-tx: search_fallback_exhausted (search_fallback_exhausted)
- concho-tx: search_fallback_exhausted (search_fallback_exhausted)
- crockett-tx: search_fallback_exhausted (search_fallback_exhausted)
- delta-tx: search_fallback_exhausted (search_fallback_exhausted)
- donley-tx: search_fallback_exhausted (search_fallback_exhausted)
- floyd-tx: search_fallback_exhausted (search_fallback_exhausted)
- franklin-tx: search_fallback_exhausted (search_fallback_exhausted)
- hansford-tx: search_fallback_exhausted (search_fallback_exhausted)
- king-tx: search_fallback_exhausted (search_fallback_exhausted)
- la-salle-tx: district_homepage_broken (district_homepage_broken)
- loving-tx: district_homepage_broken (district_homepage_broken)
- maverick-tx: district_homepage_broken (district_homepage_broken)
- mcmullen-tx: search_fallback_exhausted (search_fallback_exhausted)
- menard-tx: search_fallback_exhausted (search_fallback_exhausted)
- moore-tx: search_fallback_exhausted (search_fallback_exhausted)
- sabine-tx: search_fallback_exhausted (search_fallback_exhausted)
- shackelford-tx: district_homepage_broken (district_homepage_broken)
- stonewall-tx: search_fallback_exhausted (search_fallback_exhausted)
- washington-tx: search_fallback_exhausted (search_fallback_exhausted)

## Top failure categories

- weak_student_services_only: 1
- search_fallback_exhausted: 16
- district_homepage_broken: 4

## Counties below California-grade

- andrews-tx
- coke-tx
- collingsworth-tx
- concho-tx
- crockett-tx
- delta-tx
- donley-tx
- floyd-tx
- franklin-tx
- hansford-tx
- king-tx
- la-salle-tx
- loving-tx
- maverick-tx
- mcmullen-tx
- menard-tx
- moore-tx
- sabine-tx
- shackelford-tx
- stonewall-tx
- washington-tx

## Texas index-safe

- Texas is index-safe: no

## Tests run

- `npm run test:texas-final-district-education-cleanup-v6`
- `npm run test:texas-residual-district-education-repair-v7`

## Files changed

- `docs/generated/tx-residual-district-education-repair-report-v7.md`
- `data/generated/tx_education_direct_district_sources_v7.jsonl`
- `data/generated/tx_county_baseline_v7.jsonl`
- `data/generated/tx_verification_summary_v7.json`
- `data/generated/tx_failure_ledger_v7.jsonl`
- `data/generated/tx_next_action_queue_v7.jsonl`
- `scripts/run-texas-residual-district-education-repair-v7.mjs`
- `scripts/test-texas-residual-district-education-repair-v7.mjs`

## Lessons learned update

- Added one new generalizable lesson: governance-page rejection must inspect URL/title/headings before nav-heavy body text so valid district special-education pages are not falsely rejected.

## Next action

- Keep the remaining partial counties gated and repair the residual district-grade evidence gaps county-by-county.
