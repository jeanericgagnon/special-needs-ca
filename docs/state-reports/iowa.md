# Data Provenance Report: Iowa (IA)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Iowa under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **40.8%** (Manual Review Rate: **59.16%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Iowa Medicaid`
- **Waiver Program Name**: `Iowa HCBS Waivers`
- **Personal Care Program**: `Iowa Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Iowa Department of Health and Human Services`
- **State Education Agency**: `Iowa Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Iowa Early Intervention`
- **ABLE Savings Program**: `Iowa ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 99
- **County Social Service Storefronts**: 99
- **School Districts**: 99
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 297
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 405 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 205 records
- **Manual Review Backlog (Flagged)**: 297 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Iowa ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Iowa Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://hhs.iowa.gov/ime
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Iowa Early Intervention Services** (State Program): Source URL: https://hhs.iowa.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Iowa HCBS Waivers** (State Program): Source URL: https://hhs.iowa.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Iowa residents.
- **Iowa Medicaid** (State Program): Source URL: https://hhs.iowa.gov/ime
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Iowa Medicaid Personal Care** (State Program): Source URL: https://hhs.iowa.gov/ime
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Iowa Self-Direction Services** (State Program): Source URL: https://hhs.iowa.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Iowa Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Iowa Transition & Vocational Rehabilitation** (State Program): Source URL: https://hhs.iowa.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Iowa)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Iowa Developmental Services Intake** (dd_intake): Website: https://dhhs.iowa.gov/dd | Phone: None | Status: `manual_review_required`
- **Iowa Early Intervention State Office** (early_intervention): Website: https://dhhs.iowa.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adair County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Adams County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Allamakee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Appanoose County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Audubon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Black Hawk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bremer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Buchanan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Buena Vista County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Butler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calhoun County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cass County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cedar County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cerro Gordo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cherokee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chickasaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clarke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clayton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clinton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crawford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dallas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Davis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Decatur County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Delaware County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Des Moines County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dickinson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dubuque County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Emmet County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fayette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Floyd County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fremont County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greene County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grundy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Guthrie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hamilton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hancock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hardin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harrison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Howard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Humboldt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ida County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Iowa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jasper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jones County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Keokuk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kossuth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Linn County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Louisa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lucas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lyon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mahaska County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mills County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mitchell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monona County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Muscatine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| O'Brien County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Osceola County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Page County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Palo Alto County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Plymouth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pocahontas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Pottawattamie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Poweshiek County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ringgold County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sac County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shelby County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sioux County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Story County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tama County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Taylor County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Van Buren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wapello County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Warren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Webster County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Winnebago County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Winneshiek County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Woodbury County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Worth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wright County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Adair County storefront office | Adair County | `off-adair-ia-medicaid` |
| Office | Adams County storefront office | Adams County | `off-adams-ia-medicaid` |
| Office | Allamakee County storefront office | Allamakee County | `off-allamakee-ia-medicaid` |
| Office | Appanoose County storefront office | Appanoose County | `off-appanoose-ia-medicaid` |
| Office | Audubon County storefront office | Audubon County | `off-audubon-ia-medicaid` |
| Office | Benton County storefront office | Benton County | `off-benton-ia-medicaid` |
| Office | Black Hawk County storefront office | Black Hawk County | `off-black-hawk-ia-medicaid` |
| Office | Boone County storefront office | Boone County | `off-boone-ia-medicaid` |
| Office | Bremer County storefront office | Bremer County | `off-bremer-ia-medicaid` |
| Office | Buchanan County storefront office | Buchanan County | `off-buchanan-ia-medicaid` |
| Office | Buena Vista County storefront office | Buena Vista County | `off-buena-vista-ia-medicaid` |
| Office | Butler County storefront office | Butler County | `off-butler-ia-medicaid` |
| Office | Calhoun County storefront office | Calhoun County | `off-calhoun-ia-medicaid` |
| Office | Carroll County storefront office | Carroll County | `off-carroll-ia-medicaid` |
| Office | Cass County storefront office | Cass County | `off-cass-ia-medicaid` |
| Office | Cedar County storefront office | Cedar County | `off-cedar-ia-medicaid` |
| Office | Cerro Gordo County storefront office | Cerro Gordo County | `off-cerro-gordo-ia-medicaid` |
| Office | Cherokee County storefront office | Cherokee County | `off-cherokee-ia-medicaid` |
| Office | Chickasaw County storefront office | Chickasaw County | `off-chickasaw-ia-medicaid` |
| Office | Clarke County storefront office | Clarke County | `off-clarke-ia-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-ia-medicaid` |
| Office | Clayton County storefront office | Clayton County | `off-clayton-ia-medicaid` |
| Office | Clinton County storefront office | Clinton County | `off-clinton-ia-medicaid` |
| Office | Crawford County storefront office | Crawford County | `off-crawford-ia-medicaid` |
| Office | Dallas County storefront office | Dallas County | `off-dallas-ia-medicaid` |
| Office | Davis County storefront office | Davis County | `off-davis-ia-medicaid` |
| Office | Decatur County storefront office | Decatur County | `off-decatur-ia-medicaid` |
| Office | Delaware County storefront office | Delaware County | `off-delaware-ia-medicaid` |
| Office | Des Moines County storefront office | Des Moines County | `off-des-moines-ia-medicaid` |
| Office | Dickinson County storefront office | Dickinson County | `off-dickinson-ia-medicaid` |
| Office | Dubuque County storefront office | Dubuque County | `off-dubuque-ia-medicaid` |
| Office | Emmet County storefront office | Emmet County | `off-emmet-ia-medicaid` |
| Office | Fayette County storefront office | Fayette County | `off-fayette-ia-medicaid` |
| Office | Floyd County storefront office | Floyd County | `off-floyd-ia-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-ia-medicaid` |
| Office | Fremont County storefront office | Fremont County | `off-fremont-ia-medicaid` |
| Office | Greene County storefront office | Greene County | `off-greene-ia-medicaid` |
| Office | Grundy County storefront office | Grundy County | `off-grundy-ia-medicaid` |
| Office | Guthrie County storefront office | Guthrie County | `off-guthrie-ia-medicaid` |
| Office | Hamilton County storefront office | Hamilton County | `off-hamilton-ia-medicaid` |
| Office | Hancock County storefront office | Hancock County | `off-hancock-ia-medicaid` |
| Office | Hardin County storefront office | Hardin County | `off-hardin-ia-medicaid` |
| Office | Harrison County storefront office | Harrison County | `off-harrison-ia-medicaid` |
| Office | Henry County storefront office | Henry County | `off-henry-ia-medicaid` |
| Office | Howard County storefront office | Howard County | `off-howard-ia-medicaid` |
| Office | Humboldt County storefront office | Humboldt County | `off-humboldt-ia-medicaid` |
| Office | Ida County storefront office | Ida County | `off-ida-ia-medicaid` |
| Office | Iowa County storefront office | Iowa County | `off-iowa-ia-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-ia-medicaid` |
| Office | Jasper County storefront office | Jasper County | `off-jasper-ia-medicaid` |
| ... | *and 247 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
