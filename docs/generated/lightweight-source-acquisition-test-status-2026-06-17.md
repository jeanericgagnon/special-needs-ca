# Lightweight Source Acquisition Test Status

- Date: `2026-06-17`
- Run ID Used For Command Checks: `2026-06-17T16-58-43-900Z`

## What Was Tested

### Static script validation

- `node --check scripts/source-acquisition-lightweight-lib.mjs`
- `node --check scripts/run-source-acquisition-parse.mjs`
- `node --check scripts/run-source-acquisition-validate.mjs`
- `node --check scripts/generate-source-acquisition-lessons.mjs`

Result:

- Passed

### Fixture-style parser and validator tests

- `npm run test:source-acquisition-lightweight`

Covered cases:

- The Arc chapter extraction
- DD routing extraction
- generic nonprofit fallback extraction
- program/action extraction
- expected rejection for low-signal generic pages
- expected rejection for DD routing pages with no contact signal
- phone normalization and email deduping
- provider multiline, suite-line, and map-derived address extraction
- advocate acceptance for special-education pages with single-state inference
- advocate rejection for hijacked/irrelevant pages
- advocate multi-state preservation when multiple states are explicit
- advocate state inference guardrail so common words like `or` and `in` do not become false state-code matches

Result:

- Passed

### Advocate hardening rerun

- `node scripts/run-source-acquisition-parse.mjs --run-id=2026-06-17T16-58-43-900Z --family=advocates_legal`
- `node scripts/run-source-acquisition-validate.mjs --run-id=2026-06-17T16-58-43-900Z --family=advocates_legal`
- `node scripts/run-source-acquisition-stage.mjs --run-id=2026-06-17T16-58-43-900Z --family=advocates_legal --mode=apply`

Result:

- Passed

Advocate rerun outcome:

- parsed: `1074`
- accepted: `430`
- rejected: `644`
- main rejection reasons:
  - `missing_advocate_relevance_signal`: `619`
  - `missing_advocate_contact_signal`: `130`
  - `bad_advocate_topic_signal`: `101`
- accepted advocate rows with concrete single-state scope: `192`
- accepted advocate rows still left as `multi-state`: `238`

### Command-level parse checks

- `npm run run:source-acquisition-parse -- --run-id=2026-06-17T16-58-43-900Z --family=nonprofit_support --limit=25`
- `npm run run:source-acquisition-parse -- --run-id=2026-06-17T16-58-43-900Z --family=nonprofit_support`
- `npm run run:source-acquisition-parse -- --run-id=2026-06-17T16-58-43-900Z --family=dd_routing`
- `npm run run:source-acquisition-parse -- --run-id=2026-06-17T16-58-43-900Z`

Result:

- Passed

### Command-level validation checks

- `npm run run:source-acquisition-validate -- --run-id=2026-06-17T16-58-43-900Z --family=nonprofit_support`
- `npm run run:source-acquisition-validate -- --run-id=2026-06-17T16-58-43-900Z --family=dd_routing`
- `npm run run:source-acquisition-validate -- --run-id=2026-06-17T16-58-43-900Z`

Result:

- Passed

### Staging layer checks

- `node src/db/create_staging_tables.js`
- `npm run test:source-acquisition-stage`
- `npm run run:source-acquisition-stage -- --run-id=2026-06-17T16-58-43-900Z --mode=dry-run`
- `npm run run:source-acquisition-stage -- --run-id=2026-06-17T16-58-43-900Z --mode=apply`

Result:

- Passed

### Promotion audit layer checks

- `npm run test:source-acquisition-county-inference`
- `npm run run:source-acquisition-county-inference -- --run-id=2026-06-17T16-58-43-900Z --mode=dry-run`
- `npm run run:source-acquisition-county-inference -- --run-id=2026-06-17T16-58-43-900Z --mode=apply`
- `npm run test:source-acquisition-provider-geocode`
- `npm run run:source-acquisition-provider-county-geocode -- --run-id=2026-06-17T16-58-43-900Z --mode=dry-run`
- `npm run run:source-acquisition-provider-county-geocode -- --run-id=2026-06-17T16-58-43-900Z --mode=live`
- `npm run test:source-acquisition-promote`
- `npm run run:source-acquisition-promote -- --run-id=2026-06-17T16-58-43-900Z --mode=dry-run`
- `npm run run:source-acquisition-promote -- --run-id=2026-06-17T16-58-43-900Z --mode=apply`

Result:

- Passed

## Full-Run Outcome Snapshot

- Parsed records: `2061`
- Accepted records: `1881`
- Rejected records: `180`
- Acceptance rate: `91.3%`

Notable family outcomes:

- `nonprofit_support`: `508 / 508` accepted
- `dd_routing`: `74 / 87` accepted
- `programs_benefits`: `100 / 113` accepted
- `advocates_legal`: `936 / 1074` accepted

## Artifacts Verified

- Parse summaries under `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/parsed/`
- Validation summaries under `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/validated/`
- System status doc:
  - `docs/generated/lightweight-source-acquisition-system-status-2026-06-17.md`

## What Is Still Not Tested

- Only a small safe auto-promotion slice is currently proven: `2` nonprofit rows after county inference and generic-name guardrails.
- No provider or advocate auto-promotion path is proven yet for the lightweight slice.
- Provider locality improved substantially, but still remains incomplete:
  - live Census batch geocoding updated `33` provider staging rows
  - provider address readiness improved from `9` to `45`
  - `35` provider rows still have no extracted address
  - `1` provider row still has malformed address formatting
  - only `5` provider rows currently clear promotion rules after geocode and generic-name filtering
- No multi-run regression suite compares results across historical acquisition runs.
- No family-specific fixture suite yet for every major family, especially:
- `advocates_legal`
- `providers_care`
- `source_registry`
- `general_gap_fill`
- county inference for advocate rows is still missing, so advocate promotion remains intentionally blocked even after state-scope cleanup
- No browser/JS-heavy parsing tests are part of this lightweight test set.

## Current Conclusion

The lightweight system is tested enough to say:

- the parser/validator code executes correctly
- the fixture-backed core branches behave as expected
- the command-level pipeline runs successfully on the real archived high-signal wave
- the resulting artifacts are reproducible and usable
- the county inference pass safely reduces manual review without relying on chat-scale inspection
- the promotion guardrails correctly keep slogan/generic headings from leaking into production
- the provider geocode path is now proven end-to-end, including live Census enrichment and stable preservation across restaging

The next testing tier should begin when staging/import exists or when we add deeper family-specific extractor rules.
