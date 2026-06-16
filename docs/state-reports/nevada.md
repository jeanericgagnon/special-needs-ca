# Data Provenance Report: Nevada (NV)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Nevada under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **44.6%** (Manual Review Rate: **55.43%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Nevada Medicaid`
- **Waiver Program Name**: `Nevada HCBS Waivers`
- **Personal Care Program**: `Nevada Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Nevada Aging and Disability Services Division`
- **State Education Agency**: `Nevada Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Nevada Early Intervention`
- **ABLE Savings Program**: `Nevada ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 17
- **County Social Service Storefronts**: 17
- **School Districts**: 17
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 51
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 77 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 41 records
- **Manual Review Backlog (Flagged)**: 51 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Nevada ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Nevada Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://dhcfp.nv.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Nevada Early Intervention Services** (State Program): Source URL: https://adsd.nv.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Nevada HCBS Waivers** (State Program): Source URL: https://adsd.nv.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Nevada residents.
- **Nevada Medicaid** (State Program): Source URL: https://dhcfp.nv.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Nevada Medicaid Personal Care** (State Program): Source URL: https://dhcfp.nv.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Nevada Self-Direction Services** (State Program): Source URL: https://adsd.nv.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Nevada Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Nevada Transition & Vocational Rehabilitation** (State Program): Source URL: https://adsd.nv.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Nevada)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Nevada Developmental Services Intake** (dd_intake): Website: https://dhhs.nevada.gov/dd | Phone: None | Status: `manual_review_required`
- **Nevada Early Intervention State Office** (early_intervention): Website: https://dhhs.nevada.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Carson City County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Churchill County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clark County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Elko County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Esmeralda County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Eureka County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Humboldt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lander County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lyon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mineral County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nye County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pershing County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Storey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washoe County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| White Pine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Carson City County storefront office | Carson City County | `off-carson-city-nv-medicaid` |
| Office | Churchill County storefront office | Churchill County | `off-churchill-nv-medicaid` |
| Office | Clark County storefront office | Clark County | `off-clark-nv-medicaid` |
| Office | Douglas County storefront office | Douglas County | `off-douglas-nv-medicaid` |
| Office | Elko County storefront office | Elko County | `off-elko-nv-medicaid` |
| Office | Esmeralda County storefront office | Esmeralda County | `off-esmeralda-nv-medicaid` |
| Office | Eureka County storefront office | Eureka County | `off-eureka-nv-medicaid` |
| Office | Humboldt County storefront office | Humboldt County | `off-humboldt-nv-medicaid` |
| Office | Lander County storefront office | Lander County | `off-lander-nv-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-nv-medicaid` |
| Office | Lyon County storefront office | Lyon County | `off-lyon-nv-medicaid` |
| Office | Mineral County storefront office | Mineral County | `off-mineral-nv-medicaid` |
| Office | Nye County storefront office | Nye County | `off-nye-nv-medicaid` |
| Office | Pershing County storefront office | Pershing County | `off-pershing-nv-medicaid` |
| Office | Storey County storefront office | Storey County | `off-storey-nv-medicaid` |
| Office | Washoe County storefront office | Washoe County | `off-washoe-nv-medicaid` |
| Office | White Pine County storefront office | White Pine County | `off-white-pine-nv-medicaid` |
| School District | Clark Public Schools Special Education | Clark County | `sd-clark-nv` |
| School District | Washoe Public Schools Special Education | Washoe County | `sd-washoe-nv` |
| School District | Carson City County School District | Carson City County | `sd-carson-city-nv` |
| School District | Churchill County School District | Churchill County | `sd-churchill-nv` |
| School District | Douglas County School District | Douglas County | `sd-douglas-nv` |
| School District | Elko County School District | Elko County | `sd-elko-nv` |
| School District | Esmeralda County School District | Esmeralda County | `sd-esmeralda-nv` |
| School District | Eureka County School District | Eureka County | `sd-eureka-nv` |
| School District | Humboldt County School District | Humboldt County | `sd-humboldt-nv` |
| School District | Lander County School District | Lander County | `sd-lander-nv` |
| School District | Lincoln County School District | Lincoln County | `sd-lincoln-nv` |
| School District | Lyon County School District | Lyon County | `sd-lyon-nv` |
| School District | Mineral County School District | Mineral County | `sd-mineral-nv` |
| School District | Nye County School District | Nye County | `sd-nye-nv` |
| School District | Pershing County School District | Pershing County | `sd-pershing-nv` |
| School District | Storey County School District | Storey County | `sd-storey-nv` |
| School District | White Pine County School District | White Pine County | `sd-white-pine-nv` |
| Nonprofit | The Arc of Nevada | Carson City County | `nv-np-arc-carson-city-nv` |
| Nonprofit | The Arc of Nevada | Churchill County | `nv-np-arc-churchill-nv` |
| Nonprofit | The Arc of Nevada | Clark County | `nv-np-arc-clark-nv` |
| Nonprofit | The Arc of Nevada | Douglas County | `nv-np-arc-douglas-nv` |
| Nonprofit | The Arc of Nevada | Elko County | `nv-np-arc-elko-nv` |
| Nonprofit | The Arc of Nevada | Esmeralda County | `nv-np-arc-esmeralda-nv` |
| Nonprofit | The Arc of Nevada | Eureka County | `nv-np-arc-eureka-nv` |
| Nonprofit | The Arc of Nevada | Humboldt County | `nv-np-arc-humboldt-nv` |
| Nonprofit | The Arc of Nevada | Lander County | `nv-np-arc-lander-nv` |
| Nonprofit | The Arc of Nevada | Lincoln County | `nv-np-arc-lincoln-nv` |
| Nonprofit | The Arc of Nevada | Lyon County | `nv-np-arc-lyon-nv` |
| Nonprofit | The Arc of Nevada | Mineral County | `nv-np-arc-mineral-nv` |
| Nonprofit | The Arc of Nevada | Nye County | `nv-np-arc-nye-nv` |
| Nonprofit | The Arc of Nevada | Pershing County | `nv-np-arc-pershing-nv` |
| Nonprofit | The Arc of Nevada | Storey County | `nv-np-arc-storey-nv` |
| Nonprofit | The Arc of Nevada | Washoe County | `nv-np-arc-washoe-nv` |
| ... | *and 1 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
