# Provider Pull-Now State Review Loop

Generated: 2026-06-18T05:52:45.635Z

State: louisiana

## Summary

- state packet unresolved rows: 3
- workfile unresolved rows: 0
- workfile completion percent: 100
- validation issue rows: 0
- merge ready: true

## Artifacts

- state packet: docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-louisiana-2026-06-18.json
- decision packet: docs/generated/provider-pull-now-state-decision-packets/provider-pull-now-state-decision-packet-louisiana-2026-06-18.json
- workfile status: docs/generated/provider-pull-now-state-workfile-status-louisiana-2026-06-18.json
- workfile validation: docs/generated/provider-pull-now-state-workfile-validation-louisiana-2026-06-18.json

## Commands

- npm run run:next-provider-pull-now-state-packet
- npm run audit:provider-pull-now-state-workfile-status -- --state=louisiana
- npm run fix:provider-pull-now-state-workfile -- --state=louisiana
- npm run audit:provider-pull-now-state-workfile-validation -- --state=louisiana
- npm run fix:provider-pull-now-state-workfile-decisions -- --state=louisiana --apply
- node scripts/apply-provider-pull-now-decisions.mjs --apply
