# Provider Repair Batch Packet

Generated: 2026-06-18T06:11:25.682Z

- readiness lane: author-targets-first
- state: pennsylvania
- limit: 5
- selection mode: explicit_state_filter
- selected rows: 1

## State Context

- source targets: none
- next move: none
- concrete provider targets: unknown

## Rows

- pennsylvania | replace_exact_url | stale_or_invalid_404 | repeats=3 | https://www.chp.edu/our-services/developmental-pediatrics

## Commands

- npm run audit:provider-repair-batch-packet -- --lane=author-targets-first --state=pennsylvania --limit=5
- npm run audit:provider-followup-repair-queue
- npm run audit:provider-repair-execution-backlog
- npm run audit:provider-source-pack
