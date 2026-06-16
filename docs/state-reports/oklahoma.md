# Data Provenance Report: Oklahoma (OK)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Oklahoma under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.1%** (Manual Review Rate: **58.93%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Oklahoma Medicaid`
- **Waiver Program Name**: `Oklahoma HCBS Waivers`
- **Personal Care Program**: `Oklahoma SoonerCare Personal Care`
- **Developmental Disability (DD) Agency**: `Oklahoma Developmental Disabilities Services`
- **State Education Agency**: `Oklahoma Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Oklahoma Early Intervention`
- **ABLE Savings Program**: `Oklahoma ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 77
- **County Social Service Storefronts**: 77
- **School Districts**: 77
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 231
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 317 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 161 records
- **Manual Review Backlog (Flagged)**: 231 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Oklahoma ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Oklahoma Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://oklahoma.gov/ohca
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Oklahoma Early Intervention Services** (State Program): Source URL: https://oklahoma.gov/okdhs/services/dds
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Oklahoma HCBS Waivers** (State Program): Source URL: https://oklahoma.gov/okdhs/services/dds/hcbs/eligibility.html
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Oklahoma residents.
- **Oklahoma Medicaid** (State Program): Source URL: https://oklahoma.gov/ohca
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Oklahoma Self-Direction Services** (State Program): Source URL: https://oklahoma.gov/okdhs/services/dds
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Oklahoma SoonerCare Personal Care** (State Program): Source URL: https://oklahoma.gov/ohca
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Oklahoma Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Oklahoma Transition & Vocational Rehabilitation** (State Program): Source URL: https://oklahoma.gov/okdhs/services/dds
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Oklahoma)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Oklahoma Developmental Services Intake** (dd_intake): Website: https://dhhs.oklahoma.gov/dd | Phone: None | Status: `manual_review_required`
- **Oklahoma Early Intervention State Office** (early_intervention): Website: https://dhhs.oklahoma.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adair County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Alfalfa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Atoka County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Beaver County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Beckham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Blaine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bryan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Caddo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Canadian County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cherokee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Choctaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cimarron County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cleveland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Coal County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Comanche County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cotton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Craig County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Creek County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Custer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Delaware County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dewey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ellis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Garfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Garvin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grady County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harmon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Haskell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hughes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kingfisher County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kiowa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Latimer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| LeFlore County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Logan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Love County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Major County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mayes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McClain County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McCurtain County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McIntosh County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Murray County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Muskogee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Noble County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nowata County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Okfuskee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oklahoma County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Okmulgee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Osage County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ottawa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pawnee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Payne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pittsburg County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pontotoc County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pottawatomie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pushmataha County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Roger Mills County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rogers County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Seminole County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sequoyah County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stephens County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Texas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tillman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tulsa County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Wagoner County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washita County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Woods County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Woodward County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

---

## 8. Detailed County-Level Gap Registry
List of specific counties with zero resource mappings:
- **Counties Missing Social Service Offices**: None
- **Counties Missing School Districts**: None
- **Counties Missing Local Nonprofits**: None

---

## 9. Manual Review Queue Registry
List of records flagged as `manual_review_required` in the database, representing exactly what needs to be verified before this state can be advanced:

| Category | Record Name | County | ID |
| :--- | :--- | :--- | :--- |
| Office | Adair County storefront office | Adair County | `off-adair-ok-medicaid` |
| Office | Alfalfa County storefront office | Alfalfa County | `off-alfalfa-ok-medicaid` |
| Office | Atoka County storefront office | Atoka County | `off-atoka-ok-medicaid` |
| Office | Beaver County storefront office | Beaver County | `off-beaver-ok-medicaid` |
| Office | Beckham County storefront office | Beckham County | `off-beckham-ok-medicaid` |
| Office | Blaine County storefront office | Blaine County | `off-blaine-ok-medicaid` |
| Office | Bryan County storefront office | Bryan County | `off-bryan-ok-medicaid` |
| Office | Caddo County storefront office | Caddo County | `off-caddo-ok-medicaid` |
| Office | Canadian County storefront office | Canadian County | `off-canadian-ok-medicaid` |
| Office | Carter County storefront office | Carter County | `off-carter-ok-medicaid` |
| Office | Cherokee County storefront office | Cherokee County | `off-cherokee-ok-medicaid` |
| Office | Choctaw County storefront office | Choctaw County | `off-choctaw-ok-medicaid` |
| Office | Cimarron County storefront office | Cimarron County | `off-cimarron-ok-medicaid` |
| Office | Cleveland County storefront office | Cleveland County | `off-cleveland-ok-medicaid` |
| Office | Coal County storefront office | Coal County | `off-coal-ok-medicaid` |
| Office | Comanche County storefront office | Comanche County | `off-comanche-ok-medicaid` |
| Office | Cotton County storefront office | Cotton County | `off-cotton-ok-medicaid` |
| Office | Craig County storefront office | Craig County | `off-craig-ok-medicaid` |
| Office | Creek County storefront office | Creek County | `off-creek-ok-medicaid` |
| Office | Custer County storefront office | Custer County | `off-custer-ok-medicaid` |
| Office | Delaware County storefront office | Delaware County | `off-delaware-ok-medicaid` |
| Office | Dewey County storefront office | Dewey County | `off-dewey-ok-medicaid` |
| Office | Ellis County storefront office | Ellis County | `off-ellis-ok-medicaid` |
| Office | Garfield County storefront office | Garfield County | `off-garfield-ok-medicaid` |
| Office | Garvin County storefront office | Garvin County | `off-garvin-ok-medicaid` |
| Office | Grady County storefront office | Grady County | `off-grady-ok-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-ok-medicaid` |
| Office | Greer County storefront office | Greer County | `off-greer-ok-medicaid` |
| Office | Harmon County storefront office | Harmon County | `off-harmon-ok-medicaid` |
| Office | Harper County storefront office | Harper County | `off-harper-ok-medicaid` |
| Office | Haskell County storefront office | Haskell County | `off-haskell-ok-medicaid` |
| Office | Hughes County storefront office | Hughes County | `off-hughes-ok-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-ok-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-ok-medicaid` |
| Office | Johnston County storefront office | Johnston County | `off-johnston-ok-medicaid` |
| Office | Kay County storefront office | Kay County | `off-kay-ok-medicaid` |
| Office | Kingfisher County storefront office | Kingfisher County | `off-kingfisher-ok-medicaid` |
| Office | Kiowa County storefront office | Kiowa County | `off-kiowa-ok-medicaid` |
| Office | Latimer County storefront office | Latimer County | `off-latimer-ok-medicaid` |
| Office | LeFlore County storefront office | LeFlore County | `off-leflore-ok-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-ok-medicaid` |
| Office | Logan County storefront office | Logan County | `off-logan-ok-medicaid` |
| Office | Love County storefront office | Love County | `off-love-ok-medicaid` |
| Office | Major County storefront office | Major County | `off-major-ok-medicaid` |
| Office | Marshall County storefront office | Marshall County | `off-marshall-ok-medicaid` |
| Office | Mayes County storefront office | Mayes County | `off-mayes-ok-medicaid` |
| Office | McClain County storefront office | McClain County | `off-mcclain-ok-medicaid` |
| Office | McCurtain County storefront office | McCurtain County | `off-mccurtain-ok-medicaid` |
| Office | McIntosh County storefront office | McIntosh County | `off-mcintosh-ok-medicaid` |
| Office | Murray County storefront office | Murray County | `off-murray-ok-medicaid` |
| ... | *and 181 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
