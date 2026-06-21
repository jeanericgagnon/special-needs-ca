# Texas Final Three Repair Report v10

This pass starts from the hardened Texas v9 baseline and retries only the final three partial counties with district-owned parent-resource and district-document evidence. It does not loosen the gate and does not count generic or statewide evidence.

## Result history

- v9 PASS/PARTIAL/BLOCKED: 251/3/0
- v10 PASS/PARTIAL/BLOCKED: 254/0/0

## Final three outcome

- attempted counties: king-tx, maverick-tx, mcmullen-tx
- target candidates attempted: 5
- newly repaired counties: king-tx, maverick-tx, mcmullen-tx
- still partial counties: none

## Remaining partial reasons

- none

## Top failure categories

- none

## Counties below California-grade

- none

## Texas index-safe

- Texas is index-safe: yes

## Tests run

- `npm run test:texas-final-three-repair-v10`
- `npm run test:texas-final-seven-and-spot-audit-v9`
- `npm run test:all-state-california-grade-audit-v1`

## Files changed

- `docs/generated/tx-final-three-repair-report-v10.md`
- `data/generated/tx_education_direct_district_sources_v10.jsonl`
- `data/generated/tx_county_baseline_v10.jsonl`
- `data/generated/tx_verification_summary_v10.json`
- `data/generated/tx_failure_ledger_v10.jsonl`
- `data/generated/tx_next_action_queue_v10.jsonl`
- `data/generated/tx_final_three_target_candidates_v10.jsonl`
- `scripts/run-texas-final-three-repair-v10.mjs`
- `scripts/test-texas-final-three-repair-v10.mjs`
- `docs/source-acquisition-lessons-learned.md`
- `docs/state-upgrade-lessons-learned.md`
- `docs/reusable-state-upgrade-playbook.md`

## Lessons learned update

- Added one new reusable rule: district-owned parent-resource pages can satisfy California-grade education routing only when the fetched body explicitly lists multiple special-education assets such as Special Education Guides, Section 504, Dyslexia, ARD/procedural-safeguards, or equivalent parent-facing routing materials.
