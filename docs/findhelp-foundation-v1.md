# Findhelp Foundation V1

This document defines the minimum directory foundation now supported in the repo without introducing enterprise workflows.

## Purpose

Ablefull is not a generic social services directory. The public directory foundation is optimized for disability-specific help across:

- Down syndrome
- Autism
- IDD / DD
- IEPs and special education
- Early intervention
- Medicaid waivers
- Respite and caregiving
- Advocacy and appeals
- Transition and long-term planning

## Supported Directory Layers

The following public-facing record types now support the same optional foundation fields:

- `resource_providers`
- `nonprofit_organizations`
- `iep_advocates`

These remain distinct from:

- `programs`
- `county_offices`
- `state_resource_agencies`
- `regional_education_agencies`
- `school_districts`

That separation is intentional so organization/program/location normalization can evolve without flattening everything into providers.

The migration landing zone for that normalization now lives in:

- `organizations`
- `organization_program_links`
- `service_locations`
- `office_locations`
- `virtual_service_areas`
- `virtual_service_area_counties`

See [docs/directory-org-program-location-foundation-v1.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/directory-org-program-location-foundation-v1.md) for the current intended mapping.

## New Foundation Fields

### Taxonomy and tags

- `service_tags`
- `serving_tags`

`service_tags` describes what is offered. Current controlled values:

- `food`
- `housing`
- `home_mods`
- `utilities`
- `supplies`
- `transport`
- `therapy`
- `behavioral_health`
- `benefits`
- `grants`
- `respite`
- `in_home_support`
- `caregiving`
- `early_intervention`
- `special_education`
- `iep_advocacy`
- `vocational_rehab`
- `transition`
- `guardianship`
- `trusts`
- `legal_aid`
- `appeals`

`serving_tags` describes who the listing explicitly serves. Current controlled values:

- `down_syndrome`
- `autism`
- `idd_dd`
- `early_childhood`
- `school_age`
- `transition_age`
- `parents_caregivers`
- `medicaid_waiver_families`
- `iep_families`
- `non_english_speakers`
- `rural_families`
- `low_income_families`

Condition taxonomy remains separate. We do not infer `serving_tags` from diagnosis pages alone.

### Availability and capacity

- `availability_status`
- `accepting_new_clients`
- `waitlist_status`
- `capacity_notes`
- `funding_status`

Supported `availability_status` values:

- `available`
- `limited`
- `near_capacity`
- `waitlist`
- `full`
- `out_of_funding`
- `temporarily_closed`
- `unknown`

Use `unknown` only when a checked, source-backed record does not publish a usable live availability, waitlist, or funding signal. Do not infer `available` from freshness alone.

### Next-step and intake

- `next_step_type`
- `next_step_label`
- `next_step_url`
- `next_step_phone`
- `next_step_email`
- `next_step_instructions`
- `requirements`
- `application_url`
- `referral_url`
- `walk_in_available`
- `appointment_required`

Supported `next_step_type` values:

- `call`
- `email`
- `apply_online`
- `referral`
- `schedule`
- `walk_in`
- `download_form`
- `contact_form`
- `see_instructions`
- `unknown`

### Languages and accessibility

- `languages`
- `interpreter_available`
- `asl_available`
- `wheelchair_accessible`
- `virtual_services`
- `in_person_services`
- `home_visits`
- `transportation_help`
- `accessibility_notes`

### Trust, freshness, and quality

- `source_name`
- `source_last_updated`
- `checked_at`
- `last_verified_at`
- `manual_review_required`
- `data_quality_notes`
- `unsupported_claim_flags`

When only a verified date is known and no timestamp exists yet, the repo may backfill `last_verified_at` from `last_verified_date` at midnight UTC so the field is machine-usable without inventing a different verification day.

For directory-style public listings specifically (`resource_providers`, `nonprofit_organizations`, `iep_advocates`), source URL plus contact plus verification status is no longer enough for truth-safe display. A row must also carry at least one machine-usable freshness signal:

- `last_verified_at`
- `last_verified_date`
- `checked_at`
- `source_last_updated`
- `last_scraped_at`

This keeps public directory output from presenting timestamp-opaque rows as equally trustworthy with recently checked rows.

For narrow curated-seed repairs, the repo may also backfill `checked_at` from a checked-in promotion artifact timestamp when all of the following are true:

- the exact record ID is present in a checked-in phase record file
- the matching before/after promotion report has a concrete `Generated At` timestamp
- the row is `curated_seed`
- the row is already `official_verified`
- no stronger freshness field is present yet

The repo-native repair entrypoint for the current Illinois curated-seed backlog is:

```bash
npm run fix:illinois-curated-seed-freshness
```

### Claimed-listing groundwork

- `claim_status`
- `claimed_by`
- `verified_affiliation`
- `claim_email`

Supported `claim_status` values:

- `unclaimed`
- `pending_review`
- `claimed`
- `verified_affiliation`
- `changes_submitted`
- `changes_approved`

## Rendering Rules

Public rendering stays truth-first:

- Do not show empty structured sections.
- Do not fabricate intake CTAs.
- Do not show synthetic or invalid domains.
- Do not surface records with unsupported-claim flags as if they were clean.
- Only show structured fields when sourced data actually exists.
- Availability coverage counts any real capacity signal, including `accepting_new_clients`, `waitlist_status`, `capacity_notes`, and `funding_status`, not just a top-level availability label.
- Next-step coverage includes action-routing fields such as `requirements`, `application_url`, `referral_url`, `walk_in_available`, and `appointment_required`.

## Validation Rules

`frontend/src/lib/directoryFoundation.ts` now validates:

- synthetic source URLs
- synthetic websites
- likely synthetic generated advocate profiles
- invalid availability statuses
- invalid next-step types
- invalid funding statuses
- invalid claim statuses
- invalid service tags
- invalid serving tags
- verified records missing `source_url`
- likely provider/program confusion
- unsupported claim flags present

## Analytics

The helper contract lives in `frontend/src/lib/directoryAnalytics.ts`. This pass now adds a vendor-neutral browser bridge for safe directory interaction events:

- sanitized payloads are dispatched through `window` as `ablefull:directory-analytics`
- payloads are also buffered in `window.__ABLEFULL_DIRECTORY_ANALYTICS__`
- if a site-level `dataLayer` already exists, the same sanitized payload is pushed there
- IDs are normalized to coarse lowercase tokens before dispatch
- `resultCount` is truncated to a non-negative integer
- `nextStepType`, `recordType`, and `pageType` are dropped if they are outside the supported controlled values
- `searchQuery` is whitespace-normalized, capped to 120 characters, and redacts obvious emails and phone numbers before dispatch

Current live wiring covers public directory action clicks from `DirectoryFoundationPanel`:

- resource click
- application click
- phone click
- email click
- form download
- save resource
- next-step click

Current live wiring also covers search-state events on the advocates directory and state county index:

- search
- no-results search
- dead-end search

The intended event family remains:

- search
- no-results search
- dead-end search
- resource click
- application click
- phone click
- email click
- form download
- save resource
- next-step click

If implemented later, event payloads should avoid PHI and should use record IDs plus coarse page context rather than free-text child data.

The repo-native verification command for the helper is:

```bash
npm run test:directory-analytics
```

## Saved-resource groundwork

Public directory cards now expose a lightweight saved-resource action backed only by browser storage:

- saved items are stored locally under `ablefull_saved_directory_resources`
- the saved payload is limited to coarse public directory metadata such as record ID, name, type, page context, public contact, and source/trust fields
- no child profile, free-text parent notes, or private case data are mixed into this store
- this is intentionally local-only groundwork, not a synced portal or account feature

The repo-native verification command for this helper is:

```bash
npm run test:saved-resources
```

## Audit Command

The new repo-native audit entrypoint for the foundation is:

```bash
npm run audit:directory-foundation
```

It currently reports, by table:

- synthetic `source_url`
- synthetic `website`
- public-eligible records missing `source_url`
- invalid availability / next-step / funding / claim statuses
- invalid `service_tags`
- invalid `serving_tags`
- unsupported claim flags present
- stale records
- manual review required counts
- likely provider/program confusion

The dedicated freshness audit for the same three public directory tables is:

```bash
npm run audit:directory-staleness
```

It turns the broad stale-record check into a generated artifact that shows:

- total rows
- public-eligible rows
- stale rows
- stale public-eligible rows
- rows missing all freshness signals
- freshness age buckets
- states with the highest stale public inventory

This differs from `audit:directory-foundation-density`, which measures field presence and support density, not age-based staleness.

The companion repair audit for freshness-opacity gaps is:

```bash
npm run audit:directory-freshness-gaps
```

It isolates rows that are still public-eligible but have none of:

- `last_verified_at`
- `last_verified_date`
- `checked_at`
- `source_last_updated`
- `last_scraped_at`

This keeps the repo from treating “not stale” as the same thing as “timestamped.” The output is an exact repair queue with row IDs, state/county context, and the safe next action.

It now also verifies that the checked-in `frontend/ca_disability_navigator.db` physically contains the expected optional directory-foundation columns for:

- `resource_providers`
- `nonprofit_organizations`
- `iep_advocates`

If those columns drift out of the checked-in DB again, the audit now fails even if the TypeScript schema helpers still reference them.

It now also audits the public county surfaces directly:

- `frontend/src/lib/publicTruth.ts` still requires acceptable verification status, real `source_url`, and real contact signal
- county root and county-diagnosis route files still use `DirectoryFoundationPanel`
- local provider and advocate sections still filter through shared truth eligibility
- legacy fake public content is absent:
  - synthetic local cards
  - `(555)` placeholders
  - `@example.com` placeholders
  - hardcoded reviewer personas
  - legacy `Vetted` trust language

Route-integrity failures now set a non-zero exit code so the audit can be used as a CI guard for public truth regressions.

The checked-in frontend SQLite snapshot can now be synced to the repo's directory-foundation schema with:

```bash
npm run fix:directory-foundation-db
```

That script adds any still-missing optional foundation columns to:

- `resource_providers`
- `nonprofit_organizations`
- `iep_advocates`

It now also ensures the checked-in frontend SQLite snapshot contains the normalization landing tables:

- `organizations`
- `organization_program_links`
- `service_locations`
- `office_locations`
- `virtual_service_areas`
- `virtual_service_area_counties`

It also performs conservative backfills only where the current record shape already supports them:

- default `claim_status = unclaimed`
- `verified_affiliation = 0` when empty
- `iep_advocates.service_tags = iep_advocacy,special_education`
- advocate next-step routing from real existing email, phone, or website fields
- provider/nonprofit next-step routing from real existing phone, email, and source URL fields
- `checked_at` from existing verification/scrape timestamps
- `source_name` from existing source URLs / hosts
- advocate downgrade when a row matches the known synthetic pattern:
  - `id` starts with `gen-`
  - fake `*.advocacy.com` `source_url`
  - CDE special-ed page reused as `website`
  - blank direct phone/email
  - no `last_verified_date`

Important:

- this sync does **not** invent `availability_status`, `waitlist_status`, or `accepting_new_clients`
- `checked_at` is treated as freshness support, not as evidence of live availability or capacity
- the dedicated availability audit only counts actual capacity fields such as `availability_status`, `accepting_new_clients`, `waitlist_status`, `capacity_notes`, and `funding_status`
- the broader density audit counts truth-first coverage, which can include source-backed `unknown` plus `checked_at` freshness support
- synthetic generated advocate rows are downgraded to `manual_review_required` and flagged rather than treated as public-safe

Field-density measurement now also has its own generated audit:

```bash
npm run audit:directory-foundation-density
```

It writes a repo-native density ledger under `docs/generated/` so we can track how much of the foundation is merely schema-ready versus actually populated in live records.

Accessibility density now also has its own generated audit:

```bash
npm run audit:directory-accessibility
```

It writes a repo-native accessibility ledger under `docs/generated/` showing:

- trusted public rows carrying any language, modality, or accessibility signal
- trusted public rows still missing all accessibility signals
- raw counts for languages, interpreter/ASL, wheelchair, virtual, home-visit, and transportation fields
- top states where trusted public provider or nonprofit rows still have no accessibility support data

Accessibility candidate discovery now also has a generated audit:

```bash
npm run audit:directory-accessibility-candidates
```

It writes a repo-native candidate ledger under `docs/generated/` showing:

- staging rows that already map to live nonprofit or provider targets
- explicit clue phrases such as `English`, `Spanish`, `ASL`, `interpreter`, `wheelchair`, `transportation`, `home visit`, or `telehealth`
- current live target values beside those clues
- a review queue for safe enrichment where automation is possible, and a proof point when the checked-in staging data is too sparse to support more backfills

Live `/find-help` sample quality now also has a generated audit:

```bash
npm run audit:find-help-sample-quality
```

It writes a repo-native sample-quality ledger under `docs/generated/` showing:

- how many public-safe candidate rows each sample table has
- how many of those candidates are still renderable after truth gating
- which top-ranked rows were selected before render
- whether those rendered cards match the ideal renderable set under the same richness-first, freshness-second ranking contract
- any rows that win selection internally but then disappear publicly because render-time truth gating hides them

Live `/find-help` sample diversity now also has a generated audit:

```bash
npm run audit:find-help-sample-diversity
```

It writes a repo-native diversity ledger under `docs/generated/` comparing:

- a naive richness-and-freshness-only top-3 sample set
- the current diversity-aware sample set used by `/find-help`
- distinct-state coverage across those sample cards
- distinct organization-family coverage across those sample cards

The current live selector now stays quality-first, but when multiple rows are equally strong it prefers not to spend all three sample slots on the same source family or the same state if credible alternatives already exist.

Nonprofit family concentration now also has a generated audit:

```bash
npm run audit:find-help-nonprofit-family
```

It writes a repo-native nonprofit concentration ledger under `docs/generated/` showing:

- the largest trustworthy nonprofit source families in the public pool
- whether chapter-style or statewide nonprofit families dominate the dataset
- the naive top-3 nonprofit sample set
- the diversity-aware top-3 nonprofit sample set used by `/find-help`

Accessibility-aware sample preference now also has a generated audit:

```bash
npm run audit:find-help-accessibility-sample
```

It writes a repo-native accessibility sample ledger under `docs/generated/` showing:

- how many public-safe candidates in each sample table carry any language or accessibility signal
- how many live `/find-help` sample rows actually carry those signals
- top accessible candidates in each table
- whether the live sampler had competitive accessibility-rich rows available, or whether the dataset itself is still too sparse

The current live selector now breaks ties toward rows with accessibility signals after overall richness, before freshness. This does not lower the truth bar or let thinner records outrank stronger ones. It only prefers more useful public rows when quality is otherwise equal.

Provider accessibility enrichment now also has a generated execution plan:

```bash
npm run audit:provider-accessibility-enrichment-plan
```

It writes a repo-native provider accessibility plan under `docs/generated/` showing:

- which trusted provider states still have zero accessibility-rich rows
- whether checked-in provider staging data supports any safe accessibility backfill
- the host domains currently represented in each provider state
- which states need fresh source pulls instead of any automated backfill

This plan exists because the current checked-in provider staging rows do not contain explicit accessibility clues, so truthful provider accessibility improvement depends on better source pulls rather than inference.

Provider accessibility source-pull prep now also has a generated audit:

```bash
npm run audit:provider-accessibility-source-pull-prep
```

It writes a repo-native pull-prep artifact under `docs/generated/` for:

- Florida
- Texas
- Pennsylvania
- Illinois

The artifact pairs:

- current live trusted provider rows
- first-party hospital or clinic target URLs already present in state source-target docs
- secondary roster/discovery sources
- extraction hints for where to look for languages, telehealth, interpreter access, transportation help, and related accessibility signals

Provider accessibility extraction workflow now also has a generated checklist:

```bash
npm run audit:provider-accessibility-extraction-checklist
```

It writes a repo-native extraction checklist under `docs/generated/` that groups Florida, Texas, Pennsylvania, and Illinois provider targets by likely clue location:

- contact page
- appointment / scheduling page
- patient services / patient info
- FAQ / family support
- telehealth / virtual care
- accessibility / interpreter / language access
- program overview

This is meant to speed up truthful first-party review by telling us where to look first for explicit accessibility signals, rather than having each pull pass rediscover the same page patterns from scratch.

Provider accessibility review outcomes now also have a generated audit:

```bash
npm run audit:provider-accessibility-pull-results
```

It writes a repo-native pull-results ledger under `docs/generated/` showing:

- whether the review table exists in the working DB
- how many trusted provider rows in Florida, Texas, Pennsylvania, and Illinois have any recorded clue-review rows
- clue status counts across `queued`, `reviewed`, `promoted`, and `rejected`
- which providers still have no recorded evidence rows at all
- which providers have only partial clue coverage so far

The backing table is `provider_accessibility_pull_results`. It exists to store first-party review evidence before any directory row is enriched. Each row can capture:

- the target provider and state
- the provider source host and source URL
- the exact clue page URL where evidence was found
- the clue page type such as contact, appointment, telehealth, or accessibility page
- the clue field being proposed such as `languages`, `interpreter_available`, `virtual_services`, or `transportation_help`
- the extracted clue value and supporting clue text
- the clue status: `queued`, `reviewed`, `promoted`, or `rejected`
- review notes, reviewer, and review/promotion timestamps

This keeps the workflow truth-first: source-pull discoveries can be recorded immediately, but public directory fields should only be promoted after a reviewed evidence row exists.

The repo now also has a deterministic queue seeding pass for this table:

```bash
npm run fix:provider-accessibility-review-queue
```

This pass creates `queued` review rows for trusted provider records in:

- Florida
- Texas
- Pennsylvania
- Illinois

Each queued row is derived from the provider's current trusted `source_url` plus the same clue-location heuristics used by the extraction checklist. It seeds review tasks by:

- provider
- clue page type
- proposed clue field

Examples of queued clue fields include:

- `languages`
- `interpreter_available`
- `asl_available`
- `wheelchair_accessible`
- `virtual_services`
- `transportation_help`
- `requirements`
- `application_url`
- `referral_url`
- `next_step_type`

The queue seeding pass does not create any reviewed or promoted claims. It only creates work items so first-party review can proceed in a repeatable way and so audit output can distinguish "no evidence recorded yet" from "review queue exists but is still unreviewed."

Reviewed provider accessibility clues can now be promoted with:

```bash
npm run fix:provider-accessibility-promote-reviewed
```

This pass is intentionally conservative:

- it only reads `provider_accessibility_pull_results` rows whose `clue_status` is `reviewed`
- it requires a concrete `clue_page_url`
- it only promotes positive boolean accessibility claims
- it merges `languages` conservatively instead of overwriting them
- it refuses to overwrite conflicting existing URLs, free-text notes, or `next_step_type` values
- it marks a clue row `promoted` only after the provider row already has or safely receives the reviewed value

Current supported promotion targets are:

- `languages`
- `interpreter_available`
- `asl_available`
- `wheelchair_accessible`
- `virtual_services`
- `in_person_services`
- `home_visits`
- `transportation_help`
- `accessibility_notes`
- `requirements`
- `application_url`
- `referral_url`
- `next_step_type`

This keeps the workflow aligned with truth-first rendering: queued tasks do nothing, reviewed tasks still do nothing until they carry explicit usable evidence, and only then can a narrow set of public provider fields be updated.

The repo now also supports structured review-decision intake:

```bash
npm run audit:provider-accessibility-review-decision-template
npm run fix:provider-accessibility-apply-review-decisions
```

The template audit writes both JSON and CSV artifacts under `docs/generated/` for the current queued clue rows. These artifacts expose:

- the queue row `id`
- provider and state context
- clue page type and clue field
- blank decision columns for `reviewed` or `rejected`
- blank evidence and reviewer fields

The apply pass reads `data/provider-accessibility-review-decisions.json` if it exists. It only accepts:

- `reviewed`
- `rejected`

For `reviewed` rows it requires:

- queue row `id`
- `reviewed_by`
- valid `clue_page_url`
- `clue_value` or `clue_text`

For `rejected` rows it requires:

- queue row `id`
- `reviewed_by`
- `review_notes`

This gives the provider accessibility workflow a full repo-native path:

1. seed queued review rows
2. export a review template
3. apply reviewed or rejected decisions
4. promote only reviewed, safe clues into provider fields

The repo also now has a conservative nonprofit language backfill:

```bash
npm run fix:nonprofit-languages-from-staging
```

This pass only fills `nonprofit_organizations.languages` when all of the following are true:

- the nonprofit target row already exists
- a staging nonprofit row already maps to that target through `suggested_target_id`
- the staging excerpt explicitly mentions `English`, `Spanish`, or `Espanol`

If the target already has a `languages` value, the pass now merges in newly confirmed staged languages instead of skipping the row outright. This keeps bilingual rows from getting stuck at `English` when later staging evidence explicitly adds `Spanish`.

This pass does not infer ASL, wheelchair access, virtual support, transportation help, or any language that is not named directly in the staging text.

Advocate cleanup after truth gating now also has a generated audit:

```bash
npm run audit:advocate-truth-cleanup
```

It writes a repo-native advocate cleanup ledger under `docs/generated/` showing:

- public-safe advocate counts
- quarantined advocate counts
- states and counties that lose all advocate coverage after truth gating
- example quarantined advocate rows for replacement planning

County-diagnosis promotion planning now also has a generated artifact:

```bash
npm run audit:county-diagnosis-rollout
```

It writes a repo-native rollout queue under `docs/generated/` showing:

- per-state priority county counts
- which priority counties are already high-fidelity
- which priority counties are still missing
- a first-wave near-gold promotion queue

The reconciled strict state ledger now also has a generated registry:

```bash
npm run audit:truth-registry
```

It writes a repo-native truth registry under `docs/generated/` showing, per state:

- `publicSafe`
- `indexSafe`
- legacy gold verdict versus strict gold verdict
- county-diagnosis rollout blockers
- advocate truth-collapse blockers

## Current Public Surface

`/find-help` now exposes a live directory foundation section backed by the current DB:

- aggregate counts
- structured coverage counts
- trust warning counts
- sample public-safe records showing only real structured fields

This is a foundation pass, not a full end-user search experience.
