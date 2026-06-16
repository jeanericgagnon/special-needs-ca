# Data Provenance Report: Idaho (ID)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Idaho under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.9%** (Manual Review Rate: **58.15%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Idaho Medicaid`
- **Waiver Program Name**: `Idaho HCBS Waivers`
- **Personal Care Program**: `Idaho Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Idaho Department of Health and Welfare`
- **State Education Agency**: `Idaho Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Idaho Early Intervention`
- **ABLE Savings Program**: `Idaho ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 44
- **County Social Service Storefronts**: 44
- **School Districts**: 44
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 132
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 185 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 95 records
- **Manual Review Backlog (Flagged)**: 132 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Idaho ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Idaho Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://healthandwelfare.idaho.gov/medicaid
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Idaho Early Intervention Services** (State Program): Source URL: https://healthandwelfare.idaho.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Idaho HCBS Waivers** (State Program): Source URL: https://healthandwelfare.idaho.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Idaho residents.
- **Idaho Medicaid** (State Program): Source URL: https://healthandwelfare.idaho.gov/medicaid
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Idaho Medicaid Personal Care** (State Program): Source URL: https://healthandwelfare.idaho.gov/medicaid
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Idaho Self-Direction Services** (State Program): Source URL: https://healthandwelfare.idaho.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Idaho Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Idaho Transition & Vocational Rehabilitation** (State Program): Source URL: https://healthandwelfare.idaho.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Idaho)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Idaho Developmental Services Intake** (dd_intake): Website: https://dhhs.idaho.gov/dd | Phone: None | Status: `manual_review_required`
- **Idaho Early Intervention State Office** (early_intervention): Website: https://dhhs.idaho.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Ada County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Adams County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bannock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bear Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benewah County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bingham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Blaine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boise County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bonner County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bonneville County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boundary County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Butte County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Camas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Canyon County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Caribou County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cassia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clearwater County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Custer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Elmore County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fremont County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gem County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gooding County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Idaho County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jerome County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kootenai County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Latah County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lemhi County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lewis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Minidoka County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nez Perce County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oneida County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Owyhee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Payette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Power County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shoshone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Teton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Twin Falls County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Valley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Ada County storefront office | Ada County | `off-ada-id-medicaid` |
| Office | Adams County storefront office | Adams County | `off-adams-id-medicaid` |
| Office | Bannock County storefront office | Bannock County | `off-bannock-id-medicaid` |
| Office | Bear Lake County storefront office | Bear Lake County | `off-bear-lake-id-medicaid` |
| Office | Benewah County storefront office | Benewah County | `off-benewah-id-medicaid` |
| Office | Bingham County storefront office | Bingham County | `off-bingham-id-medicaid` |
| Office | Blaine County storefront office | Blaine County | `off-blaine-id-medicaid` |
| Office | Boise County storefront office | Boise County | `off-boise-id-medicaid` |
| Office | Bonner County storefront office | Bonner County | `off-bonner-id-medicaid` |
| Office | Bonneville County storefront office | Bonneville County | `off-bonneville-id-medicaid` |
| Office | Boundary County storefront office | Boundary County | `off-boundary-id-medicaid` |
| Office | Butte County storefront office | Butte County | `off-butte-id-medicaid` |
| Office | Camas County storefront office | Camas County | `off-camas-id-medicaid` |
| Office | Canyon County storefront office | Canyon County | `off-canyon-id-medicaid` |
| Office | Caribou County storefront office | Caribou County | `off-caribou-id-medicaid` |
| Office | Cassia County storefront office | Cassia County | `off-cassia-id-medicaid` |
| Office | Clark County storefront office | Clark County | `off-clark-id-medicaid` |
| Office | Clearwater County storefront office | Clearwater County | `off-clearwater-id-medicaid` |
| Office | Custer County storefront office | Custer County | `off-custer-id-medicaid` |
| Office | Elmore County storefront office | Elmore County | `off-elmore-id-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-id-medicaid` |
| Office | Fremont County storefront office | Fremont County | `off-fremont-id-medicaid` |
| Office | Gem County storefront office | Gem County | `off-gem-id-medicaid` |
| Office | Gooding County storefront office | Gooding County | `off-gooding-id-medicaid` |
| Office | Idaho County storefront office | Idaho County | `off-idaho-id-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-id-medicaid` |
| Office | Jerome County storefront office | Jerome County | `off-jerome-id-medicaid` |
| Office | Kootenai County storefront office | Kootenai County | `off-kootenai-id-medicaid` |
| Office | Latah County storefront office | Latah County | `off-latah-id-medicaid` |
| Office | Lemhi County storefront office | Lemhi County | `off-lemhi-id-medicaid` |
| Office | Lewis County storefront office | Lewis County | `off-lewis-id-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-id-medicaid` |
| Office | Madison County storefront office | Madison County | `off-madison-id-medicaid` |
| Office | Minidoka County storefront office | Minidoka County | `off-minidoka-id-medicaid` |
| Office | Nez Perce County storefront office | Nez Perce County | `off-nez-perce-id-medicaid` |
| Office | Oneida County storefront office | Oneida County | `off-oneida-id-medicaid` |
| Office | Owyhee County storefront office | Owyhee County | `off-owyhee-id-medicaid` |
| Office | Payette County storefront office | Payette County | `off-payette-id-medicaid` |
| Office | Power County storefront office | Power County | `off-power-id-medicaid` |
| Office | Shoshone County storefront office | Shoshone County | `off-shoshone-id-medicaid` |
| Office | Teton County storefront office | Teton County | `off-teton-id-medicaid` |
| Office | Twin Falls County storefront office | Twin Falls County | `off-twin-falls-id-medicaid` |
| Office | Valley County storefront office | Valley County | `off-valley-id-medicaid` |
| Office | Washington County storefront office | Washington County | `off-washington-id-medicaid` |
| School District | Ada Public Schools Special Education | Ada County | `sd-ada-id` |
| School District | Canyon Public Schools Special Education | Canyon County | `sd-canyon-id` |
| School District | Adams County School District | Adams County | `sd-adams-id` |
| School District | Bannock County School District | Bannock County | `sd-bannock-id` |
| School District | Bear Lake County School District | Bear Lake County | `sd-bear-lake-id` |
| School District | Benewah County School District | Benewah County | `sd-benewah-id` |
| ... | *and 82 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
