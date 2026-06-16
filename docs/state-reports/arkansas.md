# Data Provenance Report: Arkansas (AR)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Arkansas under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.1%** (Manual Review Rate: **58.9%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Arkansas Medicaid`
- **Waiver Program Name**: `Arkansas HCBS Waivers`
- **Personal Care Program**: `Arkansas Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Arkansas Division of Developmental Disabilities Services`
- **State Education Agency**: `Arkansas Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Arkansas Early Intervention`
- **ABLE Savings Program**: `Arkansas ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 75
- **County Social Service Storefronts**: 75
- **School Districts**: 75
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 225
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 309 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 157 records
- **Manual Review Backlog (Flagged)**: 225 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Arkansas ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Arkansas Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://humanservices.arkansas.gov/medicaid
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Arkansas Early Intervention Services** (State Program): Source URL: https://humanservices.arkansas.gov/dds
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Arkansas HCBS Waivers** (State Program): Source URL: https://humanservices.arkansas.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Arkansas residents.
- **Arkansas Medicaid** (State Program): Source URL: https://humanservices.arkansas.gov/medicaid
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Arkansas Medicaid Personal Care** (State Program): Source URL: https://humanservices.arkansas.gov/medicaid
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Arkansas Self-Direction Services** (State Program): Source URL: https://humanservices.arkansas.gov/dds
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Arkansas Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Arkansas Transition & Vocational Rehabilitation** (State Program): Source URL: https://humanservices.arkansas.gov/dds
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Arkansas)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Arkansas Developmental Services Intake** (dd_intake): Website: https://dhhs.arkansas.gov/dd | Phone: None | Status: `manual_review_required`
- **Arkansas Early Intervention State Office** (early_intervention): Website: https://dhhs.arkansas.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Arkansas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ashley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Baxter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benton County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Boone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bradley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calhoun County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chicot County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cleburne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cleveland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Columbia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Conway County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Craighead County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crawford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crittenden County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cross County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dallas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Desha County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Drew County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Faulkner County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fulton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Garland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greene County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hempstead County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hot Spring County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Howard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Independence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Izard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lafayette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lawrence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Little River County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Logan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lonoke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Miller County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mississippi County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nevada County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Newton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ouachita County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Perry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Phillips County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pike County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Poinsett County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pope County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Prairie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pulaski County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Randolph County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saline County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Searcy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sebastian County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sevier County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sharp County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Francis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Van Buren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| White County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Woodruff County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Arkansas County storefront office | Arkansas County | `off-arkansas-ar-medicaid` |
| Office | Ashley County storefront office | Ashley County | `off-ashley-ar-medicaid` |
| Office | Baxter County storefront office | Baxter County | `off-baxter-ar-medicaid` |
| Office | Benton County storefront office | Benton County | `off-benton-ar-medicaid` |
| Office | Boone County storefront office | Boone County | `off-boone-ar-medicaid` |
| Office | Bradley County storefront office | Bradley County | `off-bradley-ar-medicaid` |
| Office | Calhoun County storefront office | Calhoun County | `off-calhoun-ar-medicaid` |
| Office | Carroll County storefront office | Carroll County | `off-carroll-ar-medicaid` |
| Office | Chicot County storefront office | Chicot County | `off-chicot-ar-medicaid` |
| Office | Clark County storefront office | Clark County | `off-clark-ar-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-ar-medicaid` |
| Office | Cleburne County storefront office | Cleburne County | `off-cleburne-ar-medicaid` |
| Office | Cleveland County storefront office | Cleveland County | `off-cleveland-ar-medicaid` |
| Office | Columbia County storefront office | Columbia County | `off-columbia-ar-medicaid` |
| Office | Conway County storefront office | Conway County | `off-conway-ar-medicaid` |
| Office | Craighead County storefront office | Craighead County | `off-craighead-ar-medicaid` |
| Office | Crawford County storefront office | Crawford County | `off-crawford-ar-medicaid` |
| Office | Crittenden County storefront office | Crittenden County | `off-crittenden-ar-medicaid` |
| Office | Cross County storefront office | Cross County | `off-cross-ar-medicaid` |
| Office | Dallas County storefront office | Dallas County | `off-dallas-ar-medicaid` |
| Office | Desha County storefront office | Desha County | `off-desha-ar-medicaid` |
| Office | Drew County storefront office | Drew County | `off-drew-ar-medicaid` |
| Office | Faulkner County storefront office | Faulkner County | `off-faulkner-ar-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-ar-medicaid` |
| Office | Fulton County storefront office | Fulton County | `off-fulton-ar-medicaid` |
| Office | Garland County storefront office | Garland County | `off-garland-ar-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-ar-medicaid` |
| Office | Greene County storefront office | Greene County | `off-greene-ar-medicaid` |
| Office | Hempstead County storefront office | Hempstead County | `off-hempstead-ar-medicaid` |
| Office | Hot Spring County storefront office | Hot Spring County | `off-hot-spring-ar-medicaid` |
| Office | Howard County storefront office | Howard County | `off-howard-ar-medicaid` |
| Office | Independence County storefront office | Independence County | `off-independence-ar-medicaid` |
| Office | Izard County storefront office | Izard County | `off-izard-ar-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-ar-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-ar-medicaid` |
| Office | Johnson County storefront office | Johnson County | `off-johnson-ar-medicaid` |
| Office | Lafayette County storefront office | Lafayette County | `off-lafayette-ar-medicaid` |
| Office | Lawrence County storefront office | Lawrence County | `off-lawrence-ar-medicaid` |
| Office | Lee County storefront office | Lee County | `off-lee-ar-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-ar-medicaid` |
| Office | Little River County storefront office | Little River County | `off-little-river-ar-medicaid` |
| Office | Logan County storefront office | Logan County | `off-logan-ar-medicaid` |
| Office | Lonoke County storefront office | Lonoke County | `off-lonoke-ar-medicaid` |
| Office | Madison County storefront office | Madison County | `off-madison-ar-medicaid` |
| Office | Marion County storefront office | Marion County | `off-marion-ar-medicaid` |
| Office | Miller County storefront office | Miller County | `off-miller-ar-medicaid` |
| Office | Mississippi County storefront office | Mississippi County | `off-mississippi-ar-medicaid` |
| Office | Monroe County storefront office | Monroe County | `off-monroe-ar-medicaid` |
| Office | Montgomery County storefront office | Montgomery County | `off-montgomery-ar-medicaid` |
| Office | Nevada County storefront office | Nevada County | `off-nevada-ar-medicaid` |
| ... | *and 175 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
