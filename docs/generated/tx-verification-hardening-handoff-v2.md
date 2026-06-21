# Texas Verification Hardening Handoff v2

## Current truth

- This handoff supersedes the v1 Texas PASS claim.
- Authoritative Texas county status is in `data/generated/tx_county_baseline_v2.jsonl`.
- Authoritative summary is in `data/generated/tx_verification_summary_v2.json`.
- Current county gate result:
  - `PASS: 0`
  - `PARTIAL: 0`
  - `BLOCKED: 254`
- Texas is **not index-safe**.

## Why Texas was downgraded

- All `39` v1 LIDDA rows carried `File Not Found` evidence but were still marked verified.
- All `255` v1 education rows depended on a generic AskTED portal URL rather than parsed county/district evidence.
- The v1 county gate accepted strings and source URLs as proof, even when the evidence was broken or generic.

## Authoritative artifacts

- Report:
  - `docs/generated/tx-verification-hardening-report-v2.md`
- Summary:
  - `data/generated/tx_verification_summary_v2.json`
- County gate:
  - `data/generated/tx_county_baseline_v2.jsonl`
- Role maps:
  - `data/generated/tx_lidda_county_map_v2.jsonl`
  - `data/generated/tx_eci_county_map_v2.jsonl`
  - `data/generated/tx_hhs_office_map_v2.jsonl`
  - `data/generated/tx_askted_district_map_v2.jsonl`
- Failure and operator followup:
  - `data/generated/tx_failure_ledger_v2.jsonl`
  - `data/generated/tx_next_action_queue_v2.jsonl`
  - `data/generated/tx_procedure_rules_v2.jsonl`

## What v1 can still be used for

- v1 remains useful as a historical acquisition snapshot.
- v1 must not be used as proof that Texas counties are launch-safe or index-safe.
- `docs/generated/tx-completion-procedure-and-results-v1.md` now includes a v2 correction notice and should be read that way.

## P0 next actions

1. Replace the broken LIDDA evidence source with a live official county-credible source.
2. Build a parsed TEA / AskTED county or district routing artifact instead of using the generic portal root.
3. Keep Texas county pages gated / `noindex` until the hardened county gate can produce real PASS rows.

## Recommended commands

1. `npm run run:texas-verification-hardening`
2. `npm run test:texas-verification-hardening`
3. Review `data/generated/tx_failure_ledger_v2.jsonl`
4. Review `data/generated/tx_next_action_queue_v2.jsonl`

## Decision rules

- Do not restore Texas PASS status by fallback strings alone.
- Do not let statewide nonprofit or statewide legal/PTI routes produce county PASS by themselves.
- Do not treat generic portal roots as county-specific proof.
- If evidence is broken or generic, downgrade first and document why.
