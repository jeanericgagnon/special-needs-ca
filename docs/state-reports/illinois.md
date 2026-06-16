# Data Provenance Report: Illinois (IL)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Illinois under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Pilot)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **99.6%** (Manual Review Rate: **0.38%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `ISC Agency`
- **Medicaid Program Name**: `Illinois Medicaid`
- **Waiver Program Name**: `Children\`
- **Personal Care Program**: `Home Services Program (HSP)`
- **Developmental Disability (DD) Agency**: `Illinois Department of Human Services Division of Developmental Disabilities`
- **State Education Agency**: `Illinois State Board of Education (ISBE)`
- **State Education Agency SPED Label**: `ISBE Special Education Services`
- **State Early Intervention Label**: `Illinois Early Intervention`
- **ABLE Savings Program**: `IL ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 102
- **County Social Service Storefronts**: 102
- **School Districts**: 102
- **Regional Education Agencies (REAs)**: 33
- **State-Level Resource Agencies**: 40
- **Local Nonprofit Support Organizations**: 7
- **Special Education (IEP) Advocates/Attorneys**: 22
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 140 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 259 records
- **Manual Review Backlog (Flagged)**: 1 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 89 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **DRS Transition Services** (State Program): Source URL: https://www.dhs.state.il.us/page.aspx?item=29737
  * Description: IL Division of Rehabilitation Services transition planning from high school to work.
- **Home Services Program (HSP)** (State Program): Source URL: https://www.dhs.state.il.us/page.aspx?item=29738
  * Description: Provides personal care assistant services allowing individuals to direct their own care, hiring family members.
- **ISBE Special Education / IEP** (State Program): Source URL: https://www.isbe.net/Pages/Special-Education-Programs.aspx
  * Description: Exceptional children special education services, accommodations, and IEP programs under ISBE guidelines.
- **Illinois ABLE** (State Program): Source URL: https://illinoisable.com/
  * Description: Illinois program for tax-free savings for disability expenses.
- **Illinois Adults with DD Waiver** (State Program): Source URL: https://www.dhs.state.il.us/page.aspx?item=47257
  * Description: Offers residential services, day programs, and support for adults (18+) with developmental disabilities.
- **Illinois All Kids** (State Program): Source URL: https://www.illinois.gov/hfs/MedicalPrograms/AllKids/Pages/default.aspx
  * Description: Illinois CHIP program providing health insurance for children of middle-income families.
- **Illinois Children's Support Waiver** (State Program): Source URL: https://www.dhs.state.il.us/page.aspx?item=47257
  * Description: HCBS waiver for children with developmental disabilities, offering home support, personal care, and therapies.
- **Illinois Early Intervention** (State Program): Source URL: https://www.dhs.state.il.us/page.aspx?item=31183
  * Description: Supports families of infants/toddlers with delays, managed via Child and Family Connections (CFC) offices.
- **Illinois Medicaid (ABE)** (State Program): Source URL: https://abe.illinois.gov/abe/access/
  * Description: Public health coverage portal (ABE) with parent income bypass for HCBS waiver participants.
- **SSI for Children (Illinois)** (State Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Federal cash benefits with automatic Illinois Medicaid routing through ABE portal.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **CFC #1 - Youth Services Network** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (815) 986-1947 | Status: `source_listed`
- **CFC #10 - Cook County (Chicago Southwest)** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (773) 602-4200 | Status: `source_listed`
- **CFC #11 - Cook County (Near West)** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (708) 293-0100 | Status: `source_listed`
- **CFC #12 - Cook County (South Suburban)** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (708) 499-2200 | Status: `source_listed`
- **CFC #13 - Henderson/Knox/McDonough/Warren** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (309) 342-8144 | Status: `source_listed`
- **CFC #14 - Peoria/Stark/Tazewell/Woodford/Henry** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (309) 672-6360 | Status: `source_listed`
- **CFC #15 - Will/Grundy/Kankakee/LaSalle** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (815) 730-2615 | Status: `source_listed`
- **CFC #16 - Champaign/Ford/Iroquois/Vermilion/McLean/Livingston** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (217) 693-7958 | Status: `source_listed`
- **CFC #17 - Adams/Pike/Brown/Hancock/Schuyler** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (217) 222-4414 | Status: `source_listed`
- **CFC #18 - Sangamon/Logan/Menard/Christian/Montgomery/Macoupin** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (217) 744-9000 | Status: `source_listed`
- **CFC #19 - Coles/Clark/Cumberland/Douglas/Edgar/Moultrie/Shelby** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (217) 345-2188 | Status: `source_listed`
- **CFC #2 - Lake County Health Department** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (847) 377-8900 | Status: `source_listed`
- **CFC #20 - Effingham/Clay/Crawford/Fayette/Jasper/Lawrence/Richland** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (217) 342-2193 | Status: `source_listed`
- **CFC #21 - Madison/Monroe/Randolph/St. Clair** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (618) 624-5005 | Status: `source_listed`
- **CFC #22 - Marion/Clinton/Washington/Franklin/Jefferson/Williamson** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (618) 532-4919 | Status: `source_listed`
- **CFC #23 - Southern IL (East)** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (618) 745-6352 | Status: `source_listed`
- **CFC #24 - Southern IL (West)** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (618) 687-1733 | Status: `source_listed`
- **CFC #25 - DuPage County Health Department** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (630) 530-1120 | Status: `source_listed`
- **CFC #3 - Regional Office of Education 8** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (815) 297-1041 | Status: `source_listed`
- **CFC #4 - DayOne Network** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (630) 879-2277 | Status: `source_listed`
- **CFC #5 - Cook County (West)** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (773) 867-4000 | Status: `source_listed`
- **CFC #6 - Clearbrook** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (847) 385-5070 | Status: `source_listed`
- **CFC #7 - Cook County (Chicago North)** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (312) 492-4200 | Status: `source_listed`
- **CFC #8 - Cook County (Chicago South)** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (773) 867-4000 | Status: `source_listed`
- **CFC #9 - Cook County (Chicago Central)** (cfc): Website: https://www.dhs.state.il.us/page.aspx?item=31182 | Phone: (773) 753-5300 | Status: `source_listed`
- **Central Illinois Service Access (CISA) (Central/West Region)** (isc): Website: https://www.cisagroup.org | Phone: (217) 732-4731 | Status: `source_listed`
- **Community Alternatives Unlimited (CAU) (Chicagoland North/West)** (isc): Website: http://www.cau.org | Phone: (773) 867-4000 | Status: `source_listed`
- **Community Service Options (CSO) (Chicagoland Central)** (isc): Website: http://www.cso1.org | Phone: (773) 471-4700 | Status: `source_listed`
- **Cornerstone Services (ISC Region)** (isc): Website: https://www.cornerstoneservices.org | Phone: (815) 727-6667 | Status: `source_listed`
- **DayOne Network (ISC Region)** (isc): Website: https://www.dayonenetwork.org | Phone: (630) 892-4434 | Status: `source_listed`
- **Glenkirk (ISC Region)** (isc): Website: https://www.glenkirk.org | Phone: (847) 272-5111 | Status: `source_listed`
- **Options and Advocacy (ISC Region)** (isc): Website: https://www.optionsandadvocacy.org | Phone: (815) 477-4720 | Status: `source_listed`
- **Prairieland Service Coordination (Central/East Region)** (isc): Website: http://psci.info | Phone: (217) 362-6128 | Status: `source_listed`
- **RAMP (ISC Region)** (isc): Website: https://rampside.org | Phone: (815) 968-7567 | Status: `source_listed`
- **Sertoma Star Services (CFC/ISC Region)** (isc): Website: https://www.sertomastar.org | Phone: (708) 371-2600 | Status: `source_listed`
- **Service Associates (ISC Region)** (isc): Website: https://www.serviceassociates.org | Phone: (630) 968-3500 | Status: `source_listed`
- **Service Inc. of Illinois (Northern/Will Region)** (isc): Website: http://www.svcincofil.org | Phone: (815) 741-0800 | Status: `source_listed`
- **Southern Illinois Case Coordination** (isc): Website: https://www.sicc.org | Phone: (618) 236-7957 | Status: `source_listed`
- **Southern Illinois Case Coordination Services (SICCS) (Southern Region)** (isc): Website: http://www.siccs.org | Phone: (618) 532-4300 | Status: `source_listed`
- **Suburban Access Inc. (Chicagoland South)** (isc): Website: http://www.subacc.org | Phone: (708) 799-9190 | Status: `source_listed`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adams County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Alexander County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Bond County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Boone County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Brown County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Bureau County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Calhoun County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Carroll County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Cass County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Champaign County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Christian County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Clark County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Clay County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Clinton County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Coles County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Cook County | 1 | 1 | 2 | 4 | 🟢 COMPLETE |
| Crawford County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Cumberland County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| DeKalb County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| DeWitt County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Douglas County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| DuPage County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Edgar County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Edwards County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Effingham County | 1 | 1 | 1 | 2 | 🟢 COMPLETE |
| Fayette County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Ford County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Franklin County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Fulton County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Gallatin County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Greene County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Grundy County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Hamilton County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Hancock County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Hardin County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Henderson County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Henry County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Iroquois County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Jackson County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Jasper County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Jefferson County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Jersey County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Jo Daviess County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Johnson County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Kane County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Kankakee County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Kendall County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Knox County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| LaSalle County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lake County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lawrence County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lee County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Livingston County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Logan County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Macon County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Macoupin County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Madison County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Marion County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Marshall County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Mason County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Massac County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| McDonough County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| McHenry County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| McLean County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Menard County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Mercer County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Monroe County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Montgomery County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Morgan County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Moultrie County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Ogle County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Peoria County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Perry County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Piatt County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Pike County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Pope County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Pulaski County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Putnam County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Randolph County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Richland County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Rock Island County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Saline County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Sangamon County | 1 | 1 | 1 | 4 | 🟢 COMPLETE |
| Schuyler County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Scott County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Shelby County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| St. Clair County | 1 | 1 | 1 | 4 | 🟢 COMPLETE |
| Stark County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Stephenson County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Tazewell County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Union County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Vermilion County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Wabash County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Warren County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Washington County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Wayne County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| White County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Whiteside County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Will County | 1 | 1 | 2 | 4 | 🟢 COMPLETE |
| Williamson County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Winnebago County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Woodford County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |

---

## 8. Detailed County-Level Gap Registry
List of specific counties with zero resource mappings:
- **Counties Missing Social Service Offices**: None
- **Counties Missing School Districts**: None
- **Counties Missing Local Nonprofits**: Adams County, Alexander County, Bond County, Boone County, Brown County, Bureau County, Calhoun County, Carroll County, Cass County, Champaign County, Christian County, Clark County, Clay County, Clinton County, Coles County, Crawford County, Cumberland County, DeKalb County, DeWitt County, Douglas County, DuPage County, Edgar County, Edwards County, Fayette County, Ford County, Franklin County, Fulton County, Gallatin County, Greene County, Grundy County, Hamilton County, Hancock County, Hardin County, Henderson County, Henry County, Iroquois County, Jackson County, Jasper County, Jefferson County, Jersey County, Jo Daviess County, Johnson County, Kane County, Kankakee County, Kendall County, Knox County, LaSalle County, Lake County, Lawrence County, Lee County, Livingston County, Logan County, Macon County, Macoupin County, Madison County, Marion County, Marshall County, Mason County, Massac County, McDonough County, McHenry County, McLean County, Menard County, Mercer County, Monroe County, Montgomery County, Morgan County, Moultrie County, Ogle County, Peoria County, Perry County, Piatt County, Pike County, Pope County, Pulaski County, Putnam County, Randolph County, Richland County, Rock Island County, Saline County, Schuyler County, Scott County, Shelby County, Stark County, Stephenson County, Tazewell County, Union County, Vermilion County, Wabash County, Warren County, Washington County, Wayne County, White County, Whiteside County, Williamson County, Winnebago County, Woodford County

---

## 9. Manual Review Queue Registry
List of records flagged as `manual_review_required` in the database, representing exactly what needs to be verified before this state can be advanced:

| Category | Record Name | County | ID |
| :--- | :--- | :--- | :--- |
| Nonprofit | The Arc of Illinois | Will County | `np-arc-of-illinois-il` |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
