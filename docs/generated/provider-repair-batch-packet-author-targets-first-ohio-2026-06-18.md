# Provider Repair Batch Packet

Generated: 2026-06-18T06:18:37.709Z

- readiness lane: author-targets-first
- state: ohio
- limit: 5
- selection mode: explicit_state_filter
- selected rows: 1

## State Context

- source targets: none
- next move: none
- concrete provider targets: unknown

## Rows

- ohio | replace_exact_url | stale_or_invalid_404 | repeats=4 | https://www.nationwidechildrens.org/specialties/autism-center

## Commands

- npm run audit:provider-repair-batch-packet -- --lane=author-targets-first --state=ohio --limit=5
- npm run audit:provider-followup-repair-queue
- npm run audit:provider-repair-execution-backlog
- npm run audit:provider-source-pack
