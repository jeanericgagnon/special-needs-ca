# Data Provenance Report: Minnesota (MN)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Minnesota under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **39.6%** (Manual Review Rate: **60.41%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Minnesota Medicaid`
- **Waiver Program Name**: `Minnesota HCBS Waivers`
- **Personal Care Program**: `Minnesota Personal Care Assistance`
- **Developmental Disability (DD) Agency**: `Minnesota Department of Human Services`
- **State Education Agency**: `Minnesota Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Minnesota Early Intervention`
- **ABLE Savings Program**: `Minnesota ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 87
- **County Social Service Storefronts**: 87
- **School Districts**: 87
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 261
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 357 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 175 records
- **Manual Review Backlog (Flagged)**: 267 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Minnesota ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Minnesota Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://mn.gov/dhs/pca
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Minnesota Early Intervention Services** (State Program): Source URL: https://mn.gov/dhs
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Minnesota HCBS Waivers** (State Program): Source URL: https://mn.gov/dhs/waivers/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Minnesota residents.
- **Minnesota Medicaid** (State Program): Source URL: https://mn.gov/dhs/pca
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Minnesota Personal Care Assistance** (State Program): Source URL: https://mn.gov/dhs/pca
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Minnesota Self-Direction Services** (State Program): Source URL: https://mn.gov/dhs
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Minnesota Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Minnesota Transition & Vocational Rehabilitation** (State Program): Source URL: https://mn.gov/dhs
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Minnesota)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Minnesota Developmental Services Intake** (dd_intake): Website: https://dhhs.minnesota.gov/dd | Phone: None | Status: `manual_review_required`
- **Minnesota Early Intervention State Office** (early_intervention): Website: https://dhhs.minnesota.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Aitkin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Anoka County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Becker County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Beltrami County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Big Stone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Blue Earth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brown County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carlton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carver County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cass County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chippewa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chisago County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clearwater County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cook County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cottonwood County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crow Wing County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dakota County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dodge County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Faribault County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fillmore County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Freeborn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Goodhue County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hennepin County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Houston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hubbard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Isanti County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Itasca County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kanabec County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kandiyohi County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kittson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Koochiching County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lac qui Parle County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake of the Woods County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Le Sueur County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lyon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mahnomen County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Martin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McLeod County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Meeker County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mille Lacs County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morrison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mower County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Murray County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nicollet County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nobles County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Norman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Olmsted County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Otter Tail County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pennington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pipestone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pope County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ramsey County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Red Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Redwood County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Renville County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rice County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Roseau County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saint Louis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sherburne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sibley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stearns County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Steele County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stevens County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Swift County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Todd County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Traverse County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wabasha County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wadena County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Waseca County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Watonwan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wilkin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Winona County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wright County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yellow Medicine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Aitkin County storefront office | Aitkin County | `off-aitkin-mn-medicaid` |
| Office | Anoka County storefront office | Anoka County | `off-anoka-mn-medicaid` |
| Office | Becker County storefront office | Becker County | `off-becker-mn-medicaid` |
| Office | Beltrami County storefront office | Beltrami County | `off-beltrami-mn-medicaid` |
| Office | Benton County storefront office | Benton County | `off-benton-mn-medicaid` |
| Office | Big Stone County storefront office | Big Stone County | `off-big-stone-mn-medicaid` |
| Office | Blue Earth County storefront office | Blue Earth County | `off-blue-earth-mn-medicaid` |
| Office | Brown County storefront office | Brown County | `off-brown-mn-medicaid` |
| Office | Carlton County storefront office | Carlton County | `off-carlton-mn-medicaid` |
| Office | Carver County storefront office | Carver County | `off-carver-mn-medicaid` |
| Office | Cass County storefront office | Cass County | `off-cass-mn-medicaid` |
| Office | Chippewa County storefront office | Chippewa County | `off-chippewa-mn-medicaid` |
| Office | Chisago County storefront office | Chisago County | `off-chisago-mn-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-mn-medicaid` |
| Office | Clearwater County storefront office | Clearwater County | `off-clearwater-mn-medicaid` |
| Office | Cook County storefront office | Cook County | `off-cook-mn-medicaid` |
| Office | Cottonwood County storefront office | Cottonwood County | `off-cottonwood-mn-medicaid` |
| Office | Crow Wing County storefront office | Crow Wing County | `off-crow-wing-mn-medicaid` |
| Office | Dakota County storefront office | Dakota County | `off-dakota-mn-medicaid` |
| Office | Dodge County storefront office | Dodge County | `off-dodge-mn-medicaid` |
| Office | Douglas County storefront office | Douglas County | `off-douglas-mn-medicaid` |
| Office | Faribault County storefront office | Faribault County | `off-faribault-mn-medicaid` |
| Office | Fillmore County storefront office | Fillmore County | `off-fillmore-mn-medicaid` |
| Office | Freeborn County storefront office | Freeborn County | `off-freeborn-mn-medicaid` |
| Office | Goodhue County storefront office | Goodhue County | `off-goodhue-mn-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-mn-medicaid` |
| Office | Hennepin County storefront office | Hennepin County | `off-hennepin-mn-medicaid` |
| Office | Houston County storefront office | Houston County | `off-houston-mn-medicaid` |
| Office | Hubbard County storefront office | Hubbard County | `off-hubbard-mn-medicaid` |
| Office | Isanti County storefront office | Isanti County | `off-isanti-mn-medicaid` |
| Office | Itasca County storefront office | Itasca County | `off-itasca-mn-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-mn-medicaid` |
| Office | Kanabec County storefront office | Kanabec County | `off-kanabec-mn-medicaid` |
| Office | Kandiyohi County storefront office | Kandiyohi County | `off-kandiyohi-mn-medicaid` |
| Office | Kittson County storefront office | Kittson County | `off-kittson-mn-medicaid` |
| Office | Koochiching County storefront office | Koochiching County | `off-koochiching-mn-medicaid` |
| Office | Lac qui Parle County storefront office | Lac qui Parle County | `off-lac-qui-parle-mn-medicaid` |
| Office | Lake County storefront office | Lake County | `off-lake-mn-medicaid` |
| Office | Lake of the Woods County storefront office | Lake of the Woods County | `off-lake-of-the-woods-mn-medicaid` |
| Office | Le Sueur County storefront office | Le Sueur County | `off-le-sueur-mn-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-mn-medicaid` |
| Office | Lyon County storefront office | Lyon County | `off-lyon-mn-medicaid` |
| Office | McLeod County storefront office | McLeod County | `off-mcleod-mn-medicaid` |
| Office | Mahnomen County storefront office | Mahnomen County | `off-mahnomen-mn-medicaid` |
| Office | Marshall County storefront office | Marshall County | `off-marshall-mn-medicaid` |
| Office | Martin County storefront office | Martin County | `off-martin-mn-medicaid` |
| Office | Meeker County storefront office | Meeker County | `off-meeker-mn-medicaid` |
| Office | Mille Lacs County storefront office | Mille Lacs County | `off-mille-lacs-mn-medicaid` |
| Office | Morrison County storefront office | Morrison County | `off-morrison-mn-medicaid` |
| Office | Mower County storefront office | Mower County | `off-mower-mn-medicaid` |
| ... | *and 217 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
