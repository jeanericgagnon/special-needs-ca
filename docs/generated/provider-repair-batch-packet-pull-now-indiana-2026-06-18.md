# Provider Repair Batch Packet

Generated: 2026-06-18T06:33:04.495Z

- readiness lane: pull-now
- state: indiana
- limit: 5
- selection mode: explicit_state_filter
- selected rows: 0

## State Context

- source targets: data/source_targets/indiana.json
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.
- concrete provider targets: 3

## Rows


## Commands

- npm run audit:provider-repair-batch-packet -- --lane=pull-now --state=indiana --limit=5
- npm run audit:provider-followup-repair-queue
- npm run audit:provider-repair-execution-backlog
- npm run audit:provider-source-pack
