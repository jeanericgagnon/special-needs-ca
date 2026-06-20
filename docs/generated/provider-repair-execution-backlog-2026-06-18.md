# Provider Repair Execution Backlog

Generated: 2026-06-18T20:48:56.508Z

Compact execution backlog for provider_directory burn-down so the next operator can repair exact provider targets without re-reading the full blocker queue.

## Summary

- total rows: 0
- distinct states: 0
- distinct hosts: 0
- first execution lane: none

## Lane Summary

- pull-now: rows=0; states=0
- author-targets-first: rows=0; states=0

## Top States


## Top Hosts


## First Execution Rows


## Command Cadence

- npm run audit:provider-followup-repair-queue
- npm run audit:provider-repair-execution-backlog
- npm run audit:provider-source-pack
- npm run run:source-acquisition-wave -- --mode=live --lane=ready_target_scrape --gap=providers_care --limit=25
- npm run run:source-acquisition-followups -- --run-id=<run-id>
- npm run run:source-acquisition-parse -- --run-id=<run-id> --family=providers_care
- npm run run:source-acquisition-validate -- --run-id=<run-id> --family=providers_care
- npm run run:source-acquisition-stage -- --run-id=<run-id> --family=providers_care --mode=dry-run
