# Data Provenance Report: Kentucky (KY)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Kentucky under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **39.7%** (Manual Review Rate: **60.3%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Kentucky Medicaid`
- **Waiver Program Name**: `Kentucky HCBS Waivers`
- **Personal Care Program**: `Kentucky Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Kentucky Department for Behavioral Health, Developmental and Intellectual Disabilities`
- **State Education Agency**: `Kentucky Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Kentucky Early Intervention`
- **ABLE Savings Program**: `Kentucky ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 120
- **County Social Service Storefronts**: 120
- **School Districts**: 120
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 360
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 489 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 241 records
- **Manual Review Backlog (Flagged)**: 366 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Kentucky ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Kentucky Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://chfs.ky.gov/dms
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Kentucky Early Intervention Services** (State Program): Source URL: https://dbhdid.ky.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Kentucky HCBS Waivers** (State Program): Source URL: https://dbhdid.ky.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Kentucky residents.
- **Kentucky Medicaid** (State Program): Source URL: https://chfs.ky.gov/dms
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Kentucky Medicaid Personal Care** (State Program): Source URL: https://chfs.ky.gov/dms
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Kentucky Self-Direction Services** (State Program): Source URL: https://dbhdid.ky.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Kentucky Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Kentucky Transition & Vocational Rehabilitation** (State Program): Source URL: https://dbhdid.ky.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Kentucky)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Kentucky Developmental Services Intake** (dd_intake): Website: https://dhhs.kentucky.gov/dd | Phone: None | Status: `manual_review_required`
- **Kentucky Early Intervention State Office** (early_intervention): Website: https://dhhs.kentucky.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adair County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Allen County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Anderson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ballard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Barren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bath County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bourbon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boyd County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boyle County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bracken County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Breathitt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Breckinridge County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bullitt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Butler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Caldwell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calloway County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Campbell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carlisle County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Casey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Christian County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clinton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crittenden County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cumberland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Daviess County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Edmonson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Elliott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Estill County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fayette County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Fleming County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Floyd County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fulton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gallatin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Garrard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Graves County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grayson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Green County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greenup County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hancock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hardin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harlan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harrison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hart County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henderson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hickman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hopkins County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Jessamine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kenton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Knott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Knox County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| LaRue County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Laurel County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lawrence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Leslie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Letcher County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lewis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Livingston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Logan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lyon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Magoffin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Martin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mason County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McCracken County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McCreary County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McLean County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Meade County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Menifee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mercer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Metcalfe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morgan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Muhlenberg County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nelson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nicholas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ohio County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oldham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Owen County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Owsley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pendleton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Perry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pike County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Powell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pulaski County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Robertson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rockcastle County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rowan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Russell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shelby County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Simpson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Spencer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Taylor County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Todd County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Trigg County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Trimble County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Warren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Webster County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Whitley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wolfe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Woodford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Adair County storefront office | Adair County | `off-adair-ky-medicaid` |
| Office | Allen County storefront office | Allen County | `off-allen-ky-medicaid` |
| Office | Anderson County storefront office | Anderson County | `off-anderson-ky-medicaid` |
| Office | Ballard County storefront office | Ballard County | `off-ballard-ky-medicaid` |
| Office | Barren County storefront office | Barren County | `off-barren-ky-medicaid` |
| Office | Bath County storefront office | Bath County | `off-bath-ky-medicaid` |
| Office | Bell County storefront office | Bell County | `off-bell-ky-medicaid` |
| Office | Boone County storefront office | Boone County | `off-boone-ky-medicaid` |
| Office | Bourbon County storefront office | Bourbon County | `off-bourbon-ky-medicaid` |
| Office | Boyd County storefront office | Boyd County | `off-boyd-ky-medicaid` |
| Office | Boyle County storefront office | Boyle County | `off-boyle-ky-medicaid` |
| Office | Bracken County storefront office | Bracken County | `off-bracken-ky-medicaid` |
| Office | Breathitt County storefront office | Breathitt County | `off-breathitt-ky-medicaid` |
| Office | Breckinridge County storefront office | Breckinridge County | `off-breckinridge-ky-medicaid` |
| Office | Bullitt County storefront office | Bullitt County | `off-bullitt-ky-medicaid` |
| Office | Butler County storefront office | Butler County | `off-butler-ky-medicaid` |
| Office | Caldwell County storefront office | Caldwell County | `off-caldwell-ky-medicaid` |
| Office | Calloway County storefront office | Calloway County | `off-calloway-ky-medicaid` |
| Office | Campbell County storefront office | Campbell County | `off-campbell-ky-medicaid` |
| Office | Carlisle County storefront office | Carlisle County | `off-carlisle-ky-medicaid` |
| Office | Carroll County storefront office | Carroll County | `off-carroll-ky-medicaid` |
| Office | Carter County storefront office | Carter County | `off-carter-ky-medicaid` |
| Office | Casey County storefront office | Casey County | `off-casey-ky-medicaid` |
| Office | Christian County storefront office | Christian County | `off-christian-ky-medicaid` |
| Office | Clark County storefront office | Clark County | `off-clark-ky-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-ky-medicaid` |
| Office | Clinton County storefront office | Clinton County | `off-clinton-ky-medicaid` |
| Office | Crittenden County storefront office | Crittenden County | `off-crittenden-ky-medicaid` |
| Office | Cumberland County storefront office | Cumberland County | `off-cumberland-ky-medicaid` |
| Office | Daviess County storefront office | Daviess County | `off-daviess-ky-medicaid` |
| Office | Edmonson County storefront office | Edmonson County | `off-edmonson-ky-medicaid` |
| Office | Elliott County storefront office | Elliott County | `off-elliott-ky-medicaid` |
| Office | Estill County storefront office | Estill County | `off-estill-ky-medicaid` |
| Office | Fayette County storefront office | Fayette County | `off-fayette-ky-medicaid` |
| Office | Fleming County storefront office | Fleming County | `off-fleming-ky-medicaid` |
| Office | Floyd County storefront office | Floyd County | `off-floyd-ky-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-ky-medicaid` |
| Office | Fulton County storefront office | Fulton County | `off-fulton-ky-medicaid` |
| Office | Gallatin County storefront office | Gallatin County | `off-gallatin-ky-medicaid` |
| Office | Garrard County storefront office | Garrard County | `off-garrard-ky-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-ky-medicaid` |
| Office | Graves County storefront office | Graves County | `off-graves-ky-medicaid` |
| Office | Grayson County storefront office | Grayson County | `off-grayson-ky-medicaid` |
| Office | Green County storefront office | Green County | `off-green-ky-medicaid` |
| Office | Greenup County storefront office | Greenup County | `off-greenup-ky-medicaid` |
| Office | Hancock County storefront office | Hancock County | `off-hancock-ky-medicaid` |
| Office | Hardin County storefront office | Hardin County | `off-hardin-ky-medicaid` |
| Office | Harlan County storefront office | Harlan County | `off-harlan-ky-medicaid` |
| Office | Harrison County storefront office | Harrison County | `off-harrison-ky-medicaid` |
| Office | Hart County storefront office | Hart County | `off-hart-ky-medicaid` |
| ... | *and 316 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
