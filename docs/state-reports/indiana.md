# Data Provenance Report: Indiana (IN)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Indiana under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **80.3%** (Manual Review Rate: **19.7%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Indiana Medicaid`
- **Waiver Program Name**: `Indiana HCBS Waivers`
- **Personal Care Program**: `Indiana Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Indiana Division of Disability and Rehabilitative Services`
- **State Education Agency**: `Indiana Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Indiana Early Intervention`
- **ABLE Savings Program**: `Indiana ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 92
- **County Social Service Storefronts**: 92
- **School Districts**: 92
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 276
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 375 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 375 records
- **Manual Review Backlog (Flagged)**: 92 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Indiana ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Indiana Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.in.gov/medicaid
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Indiana Early Intervention Services** (State Program): Source URL: https://www.in.gov/fssa/ddrs
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Indiana HCBS Waivers** (State Program): Source URL: https://www.in.gov/fssa/ddrs/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Indiana residents.
- **Indiana Medicaid** (State Program): Source URL: https://www.in.gov/medicaid
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Indiana Medicaid Personal Care** (State Program): Source URL: https://www.in.gov/medicaid
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Indiana Self-Direction Services** (State Program): Source URL: https://www.in.gov/fssa/ddrs
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Indiana Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Indiana Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.in.gov/fssa/ddrs
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Indiana)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Indiana Developmental Services Intake** (dd_intake): Website: https://dhhs.indiana.gov/dd | Phone: None | Status: `manual_review_required`
- **Indiana Early Intervention State Office** (early_intervention): Website: https://dhhs.indiana.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adams County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Allen County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bartholomew County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Blackford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brown County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cass County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clinton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crawford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Daviess County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| DeKalb County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dearborn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Decatur County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Delaware County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dubois County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Elkhart County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fayette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Floyd County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fountain County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fulton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gibson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greene County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hamilton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hancock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harrison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hendricks County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Howard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Huntington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jasper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jennings County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Knox County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kosciusko County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| LaGrange County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| LaPorte County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Lawrence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Martin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Miami County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morgan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Newton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Noble County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ohio County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Orange County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Owen County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Parke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Perry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pike County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Porter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Posey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pulaski County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Putnam County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Randolph County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ripley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rush County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shelby County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Spencer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Joseph County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Starke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Steuben County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sullivan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Switzerland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tippecanoe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tipton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Vanderburgh County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Vermillion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Vigo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wabash County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Warren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Warrick County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wells County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| White County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Whitley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Nonprofit | The Arc of Indiana | Adams County | `in-np-arc-adams-in` |
| Nonprofit | The Arc of Indiana | Allen County | `in-np-arc-allen-in` |
| Nonprofit | The Arc of Indiana | Bartholomew County | `in-np-arc-bartholomew-in` |
| Nonprofit | The Arc of Indiana | Benton County | `in-np-arc-benton-in` |
| Nonprofit | The Arc of Indiana | Blackford County | `in-np-arc-blackford-in` |
| Nonprofit | The Arc of Indiana | Boone County | `in-np-arc-boone-in` |
| Nonprofit | The Arc of Indiana | Brown County | `in-np-arc-brown-in` |
| Nonprofit | The Arc of Indiana | Carroll County | `in-np-arc-carroll-in` |
| Nonprofit | The Arc of Indiana | Cass County | `in-np-arc-cass-in` |
| Nonprofit | The Arc of Indiana | Clark County | `in-np-arc-clark-in` |
| Nonprofit | The Arc of Indiana | Clay County | `in-np-arc-clay-in` |
| Nonprofit | The Arc of Indiana | Clinton County | `in-np-arc-clinton-in` |
| Nonprofit | The Arc of Indiana | Crawford County | `in-np-arc-crawford-in` |
| Nonprofit | The Arc of Indiana | Daviess County | `in-np-arc-daviess-in` |
| Nonprofit | The Arc of Indiana | Dearborn County | `in-np-arc-dearborn-in` |
| Nonprofit | The Arc of Indiana | Decatur County | `in-np-arc-decatur-in` |
| Nonprofit | The Arc of Indiana | DeKalb County | `in-np-arc-dekalb-in` |
| Nonprofit | The Arc of Indiana | Delaware County | `in-np-arc-delaware-in` |
| Nonprofit | The Arc of Indiana | Dubois County | `in-np-arc-dubois-in` |
| Nonprofit | The Arc of Indiana | Elkhart County | `in-np-arc-elkhart-in` |
| Nonprofit | The Arc of Indiana | Fayette County | `in-np-arc-fayette-in` |
| Nonprofit | The Arc of Indiana | Floyd County | `in-np-arc-floyd-in` |
| Nonprofit | The Arc of Indiana | Fountain County | `in-np-arc-fountain-in` |
| Nonprofit | The Arc of Indiana | Franklin County | `in-np-arc-franklin-in` |
| Nonprofit | The Arc of Indiana | Fulton County | `in-np-arc-fulton-in` |
| Nonprofit | The Arc of Indiana | Gibson County | `in-np-arc-gibson-in` |
| Nonprofit | The Arc of Indiana | Grant County | `in-np-arc-grant-in` |
| Nonprofit | The Arc of Indiana | Greene County | `in-np-arc-greene-in` |
| Nonprofit | The Arc of Indiana | Hamilton County | `in-np-arc-hamilton-in` |
| Nonprofit | The Arc of Indiana | Hancock County | `in-np-arc-hancock-in` |
| Nonprofit | The Arc of Indiana | Harrison County | `in-np-arc-harrison-in` |
| Nonprofit | The Arc of Indiana | Hendricks County | `in-np-arc-hendricks-in` |
| Nonprofit | The Arc of Indiana | Henry County | `in-np-arc-henry-in` |
| Nonprofit | The Arc of Indiana | Howard County | `in-np-arc-howard-in` |
| Nonprofit | The Arc of Indiana | Huntington County | `in-np-arc-huntington-in` |
| Nonprofit | The Arc of Indiana | Jackson County | `in-np-arc-jackson-in` |
| Nonprofit | The Arc of Indiana | Jasper County | `in-np-arc-jasper-in` |
| Nonprofit | The Arc of Indiana | Jay County | `in-np-arc-jay-in` |
| Nonprofit | The Arc of Indiana | Jefferson County | `in-np-arc-jefferson-in` |
| Nonprofit | The Arc of Indiana | Jennings County | `in-np-arc-jennings-in` |
| Nonprofit | The Arc of Indiana | Johnson County | `in-np-arc-johnson-in` |
| Nonprofit | The Arc of Indiana | Knox County | `in-np-arc-knox-in` |
| Nonprofit | The Arc of Indiana | Kosciusko County | `in-np-arc-kosciusko-in` |
| Nonprofit | The Arc of Indiana | LaGrange County | `in-np-arc-lagrange-in` |
| Nonprofit | The Arc of Indiana | Lake County | `in-np-arc-lake-in` |
| Nonprofit | The Arc of Indiana | LaPorte County | `in-np-arc-laporte-in` |
| Nonprofit | The Arc of Indiana | Lawrence County | `in-np-arc-lawrence-in` |
| Nonprofit | The Arc of Indiana | Madison County | `in-np-arc-madison-in` |
| Nonprofit | The Arc of Indiana | Marion County | `in-np-arc-marion-in` |
| Nonprofit | The Arc of Indiana | Marshall County | `in-np-arc-marshall-in` |
| ... | *and 42 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
