# Texas California-Grade Handoff v4

## Current truth

- Texas is **not** California-grade under the strict district-grade standard.
- Texas is **not index-safe**.
- Current strict result:
  - `PASS: 10`
  - `PARTIAL: 244`
  - `BLOCKED: 0`

## Why v4 changed the result

- v3 allowed ESC or TEA fallback education proof to satisfy county PASS.
- v4 requires direct, live district-grade education evidence.
- LIDDA, ECI, HHS, statewide legal/P&A, PTI, and ABLE routing stay as repaired in v3.

## What PASS means in v4

A county passes only if it has all of:

- verified LIDDA / DD intake routing
- verified ECI routing
- verified Medicaid / HHS routing
- verified statewide legal / P&A route
- verified statewide PTI / parent route
- verified Texas ABLE route
- verified direct live district-grade education route

## Counties currently passing

- `bexar-tx`
- `collin-tx`
- `dallas-tx`
- `denton-tx`
- `el-paso-tx`
- `galveston-tx`
- `harris-tx`
- `montgomery-tx`
- `travis-tx`
- `williamson-tx`

## Main remaining gap

- `244` counties still have official backbone coverage but only fallback-grade education evidence.
- Those counties remain `PARTIAL` until they have direct district-grade education evidence.

## Canonical v4 files

- `docs/generated/tx-california-grade-repair-report-v4.md`
- `data/generated/tx_verification_summary_v4.json`
- `data/generated/tx_county_baseline_v4.jsonl`
- `data/generated/tx_askted_district_map_v4.jsonl`
- `data/generated/tx_failure_ledger_v4.jsonl`
- `data/generated/tx_next_action_queue_v4.jsonl`
- `scripts/run-texas-california-grade-repair-v4.mjs`
- `scripts/test-texas-california-grade-repair-v4.mjs`

## Next action

- Repair Texas education county-by-county using direct district-grade sources only.
- Keep Texas county pages gated / `noindex` until the strict county gate passes.
