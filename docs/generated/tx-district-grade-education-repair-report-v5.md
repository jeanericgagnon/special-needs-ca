# Texas District-Grade Education Repair Report v5

This pass repairs only the remaining district-grade education layer for the 244 counties that were still partial in v4.

## Result history

- v4 PASS/PARTIAL/BLOCKED: 10/244/0
- v5 PASS/PARTIAL/BLOCKED: 216/38/0

## Repair outcome

- Partial counties attempted: 244
- Repaired to PASS: 206
- Still PARTIAL: 38
- BLOCKED: 0

## Top failure categories

- weak_student_services_only: 3
- special_education_page_missing: 34
- district_homepage_broken: 1

## Counties still below California-grade

- andrews-tx
- aransas-tx
- bell-tx
- briscoe-tx
- coke-tx
- collingsworth-tx
- concho-tx
- crockett-tx
- dallam-tx
- delta-tx
- dickens-tx
- donley-tx
- duval-tx
- floyd-tx
- franklin-tx
- gaines-tx
- hamilton-tx
- hansford-tx
- irion-tx
- jim-wells-tx
- king-tx
- la-salle-tx
- llano-tx
- loving-tx
- maverick-tx
- mcmullen-tx
- menard-tx
- moore-tx
- pecos-tx
- rains-tx
- sabine-tx
- shackelford-tx
- stonewall-tx
- throckmorton-tx
- upton-tx
- val-verde-tx
- washington-tx
- winkler-tx

## Texas index-safe

- Texas is index-safe: no

## Commands run

- `npm run run:texas-district-grade-education-repair-v5`

## Tests run

- `npm run test:texas-district-grade-education-repair-v5`

## Files changed

- `docs/generated/tx-district-grade-education-repair-report-v5.md`
- `data/generated/tx_education_direct_district_sources_v5.jsonl`
- `data/generated/tx_askted_district_map_v5.jsonl`
- `data/generated/tx_county_baseline_v5.jsonl`
- `data/generated/tx_verification_summary_v5.json`
- `data/generated/tx_failure_ledger_v5.jsonl`
- `data/generated/tx_next_action_queue_v5.jsonl`
- `scripts/run-texas-district-grade-education-repair-v5.mjs`
- `scripts/test-texas-district-grade-education-repair-v5.mjs`
