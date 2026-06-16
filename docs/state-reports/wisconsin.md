# Data Provenance Report: Wisconsin (WI)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Wisconsin under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.1%** (Manual Review Rate: **58.86%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Wisconsin Medicaid`
- **Waiver Program Name**: `Wisconsin Family Care HCBS Waiver`
- **Personal Care Program**: `Wisconsin Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Wisconsin Department of Health Services`
- **State Education Agency**: `Wisconsin Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Wisconsin Early Intervention`
- **ABLE Savings Program**: `Wisconsin ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 72
- **County Social Service Storefronts**: 72
- **School Districts**: 72
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 216
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 297 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 151 records
- **Manual Review Backlog (Flagged)**: 216 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **SSI for Children (Wisconsin)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...
- **Wisconsin ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Wisconsin Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.dhs.wisconsin.gov/medicaid
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Wisconsin Early Intervention Services** (State Program): Source URL: https://www.dhs.wisconsin.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Wisconsin Family Care HCBS Waiver** (State Program): Source URL: https://www.dhs.wisconsin.gov/familycare/eligibility.htm
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Wisconsin residents.
- **Wisconsin Medicaid** (State Program): Source URL: https://www.dhs.wisconsin.gov/medicaid
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Wisconsin Medicaid Personal Care** (State Program): Source URL: https://www.dhs.wisconsin.gov/medicaid
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Wisconsin Self-Direction Services** (State Program): Source URL: https://www.dhs.wisconsin.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Wisconsin Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Wisconsin Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.dhs.wisconsin.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Wisconsin Developmental Services Intake** (dd_intake): Website: https://dhhs.wisconsin.gov/dd | Phone: None | Status: `manual_review_required`
- **Wisconsin Early Intervention State Office** (early_intervention): Website: https://dhhs.wisconsin.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adams County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ashland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Barron County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bayfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brown County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Buffalo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Burnett County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calumet County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chippewa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Columbia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crawford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dane County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Dodge County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Door County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dunn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Eau Claire County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Florence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fond du Lac County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Forest County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Green County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Green Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Iowa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Iron County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Juneau County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kenosha County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kewaunee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| La Crosse County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lafayette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Langlade County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Manitowoc County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marathon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marinette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marquette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Menominee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Milwaukee County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oconto County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oneida County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Outagamie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ozaukee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pepin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pierce County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Portage County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Price County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Racine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Richland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rusk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sauk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sawyer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shawano County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sheboygan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Croix County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Taylor County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Trempealeau County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Vernon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Vilas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Walworth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washburn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Waukesha County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Waupaca County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Waushara County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Winnebago County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wood County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Adams County storefront office | Adams County | `off-adams-wi-medicaid` |
| Office | Ashland County storefront office | Ashland County | `off-ashland-wi-medicaid` |
| Office | Barron County storefront office | Barron County | `off-barron-wi-medicaid` |
| Office | Bayfield County storefront office | Bayfield County | `off-bayfield-wi-medicaid` |
| Office | Brown County storefront office | Brown County | `off-brown-wi-medicaid` |
| Office | Buffalo County storefront office | Buffalo County | `off-buffalo-wi-medicaid` |
| Office | Burnett County storefront office | Burnett County | `off-burnett-wi-medicaid` |
| Office | Calumet County storefront office | Calumet County | `off-calumet-wi-medicaid` |
| Office | Chippewa County storefront office | Chippewa County | `off-chippewa-wi-medicaid` |
| Office | Clark County storefront office | Clark County | `off-clark-wi-medicaid` |
| Office | Columbia County storefront office | Columbia County | `off-columbia-wi-medicaid` |
| Office | Crawford County storefront office | Crawford County | `off-crawford-wi-medicaid` |
| Office | Dane County storefront office | Dane County | `off-dane-wi-medicaid` |
| Office | Dodge County storefront office | Dodge County | `off-dodge-wi-medicaid` |
| Office | Door County storefront office | Door County | `off-door-wi-medicaid` |
| Office | Douglas County storefront office | Douglas County | `off-douglas-wi-medicaid` |
| Office | Dunn County storefront office | Dunn County | `off-dunn-wi-medicaid` |
| Office | Eau Claire County storefront office | Eau Claire County | `off-eau-claire-wi-medicaid` |
| Office | Florence County storefront office | Florence County | `off-florence-wi-medicaid` |
| Office | Fond du Lac County storefront office | Fond du Lac County | `off-fond-du-lac-wi-medicaid` |
| Office | Forest County storefront office | Forest County | `off-forest-wi-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-wi-medicaid` |
| Office | Green County storefront office | Green County | `off-green-wi-medicaid` |
| Office | Green Lake County storefront office | Green Lake County | `off-green-lake-wi-medicaid` |
| Office | Iowa County storefront office | Iowa County | `off-iowa-wi-medicaid` |
| Office | Iron County storefront office | Iron County | `off-iron-wi-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-wi-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-wi-medicaid` |
| Office | Juneau County storefront office | Juneau County | `off-juneau-wi-medicaid` |
| Office | Kenosha County storefront office | Kenosha County | `off-kenosha-wi-medicaid` |
| Office | Kewaunee County storefront office | Kewaunee County | `off-kewaunee-wi-medicaid` |
| Office | La Crosse County storefront office | La Crosse County | `off-la-crosse-wi-medicaid` |
| Office | Lafayette County storefront office | Lafayette County | `off-lafayette-wi-medicaid` |
| Office | Langlade County storefront office | Langlade County | `off-langlade-wi-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-wi-medicaid` |
| Office | Manitowoc County storefront office | Manitowoc County | `off-manitowoc-wi-medicaid` |
| Office | Marathon County storefront office | Marathon County | `off-marathon-wi-medicaid` |
| Office | Marinette County storefront office | Marinette County | `off-marinette-wi-medicaid` |
| Office | Marquette County storefront office | Marquette County | `off-marquette-wi-medicaid` |
| Office | Menominee County storefront office | Menominee County | `off-menominee-wi-medicaid` |
| Office | Milwaukee County storefront office | Milwaukee County | `off-milwaukee-wi-medicaid` |
| Office | Monroe County storefront office | Monroe County | `off-monroe-wi-medicaid` |
| Office | Oconto County storefront office | Oconto County | `off-oconto-wi-medicaid` |
| Office | Oneida County storefront office | Oneida County | `off-oneida-wi-medicaid` |
| Office | Outagamie County storefront office | Outagamie County | `off-outagamie-wi-medicaid` |
| Office | Ozaukee County storefront office | Ozaukee County | `off-ozaukee-wi-medicaid` |
| Office | Pepin County storefront office | Pepin County | `off-pepin-wi-medicaid` |
| Office | Pierce County storefront office | Pierce County | `off-pierce-wi-medicaid` |
| Office | Polk County storefront office | Polk County | `off-polk-wi-medicaid` |
| Office | Portage County storefront office | Portage County | `off-portage-wi-medicaid` |
| ... | *and 166 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
