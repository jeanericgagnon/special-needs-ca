# Data Provenance Report: Utah (UT)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Utah under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **42.8%** (Manual Review Rate: **57.24%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Utah Medicaid`
- **Waiver Program Name**: `Utah HCBS Waivers`
- **Personal Care Program**: `Utah Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Utah Division of Services for People with Disabilities`
- **State Education Agency**: `Utah Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Utah Early Intervention`
- **ABLE Savings Program**: `Utah ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 29
- **County Social Service Storefronts**: 29
- **School Districts**: 29
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 87
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 125 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 65 records
- **Manual Review Backlog (Flagged)**: 87 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **SSI for Children (Utah)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...
- **Utah ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Utah Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://medicaid.utah.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Utah Early Intervention Services** (State Program): Source URL: https://dspd.utah.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Utah HCBS Waivers** (State Program): Source URL: https://dspd.utah.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Utah residents.
- **Utah Medicaid** (State Program): Source URL: https://medicaid.utah.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Utah Medicaid Personal Care** (State Program): Source URL: https://medicaid.utah.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Utah Self-Direction Services** (State Program): Source URL: https://dspd.utah.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Utah Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Utah Transition & Vocational Rehabilitation** (State Program): Source URL: https://dspd.utah.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Utah Developmental Services Intake** (dd_intake): Website: https://dhhs.utah.gov/dd | Phone: None | Status: `manual_review_required`
- **Utah Early Intervention State Office** (early_intervention): Website: https://dhhs.utah.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Beaver County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Box Elder County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cache County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carbon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Daggett County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Davis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Duchesne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Emery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Garfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grand County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Iron County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Juab County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kane County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Millard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morgan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Piute County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rich County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Salt Lake County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| San Juan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sanpete County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sevier County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Summit County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tooele County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Uintah County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Utah County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Wasatch County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Weber County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Beaver County storefront office | Beaver County | `off-beaver-ut-medicaid` |
| Office | Box Elder County storefront office | Box Elder County | `off-box-elder-ut-medicaid` |
| Office | Cache County storefront office | Cache County | `off-cache-ut-medicaid` |
| Office | Carbon County storefront office | Carbon County | `off-carbon-ut-medicaid` |
| Office | Daggett County storefront office | Daggett County | `off-daggett-ut-medicaid` |
| Office | Davis County storefront office | Davis County | `off-davis-ut-medicaid` |
| Office | Duchesne County storefront office | Duchesne County | `off-duchesne-ut-medicaid` |
| Office | Emery County storefront office | Emery County | `off-emery-ut-medicaid` |
| Office | Garfield County storefront office | Garfield County | `off-garfield-ut-medicaid` |
| Office | Grand County storefront office | Grand County | `off-grand-ut-medicaid` |
| Office | Iron County storefront office | Iron County | `off-iron-ut-medicaid` |
| Office | Juab County storefront office | Juab County | `off-juab-ut-medicaid` |
| Office | Kane County storefront office | Kane County | `off-kane-ut-medicaid` |
| Office | Millard County storefront office | Millard County | `off-millard-ut-medicaid` |
| Office | Morgan County storefront office | Morgan County | `off-morgan-ut-medicaid` |
| Office | Piute County storefront office | Piute County | `off-piute-ut-medicaid` |
| Office | Rich County storefront office | Rich County | `off-rich-ut-medicaid` |
| Office | Salt Lake County storefront office | Salt Lake County | `off-salt-lake-ut-medicaid` |
| Office | San Juan County storefront office | San Juan County | `off-san-juan-ut-medicaid` |
| Office | Sanpete County storefront office | Sanpete County | `off-sanpete-ut-medicaid` |
| Office | Sevier County storefront office | Sevier County | `off-sevier-ut-medicaid` |
| Office | Summit County storefront office | Summit County | `off-summit-ut-medicaid` |
| Office | Tooele County storefront office | Tooele County | `off-tooele-ut-medicaid` |
| Office | Uintah County storefront office | Uintah County | `off-uintah-ut-medicaid` |
| Office | Utah County storefront office | Utah County | `off-utah-ut-medicaid` |
| Office | Wasatch County storefront office | Wasatch County | `off-wasatch-ut-medicaid` |
| Office | Washington County storefront office | Washington County | `off-washington-ut-medicaid` |
| Office | Wayne County storefront office | Wayne County | `off-wayne-ut-medicaid` |
| Office | Weber County storefront office | Weber County | `off-weber-ut-medicaid` |
| School District | Salt Lake Public Schools Special Education | Salt Lake County | `sd-salt-lake-ut` |
| School District | Utah Public Schools Special Education | Utah County | `sd-utah-ut` |
| School District | Beaver County School District | Beaver County | `sd-beaver-ut` |
| School District | Box Elder County School District | Box Elder County | `sd-box-elder-ut` |
| School District | Cache County School District | Cache County | `sd-cache-ut` |
| School District | Carbon County School District | Carbon County | `sd-carbon-ut` |
| School District | Daggett County School District | Daggett County | `sd-daggett-ut` |
| School District | Davis County School District | Davis County | `sd-davis-ut` |
| School District | Duchesne County School District | Duchesne County | `sd-duchesne-ut` |
| School District | Emery County School District | Emery County | `sd-emery-ut` |
| School District | Garfield County School District | Garfield County | `sd-garfield-ut` |
| School District | Grand County School District | Grand County | `sd-grand-ut` |
| School District | Iron County School District | Iron County | `sd-iron-ut` |
| School District | Juab County School District | Juab County | `sd-juab-ut` |
| School District | Kane County School District | Kane County | `sd-kane-ut` |
| School District | Millard County School District | Millard County | `sd-millard-ut` |
| School District | Morgan County School District | Morgan County | `sd-morgan-ut` |
| School District | Piute County School District | Piute County | `sd-piute-ut` |
| School District | Rich County School District | Rich County | `sd-rich-ut` |
| School District | San Juan County School District | San Juan County | `sd-san-juan-ut` |
| School District | Sanpete County School District | Sanpete County | `sd-sanpete-ut` |
| ... | *and 37 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
