# Data Provenance Report: Maryland (MD)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Maryland under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **43.3%** (Manual Review Rate: **56.69%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Maryland Medicaid`
- **Waiver Program Name**: `Maryland HCBS Waivers`
- **Personal Care Program**: `Maryland Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Maryland Developmental Disabilities Administration`
- **State Education Agency**: `Maryland Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Maryland Early Intervention`
- **ABLE Savings Program**: `Maryland ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 24
- **County Social Service Storefronts**: 24
- **School Districts**: 24
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 72
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 105 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 55 records
- **Manual Review Backlog (Flagged)**: 72 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Maryland ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Maryland Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://health.maryland.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Maryland Early Intervention Services** (State Program): Source URL: https://dda.health.maryland.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Maryland HCBS Waivers** (State Program): Source URL: https://dda.health.maryland.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Maryland residents.
- **Maryland Medicaid** (State Program): Source URL: https://health.maryland.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Maryland Medicaid Personal Care** (State Program): Source URL: https://health.maryland.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Maryland Self-Direction Services** (State Program): Source URL: https://dda.health.maryland.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Maryland Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Maryland Transition & Vocational Rehabilitation** (State Program): Source URL: https://dda.health.maryland.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Maryland)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Maryland Developmental Services Intake** (dd_intake): Website: https://dhhs.maryland.gov/dd | Phone: None | Status: `manual_review_required`
- **Maryland Early Intervention State Office** (early_intervention): Website: https://dhhs.maryland.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Allegany County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Anne Arundel County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Baltimore City County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Baltimore County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calvert County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Caroline County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cecil County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Charles County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dorchester County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Frederick County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Garrett County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Howard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kent County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Prince George's County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Queen Anne's County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Somerset County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Mary's County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Talbot County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wicomico County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Worcester County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Allegany County storefront office | Allegany County | `off-allegany-md-medicaid` |
| Office | Anne Arundel County storefront office | Anne Arundel County | `off-anne-arundel-md-medicaid` |
| Office | Baltimore County storefront office | Baltimore County | `off-baltimore-md-medicaid` |
| Office | Baltimore City County storefront office | Baltimore City County | `off-baltimore-city-md-medicaid` |
| Office | Calvert County storefront office | Calvert County | `off-calvert-md-medicaid` |
| Office | Caroline County storefront office | Caroline County | `off-caroline-md-medicaid` |
| Office | Carroll County storefront office | Carroll County | `off-carroll-md-medicaid` |
| Office | Cecil County storefront office | Cecil County | `off-cecil-md-medicaid` |
| Office | Charles County storefront office | Charles County | `off-charles-md-medicaid` |
| Office | Dorchester County storefront office | Dorchester County | `off-dorchester-md-medicaid` |
| Office | Frederick County storefront office | Frederick County | `off-frederick-md-medicaid` |
| Office | Garrett County storefront office | Garrett County | `off-garrett-md-medicaid` |
| Office | Harford County storefront office | Harford County | `off-harford-md-medicaid` |
| Office | Howard County storefront office | Howard County | `off-howard-md-medicaid` |
| Office | Kent County storefront office | Kent County | `off-kent-md-medicaid` |
| Office | Montgomery County storefront office | Montgomery County | `off-montgomery-md-medicaid` |
| Office | Prince George's County storefront office | Prince George's County | `off-prince-george-s-md-medicaid` |
| Office | Queen Anne's County storefront office | Queen Anne's County | `off-queen-anne-s-md-medicaid` |
| Office | Somerset County storefront office | Somerset County | `off-somerset-md-medicaid` |
| Office | St. Mary's County storefront office | St. Mary's County | `off-st-mary-s-md-medicaid` |
| Office | Talbot County storefront office | Talbot County | `off-talbot-md-medicaid` |
| Office | Washington County storefront office | Washington County | `off-washington-md-medicaid` |
| Office | Wicomico County storefront office | Wicomico County | `off-wicomico-md-medicaid` |
| Office | Worcester County storefront office | Worcester County | `off-worcester-md-medicaid` |
| School District | Montgomery Public Schools Special Education | Montgomery County | `sd-montgomery-md` |
| School District | Prince George's Public Schools Special Education | Prince George's County | `sd-prince-george-s-md` |
| School District | Allegany County School District | Allegany County | `sd-allegany-md` |
| School District | Anne Arundel County School District | Anne Arundel County | `sd-anne-arundel-md` |
| School District | Baltimore County School District | Baltimore County | `sd-baltimore-md` |
| School District | Baltimore City County School District | Baltimore City County | `sd-baltimore-city-md` |
| School District | Calvert County School District | Calvert County | `sd-calvert-md` |
| School District | Caroline County School District | Caroline County | `sd-caroline-md` |
| School District | Carroll County School District | Carroll County | `sd-carroll-md` |
| School District | Cecil County School District | Cecil County | `sd-cecil-md` |
| School District | Charles County School District | Charles County | `sd-charles-md` |
| School District | Dorchester County School District | Dorchester County | `sd-dorchester-md` |
| School District | Frederick County School District | Frederick County | `sd-frederick-md` |
| School District | Garrett County School District | Garrett County | `sd-garrett-md` |
| School District | Harford County School District | Harford County | `sd-harford-md` |
| School District | Howard County School District | Howard County | `sd-howard-md` |
| School District | Kent County School District | Kent County | `sd-kent-md` |
| School District | Queen Anne's County School District | Queen Anne's County | `sd-queen-anne-s-md` |
| School District | Somerset County School District | Somerset County | `sd-somerset-md` |
| School District | St. Mary's County School District | St. Mary's County | `sd-st-mary-s-md` |
| School District | Talbot County School District | Talbot County | `sd-talbot-md` |
| School District | Washington County School District | Washington County | `sd-washington-md` |
| School District | Wicomico County School District | Wicomico County | `sd-wicomico-md` |
| School District | Worcester County School District | Worcester County | `sd-worcester-md` |
| Nonprofit | The Arc of Maryland | Allegany County | `md-np-arc-allegany-md` |
| Nonprofit | The Arc of Maryland | Anne Arundel County | `md-np-arc-anne-arundel-md` |
| ... | *and 22 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
