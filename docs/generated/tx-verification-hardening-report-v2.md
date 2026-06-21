# Texas Verification Hardening Report v2

## Executive summary

Texas v1 over-claimed county PASS status. After evidence hardening, Texas is **not index-safe** because the county gate must downgrade rows that rely on broken LIDDA evidence and generic education portal evidence.

## What v1 got right

- It created a bounded Texas-only artifact lane instead of broad autopilot scraping.
- It captured useful county, LIDDA, ECI, HHS office, district, manifest, and failure-ledger artifacts.
- It preserved enough structure to make a deterministic downgrade pass possible.

## What v1 got wrong

- It treated broken evidence as verified.
- It let generic statewide or portal URLs count as county-specific proof.
- It did not let critical failure-ledger findings affect county gate status.
- Its tests only checked for the presence of strings and URLs, not evidence quality.

## Exact v1 over-claim issue

- v1 PASS/PARTIAL/BLOCKED: 254/0/0
- v2 PASS/PARTIAL/BLOCKED: 0/0/254
- Verified v1 LIDDA rows with "File Not Found" evidence: 39
- PASS counties in v1 carrying broken evidence snippets: 254

## Evidence-quality rules added

- v1 over-claimed texas pass status because the county gate accepted generic or broken evidence
- a row cannot be verified when title, h1, or evidence snippet contains a broken-page marker
- statewide routes may support counties but cannot by themselves produce a county PASS
- county PASS requires county-specific or source-derived mapping for LIDDA, ECI, education routing, and HHS routing
- generic AskTED portal roots do not verify county education routing without parsed county or district mapping
- broken official directory pages must downgrade dependent county rows even if fallback names exist in the database
- failure-ledger critical findings must affect county gate outcomes
- truth beats coverage; downgrade when evidence is generic, broken, or not county-specific

## Rows downgraded by category

- downgrade_lidda: 39
- downgrade_education: 255
- downgrade_county_gate: 254

## County PASS/PARTIAL/BLOCKED before and after

- v1: PASS 254, PARTIAL 0, BLOCKED 0
- v2: PASS 0, PARTIAL 0, BLOCKED 254

## Remaining P0 fixes

- Replace or newly verify the Texas HHS LIDDA county-routing source with live county-specific evidence.
- Build a parsed TEA/AskTED county or district mapping artifact instead of relying on the generic AskTED portal URL.
- Keep Texas county pages gated/noindex until those two critical roles hard-pass.

## Index safety

Texas is index-safe: no

## What must happen before Texas can be called California-baseline complete

- Live, county-credible LIDDA routing evidence must exist for all covered counties.
- Education routing must come from parsed or otherwise county-specific TEA evidence, not generic portal roots.
- The county gate must pass with no broken evidence markers and no generic-only proof.

## Commands run

- `node scripts/run-texas-verification-hardening.mjs`

## Tests run

- `node scripts/test-texas-verification-hardening.mjs`

## Files changed

- `docs/generated/tx-verification-hardening-report-v2.md`
- `data/generated/tx_verification_summary_v2.json`
- `data/generated/tx_county_baseline_v2.jsonl`
- `data/generated/tx_lidda_county_map_v2.jsonl`
- `data/generated/tx_eci_county_map_v2.jsonl`
- `data/generated/tx_hhs_office_map_v2.jsonl`
- `data/generated/tx_askted_district_map_v2.jsonl`
- `data/generated/tx_failure_ledger_v2.jsonl`
- `data/generated/tx_procedure_rules_v2.jsonl`
- `data/generated/tx_next_action_queue_v2.jsonl`
- `docs/generated/tx-completion-procedure-and-results-v1.md`

