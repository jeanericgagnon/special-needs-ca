# Data Provenance Report: Delaware (DE)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Delaware under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **31.8%** (Manual Review Rate: **68.18%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Delaware Medicaid`
- **Waiver Program Name**: `Delaware HCBS Waivers`
- **Personal Care Program**: `Delaware Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Delaware Division of Developmental Disabilities Services`
- **State Education Agency**: `Delaware Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Delaware Early Intervention`
- **ABLE Savings Program**: `Delaware ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 3
- **County Social Service Storefronts**: 3
- **School Districts**: 3
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 9
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 21 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 7 records
- **Manual Review Backlog (Flagged)**: 15 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Delaware ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Delaware Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://dhss.delaware.gov/dmma
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Delaware Early Intervention Services** (State Program): Source URL: https://dhss.delaware.gov/ddds
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Delaware HCBS Waivers** (State Program): Source URL: https://dhss.delaware.gov/ddds/hcbs/eligibility.html
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Delaware residents.
- **Delaware Medicaid** (State Program): Source URL: https://dhss.delaware.gov/dmma
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Delaware Medicaid Personal Care** (State Program): Source URL: https://dhss.delaware.gov/dmma
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Delaware Self-Direction Services** (State Program): Source URL: https://dhss.delaware.gov/ddds
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Delaware Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Delaware Transition & Vocational Rehabilitation** (State Program): Source URL: https://dhss.delaware.gov/ddds
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Delaware)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Delaware Developmental Services Intake** (dd_intake): Website: https://dhhs.delaware.gov/dd | Phone: None | Status: `manual_review_required`
- **Delaware Early Intervention State Office** (early_intervention): Website: https://dhhs.delaware.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Kent County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| New Castle County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Sussex County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |

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
| Office | Kent County storefront office | Kent County | `off-kent-de-medicaid` |
| Office | New Castle County storefront office | New Castle County | `off-new-castle-de-medicaid` |
| Office | Sussex County storefront office | Sussex County | `off-sussex-de-medicaid` |
| School District | New Castle Public Schools Special Education | New Castle County | `sd-new-castle-de` |
| School District | Sussex Public Schools Special Education | Sussex County | `sd-sussex-de` |
| School District | Kent County School District | Kent County | `sd-kent-de` |
| Nonprofit | The Arc of Delaware | Kent County | `de-np-arc-kent-de` |
| Nonprofit | The Arc of Delaware | New Castle County | `de-np-arc-new-castle-de` |
| Nonprofit | The Arc of Delaware | Sussex County | `de-np-arc-sussex-de` |
| IEP Advocate | Delaware Protection & Advocacy Legal Aid | Kent County | `de-adv-legal-statewide` |
| IEP Advocate | Delaware Protection & Advocacy Legal Aid | New Castle County | `de-adv-legal-statewide` |
| IEP Advocate | Delaware Protection & Advocacy Legal Aid | Sussex County | `de-adv-legal-statewide` |
| IEP Advocate | Delaware Parent Training Network | Kent County | `de-adv-parent-statewide` |
| IEP Advocate | Delaware Parent Training Network | New Castle County | `de-adv-parent-statewide` |
| IEP Advocate | Delaware Parent Training Network | Sussex County | `de-adv-parent-statewide` |
| IEP Advocate | New Castle Special Needs Advocacy Group | New Castle County | `de-adv-local-legal-new-castle-de` |
| IEP Advocate | New Castle Developmental Therapy Center | New Castle County | `de-prov-local-therapy-new-castle-de` |
| IEP Advocate | Sussex Special Needs Advocacy Group | Sussex County | `de-adv-local-legal-sussex-de` |
| IEP Advocate | Sussex Developmental Therapy Center | Sussex County | `de-prov-local-therapy-sussex-de` |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
