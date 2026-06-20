# Lightweight Source Acquisition System Status

- Date: `2026-06-17`
- Run ID: `2026-06-17T16-58-43-900Z`
- Parse Bucket: `parse-ready-high-signal`
- Parsed Families: `22`
- Parsed Records: `2061`
- Accepted Records: `1881`
- Rejected Records: `180`
- Acceptance Rate: `91.3%`

## System Components Now In Repo

- Acquisition runbook: `docs/source-acquisition-operations.md`
- Standing lessons doc: `docs/source-acquisition-lessons-learned.md`
- Fetch runner: `scripts/run-source-acquisition-wave.mjs`
- Followup bucketing: `scripts/prepare-source-acquisition-followups.mjs`
- Lessons generator: `scripts/generate-source-acquisition-lessons.mjs`
- Lightweight parser library: `scripts/source-acquisition-lightweight-lib.mjs`
- Parse runner: `scripts/run-source-acquisition-parse.mjs`
- Validation runner: `scripts/run-source-acquisition-validate.mjs`
- Parser smoke tests: `scripts/test-source-acquisition-lightweight.mjs`

## Current Artifact Contract

Run-level artifacts:

- `summary.json`
- `manifest.json`
- `results.csv`
- `report.md`
- `pages/`
- `followups/`
- `lessons-learned.md`
- `parsed/`
- `validated/`

Per-family parse artifacts:

- `parsed/<family>/records.ndjson`
- `parsed/<family>/summary.json`
- `parsed/<family>/summary.md`
- `parsed/<family>/schema-errors.json`
- `parsed/<family>/samples.json`

Per-family validation artifacts:

- `validated/<family>/accepted.ndjson`
- `validated/<family>/rejected.ndjson`
- `validated/<family>/rejection-reasons.json`
- `validated/<family>/summary.json`
- `validated/<family>/summary.md`

## Best Current Families

- `nonprofit_support`: `508 / 508` accepted
- `transition_programs`: `10 / 10` accepted
- `waivers`: `6 / 6` accepted
- `early_intervention_programs`: `7 / 7` accepted
- `providers_care`: `103 / 104` accepted

## Main Remaining Lightweight Gaps

- `advocates_legal`
  - `936 / 1074` accepted
  - dominant issue: weak/no basic contact signal on many pages
- `dd_routing`
  - `74 / 87` accepted
  - dominant issue: missing contact signal on some routing pages
- `programs_benefits`
  - `100 / 113` accepted
  - dominant issue: missing action signal
- `general_gap_fill`
  - `62 / 70` accepted
  - dominant issue: missing action signal
- `source_registry`
  - `9 / 13` accepted
  - dominant issue: weak title/basic signal extraction

## Recommended Next Moves

1. Add family-specific refinements for `advocates_legal`.
2. Improve `dd_routing` contact extraction for county/agency templates.
3. Tighten action-signal extraction for `programs_benefits` and `general_gap_fill`.
4. Keep parsers writing structured artifacts before any DB promotion work.
5. Add a staging/import layer only for accepted records.

## Commands

```bash
npm run run:source-acquisition-parse -- --run-id=2026-06-17T16-58-43-900Z
npm run run:source-acquisition-validate -- --run-id=2026-06-17T16-58-43-900Z
npm run test:source-acquisition-lightweight
npm run test:low-token-workflows
npm run audit:low-token-control-plane
```

## Source Universe Checkpoint

- Master source-target ledger missing exact-URL coverage: `0`
- Master ready rows: `1773`
- DB-discovered actionable rows: `3005`
- Authored missing-family rows: `212`
- Combined unique ready rows: `4005`
- Combined lightweight-ready rows: `3456`
- Combined PDF-ready rows: `192`
- Combined JS-heavy rows: `355`
- Remaining source families to author: `5`

## Remaining Source Families To Author

- `advocate_first_party_sources`
  - replace quarantined directory-heavy advocate/legal targets with first-party or official sources
- `forms_exact_urls`
  - add real form-library URLs for Medicaid, education, appeals, and application downloads
  - conservative fallback pack now exists at `data/source_packs/forms_source_pack.json`
- `official_state_domains_repair`
  - replace fake/generated official domains still blocking office, DD, waiver, early intervention, and forms targets
  - repair pack now exists at `data/source_packs/official_state_domain_repairs.json`
- `provider_exact_targets`
  - add more named first-party clinic, therapy, hospital, and diagnostic program targets
- `knowledge_content_sources`
  - add explanatory content sources for rights, waivers, transition, respite, appeals, and condition journeys

## Current Low-Token Read

- The system no longer has a California source-pack gap.
- The system no longer has a competitive-help exact-URL coverage gap in the master ledger.
- The official fake-domain problem is now explicit and measurable: `313` active official repair rows across `43` states. After reconciling the follow-up queue against live `data/source_targets`, only `1` semi-actionable row still remains unresolved today (`Florida` first-party root hint verification); the remaining weak-hint bucket is still exposed truthfully as `35` third-party cross-state hint-only rows plus `276` rows with no candidate yet in `docs/generated/official-state-domain-repair-pack-2026-06-17.md`.
- The semi-actionable official-domain lane is now isolated in a deterministic review queue at `docs/generated/official-domain-followup-queue-2026-06-17.md`, and that queue now reflects only live unresolved rows instead of stale repair-pack history.
- The provider lane now has deterministic follow-up queues instead of mixed readiness signals: the current secondary-discovery queue can regenerate as empty when no directory-only provider targets are in scope, and the placeholder-replacement lane has now been proven end-to-end and cleared for the current in-scope states.
- That provider placeholder queue had a direct authoring handoff in `docs/generated/provider-placeholder-authoring-briefs-2026-06-17.md`, which was then carried through the full decision/apply path for Missouri, Alabama, and Iowa.
- The provider placeholder lane now has the full decision/apply skeleton: a generated decision template at `docs/generated/provider-placeholder-replacement-decision-template-2026-06-17.json`, a filled decision file at `data/provider-placeholder-replacement-decisions.json`, and a dry-run/apply workflow via `npm run fix:provider-placeholder-replacements`. After the applied replacements, `docs/generated/provider-placeholder-replacement-queue-2026-06-17.json` now reports `0` remaining queued placeholder rows in the current provider source-pack scope.
- That provider placeholder workflow is now reconciled all the way through its downstream artifacts as well: regenerated authoring briefs, decision template, and active decision file are all empty when the queue is empty, and the latest dry-run (`docs/generated/provider-placeholder-replacement-run-2026-06-17T20-17-56-633Z.md`) confirms `inputRows: 0` instead of replaying already-applied Alabama, Iowa, and Missouri history.
- The same end-to-end skeleton now exists for the semi-actionable official-domain lane: `docs/generated/official-domain-followup-decision-template-2026-06-17.json` plus `npm run fix:official-domain-followup-decisions` provide a compact review-and-apply path for the remaining live follow-up rows, with North Carolina already resolved and dropped from the regenerated queue.
- The active working decision file at `data/official-domain-followup-decisions.json` is now trimmed to the same single live Florida row, and the latest dry-run (`docs/generated/official-domain-followup-run-2026-06-17T20-16-20-083Z.md`) confirms the lane is waiting only on real review input rather than stale resolved rows.
- North Carolina has already been advanced with `6` applied official-domain repairs, recorded in `docs/generated/official-state-domain-repair-run-2026-06-17T19-39-46-076Z.md`.
- The forms gap is now split truthfully: `40` states still lack a true forms-library URL, `37` now have a conservative state-specific fallback candidate queue, `3` are explicitly marked federal-only fallback states (`nebraska`, `new-hampshire`, `new-mexico`), and there are `0` remaining exact one-click forms-library repairs after New Jersey.
- New Jersey has already been advanced with `1` applied exact forms-library repair, recorded in `docs/generated/forms-library-repair-run-2026-06-17T19-45-20-357Z.md`.
- The forms-library repair dry-run now reports non-repairable states by truthful reason instead of one broad ambiguous bucket: the latest run (`docs/generated/forms-library-repair-run-2026-06-17T20-19-29-738Z.md`) shows `0` eligible exact repairs, with `37` `state_specific_fallback_only` states and `3` `federal_only_fallback` states.
- There is now a fixture-based regression guard for these low-token control lanes: `npm run test:low-token-workflows` verifies that resolved official follow-up rows do not re-queue, trimmed official follow-up decision files yield honest dry-runs, empty provider placeholder queues stay empty all the way through briefs/templates and dry-runs, forms repair reports preserve the fallback reason split, and the forms fallback runner surfaces the correct low-noise warnings for federal-only states and empty filter matches.
- There is now a single generated control-plane checkpoint at `docs/generated/low-token-control-plane-2026-06-17.md`: `npm run audit:low-token-control-plane` re-runs the low-token regression suite, summarizes the official follow-up lane, confirms the provider placeholder lane is idle, and reports the current forms fallback scrape readiness in one compact audit.
- That control-plane checkpoint is now covered by the fixture regression suite too, so `npm run test:low-token-workflows` also verifies the audit’s lane-status derivation and compact summary contract on a mini fixture repo instead of only validating the underlying lane scripts in isolation.
- That control-plane checkpoint is now actionable as well as descriptive: it emits lane-specific blocker codes and next-action text, so the low-token workflow can be driven from a single compact artifact instead of reinterpreting multiple queue and dry-run files by hand.
- That control-plane checkpoint now also includes ready-to-run command suggestions for the live lane state, so the next low-token move is executable directly from the generated audit rather than needing a separate translation step.
- The forms fallback lane in that audit now also surfaces a deterministic first-batch state slice from the live queue, so the initial low-token scrape batch is chosen for us instead of needing a separate batching pass.
- The control-plane checkpoint now also tracks the latest executed forms fallback run, and it currently reflects a clean first-batch dry-run for `alaska` (`3` selected rows, `0` warnings) from `data/source-acquisition-runs/2026-06-17T20-35-27-143Z/forms-fallback-summary.json`.
- That same control-plane checkpoint now advances batch guidance after execution: with `alaska` already exercised, the current generated audit rolls the next suggested state-targeted dry-run forward to `arizona` instead of repeating the same first batch.
- The forms fallback progression is now cumulative across recorded runs rather than latest-run-only: after the `arizona` dry-run, the control-plane audit remembers both exercised states (`alaska`, `arizona`) and advances the next suggested state-targeted batch again to `arkansas`.
- After the `arkansas` dry-run, that cumulative progression is still holding: the current control-plane audit now records three exercised states (`alaska`, `arizona`, `arkansas`) and advances the next suggested state-targeted batch to `colorado`.
- After the `colorado` dry-run, the cumulative progression is still clean and warning-free: the control-plane audit now records four exercised states (`alaska`, `arizona`, `arkansas`, `colorado`) and advances the next suggested state-targeted batch to `connecticut`.
- After the `connecticut` dry-run, the same cumulative progression still holds with zero warnings: the control-plane audit now records five exercised states (`alaska`, `arizona`, `arkansas`, `colorado`, `connecticut`) and advances the next suggested state-targeted batch to `delaware`.
- After the `delaware` dry-run, the cumulative progression is still holding cleanly with zero warnings: the control-plane audit now records six exercised states (`alaska`, `arizona`, `arkansas`, `colorado`, `connecticut`, `delaware`) and advances the next suggested state-targeted batch to `hawaii`.
- After the `hawaii` dry-run, the cumulative progression is still holding cleanly with zero warnings: the control-plane audit now records seven exercised states (`alaska`, `arizona`, `arkansas`, `colorado`, `connecticut`, `delaware`, `hawaii`) and advances the next suggested state-targeted batch to `idaho`.
- After the `idaho` dry-run, the cumulative progression is still holding cleanly with zero warnings: the control-plane audit now records eight exercised states (`alaska`, `arizona`, `arkansas`, `colorado`, `connecticut`, `delaware`, `hawaii`, `idaho`) and advances the next suggested state-targeted batch to `indiana`.
- The remaining work is no longer about broad scrape plumbing; it is about authoring the last missing source families and then running the existing lightweight pipeline over them.
