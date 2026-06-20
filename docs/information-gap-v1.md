# Information Gap V1

This document answers a different question than the truth registry.

The truth registry answers:

- can this state be shown publicly without fake or unsupported local output?
- can it be indexed safely?
- is it eligible for the current strict gold bar?

This gap document answers:

- how close is the repo to the fuller "all the information we want" foundation by information type?

Those are related, but they are not the same.

## Current Snapshot

Based on the generated 2026-06-17 artifacts:

- [docs/generated/information-inventory-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/information-inventory-2026-06-17.md)
- [docs/generated/information-completeness-audit-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/information-completeness-audit-2026-06-17.md)
- [docs/generated/information-confidence-audit-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/information-confidence-audit-2026-06-17.md)
- [docs/generated/current-truth-audit-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/current-truth-audit-2026-06-17.md)

Headline read:

- programs, forms, DD routing, county offices, and education are structurally very strong
- nonprofits are broadly present
- provider coverage is the main national missing layer
- advocate coverage is not a dependable national layer yet under the richer information-completeness bar
- normalization exists as a foundation, but not yet as the main public model
- family workflow and collaboration data exists in schema, but much of it is still sparsely populated

## Where We Are Vs Where We Need To Be

### 1. Geography and Coverage

Current:

- strong
- 50 states present
- full county inventory present
- county routing junctions present for DD, education, advocate, and virtual service areas

Need:

- keep coverage complete as the directory normalization layer becomes more real
- continue using junction coverage instead of fake county cloning

Main gap:

- not a coverage gap; this layer is already foundation-grade

### 2. Programs, Benefits, and Application Knowledge

Current:

- very strong
- core programs complete across all 50 states in current audit
- direct-verified core programs: 502/502
- program definitions, eligibility rules, application steps, appeal info, and waitlists are all modeled

Need:

- maintain truth and freshness
- continue filling any future state-specific nuance without regressing trust

Main gap:

- not a major foundation blocker right now

### 3. Public Administrative and Education Routing

Current:

- very strong
- DD routing county coverage complete
- county office coverage complete
- education contact coverage complete
- direct-verified education county coverage: 3094/3094

Need:

- preserve truth metadata consistency
- keep district fallback logic from drifting into low-confidence broad layers

Main gap:

- not a major national foundation blocker right now

### 4. Local Directory Layers

Current:

- uneven
- nonprofits are present and publicly safe
- providers are the main national gap
- advocates are strong in a small set of states, but not yet a stable nationwide rich-information layer

Need:

- a real public-safe provider layer in the 43 states that currently have none
- a clearer, source-backed advocate strategy instead of fragile or synthetic-looking local advocate data

Main gap:

- this is the biggest foundation gap in the repo today

Evidence:

- 43 states are missing any public-safe provider layer in the 2026-06-17 completeness audit
- 7 states are fully info-complete under the current completeness audit because providers, nonprofits, and advocates all clear the current bar there
- California is the only state with an advocate truth gap after truth gating
- only 7 states land in the high-confidence tier once local directory truth is included

### 5. Directory Foundation Metadata

Current:

- schema and validation support are strong
- service tags, serving tags, availability, next-step, accessibility, claim groundwork, and trust metadata are modeled
- rendering rules and validators are already truth-first

Need:

- much broader population of those fields in real directory rows
- especially accessibility and live intake/capacity details

Main gap:

- the model support exists, but field population is still thin in live data

Evidence:

- the inventory shows zero true-signal coverage for many accessibility booleans across providers, nonprofits, and advocates

### 6. Normalization Foundation

Current:

- present as a landing zone
- `organizations`, `organization_program_links`, `service_locations`, `office_locations`, `virtual_service_areas`, and `virtual_service_area_counties` exist

Need:

- controlled migration of real directory data into org -> program -> location shape
- without forcing a public-route rewrite too early

Main gap:

- modeled, but not yet the main operating layer

### 7. Disability Knowledge and Reference

Current:

- strong
- 78 conditions present
- 18 functional needs present
- knowledge categories exist for school, IHSS, waivers, appeals, transition, and therapy/medical

Need:

- keep expanding depth only where it improves parent usefulness

Main gap:

- no major foundation blocker right now

### 8. Family and Navigator Workflow Data

Current:

- schema exists
- some base family and child profile tables are present
- actual population is still light

Need:

- treat this as future navigator leverage, not current public-directory leverage

Main gap:

- populated lightly enough that it should not be treated as a finished product layer

### 9. Family Support, Planning, and Collaboration

Current:

- mostly scaffolded
- tables exist for coordination, clinical docs, IEP goals/accommodations, respite assessments, and consultation threads

Need:

- future population and product decisions

Main gap:

- this is not the main competitive-foundation blocker for SEO or public directory quality today

### 10. Knowledge Content

Current:

- present but still relatively small
- bilingual structured knowledge article layer exists

Need:

- continue growing only where it reinforces routing, next steps, and search usefulness

Main gap:

- more of a scale gap than a structural gap

### 11. Source, Review, and Operations Layers

Current:

- good structural foundation
- source registry, verification queue, and coverage-gap scaffolding exist

Need:

- stronger use of these layers to drive provider and advocate expansion safely

Main gap:

- operational follow-through, not missing schema

### 12. Staging and Promotion Layers

Current:

- strong
- staging tables exist for offices, education, nonprofits, advocates, providers, forms, waitlists, and sources

Need:

- use this machinery to fill the provider layer nationally
- avoid overusing it to promote low-confidence advocate rows

Main gap:

- promotion volume and curation strategy, not missing infrastructure

### 13. Truth and Public Eligibility Contract

Current:

- strong for the current public product bar
- 49 states are strict-gold eligible
- California is public-safe and index-safe but still blocked from gold due to advocate truth issues

Need:

- do not confuse this with "all information complete"
- keep strict truth gating while expanding rich local directory depth

Main gap:

- only one gold blocker remains under the current strict truth contract
- many richer-information gaps still remain under the broader foundation standard

## Bottom Line

If the question is:

- "Can we safely publish and index this without fake content?"

The answer is:

- mostly yes, with California still blocked from strict gold

If the question is:

- "Do all 50 states already have the fuller Findhelp-like directory depth we want?"

The answer is:

- no

The main missing information families are:

- real public-safe provider coverage across 43 states
- a dependable advocate strategy that survives truth gating
- richer field population for accessibility, availability, and intake metadata
- fuller practical use of the normalization layer

## Next Work That Actually Moves The Goal

1. Build the national public-safe provider layer for the 43 missing states using the existing staging and directory-truth pipeline.
2. Decide whether advocates remain a first-class national layer or become a narrower trusted-only layer until better source inputs exist.
3. Enrich live directory rows with real accessibility, availability, and next-step details instead of only carrying the schema.
4. Keep truth gating strict so new directory depth never comes from synthetic local filler.
