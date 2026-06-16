# Data Provenance Report: Oregon (OR)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Oregon under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **42.2%** (Manual Review Rate: **57.75%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Oregon Medicaid`
- **Waiver Program Name**: `Oregon HCBS Waivers`
- **Personal Care Program**: `Oregon Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Oregon Developmental Disability Services`
- **State Education Agency**: `Oregon Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Oregon Early Intervention`
- **ABLE Savings Program**: `Oregon ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 36
- **County Social Service Storefronts**: 36
- **School Districts**: 36
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 108
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 153 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 79 records
- **Manual Review Backlog (Flagged)**: 108 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Oregon ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Oregon Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.oregon.gov/oha
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Oregon Early Intervention Services** (State Program): Source URL: https://www.oregon.gov/odhs/dds
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Oregon HCBS Waivers** (State Program): Source URL: https://www.oregon.gov/odhs/dds/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Oregon residents.
- **Oregon Medicaid** (State Program): Source URL: https://www.oregon.gov/oha
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Oregon Medicaid Personal Care** (State Program): Source URL: https://www.oregon.gov/oha
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Oregon Self-Direction Services** (State Program): Source URL: https://www.oregon.gov/odhs/dds
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Oregon Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Oregon Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.oregon.gov/odhs/dds
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Oregon)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Oregon Developmental Services Intake** (dd_intake): Website: https://dhhs.oregon.gov/dd | Phone: None | Status: `manual_review_required`
- **Oregon Early Intervention State Office** (early_intervention): Website: https://dhhs.oregon.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Baker County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clackamas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clatsop County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Columbia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Coos County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crook County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Curry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Deschutes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gilliam County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harney County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hood River County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Josephine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Klamath County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lane County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Linn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Malheur County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morrow County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Multnomah County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sherman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tillamook County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Umatilla County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wallowa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wasco County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Wheeler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yamhill County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Baker County storefront office | Baker County | `off-baker-or-medicaid` |
| Office | Benton County storefront office | Benton County | `off-benton-or-medicaid` |
| Office | Clackamas County storefront office | Clackamas County | `off-clackamas-or-medicaid` |
| Office | Clatsop County storefront office | Clatsop County | `off-clatsop-or-medicaid` |
| Office | Columbia County storefront office | Columbia County | `off-columbia-or-medicaid` |
| Office | Coos County storefront office | Coos County | `off-coos-or-medicaid` |
| Office | Crook County storefront office | Crook County | `off-crook-or-medicaid` |
| Office | Curry County storefront office | Curry County | `off-curry-or-medicaid` |
| Office | Deschutes County storefront office | Deschutes County | `off-deschutes-or-medicaid` |
| Office | Douglas County storefront office | Douglas County | `off-douglas-or-medicaid` |
| Office | Gilliam County storefront office | Gilliam County | `off-gilliam-or-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-or-medicaid` |
| Office | Harney County storefront office | Harney County | `off-harney-or-medicaid` |
| Office | Hood River County storefront office | Hood River County | `off-hood-river-or-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-or-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-or-medicaid` |
| Office | Josephine County storefront office | Josephine County | `off-josephine-or-medicaid` |
| Office | Klamath County storefront office | Klamath County | `off-klamath-or-medicaid` |
| Office | Lake County storefront office | Lake County | `off-lake-or-medicaid` |
| Office | Lane County storefront office | Lane County | `off-lane-or-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-or-medicaid` |
| Office | Linn County storefront office | Linn County | `off-linn-or-medicaid` |
| Office | Malheur County storefront office | Malheur County | `off-malheur-or-medicaid` |
| Office | Marion County storefront office | Marion County | `off-marion-or-medicaid` |
| Office | Morrow County storefront office | Morrow County | `off-morrow-or-medicaid` |
| Office | Multnomah County storefront office | Multnomah County | `off-multnomah-or-medicaid` |
| Office | Polk County storefront office | Polk County | `off-polk-or-medicaid` |
| Office | Sherman County storefront office | Sherman County | `off-sherman-or-medicaid` |
| Office | Tillamook County storefront office | Tillamook County | `off-tillamook-or-medicaid` |
| Office | Umatilla County storefront office | Umatilla County | `off-umatilla-or-medicaid` |
| Office | Union County storefront office | Union County | `off-union-or-medicaid` |
| Office | Wallowa County storefront office | Wallowa County | `off-wallowa-or-medicaid` |
| Office | Wasco County storefront office | Wasco County | `off-wasco-or-medicaid` |
| Office | Washington County storefront office | Washington County | `off-washington-or-medicaid` |
| Office | Wheeler County storefront office | Wheeler County | `off-wheeler-or-medicaid` |
| Office | Yamhill County storefront office | Yamhill County | `off-yamhill-or-medicaid` |
| School District | Multnomah Public Schools Special Education | Multnomah County | `sd-multnomah-or` |
| School District | Washington Public Schools Special Education | Washington County | `sd-washington-or` |
| School District | Baker County School District | Baker County | `sd-baker-or` |
| School District | Benton County School District | Benton County | `sd-benton-or` |
| School District | Clackamas County School District | Clackamas County | `sd-clackamas-or` |
| School District | Clatsop County School District | Clatsop County | `sd-clatsop-or` |
| School District | Columbia County School District | Columbia County | `sd-columbia-or` |
| School District | Coos County School District | Coos County | `sd-coos-or` |
| School District | Crook County School District | Crook County | `sd-crook-or` |
| School District | Curry County School District | Curry County | `sd-curry-or` |
| School District | Deschutes County School District | Deschutes County | `sd-deschutes-or` |
| School District | Douglas County School District | Douglas County | `sd-douglas-or` |
| School District | Gilliam County School District | Gilliam County | `sd-gilliam-or` |
| School District | Grant County School District | Grant County | `sd-grant-or` |
| ... | *and 58 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
