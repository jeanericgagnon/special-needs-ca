# Data Provenance Report: Missouri (MO)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Missouri under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **40.7%** (Manual Review Rate: **59.28%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Missouri Medicaid`
- **Waiver Program Name**: `Missouri HCBS Waivers`
- **Personal Care Program**: `Missouri Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Missouri Division of Developmental Disabilities`
- **State Education Agency**: `Missouri Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Missouri Early Intervention`
- **ABLE Savings Program**: `Missouri ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 115
- **County Social Service Storefronts**: 115
- **School Districts**: 115
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 345
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 469 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 237 records
- **Manual Review Backlog (Flagged)**: 345 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Missouri ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Missouri Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://mydss.mo.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Missouri Early Intervention Services** (State Program): Source URL: https://dmh.mo.gov/dev-disabilities
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Missouri HCBS Waivers** (State Program): Source URL: https://dmh.mo.gov/dev-disabilities/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Missouri residents.
- **Missouri Medicaid** (State Program): Source URL: https://mydss.mo.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Missouri Medicaid Personal Care** (State Program): Source URL: https://mydss.mo.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Missouri Self-Direction Services** (State Program): Source URL: https://dmh.mo.gov/dev-disabilities
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Missouri Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Missouri Transition & Vocational Rehabilitation** (State Program): Source URL: https://dmh.mo.gov/dev-disabilities
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Missouri)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Missouri Developmental Services Intake** (dd_intake): Website: https://dhhs.missouri.gov/dd | Phone: None | Status: `manual_review_required`
- **Missouri Early Intervention State Office** (early_intervention): Website: https://dhhs.missouri.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adair County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Andrew County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Atchison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Audrain County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Barry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Barton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bates County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bollinger County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Buchanan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Butler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Caldwell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Callaway County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Camden County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cape Girardeau County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cass County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cedar County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chariton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Christian County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clinton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cole County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cooper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crawford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dade County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dallas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Daviess County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| DeKalb County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dent County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dunklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gasconade County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gentry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greene County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grundy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harrison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hickory County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Holt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Howard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Howell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Iron County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Jasper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Knox County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Laclede County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lafayette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lawrence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lewis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Linn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Livingston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Macon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Maries County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McDonald County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mercer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Miller County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mississippi County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Moniteau County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morgan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| New Madrid County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Newton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nodaway County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oregon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Osage County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ozark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pemiscot County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Perry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pettis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Phelps County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pike County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Platte County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pulaski County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Putnam County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ralls County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Randolph County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ray County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Reynolds County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ripley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saint Charles County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saint Clair County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saint Francois County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saint Louis City County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saint Louis County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Sainte Genevieve County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saline County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Schuyler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scotland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shannon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shelby County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stoddard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sullivan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Taney County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Texas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Vernon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Warren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Webster County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Worth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wright County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Adair County storefront office | Adair County | `off-adair-mo-medicaid` |
| Office | Andrew County storefront office | Andrew County | `off-andrew-mo-medicaid` |
| Office | Atchison County storefront office | Atchison County | `off-atchison-mo-medicaid` |
| Office | Audrain County storefront office | Audrain County | `off-audrain-mo-medicaid` |
| Office | Barry County storefront office | Barry County | `off-barry-mo-medicaid` |
| Office | Barton County storefront office | Barton County | `off-barton-mo-medicaid` |
| Office | Bates County storefront office | Bates County | `off-bates-mo-medicaid` |
| Office | Benton County storefront office | Benton County | `off-benton-mo-medicaid` |
| Office | Bollinger County storefront office | Bollinger County | `off-bollinger-mo-medicaid` |
| Office | Boone County storefront office | Boone County | `off-boone-mo-medicaid` |
| Office | Buchanan County storefront office | Buchanan County | `off-buchanan-mo-medicaid` |
| Office | Butler County storefront office | Butler County | `off-butler-mo-medicaid` |
| Office | Caldwell County storefront office | Caldwell County | `off-caldwell-mo-medicaid` |
| Office | Callaway County storefront office | Callaway County | `off-callaway-mo-medicaid` |
| Office | Camden County storefront office | Camden County | `off-camden-mo-medicaid` |
| Office | Cape Girardeau County storefront office | Cape Girardeau County | `off-cape-girardeau-mo-medicaid` |
| Office | Carroll County storefront office | Carroll County | `off-carroll-mo-medicaid` |
| Office | Carter County storefront office | Carter County | `off-carter-mo-medicaid` |
| Office | Cass County storefront office | Cass County | `off-cass-mo-medicaid` |
| Office | Cedar County storefront office | Cedar County | `off-cedar-mo-medicaid` |
| Office | Chariton County storefront office | Chariton County | `off-chariton-mo-medicaid` |
| Office | Christian County storefront office | Christian County | `off-christian-mo-medicaid` |
| Office | Clark County storefront office | Clark County | `off-clark-mo-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-mo-medicaid` |
| Office | Clinton County storefront office | Clinton County | `off-clinton-mo-medicaid` |
| Office | Cole County storefront office | Cole County | `off-cole-mo-medicaid` |
| Office | Cooper County storefront office | Cooper County | `off-cooper-mo-medicaid` |
| Office | Crawford County storefront office | Crawford County | `off-crawford-mo-medicaid` |
| Office | Dade County storefront office | Dade County | `off-dade-mo-medicaid` |
| Office | Dallas County storefront office | Dallas County | `off-dallas-mo-medicaid` |
| Office | Daviess County storefront office | Daviess County | `off-daviess-mo-medicaid` |
| Office | DeKalb County storefront office | DeKalb County | `off-dekalb-mo-medicaid` |
| Office | Dent County storefront office | Dent County | `off-dent-mo-medicaid` |
| Office | Douglas County storefront office | Douglas County | `off-douglas-mo-medicaid` |
| Office | Dunklin County storefront office | Dunklin County | `off-dunklin-mo-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-mo-medicaid` |
| Office | Gasconade County storefront office | Gasconade County | `off-gasconade-mo-medicaid` |
| Office | Gentry County storefront office | Gentry County | `off-gentry-mo-medicaid` |
| Office | Greene County storefront office | Greene County | `off-greene-mo-medicaid` |
| Office | Grundy County storefront office | Grundy County | `off-grundy-mo-medicaid` |
| Office | Harrison County storefront office | Harrison County | `off-harrison-mo-medicaid` |
| Office | Henry County storefront office | Henry County | `off-henry-mo-medicaid` |
| Office | Hickory County storefront office | Hickory County | `off-hickory-mo-medicaid` |
| Office | Holt County storefront office | Holt County | `off-holt-mo-medicaid` |
| Office | Howard County storefront office | Howard County | `off-howard-mo-medicaid` |
| Office | Howell County storefront office | Howell County | `off-howell-mo-medicaid` |
| Office | Iron County storefront office | Iron County | `off-iron-mo-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-mo-medicaid` |
| Office | Jasper County storefront office | Jasper County | `off-jasper-mo-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-mo-medicaid` |
| ... | *and 295 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
