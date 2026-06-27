# Exhaustive Gap Master

Generated: 2026-06-27

This is the canonical pause-and-realign artifact for the repo.
It separates three different ideas that were getting conflated:

- modeled 50-state completeness on the current audit bar
- public-truth / strict-gold readiness
- truly exhaustive product information depth

## Executive Truth

- Modeled info-complete states on the current audit bar: 0/50
- High-confidence states on the current audit bar: 0/50
- Strict-gold states on the truth registry: 0/50
- Public-safe but still blocked states: 1/50
- Bottom line: The repo has broad launch-safe state coverage, but 0/50 states currently satisfy the stricter modeled-completeness audit and the product is still far from exhaustive across all information types it implies.

## What We Already Have

- Major information layers modeled in repo: 13
- Programs: 507
- Program eligibility rules: 303
- Program document requirements: 502
- Program application steps: 992
- Program appeals: 451
- Program waitlists: 165
- County offices: 3678
- State routing agencies: 636
- Regional education agencies: 313
- School districts: 3117
- Providers: 96
- Nonprofits: 29501
- Advocates: 2995
- Organizations: 36902
- Organization-program links: 36902
- Service locations: 94
- Office locations: 4314
- Virtual service areas: 33130
- Conditions: 78
- Functional needs: 18
- Age bands: 7
- Insurance types: 4
- Knowledge articles: 23

## What The Current 50-State Audits Mean

- They do show that the repo has national state coverage for the current truth-first public bar.
- They do not show that every product information category is deep, rich, or exhaustive.
- They do not show that local provider/help discovery is complete enough to compete on care, housing, goods, jobs, legal, or education support depth.

## National Gap Matrix

| Layer | Current State | Exhaustive Status | Evidence | Main Gap |
| --- | --- | --- | --- | --- |
| Programs, forms, appeals, and waitlists | broad | broad_but_not_exhaustive | 507 programs, 992 steps, 451 appeals, 165 waitlists across 50 states. | Waitlist depth is materially shallower than the rest of the program layer. |
| DD routing, county offices, and education routing | broad | broad_but_not_exhaustive | 3678 county offices, 636 state routing agencies, 313 regional education agencies, 3117 school districts. | Routing exists nationally, but regional education depth is still not fully even across all states and counties. |
| Local providers, clinics, therapists, and care | thin | critical_gap | 96 public provider rows and 23 staged provider rows across all 50 states. | This is the biggest information hole if the goal is all local help, especially to compete on care and treatment discovery. |
| Nonprofit coverage quality and local utility | broad | broad_but_not_exhaustive | 29501 nonprofit rows across 50 states. | Coverage is broad, but accessibility, capacity, and local in-person truth signals are still sparse. |
| Advocates and legal/IEP support | moderate | meaningful_but_not_exhaustive | 2995 advocate rows, with California still blocked in strict gold because 58 counties lose advocate coverage after truth gating. | Advocate count is decent, but truth-safe local coverage is not yet strong enough to call exhaustive. |
| Findhelp-like metadata: availability, accessibility, intake, capacity | modeled | partial | Provider accessibility booleans with true signal: accepts_medi_cal 27/96; interpreter_available 22/96; asl_available 12/96; wheelchair_accessible 5/96; virtual_services 18/96; in_person_services 70/96; home_visits 3/96; transportation_help 9/96 Nonprofit accessibility booleans with true signal: interpreter_available 0/29501; asl_available 0/29501; wheelchair_accessible 0/29501; virtual_services 1/29501; in_person_services 22/29501; home_visits 0/29501; transportation_help 0/29501 Advocate accessibility booleans with true signal: interpreter_available 0/2995; asl_available 0/2995; wheelchair_accessible 0/2995; virtual_services 2/2995; in_person_services 0/2995; home_visits 0/2995; transportation_help 0/2995 | The schema exists, but live high-signal metadata is sparse, especially on nonprofits and advocates. |
| Canonical org -> program -> location normalization | present | partial | 36902 organizations, 36902 org-program links, 94 service locations, 4314 office locations, 33130 virtual service areas. | Normalization exists, but service-location depth is still too thin to support a fully location-rich help product. |
| Conditions, functional needs, age bands, insurance types | mixed | broad | 78 conditions, 18 functional needs, 7 age bands, 4 insurance types. | Conditions, needs, age bands, and insurance reference tables are all present, though broader knowledge depth is still driven by the article layer. |
| Help content and explanatory knowledge | thin | critical_gap | 23 knowledge articles, 8 staged knowledge articles. | The content layer is still far too small for the full family journey nationally, but staged knowledge growth is now present and measured. |
| Family workflow, case tracking, reminders, and documents | demo_only | not_started | 5 total family-case-layer rows across 8 tables; most tables are empty. | The runtime workflow model exists but is not populated as a real product layer. |
| Support planning, collaboration, and care coordination | empty | not_started | 0 total rows across planning/collaboration tables. | This entire product surface is still schema-only in practice. |
| User submissions, coverage gaps, verification queue | minimal | critical_gap | 0 user submissions, 0 coverage gaps, 2 verification queue items. | Operational feedback loops are not built out enough to sustain exhaustive maintenance. |

## Full-Gap Layer Readout

### Programs, waivers, appeals, forms, and waitlists

- Current audit status: substantial
- Exhaustive interpretation: broad_but_not_exhaustive
- Evidence: 507 programs across 50/50 states
- Evidence: 303 eligibility rules
- Evidence: 502 document requirements
- Evidence: 992 application steps
- Evidence: 451 appeal records
- Evidence: 165 waitlist records
- Gap: Program foundation is strong, but waitlist depth is still smaller than the rest of the program layer.

### County offices, DD routing, and education routing

- Current audit status: partial
- Exhaustive interpretation: partial
- Evidence: 3678 county offices across 50/50 states
- Evidence: 636 state routing agencies across 50/50 states
- Evidence: 313 regional education agencies across 47/50 states
- Evidence: 3117 school districts across 50/50 states
- Gap: Routing layers are broadly populated, but density and local depth still vary by state and county.

### Local nonprofit support organizations

- Current audit status: substantial
- Exhaustive interpretation: broad_but_not_exhaustive
- Evidence: 29501 nonprofit listings across 50/50 states
- Gap: Nonprofit coverage is broad, but foundation metadata like accessibility and live capacity is still sparse.

### IEP advocates and advocacy support

- Current audit status: thin
- Exhaustive interpretation: thin
- Evidence: 2995 advocate listings
- Gap: Advocate count is strong, but truth quality and public eligibility still need to stay under active audit.

### Clinics, therapists, and local providers

- Current audit status: partial
- Exhaustive interpretation: partial
- Evidence: 96 provider listings across 50/50 states
- Evidence: 125 staged provider rows waiting in provider staging
- Gap: Provider coverage is the clearest national information gap. This layer exists, but it is nowhere near all-state depth.

### Findhelp-like metadata on directory listings

- Current audit status: partial
- Exhaustive interpretation: partial
- Evidence: Schema support exists for tags, availability, next steps, accessibility, claims, and trust fields on providers, nonprofits, and advocates.
- Evidence: Those fields sit on 32592 directory rows total.
- Gap: The metadata model exists, but live availability, accessibility, and capacity signals are still sparse on the checked-in DB.

### Organization -> program -> location normalization

- Current audit status: thin
- Exhaustive interpretation: thin
- Evidence: 36902 organizations
- Evidence: 36902 organization-program links
- Evidence: 94 service locations
- Evidence: 4314 office locations
- Evidence: 33130 virtual service areas
- Gap: This migration landing zone is modeled in schema but not yet populated in the checked-in DB.

### Conditions, functional needs, and reference knowledge

- Current audit status: substantial
- Exhaustive interpretation: broad_but_not_exhaustive
- Evidence: 78 conditions
- Evidence: 18 functional needs
- Evidence: 7 age bands
- Evidence: 4 insurance types
- Gap: No major structural gap detected in this layer.

### Knowledge articles and guidance content

- Current audit status: partial
- Exhaustive interpretation: partial
- Evidence: 23 knowledge articles
- Evidence: 8 staged knowledge articles
- Gap: Knowledge content exists and staged growth is underway, but live article volume is still small relative to the breadth of the rest of the information model.

### Family, case, and navigator-adjacent workflow data

- Current audit status: demo_only
- Exhaustive interpretation: demo_only
- Evidence: 1 family cases
- Evidence: 1 child profiles
- Evidence: 0 case program status rows
- Gap: The schema supports family/case workflows, but the checked-in DB mostly shows demo-level or empty runtime data.

### User submissions, coverage gaps, and feedback loops

- Current audit status: modeled_only
- Exhaustive interpretation: modeled_only
- Evidence: 0 user-submitted resources
- Evidence: 0 coverage gap records
- Gap: These operational loops are modeled but not populated in the checked-in DB snapshot.

## Most Important Corrections To Our Mental Model

- 50/50 modeled completeness does not mean all information categories are deeply built out.
- 0/50 strict-gold states means 1 state still sits in the public-safe-but-blocked lane on the stricter truth registry.
- Provider coverage and knowledge-content depth are still the largest visible product information gaps.
- Directory metadata exists in schema, but most nonprofit and advocate rows still lack rich accessibility and capacity signals.
- Several workflow and support layers are still mostly empty despite having schema support.

## Immediate Recommendation

- Yes, pause broad scraping long enough to treat this artifact as the canonical exhaustive gap list.
- Keep using the low-token pipeline, but only against gaps in the critical and partial categories above.
- The biggest missing product information areas are providers/care, knowledge content, rich directory metadata, and the still-empty workflow/support layers.
- California remains the only strict-gold exception right now because advocate truth gating still drops coverage in 0 counties.
