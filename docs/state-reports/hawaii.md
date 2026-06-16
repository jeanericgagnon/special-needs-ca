# Data Provenance Report: Hawaii (HI)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Hawaii under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **53.1%** (Manual Review Rate: **46.88%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Hawaii Medicaid`
- **Waiver Program Name**: `Hawaii HCBS Waivers`
- **Personal Care Program**: `Hawaii Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Hawaii Developmental Disabilities Division`
- **State Education Agency**: `Hawaii Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Hawaii Early Intervention`
- **ABLE Savings Program**: `Hawaii ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 5
- **County Social Service Storefronts**: 5
- **School Districts**: 5
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 15
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 29 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 17 records
- **Manual Review Backlog (Flagged)**: 15 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Hawaii ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Hawaii Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://medquest.hawaii.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Hawaii Early Intervention Services** (State Program): Source URL: https://health.hawaii.gov/ddd
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Hawaii HCBS Waivers** (State Program): Source URL: https://health.hawaii.gov/ddd/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Hawaii residents.
- **Hawaii Medicaid** (State Program): Source URL: https://medquest.hawaii.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Hawaii Medicaid Personal Care** (State Program): Source URL: https://medquest.hawaii.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Hawaii Self-Direction Services** (State Program): Source URL: https://health.hawaii.gov/ddd
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Hawaii Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Hawaii Transition & Vocational Rehabilitation** (State Program): Source URL: https://health.hawaii.gov/ddd
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Hawaii)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Hawaii Developmental Services Intake** (dd_intake): Website: https://dhhs.hawaii.gov/dd | Phone: None | Status: `manual_review_required`
- **Hawaii Early Intervention State Office** (early_intervention): Website: https://dhhs.hawaii.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Hawai'i County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Honolulu County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Kalawao County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kauai County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Maui County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Hawai'i County storefront office | Hawai'i County | `off-hawai-i-hi-medicaid` |
| Office | Honolulu County storefront office | Honolulu County | `off-honolulu-hi-medicaid` |
| Office | Kalawao County storefront office | Kalawao County | `off-kalawao-hi-medicaid` |
| Office | Kauai County storefront office | Kauai County | `off-kauai-hi-medicaid` |
| Office | Maui County storefront office | Maui County | `off-maui-hi-medicaid` |
| School District | Hawai'i Public Schools Special Education | Hawai'i County | `sd-hawai-i-hi` |
| School District | Honolulu Public Schools Special Education | Honolulu County | `sd-honolulu-hi` |
| School District | Kalawao County School District | Kalawao County | `sd-kalawao-hi` |
| School District | Kauai County School District | Kauai County | `sd-kauai-hi` |
| School District | Maui County School District | Maui County | `sd-maui-hi` |
| Nonprofit | The Arc of Hawaii | Hawai'i County | `hi-np-arc-hawai-i-hi` |
| Nonprofit | The Arc of Hawaii | Honolulu County | `hi-np-arc-honolulu-hi` |
| Nonprofit | The Arc of Hawaii | Kalawao County | `hi-np-arc-kalawao-hi` |
| Nonprofit | The Arc of Hawaii | Kauai County | `hi-np-arc-kauai-hi` |
| Nonprofit | The Arc of Hawaii | Maui County | `hi-np-arc-maui-hi` |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
