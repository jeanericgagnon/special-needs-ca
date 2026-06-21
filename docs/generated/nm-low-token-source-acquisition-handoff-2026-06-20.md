# New Mexico Low-Token Source Acquisition Handoff

## Scope

Implemented the New Mexico-only low-token source acquisition lane described in the `New Mexico Low-Token Source Acquisition Loop v1` plan.

This work intentionally does **not** use the broad queue control plane:

- no `combinedReadyRows`
- no `scrape-target-universe`
- no autopilot queue selection

Instead, it adds a separate New Mexico control plane:

- `data/generated/nm_official_domain_registry_v1.jsonl`
- `data/generated/nm_missing_critical_roles_v1.jsonl`
- `data/generated/nm_low_token_candidate_urls_v1.jsonl`
- `data/generated/nm_scraper_queue_v1.jsonl`
- `data/generated/nm_verified_source_pack_v1.jsonl`
- `data/generated/nm_rejected_scrapes_v1.jsonl`
- `data/generated/nm_blocked_scrapes_v1.jsonl`
- `data/generated/nm_unresolved_roles_v1.jsonl`
- `data/generated/nm_low_token_acquisition_summary_v1.json`
- `docs/generated/nm-low-token-source-acquisition-report-v1.md`

## Code Added

New files:

- `scripts/nm-low-token-source-acquisition-lib.mjs`
- `scripts/run-nm-low-token-source-acquisition.mjs`
- `scripts/test-nm-low-token-source-acquisition.mjs`

Updated:

- `package.json`

## What The New Lane Does

### 1. New Mexico-only control plane

Builds a reviewed domain registry and a role queue for New Mexico only.

### 2. Reviewed-domain allowlist

Only domains explicitly present in the New Mexico registry may flow into the lane.

Current reviewed registry rows include:

- `nmhealth.org`
- `hsd.state.nm.us`
- `webnew.ped.state.nm.us`
- `ssa.gov`
- `ablenrc.org`
- `parentcenterhub.org`

Some role families remain intentionally unresolved because current repo/DB artifacts did not provide reviewed domains for them:

- protection and advocacy
- legal aid
- vocational rehabilitation / Pre-ETS
- early intervention-specific New Mexico official domain

### 3. Missing-role queue

Creates one row per New Mexico launch-critical role with:

- allowed domains
- must-have terms
- should-have terms
- prohibited terms
- acceptable batch classes
- why the role matters

### 4. Cheap discovery lane

Discovery is bounded and low-token:

- same reviewed domain only
- one-hop from reviewed seed pages
- no broad crawler
- max `3` retained candidates per role

### 5. Separate scraper queue

Only high-confidence candidates become scrape jobs.

Queue limits:

- max `3` jobs per role
- max `75` jobs total

### 6. Strict verification

A row becomes verified only if:

- fresh fetch succeeds
- final domain is allowed
- evidence supports the exact role
- jurisdiction is New Mexico
- no challenge / placeholder / wrong-domain behavior
- `role_confidence >= 0.8`

Otherwise it is routed to:

- rejected
- blocked
- unresolved

## Efficiency Fix Made During Implementation

The first live run exposed an efficiency bug:

- discovery was re-fetching the same official seed pages repeatedly for multiple roles

This was fixed by adding a seed-page fetch cache so one seed page fetch can support multiple role checks in the same run.

## Commands Run

Test:

```bash
npm run test:nm-low-token-source-acquisition
```

Live bounded run:

```bash
npm run run:nm-low-token-source-acquisition -- --delay-ms=100 --request-timeout-ms=5000 --body-timeout-ms=5000 --max-response-bytes=1500000
```

## Final Live Run Result

From `data/generated/nm_low_token_acquisition_summary_v1.json`:

- total roles: `31`
- verified roles: `0`
- unresolved roles: `31`
- candidates discovered: `39`
- candidates sent to scraper: `38`
- verified URLs: `0`
- rejected URLs: `23`
- blocked URLs: `15`
- newly discovered URLs: `6`

Per-domain job counts:

- `hsd.state.nm.us`: `16`
- `nmhealth.org`: `6`
- `webnew.ped.state.nm.us`: `10`
- `parentcenterhub.org`: `3`
- `ablenrc.org`: `3`

## What The Result Means

The lane is working as a **strict verifier**, not as a permissive scraper.

That means:

- it is no longer pretending broad queue rows are trustworthy
- it is no longer treating old repo URLs as verified truth
- it is converting New Mexico work into explicit states on disk

Current New Mexico status is still thin because:

- reviewed-domain coverage is incomplete for several required role families
- some existing Medicaid URLs return `404`
- some discovered pages are on allowed domains but still fail exact-role semantics
- some DD / PED role candidates did not yet reach the high-confidence scrape queue threshold

## Main Current Failure Patterns

### Blocked

Most blocked rows in the last run were:

- `repair`
  - especially `hsd.state.nm.us` Medicaid paths returning `404`
- `permanently_blocked`
  - pages that fetched but failed as unusable for the requested role
- `browser_assisted`
  - small residual challenge-style case

### Rejected

Most rejected rows in the last run were:

- `parent_training_information_center`
  - Parent Center Hub pages that were real content but not New Mexico-specific enough for verification
- `able_account_program`
  - ABLE NRC pages that were useful but not New Mexico-specific enough for verification
- single-role semantic mismatches across DD, Medicaid, and PED roles

## Files To Check Next

Primary summary:

- `data/generated/nm_low_token_acquisition_summary_v1.json`

Role-level report:

- `docs/generated/nm-low-token-source-acquisition-report-v1.md`

Detailed ledgers:

- `data/generated/nm_verified_source_pack_v1.jsonl`
- `data/generated/nm_rejected_scrapes_v1.jsonl`
- `data/generated/nm_blocked_scrapes_v1.jsonl`
- `data/generated/nm_unresolved_roles_v1.jsonl`

## Recommended Next Move

Do **not** broaden scraping first.

Next highest-value work is:

1. review and expand the New Mexico official domain registry for missing families
2. repair dead Medicaid root/path assumptions
3. add reviewed New Mexico-specific authorities for:
   - PTI exact NM page
   - P&A
   - legal aid
   - VR / Pre-ETS
   - early intervention official domain
4. rerun the same bounded NM lane

## Git Record

This work was committed and pushed as:

- commit: `f75751ef`
- message: `Add New Mexico low-token source acquisition lane`
