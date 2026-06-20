# Provider Pull-Now Runbook

Generated: 2026-06-18T18:10:59.890Z

Compact operator runbook for the provider_directory pull-now repair lane so the next cycle can start without re-reading full provider artifacts.

## Summary

- pull-now rows: 0
- pull-now states: 0
- first action class: none

## Preflight

- Run npm run audit:provider-followup-repair-queue
- Run npm run audit:provider-repair-execution-backlog
- Run npm run audit:provider-pull-now-runbook
- Do not expand beyond pull-now rows in this cycle.

## Action Slices


## State Slices

