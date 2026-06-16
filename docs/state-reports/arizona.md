# Data Provenance Report: Arizona (AZ)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Arizona under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **81.7%** (Manual Review Rate: **18.29%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Arizona Medicaid`
- **Waiver Program Name**: `Arizona HCBS Waivers`
- **Personal Care Program**: `AHCCCS Medical Assistance`
- **Developmental Disability (DD) Agency**: `Arizona Division of Developmental Disabilities`
- **State Education Agency**: `Arizona Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Arizona Early Intervention`
- **ABLE Savings Program**: `Arizona ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 15
- **County Social Service Storefronts**: 15
- **School Districts**: 15
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 45
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 67 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 67 records
- **Manual Review Backlog (Flagged)**: 15 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **AHCCCS Medical Assistance** (State Program): Source URL: https://www.azahcccs.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Arizona ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Arizona Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.azahcccs.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Arizona Early Intervention Services** (State Program): Source URL: https://des.az.gov/ddd
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Arizona HCBS Waivers** (State Program): Source URL: https://www.azahcccs.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Arizona residents.
- **Arizona Medicaid** (State Program): Source URL: https://www.azahcccs.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Arizona Self-Direction Services** (State Program): Source URL: https://des.az.gov/ddd
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Arizona Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Arizona Transition & Vocational Rehabilitation** (State Program): Source URL: https://des.az.gov/ddd
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Arizona)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Arizona Developmental Services Intake** (dd_intake): Website: https://dhhs.arizona.gov/dd | Phone: None | Status: `manual_review_required`
- **Arizona Early Intervention State Office** (early_intervention): Website: https://dhhs.arizona.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Apache County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cochise County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Coconino County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gila County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Graham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greenlee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| La Paz County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Maricopa County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Mohave County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Navajo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pima County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Pinal County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Santa Cruz County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yavapai County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yuma County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Nonprofit | The Arc of Arizona | Apache County | `az-np-arc-apache-az` |
| Nonprofit | The Arc of Arizona | Cochise County | `az-np-arc-cochise-az` |
| Nonprofit | The Arc of Arizona | Coconino County | `az-np-arc-coconino-az` |
| Nonprofit | The Arc of Arizona | Gila County | `az-np-arc-gila-az` |
| Nonprofit | The Arc of Arizona | Graham County | `az-np-arc-graham-az` |
| Nonprofit | The Arc of Arizona | Greenlee County | `az-np-arc-greenlee-az` |
| Nonprofit | The Arc of Arizona | La Paz County | `az-np-arc-la-paz-az` |
| Nonprofit | The Arc of Arizona | Maricopa County | `az-np-arc-maricopa-az` |
| Nonprofit | The Arc of Arizona | Mohave County | `az-np-arc-mohave-az` |
| Nonprofit | The Arc of Arizona | Navajo County | `az-np-arc-navajo-az` |
| Nonprofit | The Arc of Arizona | Pima County | `az-np-arc-pima-az` |
| Nonprofit | The Arc of Arizona | Pinal County | `az-np-arc-pinal-az` |
| Nonprofit | The Arc of Arizona | Santa Cruz County | `az-np-arc-santa-cruz-az` |
| Nonprofit | The Arc of Arizona | Yavapai County | `az-np-arc-yavapai-az` |
| Nonprofit | The Arc of Arizona | Yuma County | `az-np-arc-yuma-az` |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
