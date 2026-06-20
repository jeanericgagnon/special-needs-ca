# Website Information Model

This document is the current repo-backed inventory of the information Ablefull stores and exposes. It is intentionally organized by information type, not by state, so we can answer a simpler product question first:

What kinds of information do we already have, and what subtypes exist inside each layer?

This is a disability-specific navigation and directory model. It is not a generic social-services schema.

## Scope

The current system is built around:

- Down syndrome
- autism
- IDD / DD
- IEPs and special education
- early intervention
- Medicaid waivers and disability benefits
- respite and caregiving
- advocacy and appeals
- transition and long-term planning

The model already supports both:

- public directory and SEO surfaces
- family/case and navigator-adjacent workflow data

## 1. Geography and Coverage

### States

- `states`
- state ID, name, code

### Counties

- `counties`
- county ID, state linkage, county name
- county website
- county wage-rate and plan context fields

### Coverage junctions

- `regional_center_counties`
- `selpa_counties`
- `iep_advocate_counties`
- `virtual_service_area_counties`

These represent county coverage relationships without forcing fake county-local duplication.

## 2. Program and Benefits Knowledge

### Programs

- `programs`
- program name, description, who it is for, who might qualify
- official source URL
- state linkage
- program category such as federal, state, or county

### Eligibility rules

- `program_eligibility_rules`
- age rules
- required condition
- required functional need
- insurance status
- school status
- trigger reason

### Document requirements

- `program_document_requirements`
- required and optional documents tied to a program

### Application steps

- `program_application_steps`
- ordered step-by-step application flow
- contact or apply URL per step when known

### Appeal information

- `program_appeal_info`
- deadlines
- appeal steps
- denial reasons
- appeal form name
- official appeal source URL

### Waitlists

- `program_waitlists`
- waitlist or interest-list name
- duration label
- duration in months
- status
- description
- reserve-capacity notice
- legal deadline
- last scraped timestamp

## 3. Public Administrative and Education Routing

### County offices

- `county_offices`
- county-level Medicaid, HHS, IHSS, CCS, and similar office routing
- office name, address, phone, email, website
- program linkage

### State resource agencies

- `state_resource_agencies`
- DD / IDD local routing systems such as regional-center, LIDDA, APD-office, or DDRO-style records
- counties served
- catchment boundaries
- intake phone
- early intervention contact
- agency intake contact
- eligibility, services, and appeals pages
- language fields

### Regional education agencies

- `regional_education_agencies`
- SELPA / BOCES / RESC style regional education entities
- counties served
- website and trust metadata

### School districts

- `school_districts`
- special education contact phone and email
- website
- district metrics such as enrollment, special-ed percentage, inclusion rate, self-contained rate

## 4. Local Directory Layers

### Resource providers

- `resource_providers`
- clinics, therapists, service providers, respite providers, local resource listings
- categories
- county linkage
- address, phone, email
- Medi-Cal acceptance
- regional-center vendor IDs

### Nonprofit organizations

- `nonprofit_organizations`
- local nonprofit support organizations
- website, phone
- focus condition
- county linkage

### IEP advocates

- `iep_advocates`
- advocate name
- credentials
- experience years
- rate or pricing text
- counties served
- languages spoken
- specialties
- organization affiliation
- description
- vendorization flag

## 5. Directory Foundation Metadata

The following structured fields now apply across the public directory foundation layers where supported:

- `resource_providers`
- `nonprofit_organizations`
- `iep_advocates`

See [findhelp-foundation-v1.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/findhelp-foundation-v1.md) for the controlled-value details.

### Service taxonomy

- `service_tags`
- describes what is offered

Current examples include:

- food
- housing
- home mods
- utilities
- supplies
- transport
- therapy
- behavioral health
- benefits
- grants
- respite
- in-home support
- caregiving
- early intervention
- special education
- IEP advocacy
- vocational rehab
- transition
- guardianship
- trusts
- legal aid
- appeals

### Audience taxonomy

- `serving_tags`
- describes who the listing explicitly serves

Current examples include:

- Down syndrome
- autism
- IDD / DD
- early childhood
- school age
- transition age
- parents and caregivers
- Medicaid-waiver families
- IEP families
- non-English speakers
- rural families
- low-income families

Condition taxonomy remains separate from serving tags.

### Availability and capacity

- `availability_status`
- `accepting_new_clients`
- `waitlist_status`
- `capacity_notes`
- `funding_status`

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

### Claimed-listing groundwork

- `claim_status`
- `claimed_by`
- `verified_affiliation`
- `claim_email`

## 6. Normalization Foundation

The public site does not yet render directly from the normalization layer, but the migration landing zone already exists.

### Organizations

- `organizations`
- canonical organization identity
- provider organizations
- nonprofits
- advocacy organizations
- public agencies
- school-related systems

### Organization to program links

- `organization_program_links`
- maps an organization to a concrete service line, listing, office, or program relationship

### Service locations

- `service_locations`
- physical service-delivery sites such as clinics, campuses, community sites, mobile anchors, and home-based anchors

### Office locations

- `office_locations`
- administrative, intake, county, regional, education, or appeals offices

### Virtual service areas

- `virtual_service_areas`
- statewide, county-group, catchment, metro, or virtual-only coverage areas

This layer exists so future upgrades can separate:

- organization identity
- program or service identity
- physical location
- administrative office
- virtual or catchment coverage

## 7. Disability Knowledge Layer

### Conditions

- `conditions`
- condition names
- aliases
- parent-friendly explanations
- relevance flags across major programs
- age-specific notes

### Functional needs

- `functional_needs`
- need categories such as communication, mobility, daily living, medical, behavioral, education, and planning
- descriptions
- program trigger mappings

### Reference entities

- `age_bands`
- `insurance_types`

These support the matching and guidance model rather than directory rendering.

## 8. Family and Navigator-Adjacent Workflow Data

### Family cases

- `family_cases`
- top-level family record

### Child profiles

- `child_profiles`
- nickname
- date of birth
- county
- ZIP code
- insurance type
- school status
- language preference
- caregiver notes

### Child condition and need mappings

- `child_profile_conditions`
- `child_profile_needs`

### Program tracking

- `case_program_statuses`
- per-child program status such as recommended, applied, waiting, approved, or denied

### Document tracking

- `document_checklist_items`
- collected and missing documents tied to a child and optionally to a program

### Reminders

- `reminders`
- due dates and completion tracking for family follow-through

### Waiver vault

- `child_waivers`
- waiver type
- stored document path
- effective and expiration dates
- authorized hours
- parsed content

## 9. Family Support, Planning, and Collaboration Layers

These are not the core public directory, but they are real information layers already present in the repo.

### Safety incidents

- `safety_incidents`
- incident time
- category
- risk level
- details
- intervention

### Parent declarations

- `parent_declarations`
- parent declaration text
- doctor name

### Caregiver profiles

- `caregiver_profiles`
- caregiver contact and profile information

### Transition tasks

- `child_transition_tasks`
- child-to-task mapping for transition planning

### Caregiver self-care logs

- `caregiver_selfcare_logs`
- day-by-day caregiver self-care tracking

### Child coordinators

- `child_coordinators`
- coordinator assignment per child

### Clinical documents

- `child_clinical_documents`
- uploaded file name
- document type
- parsed data JSON
- upload time
- processing status

### Consultation threads and messages

- `consultation_threads`
- `consultation_messages`
- child-to-advocate thread history
- message text
- attachments JSON
- thread status

### Shared portal access

- `shared_portal_tokens`
- scoped share token
- expiration
- access scope

### IEP planning records

- `child_iep_accommodations`
- `child_iep_goals`
- accommodation template mappings
- goal template mappings
- custom text and token payloads

### Respite assessment

- `child_respite_assessments`
- safety, sleep, medical, and behavior scores
- last updated timestamp

## 10. Knowledge Content Layer

### Knowledge articles

- `knowledge_articles`
- category
- bilingual title and subtitle
- read time
- difficulty
- color/theme
- structured steps content in English and Spanish

## 11. Source, Review, and Operations Layers

### Sources

- `sources`
- program-linked source registry
- source type
- confidence rating

### Source verifications

- `source_verifications`
- who verified a source
- when it was verified
- notes

### User-submitted resources

- `user_submitted_resources`
- pending, approved, or rejected public submissions

### Coverage gaps

- `coverage_gaps`
- county-level gap category, description, severity

### Verification queue

- `verification_queue_items`
- record type
- reason for review
- verification level

## 12. Staging and Promotion Layers

These tables support source discovery, extraction, review, and promotion into production data.

### Source targeting

- `staging_source_targets`
- source URL and domain
- target tables
- expected fields
- crawl method
- robots status
- terms risk
- priority
- update frequency estimate

### Staging extraction tables

- `staging_scraped_county_offices`
- `staging_scraped_state_resource_agencies`
- `staging_scraped_regional_education_agencies`
- `staging_scraped_school_districts`
- `staging_scraped_nonprofit_organizations`
- `staging_scraped_iep_advocates`
- `staging_scraped_resource_providers`
- `staging_scraped_forms`
- `staging_scraped_waitlists`
- `staging_scraped_sources`

These hold extracted source-backed records before promotion.

### Promotion audit

- `staging_promotion_audit`
- logs what was promoted, when, and with what result

## 13. Trust and Public-Truth Contract

Most public-serving tables now carry trust metadata such as:

- `source_url`
- `source_type`
- `data_origin`
- `verification_status`
- `last_verified_date`
- `last_scraped_at`
- `confidence_score`

Public rendering is increasingly governed by the truth-first contract in:

- [publicTruth.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/lib/publicTruth.ts)
- [directoryFoundation.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/lib/directoryFoundation.ts)

That contract is meant to ensure:

- fake or synthetic local resources do not render publicly
- empty sections are suppressed
- source-backed records are distinguishable from weaker records
- sitemap and indexing behavior can align with public truth eligibility

## 14. What This Model Does Not Mean

This inventory does not mean Ablefull already has every fact a family could want about every disability in every state.

It means the repo already supports these information classes:

- benefits and waiver knowledge
- office and routing knowledge
- education routing
- local provider, nonprofit, and advocate listings
- forms, appeals, and supporting workflow data
- trust, provenance, and freshness metadata
- family and navigator-adjacent tracking structures

The remaining challenge is completeness and truth quality within those layers, not whether the schema can represent them at all.
