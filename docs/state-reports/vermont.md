# Data Provenance Report: Vermont (VT)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Vermont under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **45.5%** (Manual Review Rate: **54.55%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Vermont Medicaid`
- **Waiver Program Name**: `Vermont HCBS Waivers`
- **Personal Care Program**: `Vermont Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Vermont Developmental Disabilities Services Division`
- **State Education Agency**: `Vermont Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Vermont Early Intervention`
- **ABLE Savings Program**: `Vermont ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 14
- **County Social Service Storefronts**: 14
- **School Districts**: 14
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 42
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 65 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 35 records
- **Manual Review Backlog (Flagged)**: 42 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **SSI for Children (Vermont)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...
- **Vermont ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Vermont Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://dvha.vermont.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Vermont Early Intervention Services** (State Program): Source URL: https://ddsd.vermont.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Vermont HCBS Waivers** (State Program): Source URL: https://ddsd.vermont.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Vermont residents.
- **Vermont Medicaid** (State Program): Source URL: https://dvha.vermont.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Vermont Medicaid Personal Care** (State Program): Source URL: https://dvha.vermont.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Vermont Self-Direction Services** (State Program): Source URL: https://ddsd.vermont.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Vermont Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Vermont Transition & Vocational Rehabilitation** (State Program): Source URL: https://ddsd.vermont.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Vermont Developmental Services Intake** (dd_intake): Website: https://dhhs.vermont.gov/dd | Phone: None | Status: `manual_review_required`
- **Vermont Early Intervention State Office** (early_intervention): Website: https://dhhs.vermont.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Addison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bennington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Caledonia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chittenden County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Essex County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grand Isle County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lamoille County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Orange County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Orleans County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rutland County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Windham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Windsor County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Addison County storefront office | Addison County | `off-addison-vt-medicaid` |
| Office | Bennington County storefront office | Bennington County | `off-bennington-vt-medicaid` |
| Office | Caledonia County storefront office | Caledonia County | `off-caledonia-vt-medicaid` |
| Office | Chittenden County storefront office | Chittenden County | `off-chittenden-vt-medicaid` |
| Office | Essex County storefront office | Essex County | `off-essex-vt-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-vt-medicaid` |
| Office | Grand Isle County storefront office | Grand Isle County | `off-grand-isle-vt-medicaid` |
| Office | Lamoille County storefront office | Lamoille County | `off-lamoille-vt-medicaid` |
| Office | Orange County storefront office | Orange County | `off-orange-vt-medicaid` |
| Office | Orleans County storefront office | Orleans County | `off-orleans-vt-medicaid` |
| Office | Rutland County storefront office | Rutland County | `off-rutland-vt-medicaid` |
| Office | Washington County storefront office | Washington County | `off-washington-vt-medicaid` |
| Office | Windham County storefront office | Windham County | `off-windham-vt-medicaid` |
| Office | Windsor County storefront office | Windsor County | `off-windsor-vt-medicaid` |
| School District | Chittenden Public Schools Special Education | Chittenden County | `sd-chittenden-vt` |
| School District | Rutland Public Schools Special Education | Rutland County | `sd-rutland-vt` |
| School District | Addison County School District | Addison County | `sd-addison-vt` |
| School District | Bennington County School District | Bennington County | `sd-bennington-vt` |
| School District | Caledonia County School District | Caledonia County | `sd-caledonia-vt` |
| School District | Essex County School District | Essex County | `sd-essex-vt` |
| School District | Franklin County School District | Franklin County | `sd-franklin-vt` |
| School District | Grand Isle County School District | Grand Isle County | `sd-grand-isle-vt` |
| School District | Lamoille County School District | Lamoille County | `sd-lamoille-vt` |
| School District | Orange County School District | Orange County | `sd-orange-vt` |
| School District | Orleans County School District | Orleans County | `sd-orleans-vt` |
| School District | Washington County School District | Washington County | `sd-washington-vt` |
| School District | Windham County School District | Windham County | `sd-windham-vt` |
| School District | Windsor County School District | Windsor County | `sd-windsor-vt` |
| Nonprofit | The Arc of Vermont | Addison County | `vt-np-arc-addison-vt` |
| Nonprofit | The Arc of Vermont | Bennington County | `vt-np-arc-bennington-vt` |
| Nonprofit | The Arc of Vermont | Caledonia County | `vt-np-arc-caledonia-vt` |
| Nonprofit | The Arc of Vermont | Chittenden County | `vt-np-arc-chittenden-vt` |
| Nonprofit | The Arc of Vermont | Essex County | `vt-np-arc-essex-vt` |
| Nonprofit | The Arc of Vermont | Franklin County | `vt-np-arc-franklin-vt` |
| Nonprofit | The Arc of Vermont | Grand Isle County | `vt-np-arc-grand-isle-vt` |
| Nonprofit | The Arc of Vermont | Lamoille County | `vt-np-arc-lamoille-vt` |
| Nonprofit | The Arc of Vermont | Orange County | `vt-np-arc-orange-vt` |
| Nonprofit | The Arc of Vermont | Orleans County | `vt-np-arc-orleans-vt` |
| Nonprofit | The Arc of Vermont | Rutland County | `vt-np-arc-rutland-vt` |
| Nonprofit | The Arc of Vermont | Washington County | `vt-np-arc-washington-vt` |
| Nonprofit | The Arc of Vermont | Windham County | `vt-np-arc-windham-vt` |
| Nonprofit | The Arc of Vermont | Windsor County | `vt-np-arc-windsor-vt` |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
