# Low-Token Control Plane Audit

Generated: 2026-06-17T22:39:02.103Z

## Regression Guard

- status: pass
- exit code: 0
- stdout: low token workflow regression tests passed

## Official Follow-Up Lane

- status: idle_or_cleared
- pending queue rows: 0
- pending states: none
- active decision rows: 1
- blocker: no_live_official_followup_rows
- next action: No official-domain follow-up review is pending.
- queue artifact: docs/generated/official-domain-followup-queue-2026-06-17.json
- decision file: data/official-domain-followup-decisions.json

## Provider Placeholder Lane

- status: idle_or_cleared
- pending queue rows: 0
- authoring brief rows: 0
- decision template rows: 0
- active decision rows: 0
- blocker: none
- next action: Provider placeholder lane is clear; no action needed.
- queue artifact: docs/generated/provider-placeholder-replacement-queue-2026-06-17.json

## Forms Fallback Lane

- status: needs_manual_review_resolution
- queue rows: 111
- excluded federal-only states: nebraska, new-hampshire, new-mexico
- exact repair rows: 0
- non-repairable rows: 40
- latest fallback run: 2026-06-17T22-29-30-688Z
- latest fallback selected rows: 3
- latest fallback warnings: 0
- manual review queue rows: 111
- manual review decision template rows: 111
- active manual review decision rows: 0
- manual review resolution ledger rows: 0
- state ledger total states: 37
- blocker: forms_fallback_manual_review_resolution_pending
- next action: The bounded scrape lane is exhausted. Resolve queued forms-fallback manual-review rows through the decision template and apply workflow instead of re-scraping.
- first batch states: none
- exercised batch states: none
- previewed-only states: none
- pending preview states: none
- next batch states: none
- next state: none
- next mode: none
- exact next command: none
- command: npm run audit:forms-fallback-manual-review-decision-template
- command: npm run fix:forms-fallback-manual-review-decisions -- --input=data/forms-fallback-manual-review-decisions.json --state=<state>
- state_specific_fallback_only: 37
- federal_only_fallback: 3
- manual review url_budget_exhausted_with_fetch_errors: 111
- state ledger completed_manual_review: 37
- fallback queue artifact: docs/generated/forms-fallback-scrape-queue-2026-06-17.json
- completion ledger: data/source-acquisition-state/forms-fallback-completion-ledger.json
- manual review queue: docs/generated/forms-fallback-manual-review-queue-2026-06-17.json
- manual review decision template: docs/generated/forms-fallback-manual-review-decision-template-2026-06-17.json
- active manual review decision file: data/forms-fallback-manual-review-decisions.json
- manual review resolution ledger: data/source-acquisition-state/forms-fallback-manual-review-ledger.json
- state ledger: docs/generated/forms-fallback-state-ledger-2026-06-17.json
- latest repair run: docs/generated/forms-library-repair-run-2026-06-17T20-19-29-738Z.json
- latest fallback run artifact: data/source-acquisition-runs/2026-06-17T22-29-30-688Z/forms-fallback-summary.json
