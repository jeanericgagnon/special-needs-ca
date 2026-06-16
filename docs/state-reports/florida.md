# Data Provenance Report: Florida (FL)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Florida under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `READY_FOR_ALLOWLIST`
- **Canonical Release Gate Score**: **99.80%**
- **Live Raw Database Depth Score**: **100.0%** (Manual Review Rate: **0.0%**)
- **Sitemap Indexing Posture**: `Exposed`
- **Search Engine Gating Policy**: `Eligible` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (14):** Alachua County, Brevard County, Broward County, Duval County, Hillsborough County, Lee County, Leon County, Miami-Dade County, Orange County, Palm Beach County, Pasco County, Pinellas County, Polk County, Seminole County

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `APD Region`
- **Medicaid Program Name**: `Florida Medicaid`
- **Waiver Program Name**: `Florida iBudget Waiver`
- **Personal Care Program**: `iBudget Waiver / CDC+`
- **Developmental Disability (DD) Agency**: `Florida Agency for Persons with Disabilities`
- **State Education Agency**: `Florida Department of Education`
- **State Education Agency SPED Label**: `FDLRS Associate Centers`
- **State Early Intervention Label**: `Florida Early Steps (Ages 0-3)`
- **ABLE Savings Program**: `ABLE United`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 67
- **County Social Service Storefronts**: 69
- **School Districts**: 67
- **Regional Education Agencies (REAs)**: 19
- **State-Level Resource Agencies**: 29
- **Local Nonprofit Support Organizations**: 235
- **Special Education (IEP) Advocates/Attorneys**: 31
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 313 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 415 records
- **Manual Review Backlog (Flagged)**: 0 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Children's Medical Services (CMS) Plan** (State Program): Source URL: https://www.floridahealth.gov/individual-family-health/child-infant-youth/special-health-care-needs/cms/
  * Description: A specialized managed care program for children with special healthcare needs, offering comprehensive medical, dental, a...
- **FDLRS Child Find** (State Program): Source URL: https://www.fdlrs.org/child-find
  * Description: Coordinates screening and evaluation for children (birth through 21) who are not enrolled in public school but may need ...
- **FLDOE Exceptional Student Education (ESE)** (State Program): Source URL: https://www.fldoe.org/academics/exceptional-student-edu/
  * Description: Provides special education services, individualized instruction, and speech, occupational, and behavioral therapies to s...
- **Family Empowerment Scholarship for Students with Unique Abilities (FES-UA)** (State Program): Source URL: https://www.stepupforstudents.org/scholarships/unique-abilities/
  * Description: Allows parents to direct scholarship funds toward qualified educational expenses, including private school tuition, tuto...
- **Florida ABLE** (State Program): Source URL: https://www.ableunited.com/
  * Description: Allows individuals with disabilities to save tax-free for qualified disability expenses (therapies, housing, assistive t...
- **Florida Consumer Directed Care Plus (CDC+) Waiver** (State Program): Source URL: https://apd.myflorida.com/cdcplus/
  * Description: A consumer-directed option for iBudget Florida waiver clients that allows them to hire their own caregivers, including p...
- **Florida Early Steps** (State Program): Source URL: https://www.floridaearlysteps.com/
  * Description: The state early intervention system providing evaluation, therapies, and coordination for infants and toddlers with sign...
- **Florida KidCare** (State Program): Source URL: https://www.floridakidcare.org/
  * Description: The state's children's health insurance program, including MediKids, Healthy Kids, and Children's Medical Services, for ...
- **Florida Medicaid / DCF ACCESS** (State Program): Source URL: https://myaccess.myflfamilies.com
  * Description: Provides access to public health coverage for low-income families, elderly individuals, and individuals with disabilitie...
- **Florida Vocational Rehabilitation Transition Youth Program** (State Program): Source URL: https://www.rehabworks.org/student-youth/
  * Description: Helps students with disabilities transition from school to work or postsecondary education, providing career counseling,...
- **Florida iBudget HCBS Waiver** (State Program): Source URL: https://apd.myflorida.com/ibudget/
  * Description: Medicaid home and community-based waiver designed to help people with developmental disabilities live as independently a...
- **Statewide Medicaid Managed Care (SMMC)** (State Program): Source URL: https://ahca.myflorida.com/medicaid/statewide_mc/index.shtml
  * Description: Florida's program where most Medicaid recipients receive acute and long-term care services through managed care plans. C...
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...
- **Supplemental Security Income (SSI) for Children (Florida)** (State Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Federal cash assistance program administered by SSA. In Florida, children approved for SSI are automatically enrolled in...
- **iBudget Florida Waiver** (State Program): Source URL: https://apd.myflorida.com/ibudget/
  * Description: Home and Community-Based Services Medicaid Waiver for individuals with developmental disabilities.


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **APD Central Region - Lakeland (Field Office 14)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (863) 413-3360 | Status: `source_listed`
- **APD Central Region - Orlando (Field Office 7)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (407) 245-0440 | Status: `source_listed`
- **APD Central Region - Wildwood (Field Office 13)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (352) 330-2749 | Status: `source_listed`
- **APD Northeast Region - Daytona Beach (Field Office 12)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (386) 238-4607 | Status: `source_listed`
- **APD Northeast Region - Gainesville (Field Office 3)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (352) 955-6061 | Status: `source_listed`
- **APD Northeast Region - Jacksonville (Field Office 4)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (904) 992-2440 | Status: `source_listed`
- **APD Northwest Region - Panama City (Field Office 2A)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (850) 872-7652 | Status: `source_listed`
- **APD Northwest Region - Pensacola (Field Office 1)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (850) 595-8351 | Status: `source_listed`
- **APD Northwest Region - Tallahassee (Field Office 2B)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (850) 487-1992 | Status: `source_listed`
- **APD Southeast Region - Fort Lauderdale (Field Office 10)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (954) 467-4218 | Status: `source_listed`
- **APD Southeast Region - West Palm Beach (Field Office 9)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (561) 837-5564 | Status: `source_listed`
- **APD Southern Region - Miami (Field Office 11)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (305) 349-1478 | Status: `source_listed`
- **APD Suncoast Region - Fort Myers (Field Office 8)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (239) 338-1370 | Status: `source_listed`
- **APD Suncoast Region - Tampa (Field Office 23)** (apd_office): Website: https://apd.myflorida.com/region/ | Phone: (813) 233-4300 | Status: `source_listed`
- **Bay Area Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (813) 974-0602 | Status: `source_listed`
- **Big Bend Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (850) 921-0263 | Status: `source_listed`
- **Central Florida Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (407) 317-7430 | Status: `source_listed`
- **Gold Coast Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (954) 728-8300 | Status: `source_listed`
- **Gulf Central Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (941) 487-5400 | Status: `source_listed`
- **North Beaches Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (386) 255-4568 | Status: `source_listed`
- **North Central Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (352) 273-8555 | Status: `source_listed`
- **North Dade Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (305) 243-6660 | Status: `source_listed`
- **Northeastern Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (904) 244-9740 | Status: `source_listed`
- **Southernmost Coast Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (305) 324-5688 | Status: `source_listed`
- **Southwest Florida Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (239) 433-6700 | Status: `source_listed`
- **Space Coast Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (321) 634-3688 | Status: `source_listed`
- **Treasure Coast Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (561) 471-1688 | Status: `source_listed`
- **West Central Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (727) 767-4403 | Status: `source_listed`
- **Western Panhandle Early Steps** (early_steps): Website: https://www.floridaearlysteps.com | Phone: (850) 416-7656 | Status: `source_listed`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Alachua County | 1 | 1 | 5 | 5 | 🟢 COMPLETE |
| Baker County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bradford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brevard County | 1 | 1 | 4 | 5 | 🟢 COMPLETE |
| Broward County | 1 | 1 | 5 | 5 | 🟢 COMPLETE |
| Calhoun County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Charlotte County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Citrus County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Collier County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Columbia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| DeSoto County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dixie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Duval County | 1 | 1 | 6 | 5 | 🟢 COMPLETE |
| Escambia County | 1 | 1 | 4 | 2 | 🟢 COMPLETE |
| Flagler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gadsden County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gilchrist County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Glades County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gulf County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hamilton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hardee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hendry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hernando County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Highlands County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hillsborough County | 1 | 1 | 5 | 5 | 🟢 COMPLETE |
| Holmes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Indian River County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lafayette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 5 | 5 | 🟢 COMPLETE |
| Leon County | 3 | 1 | 7 | 5 | 🟢 COMPLETE |
| Levy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Liberty County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Manatee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 4 | 2 | 🟢 COMPLETE |
| Martin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Miami-Dade County | 1 | 1 | 6 | 5 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nassau County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Okaloosa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Okeechobee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Orange County | 1 | 1 | 5 | 5 | 🟢 COMPLETE |
| Osceola County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Palm Beach County | 1 | 1 | 5 | 5 | 🟢 COMPLETE |
| Pasco County | 1 | 1 | 4 | 5 | 🟢 COMPLETE |
| Pinellas County | 1 | 1 | 6 | 5 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 5 | 5 | 🟢 COMPLETE |
| Putnam County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Santa Rosa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sarasota County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Seminole County | 1 | 1 | 4 | 6 | 🟢 COMPLETE |
| St. Johns County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Lucie County | 1 | 1 | 4 | 2 | 🟢 COMPLETE |
| Sumter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Suwannee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Taylor County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Volusia County | 1 | 1 | 4 | 2 | 🟢 COMPLETE |
| Wakulla County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Walton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

---

## 8. Detailed County-Level Gap Registry
List of specific counties with zero resource mappings:
- **Counties Missing Social Service Offices**: None
- **Counties Missing School Districts**: None
- **Counties Missing Local Nonprofits**: None

---

## 9. Manual Review Queue Registry
List of records flagged as `manual_review_required` in the database, representing exactly what needs to be verified before this state can be advanced:

No records in manual review queue.


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
