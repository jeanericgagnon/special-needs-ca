# Source Acquisition Operations

This document defines the repeatable low-token workflow for source acquisition runs.

## Goal

Run large discovery and fetch waves outside chat context, save raw artifacts to disk, and let Codex review only compact summaries, failures, and validation outputs.

## Operating Principle

Use this pipeline:

`author missing families -> discover exact targets -> fetch -> followups -> parse -> validate -> stage -> county-inference -> provider-geocode -> audit`

Keep two bounded lanes and do not blur them:

- `Lane A: ready-target scraping`
- `Lane B: source-family authoring`

Rules:

- Save raw fetched content to files, not chat.
- Save compact run metadata for each wave.
- Run live external fetch waves with network-enabled execution; when `CODEX_SANDBOX_NETWORK_DISABLED=1`, treat DNS failures as environment-blocked until retried unsandboxed.
- Keep parser outputs separate from raw fetches.
- Keep validation outputs separate from parser outputs.
- Promote only validated structured outputs.
- Infer counties only from explicit county evidence already present in the row.
- Record lessons learned after every significant run.
- Do not use the fetch worker for exploratory discovery.
- Author blocked families into JSON target packs first, then let those targets join the queue.

## Priority Policy

Do not consume the queue by raw row count alone. Use this broad gap-closure order:

1. `providers_care`
2. `forms_guides`
3. `advocates_legal`
4. `housing`
5. `goods_supplies`
6. `jobs_vocational`
7. `care_independent_living`
8. `legal_aid`
9. `knowledge_content`
10. remaining routing/program families

Execution split per cycle:

- first `30%`: source-family unlock work
- next `50%`: lightweight ready fetches from providers, forms, and competitive-help families
- next `15%`: advocates/legal
- final `5%`: nonprofit overflow and remaining low-priority families

## Hybrid Wave Model

Run repeating waves in this order:

1. `Wave 0: source-family unlock`
2. `Wave 1: lightweight ready fetch`
3. `Wave 2: parse and validate`
4. `Wave 3: stage and promote only if public-safe`
5. `Wave 4: lessons learned and queue refresh`

## Track A Finish Loop

When finishing the remaining information-side blockers, use one family-first loop and do not improvise around it:

1. regenerate source-family artifacts
2. author one missing family pack
3. add exact targets to source packs and source targets
4. regenerate the completion plan
5. run a bounded fetch wave only for that family
6. run parse, validate, and stage for that family
7. regenerate max-info, full-gap, and completion-plan artifacts
8. choose the next family from the refreshed blocker list

Fixed family closure order:

1. `official_state_domains_repair`
2. `forms_exact_urls`
3. `provider_exact_targets`
4. `advocate_first_party_sources`
5. `knowledge_content_sources`

Required cadence after every family cycle:

```bash
npm run audit:authored-missing-source-targets
npm run audit:source-acquisition-completion-plan
npm run audit:max-info-program
npm run audit:track-a-finish-loop
```

## Required Artifact Contract

Each source acquisition run should create:

- `summary.json`
- `manifest.json`
- `results.csv`
- `report.md`
- `pages/`

Each run should then create a `followups/` folder with:

- `parse-ready.json`
- `parse-ready.csv`
- `parse-ready-high-signal.json`
- `parse-ready-high-signal.csv`
- `parse-ready-suspect.json`
- `parse-ready-suspect.csv`
- `retryable-failures.json`
- `retryable-failures.csv`
- `blocked-failures.json`
- `blocked-failures.csv`
- `source-repair.json`
- `source-repair.csv`
- `followup-summary.json`
- `followup-summary.md`

Each run should also create a lessons artifact:

- `lessons-learned.md`

## Recommended Downstream Artifact Contract

For each parse wave, create:

- `parsed/<family-or-parser-id>/records.ndjson`
- `parsed/<family-or-parser-id>/summary.json`
- `parsed/<family-or-parser-id>/summary.md`
- `parsed/<family-or-parser-id>/schema-errors.json`
- `parsed/<family-or-parser-id>/samples.json`

For each validation wave, create:

- `validated/<family-or-parser-id>/accepted.ndjson`
- `validated/<family-or-parser-id>/rejected.ndjson`
- `validated/<family-or-parser-id>/rejection-reasons.json`
- `validated/<family-or-parser-id>/summary.json`
- `validated/<family-or-parser-id>/summary.md`

For each staging/import wave, create:

- `staged/<family-or-parser-id>/promotion-candidates.ndjson`
- `staged/<family-or-parser-id>/promotion-summary.json`
- `staged/<family-or-parser-id>/promotion-summary.md`

For each county inference wave, create:

- `county-inference/<staging-table>-decisions.json`
- `county-inference/<staging-table>-summary.json`
- `county-inference/index-summary.json`
- `county-inference/index-summary.md`

For each provider geocode wave, create:

- `provider-county-geocode/provider-address-batch.csv`
- `provider-county-geocode/summary.json`
- `provider-county-geocode/summary.md`
- `provider-county-geocode/updates.json`
- `provider-county-geocode/skipped.json`
- `provider-county-geocode/missing-address.json`

## Command Sequence

1. Generate the acquisition queue

```bash
npm run audit:source-acquisition-completion-plan
```

2. Dry-run the intended fetch wave

```bash
npm run run:source-acquisition-wave -- --mode=dry-run --status=ready_lightweight --lane=ready_target_scrape --concurrency=12
```

3. Run the live fetch wave

```bash
npm run run:source-acquisition-wave -- --mode=live --status=ready_lightweight --lane=ready_target_scrape --concurrency=12 --rate-limit-ms=300
```

4. Generate followup queues

```bash
npm run run:source-acquisition-followups -- --run-id=<run-id>
```

5. Generate lessons learned

```bash
npm run audit:source-acquisition-lessons -- --run-id=<run-id>
```

6. Parse only `parse-ready-high-signal`

```bash
npm run run:source-acquisition-parse -- --run-id=<run-id>
```

7. Validate parsed outputs before staging

```bash
npm run run:source-acquisition-validate -- --run-id=<run-id>
```

8. Stage accepted records into staging artifacts or SQLite staging tables

```bash
npm run run:source-acquisition-stage -- --run-id=<run-id> --mode=dry-run
npm run run:source-acquisition-stage -- --run-id=<run-id> --mode=apply
```

9. Infer explicit county coverage for state-scoped staging rows

```bash
npm run run:source-acquisition-county-inference -- --run-id=<run-id> --mode=dry-run
npm run run:source-acquisition-county-inference -- --run-id=<run-id> --mode=apply
```

10. Geocode provider addresses when local county evidence is missing

```bash
npm run run:source-acquisition-provider-county-geocode -- --run-id=<run-id> --mode=dry-run
npm run run:source-acquisition-provider-county-geocode -- --run-id=<run-id> --mode=live
```

11. Audit staging rows for production promotability

```bash
npm run run:source-acquisition-promote -- --run-id=<run-id> --mode=dry-run
npm run run:source-acquisition-promote -- --run-id=<run-id> --mode=apply
```

12. Run audits after staging/promotions

Track A audit refresh after every family cycle:

```bash
npm run audit:full-information-gap
npm run audit:exhaustive-gap-master
npm run audit:max-info-program
```

## Run Modes

Use `ready_lightweight` for:

- normal HTML pages
- simple PDFs
- first-party pages that do not require form interaction

Use a separate queue for:

- JS-heavy sites
- login-gated sites
- affiliate/network pages requiring special parser logic
- aggregator or suspect pages

Use `source_family_authoring` for:

- official state domain repair packs
- forms exact-library packs
- provider exact-target packs
- advocate/legal first-party packs
- knowledge-content source packs
- competitive-help source packs

## Failure Taxonomy

Use these buckets consistently:

- `parse_ready_high_signal`
- `parse_ready_suspect`
- `retryable`
- `blocked`
- `source_repair`

Interpretation:

- `parse_ready_high_signal`: safe to hand to deterministic parsers
- `parse_ready_suspect`: artifact exists, but domain/type/redirect needs caution
- `retryable`: network/server issue, rerun later
- `blocked`: anti-bot, auth, or special access issue
- `source_repair`: stale URL or bad source target needing correction

## Lessons Learned Expectations

Every run should answer:

- What volume was attempted?
- What succeeded?
- What failed?
- Which domains were highest-signal?
- Which domains were suspect or blocked?
- What should change before the next wave?
- Which parser queues are safe to run now?

## Low-Token Rules

- Never paste full raw scrape output into chat.
- Never inspect thousands of records manually in Codex.
- Print only compact counts, failure reasons, and small samples.
- Persist operational memory in docs and JSON/CSV artifacts.
- Treat the generated completion plan and missing-family artifacts as the control plane, not chat memory.

## Family-Specific Parse and Validation Expectations

Required deterministic parser families:

- `providers_care`
- `forms_guides`
- `advocates_legal`
- `housing`
- `goods_supplies`
- `jobs_vocational`
- `care_independent_living`
- `legal_aid`
- `knowledge_content`

Minimum validation rules:

- `providers_care`: first-party or official source, named clinic/program, and contact or location signal
- `forms_guides`: official source only, with exact form download URL or approved official library root
- `advocates_legal`: first-party or official source, clear specialty/help type, and no synthetic county cloning
- `housing/goods/jobs/care/legal`: actionable service evidence required; taxonomy-only pages stay staged or rejected
- `knowledge_content`: structured extraction from official or high-trust mission-aligned sources only; never promote into local directory tables

## Bounded Forms Fallback Lane

The forms fallback lane is stricter than the general source-acquisition wave.

Rules:

- Require `--state=<state>` on every run.
- Process only queued rows from that state.
- Cap every run at `5` rows.
- Process one row at a time.
- Write record output immediately after each row.
- Update resumable progress from disk after each row.
- Save failed rows as completed outcomes when they exhaust the URL budget.
- Never recurse, crawl a sitemap, or broaden beyond the selected queue rows.

URL budget per row:

- `1` target URL
- `1` supporting page
- `1` final verification page

If no valid public-safe source is confirmed within that budget, the required outcome is:

- `needs_manual_review`

Recommended commands:

```bash
npm run audit:forms-fallback-queue
npm run run:forms-fallback-source-acquisition -- --mode=dry-run --state=indiana --limit=5
npm run run:forms-fallback-source-acquisition -- --mode=live --state=indiana --limit=5 --run-id=<run-id>
```

Artifacts written by the bounded runner:

- `forms-fallback-manifest.json`
- `forms-fallback-progress.json`
- `forms-fallback-results.ndjson`
- `forms-fallback-results.json`
- `forms-fallback-summary.json`
- `forms-fallback-report.md`
- `forms-fallback-pages/`
- `data/source-acquisition-state/forms-fallback-completion-ledger.json`
- Reuse the same commands and artifact contract every run.

When a state finishes the bounded scrape lane with `needs_manual_review`, switch to the manual-review decision lane instead of re-scraping:

```bash
npm run audit:forms-fallback-manual-review-queue
npm run audit:forms-fallback-manual-review-decision-template
npm run fix:forms-fallback-manual-review-decisions -- --input=data/forms-fallback-manual-review-decisions.json --state=indiana
npm run fix:forms-fallback-manual-review-decisions -- --input=data/forms-fallback-manual-review-decisions.json --state=indiana --apply
```

Artifacts written by the manual-review lane:

- `docs/generated/forms-fallback-manual-review-decision-template-YYYY-MM-DD.json`
- `docs/generated/forms-fallback-manual-review-run-<timestamp>.json`
- `docs/generated/forms-fallback-manual-review-run-<timestamp>.md`
- `data/forms-fallback-manual-review-decisions.json`
- `data/source-acquisition-state/forms-fallback-manual-review-ledger.json`
- `data/source_packs/forms_fallback_manual_resolutions.json`
