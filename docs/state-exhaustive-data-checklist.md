# State Exhaustive Data Checklist

This document defines the exhaustive data standard for the public benefits and disability resource navigator. California serves as the gold-standard benchmark. No state can be considered "Complete" or "Launchable" without satisfying the requirements defined below.

---

## 1. Overview
The goal of this navigator is to provide families of children with developmental disabilities, medical fragilities, and special needs with an exhaustive, high-fidelity routing guide. We do not build minimum viable pages. We build deep, local, and verified resources.

---

## 2. Definition of "State Complete"
A state is defined as **State Complete** and ready for search engine indexing only when it meets the following criteria:
- **100% Geographic Coverage**: All counties are accounted for, mapped, and linked to their local offices.
- **Local Routing Integrity**: 100% of counties map to their respective local developmental disability routing agency (e.g., Regional Centers in CA, LIDDAs in TX).
- **Core Benefits Layer**: Explicit program guides, application steps, required documents, and appeal processes are defined for Medicaid, Paid Caregivers, HCBS Waivers, Special Education, and Early Intervention.
- **Forms Completeness**: All critical state forms are mapped, instruction-linked, and scripted.
- **Trust & Verification Verification**: Zero programmatic fallback records are marked as human-verified. All human-verified records contain audit trails and confidence scores.
- **SEO & Quality Gating**: Sitemap logic prevents mass indexing of low-fidelity county × diagnosis combinations while indexing high-fidelity hubs and resources.

---

## 3. California Baseline
California is our reference benchmark:
- **Counties**: 58 / 58
- **Local Routing Agencies**: 21 Regional Centers covering all 58 counties.
- **SELPAs**: 120+ SELPAs covering all school districts and counties.
- **School Districts**: 1,000+ districts mapped to their respective counties.
- **Condition Taxonomy**: 78 distinct conditions.
- **Forms catalog**: 22+ active forms (including IHSS SOC forms, DHCS Medi-Cal forms, Special Ed request templates).

---

## 4. Required Data Categories

### A. Geographic Coverage
To ensure proper routing, every state configuration must contain:
* [ ] **State Record**: Registry entry in the `states` table.
* [ ] **All Counties**: Complete list of counties in the `counties` table.
* [ ] **County Slugs**: Standardized URL slugs for county directories.
* [ ] **County Websites**: Official county portal link for each record.
* [ ] **Major City-to-County Mappings**: Mappings of major municipal areas to counties.
* [ ] **County-level Page Eligibility Gate**: Metric checks determining if a county has enough verified resources to be indexable.

### B. Local Developmental Disability Routing
For coordinating developmental disability services (e.g., Regional Centers in CA, LIDDAs in TX):
* [ ] **Agency Name**: Official name of local resource coordinator.
* [ ] **Agency Type**: Categorized (e.g., `regional_center` or `lidda`).
* [ ] **Counties Served**: Comma-separated or junction-table mapped county associations.
* [ ] **County-to-Agency Mapping**: Resolution of which agency serves which county.
* [ ] **Catchment Boundary Description**: Brief geographic explanation of coverage.
* [ ] **Office Locations**: Full addresses and phone numbers.
* [ ] **Intake Phone**: Designated phone number for new intake requests.
* [ ] **Early Intervention Contact**: Specific intake phone/email for ages 0-3.
* [ ] **Adult/Lifetime Services Contact**: Specific contact for Lanterman/lifetime services.
* [ ] **Eligibility Page**: URL to agency eligibility info page.
* [ ] **Services Page**: URL to agency services page.
* [ ] **Appeals Page**: URL or explanation of how to appeal eligibility denials.
* [ ] **FRC Relationship**: Family Resource Center relationship details.
* [ ] **Languages**: Comma-separated list of supported languages.
* [ ] **Source URL**: Official source for verification.
* [ ] **Last Verified Date**: Timestamp of latest validation.
* [ ] **Verification Status**: Verification status tag.

### C. Medicaid / Medical Coverage Layer
The primary medical insurance coverage mapping:
* [ ] **State Medicaid Agency**: Name of the state department (e.g. DHCS in CA, HHSC in TX).
* [ ] **Medicaid Application Link**: Official online portal or form.
* [ ] **Medicaid Eligibility Page**: Information explaining income/asset limits.
* [ ] **Child Disability Medicaid Pathway**: Explanation of pathways bypassing parental income.
* [ ] **Waiver/Institutional Deeming Pathway**: Description of waiver pathways.
* [ ] **EPSDT / Children’s Benefit Page**: Pediatric preventive service guidelines.
* [ ] **Medically Fragile Waiver Programs**: Specialized waivers (e.g., HCBA in CA, MDCP/CLASS in TX).
* [ ] **County Medicaid Office Mapping**: Entry for local HHS offices per county in `county_offices`.
* [ ] **Managed Care Plan by County**: Mapping of health plans available in each county.
* [ ] **Children’s Special Health Care Services Program**: Programs like CCS (California Children's Services).
* [ ] **Hearing Aid/Device Programs**: Specialized pediatric device coverages.
* [ ] **Medical Therapy Program**: Details on county-level therapy centers.
* [ ] **Appeal Process**: Instructions for appealing Medicaid denials.
* [ ] **Forms**: Associated applications and appeal documents.
* [ ] **Source URL**: Reference links.
* [ ] **Last Verified Date & Verification Status**.

### D. IHSS / Paid Caregiver Layer
Personal care or attendant services:
* [ ] **Program Name**: Name of service (e.g., IHSS in CA, CDS or Attendant Care in other states).
* [ ] **State Agency**: Administrative agency details.
* [ ] **County Office Mapping**: Mappings to local county offices.
* [ ] **County Wage Rate**: Hourly caregiver wage by county.
* [ ] **Eligibility Summary**: Rules for eligibility.
* [ ] **Parent Provider Rules**: Specific guidelines on whether parents can be paid.
* [ ] **Protective Supervision Rules**: Criteria for 24/7 monitoring hours.
* [ ] **Paramedical Services**: Guidance on clinical tasks performed by parents.
* [ ] **Max Hours**: Ceiling limit for monthly hours (e.g., 283 hours in CA).
* [ ] **Application Steps**: Detailed walkthrough of applying.
* [ ] **Home Assessment Process**: Description of what caseworkers evaluate.
* [ ] **Appeal Process**: Details on state hearings.
* [ ] **Forms**: Mandatory forms (e.g., SOC 295, SOC 873, SOC 821, SOC 825, SOC 839).
* [ ] **Source URL & Verification Metadata**.

### E. Education / IEP Layer
Special education structure and school district configurations:
* [ ] **State Education Agency Special Ed Page**: Official resource links.
* [ ] **IDEA Procedural Safeguards**: Standard parent rights document.
* [ ] **Assessment Request Timeline**: Days to respond to a parent evaluation request.
* [ ] **Assessment Plan Timeline**: Days to generate an assessment plan.
* [ ] **Evaluation Completion Timeline**: Days to finish evaluations.
* [ ] **IEP Meeting Timeline**: Days to hold the initial IEP meeting.
* [ ] **State Complaint Process**: Official compliance compliance complaint procedure.
* [ ] **Due Process Complaint Process**: Special education due process guidelines.
* [ ] **Mediation Process**: Details on educational mediation.
* [ ] **Parent Rights Guide**: Handbooks and resources.
* [ ] **SELPA / Regional Education Agency Mapping**: County-level regional education agencies.
* [ ] **School District Coverage**: Mappings of all districts inside counties.
* [ ] **District Special Ed Contacts**: Contact phone numbers and email addresses for special ed departments.
* [ ] **County Office of Education Fallback**: Contact details when district records are missing.
* [ ] **Parent Training Center**: PTIs (Parent Training and Information Centers).
* [ ] **IEP Assessment Request Letter Template**.
* [ ] **IEE Request Letter Template**.
* [ ] **Prior Written Notice Request Template**.
* [ ] **Education Records Request Template**.
* [ ] **Source URL & Verification Metadata**.

### F. Early Intervention Layer
Services for infants and toddlers (ages 0-3):
* [ ] **Program Name**: Program name (e.g., Early Start in CA, ECI in TX).
* [ ] **Serving Agency**: Administrative department.
* [ ] **Eligibility Age**: Typically 0 to 36 months.
* [ ] **Eligibility Criteria**: Threshold for developmental delays or risk conditions.
* [ ] **Referral Process**: Details on who can refer and how.
* [ ] **Intake Phone/Link**: Contact info.
* [ ] **Regional Routing**: Mappings to local intake offices.
* [ ] **Transition to School District at Age 3**: Checklist guidelines.
* [ ] **IFSP Guidance**: Individualized Family Service Plan explanation.
* [ ] **Appeal/Complaint Process**: Procedures for early start disputes.
* [ ] **Forms**: Intake/consent documents.
* [ ] **Source URL & Verification Metadata**.

### G. State Developmental Disability / HCBS Waiver Layer
Home and Community-Based Services (HCBS) waivers:
* [ ] **All State DD/IDD Waivers**: Comprehensive list of active waivers.
* [ ] **Waiver Names**: Official titles.
* [ ] **Target Population**: Target age, diagnosis, or clinical eligibility.
* [ ] **Age Range**: Supported age brackets.
* [ ] **Income/Resource Rules**: Demonstration of parental deeming rules.
* [ ] **Parental Income Treatment**: Deeming waiver specifications.
* [ ] **Waitlist/Interest List**: Duration and size of waitlists (e.g., Lanterman is immediate, Texas HCS is 15 years).
* [ ] **Services Covered**: Respite, behavioral support, therapies, modifications.
* [ ] **Application Process**: Step-by-step instructions.
* [ ] **Local Intake Agency**: Mapping to local coordinators (Regional Centers/LIDDAs).
* [ ] **Appeal Process & Associated Forms**.
* [ ] **Source URL & Verification Metadata**.

For California, includes: Lanterman Act, Self-Determination Program, HCBA Waiver, Institutional Deeming, Respite, Behavior Services, IPP templates.

### H. Financial / Legal Planning Layer
Core transition resources:
* [ ] **SSI Child Disability**: Supplemental Security Income guidelines.
* [ ] **State Supplement**: Details on state-specific supplements.
* [ ] **ABLE Account**: CalABLE / Texas ABLE or equivalent enrollment details.
* [ ] **Special Needs Trust Basics**: Explanation of third-party vs first-party SNTs.
* [ ] **Guardianship / Conservatorship / Supported Decision-Making**: Legal options at age 18.
* [ ] **Transition at Age 18**: Resource roadmap.
* [ ] **Adult Services Transition**: Moving from school/pediatric to adult networks.
* [ ] **Source URL & Verification Metadata**.

### I. Diagnosis / Condition Taxonomy
* [ ] **Condition ID**: Short code slug.
* [ ] **Parent-Friendly Name**: Clean, accessible terminology.
* [ ] **Aliases**: Synonyms (e.g., "ASD", "Autism Spectrum Disorder").
* [ ] **Program Relevance Flags**: Boolean relevance for Medicaid, DD agency, IEP, SSI, ABLE, CCS.
* [ ] **Age-Specific Notes**: Pediatric vs adult relevance.
* [ ] **Source URL & Verification Metadata**.
* [ ] **Taxonomy Size**: Minimally 78 condition records.

### J. Functional Needs Taxonomy
* [ ] **Core Need Services**: Mappings for Speech Therapy, OT, PT, Protective Supervision, Behavior Support, Respite, Incontinence Supplies, Feeding Therapy, Mobility Equipment, Hearing Aids, Vision Services, Assistive Technology, Transportation, Nursing Care, School Accommodations, Transition Planning, Caregiver Support.
* [ ] **Need-to-Program Mapping**: Association of functional needs to specific program triggers.
* [ ] **Required Documents, Application Steps, Forms, and Appeal Paths**.

### K. Forms Library
* [ ] **Minimum Mapped Forms**: SOC 295, SOC 873, SOC 821, SOC 825, SOC 839, DHCS 4480, CCS application, Medi-Cal application, Regional Center intake/IPP/service requests, Regional Center appeal requests, IEP evaluation/IEE requests, PWN request, student records request, CDE state complaint, due process complaint, SSI childhood checklist, CalABLE guide, HCBA application.
* [ ] **Form Fields**:
  - `slug`: Unique identifier.
  - `program`: Associated program name.
  - `official_download_url` / `instruction_url`: Checked and valid.
  - `who_uses_it` & `who_signs_it`.
  - `where_to_send_it`: Address or department.
  - `attachments`: Required supporting documentation.
  - `deadline` & `what_happens_next`.
  - `common_mistakes`: Frequently rejected fields or errors.
  - `letter/call_script`: Verbatim text templates for parents.
  - `source_url` & `verification_metadata`.

### L. Nonprofit / Support Organization Layer
* [ ] **Organization Types**: Parent training centers, family resource centers, disability rights legal aid, local autism/Down syndrome/cerebral palsy groups, respite providers, language-specific groups.
* [ ] **Metadata fields**: County mapping, service area, phone, website, source URL, data origin (human-verified or scraped/fallback).

### M. Advocate / Provider Layer
* [ ] **Professional Categories**: Special ed advocates, special ed attorneys, educational consultants, parent coaches, legal aid firms, ABA/speech/OT/PT clinics, Regional Center vendors.
* [ ] **Metadata fields**: County mapping, specialties, languages spoken, credentials, source URL, scrape timestamp, verification status (MUST default to unverified unless manually reviewed).
* [ ] **Metro Coverage & Capping check**: Mapped config with `priorityMetroCounties` reporting metro mapping counts, priority counties with >=3 source-listed providers, priority counties with >=1 legal/advocacy and >=1 therapy provider, and rural fallback coverage.

### N. Source / Trust / Freshness Layer
* [ ] **Registry Tables**: `sources` and `source_verifications` entries.
* [ ] **Confidence Score**: Rating (1.0 to 10.0 scale) based on source authenticity.
* [ ] **Stale Threshold**: Days before a record must be re-verified (e.g. 180 days for county wages).
* [ ] **Human Verification Flag**: Mandatory field distinguishing human audits from automated scrapers.

---

## 5. Required Public Pages
The following page paths must exist, render correctly, and pass the structure audit:
* **State Hub Page**: `/benefits/[state]`
* **County Directory Page**: `/counties/[state]`
* **County Details Page**: `/counties/[state]/[county]`
* **County Benefits Page**: `/benefits/[state]/[county]`
* **High-Fidelity County × Diagnosis Page**: `/benefits/[state]/[diagnosis]/[county]` (only generated for counties meeting sitemap quality gates).
* **Forms Catalog**: `/forms`
* **Form Detail Guides**: `/forms/[form-slug]`
* **Condition Detail Guides**: `/conditions/[condition-slug]`

---

## 6. Required Forms
Every state must map the equivalent versions of the following critical forms:
1. Medicaid / Health Insurance Application
2. DD Agency Intake/Evaluation Request
3. DD Agency Appeal Request
4. Paid Caregiver Application
5. Paid Caregiver Medical Certification
6. IEP Assessment Request Letter Template
7. Student Education Records Request Letter Template
8. Independent Educational Evaluation (IEE) Request Letter Template
9. Prior Written Notice (PWN) Request Letter Template
10. State Special Education Compliance Complaint Form
11. Special Education Due Process Hearing Request Form
12. ABLE Account Opening Guide
13. SSI Child Disability Checklist

---

## 7. Required Audit Checks
The following validation scripts must run successfully:
* **Coverage Audit**: Verifies database county counts and county mapping coverage (Regional Center / LIDDA routing).
* **SEO Audit**: Verifies metadata (H1, title, meta description, canonical URLs, robots noindex gates).
* **Terminology Leak Audit**: Checks for state-specific terminology mismatches.
* **Trust Metadata Audit**: Ensures data origin and verification flags are complete.

---

## 8. Required Trust Metadata
All records loaded into the navigator must carry these metadata fields:
- `data_origin`: `'manual_entry'`, `'scraped'`, or `'generated_fallback'`.
- `verification_status`: `'official_verified'`, `'community_verified'`, or `'unverified'`.
- `last_verified_date`: `'YYYY-MM-DD'` (cannot be empty).
- `confidence_score`: Float between `1.0` and `10.0`.

---

## 9. Required SEO Gates
* **Mass Index Gating**: Low-fidelity county × diagnosis combinations must be explicitly excluded from the sitemap.xml and blocked via a `<meta name="robots" content="noindex, follow" />` tag.
* **High-Fidelity Gating**: Only counties with a threshold of verified providers, local offices, and nonprofits are indexable (e.g., Los Angeles and Orange in CA).
* **Canonical URLs**: Every indexable page must contain a self-referencing canonical URL pointing to the production domain.

---

## 10. State Readiness Scoring
The audit script calculates a readiness scorecard across the following criteria (0% to 100%):
1. **Backend Completeness**: Proportion of required database tables populated with state-specific data.
2. **Public Page Completeness**: Render status of core hubs, counties, forms, and guides.
3. **SEO Readiness**: robots.txt, sitemaps index, static.xml, and county-diagnosis gates compliance.
4. **Trust/Source Quality**: Fraction of records carrying complete trust metadata and source URLs.
5. **Human Verification Status**: Percentage of data manually audited and verified.
6. **Local Agency Routing Completeness**: 100% county-to-agency mapping indicator.
7. **Forms Completeness**: Proportion of the 13 required forms mapped and available.
8. **Education Completeness**: Mapped districts and regional education agencies.
9. **Nonprofit/Provider Completeness**: Count of verified support networks.

---

## 11. Expansion Workflow
Before adding any new state:
1. **Standard Audit**: Run standard audit script against target database state config.
2. **Review Gaps**: Review gaps reported.
3. **Build Data Layer**: Perform manual seeding, scraping, and verification.
4. **Pass Quality Gate**: Reach minimum 80% readiness across all scoring criteria before indexing any county or program pages.
