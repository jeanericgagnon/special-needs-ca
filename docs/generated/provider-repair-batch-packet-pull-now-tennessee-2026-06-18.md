# Provider Repair Batch Packet

Generated: 2026-06-18T06:25:26.138Z

- readiness lane: pull-now
- state: tennessee
- limit: 5
- selection mode: explicit_state_filter
- selected rows: 3

## State Context

- source targets: data/source_targets/tennessee.json
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.
- concrete provider targets: 6

## Rows

- tennessee | author_alternate_first_party_target | access_blocked_403 | repeats=12 | https://www.dollychildrens.org/
- tennessee | author_alternate_first_party_target | access_blocked_403 | repeats=2 | https://www.dollychildrens.org/about-us/our-locations/dolly-parton-childrens-hospital-main-campus
- tennessee | author_alternate_first_party_target | access_blocked_403 | repeats=2 | https://www.dollychildrens.org/medical-services/specialty-clinics

## Commands

- npm run audit:provider-repair-batch-packet -- --lane=pull-now --state=tennessee --limit=5
- npm run audit:provider-followup-repair-queue
- npm run audit:provider-repair-execution-backlog
- npm run audit:provider-source-pack
