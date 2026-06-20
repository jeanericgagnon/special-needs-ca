# Provider Repair Batch Packet

Generated: 2026-06-18T06:30:45.408Z

- readiness lane: author-targets-first
- state: illinois
- limit: 5
- selection mode: explicit_state_filter
- selected rows: 1

## State Context

- source targets: none
- next move: none
- concrete provider targets: unknown

## Rows

- illinois | manual_review_or_replace | needs_review_unknown | repeats=2 | https://www.ahs.uic.edu/

## Commands

- npm run audit:provider-repair-batch-packet -- --lane=author-targets-first --state=illinois --limit=5
- npm run audit:provider-followup-repair-queue
- npm run audit:provider-repair-execution-backlog
- npm run audit:provider-source-pack
