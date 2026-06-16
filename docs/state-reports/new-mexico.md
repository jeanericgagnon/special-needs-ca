# Data Provenance Report: New Mexico (NM)

This report details the data sources, records count, trust classifications, and launch readiness for the State of New Mexico under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **42.4%** (Manual Review Rate: **57.56%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `New Mexico Medicaid`
- **Waiver Program Name**: `New Mexico HCBS Waivers`
- **Personal Care Program**: `New Mexico Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `New Mexico Developmental Disabilities Division`
- **State Education Agency**: `New Mexico Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `New Mexico Early Intervention`
- **ABLE Savings Program**: `New Mexico ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 33
- **County Social Service Storefronts**: 33
- **School Districts**: 33
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 99
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 141 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 73 records
- **Manual Review Backlog (Flagged)**: 99 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **New Mexico ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **New Mexico Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.hsd.state.nm.us/mad
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **New Mexico Early Intervention Services** (State Program): Source URL: https://www.nmhealth.org/about/ddsd
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **New Mexico HCBS Waivers** (State Program): Source URL: https://www.nmhealth.org/about/ddsd/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for New Mexico residents.
- **New Mexico Medicaid** (State Program): Source URL: https://www.hsd.state.nm.us/mad
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **New Mexico Medicaid Personal Care** (State Program): Source URL: https://www.hsd.state.nm.us/mad
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **New Mexico Self-Direction Services** (State Program): Source URL: https://www.nmhealth.org/about/ddsd
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **New Mexico Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **New Mexico Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.nmhealth.org/about/ddsd
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (New Mexico)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **New Mexico Developmental Services Intake** (dd_intake): Website: https://dhhs.new-mexico.gov/dd | Phone: None | Status: `manual_review_required`
- **New Mexico Early Intervention State Office** (early_intervention): Website: https://dhhs.new-mexico.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Bernalillo County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Catron County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chaves County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cibola County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Colfax County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Curry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| De Baca County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Doña Ana County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Eddy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Guadalupe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harding County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hidalgo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lea County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Los Alamos County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Luna County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McKinley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mora County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Otero County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Quay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rio Arriba County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Roosevelt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| San Juan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| San Miguel County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sandoval County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Santa Fe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sierra County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Socorro County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Taos County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Torrance County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Valencia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Bernalillo County storefront office | Bernalillo County | `off-bernalillo-nm-medicaid` |
| Office | Catron County storefront office | Catron County | `off-catron-nm-medicaid` |
| Office | Chaves County storefront office | Chaves County | `off-chaves-nm-medicaid` |
| Office | Cibola County storefront office | Cibola County | `off-cibola-nm-medicaid` |
| Office | Colfax County storefront office | Colfax County | `off-colfax-nm-medicaid` |
| Office | Curry County storefront office | Curry County | `off-curry-nm-medicaid` |
| Office | De Baca County storefront office | De Baca County | `off-de-baca-nm-medicaid` |
| Office | Doña Ana County storefront office | Doña Ana County | `off-do-a-ana-nm-medicaid` |
| Office | Eddy County storefront office | Eddy County | `off-eddy-nm-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-nm-medicaid` |
| Office | Guadalupe County storefront office | Guadalupe County | `off-guadalupe-nm-medicaid` |
| Office | Harding County storefront office | Harding County | `off-harding-nm-medicaid` |
| Office | Hidalgo County storefront office | Hidalgo County | `off-hidalgo-nm-medicaid` |
| Office | Lea County storefront office | Lea County | `off-lea-nm-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-nm-medicaid` |
| Office | Los Alamos County storefront office | Los Alamos County | `off-los-alamos-nm-medicaid` |
| Office | Luna County storefront office | Luna County | `off-luna-nm-medicaid` |
| Office | McKinley County storefront office | McKinley County | `off-mckinley-nm-medicaid` |
| Office | Mora County storefront office | Mora County | `off-mora-nm-medicaid` |
| Office | Otero County storefront office | Otero County | `off-otero-nm-medicaid` |
| Office | Quay County storefront office | Quay County | `off-quay-nm-medicaid` |
| Office | Rio Arriba County storefront office | Rio Arriba County | `off-rio-arriba-nm-medicaid` |
| Office | Roosevelt County storefront office | Roosevelt County | `off-roosevelt-nm-medicaid` |
| Office | Sandoval County storefront office | Sandoval County | `off-sandoval-nm-medicaid` |
| Office | San Juan County storefront office | San Juan County | `off-san-juan-nm-medicaid` |
| Office | San Miguel County storefront office | San Miguel County | `off-san-miguel-nm-medicaid` |
| Office | Santa Fe County storefront office | Santa Fe County | `off-santa-fe-nm-medicaid` |
| Office | Sierra County storefront office | Sierra County | `off-sierra-nm-medicaid` |
| Office | Socorro County storefront office | Socorro County | `off-socorro-nm-medicaid` |
| Office | Taos County storefront office | Taos County | `off-taos-nm-medicaid` |
| Office | Torrance County storefront office | Torrance County | `off-torrance-nm-medicaid` |
| Office | Union County storefront office | Union County | `off-union-nm-medicaid` |
| Office | Valencia County storefront office | Valencia County | `off-valencia-nm-medicaid` |
| School District | Bernalillo Public Schools Special Education | Bernalillo County | `sd-bernalillo-nm` |
| School District | Doña Ana Public Schools Special Education | Doña Ana County | `sd-do-a-ana-nm` |
| School District | Catron County School District | Catron County | `sd-catron-nm` |
| School District | Chaves County School District | Chaves County | `sd-chaves-nm` |
| School District | Cibola County School District | Cibola County | `sd-cibola-nm` |
| School District | Colfax County School District | Colfax County | `sd-colfax-nm` |
| School District | Curry County School District | Curry County | `sd-curry-nm` |
| School District | De Baca County School District | De Baca County | `sd-de-baca-nm` |
| School District | Eddy County School District | Eddy County | `sd-eddy-nm` |
| School District | Grant County School District | Grant County | `sd-grant-nm` |
| School District | Guadalupe County School District | Guadalupe County | `sd-guadalupe-nm` |
| School District | Harding County School District | Harding County | `sd-harding-nm` |
| School District | Hidalgo County School District | Hidalgo County | `sd-hidalgo-nm` |
| School District | Lea County School District | Lea County | `sd-lea-nm` |
| School District | Lincoln County School District | Lincoln County | `sd-lincoln-nm` |
| School District | Los Alamos County School District | Los Alamos County | `sd-los-alamos-nm` |
| School District | Luna County School District | Luna County | `sd-luna-nm` |
| ... | *and 49 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
