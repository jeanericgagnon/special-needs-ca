# Data Provenance Report: Alabama (AL)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Alabama under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.2%** (Manual Review Rate: **58.77%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Alabama Medicaid`
- **Waiver Program Name**: `Alabama HCBS Waiver`
- **Personal Care Program**: `Alabama Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Alabama Department of Mental Health`
- **State Education Agency**: `Alabama Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Alabama Early Intervention`
- **ABLE Savings Program**: `Alabama ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 67
- **County Social Service Storefronts**: 67
- **School Districts**: 67
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 201
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 277 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 141 records
- **Manual Review Backlog (Flagged)**: 201 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Alabama ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Alabama Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://medicaid.alabama.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Alabama Early Intervention Services** (State Program): Source URL: https://mh.alabama.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Alabama HCBS Waiver** (State Program): Source URL: https://medicaid.alabama.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Alabama residents.
- **Alabama Medicaid** (State Program): Source URL: https://medicaid.alabama.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Alabama Medicaid Personal Care** (State Program): Source URL: https://medicaid.alabama.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Alabama Self-Direction Services** (State Program): Source URL: https://mh.alabama.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Alabama Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Alabama Transition & Vocational Rehabilitation** (State Program): Source URL: https://mh.alabama.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Alabama)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Alabama Developmental Services Intake** (dd_intake): Website: https://dhhs.alabama.gov/dd | Phone: None | Status: `manual_review_required`
- **Alabama Early Intervention State Office** (early_intervention): Website: https://dhhs.alabama.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Autauga County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Baldwin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Barbour County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bibb County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Blount County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bullock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Butler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calhoun County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chambers County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cherokee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chilton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Choctaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clarke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cleburne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Coffee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Colbert County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Conecuh County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Coosa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Covington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crenshaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cullman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dale County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dallas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| DeKalb County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Elmore County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Escambia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Etowah County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fayette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Geneva County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greene County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hale County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Houston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Lamar County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lauderdale County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lawrence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Limestone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lowndes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Macon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Marengo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mobile County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morgan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Perry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pickens County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pike County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Randolph County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Russell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shelby County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Clair County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sumter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Talladega County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tallapoosa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tuscaloosa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Walker County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wilcox County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Winston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Autauga County storefront office | Autauga County | `off-autauga-al-medicaid` |
| Office | Baldwin County storefront office | Baldwin County | `off-baldwin-al-medicaid` |
| Office | Barbour County storefront office | Barbour County | `off-barbour-al-medicaid` |
| Office | Bibb County storefront office | Bibb County | `off-bibb-al-medicaid` |
| Office | Blount County storefront office | Blount County | `off-blount-al-medicaid` |
| Office | Bullock County storefront office | Bullock County | `off-bullock-al-medicaid` |
| Office | Butler County storefront office | Butler County | `off-butler-al-medicaid` |
| Office | Calhoun County storefront office | Calhoun County | `off-calhoun-al-medicaid` |
| Office | Chambers County storefront office | Chambers County | `off-chambers-al-medicaid` |
| Office | Cherokee County storefront office | Cherokee County | `off-cherokee-al-medicaid` |
| Office | Chilton County storefront office | Chilton County | `off-chilton-al-medicaid` |
| Office | Choctaw County storefront office | Choctaw County | `off-choctaw-al-medicaid` |
| Office | Clarke County storefront office | Clarke County | `off-clarke-al-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-al-medicaid` |
| Office | Cleburne County storefront office | Cleburne County | `off-cleburne-al-medicaid` |
| Office | Coffee County storefront office | Coffee County | `off-coffee-al-medicaid` |
| Office | Colbert County storefront office | Colbert County | `off-colbert-al-medicaid` |
| Office | Conecuh County storefront office | Conecuh County | `off-conecuh-al-medicaid` |
| Office | Coosa County storefront office | Coosa County | `off-coosa-al-medicaid` |
| Office | Covington County storefront office | Covington County | `off-covington-al-medicaid` |
| Office | Crenshaw County storefront office | Crenshaw County | `off-crenshaw-al-medicaid` |
| Office | Cullman County storefront office | Cullman County | `off-cullman-al-medicaid` |
| Office | Dale County storefront office | Dale County | `off-dale-al-medicaid` |
| Office | Dallas County storefront office | Dallas County | `off-dallas-al-medicaid` |
| Office | DeKalb County storefront office | DeKalb County | `off-dekalb-al-medicaid` |
| Office | Elmore County storefront office | Elmore County | `off-elmore-al-medicaid` |
| Office | Escambia County storefront office | Escambia County | `off-escambia-al-medicaid` |
| Office | Etowah County storefront office | Etowah County | `off-etowah-al-medicaid` |
| Office | Fayette County storefront office | Fayette County | `off-fayette-al-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-al-medicaid` |
| Office | Geneva County storefront office | Geneva County | `off-geneva-al-medicaid` |
| Office | Greene County storefront office | Greene County | `off-greene-al-medicaid` |
| Office | Hale County storefront office | Hale County | `off-hale-al-medicaid` |
| Office | Henry County storefront office | Henry County | `off-henry-al-medicaid` |
| Office | Houston County storefront office | Houston County | `off-houston-al-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-al-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-al-medicaid` |
| Office | Lamar County storefront office | Lamar County | `off-lamar-al-medicaid` |
| Office | Lauderdale County storefront office | Lauderdale County | `off-lauderdale-al-medicaid` |
| Office | Lawrence County storefront office | Lawrence County | `off-lawrence-al-medicaid` |
| Office | Lee County storefront office | Lee County | `off-lee-al-medicaid` |
| Office | Limestone County storefront office | Limestone County | `off-limestone-al-medicaid` |
| Office | Lowndes County storefront office | Lowndes County | `off-lowndes-al-medicaid` |
| Office | Macon County storefront office | Macon County | `off-macon-al-medicaid` |
| Office | Madison County storefront office | Madison County | `off-madison-al-medicaid` |
| Office | Marengo County storefront office | Marengo County | `off-marengo-al-medicaid` |
| Office | Marion County storefront office | Marion County | `off-marion-al-medicaid` |
| Office | Marshall County storefront office | Marshall County | `off-marshall-al-medicaid` |
| Office | Mobile County storefront office | Mobile County | `off-mobile-al-medicaid` |
| Office | Monroe County storefront office | Monroe County | `off-monroe-al-medicaid` |
| ... | *and 151 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
