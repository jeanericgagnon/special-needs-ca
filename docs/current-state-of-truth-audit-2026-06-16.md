# Current State-Of-Truth Audit

Date: 2026-06-16

## Scope

This audit answers four questions against the current repo state, not the older rollout narratives:

1. What is the site now?
2. What is the product trying to do?
3. Is California actually the gold standard today?
4. Where are the biggest state-by-state gaps and integrity risks?

Evidence was taken from the live application code, the checked-in SQLite databases, and the repo's current audit scripts.

Supporting generated artifacts:

- [docs/generated/current-truth-audit-2026-06-16.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/current-truth-audit-2026-06-16.md:1)
- [docs/generated/current-truth-audit-2026-06-16.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/current-truth-audit-2026-06-16.json:1)

## What The Site Is

Ablefull is currently a public-facing, 50-state caregiver guidance product with two major surfaces:

- A benefits wizard and public resource directory, driven from the homepage and county/state benefit pages.
- An authenticated caregiver dashboard that stores child profiles, matched programs, local resources, reminders, checklists, IEP data, respite data, and waiver status tracking.

Current code evidence:

- The homepage markets the product as a "50-State Disability Benefits Guide" and loads counties plus waitlist data into the wizard: [frontend/src/app/page.tsx](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/page.tsx:11)
- The wizard is state-aware, defaulting to California but collecting state, county, diagnosis, financial qualifiers, and generating benefit analyses: [frontend/src/app/wizard-client.tsx](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/wizard-client.tsx:18)
- The dashboard is not a simple read-only directory. It loads matched programs, county details, advocates, waivers, checklist items, reminders, and child-specific IEP/respite data: [frontend/src/app/dashboard/page.tsx](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/dashboard/page.tsx:63)

## Product Intent

The product intent in current code is broader than "directory of offices."

The site is trying to be a parent action system:

- discover likely programs by child profile
- route families to local agencies and local school structures
- explain waitlists and financial value
- provide forms, appeals, and planning tools
- support ongoing caregiver workflow through a dashboard

The repo README is directionally correct that this is a "50-state disability benefits and resource directory," but it understates how much the current app also acts like a personalized care planning product.

## Executive Findings

### 1. Public county-diagnosis pages still render fake local resources for most counties

Severity: critical

The strongest integrity problem is not in the database. It is in the public page renderer.

For most county-diagnosis pages, the app still injects hardcoded local asset cards with fake names, synthetic addresses, and `(555)` phone numbers:

- default playground: `Inclusive Play Space`
- default support group: `Family Resource Center Network`
- default therapy clinic: `Pediatric Therapy Hub`

Code evidence:

- Fake fallback values begin here: [frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx:129)
- Only Los Angeles and Orange override those defaults with real examples: [frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx:156)

Impact:

- This undermines the entire trust model even if the underlying database is clean.
- The page can appear locally verified while showing fabricated public-facing resources.
- This is incompatible with any "gold standard" claim.

### 2. California is the strongest baseline, but not a true gold standard yet

Severity: high

California still appears to be the strongest state in the system, but only as a structural baseline, not as a fully verified gold standard.

Evidence:

- `npm run audit:state-standard -- california` reports a `98.9%` completeness score and classifies California as `Exhaustive & Launchable`.
- `npm run audit:state-depth -- california` reports:
  - Pilot Launch Score: `97.8%`
  - Structural Coverage Score: `95.7%`
  - Verified-Depth Score: `90.3%`
  - Overall Depth Score: `81.3%`

Category evidence from the California depth audit:

- `medicaidOffices`: `77.5%`
- `education`: `77.5%`
- `nonprofits`: `77.5%`
- `waitlists`: `93.0%`

Those scores are lower because several California layers are structurally complete but still only `source_listed`, not fully human-verified.

Live verification-status evidence in California:

- `state_resource_agencies`: `official_verified` = 21
- `iep_advocates`: `verified` = 580
- `county_offices`: `source_listed` = 174
- `school_districts`: `source_listed` = 80
- `nonprofit_organizations`: `source_listed` = 871
- `regional_education_agencies`: `source_listed` = 62

Interpretation:

- California's DD routing and advocate layer are the closest thing to launch-grade gold.
- California's offices, education layer, and nonprofits are complete and usable, but still not fully human-verified.
- That makes California the best baseline in this repo, but not the final reference model.

### 3. California waitlist coverage is incomplete even under its own core-program definition

Severity: medium

The California state-standard audit marks waitlists as partial, and the current DB confirms why.

Expected California core waitlist programs:

- `ihss-for-children`
- `regional-centers`
- `early-start`
- `self-determination-program`
- `medi-cal-for-kids-and-teens`
- `california-childrens-services`
- `hearing-aid-coverage`
- `ssi-for-children`
- `calable`
- `iep-special-education`
- `hcba`

Present in `program_waitlists` today:

- `hcba`
- `regional-centers`
- `ihss-for-children`
- `ssi-for-children`
- `california-childrens-services`

Missing today:

- `early-start`
- `self-determination-program`
- `medi-cal-for-kids-and-teens`
- `hearing-aid-coverage`
- `calable`
- `iep-special-education`

This aligns with the California standard audit output showing the waitlist layer as partial.

### 4. Historical rollout docs are stale and cannot be used as source-of-truth

Severity: high

The docs corpus is extensive, but many documents reflect older rollout states that no longer match the live code or DB.

Evidence:

- The repo already labels [docs/national-rollout/final-national-status-ledger.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/national-rollout/final-national-status-ledger.md:1) as `SUPERSEDED / DO_NOT_USE_FOR_EXECUTION`.
- The same file explicitly says older metrics are stale and contradict database reality.
- [docs/national-rollout/california-gold-standard-gap-analysis.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/national-rollout/california-gold-standard-gap-analysis.md:1) still frames California as the gold baseline and discusses older fallback/mock-number narratives that do not fully match the current audited DB state.

Current repo behavior also contradicts older narrow-indexing narratives:

- The sitemap now includes all CA county roots that pass the CA quality gate plus a huge non-CA verified county allowlist: [frontend/src/app/sitemaps/counties.xml/route.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/sitemaps/counties.xml/route.ts:84)
- `frontend/src/lib/verifiedCounties.ts` currently contains about `3,036` non-CA counties.

Conclusion:

- Old docs are useful as history, not authority.
- The authoritative state is current code plus the current SQLite DB.

### 5. California is no longer the only meaningful public surface

Severity: medium

The current product has already moved beyond a California-first public release posture.

Evidence:

- `NON_CA_VERIFIED_COUNTIES` contains about `3,036` counties.
- The current county sitemap logic includes those non-CA county roots directly: [frontend/src/app/sitemaps/counties.xml/route.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/sitemaps/counties.xml/route.ts:88)
- County x diagnosis leaves are still more restricted, and California remains special-cased there, especially with only Los Angeles and Orange allowed as high-fidelity CA diagnosis leaves: [frontend/src/app/sitemaps/counties.xml/route.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/sitemaps/counties.xml/route.ts:181)

Interpretation:

- California is still a reference implementation.
- But the current site is already operating as a broad national county-directory product.
- Any audit or roadmap that still assumes "California first, everyone else mostly gated" is outdated.

## State Comparison

### California vs Texas

Texas is structurally deeper by raw volume:

- counties: `254`
- real offices: `254`
- real districts: `1059`
- real nonprofits: `4505`

But Texas is weaker in verified depth:

- `npm run audit:state-depth -- texas`
  - Pilot Launch Score: `80.0%`
  - Verified-Depth Score: `81.8%`
  - Overall Depth Score: `65.1%`
- Texas also has a trust metadata issue in `state_resource_agencies`: `39` Texas rows have null `verification_status`.
- Texas school districts include `795` `manual_review_required` records in the standard audit output.

Bottom line:

- Texas is the largest and one of the deepest structural datasets.
- California is still ahead on trust depth and maturity.

### California vs New York

New York is also structurally deep:

- counties: `62`
- real districts: `742`
- real nonprofits: `1403`
- real providers: `287`

But New York trails California in verified depth:

- `npm run audit:state-depth -- new-york`
  - Pilot Launch Score: `80.0%`
  - Verified-Depth Score: `82.7%`
  - Overall Depth Score: `64.2%`
- Standard audit flags:
  - Medicaid/HHS offices: `requires_human_review`
  - Education: `partial`

Bottom line:

- New York is stronger than many other states.
- California is still meaningfully ahead in trusted readiness.

### Relative Positioning

Based on current code and DB, the honest ranking is:

1. California is the strongest trust baseline.
2. Florida is currently the strongest non-California state on the generated trust-weighted composite, with Texas close behind.
3. Texas and New York are structurally larger than California in some layers, but weaker on verified depth.
4. Many other states have broad coverage, but high `source_listed`, null-status, or low-depth dependence.

So the right statement is not "California is gold standard."

The right statement is:

California is the best current baseline, but it is still a partially verified, partially legacy implementation and should not be treated as a finished gold standard.

The generated matrix currently ranks the top five states by composite readiness as:

1. California: `85.6%`
2. Florida: `77.2%`
3. Texas: `76.4%`
4. Georgia: `74.6%`
5. New York: `74.5%`

## Important Contradictions In Current Quality Logic

### Source-listed data is often scored too generously

The standard audit can mark categories `COMPLETE` even when the records are mostly `source_listed`, not verified by humans. That is why California can score `98.9%` while its deeper audit still pulls major categories down into the high 70s.

This is not a data problem alone. It is also a scoring-model honesty problem.

### Zero fallback does not equal high trust

Several quick metrics show `fallbackCount: 0` for California, Texas, New York, and others. That is not enough to support a gold-standard claim.

What matters more is:

- verification status
- public rendering integrity
- presence of manual-review-required records
- whether pages are synthesizing fake "helpful" local content on top of otherwise real records

## Current Honest Assessment

### California

Status: best available baseline, not finished gold standard

Strengths:

- strongest verified trust mix among major states
- complete county routing structure
- strongest advocate layer
- strongest state-specific forms count
- strongest special handling in county quality gating

Weaknesses:

- public fake local map assets for most counties
- many public-contact layers still only `source_listed`
- incomplete waitlist coverage
- old "gold standard" docs no longer match current product scope

### National Rollout

Status: much more advanced than the older docs imply, but still uneven

Strengths:

- very large verified county allowlist already exists
- several states have substantial structural depth
- current app truly behaves like a national product

Weaknesses:

- public rendering integrity is not yet aligned with trust claims
- documentation is badly fragmented and partially stale
- many states have broad coverage without proportionate verification depth

## Recommended Next Actions

1. Remove or hard-disable fabricated local map/resource cards on county-diagnosis pages unless the content is source-backed.
2. Reclassify California internally from `gold standard` to `best current baseline`.
3. Make the depth audit, not the standard audit, the primary decision input for trust claims.
4. Build a single canonical state-of-truth ledger generated from the current DB and code, not from hand-written rollout notes.
5. Backfill California waitlist records for the missing six core programs.
6. Add a public-surface integrity audit for synthetic examples, hardcoded officials, and fake contact data.
7. Fix Texas `state_resource_agencies.verification_status` nulls so cross-state comparisons are not contaminated by schema inconsistency.

## Bottom Line

California is still the best state in the system for benchmarking because it has the strongest combination of coverage, routing, and trust metadata.

But it is not a true gold standard today.

The current repo proves three things:

- California is the best baseline.
- The site is already a national product, not a California-only pilot.
- The biggest current risk is not missing data volume. It is truthfulness at the public rendering layer.
