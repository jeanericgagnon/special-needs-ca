# Data Provenance Report: Georgia (GA)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Georgia under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Pilot)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **61.3%** (Manual Review Rate: **38.69%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `DBHDD Regional Office`
- **Medicaid Program Name**: `Georgia Medicaid`
- **Waiver Program Name**: `COMP Waiver`
- **Personal Care Program**: `Georgia Pediatric Program (GAPP)`
- **Developmental Disability (DD) Agency**: `Georgia Department of Behavioral Health and Developmental Disabilities`
- **State Education Agency**: `Georgia Department of Education`
- **State Education Agency SPED Label**: `Regional Education Service Agencies (RESAs)`
- **State Early Intervention Label**: `Babies Can\`
- **ABLE Savings Program**: `Georgia Path2College / ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 159
- **County Social Service Storefronts**: 159
- **School Districts**: 159
- **Regional Education Agencies (REAs)**: 5
- **State-Level Resource Agencies**: 7
- **Local Nonprofit Support Organizations**: 338
- **Special Education (IEP) Advocates/Attorneys**: 24
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 580 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 366 records
- **Manual Review Backlog (Flagged)**: 265 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Babies Can't Wait (BCW)** (State Program): Source URL: https://dph.georgia.gov/babies-cant-wait
  * Description: Georgia's statewide early intervention program (Part C of IDEA) for infants and toddlers.
- **Comprehensive (COMP) Waiver** (State Program): Source URL: https://dbhdd.georgia.gov/nowcomp
  * Description: Georgia HCBS waiver offering intensive home and community supports for developmental disabilities.
- **GVRA Transition Services** (State Program): Source URL: https://gvs.georgia.gov/
  * Description: Georgia Vocational Rehabilitation Agency transition assistance for students.
- **GaDOE Special Education Services** (State Program): Source URL: https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/default.aspx
  * Description: IEP services and school accommodations administered by local school districts under GaDOE.
- **Georgia Medicaid (Gateway)** (State Program): Source URL: https://gateway.ga.gov/
  * Description: Public health coverage managed via Gateway. Bypasses parent income for waiver or GAPP clients.
- **Georgia Path2College / ABLE** (State Program): Source URL: https://www.georgiaable.org/
  * Description: Georgia's tax-free savings account program for disability-related expenses.
- **Georgia Pediatric Program (GAPP)** (State Program): Source URL: https://dch.georgia.gov/georgia-pediatric-program-gapp
  * Description: Medicaid program offering private duty skilled nursing care and personal care services in the home.
- **New Options Waiver (NOW)** (State Program): Source URL: https://dbhdd.georgia.gov/nowcomp
  * Description: Georgia waiver supporting individuals with intellectual disabilities to live at home with capped services.
- **PeachCare for Kids** (State Program): Source URL: https://dch.georgia.gov/peachcare-kids
  * Description: Georgia CHIP program for families whose income is too high for Medicaid.
- **SSI for Children (Georgia)** (State Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Federal cash benefits with automatic Georgia Medicaid routing via Georgia Gateway.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **DBHDD Region 1 Field Office** (dbhdd_office): Website: https://dbhdd.georgia.gov/region-1-field-office | Phone: (706) 802-5272 | Status: `source_listed`
- **DBHDD Region 2 Field Office** (dbhdd_office): Website: https://dbhdd.georgia.gov/region-2-field-office | Phone: (706) 792-7733 | Status: `source_listed`
- **DBHDD Region 3 Field Office** (dbhdd_office): Website: https://dbhdd.georgia.gov/region-3-field-office | Phone: (770) 414-3050 | Status: `source_listed`
- **DBHDD Region 4 Field Office** (dbhdd_office): Website: https://dbhdd.georgia.gov/region-4-field-office | Phone: (229) 225-5099 | Status: `source_listed`
- **DBHDD Region 5 Field Office** (dbhdd_office): Website: https://dbhdd.georgia.gov/region-5-field-office | Phone: (912) 303-1670 | Status: `source_listed`
- **DBHDD Region 6 Field Office** (dbhdd_office): Website: https://dbhdd.georgia.gov/region-6-field-office | Phone: (706) 565-7835 | Status: `source_listed`
- **Georgia Babies Can't Wait State Office** (early_intervention): Website: https://dph.georgia.gov/babies-cant-wait | Phone: (888) 651-8224 | Status: `source_listed`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Appling County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Atkinson County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Bacon County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Baker County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Baldwin County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Banks County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Barrow County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Bartow County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Ben Hill County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Berrien County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Bibb County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bleckley County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Brantley County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Brooks County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Bryan County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Bulloch County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Burke County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Butts County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Calhoun County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Camden County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Candler County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Catoosa County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Charlton County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Chatham County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Chattahoochee County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Chattooga County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Cherokee County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Clarke County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Clayton County | 1 | 1 | 4 | 4 | 🟢 COMPLETE |
| Clinch County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Cobb County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Coffee County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Colquitt County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Columbia County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Cook County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Coweta County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Crawford County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Crisp County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Dade County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Dawson County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| DeKalb County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Decatur County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Dodge County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Dooly County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Dougherty County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Early County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Echols County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Effingham County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Elbert County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Emanuel County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Evans County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Fannin County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Fayette County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Floyd County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Forsyth County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Fulton County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Gilmer County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Glascock County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Glynn County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Gordon County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Grady County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Greene County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Gwinnett County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Habersham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hall County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Hancock County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Haralson County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Harris County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Hart County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Heard County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Henry County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Houston County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Irwin County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Jasper County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Jeff Davis County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Jenkins County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Jones County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Lamar County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Lanier County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Laurens County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Liberty County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Long County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Lowndes County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Lumpkin County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Macon County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| McDuffie County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| McIntosh County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Meriwether County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Miller County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Mitchell County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Morgan County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Murray County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Muscogee County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Newton County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Oconee County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Oglethorpe County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Paulding County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Peach County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Pickens County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Pierce County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Pike County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Pulaski County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Putnam County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Quitman County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Rabun County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Randolph County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Richmond County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Rockdale County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Schley County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Screven County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Seminole County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Spalding County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Stephens County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stewart County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Sumter County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Talbot County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Taliaferro County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Tattnall County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Taylor County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Telfair County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Terrell County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Thomas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tift County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Toombs County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Towns County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Treutlen County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Troup County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Turner County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Twiggs County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Upson County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Walker County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Walton County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Ware County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Warren County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Webster County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Wheeler County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| White County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Whitfield County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Wilcox County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Wilkes County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Wilkinson County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |
| Worth County | 1 | 1 | 2 | 2 | 🟢 COMPLETE |

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
| Office | Appling County County DFCS Office | Appling County | `off-appling-ga-medicaid` |
| Office | Atkinson County County DFCS Office | Atkinson County | `off-atkinson-ga-medicaid` |
| Office | Bacon County County DFCS Office | Bacon County | `off-bacon-ga-medicaid` |
| Office | Baker County County DFCS Office | Baker County | `off-baker-ga-medicaid` |
| Office | Banks County County DFCS Office | Banks County | `off-banks-ga-medicaid` |
| Office | Ben Hill County County DFCS Office | Ben Hill County | `off-ben-hill-ga-medicaid` |
| Office | Berrien County County DFCS Office | Berrien County | `off-berrien-ga-medicaid` |
| Office | Bleckley County County DFCS Office | Bleckley County | `off-bleckley-ga-medicaid` |
| Office | Brantley County County DFCS Office | Brantley County | `off-brantley-ga-medicaid` |
| Office | Brooks County County DFCS Office | Brooks County | `off-brooks-ga-medicaid` |
| Office | Burke County County DFCS Office | Burke County | `off-burke-ga-medicaid` |
| Office | Butts County County DFCS Office | Butts County | `off-butts-ga-medicaid` |
| Office | Calhoun County County DFCS Office | Calhoun County | `off-calhoun-ga-medicaid` |
| Office | Camden County County DFCS Office | Camden County | `off-camden-ga-medicaid` |
| Office | Candler County County DFCS Office | Candler County | `off-candler-ga-medicaid` |
| Office | Charlton County County DFCS Office | Charlton County | `off-charlton-ga-medicaid` |
| Office | Chattahoochee County County DFCS Office | Chattahoochee County | `off-chattahoochee-ga-medicaid` |
| Office | Chattooga County County DFCS Office | Chattooga County | `off-chattooga-ga-medicaid` |
| Office | Clay County County DFCS Office | Clay County | `off-clay-ga-medicaid` |
| Office | Clinch County County DFCS Office | Clinch County | `off-clinch-ga-medicaid` |
| Office | Coffee County County DFCS Office | Coffee County | `off-coffee-ga-medicaid` |
| Office | Colquitt County County DFCS Office | Colquitt County | `off-colquitt-ga-medicaid` |
| Office | Cook County County DFCS Office | Cook County | `off-cook-ga-medicaid` |
| Office | Crawford County County DFCS Office | Crawford County | `off-crawford-ga-medicaid` |
| Office | Crisp County County DFCS Office | Crisp County | `off-crisp-ga-medicaid` |
| Office | Dade County County DFCS Office | Dade County | `off-dade-ga-medicaid` |
| Office | Dawson County County DFCS Office | Dawson County | `off-dawson-ga-medicaid` |
| Office | Dodge County County DFCS Office | Dodge County | `off-dodge-ga-medicaid` |
| Office | Dooly County County DFCS Office | Dooly County | `off-dooly-ga-medicaid` |
| Office | Dougherty County County DFCS Office | Dougherty County | `off-dougherty-ga-medicaid` |
| Office | Early County County DFCS Office | Early County | `off-early-ga-medicaid` |
| Office | Echols County County DFCS Office | Echols County | `off-echols-ga-medicaid` |
| Office | Effingham County County DFCS Office | Effingham County | `off-effingham-ga-medicaid` |
| Office | Elbert County County DFCS Office | Elbert County | `off-elbert-ga-medicaid` |
| Office | Emanuel County County DFCS Office | Emanuel County | `off-emanuel-ga-medicaid` |
| Office | Evans County County DFCS Office | Evans County | `off-evans-ga-medicaid` |
| Office | Fannin County County DFCS Office | Fannin County | `off-fannin-ga-medicaid` |
| Office | Fayette County County DFCS Office | Fayette County | `off-fayette-ga-medicaid` |
| Office | Floyd County County DFCS Office | Floyd County | `off-floyd-ga-medicaid` |
| Office | Franklin County County DFCS Office | Franklin County | `off-franklin-ga-medicaid` |
| Office | Gilmer County County DFCS Office | Gilmer County | `off-gilmer-ga-medicaid` |
| Office | Glascock County County DFCS Office | Glascock County | `off-glascock-ga-medicaid` |
| Office | Glynn County County DFCS Office | Glynn County | `off-glynn-ga-medicaid` |
| Office | Gordon County County DFCS Office | Gordon County | `off-gordon-ga-medicaid` |
| Office | Grady County County DFCS Office | Grady County | `off-grady-ga-medicaid` |
| Office | Greene County County DFCS Office | Greene County | `off-greene-ga-medicaid` |
| Office | Habersham County County DFCS Office | Habersham County | `off-habersham-ga-medicaid` |
| Office | Hancock County County DFCS Office | Hancock County | `off-hancock-ga-medicaid` |
| Office | Haralson County County DFCS Office | Haralson County | `off-haralson-ga-medicaid` |
| Office | Harris County County DFCS Office | Harris County | `off-harris-ga-medicaid` |
| ... | *and 215 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
