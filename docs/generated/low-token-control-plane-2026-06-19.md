# Low-Token Control Plane Audit

Generated: 2026-06-19T02:39:14.115Z

## Regression Guard

- status: pass
- exit code: 0
- stdout: low token workflow regression tests passed

## Official Follow-Up Lane

- status: idle_or_cleared
- pending queue rows: 0
- pending states: none
- active decision rows: 187
- blocker: no_live_official_followup_rows
- next action: No official-domain follow-up review is pending.
- queue artifact: docs/generated/official-domain-followup-queue-2026-06-19.json
- decision file: data/official-domain-followup-decisions.json

## Provider Pull-Now Lane

- status: idle_or_cleared
- pending queue rows: 0
- pending decision rows: 0
- execution backlog rows: 0
- runbook pull-now rows: 0
- runbook pull-now states: 0
- decision template rows: 0
- manual-fill queue rows: 0
- decision progress completion: 0
- review packet states: 0
- state packets: 0
- active decision rows: 0
- resolution ledger rows: 20
- next state: none
- first action class: none
- blocker: none
- next action: Provider pull-now lane is clear; no action needed.
- queue artifact: docs/generated/provider-followup-repair-queue-2026-06-19.json
- execution backlog: docs/generated/provider-repair-execution-backlog-2026-06-19.json
- runbook: docs/generated/provider-pull-now-runbook-2026-06-19.json
- decision template: docs/generated/provider-pull-now-decision-template-2026-06-19.json
- manual-fill queue: docs/generated/provider-pull-now-manual-fill-queue-2026-06-19.json
- decision progress: docs/generated/provider-pull-now-decision-progress-2026-06-19.json
- review packet: docs/generated/provider-pull-now-review-packet-2026-06-19.json
- state packets index: docs/generated/provider-pull-now-state-packets-2026-06-19.json
- first state packet: none
- first state decision packet: docs/generated/provider-pull-now-state-decision-packets/provider-pull-now-state-decision-packet--2026-06-19.json
- first state workfile: data/provider-pull-now-state-workfiles/provider-pull-now-state-workfile-.json
- first state workfile status: docs/generated/provider-pull-now-state-workfile-status--2026-06-19.json
- first state review loop: docs/generated/provider-pull-now-state-review-loop--2026-06-19.json
- active decision file: data/provider-pull-now-decisions.json
- resolution ledger: data/source-acquisition-state/provider-pull-now-resolution-ledger.json

## Provider Repair Backlog Lane

- status: idle_or_cleared
- pending queue rows: 0
- execution backlog rows: 0
- first execution lane: none
- next state: none
- first action class: none
- readiness lane: none
- blocker: none
- next action: Provider repair backlog is clear; no exact provider repair work is queued.
- queue artifact: docs/generated/provider-followup-repair-queue-2026-06-19.json
- execution backlog: docs/generated/provider-repair-execution-backlog-2026-06-19.json

## Forms Fallback Lane

- status: idle_or_cleared
- queue rows: 116
- excluded federal-only states: nebraska, new-hampshire, new-mexico
- exact repair rows: 0
- non-repairable rows: 37
- latest fallback run: 2026-06-19T00-11-20-678Z
- latest fallback selected rows: 1
- latest fallback warnings: 0
- manual review queue rows: 0
- manual review decision template rows: 0
- active manual review decision rows: 139
- manual review resolution ledger rows: 139
- state ledger total states: 34
- blocker: federal_only_forms_states_remaining
- next action: No state-specific forms fallback rows remain; only federal-only fallback states still need better first-party discovery.
- first batch states: arizona, colorado, connecticut, delaware, hawaii
- exercised batch states: alaska, arizona, arkansas, colorado, connecticut, delaware, hawaii, idaho, indiana, iowa, kansas, kentucky, louisiana, maine, maryland, massachusetts, michigan, minnesota, mississippi, missouri, montana, nevada, north-carolina, north-dakota, oklahoma, oregon, rhode-island, south-carolina, south-dakota, tennessee, utah, vermont, virginia, washington, west-virginia, wisconsin, wyoming
- previewed-only states: none
- pending preview states: none
- next batch states: none
- next state: none
- next mode: none
- exact next command: none
- command: npm run audit:forms-source-pack
- state_specific_form_fallback_only: 34
- federal_only_form_fallback: 3
- state ledger completed: 34
- fallback queue artifact: docs/generated/forms-fallback-scrape-queue-2026-06-19.json
- completion ledger: data/source-acquisition-state/forms-fallback-completion-ledger.json
- manual review queue: docs/generated/forms-fallback-manual-review-queue-2026-06-19.json
- manual review decision template: docs/generated/forms-fallback-manual-review-decision-template-2026-06-19.json
- active manual review decision file: data/forms-fallback-manual-review-decisions.json
- manual review resolution ledger: data/source-acquisition-state/forms-fallback-manual-review-ledger.json
- state ledger: docs/generated/forms-fallback-state-ledger-2026-06-19.json
- latest repair run: docs/generated/forms-library-repair-run-2026-06-18T00-34-23-254Z.json
- latest fallback run artifact: data/source-acquisition-runs/2026-06-19T00-11-20-678Z/forms-fallback-summary.json

## Provider Followup Blockers

- status: explicit_repeated_blockers_recorded
- repeated blocker rows: 71
- latest runs: 2026-06-19T00-52-46-886Z, 2026-06-19T00-03-58-926Z, 2026-06-19T00-03-23-705Z, 2026-06-18T18-01-54-225Z, 2026-06-18T04-04-47-221Z, 2026-06-18T04-03-06-159Z, 2026-06-18T04-02-08-899Z, 2026-06-18T03-59-52-969Z, 2026-06-18T03-58-19-669Z, 2026-06-18T03-57-17-974Z
- bucket blocked: 45
- bucket source_repair: 20
- bucket retryable: 6
- reason access_blocked_403: 41
- reason stale_or_invalid_404: 14
- reason dns_lookup_failed: 6
- reason needs_review_unknown: 4
- reason network_timeout: 3
- reason network_fetch_failed: 3
- registry artifact: docs/generated/provider-followup-blocker-registry-2026-06-19.json
