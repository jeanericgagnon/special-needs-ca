# Lightweight Source Acquisition Bulk Run

- Date: `2026-06-17`
- Scope: `ready_lightweight`
- Selected URLs: `3432`
- Concurrency: `12`
- Rate limit ms: `300`
- Live run id: `2026-06-17T16-58-43-900Z`
- Live pages dir: `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/pages`
- Dry-run summary: `data/source-acquisition-runs/2026-06-17T16-58-28-389Z/summary.json`
- Dry-run manifest: `data/source-acquisition-runs/2026-06-17T16-58-28-389Z/manifest.json`
- Dry-run CSV: `data/source-acquisition-runs/2026-06-17T16-58-28-389Z/results.csv`
- Dry-run report: `data/source-acquisition-runs/2026-06-17T16-58-28-389Z/report.md`

## What This Run Is For

This bulk run fetches all currently `ready_lightweight` source targets from the generated source acquisition completion plan and saves raw page artifacts to disk for later parsing.

The goal is to keep Codex token usage low by:

- running normal HTTP fetches outside chat context
- saving raw responses to files
- keeping only compact queue metadata and summary artifacts in generated docs

## Parse Inputs

Use these inputs for later extraction/parsing work:

- Queue definition: `docs/generated/source-acquisition-completion-plan-2026-06-17.json`
- Lightweight selection filter: `ledgerStatus === "ready_lightweight"`
- Raw fetched pages: `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/pages`

## File Conventions

Each saved file uses:

`{sequence}-{stateId}-{gapFamily}-{sourceName}.{html|pdf}`

Examples:

- `00020-illinois-nonprofit-support-thearc-org.html`
- `00325-multi-state-advocates-legal-patrick-m-hitchens-esq.html`

## Parsing Notes

- Treat the dry-run manifest as the canonical row-to-URL queue definition.
- Treat the live `pages/` directory as the raw acquisition archive.
- Do not use chat context as the storage layer for the fetched content.
- When building parsers, emit compact summaries and save extracted structured outputs separately.
