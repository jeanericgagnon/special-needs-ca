# Master Gap Closure Plan

Generated: 2026-06-17

This is the canonical answer to:

- where are we really short on information?
- what artifacts should we trust for that answer?
- what exact work closes the remaining gaps?
- what order should we do it in with low token spend?

## Canonical Rule

For "all information we need" planning, use these artifacts first:

- [full-information-gap-audit-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/full-information-gap-audit-2026-06-17.md)
- [information-inventory-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/information-inventory-2026-06-17.md)
- [source-acquisition-completion-plan-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/source-acquisition-completion-plan-2026-06-17.md)
- [missing-source-families-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/missing-source-families-2026-06-17.md)
- [master-source-target-ledger-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/master-source-target-ledger-2026-06-17.md)
- [lightweight-source-acquisition-staging-status-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/lightweight-source-acquisition-staging-status-2026-06-17.md)

Use these with caution for exhaustive planning:

- `information-completeness-audit-2026-06-17`
- `information-confidence-audit-2026-06-17`
- `current-truth-audit-2026-06-17`

Why: those are useful for public-safe/model-complete bars, but they currently overstate how close the repo is to a truly exhaustive all-info product.

## Honest Current Read

- Programs, forms, county offices, DD routing, and education routing are structurally strong.
- Nonprofit coverage is broad, and the scrape universe for nonprofits is already large.
- Providers remain the biggest visible information gap.
- Advocates have meaningful volume, but truth-safe locality and county mapping are still weak.
- Directory metadata exists in schema, but live availability/accessibility/intake depth is still sparse.
- Organization -> program -> location normalization exists, but is not yet the dominant operating layer.
- Knowledge content exists, but article depth is still small.
- Workflow, collaboration, user-submission, and feedback-loop tables are mostly scaffolding, not mature product depth.

## What "Done" Means

The repo should only be considered "set up to close all gaps" when all of the following are true:

- every major information family has either:
  - a scrape-ready source queue, or
  - an authored missing-family plan with named first-party targets
- lightweight scraping can run family-by-family without Codex needing to inspect bulk outputs
- validated rows are filtered by public-safe rules before staging or promotion
- local directory families have safe locality semantics:
  - providers: address + county-backed where needed
  - nonprofits: physical presence vs service-area evidence separated correctly
  - advocates: state/county scope inferred conservatively and not overstated
- missing competitive layers have real source packs:
  - housing
  - goods/supplies
  - jobs/vocational
  - legal aid
  - transport/utilities/food
- fake/generated official domains are repaired or quarantined
- the pipeline can rerun repeatedly with compact summaries and saved artifacts

## The Remaining Gaps

### Tier 1: Critical information gaps

- Providers and care listings
- First-party advocate and legal-support sources
- Competitive help layers: housing, goods, jobs, legal, transport, utilities, food
- Repair generated fake official domains
- Exact forms libraries for most states

### Tier 2: High-value depth gaps

- Directory foundation metadata:
  - availability
  - accessibility
  - intake
  - capacity
  - next-step claims
- Knowledge article source families

### Tier 3: Structural but not immediate public blockers

- Org -> program -> location normalization depth
- Family workflow/runtime data
- User submissions, coverage gaps, verification loops
- Collaboration/care-coordination product layers

## Existing Queue Strength

From the current source-acquisition completion artifacts:

- combined unique ready rows: `3976`
- ready lightweight rows: `3432`
- ready JS-heavy rows: `350`
- ready PDF rows: `191`
- source families still needing authoring: `7`

This means the repo is already far enough along that the next bottleneck is not "find anything to scrape."
The bottleneck is:

- finishing the missing source families
- improving family-specific parsers and validators
- closing locality semantics so staged data can become trustworthy public data

## Execution Order

### Phase 1: Lock the canonical scoreboard

Goal:
- avoid using optimistic completeness outputs as the main steering signal

Actions:
- treat this document plus the full information gap audit as the canonical planning layer
- keep truth/public-safe audits as a separate gate, not the exhaustive-information scoreboard
- keep saving every major run as an artifact, not chat memory

Definition of done:
- future work references this document first when deciding what to fill next

### Phase 2: Finish the scrape universe

Goal:
- make sure every major information family has a real source pack

Actions:
- author competitive help source packs for:
  - housing
  - goods/supplies
  - jobs/vocational
  - legal aid
  - transport/utilities/food
- replace advocate-heavy directory seeds with first-party advocate/legal sources
- repair fake/generated official domains across forms, offices, DD, waivers, and early intervention

Definition of done:
- no major family remains "we know we need it, but we do not yet have exact targets"

### Phase 3: Finish low-token acquisition coverage

Goal:
- pull as much truthful source data as possible outside Codex

Actions:
- continue running lightweight batches first
- reserve Playwright only for `ready_js_heavy`
- reserve document extractors for `ready_pdf`
- keep artifacts saved under `data/source-acquisition-runs/`
- keep compact summaries only:
  - counts
  - failures
  - missing fields
  - schema errors
  - sample rows

Definition of done:
- scrape-ready queue is largely exhausted into saved artifacts

### Phase 4: Close parser and validator weak spots

Goal:
- reduce junk acceptance and improve state/locality extraction

Actions:
- keep strengthening family-specific extractors:
  - providers
  - advocates
  - nonprofits
  - official office/routing pages
- require stronger relevance signals for advocate/legal pages
- continue provider address extraction improvements
- continue domain-level nonprofit evidence classification

Definition of done:
- accepted records are mostly high-signal before staging

### Phase 5: Close locality and truth semantics

Goal:
- prevent misleading local claims

Actions:
- providers:
  - geocode real addresses
  - infer county only when evidence is strong
- nonprofits:
  - preserve distinction between org-level office evidence and county-local in-person evidence
- advocates:
  - keep conservative state inference
  - add county inference only where direct address or county evidence exists
  - do not imply local county support from one statewide or multistate page

Definition of done:
- staged rows carry locality claims that are safe to reason about

### Phase 6: Expand metadata richness

Goal:
- make listings more useful, not just present

Actions:
- populate availability, accessibility, intake, languages, virtual/in-person, and next-step fields where first-party evidence exists
- do not infer these fields weakly
- prefer reusable domain pipelines over row-by-row edits

Definition of done:
- directory richness grows without weakening trust

### Phase 7: Promote only what clears the bar

Goal:
- move from staging to public-safe production rows carefully

Actions:
- keep promotion conservative and scripted
- prefer duplicate detection and manual-review queues over forced promotion
- re-run audits after each wave

Definition of done:
- production layers improve while truth audits stay green

## Family-by-Family Plan

### Providers

Current state:
- biggest visible information gap
- lightweight provider pipeline exists
- provider geocoding exists
- provider staging preservation exists

Next actions:
- keep scraping named first-party provider targets
- improve address extraction further
- geocode and county-map what is salvageable
- expand first-party provider source packs by state

Success bar:
- every state has a meaningful public-safe provider layer

### Advocates

Current state:
- parser hardening is underway
- accepted lightweight advocate set was cut from `936` to `430`
- `192` accepted advocate rows now carry concrete single-state scope
- county-safe promotion is still blocked

Next actions:
- build advocate county inference only from direct evidence
- keep replacing weak directory-style sources with first-party sources
- continue relevance filtering

Success bar:
- advocate rows are truthful, scoped, and not overstated locally

### Nonprofits

Current state:
- broadest local directory family
- domain-level accessibility pipeline exists
- evidence-level semantics now matter

Next actions:
- continue high-volume domain processing only through hardened domain pipelines
- enrich metadata only from first-party evidence
- avoid broad local in-person claims from org-level evidence

Success bar:
- nonprofit breadth stays large while local claims remain safe

### Official routing and forms

Current state:
- structurally strong
- California exact source-target pack now exists
- many exact targets still blocked by fake/generated domains or weak target quality

Next actions:
- repair target packs
- replace fake domains with official ones
- expand PDF/document extraction coverage for forms

Success bar:
- every state family has real official source coverage, not synthetic placeholders

### Competitive help layers

Current state:
- modeled in product direction
- target inventory still thin

Next actions:
- author state-by-state source packs for housing, goods, jobs, legal, transport/utilities/food
- prioritize first-party and official sources
- build lightweight parsers before large-scale scraping

Success bar:
- these layers are part of the same repeatable pipeline, not side notes

## Lowest-Token Operating Rules

- never use Codex to manually inspect bulk scraped data
- save full outputs to files
- print only summaries and sample rows
- prefer deterministic scrapers over ad hoc chat analysis
- use lightweight HTTP parsing by default
- use Playwright only when required
- keep dry-run, validation, and staging layers separate
- only promote when evidence clears public-safe rules

## Immediate Next Actions

1. Finish authored source packs for housing, goods, jobs, legal, and transport/utilities/food.
2. Expand named first-party provider source packs by state.
3. Build advocate county-inference logic with conservative locality rules.
4. Repair fake/generated official-domain targets for forms, offices, DD, waivers, and early intervention.
5. Keep exhausting the `ready_lightweight` queue before spending more effort on JS-heavy sources.

## Working Definition Of Success

We are not trying to prove that every state is already complete.
We are trying to make the repo capable of getting there cheaply and truthfully.

That means success is:

- complete source universe
- low-token repeatable scraping
- strong validation
- safe locality semantics
- conservative promotion
- saved artifacts
- truthful public output
