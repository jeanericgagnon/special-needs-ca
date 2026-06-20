# Current Information Audit

Generated: 2026-06-17

## Purpose

This audit answers the practical product question:

- what information do we actually have in the repo right now
- what is genuinely strong versus merely modeled
- what still needs real buildout before the product matches the broader "all-inclusive" vision

This is intentionally different from the truth registry and different from the optimistic completeness audit.

The completeness and confidence audits answer whether the current modeled bar passes.

This audit answers whether the repo is already deep across the major family-facing information categories the product aims to cover.

## Evidence Base

Primary generated artifacts used:

- [docs/generated/information-inventory-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/information-inventory-2026-06-17.md)
- [docs/generated/information-completeness-audit-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/information-completeness-audit-2026-06-17.md)
- [docs/generated/information-confidence-audit-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/information-confidence-audit-2026-06-17.md)
- [docs/generated/full-information-gap-audit-2026-06-17.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/full-information-gap-audit-2026-06-17.md)

Supporting live DB checks used:

- `frontend/ca_disability_navigator.db`
- direct counts on `resource_providers`, `nonprofit_organizations`, and `iep_advocates`
- parse-ready scrape summaries under `data/source-acquisition-runs/2026-06-17T16-58-43-900Z/parsed/`

## Executive Read

The repo is structurally broad and operationally much stronger than a simple state directory.

It is strongest in:

- statewide programs, waivers, forms, appeals, and application guidance
- county/state/routing coverage
- education routing infrastructure
- nonprofit footprint
- condition and functional-need taxonomy

It is weaker than the broader product vision in:

- local provider depth
- promoted housing, goods, jobs, independent living, and legal directory depth
- live accessibility and availability metadata on directory rows
- normalized org -> program -> location execution
- family workflow/runtime population
- knowledge article volume

Short version:

- the repo is "wide" and fairly trustworthy
- it is not yet uniformly "deep"
- the biggest gap is no longer state coverage
- the biggest gap is category depth in the richer family-support layers

## What We Have Strongly

### 1. Programs, Benefits, Forms, Appeals, and Waitlists

This is one of the strongest parts of the product.

- `programs`: 507
- `program_eligibility_rules`: 303
- `program_document_requirements`: 502
- `program_application_steps`: 992
- `program_appeal_info`: 451
- `program_waitlists`: 165

What that means:

- the repo already has a serious national benefits/program foundation
- forms and appeal guidance are not thin side content; they are core structured layers
- waitlists exist, but are shallower than the rest of the program foundation

Honest read:

- strong enough to support real guidance
- not yet exhaustive on waitlist depth

### 2. Geography, DD Routing, Offices, and Education Routing

This is also a strong area.

- `states`: 50
- `counties`: 3094
- `county_offices`: 3678
- `state_resource_agencies`: 636
- `regional_education_agencies`: 313
- `school_districts`: 3117

What that means:

- the repo has real national routing infrastructure
- education routing is one of the strongest family-facing practical layers
- this is much closer to real navigation infrastructure than to generic SEO scaffolding

Honest read:

- routing coverage is strong
- some local depth variance likely still exists even if the audit bar is passing

### 3. Nonprofit Support Layer

This is broad in count, even if metadata depth is still thin.

- `nonprofit_organizations`: 29501

What that means:

- there is already a large support-organization footprint
- this is a meaningful family-support layer, not a tiny demo

Honest read:

- strong in quantity
- still thin in live operational metadata like accessibility, intake, and capacity

### 4. Condition and Need Taxonomy

This foundation is strong.

- `conditions`: 78
- `functional_needs`: 18

What that means:

- the disability knowledge foundation is materially broader than a one-condition site
- there is enough taxonomy to support diagnosis and functional-need-aware flows

Honest read:

- strong base
- not the same thing as rich long-form guidance for every condition

## What We Have, But It Is Still Thin

### 1. Provider Layer

This is the clearest major gap relative to the broader vision.

- live `resource_providers`: 83
- staged `staging_scraped_resource_providers`: 102

What that means:

- the provider layer exists
- it is not close to the depth implied by a truly all-inclusive national support platform

This is especially important because many parent journeys eventually need:

- developmental pediatrics
- autism clinics
- therapy providers
- diagnostic centers
- specialized care

Honest read:

- present
- nationally thin
- still the biggest practical information gap

### 2. Knowledge Content

- `knowledge_articles`: 15

What that means:

- there is a structured content layer
- it is still small relative to the breadth of states, diagnoses, and workflows

Honest read:

- useful foundation
- not yet deep enough to carry the whole product narrative

### 3. Normalization Execution

The normalization model exists, but execution is still early.

- `organizations`: 36891
- `organization_program_links`: 36891
- `service_locations`: 83
- `office_locations`: 4314
- `virtual_service_areas`: 33130

What that means:

- the schema direction is there
- the public system is not yet clearly operating from a fully mature normalized org -> program -> location layer

Honest read:

- good foundation
- not yet a fully realized operating model

### 4. Directory Metadata Depth

Schema support is good, but live field population is thin.

Examples from the inventory:

- providers with `virtual_services=1`: 18/83
- providers with `wheelchair_accessible=1`: 5/83
- providers with `transportation_help=1`: 8/83
- nonprofits with `in_person_services=1`: 22/29501
- nonprofits with `virtual_services=1`: 1/29501
- advocates with `virtual_services=1`: 2/2995

What that means:

- the directory model supports findhelp-like richness
- the live promoted data does not yet populate those fields at findhelp-like depth

Honest read:

- the metadata system is ahead of the metadata population

## What Is Mostly Modeled Or Demo-Level

### 1. Family and Case Workflow

- `family_cases`: 1
- `child_profiles`: 1
- `case_program_statuses`: 0
- `document_checklist_items`: 0
- `reminders`: 0
- `child_waivers`: 0

### 2. Support, Planning, and Collaboration Tables

Mostly zero-row tables:

- safety incidents
- parent declarations
- caregiver profiles
- transition tasks
- self-care logs
- child coordinators
- clinical documents
- consultation threads/messages
- shared portal tokens
- IEP accommodations/goals
- respite assessments

### 3. User Feedback and Coverage Loop Tables

- `user_submitted_resources`: 0
- `coverage_gaps`: 0

Honest read:

- the schema points toward a much richer family workflow product
- the checked-in DB does not yet show real runtime depth there

## Competitive Category Audit

This section focuses on the categories the product wants in order to compete beyond a narrow disability-benefits surface:

- housing
- goods and supplies
- jobs and vocational support
- care and independent living
- education
- legal

### Education

Education is the strongest of these categories.

Evidence:

- `regional_education_agencies`: 313
- `school_districts`: 3117
- parsed education routing summary: 4 selected, 4 parsed in the lightweight scrape pass
- advocate directory is heavily education-oriented

Direct directory tag evidence:

- providers tagged `special_education`: 21
- advocates tagged `special_education`: 2995
- advocates tagged `iep_advocacy`: 2995

Read:

- education is real
- education is not the gap

### Care and Independent Living

This category is conceptually present but shallow in promoted depth.

Evidence:

- parsed `care_independent_living` summary: 1 selected, 1 parsed
- directory tags do not yet show meaningful promoted breadth for care-adjacent categories beyond therapy/provider records
- providers tagged `therapy`: 39

Read:

- some care-related provider depth exists
- independent-living and broader care-support content are still thin

### Legal

Legal exists mainly as taxonomy and scrape potential, not as a strong promoted directory layer.

Evidence:

- parsed `legal_aid` summary: 1 selected, 1 parsed
- promoted service tag counts: `legal_aid` appears on 1 advocate row, 0 nonprofit rows, 0 provider rows

Read:

- legal is not yet a real national product layer

### Housing

Housing is almost entirely a future buildout category in the current promoted data.

Evidence:

- parsed `housing` summary: 1 selected, 1 parsed
- promoted service tag counts: `housing` appears on 0 nonprofit rows, 0 provider rows, 0 advocate rows

Read:

- housing is modeled in taxonomy
- housing is not yet materially present in live promoted records

### Goods and Supplies

Same pattern as housing.

Evidence:

- parsed `goods_supplies` summary: 1 selected, 1 parsed
- promoted service tag counts: `supplies` appears on 0 nonprofit rows, 0 provider rows, 0 advocate rows

Read:

- scrape lane exists
- promoted product layer does not yet exist in meaningful depth

### Jobs and Vocational Support

Jobs and vocational support are also mostly future-state right now.

Evidence:

- parsed `jobs_vocational` summary: 1 selected, 1 parsed
- promoted service tag counts: `vocational_rehab` appears on 0 nonprofit rows, 0 provider rows, 0 advocate rows

Read:

- taxonomy exists
- promoted directory depth does not yet exist

## What The Optimistic Audits Get Right

The generated completeness and confidence audits are not useless. They correctly show that:

- all 50 states currently clear the repo's present completeness contract
- all 50 states currently clear the repo's present confidence contract
- the forms fallback lane and current truth model materially improved national coverage consistency

That matters. It means the repo has become much more operationally coherent.

## What The Optimistic Audits Do Not Mean

They do not mean:

- every information category is deep
- housing/goods/jobs/legal are fully built
- local provider coverage is nationally robust
- family workflow/runtime layers are production-populated
- normalization has fully replaced earlier directory shapes

So the correct reading is:

- structurally complete under the current contract: yes
- complete relative to the larger all-inclusive information vision: no

## Current Bottom Line

### Strong Now

- programs and benefits
- forms and appeals
- county/DD/education routing
- nonprofit footprint
- condition and need taxonomy

### Thin But Real

- provider layer
- knowledge article layer
- findhelp-like metadata density
- normalized org/program/location execution

### Mostly Future Buildout

- housing
- goods and supplies
- jobs and vocational supports
- legal aid
- independent living and broader care-support directory depth
- family workflow/runtime population

## Most Important Next Information Moves

1. Build the provider layer much deeper.
2. Turn housing, goods, jobs, care, and legal from taxonomy-plus-scrape pilots into promoted truth-safe directory layers.
3. Populate directory metadata fields that make listings operationally useful: availability, next step, accessibility, funding, intake.
4. Expand knowledge content around diagnosis journeys, school rights, respite, transition, and appeals.
5. Keep family workflow tables out of the "finished" story until runtime population is real.
