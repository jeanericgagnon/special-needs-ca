# Data Provenance Report: Virginia (VA)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Virginia under the V3 release-quality standards as of June 2026.

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
- **Medicaid Program Name**: `Virginia Medicaid`
- **Waiver Program Name**: `Virginia HCBS Waivers`
- **Personal Care Program**: `Virginia Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Virginia Department of Behavioral Health and Developmental Services`
- **State Education Agency**: `Virginia Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Virginia Early Intervention`
- **ABLE Savings Program**: `Virginia ABLE`

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
- **SSI for Children (Virginia)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...
- **Virginia ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Virginia Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.dmas.virginia.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Virginia Early Intervention Services** (State Program): Source URL: https://dbhds.virginia.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Virginia HCBS Waivers** (State Program): Source URL: https://dbhds.virginia.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Virginia residents.
- **Virginia Medicaid** (State Program): Source URL: https://www.dmas.virginia.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Virginia Medicaid Personal Care** (State Program): Source URL: https://www.dmas.virginia.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Virginia Self-Direction Services** (State Program): Source URL: https://dbhds.virginia.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Virginia Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Virginia Transition & Vocational Rehabilitation** (State Program): Source URL: https://dbhds.virginia.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Virginia Developmental Services Intake** (dd_intake): Website: https://dhhs.virginia.gov/dd | Phone: None | Status: `manual_review_required`
- **Virginia Early Intervention State Office** (early_intervention): Website: https://dhhs.virginia.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Accomack County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Albemarle County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Alleghany County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Amelia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Amherst County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Appomattox County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Arlington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Augusta County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bath County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bedford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Botetourt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brunswick County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Buchanan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Buckingham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Campbell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Caroline County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Charles City County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Charlotte County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chesterfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clarke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Craig County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Culpeper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cumberland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dickenson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dinwiddie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Essex County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fairfax County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Fauquier County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Floyd County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fluvanna County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Frederick County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Giles County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gloucester County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Goochland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grayson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greene County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greensville County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Halifax County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hanover County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henrico County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Highland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Isle of Wight County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| James City County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| King George County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| King William County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| King and Queen County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lancaster County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Loudoun County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Louisa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lunenburg County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mathews County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mecklenburg County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Middlesex County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nelson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| New Kent County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Northampton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Northumberland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nottoway County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Orange County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Page County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Patrick County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pittsylvania County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Powhatan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Prince Edward County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Prince George County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Prince William County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Pulaski County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rappahannock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Richmond County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Roanoke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rockbridge County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rockingham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Russell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shenandoah County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Smyth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Southampton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Spotsylvania County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stafford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Surry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sussex County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tazewell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Warren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Westmoreland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wise County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wythe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| York County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Nonprofit | The Arc of Virginia | Accomack County | `va-np-arc-accomack-va` |
| Nonprofit | The Arc of Virginia | Albemarle County | `va-np-arc-albemarle-va` |
| Nonprofit | The Arc of Virginia | Alleghany County | `va-np-arc-alleghany-va` |
| Nonprofit | The Arc of Virginia | Amelia County | `va-np-arc-amelia-va` |
| Nonprofit | The Arc of Virginia | Amherst County | `va-np-arc-amherst-va` |
| Nonprofit | The Arc of Virginia | Appomattox County | `va-np-arc-appomattox-va` |
| Nonprofit | The Arc of Virginia | Arlington County | `va-np-arc-arlington-va` |
| Nonprofit | The Arc of Virginia | Augusta County | `va-np-arc-augusta-va` |
| Nonprofit | The Arc of Virginia | Bath County | `va-np-arc-bath-va` |
| Nonprofit | The Arc of Virginia | Bedford County | `va-np-arc-bedford-va` |
| Nonprofit | The Arc of Virginia | Bland County | `va-np-arc-bland-va` |
| Nonprofit | The Arc of Virginia | Botetourt County | `va-np-arc-botetourt-va` |
| Nonprofit | The Arc of Virginia | Brunswick County | `va-np-arc-brunswick-va` |
| Nonprofit | The Arc of Virginia | Buchanan County | `va-np-arc-buchanan-va` |
| Nonprofit | The Arc of Virginia | Buckingham County | `va-np-arc-buckingham-va` |
| Nonprofit | The Arc of Virginia | Campbell County | `va-np-arc-campbell-va` |
| Nonprofit | The Arc of Virginia | Caroline County | `va-np-arc-caroline-va` |
| Nonprofit | The Arc of Virginia | Carroll County | `va-np-arc-carroll-va` |
| Nonprofit | The Arc of Virginia | Charles City County | `va-np-arc-charles-city-va` |
| Nonprofit | The Arc of Virginia | Charlotte County | `va-np-arc-charlotte-va` |
| Nonprofit | The Arc of Virginia | Chesterfield County | `va-np-arc-chesterfield-va` |
| Nonprofit | The Arc of Virginia | Clarke County | `va-np-arc-clarke-va` |
| Nonprofit | The Arc of Virginia | Craig County | `va-np-arc-craig-va` |
| Nonprofit | The Arc of Virginia | Culpeper County | `va-np-arc-culpeper-va` |
| Nonprofit | The Arc of Virginia | Cumberland County | `va-np-arc-cumberland-va` |
| Nonprofit | The Arc of Virginia | Dickenson County | `va-np-arc-dickenson-va` |
| Nonprofit | The Arc of Virginia | Dinwiddie County | `va-np-arc-dinwiddie-va` |
| Nonprofit | The Arc of Virginia | Essex County | `va-np-arc-essex-va` |
| Nonprofit | The Arc of Virginia | Fairfax County | `va-np-arc-fairfax-va` |
| Nonprofit | The Arc of Virginia | Fauquier County | `va-np-arc-fauquier-va` |
| Nonprofit | The Arc of Virginia | Floyd County | `va-np-arc-floyd-va` |
| Nonprofit | The Arc of Virginia | Fluvanna County | `va-np-arc-fluvanna-va` |
| Nonprofit | The Arc of Virginia | Franklin County | `va-np-arc-franklin-va` |
| Nonprofit | The Arc of Virginia | Frederick County | `va-np-arc-frederick-va` |
| Nonprofit | The Arc of Virginia | Giles County | `va-np-arc-giles-va` |
| Nonprofit | The Arc of Virginia | Gloucester County | `va-np-arc-gloucester-va` |
| Nonprofit | The Arc of Virginia | Goochland County | `va-np-arc-goochland-va` |
| Nonprofit | The Arc of Virginia | Grayson County | `va-np-arc-grayson-va` |
| Nonprofit | The Arc of Virginia | Greene County | `va-np-arc-greene-va` |
| Nonprofit | The Arc of Virginia | Greensville County | `va-np-arc-greensville-va` |
| Nonprofit | The Arc of Virginia | Halifax County | `va-np-arc-halifax-va` |
| Nonprofit | The Arc of Virginia | Hanover County | `va-np-arc-hanover-va` |
| Nonprofit | The Arc of Virginia | Henrico County | `va-np-arc-henrico-va` |
| Nonprofit | The Arc of Virginia | Henry County | `va-np-arc-henry-va` |
| Nonprofit | The Arc of Virginia | Highland County | `va-np-arc-highland-va` |
| Nonprofit | The Arc of Virginia | Isle of Wight County | `va-np-arc-isle-of-wight-va` |
| Nonprofit | The Arc of Virginia | James City County | `va-np-arc-james-city-va` |
| Nonprofit | The Arc of Virginia | King and Queen County | `va-np-arc-king-and-queen-va` |
| Nonprofit | The Arc of Virginia | King George County | `va-np-arc-king-george-va` |
| Nonprofit | The Arc of Virginia | King William County | `va-np-arc-king-william-va` |
| ... | *and 45 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
