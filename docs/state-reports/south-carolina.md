# Data Provenance Report: South Carolina (SC)

This report details the data sources, records count, trust classifications, and launch readiness for the State of South Carolina under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.8%** (Manual Review Rate: **58.23%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `South Carolina Medicaid`
- **Waiver Program Name**: `South Carolina HCBS Waivers`
- **Personal Care Program**: `South Carolina Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `South Carolina Department of Disabilities and Special Needs`
- **State Education Agency**: `South Carolina Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `South Carolina Early Intervention`
- **ABLE Savings Program**: `South Carolina ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 46
- **County Social Service Storefronts**: 46
- **School Districts**: 46
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 138
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 193 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 99 records
- **Manual Review Backlog (Flagged)**: 138 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **SSI for Children (South Carolina)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **South Carolina ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **South Carolina Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.scdhhs.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **South Carolina Early Intervention Services** (State Program): Source URL: https://ddsn.sc.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **South Carolina HCBS Waivers** (State Program): Source URL: https://ddsn.sc.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for South Carolina residen...
- **South Carolina Medicaid** (State Program): Source URL: https://www.scdhhs.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **South Carolina Medicaid Personal Care** (State Program): Source URL: https://www.scdhhs.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **South Carolina Self-Direction Services** (State Program): Source URL: https://ddsn.sc.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **South Carolina Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **South Carolina Transition & Vocational Rehabilitation** (State Program): Source URL: https://ddsn.sc.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **South Carolina Developmental Services Intake** (dd_intake): Website: https://dhhs.south-carolina.gov/dd | Phone: None | Status: `manual_review_required`
- **South Carolina Early Intervention State Office** (early_intervention): Website: https://dhhs.south-carolina.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Abbeville County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Aiken County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Allendale County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Anderson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bamberg County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Barnwell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Beaufort County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Berkeley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calhoun County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Charleston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cherokee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chester County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chesterfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clarendon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Colleton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Darlington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dillon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dorchester County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Edgefield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fairfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Florence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Georgetown County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greenville County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Greenwood County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hampton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Horry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jasper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kershaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lancaster County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Laurens County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lexington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marlboro County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McCormick County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Newberry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oconee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Orangeburg County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pickens County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Richland County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Saluda County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Spartanburg County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sumter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Williamsburg County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
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
| Office | Abbeville County storefront office | Abbeville County | `off-abbeville-sc-medicaid` |
| Office | Aiken County storefront office | Aiken County | `off-aiken-sc-medicaid` |
| Office | Allendale County storefront office | Allendale County | `off-allendale-sc-medicaid` |
| Office | Anderson County storefront office | Anderson County | `off-anderson-sc-medicaid` |
| Office | Bamberg County storefront office | Bamberg County | `off-bamberg-sc-medicaid` |
| Office | Barnwell County storefront office | Barnwell County | `off-barnwell-sc-medicaid` |
| Office | Beaufort County storefront office | Beaufort County | `off-beaufort-sc-medicaid` |
| Office | Berkeley County storefront office | Berkeley County | `off-berkeley-sc-medicaid` |
| Office | Calhoun County storefront office | Calhoun County | `off-calhoun-sc-medicaid` |
| Office | Charleston County storefront office | Charleston County | `off-charleston-sc-medicaid` |
| Office | Cherokee County storefront office | Cherokee County | `off-cherokee-sc-medicaid` |
| Office | Chester County storefront office | Chester County | `off-chester-sc-medicaid` |
| Office | Chesterfield County storefront office | Chesterfield County | `off-chesterfield-sc-medicaid` |
| Office | Clarendon County storefront office | Clarendon County | `off-clarendon-sc-medicaid` |
| Office | Colleton County storefront office | Colleton County | `off-colleton-sc-medicaid` |
| Office | Darlington County storefront office | Darlington County | `off-darlington-sc-medicaid` |
| Office | Dillon County storefront office | Dillon County | `off-dillon-sc-medicaid` |
| Office | Dorchester County storefront office | Dorchester County | `off-dorchester-sc-medicaid` |
| Office | Edgefield County storefront office | Edgefield County | `off-edgefield-sc-medicaid` |
| Office | Fairfield County storefront office | Fairfield County | `off-fairfield-sc-medicaid` |
| Office | Florence County storefront office | Florence County | `off-florence-sc-medicaid` |
| Office | Georgetown County storefront office | Georgetown County | `off-georgetown-sc-medicaid` |
| Office | Greenville County storefront office | Greenville County | `off-greenville-sc-medicaid` |
| Office | Greenwood County storefront office | Greenwood County | `off-greenwood-sc-medicaid` |
| Office | Hampton County storefront office | Hampton County | `off-hampton-sc-medicaid` |
| Office | Horry County storefront office | Horry County | `off-horry-sc-medicaid` |
| Office | Jasper County storefront office | Jasper County | `off-jasper-sc-medicaid` |
| Office | Kershaw County storefront office | Kershaw County | `off-kershaw-sc-medicaid` |
| Office | Lancaster County storefront office | Lancaster County | `off-lancaster-sc-medicaid` |
| Office | Laurens County storefront office | Laurens County | `off-laurens-sc-medicaid` |
| Office | Lee County storefront office | Lee County | `off-lee-sc-medicaid` |
| Office | Lexington County storefront office | Lexington County | `off-lexington-sc-medicaid` |
| Office | McCormick County storefront office | McCormick County | `off-mccormick-sc-medicaid` |
| Office | Marion County storefront office | Marion County | `off-marion-sc-medicaid` |
| Office | Marlboro County storefront office | Marlboro County | `off-marlboro-sc-medicaid` |
| Office | Newberry County storefront office | Newberry County | `off-newberry-sc-medicaid` |
| Office | Oconee County storefront office | Oconee County | `off-oconee-sc-medicaid` |
| Office | Orangeburg County storefront office | Orangeburg County | `off-orangeburg-sc-medicaid` |
| Office | Pickens County storefront office | Pickens County | `off-pickens-sc-medicaid` |
| Office | Richland County storefront office | Richland County | `off-richland-sc-medicaid` |
| Office | Saluda County storefront office | Saluda County | `off-saluda-sc-medicaid` |
| Office | Spartanburg County storefront office | Spartanburg County | `off-spartanburg-sc-medicaid` |
| Office | Sumter County storefront office | Sumter County | `off-sumter-sc-medicaid` |
| Office | Union County storefront office | Union County | `off-union-sc-medicaid` |
| Office | Williamsburg County storefront office | Williamsburg County | `off-williamsburg-sc-medicaid` |
| Office | York County storefront office | York County | `off-york-sc-medicaid` |
| School District | Greenville Public Schools Special Education | Greenville County | `sd-greenville-sc` |
| School District | Richland Public Schools Special Education | Richland County | `sd-richland-sc` |
| School District | Abbeville County School District | Abbeville County | `sd-abbeville-sc` |
| School District | Aiken County School District | Aiken County | `sd-aiken-sc` |
| ... | *and 88 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
