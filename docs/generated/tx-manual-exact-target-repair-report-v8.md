# Texas Manual Exact-Target Repair Report v8

This pass starts from the truthful Texas v7 baseline and retries only the 21 remaining partial counties with manually authored, district-owned exact targets.

## Result history

- v7 PASS/PARTIAL/BLOCKED: 233/21/0
- v8 PASS/PARTIAL/BLOCKED: 247/7/0

## Manual exact-target outcome

- Attempted counties: 21
- Repaired counties: 14
- Still partial counties: 7

## Counties newly repaired with accepted source URL

- coke-tx: https://www.bronteisd.net/special-education-guidance
- collingsworth-tx: https://www.wellingtonisd.net/page/special-education-postings/
- concho-tx: https://www.edencisd.net/page/special-programs/
- crockett-tx: https://www.ozonaschools.net/o/oes/page/special-education/
- delta-tx: https://www.cooperisd.net/page/dyslexia
- donley-tx: https://www.clarendonisd.net/page/special-education-and-504-services/
- floyd-tx: https://www.floydadaisd.esc17.net/page/special-programs/
- hansford-tx: https://www.pringlemorsecisd.net/District/Class/46-Special-Education
- la-salle-tx: https://www.cotullaisd.net/page/special-education
- loving-tx: https://www.wlisd.net/apps/pages/index.jsp?uREC_ID=1790320&type=d&pREC_ID=staff
- menard-tx: https://www.menardisd.net/page/menard-special-education-cooperative/
- moore-tx: https://www.dumasisd.org/page/special-programs/
- shackelford-tx: https://www.albanyisd.net/apps/pages/index.jsp?uREC_ID=582186&type=d
- washington-tx: https://www.brenhamisd.net/page/sped.home

## Remaining partial reasons

- andrews-tx: manual_target_exhausted (manual_target_exhausted)
- franklin-tx: district_site_blocked (district_site_blocked)
- king-tx: manual_target_exhausted (manual_target_exhausted)
- maverick-tx: weak_manual_target_only (weak_manual_target_only)
- mcmullen-tx: manual_target_exhausted (manual_target_exhausted)
- sabine-tx: manual_target_exhausted (manual_target_exhausted)
- stonewall-tx: document_text_unparsed (document_text_unparsed)

## Top failure categories

- manual_target_exhausted: 4
- district_site_blocked: 1
- weak_manual_target_only: 1
- document_text_unparsed: 1

## Counties below California-grade

- andrews-tx
- franklin-tx
- king-tx
- maverick-tx
- mcmullen-tx
- sabine-tx
- stonewall-tx

## Texas index-safe

- Texas is index-safe: no

## Tests run

- `npm run test:texas-manual-exact-target-repair-v8`
- `npm run test:texas-residual-district-education-repair-v7`
- `npm run test:texas-final-district-education-cleanup-v6`

## Files changed

- `docs/generated/tx-manual-exact-target-repair-report-v8.md`
- `data/generated/tx_education_direct_district_sources_v8.jsonl`
- `data/generated/tx_county_baseline_v8.jsonl`
- `data/generated/tx_verification_summary_v8.json`
- `data/generated/tx_failure_ledger_v8.jsonl`
- `data/generated/tx_next_action_queue_v8.jsonl`
- `data/generated/tx_manual_target_candidates_v8.jsonl`
- `scripts/run-texas-manual-exact-target-repair-v8.mjs`
- `scripts/test-texas-manual-exact-target-repair-v8.mjs`

## Lessons learned update

- Added one reusable lesson: once a state reaches a small residual county set, district sitemap mining should precede any new search fallback because exact role pages and district documents often exist in the sitemap even when homepage heuristics miss them.
