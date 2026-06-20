# Missing Source Families

Generated: 2026-06-17

This artifact lists the source families we still need to author because scraping the current ready queue will not fully close the remaining product gaps.

## Why This Exists

- `scrape-now-only` tells us what we can crawl immediately.
- This file tells us what target families we still have to create so the scrape universe becomes actually complete.

## Critical Exhaustive Gaps

- Local providers, clinics, therapists, and care: This is the biggest information hole if the goal is all local help, especially to compete on care and treatment discovery.
- Advocates and legal/IEP support: Advocate count is decent, but truth-safe local coverage is not yet strong enough to call exhaustive.
- Findhelp-like metadata: availability, accessibility, intake, capacity: The schema exists, but live high-signal metadata is sparse, especially on nonprofits and advocates.
- Canonical org -> program -> location normalization: Normalization exists, but service-location depth is still too thin to support a fully location-rich help product.
- Conditions, functional needs, age bands, insurance types: Conditions and needs are strong, but age-band and insurance reference tables are still empty.
- Help content and explanatory knowledge: The content layer is far too small for a product that aims to cover the full family journey nationally.
- Family workflow, case tracking, reminders, and documents: The runtime workflow model exists but is not populated as a real product layer.
- Support planning, collaboration, and care coordination: This entire product surface is still schema-only in practice.
- User submissions, coverage gaps, verification queue: Operational feedback loops are not built out enough to sustain exhaustive maintenance.

## Gap Family Coverage Snapshot

- nonprofit_support: total=1396, ready=1293, blocked=0, discovery=103, manual=0, trustedMissingRows=34009
- providers_care: total=199, ready=163, blocked=32, discovery=0, manual=4, trustedMissingRows=0
- programs_benefits: total=83, ready=47, blocked=36, discovery=0, manual=0, trustedMissingRows=0
- parent_training_nonprofits: total=67, ready=25, blocked=42, discovery=0, manual=0, trustedMissingRows=0
- condition_nonprofits: total=61, ready=18, blocked=42, discovery=0, manual=1, trustedMissingRows=0
- geography_counties: total=59, ready=48, blocked=11, discovery=0, manual=0, trustedMissingRows=0
- general_gap_fill: total=58, ready=58, blocked=0, discovery=0, manual=0, trustedMissingRows=0
- transition_programs: total=57, ready=17, blocked=40, discovery=0, manual=0, trustedMissingRows=0
- dd_routing: total=55, ready=14, blocked=41, discovery=0, manual=0, trustedMissingRows=0
- waivers: total=53, ready=13, blocked=40, discovery=0, manual=0, trustedMissingRows=0
- medicaid_hhs_offices: total=50, ready=10, blocked=40, discovery=0, manual=0, trustedMissingRows=0
- early_intervention_programs: total=50, ready=10, blocked=40, discovery=0, manual=0, trustedMissingRows=0
- education_routing: total=50, ready=14, blocked=36, discovery=0, manual=0, trustedMissingRows=0
- source_registry: total=49, ready=39, blocked=10, discovery=0, manual=0, trustedMissingRows=0
- advocates_legal: total=44, ready=1, blocked=43, discovery=0, manual=0, trustedMissingRows=0
- forms_guides: total=43, ready=3, blocked=40, discovery=0, manual=0, trustedMissingRows=0

## Source Families To Author

### First-party advocate and legal-support sources

- severity: high
- reason: Current advocate/legal targets are overwhelmingly quarantined COPAA-style directories and need replacement with first-party or official sources.
- needed for: IEP advocates, special education legal aid, dispute resolution support

### Exact forms libraries for most states

- severity: high
- reason: Only 1 forms source is currently scrape-ready; most state form targets are blocked by fake-domain patterns or still too weak.
- needed for: Medicaid forms, special education forms, appeal forms, guide downloads

### Repair generated fake official domains

- severity: critical
- reason: Many state office, DD, waiver, early intervention, and form targets are blocked because the repo currently has generated fake official domains.
- needed for: county offices, DD routing, waivers, early intervention, forms, transition

### More named first-party provider targets

- severity: critical
- reason: Provider coverage is still the biggest visible info gap even after the ready provider URLs are scraped.
- needed for: clinics, therapy centers, hospital specialty programs, developmental pediatrics, diagnostic centers

### Knowledge article source families

- severity: medium
- reason: The product needs many more explanatory content inputs, but the current target inventory is mostly directory/routing oriented.
- needed for: waiver explainers, school rights, respite, transition, appeals, condition journeys

