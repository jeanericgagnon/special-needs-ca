# Texas California-Grade Repair Report v3

## Executive summary

This v3 pass aimed to repair Texas toward California-grade without loosening the hardened gate. It used the live official Texas HHS LIDDA directory, bounded official education-route verification, and conservative carry-forward for ECI and HHS only where county/provider/contact evidence was already complete.

## County status progression

- v1: PASS 254, PARTIAL 0, BLOCKED 0
- v2: PASS 0, PARTIAL 0, BLOCKED 254
- v3: PASS 254, PARTIAL 0, BLOCKED 0

## What got repaired

- LIDDA rows repaired from live official directory: 39
- Education rows repaired from parsed county-to-ESC mapping with live official route verification: 254
- ECI rows downgraded or repaired: 0
- HHS rows downgraded or repaired: 0
- Education rows on direct live route pages: 68
- Education rows on TEA official fallback: 186

## What remains below California-grade

- Counties still below California-grade: 0
- Texas is index-safe: yes

## Exact repair approach

- Repaired LIDDA using the live official HHS LIDDA directory at `https://resources.hhs.texas.gov/directories/lidda`.
- Repaired education by replacing the generic AskTED portal proof with parsed county mappings plus live official ESC or TEA route verification.
- Re-checked ECI and HHS rows against county/provider/contact completeness and kept them verified only when those fields were already complete.

## P0 next actions

- maintain_hardened_texas_gate: Texas county skeleton currently satisfies the hardened California-grade checks.

## Commands run

- `npm run run:texas-california-grade-repair`

## Tests run

- `npm run test:texas-california-grade-repair`

## Files changed

- `docs/generated/tx-california-grade-repair-report-v3.md`
- `data/generated/tx_lidda_county_map_v3.jsonl`
- `data/generated/tx_askted_district_map_v3.jsonl`
- `data/generated/tx_hhs_office_map_v3.jsonl`
- `data/generated/tx_eci_county_map_v3.jsonl`
- `data/generated/tx_county_baseline_v3.jsonl`
- `data/generated/tx_verification_summary_v3.json`
- `data/generated/tx_failure_ledger_v3.jsonl`
- `data/generated/tx_next_action_queue_v3.jsonl`

