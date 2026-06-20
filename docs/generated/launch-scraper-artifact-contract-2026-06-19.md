# Launch Scraper Artifact Contract

Generated: 2026-06-19T23:21:10.567Z

Machine-readable contract for source-acquisition run artifacts, required files, manifest/summary fields, and resume-safe downstream behavior.

## Sample Run

- runId: `2026-06-19T02-33-19-909Z`
- runDir: `data/source-acquisition-runs/2026-06-19T02-33-19-909Z`

## Run Directory Layout

- required top-level:
  - manifest.json
  - summary.json
  - results.csv
  - report.md
  - pages/
- optional downstream roots:
  - followups/
  - parsed/
  - validated/
  - staged/

## Fetch Stage

- manifest required fields: generatedAt, runId, mode, filters, runtime, selectionGuards, selectedCount, rows, results
- manifest row fields: stateId, targetTable, gapFamily, sourceQueue, sourceUrl, finalUrl, status, ok, contentType, savedPath, attempt, error, errorCode, errorDetail
- summary required fields: generatedAt, runId, mode, selectedCount, succeeded, failed, concurrency, rateLimitMs, summaryPath, manifestPath, resultsCsvPath, reportPath, pagesDir

## Followup Stage

- required files: followups/parse-ready.json, followups/parse-ready.csv, followups/parse-ready-high-signal.json, followups/parse-ready-high-signal.csv, followups/parse-ready-suspect.json, followups/parse-ready-suspect.csv, followups/retryable-failures.json, followups/retryable-failures.csv, followups/blocked-failures.json, followups/blocked-failures.csv, followups/source-repair.json, followups/source-repair.csv, followups/followup-summary.json, followups/followup-summary.md
- summary required fields: runId, selectedCount, resultCount, parseReadyCount, parseReadyHighSignalCount, parseReadySuspectCount, retryableCount, blockedCount, sourceRepairCount, artifacts

## Parsed Stage

- required per-family files: records.ndjson, summary.json, summary.md, schema-errors.json, samples.json
- required index file: parsed/index-summary.json

## Validated Stage

- required per-family files: accepted.ndjson, rejected.ndjson, rejection-reasons.json, summary.json, summary.md
- required index file: validated/index-summary.json

## Staged Stage

- required per-family files: promotion-candidates.ndjson, unsupported-candidates.ndjson, promotion-summary.json, promotion-summary.md
- required index files: staged/index-summary.json, staged/index-summary.md

## Resume Safety Contract

- guarantees:
  - Every stage writes its artifacts inside a single runId directory.
  - Downstream stages discover the latest runId by disk or accept an explicit --run-id.
  - Parse waits for followup-selected inputs to exist before proceeding.
  - Validate waits for parsed root or family records to exist before proceeding.
  - Stage waits for validated root or accepted records to exist before proceeding.
  - Dry-run staging still writes summary artifacts even when accepted input is empty.
- operator rules:
  - Never overwrite another run directory; a new fetch wave must create a new runId.
  - A run is safe to stop after fetch because manifest/results/pages remain on disk.
  - A run is safe to stop after followups because parse-ready and failure buckets remain on disk.
  - A downstream rerun should use --run-id when operator intent is to continue a specific run.
  - Family-specific reruns are safe because parsed, validated, and staged outputs are namespaced by family.
- known limitations:
  - There is no single fetch resume command that appends into an existing runId; resume means continue downstream from saved artifacts or start a new fetch run.
  - Program waitlists require conservative program_id inference during staging apply, so unmatched rows stay unstaged instead of being guessed.

