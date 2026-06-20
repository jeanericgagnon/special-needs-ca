# Provider Pull-Now State Review Loop

Generated: 2026-06-18T05:54:48.476Z

State: new-york

## Summary

- state packet unresolved rows: 3
- workfile unresolved rows: 0
- workfile completion percent: 100
- validation issue rows: 0
- merge ready: true

## Artifacts

- state packet: docs/generated/provider-pull-now-state-packets/provider-pull-now-state-packet-new-york-2026-06-18.json
- decision packet: docs/generated/provider-pull-now-state-decision-packets/provider-pull-now-state-decision-packet-new-york-2026-06-18.json
- workfile status: docs/generated/provider-pull-now-state-workfile-status-new-york-2026-06-18.json
- workfile validation: docs/generated/provider-pull-now-state-workfile-validation-new-york-2026-06-18.json

## Commands

- npm run run:next-provider-pull-now-state-packet
- npm run audit:provider-pull-now-state-workfile-status -- --state=new-york
- npm run fix:provider-pull-now-state-workfile -- --state=new-york
- npm run audit:provider-pull-now-state-workfile-validation -- --state=new-york
- npm run fix:provider-pull-now-state-workfile-decisions -- --state=new-york --apply
- node scripts/apply-provider-pull-now-decisions.mjs --apply
