# Data Provenance Report: Mississippi (MS)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Mississippi under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.0%** (Manual Review Rate: **58.99%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Mississippi Medicaid`
- **Waiver Program Name**: `Mississippi HCBS Waivers`
- **Personal Care Program**: `Mississippi Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Mississippi Department of Mental Health`
- **State Education Agency**: `Mississippi Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Mississippi Early Intervention`
- **ABLE Savings Program**: `Mississippi ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 82
- **County Social Service Storefronts**: 82
- **School Districts**: 82
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 246
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 337 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 171 records
- **Manual Review Backlog (Flagged)**: 246 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Mississippi ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Mississippi Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://medicaid.ms.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Mississippi Early Intervention Services** (State Program): Source URL: https://www.dmh.ms.gov
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Mississippi HCBS Waivers** (State Program): Source URL: https://www.dmh.ms.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Mississippi residents.
- **Mississippi Medicaid** (State Program): Source URL: https://medicaid.ms.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Mississippi Medicaid Personal Care** (State Program): Source URL: https://medicaid.ms.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Mississippi Self-Direction Services** (State Program): Source URL: https://www.dmh.ms.gov
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Mississippi Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Mississippi Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.dmh.ms.gov
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Mississippi)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Mississippi Developmental Services Intake** (dd_intake): Website: https://dhhs.mississippi.gov/dd | Phone: None | Status: `manual_review_required`
- **Mississippi Early Intervention State Office** (early_intervention): Website: https://dhhs.mississippi.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adams County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Alcorn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Amite County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Attala County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bolivar County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calhoun County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chickasaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Choctaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Claiborne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clarke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Coahoma County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Copiah County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Covington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| DeSoto County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Forrest County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| George County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greene County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grenada County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hancock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harrison County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Hinds County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Holmes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Humphreys County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Issaquena County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Itawamba County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jasper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson Davis County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jones County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kemper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lafayette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lamar County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lauderdale County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lawrence County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Leake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Leflore County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lowndes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marshall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Neshoba County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Newton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Noxubee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oktibbeha County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Panola County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pearl River County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Perry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pike County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pontotoc County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Prentiss County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Quitman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rankin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scott County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sharkey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Simpson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Smith County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sunflower County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tallahatchie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tate County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tippah County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tishomingo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tunica County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Walthall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Warren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Webster County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wilkinson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Winston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yalobusha County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yazoo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Adams County storefront office | Adams County | `off-adams-ms-medicaid` |
| Office | Alcorn County storefront office | Alcorn County | `off-alcorn-ms-medicaid` |
| Office | Amite County storefront office | Amite County | `off-amite-ms-medicaid` |
| Office | Attala County storefront office | Attala County | `off-attala-ms-medicaid` |
| Office | Benton County storefront office | Benton County | `off-benton-ms-medicaid` |
| Office | Bolivar County storefront office | Bolivar County | `off-bolivar-ms-medicaid` |
| Office | Calhoun County storefront office | Calhoun County | `off-calhoun-ms-medicaid` |
| Office | Carroll County storefront office | Carroll County | `off-carroll-ms-medicaid` |
| Office | Chickasaw County storefront office | Chickasaw County | `off-chickasaw-ms-medicaid` |
| Office | Choctaw County storefront office | Choctaw County | `off-choctaw-ms-medicaid` |
| Office | Claiborne County storefront office | Claiborne County | `off-claiborne-ms-medicaid` |
| Office | Clarke County storefront office | Clarke County | `off-clarke-ms-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-ms-medicaid` |
| Office | Coahoma County storefront office | Coahoma County | `off-coahoma-ms-medicaid` |
| Office | Copiah County storefront office | Copiah County | `off-copiah-ms-medicaid` |
| Office | Covington County storefront office | Covington County | `off-covington-ms-medicaid` |
| Office | DeSoto County storefront office | DeSoto County | `off-desoto-ms-medicaid` |
| Office | Forrest County storefront office | Forrest County | `off-forrest-ms-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-ms-medicaid` |
| Office | George County storefront office | George County | `off-george-ms-medicaid` |
| Office | Greene County storefront office | Greene County | `off-greene-ms-medicaid` |
| Office | Grenada County storefront office | Grenada County | `off-grenada-ms-medicaid` |
| Office | Hancock County storefront office | Hancock County | `off-hancock-ms-medicaid` |
| Office | Harrison County storefront office | Harrison County | `off-harrison-ms-medicaid` |
| Office | Hinds County storefront office | Hinds County | `off-hinds-ms-medicaid` |
| Office | Holmes County storefront office | Holmes County | `off-holmes-ms-medicaid` |
| Office | Humphreys County storefront office | Humphreys County | `off-humphreys-ms-medicaid` |
| Office | Issaquena County storefront office | Issaquena County | `off-issaquena-ms-medicaid` |
| Office | Itawamba County storefront office | Itawamba County | `off-itawamba-ms-medicaid` |
| Office | Jackson County storefront office | Jackson County | `off-jackson-ms-medicaid` |
| Office | Jasper County storefront office | Jasper County | `off-jasper-ms-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-ms-medicaid` |
| Office | Jefferson Davis County storefront office | Jefferson Davis County | `off-jefferson-davis-ms-medicaid` |
| Office | Jones County storefront office | Jones County | `off-jones-ms-medicaid` |
| Office | Kemper County storefront office | Kemper County | `off-kemper-ms-medicaid` |
| Office | Lafayette County storefront office | Lafayette County | `off-lafayette-ms-medicaid` |
| Office | Lamar County storefront office | Lamar County | `off-lamar-ms-medicaid` |
| Office | Lauderdale County storefront office | Lauderdale County | `off-lauderdale-ms-medicaid` |
| Office | Lawrence County storefront office | Lawrence County | `off-lawrence-ms-medicaid` |
| Office | Leake County storefront office | Leake County | `off-leake-ms-medicaid` |
| Office | Lee County storefront office | Lee County | `off-lee-ms-medicaid` |
| Office | Leflore County storefront office | Leflore County | `off-leflore-ms-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-ms-medicaid` |
| Office | Lowndes County storefront office | Lowndes County | `off-lowndes-ms-medicaid` |
| Office | Madison County storefront office | Madison County | `off-madison-ms-medicaid` |
| Office | Marion County storefront office | Marion County | `off-marion-ms-medicaid` |
| Office | Marshall County storefront office | Marshall County | `off-marshall-ms-medicaid` |
| Office | Monroe County storefront office | Monroe County | `off-monroe-ms-medicaid` |
| Office | Montgomery County storefront office | Montgomery County | `off-montgomery-ms-medicaid` |
| Office | Neshoba County storefront office | Neshoba County | `off-neshoba-ms-medicaid` |
| ... | *and 196 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
