# Data Provenance Report: South Dakota (SD)

This report details the data sources, records count, trust classifications, and launch readiness for the State of South Dakota under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.2%** (Manual Review Rate: **58.75%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `South Dakota Medicaid`
- **Waiver Program Name**: `South Dakota HCBS Waivers`
- **Personal Care Program**: `South Dakota Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `South Dakota Division of Developmental Disabilities`
- **State Education Agency**: `South Dakota Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `South Dakota Early Intervention`
- **ABLE Savings Program**: `South Dakota ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 66
- **County Social Service Storefronts**: 66
- **School Districts**: 66
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 198
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 273 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 139 records
- **Manual Review Backlog (Flagged)**: 198 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **SSI for Children (South Dakota)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **South Dakota ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **South Dakota Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://dss.sd.gov/medicaid
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **South Dakota Early Intervention Services** (State Program): Source URL: https://dhs.sd.gov/dd
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **South Dakota HCBS Waivers** (State Program): Source URL: https://dhs.sd.gov/dd/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for South Dakota residents...
- **South Dakota Medicaid** (State Program): Source URL: https://dss.sd.gov/medicaid
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **South Dakota Medicaid Personal Care** (State Program): Source URL: https://dss.sd.gov/medicaid
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **South Dakota Self-Direction Services** (State Program): Source URL: https://dhs.sd.gov/dd
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **South Dakota Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **South Dakota Transition & Vocational Rehabilitation** (State Program): Source URL: https://dhs.sd.gov/dd
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **South Dakota Developmental Services Intake** (dd_intake): Website: https://dhhs.south-dakota.gov/dd | Phone: None | Status: `manual_review_required`
- **South Dakota Early Intervention State Office** (early_intervention): Website: https://dhhs.south-dakota.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Aurora County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Beadle County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bennett County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bon Homme County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brookings County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brown County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brule County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Buffalo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Butte County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Campbell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Charles Mix County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Codington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Corson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Custer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Davison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Day County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Deuel County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dewey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Edmunds County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fall River County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Faulk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gregory County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Haakon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hamlin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hand County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hanson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harding County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hughes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hutchinson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hyde County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jerauld County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jones County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kingsbury County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lawrence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lyman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McCook County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McPherson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Meade County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mellette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Miner County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Minnehaha County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Moody County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oglala Lakota County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pennington County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Perkins County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Potter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Roberts County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sanborn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Spink County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stanley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sully County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Todd County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tripp County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Turner County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Walworth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yankton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ziebach County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Aurora County storefront office | Aurora County | `off-aurora-sd-medicaid` |
| Office | Beadle County storefront office | Beadle County | `off-beadle-sd-medicaid` |
| Office | Bennett County storefront office | Bennett County | `off-bennett-sd-medicaid` |
| Office | Bon Homme County storefront office | Bon Homme County | `off-bon-homme-sd-medicaid` |
| Office | Brookings County storefront office | Brookings County | `off-brookings-sd-medicaid` |
| Office | Brown County storefront office | Brown County | `off-brown-sd-medicaid` |
| Office | Brule County storefront office | Brule County | `off-brule-sd-medicaid` |
| Office | Buffalo County storefront office | Buffalo County | `off-buffalo-sd-medicaid` |
| Office | Butte County storefront office | Butte County | `off-butte-sd-medicaid` |
| Office | Campbell County storefront office | Campbell County | `off-campbell-sd-medicaid` |
| Office | Charles Mix County storefront office | Charles Mix County | `off-charles-mix-sd-medicaid` |
| Office | Clark County storefront office | Clark County | `off-clark-sd-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-sd-medicaid` |
| Office | Codington County storefront office | Codington County | `off-codington-sd-medicaid` |
| Office | Corson County storefront office | Corson County | `off-corson-sd-medicaid` |
| Office | Custer County storefront office | Custer County | `off-custer-sd-medicaid` |
| Office | Davison County storefront office | Davison County | `off-davison-sd-medicaid` |
| Office | Day County storefront office | Day County | `off-day-sd-medicaid` |
| Office | Deuel County storefront office | Deuel County | `off-deuel-sd-medicaid` |
| Office | Dewey County storefront office | Dewey County | `off-dewey-sd-medicaid` |
| Office | Douglas County storefront office | Douglas County | `off-douglas-sd-medicaid` |
| Office | Edmunds County storefront office | Edmunds County | `off-edmunds-sd-medicaid` |
| Office | Fall River County storefront office | Fall River County | `off-fall-river-sd-medicaid` |
| Office | Faulk County storefront office | Faulk County | `off-faulk-sd-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-sd-medicaid` |
| Office | Gregory County storefront office | Gregory County | `off-gregory-sd-medicaid` |
| Office | Haakon County storefront office | Haakon County | `off-haakon-sd-medicaid` |
| Office | Hamlin County storefront office | Hamlin County | `off-hamlin-sd-medicaid` |
| Office | Hand County storefront office | Hand County | `off-hand-sd-medicaid` |
| Office | Hanson County storefront office | Hanson County | `off-hanson-sd-medicaid` |
| Office | Harding County storefront office | Harding County | `off-harding-sd-medicaid` |
| Office | Hughes County storefront office | Hughes County | `off-hughes-sd-medicaid` |
| Office | Hutchinson County storefront office | Hutchinson County | `off-hutchinson-sd-medicaid` |
| Office | Hyde County storefront office | Hyde County | `off-hyde-sd-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-sd-medicaid` |
| Office | Jerauld County storefront office | Jerauld County | `off-jerauld-sd-medicaid` |
| Office | Jones County storefront office | Jones County | `off-jones-sd-medicaid` |
| Office | Kingsbury County storefront office | Kingsbury County | `off-kingsbury-sd-medicaid` |
| Office | Lake County storefront office | Lake County | `off-lake-sd-medicaid` |
| Office | Lawrence County storefront office | Lawrence County | `off-lawrence-sd-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-sd-medicaid` |
| Office | Lyman County storefront office | Lyman County | `off-lyman-sd-medicaid` |
| Office | Marshall County storefront office | Marshall County | `off-marshall-sd-medicaid` |
| Office | McCook County storefront office | McCook County | `off-mccook-sd-medicaid` |
| Office | McPherson County storefront office | McPherson County | `off-mcpherson-sd-medicaid` |
| Office | Meade County storefront office | Meade County | `off-meade-sd-medicaid` |
| Office | Mellette County storefront office | Mellette County | `off-mellette-sd-medicaid` |
| Office | Miner County storefront office | Miner County | `off-miner-sd-medicaid` |
| Office | Minnehaha County storefront office | Minnehaha County | `off-minnehaha-sd-medicaid` |
| Office | Moody County storefront office | Moody County | `off-moody-sd-medicaid` |
| ... | *and 148 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
