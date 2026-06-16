# Data Provenance Report: West Virginia (WV)

This report details the data sources, records count, trust classifications, and launch readiness for the State of West Virginia under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.5%** (Manual Review Rate: **58.51%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `West Virginia Medicaid`
- **Waiver Program Name**: `West Virginia HCBS Waivers`
- **Personal Care Program**: `West Virginia Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `West Virginia Intellectual and Developmental Disabilities Division`
- **State Education Agency**: `West Virginia Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `West Virginia Early Intervention`
- **ABLE Savings Program**: `West Virginia ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 55
- **County Social Service Storefronts**: 55
- **School Districts**: 55
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 165
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 229 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 117 records
- **Manual Review Backlog (Flagged)**: 165 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **SSI for Children (West Virginia)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...
- **West Virginia ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **West Virginia Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://dhhr.wv.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **West Virginia Early Intervention Services** (State Program): Source URL: https://dhhr.wv.gov/bms
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **West Virginia HCBS Waivers** (State Program): Source URL: https://dhhr.wv.gov/bms/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for West Virginia resident...
- **West Virginia Medicaid** (State Program): Source URL: https://dhhr.wv.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **West Virginia Medicaid Personal Care** (State Program): Source URL: https://dhhr.wv.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **West Virginia Self-Direction Services** (State Program): Source URL: https://dhhr.wv.gov/bms
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **West Virginia Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **West Virginia Transition & Vocational Rehabilitation** (State Program): Source URL: https://dhhr.wv.gov/bms
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **West Virginia Developmental Services Intake** (dd_intake): Website: https://dhhs.west-virginia.gov/dd | Phone: None | Status: `manual_review_required`
- **West Virginia Early Intervention State Office** (early_intervention): Website: https://dhhs.west-virginia.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Barbour County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Berkeley County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Boone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Braxton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brooke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cabell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calhoun County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Doddridge County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fayette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gilmer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greenbrier County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hampshire County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hancock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hardy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harrison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kanawha County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Lewis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Logan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mason County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McDowell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mercer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mineral County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mingo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monongalia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morgan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nicholas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ohio County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pendleton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pleasants County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pocahontas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Preston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Putnam County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Raleigh County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Randolph County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ritchie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Roane County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Summers County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Taylor County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tucker County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tyler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Upshur County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Webster County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wetzel County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wirt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wood County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wyoming County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Barbour County storefront office | Barbour County | `off-barbour-wv-medicaid` |
| Office | Berkeley County storefront office | Berkeley County | `off-berkeley-wv-medicaid` |
| Office | Boone County storefront office | Boone County | `off-boone-wv-medicaid` |
| Office | Braxton County storefront office | Braxton County | `off-braxton-wv-medicaid` |
| Office | Brooke County storefront office | Brooke County | `off-brooke-wv-medicaid` |
| Office | Cabell County storefront office | Cabell County | `off-cabell-wv-medicaid` |
| Office | Calhoun County storefront office | Calhoun County | `off-calhoun-wv-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-wv-medicaid` |
| Office | Doddridge County storefront office | Doddridge County | `off-doddridge-wv-medicaid` |
| Office | Fayette County storefront office | Fayette County | `off-fayette-wv-medicaid` |
| Office | Gilmer County storefront office | Gilmer County | `off-gilmer-wv-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-wv-medicaid` |
| Office | Greenbrier County storefront office | Greenbrier County | `off-greenbrier-wv-medicaid` |
| Office | Hampshire County storefront office | Hampshire County | `off-hampshire-wv-medicaid` |
| Office | Hancock County storefront office | Hancock County | `off-hancock-wv-medicaid` |
| Office | Hardy County storefront office | Hardy County | `off-hardy-wv-medicaid` |
| Office | Harrison County storefront office | Harrison County | `off-harrison-wv-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-wv-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-wv-medicaid` |
| Office | Kanawha County storefront office | Kanawha County | `off-kanawha-wv-medicaid` |
| Office | Lewis County storefront office | Lewis County | `off-lewis-wv-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-wv-medicaid` |
| Office | Logan County storefront office | Logan County | `off-logan-wv-medicaid` |
| Office | Marion County storefront office | Marion County | `off-marion-wv-medicaid` |
| Office | Marshall County storefront office | Marshall County | `off-marshall-wv-medicaid` |
| Office | Mason County storefront office | Mason County | `off-mason-wv-medicaid` |
| Office | McDowell County storefront office | McDowell County | `off-mcdowell-wv-medicaid` |
| Office | Mercer County storefront office | Mercer County | `off-mercer-wv-medicaid` |
| Office | Mineral County storefront office | Mineral County | `off-mineral-wv-medicaid` |
| Office | Mingo County storefront office | Mingo County | `off-mingo-wv-medicaid` |
| Office | Monongalia County storefront office | Monongalia County | `off-monongalia-wv-medicaid` |
| Office | Monroe County storefront office | Monroe County | `off-monroe-wv-medicaid` |
| Office | Morgan County storefront office | Morgan County | `off-morgan-wv-medicaid` |
| Office | Nicholas County storefront office | Nicholas County | `off-nicholas-wv-medicaid` |
| Office | Ohio County storefront office | Ohio County | `off-ohio-wv-medicaid` |
| Office | Pendleton County storefront office | Pendleton County | `off-pendleton-wv-medicaid` |
| Office | Pleasants County storefront office | Pleasants County | `off-pleasants-wv-medicaid` |
| Office | Pocahontas County storefront office | Pocahontas County | `off-pocahontas-wv-medicaid` |
| Office | Preston County storefront office | Preston County | `off-preston-wv-medicaid` |
| Office | Putnam County storefront office | Putnam County | `off-putnam-wv-medicaid` |
| Office | Raleigh County storefront office | Raleigh County | `off-raleigh-wv-medicaid` |
| Office | Randolph County storefront office | Randolph County | `off-randolph-wv-medicaid` |
| Office | Ritchie County storefront office | Ritchie County | `off-ritchie-wv-medicaid` |
| Office | Roane County storefront office | Roane County | `off-roane-wv-medicaid` |
| Office | Summers County storefront office | Summers County | `off-summers-wv-medicaid` |
| Office | Taylor County storefront office | Taylor County | `off-taylor-wv-medicaid` |
| Office | Tucker County storefront office | Tucker County | `off-tucker-wv-medicaid` |
| Office | Tyler County storefront office | Tyler County | `off-tyler-wv-medicaid` |
| Office | Upshur County storefront office | Upshur County | `off-upshur-wv-medicaid` |
| Office | Wayne County storefront office | Wayne County | `off-wayne-wv-medicaid` |
| ... | *and 115 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
