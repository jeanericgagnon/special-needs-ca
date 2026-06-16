# Data Provenance Report: Louisiana (LA)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Louisiana under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.3%** (Manual Review Rate: **58.72%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Louisiana Medicaid`
- **Waiver Program Name**: `Louisiana HCBS Waivers`
- **Personal Care Program**: `Louisiana Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Louisiana Office for Citizens with Developmental Disabilities`
- **State Education Agency**: `Louisiana Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Louisiana Early Intervention`
- **ABLE Savings Program**: `Louisiana ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 64
- **County Social Service Storefronts**: 64
- **School Districts**: 64
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 192
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 265 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 135 records
- **Manual Review Backlog (Flagged)**: 192 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Louisiana ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Louisiana Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://ldh.la.gov/medicaid
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Louisiana Early Intervention Services** (State Program): Source URL: https://ldh.la.gov/ocdd
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Louisiana HCBS Waivers** (State Program): Source URL: https://ldh.la.gov/ocdd/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Louisiana residents.
- **Louisiana Medicaid** (State Program): Source URL: https://ldh.la.gov/medicaid
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Louisiana Medicaid Personal Care** (State Program): Source URL: https://ldh.la.gov/medicaid
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Louisiana Self-Direction Services** (State Program): Source URL: https://ldh.la.gov/ocdd
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Louisiana Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Louisiana Transition & Vocational Rehabilitation** (State Program): Source URL: https://ldh.la.gov/ocdd
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Louisiana)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Louisiana Developmental Services Intake** (dd_intake): Website: https://dhhs.louisiana.gov/dd | Phone: None | Status: `manual_review_required`
- **Louisiana Early Intervention State Office** (early_intervention): Website: https://dhhs.louisiana.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Acadia Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Allen Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ascension Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Assumption Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Avoyelles Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Beauregard Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bienville Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bossier Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Caddo Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calcasieu Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Caldwell Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cameron Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Catahoula Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Claiborne Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Concordia Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| DeSoto Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| East Baton Rouge Parish County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| East Carroll Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| East Feliciana Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Evangeline Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Iberia Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Iberville Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson Davis Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson Parish County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| LaSalle Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lafayette Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lafourche Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Livingston Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morehouse Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Natchitoches Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Orleans Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ouachita Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Plaquemines Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pointe Coupee Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rapides Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Red River Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Richland Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sabine Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Bernard Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Charles Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Helena Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. James Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. John the Baptist Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Landry Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Martin Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Mary Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Tammany Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tangipahoa Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tensas Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Terrebonne Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Vermilion Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Vernon Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Webster Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| West Baton Rouge Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| West Carroll Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| West Feliciana Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Winn Parish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Acadia Parish County storefront office | Acadia Parish County | `off-acadia-parish-la-medicaid` |
| Office | Allen Parish County storefront office | Allen Parish County | `off-allen-parish-la-medicaid` |
| Office | Ascension Parish County storefront office | Ascension Parish County | `off-ascension-parish-la-medicaid` |
| Office | Assumption Parish County storefront office | Assumption Parish County | `off-assumption-parish-la-medicaid` |
| Office | Avoyelles Parish County storefront office | Avoyelles Parish County | `off-avoyelles-parish-la-medicaid` |
| Office | Beauregard Parish County storefront office | Beauregard Parish County | `off-beauregard-parish-la-medicaid` |
| Office | Bienville Parish County storefront office | Bienville Parish County | `off-bienville-parish-la-medicaid` |
| Office | Bossier Parish County storefront office | Bossier Parish County | `off-bossier-parish-la-medicaid` |
| Office | Caddo Parish County storefront office | Caddo Parish County | `off-caddo-parish-la-medicaid` |
| Office | Calcasieu Parish County storefront office | Calcasieu Parish County | `off-calcasieu-parish-la-medicaid` |
| Office | Caldwell Parish County storefront office | Caldwell Parish County | `off-caldwell-parish-la-medicaid` |
| Office | Cameron Parish County storefront office | Cameron Parish County | `off-cameron-parish-la-medicaid` |
| Office | Catahoula Parish County storefront office | Catahoula Parish County | `off-catahoula-parish-la-medicaid` |
| Office | Claiborne Parish County storefront office | Claiborne Parish County | `off-claiborne-parish-la-medicaid` |
| Office | Concordia Parish County storefront office | Concordia Parish County | `off-concordia-parish-la-medicaid` |
| Office | DeSoto Parish County storefront office | DeSoto Parish County | `off-desoto-parish-la-medicaid` |
| Office | East Baton Rouge Parish County storefront office | East Baton Rouge Parish County | `off-east-baton-rouge-parish-la-medicaid` |
| Office | East Carroll Parish County storefront office | East Carroll Parish County | `off-east-carroll-parish-la-medicaid` |
| Office | East Feliciana Parish County storefront office | East Feliciana Parish County | `off-east-feliciana-parish-la-medicaid` |
| Office | Evangeline Parish County storefront office | Evangeline Parish County | `off-evangeline-parish-la-medicaid` |
| Office | Franklin Parish County storefront office | Franklin Parish County | `off-franklin-parish-la-medicaid` |
| Office | Grant Parish County storefront office | Grant Parish County | `off-grant-parish-la-medicaid` |
| Office | Iberia Parish County storefront office | Iberia Parish County | `off-iberia-parish-la-medicaid` |
| Office | Iberville Parish County storefront office | Iberville Parish County | `off-iberville-parish-la-medicaid` |
| Office | Jackson Parish County storefront office | Jackson Parish County | `off-jackson-parish-la-medicaid` |
| Office | Jefferson Parish County storefront office | Jefferson Parish County | `off-jefferson-parish-la-medicaid` |
| Office | Jefferson Davis Parish County storefront office | Jefferson Davis Parish County | `off-jefferson-davis-parish-la-medicaid` |
| Office | Lafayette Parish County storefront office | Lafayette Parish County | `off-lafayette-parish-la-medicaid` |
| Office | Lafourche Parish County storefront office | Lafourche Parish County | `off-lafourche-parish-la-medicaid` |
| Office | LaSalle Parish County storefront office | LaSalle Parish County | `off-lasalle-parish-la-medicaid` |
| Office | Lincoln Parish County storefront office | Lincoln Parish County | `off-lincoln-parish-la-medicaid` |
| Office | Livingston Parish County storefront office | Livingston Parish County | `off-livingston-parish-la-medicaid` |
| Office | Madison Parish County storefront office | Madison Parish County | `off-madison-parish-la-medicaid` |
| Office | Morehouse Parish County storefront office | Morehouse Parish County | `off-morehouse-parish-la-medicaid` |
| Office | Natchitoches Parish County storefront office | Natchitoches Parish County | `off-natchitoches-parish-la-medicaid` |
| Office | Orleans Parish County storefront office | Orleans Parish County | `off-orleans-parish-la-medicaid` |
| Office | Ouachita Parish County storefront office | Ouachita Parish County | `off-ouachita-parish-la-medicaid` |
| Office | Plaquemines Parish County storefront office | Plaquemines Parish County | `off-plaquemines-parish-la-medicaid` |
| Office | Pointe Coupee Parish County storefront office | Pointe Coupee Parish County | `off-pointe-coupee-parish-la-medicaid` |
| Office | Rapides Parish County storefront office | Rapides Parish County | `off-rapides-parish-la-medicaid` |
| Office | Red River Parish County storefront office | Red River Parish County | `off-red-river-parish-la-medicaid` |
| Office | Richland Parish County storefront office | Richland Parish County | `off-richland-parish-la-medicaid` |
| Office | Sabine Parish County storefront office | Sabine Parish County | `off-sabine-parish-la-medicaid` |
| Office | St. Bernard Parish County storefront office | St. Bernard Parish County | `off-st-bernard-parish-la-medicaid` |
| Office | St. Charles Parish County storefront office | St. Charles Parish County | `off-st-charles-parish-la-medicaid` |
| Office | St. Helena Parish County storefront office | St. Helena Parish County | `off-st-helena-parish-la-medicaid` |
| Office | St. James Parish County storefront office | St. James Parish County | `off-st-james-parish-la-medicaid` |
| Office | St. John the Baptist Parish County storefront office | St. John the Baptist Parish County | `off-st-john-the-baptist-parish-la-medicaid` |
| Office | St. Landry Parish County storefront office | St. Landry Parish County | `off-st-landry-parish-la-medicaid` |
| Office | St. Martin Parish County storefront office | St. Martin Parish County | `off-st-martin-parish-la-medicaid` |
| ... | *and 142 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
