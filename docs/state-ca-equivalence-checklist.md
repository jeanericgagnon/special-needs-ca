# State CA-Equivalence Checklist

This checklist defines the exact data layers, routing mechanisms, resources, and E2E verifications required for a state to be classified as **California-Equivalent (Exhaustive Deep Coverage)**. A state cannot be declared CA-equivalent until all categories below are complete without placeholders or unverified programmatic fallbacks.

---

## A. Geography & Slugs
* [ ] **All Counties Mapped:** 100% of the state's counties must be present in the database.
* [ ] **Priority Metros Defined:** High-density metropolitan counties (e.g., Travis/Harris in TX, Miami-Dade in FL) must be defined for targeted provider seeding.
* [ ] **City-to-County Mapping:** Database lookup tables must accurately map all cities/ZIP codes within the state to their respective counties.
* [ ] **State Route Slugs:** Unique, clean URL slugs generated for all state, county, and diagnosis paths.

---

## B. Local Developmental Disability (DD) Routing
* [ ] **Local Agencies Mapped:** Every county in the state must map to its specific local DD intake office (e.g., Regional Centers in CA, LIDDAs in TX, APD Regions in FL, OPWDD Front Doors in NY, County Boards in OH).
* [ ] **Catchment Boundaries Defined:** Boundaries and zip-code level assignments for agencies with overlapping county coverage must be explicit.
* [ ] **Intake Fields Complete:** For every local DD agency:
  * Official agency name
  * Intake phone number (direct, non-general)
  * Intake email/contact form
  * Direct URL to intake/eligibility page
  * Direct URL to services list page
  * Direct URL to appeals and fair hearing info
* [ ] **Verified Metadata:** `data_origin = 'official_source'`, `verification_status = 'official_verified'`, and `last_verified_date` within 365 days.

---

## C. Medicaid / Paid Caregiver Programs
* [ ] **State Medicaid Details:** State Medicaid agency name, application portal link, and official program guidelines.
* [ ] **Local Offices Mapped:** Direct local Medicaid/HHS enrollment offices or county-specific official locators (not generic state homepages).
* [ ] **Paid Caregiver / Personal Care Program:** Active state program mapped (e.g., IHSS in CA, PCS/PAS in TX, personal care under waivers elsewhere).
  * Direct eligibility rules, age bands, maximum allowable hours, and parent caregiver compensation rules.
* [ ] **Managed Care Appeals:** Programmatic appeal steps, timelines, and contact addresses for state Medicaid managed care organizations (MCOs).

---

## D. Early Intervention (Ages 0-3)
* [ ] **State Program Mapped:** State-specific Early Intervention program (e.g., Early Start in CA, ECI in TX, Early Steps in FL).
* [ ] **Local EI Intake Mapped:** Regional or county-level intake coordinators and contact numbers mapped for every county.
* [ ] **Transition Guidance (Age 3):** Step-by-step guidance on transitioning from EI (Part C) to Special Education School Districts (Part B) at age 3.
* [ ] **Referral Forms:** Direct download links for EI referral packets.

---

## E. Special Education & School Districts
* [ ] **State Education Agency:** State Department of Education URL, complaint procedures, and procedural safeguards.
* [ ] **Regional Education Agencies:** Intermediate units mapped if they coordinate special ed services (e.g., SELPAs in CA, ESCs in TX, BOCES in NY, Intermediate Units in PA).
* [ ] **District Contacts:** Special education director names, phones, and emails for all school districts in **Priority Counties**.
* [ ] **Letter Templates:** State-specific or custom letter templates for:
  * IEP Assessment Request (utilizing state-specific timeline citations)
  * Independent Educational Evaluation (IEE) Request
  * Education Records Request
  * Prior Written Notice (PWN) Request

---

## F. Waivers & Waitlists (Interest Lists)
* [ ] **Waiver Inventory:** All major home and community-based services (HCBS) waivers (DD, Autism, Medically Fragile) fully documented.
* [ ] **Waitlist Metrics:** Direct waitlist/interest list rules:
  * Priority/urgency categories (e.g., crisis, active need, planning)
  * Seeding/enrollment instructions
  * Estimated wait times (officially sourced, updated quarterly)
  * Direct interest list phone numbers and portals
* [ ] **Appeal Pathways:** Step-by-step guidance for appealing waiver eligibility denials.

---

## G. Financial & Legal Planning
* [ ] **SSI Child Disability Checklist:** Step-by-step guide for SSI applications tailored to the state.
* [ ] **ABLE Account Mapped:** State-specific ABLE program details (e.g., CalABLE in CA, Texas ABLE, Florida ABLE) and account-opening guides.
* [ ] **Guardianship Alternatives:** Information on supported decision-making agreements, limited conservatorship, and guardianship rules in the state.
* [ ] **Transition at Age 18:** Guidance on age-of-majority rights transitions.

---

## H. Forms & Guides Catalog
Every state must have at least 15 comprehensive guides/forms including:
1. State Medicaid Application Guide
2. Developmental Disabilities Intake Guide
3. Early Intervention Referral Guide
4. HCBS Waiver Enrollment Guide
5. Special Education Evaluation Request Letter
6. IEE Request Letter
7. Records Request Letter
8. Prior Written Notice (PWN) Request Letter
9. State Department of Education Complaint Guide
10. Due Process Complaint Guide
11. Mediation Request Form
12. Medicaid Fair Hearing Appeal Guide
13. Waiver Intake Appeal Form
14. State ABLE Program Guide
15. SSI Child Disability Guide

---

## I. Nonprofits & Support Organizations
* [ ] **Parent Training and Information Center (PTI):** State-specific federally funded PTI mapped (e.g., Matrix Parent Network in CA, Texas Project FIRST, Family Network on Disabilities in FL).
* [ ] **Disability Rights / Legal Aid:** State Disability Rights chapter (e.g., Disability Rights California, Disability Rights Texas).
* [ ] **The Arc Chapters:** Local Arc chapters mapped by county.
* [ ] **Condition-Specific Chapters:** Local Autism, Down Syndrome, and Cerebral Palsy support chapters mapped by county.

---

## J. Providers, Therapy Clinics & Advocates
* [ ] **Special Education Attorneys:** Verified local attorneys specialized in special education law.
* [ ] **Non-Attorney IEP Advocates:** Verified local parent advocates and advocacy groups.
* [ ] **Therapy Clinics:** Seeding of major child developmental centers:
  * ABA (Applied Behavior Analysis) providers
  * Speech-Language Pathology (SLP) clinics
  * Occupational Therapy (OT) clinics
  * Physical Therapy (PT) clinics
* [ ] **Metro Density Rules:** In all priority metro counties, there must be at least **3 verified, active resource listings** per specialty.

---

## K. Trust, Provenance & Verification
* [ ] **No Unlabeled Placeholders:** `data_origin` must clearly distinguish between `curated_seed`, `scraped_live`, and `generated_county_fallback`.
* [ ] **Human Verification Queue:** All records with `verification_status = 'human_verified'` must have a corresponding entry in `sources` or `source_verifications`.
* [ ] **Source URLs:** Every local office and provider record must include a valid `source_url` pointing to the official state directory or provider portal.
