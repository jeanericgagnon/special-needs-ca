# Data Provenance Report: Maine (ME)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Maine under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **44.8%** (Manual Review Rate: **55.17%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Maine Medicaid`
- **Waiver Program Name**: `Maine HCBS Waivers`
- **Personal Care Program**: `MaineCare Personal Care Services`
- **Developmental Disability (DD) Agency**: `Maine Office of Aging and Disability Services`
- **State Education Agency**: `Maine Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Maine Early Intervention`
- **ABLE Savings Program**: `Maine ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 16
- **County Social Service Storefronts**: 16
- **School Districts**: 16
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 48
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 73 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 39 records
- **Manual Review Backlog (Flagged)**: 48 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Maine ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Maine Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.maine.gov/dhhs/oms
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Maine Early Intervention Services** (State Program): Source URL: https://www.maine.gov/dhhs/oads
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Maine HCBS Waivers** (State Program): Source URL: https://www.maine.gov/dhhs/oads/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Maine residents.
- **Maine Medicaid** (State Program): Source URL: https://www.maine.gov/dhhs/oms
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Maine Self-Direction Services** (State Program): Source URL: https://www.maine.gov/dhhs/oads
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Maine Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Maine Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.maine.gov/dhhs/oads
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **MaineCare Personal Care Services** (State Program): Source URL: https://www.maine.gov/dhhs/oms
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **SSI for Children (Maine)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Maine Developmental Services Intake** (dd_intake): Website: https://dhhs.maine.gov/dd | Phone: None | Status: `manual_review_required`
- **Maine Early Intervention State Office** (early_intervention): Website: https://dhhs.maine.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Androscoggin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Aroostook County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cumberland County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hancock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kennebec County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Knox County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oxford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Penobscot County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Piscataquis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sagadahoc County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Somerset County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Waldo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| York County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |

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
| Office | Androscoggin County storefront office | Androscoggin County | `off-androscoggin-me-medicaid` |
| Office | Aroostook County storefront office | Aroostook County | `off-aroostook-me-medicaid` |
| Office | Cumberland County storefront office | Cumberland County | `off-cumberland-me-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-me-medicaid` |
| Office | Hancock County storefront office | Hancock County | `off-hancock-me-medicaid` |
| Office | Kennebec County storefront office | Kennebec County | `off-kennebec-me-medicaid` |
| Office | Knox County storefront office | Knox County | `off-knox-me-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-me-medicaid` |
| Office | Oxford County storefront office | Oxford County | `off-oxford-me-medicaid` |
| Office | Penobscot County storefront office | Penobscot County | `off-penobscot-me-medicaid` |
| Office | Piscataquis County storefront office | Piscataquis County | `off-piscataquis-me-medicaid` |
| Office | Sagadahoc County storefront office | Sagadahoc County | `off-sagadahoc-me-medicaid` |
| Office | Somerset County storefront office | Somerset County | `off-somerset-me-medicaid` |
| Office | Waldo County storefront office | Waldo County | `off-waldo-me-medicaid` |
| Office | Washington County storefront office | Washington County | `off-washington-me-medicaid` |
| Office | York County storefront office | York County | `off-york-me-medicaid` |
| School District | Cumberland Public Schools Special Education | Cumberland County | `sd-cumberland-me` |
| School District | York Public Schools Special Education | York County | `sd-york-me` |
| School District | Androscoggin County School District | Androscoggin County | `sd-androscoggin-me` |
| School District | Aroostook County School District | Aroostook County | `sd-aroostook-me` |
| School District | Franklin County School District | Franklin County | `sd-franklin-me` |
| School District | Hancock County School District | Hancock County | `sd-hancock-me` |
| School District | Kennebec County School District | Kennebec County | `sd-kennebec-me` |
| School District | Knox County School District | Knox County | `sd-knox-me` |
| School District | Lincoln County School District | Lincoln County | `sd-lincoln-me` |
| School District | Oxford County School District | Oxford County | `sd-oxford-me` |
| School District | Penobscot County School District | Penobscot County | `sd-penobscot-me` |
| School District | Piscataquis County School District | Piscataquis County | `sd-piscataquis-me` |
| School District | Sagadahoc County School District | Sagadahoc County | `sd-sagadahoc-me` |
| School District | Somerset County School District | Somerset County | `sd-somerset-me` |
| School District | Waldo County School District | Waldo County | `sd-waldo-me` |
| School District | Washington County School District | Washington County | `sd-washington-me` |
| Nonprofit | The Arc of Maine | Androscoggin County | `me-np-arc-androscoggin-me` |
| Nonprofit | The Arc of Maine | Aroostook County | `me-np-arc-aroostook-me` |
| Nonprofit | The Arc of Maine | Cumberland County | `me-np-arc-cumberland-me` |
| Nonprofit | The Arc of Maine | Franklin County | `me-np-arc-franklin-me` |
| Nonprofit | The Arc of Maine | Hancock County | `me-np-arc-hancock-me` |
| Nonprofit | The Arc of Maine | Kennebec County | `me-np-arc-kennebec-me` |
| Nonprofit | The Arc of Maine | Knox County | `me-np-arc-knox-me` |
| Nonprofit | The Arc of Maine | Lincoln County | `me-np-arc-lincoln-me` |
| Nonprofit | The Arc of Maine | Oxford County | `me-np-arc-oxford-me` |
| Nonprofit | The Arc of Maine | Penobscot County | `me-np-arc-penobscot-me` |
| Nonprofit | The Arc of Maine | Piscataquis County | `me-np-arc-piscataquis-me` |
| Nonprofit | The Arc of Maine | Sagadahoc County | `me-np-arc-sagadahoc-me` |
| Nonprofit | The Arc of Maine | Somerset County | `me-np-arc-somerset-me` |
| Nonprofit | The Arc of Maine | Waldo County | `me-np-arc-waldo-me` |
| Nonprofit | The Arc of Maine | Washington County | `me-np-arc-washington-me` |
| Nonprofit | The Arc of Maine | York County | `me-np-arc-york-me` |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
