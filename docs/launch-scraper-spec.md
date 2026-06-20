# Launch Scraper Spec

This document is the launch-specific scraper contract for the current repo.

It is not a brainstorm and it is not a broad roadmap. It describes how the existing low-token source-acquisition system is supposed to operate for launch-critical data, using the current scripts, queues, and generated artifacts that already exist in the repo.

The machine-readable companion artifact is:

- [launch-scraper-contract-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-contract-2026-06-19.json)
- [launch-scraper-field-contract-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-field-contract-2026-06-19.json)
- [launch-scraper-fixture-matrix-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-fixture-matrix-2026-06-19.json)
- [launch-scraper-lifecycle-contract-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-lifecycle-contract-2026-06-19.json)
- [launch-scraper-staging-support-matrix-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-staging-support-matrix-2026-06-19.json)
- [launch-scraper-readiness-board-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-readiness-board-2026-06-19.json)
- [launch-scraper-gap-registry-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-gap-registry-2026-06-19.json)
- [launch-scraper-runbook-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-runbook-2026-06-19.json)
- [launch-scraper-artifact-contract-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-artifact-contract-2026-06-19.json)
- [launch-scraper-provenance-contract-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-provenance-contract-2026-06-19.json)
- [launch-scraper-queue-governance-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-queue-governance-2026-06-19.json)
- [launch-scraper-qa-pack-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-qa-pack-2026-06-19.json)
- [launch-scraper-meta-audit-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-meta-audit-2026-06-19.json)
- [launch-scraper-negative-fixture-capture-packet-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-negative-fixture-capture-packet-2026-06-19.json)
- [launch-scraper-negative-fixture-closure-status-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-negative-fixture-closure-status-2026-06-19.json)

## Scope

This spec covers only launch-critical acquisition families:

- `dd_routing`
- `programs_benefits`
- `waivers`
- `forms_guides`
- `program_waitlists`
- `medicaid_hhs_offices`
- `education_routing`
- `providers_care`
- `knowledge_content`

This spec does not cover:

- broad nonprofit expansion
- advocates/legal depth
- runtime product tables
- speculative discovery
- open-ended crawling

## Core Principle

Use exact URLs from saved artifacts first.

The scraper is not a discovery crawler. It is a deterministic fetch system that:

1. reads exact targets from disk
2. fetches them with bounded network behavior
3. saves raw artifacts to disk
4. classifies fetch results into next-step buckets
5. only later parses, validates, and stages successful results

## Control Plane

These artifacts are authoritative for launch scraping:

- [launch-scrape-link-inventory-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scrape-link-inventory-2026-06-19.json)
- [launch-critical-data-acquisition-plan-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-critical-data-acquisition-plan-2026-06-19.json)
- [source-acquisition-completion-plan-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/source-acquisition-completion-plan-2026-06-19.json)
- [master-source-target-ledger-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/master-source-target-ledger-2026-06-19.json)
- [scrape-now-only-2026-06-18.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/scrape-now-only-2026-06-18.json)
- [forms_source_pack.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source_packs/forms_source_pack.json)
- [official_state_domain_repairs.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source_packs/official_state_domain_repairs.json)
- [provider-source-pack-plan-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/provider-source-pack-plan-2026-06-19.json)
- [provider-authoring-backlog-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/provider-authoring-backlog-2026-06-19.json)
- [knowledge-content-status-queue-2026-06-19.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/knowledge-content-status-queue-2026-06-19.json)

## Launch Queue Truth

Current launch URL inventory, from [launch-scrape-link-inventory-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scrape-link-inventory-2026-06-19.md):

- `3747` launch-critical unique URLs total
- `551` `ready_target_scrape`
- `198` `author_first`
- `237` `repair_first`
- `54` `defer_blocked_source`
- `2248` `live_refresh_candidate`
- `339` `do_not_scrape_quarantined`

Current `ready_target_scrape` counts by launch family:

| family | ready total | lightweight | js-heavy | pdf |
|---|---:|---:|---:|---:|
| `dd_routing` | 12 | 6 | 6 | 0 |
| `programs_benefits` | 30 | 30 | 0 | 0 |
| `waivers` | 13 | 13 | 0 | 0 |
| `forms_guides` | 220 | 0 | 0 | 220 |
| `medicaid_hhs_offices` | 131 | 121 | 9 | 1 |
| `education_routing` | 15 | 5 | 10 | 0 |
| `providers_care` | 65 | 64 | 1 | 0 |
| `knowledge_content` | 65 | 65 | 0 | 0 |

`program_waitlists` is launch-critical but does not currently show up in the `ready_target_scrape` slice of the inventory. It remains a family that should be measured explicitly in control-plane artifacts.

## Execution Lanes

Every launch URL must be in exactly one actionable lane:

- `ready_target_scrape`
- `repair_first`
- `author_first`
- `live_refresh_candidate`
- `manual_review`
- `defer_blocked_source`
- `do_not_scrape_quarantined`

Meaning:

- `ready_target_scrape`
  Use immediately in fetch waves.
- `repair_first`
  Do not fetch yet. Convert the broken/placeholder source into a reviewed exact replacement first.
- `author_first`
  Do not fetch yet. Turn the source-family candidate into an exact runnable target first.
- `live_refresh_candidate`
  Existing DB provenance URL. Useful for refresh or backfill, not first-pass launch scraping.
- `manual_review`
  Needs human/operator judgment before entering a fetch lane.
- `defer_blocked_source`
  Known dead, blocked, or stale source. Do not retry until replaced.
- `do_not_scrape_quarantined`
  Known fake, malformed, or forbidden source. Never re-enter scrape-ready without an explicit repair.

## Fetch Contract

The fetch worker lives in [run-source-acquisition-wave.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/run-source-acquisition-wave.mjs) and [source-acquisition-fetch-lib.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/source-acquisition-fetch-lib.mjs).

Current network contract:

- user-agent:
  `Ablefull source acquisition runner/1.0 (+https://ablefull.com)`
- default request timeout:
  `15000ms`
- default body timeout:
  `15000ms`
- default retry count:
  `2` retries after the first attempt
- redirects:
  `follow`
- rate limit:
  command-configurable, default `1200ms`

Fetch output per run:

- `manifest.json`
- `summary.json`
- `results.csv`
- `report.md`
- `pages/`

## Failure Classification Contract

Followup classification lives in [prepare-source-acquisition-followups.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/prepare-source-acquisition-followups.mjs) and [source-acquisition-followups-lib.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/source-acquisition-followups-lib.mjs).

Current exact buckets:

- `parse_ready_high_signal`
- `parse_ready_suspect`
- `retryable`
- `blocked`
- `source_repair`

Current failure rules:

- `ENOTFOUND` or DNS failure:
  `source_repair`, unless network is sandbox-disabled, then `blocked`
- malformed county office hostnames like `www.<county>county.ca.gov`:
  `source_repair`
- timeouts:
  `retryable`
- fetch failed:
  `retryable`
- `500/502/503/504/523/530`:
  `retryable`
- `401/403/409/421/444/999`:
  `blocked`
- `400/404/410/451`:
  `source_repair`

Current parse-ready suspect rules:

- login/account pages
- suspect redirect/platform pages
- non-primary content types

## Parser Contract

Parsing lives in [run-source-acquisition-parse.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/run-source-acquisition-parse.mjs) and [source-acquisition-lightweight-lib.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/source-acquisition-lightweight-lib.mjs).

Current family parser routing:

- `dd_routing` -> `extractDdRouting`
- `medicaid_hhs_offices` -> `extractCountyOffice`
- `providers_care` -> `extractProviders`
- `advocates_legal` -> `extractAdvocates`
- `forms_guides` -> `extractForms`
- `knowledge_content` -> `extractKnowledgeContent`
- `programs_benefits`, `waivers`, `program_waitlists`, `general_gap_fill`, `transition_programs`, `early_intervention_programs` -> `extractPrograms`

Parser output per family:

- `parsed/<family>/records.ndjson`
- `parsed/<family>/summary.json`
- `parsed/<family>/summary.md`
- `parsed/<family>/schema-errors.json`
- `parsed/<family>/samples.json`

## Validator Contract

Validation lives in [run-source-acquisition-validate.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/run-source-acquisition-validate.mjs) and [source-acquisition-lightweight-lib.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/source-acquisition-lightweight-lib.mjs).

Current family acceptance rules:

- `dd_routing`
  - requires `officeName`
  - requires DD contact signal
- `medicaid_hhs_offices`
  - requires office name
  - requires office phone
  - requires office address
- `programs_benefits`, `waivers`, `program_waitlists`
  - requires program name
  - requires action signal through links or phone
- `providers_care`
  - requires provider name
  - requires provider contact signal
- `forms_guides`
  - requires official-like URL
  - requires form program name
  - requires official download or library URL
- `knowledge_content`
  - requires trusted knowledge source
  - requires article title
  - requires summary text length >= 80

Validation output per family:

- `validated/<family>/accepted.ndjson`
- `validated/<family>/rejected.ndjson`
- `validated/<family>/rejection-reasons.json`
- `validated/<family>/summary.json`
- `validated/<family>/summary.md`

## Acceptance Fixture Matrix

Use the fixture matrix artifact to keep scraper behavior concrete without reading bulk page output in chat.

- passing shape:
  the minimum page signals a launch-family page must expose to be worth keeping
- failing shape:
  the exact validator reason(s) that should fire when those signals are missing
- staging expectation:
  where an accepted record is expected to land downstream

Artifact:

- [launch-scraper-fixture-matrix-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-fixture-matrix-2026-06-19.md)

## Operator Runbook

Use the runbook artifact when the question is not "what fields do we need?" but "what exact cadence should this family run under right now?"

It adds:

- family-specific recommended run mode
- preflight steps
- fetch-only versus full-lane cadence
- stop rules
- next action when a family is blocked
- lane-specific command sets

Artifact:

- [launch-scraper-runbook-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-runbook-2026-06-19.md)

## Lifecycle Contract

Use the lifecycle contract when the question is not just which commands exist, but exactly when a family is allowed to move from queue entry to fetch, followups, parse, validate, stage, and queue refresh.

It adds:

- canonical stage progression per launch family
- proceed and stop conditions by stage
- fallback transitions back into author-first, repair-first, defer-blocked, manual-review, or quarantine
- required artifacts that prove a stage actually completed
- resume-safety linkage so runs can stop and continue without ambiguity

Artifact:

- [launch-scraper-lifecycle-contract-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-lifecycle-contract-2026-06-19.md)

## Artifact Contract

Use the artifact contract when the question is whether a scrape run wrote the right files to disk and whether downstream work can safely resume from that run.

It adds:

- required run directory layout
- required top-level and downstream files
- manifest and summary field requirements
- family-stage file requirements
- resume-safety guarantees and limits

Artifact:

- [launch-scraper-artifact-contract-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-artifact-contract-2026-06-19.md)

## Staging Support Matrix

Use the staging support matrix when the question is whether a launch family can actually move accepted validated rows into a staging table, and what stops that move if not.

It adds:

- family-by-family stage support status
- exact staging table and target table mapping
- explicit unsupported reason when stage is not available
- linkage from lifecycle stage rules to real staging support
- the remaining family exceptions after direct waitlist staging support is in place

Artifact:

- [launch-scraper-staging-support-matrix-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-staging-support-matrix-2026-06-19.md)

## Readiness Board

Use the readiness board when the question is “which families are actually ready to operate cleanly right now, and what is the top remaining spec gap per family?”

It adds:

- one row per launch family
- queue readiness counts
- fixture coverage class
- stage support status
- top remaining spec gap

## False-Positive Taxonomy

Use the false-positive taxonomy when the question is “what kinds of saved pages must never count as valid launch depth, and how should the control plane route them?”

It adds:

- explicit bad-page classes such as blocked/error shells, generic program shells, and contactless directory shells
- family applicability for each class
- expected validator outcomes
- required queue disposition and next lane
- real saved-page examples from launch QA artifacts
- a compact readiness class that combines these signals for operator triage

Artifact:

- [launch-scraper-readiness-board-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-readiness-board-2026-06-19.md)

## Gap Registry

Use the gap registry when the question is “what exact spec gaps are still open, and what is the next command for each one?”

It adds:

- one row per remaining scraper-spec gap
- exact gap class
- evidence text
- exact next artifact
- exact next command
- explicit done condition

Artifact:

- [launch-scraper-gap-registry-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-gap-registry-2026-06-19.md)

## Provenance Contract

Use the provenance contract when the question is whether source-backed truth survives the whole scraper pipeline instead of getting lost in transformation.

It adds:

- common provenance fields by stage
- family-specific truth fields that must survive
- staged-field expectations for launch families
- invariants around source identity and state identity

Artifact:

- [launch-scraper-provenance-contract-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-provenance-contract-2026-06-19.md)

## Queue Governance

Use the queue-governance artifact when the question is not how to scrape a row, but why the row is in its current lane and which lanes it is allowed to move to next.

It adds:

- queue-class meanings
- classification triggers
- allowed next-lane transitions
- blocked-work taxonomy
- family-level unblock lanes

Artifact:

- [launch-scraper-queue-governance-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-queue-governance-2026-06-19.md)

## QA Pack

Use the QA pack when the question is whether parser and validator expectations are grounded in real saved pages rather than just abstract contracts.

It adds:

- representative accepted cases from disk
- representative rejected cases from disk
- saved page paths
- expected validation reasons for rejected cases
- family-by-family recommended assertions
- replayable fixtures for parser/validator verification
- explicit coverage reporting for missing accepted/rejected replay cases
- an explicit acquisition plan for missing negative fixtures
- a bounded operator packet for capturing the remaining real rejected fixtures without reopening broad scrape work
- an explicit open-versus-closed closure tracker for the remaining real rejected fixture gaps

Artifact:

- [launch-scraper-qa-pack-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-qa-pack-2026-06-19.md)
- [launch-scraper-negative-fixture-capture-packet-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-negative-fixture-capture-packet-2026-06-19.md)
- [launch-scraper-negative-fixture-closure-status-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-negative-fixture-closure-status-2026-06-19.md)

Verification command:

- `npm run test:launch-scraper-real-fixtures`
- `npm run audit:launch-scraper-fixture-coverage-audit`
- `npm run audit:launch-scraper-negative-fixture-plan`
- `npm run audit:launch-scraper-negative-fixture-capture-packet`
- `npm run audit:launch-scraper-negative-fixture-closure-status`

## Meta Audit

Use the meta audit when the question is whether the whole launch scraper specification stack is present and consistent, not whether any one artifact looks good in isolation.

It adds:

- required-artifact presence checks
- family-set consistency checks
- cross-artifact invariants
- one-command overall pass/fail

Artifact:

- [launch-scraper-meta-audit-2026-06-19.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-scraper-meta-audit-2026-06-19.md)

## Umbrella Commands

Use these when the goal is to regenerate or verify the entire launch scraper specification stack with one entrypoint.

Commands:

- `npm run audit:launch-scraper-suite`
- `npm run test:launch-scraper-suite`

## Staging Contract

Staging lives in [run-source-acquisition-stage.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/run-source-acquisition-stage.mjs) and [source-acquisition-stage-lib.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/source-acquisition-stage-lib.mjs).

Supported launch family staging targets:

- `dd_routing` -> `staging_scraped_state_resource_agencies`
- `programs_benefits` / `waivers` -> `staging_scraped_programs`
- `providers_care` -> `staging_scraped_resource_providers`
- `forms_guides` -> supported through form staging path
- `medicaid_hhs_offices` -> `staging_scraped_county_offices`

Staging output per family:

- `staged/<family>/promotion-candidates.ndjson`
- `staged/<family>/unsupported-candidates.ndjson`
- `staged/<family>/promotion-summary.json`
- `staged/<family>/promotion-summary.md`

## Family-Specific Scraper Specification

### `dd_routing`

Purpose:
Find truthful state DD/IDD intake and routing contacts.

Allowed sources:

- first-party state DD agency pages
- official intake/catchment directories
- official early intervention county directories only when they function as routing surfaces

Required acceptance signals:

- office/agency name
- phone, email, or explicit intake contact
- state-level routing page or equivalent services/eligibility URL

Current launch-ready queue:

- `12` ready URLs
- `6` lightweight
- `6` JS-heavy

Preferred batch shape:

- lightweight first
- JS-heavy second
- family-only runs

### `programs_benefits`

Purpose:
Fetch actionable program pages, not generic agency homepages.

Allowed sources:

- official Medicaid program pages
- official developmental services program pages
- official benefits pages with direct application/eligibility/action signal

Required acceptance signals:

- program name
- action signal
- source-backed page title or heading

Current launch-ready queue:

- `30` lightweight URLs

Preferred batch shape:

- lightweight only
- suppress generic pages during validation

### `waivers`

Purpose:
Fetch explicit waiver pages and waiver-linked action paths.

Allowed sources:

- official HCBS waiver pages
- official DD waiver pages
- official Medicaid waiver eligibility pages

Required acceptance signals:

- explicit waiver identity
- action signal
- source-backed eligibility/steps path

Current launch-ready queue:

- `13` lightweight URLs

Preferred batch shape:

- lightweight only

### `forms_guides`

Purpose:
Fetch exact official forms and official form-library roots.

Allowed sources:

- official forms libraries
- official PDF forms
- official application and appeals guides

Disallowed sources:

- fake `dhhs.<state>.gov` placeholders
- unofficial guide mirrors

Required acceptance signals:

- official-like URL
- program/form context
- official download or library URL

Current launch-ready queue:

- `220` PDF URLs

Preferred batch shape:

- medium PDF-only waves
- do not mix with HTML fetch waves

### `program_waitlists`

Purpose:
Fetch exact waitlist or interest-list source pages.

Allowed sources:

- official waitlist pages
- official enrollment queue pages
- official waiver interest-list pages

Required acceptance signals:

- explicit waitlist identity
- source linkage
- not inferred from generic program text

Current launch-ready queue:

- not currently represented in the `ready_target_scrape` slice
- remains a required first-class launch family

Preferred batch shape:

- only after queue visibility is refreshed

### `medicaid_hhs_offices`

Purpose:
Fetch truthful office routing sources and county office contact pages.

Allowed sources:

- official county office pages
- official locator pages
- official Medicaid/HHS office directories

Disallowed sources:

- malformed county hostnames
- stale/fake county office targets

Required acceptance signals:

- office name
- phone
- address

Current launch-ready queue:

- `131` ready URLs
- `121` lightweight
- `9` JS-heavy
- `1` PDF

Preferred batch shape:

- lightweight first
- JS/PDF residual second
- repair-first URLs must be fixed before entering fetch

### `education_routing`

Purpose:
Fetch truthful regional education and district fallback routing pages.

Allowed sources:

- official regional service agency pages
- official district directory pages
- official state education routing pages

Required acceptance signals:

- regional or district routing entity
- credible website
- real phone or explicit district/agency path

Current launch-ready queue:

- `15` ready URLs
- `5` lightweight
- `10` JS-heavy

Preferred batch shape:

- lightweight first
- JS-heavy second

### `providers_care`

Purpose:
Fetch launch-anchor provider pages, not broad provider directories.

Allowed sources:

- first-party children’s hospitals
- first-party developmental pediatrics
- first-party autism centers
- first-party therapy systems
- first-party diagnostic clinics

Disallowed sources:

- generic provider directories as primary evidence
- inferred local presence

Required acceptance signals:

- named provider/program
- contact signal
- address or explicit location signal

Current launch-ready queue:

- `65` ready URLs
- `64` lightweight
- `1` JS-heavy

Preferred batch shape:

- small state-anchor waves
- do not mix with author-first provider packets

### `knowledge_content`

Purpose:
Fetch high-trust guidance pages that can later support provenance-safe launch content.

Allowed sources:

- official guidance pages
- reviewed high-trust mission-aligned guidance pages

Disallowed sources:

- deferred blocked sources
- dead or stale sources without reviewed replacements

Required acceptance signals:

- trusted source URL
- article title
- useful summary text

Current launch-ready queue:

- `65` lightweight URLs

Preferred batch shape:

- lightweight only
- replacement-reviewed sources first when blocked

## Batch Policy

Recommended launch fetch order:

1. `dd_routing`
2. `programs_benefits`
3. `waivers`
4. `forms_guides`
5. `program_waitlists`
6. `medicaid_hhs_offices`
7. `education_routing`
8. `providers_care`
9. `knowledge_content`

Recommended batch sizes:

- `ready_lightweight`
  `10-30` per family wave
- `ready_js_heavy`
  `3-10` per family wave
- `ready_pdf`
  `10-25` per family wave

Do not mix families in the same launch wave when the goal is operator clarity and low token spend.

## Low-Token Operating Modes

### Mode A: Fetch-Only

Use when the immediate goal is cheap queue burn-down.

Run:

1. fetch
2. followups
3. stop

Use this when:

- we want to classify live URL health fast
- we do not yet need parsed/staged output
- the family still has a meaningful ready queue

### Mode B: Full Lane Cycle

Use when a family has enough successful fetches to justify downstream work.

Run:

1. fetch
2. followups
3. parse
4. validate
5. stage
6. queue refresh

Use this when:

- we want to turn a successful batch into staged launch data immediately

## Exact Command Shapes

Refresh queue truth:

```bash
npm run audit:source-acquisition-completion-plan
npm run audit:launch-scrape-link-inventory
```

Fetch-only dry run for one family and one status:

```bash
npm run run:source-acquisition-wave -- --mode=dry-run --gap=dd_routing --status=ready_lightweight --lane=ready_target_scrape --limit=10
```

Fetch-only live run:

```bash
npm run run:source-acquisition-wave -- --mode=live --gap=dd_routing --status=ready_lightweight --lane=ready_target_scrape --limit=10 --concurrency=8 --rate-limit-ms=300
```

Followups:

```bash
npm run run:source-acquisition-followups -- --run-id=<run-id>
```

Parse one family:

```bash
npm run run:source-acquisition-parse -- --run-id=<run-id> --family=dd_routing
```

Validate one family:

```bash
npm run run:source-acquisition-validate -- --run-id=<run-id> --family=dd_routing
```

Stage one family:

```bash
npm run run:source-acquisition-stage -- --run-id=<run-id> --family=dd_routing --mode=dry-run
```

## Reporting Contract

Chat summaries should stay compact and use counts only.

Allowed format:

- family
- run id
- attempted
- succeeded
- blocked
- moved to repair
- retryable
- parsed
- accepted
- rejected
- staged
- promoted
- remaining ready count

Do not paste:

- HTML bodies
- PDFs
- parsed corpora
- row dumps

## Stop Conditions

Stop a family wave when:

- the ready queue for that status is exhausted
- repeated blocked results indicate a repair/authoring pivot
- the current lane needs reviewed replacements before more fetches
- parser/validator/staging coverage is not yet correct enough to continue downstream safely

## Things The Scraper Must Not Do

- recurse across whole sites
- discover arbitrary new URLs during fetch
- retry quarantined URLs
- convert blocked knowledge targets back into live fetches without reviewed replacement
- infer local provider presence from weak org-level evidence
- treat fallback form roots as equivalent to exact official libraries unless explicitly classified that way in control-plane artifacts

## Current Recommendation

For token control, the right next operating mode is:

1. `fetch-only` for `dd_routing`
2. `followups`
3. compact count summary
4. continue family-by-family through ready launch URLs

Then parse only after a meaningful successful raw fetch batch exists.
