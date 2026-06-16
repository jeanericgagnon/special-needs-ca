# Texas Resource Truth Map

This document establishes the source of truth for Texas (TX) disability and special needs resources across all categories. It defines the real-world operational structure, official websites, database routing targets, and evidence levels.

---

## Category A: State Identity and Geography

1.  **Real-world Texas Structure:** County-level (254 counties).
2.  **Official/Trusted Source URLs:**
    *   [Texas Association of Counties Directory](https://www.county.org/About-Texas-Counties/Texas-County-Directory)
    *   [Texas.gov Local Services Lookup](https://www.texas.gov/services/local-services/)
3.  **Entities that should exist in the database:** 254 counties in the `counties` table.
4.  **Service Area Mapping:** County-level.
5.  **Target Table:** `counties`
6.  **Correct evidence_level:** `official_state`
7.  **Correct data_origin:** `official_state`
8.  **Correct verification_status:** `verified`
9.  **Fields available from source:** County name, county seat, official website, FIPS code.
10. **Fields missing from source:** Local geographic boundaries.
11. **Pull method:** Static fetch / manual compilation.
12. **Risk level:** Low.
13. **What should not be pulled:** Unofficial municipal directories.

---

## Category B: Medicaid / Benefits / HHS Local Offices

1.  **Real-world Texas Structure:** Regional offices under the Texas Health and Human Services Commission (HHSC).
2.  **Official/Trusted Source URLs:**
    *   [HHSC Social Services Office Locator](https://hhs.texas.gov/services/financial/social-services-offices)
    *   [Your Texas Benefits Portal](https://www.yourtexasbenefits.com)
3.  **Entities that should exist in the database:** Local HHSC eligibility offices serving families.
4.  **Service Area Mapping:** Mapped to counties. Major counties have physical offices; rural counties route to regional hubs.
5.  **Target Table:** `county_offices` (program_id: `tx-mdcp` or pediatric Medicaid).
6.  **Correct evidence_level:** `official_locator_derived`
7.  **Correct data_origin:** `official_locator_derived`
8.  **Correct verification_status:** `source_listed`
9.  **Fields available from source:** Office name, physical address, phone, fax, hours, county.
10. **Fields missing from source:** Direct staff emails.
11. **Pull method:** Locator search / Playwright automation.
12. **Risk level:** Low.
13. **What should not be pulled:** Staff internal rosters.

---

## Category C: DD/IDD / LIDDAs

1.  **Real-world Texas Structure:** Regional. Texas is divided into local service areas, each served by a designated Local Intellectual and Developmental Disability Authority (LIDDA). There are exactly 39 LIDDAs covering all 254 counties.
2.  **Official/Trusted Source URLs:**
    *   [Texas HHS LIDDA Directory Search](https://apps.hhs.texas.gov/contact/la.cfm)
    *   [HHSC LIDDA Directory Info](https://hhs.texas.gov/services/health/local-intellectual-developmental-disability-authorities-lidda)
3.  **Entities that should exist in the database:** 39 LIDDA agencies.
4.  **Service Area Mapping:** Regional (each LIDDA serves a specific group of counties).
5.  **Target Table:** `state_resource_agencies` (agency_type: `lidda`). County relationship maps in `regional_center_counties` (since "regional center" is the generic term used for local DD routing).
6.  **Correct evidence_level:** `official_locator_derived`
7.  **Correct data_origin:** `official_locator_derived`
8.  **Correct verification_status:** `source_listed`
9.  **Fields available from source:** Name, official website, intake phone, main phone, counties served, headquarters address, crisis hotline.
10. **Fields missing from source:** Local department emails.
11. **Intake/Routing Process:** Families must contact their local LIDDA directly to perform intake assessments for HCS, TxHmL, and general IDD services.
12. **Pull method:** Search locator / manual directory verification.
13. **Risk level:** Low.
14. **What not to pull:** Local mental health authority (LMHA) adult psychiatric clinical clinics unless they are the same entity (many are joint LIDDA/LMHA centers).

---

## Category D: HCBS Waivers / Interest Lists

1.  **Real-world Texas Structure:** Statewide waiver programs funded by Medicaid and managed by HHSC. Waitlists (called "Interest Lists" in Texas) are managed chronologically.
2.  **Official/Trusted Source URLs:**
    *   [Texas HHS Long-term Care Waiver Programs](https://www.hhs.texas.gov/providers/individual-family-support)
    *   [Texas HHS Interest List Milestones](https://www.hhs.texas.gov/doing-business-hhs/provider-portals/resources/interest-list-milestones)
3.  **Entities that should exist in the database:**
    *   Programs: HCS (Home and Community-Based Services), TxHmL (Texas Home Living), CLASS (Community Living Assistance and Support Services), MDCP (Medically Dependent Children Program), DBMD (Deaf-Blind with Multiple Disabilities), and YES Waiver (Youth Empowerment Services).
    *   Interest Lists: Wait times and status records for each waiver.
4.  **Service Area Mapping:** Statewide.
5.  **Target Table:** `programs` (for waivers), `program_waitlists` (for interest lists), `program_appeal_info` (for appeals).
6.  **Correct evidence_level:** `official_state`
7.  **Correct data_origin:** `official_state`
8.  **Correct verification_status:** `source_listed`
9.  **Fields available from source:** Waiver description, eligibility rules, wait times (duration in months), helpline numbers, appeal steps.
10. **Fields missing from source:** Real-time personal waitlist positions.
11. **Pull method:** Static page fetch and annual official interest list reports.
12. **Risk level:** Low.
13. **What not to pull:** Private provider registries or individual patient identifiers.

---

## Category E: Early Childhood Intervention / ECI

1.  **Real-world Texas Structure:** Regional/contracted. HHSC contracts with 37 local agencies and nonprofits (like Any Baby Can, Brighton Center, The Warren Center, LifePath Systems, Texana Center, etc.) to deliver Part C early intervention services.
2.  **Official/Trusted Source URLs:**
    *   [Texas HHS ECI Main Portal](https://hhs.texas.gov/services/disability/early-childhood-intervention-services)
    *   [Texas ECI Program Search Directory](https://citysearch.hhsc.state.tx.us)
3.  **Entities that should exist in the database:** 37 ECI local contractors.
4.  **Service Area Mapping:** Mapped to counties. Each contractor has a designated county catchment area.
5.  **Target Table:** `state_resource_agencies` (agency_type: `eci`).
6.  **Correct evidence_level:** `official_locator_derived`
7.  **Correct data_origin:** `official_locator_derived`
8.  **Correct verification_status:** `source_listed`
9.  **Fields available from source:** Contractor name, office address, phone, website, counties served.
10. **Fields missing from source:** Direct contact emails for intake forms.
11. **Referral Process:** Anyone can make a referral to ECI (parent, pediatrician, childcare center). Referral desk phone: `(800) 628-5115`.
12. **Pull method:** Locator query and directory compilation.
13. **Risk level:** Low.
14. **What not to pull:** Individual therapist names, therapist credentials, or local site locations. Do not create 254 individual county offices. ECI has exactly 37 local contractors; each contractor should be stored as a single record and mapped to the counties it serves.

---

## Category F: TEA / SPEDTex / Special Education

1.  **Real-world Texas Structure:** Statewide oversight by the Texas Education Agency (TEA). Direct parent support is contracted to **SPEDTex** (Special Education Information Center).
2.  **Official/Trusted Source URLs:**
    *   [TEA Special Education Page](https://tea.texas.gov/academics/special-student-populations/special-education)
    *   [SPEDTex - Special Education Information Center](https://www.spedtex.org)
3.  **Entities that should exist in the database:**
    *   State Agency: Texas Education Agency (TEA) under `state_resource_agencies`.
    *   Information Center: SPEDTex under `nonprofit_organizations` or `state_resource_agencies`.
4.  **Service Area Mapping:** Statewide.
5.  **Target Table:** `programs` (TEA Special Ed Services), `nonprofit_organizations` (SPEDTex).
6.  **Correct evidence_level:** `official_state`
7.  **Correct data_origin:** `official_state`
8.  **Correct verification_status:** `source_listed`
9.  **Fields available from source:** Contact phone `(855) 773-3839`, website, email `spedtex@esc10.net`, procedural safeguards links, mediation and state complaint guidelines.
10. **Fields missing from source:** Local school campus directories.
11. **Dispute Resolution:** TEA handles due process hearings, mediation, and state complaints.
12. **Pull method:** Static page / official manuals.
13. **Risk level:** Low.

---

## Category G: ESCs / Regional Education

1.  **Real-world Texas Structure:** Regional. Texas is divided into 20 Education Service Center (ESC) regions.
2.  **Official/Trusted Source URLs:**
    *   [TEA Education Service Centers Directory](https://tea.texas.gov/about-tea/other-services/education-service-centers)
3.  **Entities that should exist in the database:** 20 ESCs.
4.  **Service Area Mapping:** Mapped to counties. Each ESC serves a specific list of school districts and counties.
5.  **Target Table:** `regional_education_agencies` (agency_type: `esc`). Mapped in `selpa_counties` (reusing California's relationship structure).
6.  **Correct evidence_level:** `official_locator_derived`
7.  **Correct data_origin:** `official_locator_derived`
8.  **Correct verification_status:** `source_listed`
9.  **Fields available from source:** Name, website, phone, headquarters city, counties served.
10. **Fields missing from source:** CAMPUS level special education contacts.
11. **Pull method:** Static directory page.
12. **Risk level:** Low.

---

## Category H: Priority School District Special Education Contacts

1.  **Real-world Texas Structure:** Local school district special education offices.
2.  **Priority Counties:** Harris, Dallas, Tarrant, Travis, Bexar, Collin, Denton, Fort Bend, Montgomery, Williamson, Hidalgo, El Paso, Brazoria, Galveston, Nueces.
3.  **Official/Trusted Source URLs:** Individual ISD special education pages (e.g., Houston ISD, Dallas ISD, Austin ISD, etc.).
4.  **Entities that should exist in the database:** Priority school districts.
5.  **Service Area Mapping:** District-level.
6.  **Target Table:** `school_districts`
7.  **Correct evidence_level:** `official_locator_derived`
8.  **Correct data_origin:** `official_locator_derived` (for locator listings) or `curated_seed` (for hand-verified contact info).
9.  **Correct verification_status:** `source_listed`
10. **Fields available from source:** District name, website, phone, email, enrollment, special ed statistics.
11. **Fields missing from source:** Personal cell phones of coordinators.
12. **Pull Recommendation:** Later. The database already contains 16 priority districts as curated seeds, and 248 school districts as locator-derived. We should audit and refine contacts but do not need a new pull now.

---

## Category I: Forms and Appeals

1.  **Real-world Texas Structure:** Under state agency authority (HHSC, TEA, TWC).
2.  **Official/Trusted Source URLs:**
    *   [Texas HHSC Forms Catalog](https://www.hhs.texas.gov/laws-regulations/forms)
    *   [TEA Special Education Dispute Resolution](https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution)
3.  **Entities to Map:**
    *   Your Texas Benefits Form H1010 (Medicaid/CHIP).
    *   ECI Physician Referral Form (Form 3911).
    *   TEA Due Process Request Form.
    *   TEA State Complaint Form.
    *   TEA Mediation Request Form.
    *   TWC VR Appeal forms.
    *   Texas ABLE Account Enrollment.
4.  **Comparison with `seo-data.ts`:**
    *   *Aligned:* Medicaid (H1010), HCS/CLASS/TxHmL/MDCP guides, ECI referral, IEP Request Letter, and TEA complaints.
    *   *Missing Official Source URLs:* Several guides are content-only and require direct URL targets pointing to the forms.
5.  **Target Table:** `program_appeal_info`, `program_document_requirements`, and `seo-data.ts`.
6.  **Correct evidence_level:** `official_state`

---

## Category J: Transition / VR / ABLE

1.  **Real-world Texas Structure:** Statewide services. Vocational Rehabilitation (VR) is managed by the Texas Workforce Commission (TWC). ABLE accounts are managed by the Texas Prepaid Higher Education Tuition Board.
2.  **Official/Trusted Source URLs:**
    *   [TWC Vocational Rehabilitation Services](https://www.twc.texas.gov/services/vocational-rehabilitation)
    *   [Texas ABLE Program Page](https://www.texasable.org)
    *   [Disability Rights Texas Supported Decision-Making](https://www.disabilityrightstx.org/en/category/supported-decision-making/)
3.  **Entities that should exist in the database:**
    *   TWC Vocational Rehabilitation (VR) under `state_resource_agencies` (agency_type: `vr`).
    *   Texas ABLE under `programs`.
4.  **Service Area Mapping:** Statewide.
5.  **Target Table:** `state_resource_agencies`, `programs`.
6.  **Correct evidence_level:** `official_state`
7.  **Correct data_origin:** `official_state`
8.  **Correct verification_status:** `source_listed`
9.  **Fields available from source:** Program name, website, phone, eligibility rules, alternatives to guardianship (Supported Decision-Making).
10. **Fields missing from source:** Individual caseworker contact information.
11. **Pull method:** Static page fetch.
12. **Risk level:** Low.

---

## Category K: Trusted Nonprofits

1.  **Real-world Texas Structure:** Regional chapters and statewide support organizations.
2.  **Official/Trusted Source URLs:**
    *   [Partners Resource Network (PTI PATH/PEN/TEAM)](https://prntexas.org)
    *   [Disability Rights Texas](https://www.disabilityrightstx.org)
    *   [Texas Parent to Parent](https://www.txp2p.org)
    *   [The Arc of Texas local chapters list](https://www.thearcoftexas.org)
    *   [Autism Society of Texas](https://www.texasautismsociety.org)
    *   [Down Syndrome Associations (Houston, Central, South, North, El Paso, RGV)](https://www.dsact.org)
    *   [Texas Legal Aid Organizations (Lone Star, LANWT, TRLA)](https://www.trla.org)
3.  **Entities that should exist in the database:**
    *   Statewide: DRTx, PRN, TxP2P, The Arc of Texas, Autism Society of Texas.
    *   Regional/Local: Local Arc chapters (Capital Area, Greater Houston, San Antonio, Northeast, Dallas, Wichita County), regional Down Syndrome Associations, Centers for Independent Living, and the 3 regional Legal Aid organizations.
4.  **Service Area Mapping:** Mapped to counties.
    *   *PATH Project:* Serves East/Southeast Texas counties.
    *   *PEN Project:* Serves West/Northwest Texas counties.
    *   *TEAM Project:* Serves North/Central Texas counties.
    *   *Lone Star Legal Aid:* Serves 72 East Texas counties.
    *   *Legal Aid of Northwest Texas (LANWT):* Serves 114 North and West Texas counties.
    *   *Texas RioGrande Legal Aid (TRLA):* Serves 68 South and West Texas counties.
5.  **Target Table:** `nonprofit_organizations`
6.  **Correct evidence_level:** `official_locator_derived` (for regional chapters) or `official_state` (for statewide organizations).
7.  **Correct data_origin:** `official_locator_derived` or `curated_seed`.
8.  **Correct verification_status:** `source_listed`
9.  **Fields available from source:** Organization name, website, phone, counties served, focus condition.
10. **Fields missing from source:** Local director cell phones.
11. **What replaces fallbacks:** Local/regional chapters (like local Arc, regional PTI project, or regional legal aid) can replace the generic `np-[county]-tx-fallback` record for counties that fall within their service areas. If no regional chapter exists, the statewide fallback (`Texas Parent to Parent (HHS Local Referral Program)`) remains.

---

## Category L: Hospital / University Clinics

1.  **Real-world Texas Structure:** Provider-level clinical resources.
2.  **Official/Trusted Source URLs:**
    *   [Texas Children's Hospital Autism Center](https://www.texaschildrens.org/departments/autism-center)
    *   [Cook Children's Child Development Center](https://www.cookchildrens.org/services/child-development/)
    *   [UT Dallas Callier Center for Communication Disorders](https://calliercenter.utdallas.edu)
    *   [Dell Children's Texas Child Study Center](https://www.dellchildrens.net)
    *   [UT Health Houston Center for Autism](https://www.uth.edu)
3.  **Entities that should exist in the database:** University and hospital pediatric autism/developmental centers.
4.  **Service Area Mapping:** Provider-level (based in a specific city/county, but serving families statewide or regionally).
5.  **Target Table:** `resource_providers`
6.  **Correct evidence_level:** `official_locator_derived`
7.  **Correct data_origin:** `official_locator_derived`
8.  **Correct verification_status:** `source_listed`
9.  **Fields available from source:** Center name, website, phone, address, services, conditions.
10. **Fields missing from source:** Insurance contract details.
11. **Pull method:** Static page fetch.
12. **Risk level:** Low.
13. **What should not be pulled:** Appointment scheduling systems, patient portals, or specific therapist rosters.

---

## Category M: Provider / Advocate / Legal

1.  **Real-world Texas Structure:** Private practitioners, attorneys, advocates.
2.  **Official/Trusted Source URLs:**
    *   COPAA Attorney and Advocate Search
    *   Wrightslaw Yellow Pages for Kids
    *   State Bar of Texas lawyer search
3.  **Target Table:** `iep_advocates`
4.  **Correct evidence_level:** `provider_directory_derived`
5.  **Correct data_origin:** `provider_directory_derived`
6.  **Correct verification_status:** `source_listed`
7.  **Robots/Terms Risk:** Medium to High.
8.  **Recommendation:** Skip automated scraping due to scraper terms and robots restrictions. Instead, create a **manual review queue** in the database to curate high-trust practitioners.
