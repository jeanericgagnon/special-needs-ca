# California Next-Source Registry v1

Generated: 2026-06-27

Next-source registry for the California source-backed scraping foundation after DDS regional centers.

## Rules
- Public sources only.
- Every fact needs source URL and fetched date.
- New records default to needs_review until validation passes.
- Only published records should render on public local surfaces.

## Validation Checks
- source_url
- official_domain
- phone_email_format
- placeholder_detection
- duplicate_detection
- stale_dates
- county_normalization
- confidence
- display_eligibility

## Summary
- Families: `10`
- Seed entries: `18`
- Seed-ready entries: `18`
- Needs review: `0`
- Duplicate URLs: `0`

## Source Families
### ihss
- Priority: `p0`
- Authority: `official_county_and_state`
- Owner: California Department of Social Services + county IHSS offices
- Expected artifacts: county office pages, program guidance, contact routing

### selpa
- Priority: `p0`
- Authority: `official_education`
- Owner: California Department of Education + SELPA sites
- Expected artifacts: selpa directory, local special education routing, procedural safeguards

### ccs_mtu
- Priority: `p0`
- Authority: `official_state_and_county`
- Owner: DHCS CCS + county CCS/MTU programs
- Expected artifacts: county office pages, medical therapy unit routing, eligibility/contact pages

### dhcs_epsdt
- Priority: `p1`
- Authority: `official_state`
- Owner: Department of Health Care Services
- Expected artifacts: EPSDT benefits pages, behavioral health guidance, provider/appeal references

### ssi
- Priority: `p1`
- Authority: `official_federal`
- Owner: Social Security Administration
- Expected artifacts: child SSI eligibility, application steps, appeal guidance

### calable
- Priority: `p1`
- Authority: `official_state_partner`
- Owner: CalABLE
- Expected artifacts: program overview, eligibility, account opening guidance

### frcnca
- Priority: `p1`
- Authority: `high_authority_nonprofit`
- Owner: Family Resource Centers Network of California
- Expected artifacts: family resource center directory, county/service area listings

### pti_cprc
- Priority: `p1`
- Authority: `high_authority_nonprofit`
- Owner: PTIs / CPRCs
- Expected artifacts: parent training contact pages, service area proof, special education help routing

### help_me_grow
- Priority: `p2`
- Authority: `mission_aligned_first_party`
- Owner: Help Me Grow California
- Expected artifacts: local referral hub pages, developmental screening routing

### local_nonprofits
- Priority: `p2`
- Authority: `mission_aligned_first_party`
- Owner: Arc / Easterseals / local disability nonprofits
- Expected artifacts: local service pages, county/service area evidence, contact and intake routes

## Seed Entries
### CDSS County IHSS Offices Directory
- Family: `ihss`
- Authority: `official_county_and_state`
- Validation status: `seed_ready`
- URL: https://www.cdss.ca.gov/inforesources/county-ihss-offices
- Domain: `www.cdss.ca.gov`
- Role: `county_office_directory`
- Target kind: `directory_root`
- Expected coverage: county IHSS office routing
- Notes: Primary statewide directory for county IHSS office contact pages.
- Validation issues: none

### CDSS IHSS Program Overview
- Family: `ihss`
- Authority: `official_county_and_state`
- Validation status: `seed_ready`
- URL: https://www.cdss.ca.gov/in-home-supportive-services
- Domain: `www.cdss.ca.gov`
- Role: `program_guidance`
- Target kind: `leaf_guidance_page`
- Expected coverage: IHSS eligibility and program overview
- Notes: Use for statewide program framing only, not county contact inference.
- Validation issues: none

### CDE SELPA Directory
- Family: `selpa`
- Authority: `official_education`
- Validation status: `seed_ready`
- URL: https://www.cde.ca.gov/sp/se/as/caselpas.asp
- Domain: `www.cde.ca.gov`
- Role: `selpa_directory`
- Target kind: `directory_root`
- Expected coverage: SELPA routing by local plan area
- Notes: Primary statewide SELPA directory root.
- Validation issues: none

### CDE Special Education Division
- Family: `selpa`
- Authority: `official_education`
- Validation status: `seed_ready`
- URL: https://www.cde.ca.gov/sp/se
- Domain: `www.cde.ca.gov`
- Role: `special_education_routing`
- Target kind: `official_root`
- Expected coverage: state special education guidance and safeguards
- Notes: State guidance root; local routing still requires SELPA or district evidence.
- Validation issues: none

### DHCS California Children’s Services
- Family: `ccs_mtu`
- Authority: `official_state_and_county`
- Validation status: `seed_ready`
- URL: https://www.dhcs.ca.gov/services/ccs/Pages/default.aspx
- Domain: `www.dhcs.ca.gov`
- Role: `program_guidance`
- Target kind: `official_root`
- Expected coverage: CCS eligibility and county program guidance
- Notes: State CCS root for county and MTU follow-up discovery.
- Validation issues: none

### DHCS Medical Therapy Program
- Family: `ccs_mtu`
- Authority: `official_state_and_county`
- Validation status: `seed_ready`
- URL: https://www.dhcs.ca.gov/services/ccs/Pages/MedicalTherapyProgram.aspx
- Domain: `www.dhcs.ca.gov`
- Role: `mtu_guidance`
- Target kind: `leaf_guidance_page`
- Expected coverage: medical therapy unit explanation and routing context
- Notes: Program explainer, not county office proof by itself.
- Validation issues: none

### DHCS EPSDT Overview
- Family: `dhcs_epsdt`
- Authority: `official_state`
- Validation status: `seed_ready`
- URL: https://www.dhcs.ca.gov/services/Pages/EPSDT.aspx
- Domain: `www.dhcs.ca.gov`
- Role: `epsdt_guidance`
- Target kind: `leaf_guidance_page`
- Expected coverage: EPSDT overview and state benefit framing
- Notes: Use for statewide benefit grounding and downstream exact target discovery.
- Validation issues: none

### DHCS Behavioral Health Information Notice Library
- Family: `dhcs_epsdt`
- Authority: `official_state`
- Validation status: `seed_ready`
- URL: https://www.dhcs.ca.gov/formsandpubs/Pages/Behavioral_Health_Information_Notices.aspx
- Domain: `www.dhcs.ca.gov`
- Role: `behavioral_health_guidance`
- Target kind: `library_root`
- Expected coverage: behavioral health and EPSDT-related notices
- Notes: Use to discover exact notices without broad crawling.
- Validation issues: none

### SSA Child Disability Starter Kit
- Family: `ssi`
- Authority: `official_federal`
- Validation status: `seed_ready`
- URL: https://www.ssa.gov/disability/disability_starter_kits_child_eng.htm
- Domain: `www.ssa.gov`
- Role: `child_ssi_application`
- Target kind: `leaf_guidance_page`
- Expected coverage: SSI child application steps and documents
- Notes: Federal crossover reference allowed for SSI only.
- Validation issues: none

### SSA Disability Benefits for Children
- Family: `ssi`
- Authority: `official_federal`
- Validation status: `seed_ready`
- URL: https://www.ssa.gov/benefits/disability/qualify.html
- Domain: `www.ssa.gov`
- Role: `child_ssi_eligibility`
- Target kind: `leaf_guidance_page`
- Expected coverage: SSI child eligibility overview
- Notes: Eligibility explainer, not state-local routing.
- Validation issues: none

### CalABLE Program Homepage
- Family: `calable`
- Authority: `official_state_partner`
- Validation status: `seed_ready`
- URL: https://calable.ca.gov/
- Domain: `calable.ca.gov`
- Role: `program_overview`
- Target kind: `official_root`
- Expected coverage: CalABLE overview and enrollment routing
- Notes: State partner program root for ABLE coverage.
- Validation issues: none

### CalABLE Eligibility
- Family: `calable`
- Authority: `official_state_partner`
- Validation status: `seed_ready`
- URL: https://calable.ca.gov/eligibility
- Domain: `calable.ca.gov`
- Role: `eligibility_guidance`
- Target kind: `leaf_guidance_page`
- Expected coverage: CalABLE eligibility requirements
- Notes: Leaf eligibility page for ABLE guidance.
- Validation issues: none

### Family Resource Centers Network of California Directory
- Family: `frcnca`
- Authority: `high_authority_nonprofit`
- Validation status: `seed_ready`
- URL: https://www.frcnca.org/find-a-center
- Domain: `www.frcnca.org`
- Role: `family_resource_directory`
- Target kind: `directory_root`
- Expected coverage: family resource center service-area routing
- Notes: High-authority statewide directory for local FRC discovery.
- Validation issues: none

### TASK Parent Training and Information Center
- Family: `pti_cprc`
- Authority: `high_authority_nonprofit`
- Validation status: `seed_ready`
- URL: https://taskca.org/
- Domain: `taskca.org`
- Role: `pti_program_root`
- Target kind: `official_root`
- Expected coverage: parent training and special education help routing
- Notes: California PTI root; local service area proof still required downstream.
- Validation issues: none

### Matrix Parent Network and Resource Center
- Family: `pti_cprc`
- Authority: `high_authority_nonprofit`
- Validation status: `seed_ready`
- URL: https://www.matrixparents.org/
- Domain: `www.matrixparents.org`
- Role: `cprc_program_root`
- Target kind: `official_root`
- Expected coverage: CPRC support, training, and special education help
- Notes: CPRC/parent center first-party root.
- Validation issues: none

### Help Me Grow California
- Family: `help_me_grow`
- Authority: `mission_aligned_first_party`
- Validation status: `seed_ready`
- URL: https://helpmegrowca.org/
- Domain: `helpmegrowca.org`
- Role: `referral_hub_root`
- Target kind: `official_root`
- Expected coverage: developmental screening and referral routing
- Notes: Mission-aligned statewide referral hub root.
- Validation issues: none

### The Arc of California
- Family: `local_nonprofits`
- Authority: `mission_aligned_first_party`
- Validation status: `seed_ready`
- URL: https://thearcca.org/
- Domain: `thearcca.org`
- Role: `statewide_nonprofit_root`
- Target kind: `official_root`
- Expected coverage: disability nonprofit and chapter routing
- Notes: Use for California chapter discovery; local proof still needs chapter or service-area evidence.
- Validation issues: none

### Easterseals Southern California
- Family: `local_nonprofits`
- Authority: `mission_aligned_first_party`
- Validation status: `seed_ready`
- URL: https://www.easterseals.com/southerncal
- Domain: `www.easterseals.com`
- Role: `regional_nonprofit_root`
- Target kind: `official_root`
- Expected coverage: regional nonprofit services and local entry points
- Notes: Regional nonprofit example for California local-service sourcing.
- Validation issues: none
