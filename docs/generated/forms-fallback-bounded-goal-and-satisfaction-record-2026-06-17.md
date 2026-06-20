# Forms Fallback Bounded Goal And Satisfaction Record

Generated: 2026-06-17

## Goal

Advance the forms fallback acquisition lane using a strictly bounded low-token workflow:

- one state per run
- at most five queued rows per run
- at most three URLs per row
- immediate per-row persistence
- resumable disk state
- no cross-state expansion
- compact artifact-first reporting

The objective is deterministic completion of queued forms fallback rows, not maximum discovery.

## Scope Lock

Allowed:

- forms fallback lane only
- queue-selected rows only
- one state per run via `--state=<state>`
- dry-run or live execution within the bounded runner
- compact summaries and saved artifacts

Not allowed:

- statewide audits beyond existing generated queue artifacts
- national audits
- recursive crawling
- domain-wide search
- sitemap traversal
- revisiting previously completed states
- cross-state batching
- large raw output in chat

## Execution Contract

For each queued record:

1. Load a single queue row.
2. Attempt to validate or acquire the source.
3. Write decision and output immediately.
4. Mark the row complete in run progress.
5. Update the completion ledger.
6. Move to the next row.

No batching in memory beyond the selected rows for the current state-bound run.

## Token Control

- `MAX_RECORDS_PER_RUN=5`
- `MAX_URLS_PER_RECORD=3`

Allowed URL budget per row:

1. target URL
2. one supporting page
3. one final verification page

If no valid public-safe source is found within budget:

- `OUTCOME=needs_manual_review`

Do not continue searching.

## Persistence Contract

Each run must:

- be resumable from disk
- write results immediately after each completed row
- be safe to terminate at any time

Primary artifacts:

- `data/source-acquisition-runs/<run-id>/forms-fallback-manifest.json`
- `data/source-acquisition-runs/<run-id>/forms-fallback-progress.json`
- `data/source-acquisition-runs/<run-id>/forms-fallback-results.ndjson`
- `data/source-acquisition-runs/<run-id>/forms-fallback-results.json`
- `data/source-acquisition-runs/<run-id>/forms-fallback-summary.json`
- `data/source-acquisition-runs/<run-id>/forms-fallback-report.md`
- `data/source-acquisition-state/forms-fallback-completion-ledger.json`

## Satisfaction Record

This goal is satisfied only when all of the following remain true:

- Every run requires `--state=<state>`.
- Every run stays inside one state.
- No run selects more than five rows.
- No row consumes more than three URLs.
- No recursive crawling or domain expansion occurs.
- Previously completed state rows are not revisited.
- Each completed row is persisted immediately.
- Each run can resume from disk without reprocessing completed rows.
- If the URL budget is exhausted, the row ends as `needs_manual_review`.
- Chat responses stay compact and artifact-first.
- The control-plane audit reflects the bounded workflow truthfully.

## Operator Prompt

Use this prompt to continue:

```text
Continue the forms fallback acquisition lane in strict low-token mode.

Primary objective:
Deterministically complete queued forms fallback rows with minimal context growth and immediate persistence. Do not optimize for broad discovery. Optimize for bounded completion.

Hard rules:
- Work only in the forms fallback lane.
- Do not branch into other audits or other data families.
- Do not revisit previously completed states.
- Do not run statewide audits beyond the existing generated queue/audit artifacts already in repo.
- Do not run national audits.
- Do not broaden beyond rows explicitly selected from the queue.
- Do not recursively crawl.
- Do not search domains widely.
- Do not inspect large outputs manually in chat.
- Keep all outputs compact in chat and save artifacts to disk.

Execution contract:
- Require `--state=<state>` on every run.
- Process only one state per run.
- Max 5 records per run.
- Max 3 URLs per record.
- Allowed URL budget per record:
  1. target URL
  2. one supporting page
  3. one final verification page
- If no valid source is found within budget, set outcome to `needs_manual_review`.
- Persist after every completed row.
- Every run must be resumable from disk.
- Every run must be safe to terminate at any time.

Workflow:
1. Read the current control-plane artifact.
2. Identify the next untouched state from the forms fallback lane.
3. Run exactly one bounded dry-run for that state.
4. Regenerate the control-plane audit.
5. Report only compact counts, warnings, artifact paths, and the next suggested state.
6. Do not include raw page content.
7. Do not inspect unrelated files unless needed to keep this lane working.

If anything violates the bounded contract, stop and fix the workflow before continuing.
```

## Thread Goal Note

I attempted to set this as the active Codex thread goal, but the thread already has an unfinished paused goal, so the app-level goal could not be replaced automatically.
