# Data Provenance Report: Kansas (KS)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Kansas under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **40.8%** (Manual Review Rate: **59.21%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Kansas Medicaid`
- **Waiver Program Name**: `Kansas HCBS Waivers`
- **Personal Care Program**: `Kansas Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Kansas Department for Aging and Disability Services`
- **State Education Agency**: `Kansas Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Kansas Early Intervention`
- **ABLE Savings Program**: `Kansas ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 105
- **County Social Service Storefronts**: 105
- **School Districts**: 105
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 315
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 429 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 217 records
- **Manual Review Backlog (Flagged)**: 315 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Kansas ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Kansas Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.kancare.ks.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Kansas Early Intervention Services** (State Program): Source URL: https://www.kdads.ks.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Kansas HCBS Waivers** (State Program): Source URL: https://www.kdads.ks.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Kansas residents.
- **Kansas Medicaid** (State Program): Source URL: https://www.kancare.ks.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Kansas Medicaid Personal Care** (State Program): Source URL: https://www.kancare.ks.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Kansas Self-Direction Services** (State Program): Source URL: https://www.kdads.ks.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Kansas Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Kansas Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.kdads.ks.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Kansas)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Kansas Developmental Services Intake** (dd_intake): Website: https://dhhs.kansas.gov/dd | Phone: None | Status: `manual_review_required`
- **Kansas Early Intervention State Office** (early_intervention): Website: https://dhhs.kansas.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Allen County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Anderson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Atchison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Barber County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Barton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bourbon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brown County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Butler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chase County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chautauqua County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cherokee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cheyenne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cloud County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Coffey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Comanche County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cowley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crawford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Decatur County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dickinson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Doniphan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Edwards County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Elk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ellis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ellsworth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Finney County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Geary County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gove County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Graham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gray County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greeley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greenwood County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hamilton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harvey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Haskell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hodgeman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jewell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Kearny County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kingman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kiowa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Labette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lane County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Leavenworth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Linn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Logan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lyon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McPherson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Meade County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Miami County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mitchell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morris County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nemaha County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Neosho County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ness County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Norton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Osage County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Osborne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ottawa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pawnee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Phillips County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pottawatomie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pratt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rawlins County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Reno County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Republic County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rice County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Riley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rooks County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rush County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Russell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saline County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sedgwick County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Seward County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shawnee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sheridan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sherman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Smith County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stafford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stanton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stevens County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sumner County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Thomas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Trego County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wabaunsee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wallace County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wichita County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wilson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Woodson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wyandotte County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Allen County storefront office | Allen County | `off-allen-ks-medicaid` |
| Office | Anderson County storefront office | Anderson County | `off-anderson-ks-medicaid` |
| Office | Atchison County storefront office | Atchison County | `off-atchison-ks-medicaid` |
| Office | Barber County storefront office | Barber County | `off-barber-ks-medicaid` |
| Office | Barton County storefront office | Barton County | `off-barton-ks-medicaid` |
| Office | Bourbon County storefront office | Bourbon County | `off-bourbon-ks-medicaid` |
| Office | Brown County storefront office | Brown County | `off-brown-ks-medicaid` |
| Office | Butler County storefront office | Butler County | `off-butler-ks-medicaid` |
| Office | Chase County storefront office | Chase County | `off-chase-ks-medicaid` |
| Office | Chautauqua County storefront office | Chautauqua County | `off-chautauqua-ks-medicaid` |
| Office | Cherokee County storefront office | Cherokee County | `off-cherokee-ks-medicaid` |
| Office | Cheyenne County storefront office | Cheyenne County | `off-cheyenne-ks-medicaid` |
| Office | Clark County storefront office | Clark County | `off-clark-ks-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-ks-medicaid` |
| Office | Cloud County storefront office | Cloud County | `off-cloud-ks-medicaid` |
| Office | Coffey County storefront office | Coffey County | `off-coffey-ks-medicaid` |
| Office | Comanche County storefront office | Comanche County | `off-comanche-ks-medicaid` |
| Office | Cowley County storefront office | Cowley County | `off-cowley-ks-medicaid` |
| Office | Crawford County storefront office | Crawford County | `off-crawford-ks-medicaid` |
| Office | Decatur County storefront office | Decatur County | `off-decatur-ks-medicaid` |
| Office | Dickinson County storefront office | Dickinson County | `off-dickinson-ks-medicaid` |
| Office | Doniphan County storefront office | Doniphan County | `off-doniphan-ks-medicaid` |
| Office | Douglas County storefront office | Douglas County | `off-douglas-ks-medicaid` |
| Office | Edwards County storefront office | Edwards County | `off-edwards-ks-medicaid` |
| Office | Elk County storefront office | Elk County | `off-elk-ks-medicaid` |
| Office | Ellis County storefront office | Ellis County | `off-ellis-ks-medicaid` |
| Office | Ellsworth County storefront office | Ellsworth County | `off-ellsworth-ks-medicaid` |
| Office | Finney County storefront office | Finney County | `off-finney-ks-medicaid` |
| Office | Ford County storefront office | Ford County | `off-ford-ks-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-ks-medicaid` |
| Office | Geary County storefront office | Geary County | `off-geary-ks-medicaid` |
| Office | Gove County storefront office | Gove County | `off-gove-ks-medicaid` |
| Office | Graham County storefront office | Graham County | `off-graham-ks-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-ks-medicaid` |
| Office | Gray County storefront office | Gray County | `off-gray-ks-medicaid` |
| Office | Greeley County storefront office | Greeley County | `off-greeley-ks-medicaid` |
| Office | Greenwood County storefront office | Greenwood County | `off-greenwood-ks-medicaid` |
| Office | Hamilton County storefront office | Hamilton County | `off-hamilton-ks-medicaid` |
| Office | Harper County storefront office | Harper County | `off-harper-ks-medicaid` |
| Office | Harvey County storefront office | Harvey County | `off-harvey-ks-medicaid` |
| Office | Haskell County storefront office | Haskell County | `off-haskell-ks-medicaid` |
| Office | Hodgeman County storefront office | Hodgeman County | `off-hodgeman-ks-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-ks-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-ks-medicaid` |
| Office | Jewell County storefront office | Jewell County | `off-jewell-ks-medicaid` |
| Office | Johnson County storefront office | Johnson County | `off-johnson-ks-medicaid` |
| Office | Kearny County storefront office | Kearny County | `off-kearny-ks-medicaid` |
| Office | Kingman County storefront office | Kingman County | `off-kingman-ks-medicaid` |
| Office | Kiowa County storefront office | Kiowa County | `off-kiowa-ks-medicaid` |
| Office | Labette County storefront office | Labette County | `off-labette-ks-medicaid` |
| ... | *and 265 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
