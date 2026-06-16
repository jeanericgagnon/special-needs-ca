# Data Provenance Report: Washington (WA)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Washington under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **80.7%** (Manual Review Rate: **19.31%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Washington Medicaid`
- **Waiver Program Name**: `Washington HCBS Waivers`
- **Personal Care Program**: `Washington Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Washington Developmental Disabilities Administration`
- **State Education Agency**: `Washington Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Washington Early Intervention`
- **ABLE Savings Program**: `Washington ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 39
- **County Social Service Storefronts**: 39
- **School Districts**: 39
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 117
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 163 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 163 records
- **Manual Review Backlog (Flagged)**: 39 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **SSI for Children (Washington)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...
- **Washington ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Washington Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.hca.wa.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Washington Early Intervention Services** (State Program): Source URL: https://www.dshs.wa.gov/dda
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Washington HCBS Waivers** (State Program): Source URL: https://www.dshs.wa.gov/dda/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Washington residents.
- **Washington Medicaid** (State Program): Source URL: https://www.hca.wa.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Washington Medicaid Personal Care** (State Program): Source URL: https://www.hca.wa.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Washington Self-Direction Services** (State Program): Source URL: https://www.dshs.wa.gov/dda
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Washington Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Washington Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.dshs.wa.gov/dda
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Washington Developmental Services Intake** (dd_intake): Website: https://dhhs.washington.gov/dd | Phone: None | Status: `manual_review_required`
- **Washington Early Intervention State Office** (early_intervention): Website: https://dhhs.washington.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adams County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Asotin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chelan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clallam County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Columbia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cowlitz County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ferry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Garfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grays Harbor County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Island County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| King County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Kitsap County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kittitas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Klickitat County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lewis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mason County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Okanogan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pacific County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pend Oreille County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pierce County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| San Juan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Skagit County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Skamania County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Snohomish County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Spokane County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stevens County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Thurston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wahkiakum County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Walla Walla County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Whatcom County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Whitman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yakima County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Nonprofit | The Arc of Washington | Adams County | `wa-np-arc-adams-wa` |
| Nonprofit | The Arc of Washington | Asotin County | `wa-np-arc-asotin-wa` |
| Nonprofit | The Arc of Washington | Benton County | `wa-np-arc-benton-wa` |
| Nonprofit | The Arc of Washington | Chelan County | `wa-np-arc-chelan-wa` |
| Nonprofit | The Arc of Washington | Clallam County | `wa-np-arc-clallam-wa` |
| Nonprofit | The Arc of Washington | Clark County | `wa-np-arc-clark-wa` |
| Nonprofit | The Arc of Washington | Columbia County | `wa-np-arc-columbia-wa` |
| Nonprofit | The Arc of Washington | Cowlitz County | `wa-np-arc-cowlitz-wa` |
| Nonprofit | The Arc of Washington | Douglas County | `wa-np-arc-douglas-wa` |
| Nonprofit | The Arc of Washington | Ferry County | `wa-np-arc-ferry-wa` |
| Nonprofit | The Arc of Washington | Franklin County | `wa-np-arc-franklin-wa` |
| Nonprofit | The Arc of Washington | Garfield County | `wa-np-arc-garfield-wa` |
| Nonprofit | The Arc of Washington | Grant County | `wa-np-arc-grant-wa` |
| Nonprofit | The Arc of Washington | Grays Harbor County | `wa-np-arc-grays-harbor-wa` |
| Nonprofit | The Arc of Washington | Island County | `wa-np-arc-island-wa` |
| Nonprofit | The Arc of Washington | Jefferson County | `wa-np-arc-jefferson-wa` |
| Nonprofit | The Arc of Washington | King County | `wa-np-arc-king-wa` |
| Nonprofit | The Arc of Washington | Kitsap County | `wa-np-arc-kitsap-wa` |
| Nonprofit | The Arc of Washington | Kittitas County | `wa-np-arc-kittitas-wa` |
| Nonprofit | The Arc of Washington | Klickitat County | `wa-np-arc-klickitat-wa` |
| Nonprofit | The Arc of Washington | Lewis County | `wa-np-arc-lewis-wa` |
| Nonprofit | The Arc of Washington | Lincoln County | `wa-np-arc-lincoln-wa` |
| Nonprofit | The Arc of Washington | Mason County | `wa-np-arc-mason-wa` |
| Nonprofit | The Arc of Washington | Okanogan County | `wa-np-arc-okanogan-wa` |
| Nonprofit | The Arc of Washington | Pacific County | `wa-np-arc-pacific-wa` |
| Nonprofit | The Arc of Washington | Pend Oreille County | `wa-np-arc-pend-oreille-wa` |
| Nonprofit | The Arc of Washington | Pierce County | `wa-np-arc-pierce-wa` |
| Nonprofit | The Arc of Washington | San Juan County | `wa-np-arc-san-juan-wa` |
| Nonprofit | The Arc of Washington | Skagit County | `wa-np-arc-skagit-wa` |
| Nonprofit | The Arc of Washington | Skamania County | `wa-np-arc-skamania-wa` |
| Nonprofit | The Arc of Washington | Snohomish County | `wa-np-arc-snohomish-wa` |
| Nonprofit | The Arc of Washington | Spokane County | `wa-np-arc-spokane-wa` |
| Nonprofit | The Arc of Washington | Stevens County | `wa-np-arc-stevens-wa` |
| Nonprofit | The Arc of Washington | Thurston County | `wa-np-arc-thurston-wa` |
| Nonprofit | The Arc of Washington | Wahkiakum County | `wa-np-arc-wahkiakum-wa` |
| Nonprofit | The Arc of Washington | Walla Walla County | `wa-np-arc-walla-walla-wa` |
| Nonprofit | The Arc of Washington | Whatcom County | `wa-np-arc-whatcom-wa` |
| Nonprofit | The Arc of Washington | Whitman County | `wa-np-arc-whitman-wa` |
| Nonprofit | The Arc of Washington | Yakima County | `wa-np-arc-yakima-wa` |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
