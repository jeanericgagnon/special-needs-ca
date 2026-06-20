# Provider Pull-Now State Review Loop

Generated: 2026-06-18T19:42:57.461Z

State: tennessee

## Summary

- state packet unresolved rows: 6
- workfile unresolved rows: 6
- workfile completion percent: 0
- validation issue rows: 0
- merge ready: false

## Artifacts

- state packet: docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-tennessee-2026-06-18.json
- decision packet: docs/generated/provider-pull-now-state-decision-packets/provider-pull-now-state-decision-packet-tennessee-2026-06-18.json
- workfile status: docs/generated/provider-pull-now-state-workfile-status-tennessee-2026-06-18.json
- workfile validation: docs/generated/provider-pull-now-state-workfile-validation-tennessee-2026-06-18.json

## Commands

- npm run run:next-provider-pull-now-state-packet
- npm run audit:provider-pull-now-state-workfile-status -- --state=tennessee
- npm run fix:provider-pull-now-state-workfile -- --state=tennessee
- npm run audit:provider-pull-now-state-workfile-validation -- --state=tennessee
- npm run fix:provider-pull-now-state-workfile-decisions -- --state=tennessee --apply
- node scripts/apply-provider-pull-now-decisions.mjs --apply
