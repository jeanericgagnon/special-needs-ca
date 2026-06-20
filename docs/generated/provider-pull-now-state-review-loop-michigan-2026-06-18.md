# Provider Pull-Now State Review Loop

Generated: 2026-06-18T05:52:01.372Z

State: michigan

## Summary

- state packet unresolved rows: 4
- workfile unresolved rows: 0
- workfile completion percent: 100
- validation issue rows: 0
- merge ready: true

## Artifacts

- state packet: docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-michigan-2026-06-18.json
- decision packet: docs/generated/provider-pull-now-state-decision-packets/provider-pull-now-state-decision-packet-michigan-2026-06-18.json
- workfile status: docs/generated/provider-pull-now-state-workfile-status-michigan-2026-06-18.json
- workfile validation: docs/generated/provider-pull-now-state-workfile-validation-michigan-2026-06-18.json

## Commands

- npm run run:next-provider-pull-now-state-packet
- npm run audit:provider-pull-now-state-workfile-status -- --state=michigan
- npm run fix:provider-pull-now-state-workfile -- --state=michigan
- npm run audit:provider-pull-now-state-workfile-validation -- --state=michigan
- npm run fix:provider-pull-now-state-workfile-decisions -- --state=michigan --apply
- node scripts/apply-provider-pull-now-decisions.mjs --apply
