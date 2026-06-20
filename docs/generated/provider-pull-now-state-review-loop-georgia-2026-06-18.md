# Provider Pull-Now State Review Loop

Generated: 2026-06-18T05:55:35.550Z

State: georgia

## Summary

- state packet unresolved rows: 2
- workfile unresolved rows: 0
- workfile completion percent: 100
- validation issue rows: 0
- merge ready: true

## Artifacts

- state packet: docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-georgia-2026-06-18.json
- decision packet: docs/generated/provider-pull-now-state-decision-packets/provider-pull-now-state-decision-packet-georgia-2026-06-18.json
- workfile status: docs/generated/provider-pull-now-state-workfile-status-georgia-2026-06-18.json
- workfile validation: docs/generated/provider-pull-now-state-workfile-validation-georgia-2026-06-18.json

## Commands

- npm run run:next-provider-pull-now-state-packet
- npm run audit:provider-pull-now-state-workfile-status -- --state=georgia
- npm run fix:provider-pull-now-state-workfile -- --state=georgia
- npm run audit:provider-pull-now-state-workfile-validation -- --state=georgia
- npm run fix:provider-pull-now-state-workfile-decisions -- --state=georgia --apply
- node scripts/apply-provider-pull-now-decisions.mjs --apply
