# Data Provenance Report: Tennessee (TN)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Tennessee under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **80.3%** (Manual Review Rate: **19.71%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Tennessee Medicaid`
- **Waiver Program Name**: `Tennessee HCBS Waivers`
- **Personal Care Program**: `Tennessee Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Tennessee Department of Intellectual and Developmental Disabilities`
- **State Education Agency**: `Tennessee Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Tennessee Early Intervention`
- **ABLE Savings Program**: `Tennessee ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 95
- **County Social Service Storefronts**: 95
- **School Districts**: 95
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 285
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 387 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 387 records
- **Manual Review Backlog (Flagged)**: 95 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **SSI for Children (Tennessee)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...
- **Tennessee ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Tennessee Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.tn.gov/tenncare
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Tennessee Early Intervention Services** (State Program): Source URL: https://www.tn.gov/didd
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Tennessee HCBS Waivers** (State Program): Source URL: https://www.tn.gov/didd/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Tennessee residents.
- **Tennessee Medicaid** (State Program): Source URL: https://www.tn.gov/tenncare
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Tennessee Medicaid Personal Care** (State Program): Source URL: https://www.tn.gov/tenncare
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Tennessee Self-Direction Services** (State Program): Source URL: https://www.tn.gov/didd
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Tennessee Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Tennessee Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.tn.gov/didd
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Tennessee Developmental Services Intake** (dd_intake): Website: https://dhhs.tennessee.gov/dd | Phone: None | Status: `manual_review_required`
- **Tennessee Early Intervention State Office** (early_intervention): Website: https://dhhs.tennessee.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Anderson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bedford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bledsoe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Blount County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bradley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Campbell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cannon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cheatham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chester County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Claiborne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cocke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Coffee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crockett County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cumberland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Davidson County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| DeKalb County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Decatur County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dickson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dyer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fayette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fentress County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gibson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Giles County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grainger County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greene County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grundy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hamblen County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hamilton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hancock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hardeman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hardin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hawkins County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Haywood County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henderson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hickman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Houston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Humphreys County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Knox County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lauderdale County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lawrence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lewis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Loudon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Macon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Maury County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McMinn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McNairy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Meigs County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Moore County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morgan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Obion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Overton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Perry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pickett County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Putnam County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rhea County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Roane County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Robertson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rutherford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sequatchie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sevier County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shelby County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Smith County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stewart County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sullivan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sumner County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tipton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Trousdale County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Unicoi County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Van Buren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Warren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Weakley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| White County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Williamson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wilson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Nonprofit | The Arc of Tennessee | Anderson County | `tn-np-arc-anderson-tn` |
| Nonprofit | The Arc of Tennessee | Bedford County | `tn-np-arc-bedford-tn` |
| Nonprofit | The Arc of Tennessee | Benton County | `tn-np-arc-benton-tn` |
| Nonprofit | The Arc of Tennessee | Bledsoe County | `tn-np-arc-bledsoe-tn` |
| Nonprofit | The Arc of Tennessee | Blount County | `tn-np-arc-blount-tn` |
| Nonprofit | The Arc of Tennessee | Bradley County | `tn-np-arc-bradley-tn` |
| Nonprofit | The Arc of Tennessee | Campbell County | `tn-np-arc-campbell-tn` |
| Nonprofit | The Arc of Tennessee | Cannon County | `tn-np-arc-cannon-tn` |
| Nonprofit | The Arc of Tennessee | Carroll County | `tn-np-arc-carroll-tn` |
| Nonprofit | The Arc of Tennessee | Carter County | `tn-np-arc-carter-tn` |
| Nonprofit | The Arc of Tennessee | Cheatham County | `tn-np-arc-cheatham-tn` |
| Nonprofit | The Arc of Tennessee | Chester County | `tn-np-arc-chester-tn` |
| Nonprofit | The Arc of Tennessee | Claiborne County | `tn-np-arc-claiborne-tn` |
| Nonprofit | The Arc of Tennessee | Clay County | `tn-np-arc-clay-tn` |
| Nonprofit | The Arc of Tennessee | Cocke County | `tn-np-arc-cocke-tn` |
| Nonprofit | The Arc of Tennessee | Coffee County | `tn-np-arc-coffee-tn` |
| Nonprofit | The Arc of Tennessee | Crockett County | `tn-np-arc-crockett-tn` |
| Nonprofit | The Arc of Tennessee | Cumberland County | `tn-np-arc-cumberland-tn` |
| Nonprofit | The Arc of Tennessee | Davidson County | `tn-np-arc-davidson-tn` |
| Nonprofit | The Arc of Tennessee | Decatur County | `tn-np-arc-decatur-tn` |
| Nonprofit | The Arc of Tennessee | DeKalb County | `tn-np-arc-dekalb-tn` |
| Nonprofit | The Arc of Tennessee | Dickson County | `tn-np-arc-dickson-tn` |
| Nonprofit | The Arc of Tennessee | Dyer County | `tn-np-arc-dyer-tn` |
| Nonprofit | The Arc of Tennessee | Fayette County | `tn-np-arc-fayette-tn` |
| Nonprofit | The Arc of Tennessee | Fentress County | `tn-np-arc-fentress-tn` |
| Nonprofit | The Arc of Tennessee | Franklin County | `tn-np-arc-franklin-tn` |
| Nonprofit | The Arc of Tennessee | Gibson County | `tn-np-arc-gibson-tn` |
| Nonprofit | The Arc of Tennessee | Giles County | `tn-np-arc-giles-tn` |
| Nonprofit | The Arc of Tennessee | Grainger County | `tn-np-arc-grainger-tn` |
| Nonprofit | The Arc of Tennessee | Greene County | `tn-np-arc-greene-tn` |
| Nonprofit | The Arc of Tennessee | Grundy County | `tn-np-arc-grundy-tn` |
| Nonprofit | The Arc of Tennessee | Hamblen County | `tn-np-arc-hamblen-tn` |
| Nonprofit | The Arc of Tennessee | Hamilton County | `tn-np-arc-hamilton-tn` |
| Nonprofit | The Arc of Tennessee | Hancock County | `tn-np-arc-hancock-tn` |
| Nonprofit | The Arc of Tennessee | Hardeman County | `tn-np-arc-hardeman-tn` |
| Nonprofit | The Arc of Tennessee | Hardin County | `tn-np-arc-hardin-tn` |
| Nonprofit | The Arc of Tennessee | Hawkins County | `tn-np-arc-hawkins-tn` |
| Nonprofit | The Arc of Tennessee | Haywood County | `tn-np-arc-haywood-tn` |
| Nonprofit | The Arc of Tennessee | Henderson County | `tn-np-arc-henderson-tn` |
| Nonprofit | The Arc of Tennessee | Henry County | `tn-np-arc-henry-tn` |
| Nonprofit | The Arc of Tennessee | Hickman County | `tn-np-arc-hickman-tn` |
| Nonprofit | The Arc of Tennessee | Houston County | `tn-np-arc-houston-tn` |
| Nonprofit | The Arc of Tennessee | Humphreys County | `tn-np-arc-humphreys-tn` |
| Nonprofit | The Arc of Tennessee | Jackson County | `tn-np-arc-jackson-tn` |
| Nonprofit | The Arc of Tennessee | Jefferson County | `tn-np-arc-jefferson-tn` |
| Nonprofit | The Arc of Tennessee | Johnson County | `tn-np-arc-johnson-tn` |
| Nonprofit | The Arc of Tennessee | Knox County | `tn-np-arc-knox-tn` |
| Nonprofit | The Arc of Tennessee | Lake County | `tn-np-arc-lake-tn` |
| Nonprofit | The Arc of Tennessee | Lauderdale County | `tn-np-arc-lauderdale-tn` |
| Nonprofit | The Arc of Tennessee | Lawrence County | `tn-np-arc-lawrence-tn` |
| ... | *and 45 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
