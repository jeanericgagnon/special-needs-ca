# Data Provenance Report: Nebraska (NE)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Nebraska under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **39.6%** (Manual Review Rate: **60.38%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Nebraska Medicaid`
- **Waiver Program Name**: `Nebraska HCBS Waivers`
- **Personal Care Program**: `Nebraska Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Nebraska Division of Developmental Disabilities`
- **State Education Agency**: `Nebraska Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Nebraska Early Intervention`
- **ABLE Savings Program**: `Nebraska ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 93
- **County Social Service Storefronts**: 93
- **School Districts**: 93
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 279
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 381 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 187 records
- **Manual Review Backlog (Flagged)**: 285 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Nebraska ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Nebraska Children's Health Insurance Program (CHIP)** (State Program): Source URL: None
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Nebraska Early Intervention Services** (State Program): Source URL: None
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Nebraska HCBS Waivers** (State Program): Source URL: None
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Nebraska residents.
- **Nebraska Medicaid** (State Program): Source URL: None
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Nebraska Medicaid Personal Care** (State Program): Source URL: None
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Nebraska Self-Direction Services** (State Program): Source URL: None
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Nebraska Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Nebraska Transition & Vocational Rehabilitation** (State Program): Source URL: None
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Nebraska)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Nebraska Developmental Services Intake** (dd_intake): Website: https://dhhs.nebraska.gov/dd | Phone: None | Status: `manual_review_required`
- **Nebraska Early Intervention State Office** (early_intervention): Website: https://dhhs.nebraska.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adams County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Antelope County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Arthur County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Banner County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Blaine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Box Butte County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boyd County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brown County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Buffalo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Burt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Butler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cass County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cedar County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chase County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cherry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cheyenne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Colfax County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cuming County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Custer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dakota County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dawes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dawson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Deuel County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dixon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dodge County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Dundy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fillmore County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Frontier County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Furnas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gage County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Garden County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Garfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gosper County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greeley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hall County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hamilton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harlan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hayes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hitchcock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Holt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hooker County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Howard County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kearney County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Keith County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Keya Paha County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kimball County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Knox County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lancaster County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Logan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Loup County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McPherson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Merrick County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morrill County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nance County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nemaha County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nuckolls County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Otoe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pawnee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Perkins County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Phelps County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pierce County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Platte County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Red Willow County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Richardson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rock County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saline County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sarpy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saunders County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scotts Bluff County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Seward County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sheridan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sherman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sioux County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stanton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Thayer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Thomas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Thurston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Valley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Webster County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wheeler County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| York County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Adams County storefront office | Adams County | `off-adams-ne-medicaid` |
| Office | Antelope County storefront office | Antelope County | `off-antelope-ne-medicaid` |
| Office | Arthur County storefront office | Arthur County | `off-arthur-ne-medicaid` |
| Office | Banner County storefront office | Banner County | `off-banner-ne-medicaid` |
| Office | Blaine County storefront office | Blaine County | `off-blaine-ne-medicaid` |
| Office | Boone County storefront office | Boone County | `off-boone-ne-medicaid` |
| Office | Box Butte County storefront office | Box Butte County | `off-box-butte-ne-medicaid` |
| Office | Boyd County storefront office | Boyd County | `off-boyd-ne-medicaid` |
| Office | Brown County storefront office | Brown County | `off-brown-ne-medicaid` |
| Office | Buffalo County storefront office | Buffalo County | `off-buffalo-ne-medicaid` |
| Office | Burt County storefront office | Burt County | `off-burt-ne-medicaid` |
| Office | Butler County storefront office | Butler County | `off-butler-ne-medicaid` |
| Office | Cass County storefront office | Cass County | `off-cass-ne-medicaid` |
| Office | Cedar County storefront office | Cedar County | `off-cedar-ne-medicaid` |
| Office | Chase County storefront office | Chase County | `off-chase-ne-medicaid` |
| Office | Cherry County storefront office | Cherry County | `off-cherry-ne-medicaid` |
| Office | Cheyenne County storefront office | Cheyenne County | `off-cheyenne-ne-medicaid` |
| Office | Clay County storefront office | Clay County | `off-clay-ne-medicaid` |
| Office | Colfax County storefront office | Colfax County | `off-colfax-ne-medicaid` |
| Office | Cuming County storefront office | Cuming County | `off-cuming-ne-medicaid` |
| Office | Custer County storefront office | Custer County | `off-custer-ne-medicaid` |
| Office | Dakota County storefront office | Dakota County | `off-dakota-ne-medicaid` |
| Office | Dawes County storefront office | Dawes County | `off-dawes-ne-medicaid` |
| Office | Dawson County storefront office | Dawson County | `off-dawson-ne-medicaid` |
| Office | Deuel County storefront office | Deuel County | `off-deuel-ne-medicaid` |
| Office | Dixon County storefront office | Dixon County | `off-dixon-ne-medicaid` |
| Office | Dodge County storefront office | Dodge County | `off-dodge-ne-medicaid` |
| Office | Douglas County storefront office | Douglas County | `off-douglas-ne-medicaid` |
| Office | Dundy County storefront office | Dundy County | `off-dundy-ne-medicaid` |
| Office | Fillmore County storefront office | Fillmore County | `off-fillmore-ne-medicaid` |
| Office | Franklin County storefront office | Franklin County | `off-franklin-ne-medicaid` |
| Office | Frontier County storefront office | Frontier County | `off-frontier-ne-medicaid` |
| Office | Furnas County storefront office | Furnas County | `off-furnas-ne-medicaid` |
| Office | Gage County storefront office | Gage County | `off-gage-ne-medicaid` |
| Office | Garden County storefront office | Garden County | `off-garden-ne-medicaid` |
| Office | Garfield County storefront office | Garfield County | `off-garfield-ne-medicaid` |
| Office | Gosper County storefront office | Gosper County | `off-gosper-ne-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-ne-medicaid` |
| Office | Greeley County storefront office | Greeley County | `off-greeley-ne-medicaid` |
| Office | Hall County storefront office | Hall County | `off-hall-ne-medicaid` |
| Office | Hamilton County storefront office | Hamilton County | `off-hamilton-ne-medicaid` |
| Office | Harlan County storefront office | Harlan County | `off-harlan-ne-medicaid` |
| Office | Hayes County storefront office | Hayes County | `off-hayes-ne-medicaid` |
| Office | Hitchcock County storefront office | Hitchcock County | `off-hitchcock-ne-medicaid` |
| Office | Holt County storefront office | Holt County | `off-holt-ne-medicaid` |
| Office | Hooker County storefront office | Hooker County | `off-hooker-ne-medicaid` |
| Office | Howard County storefront office | Howard County | `off-howard-ne-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-ne-medicaid` |
| Office | Johnson County storefront office | Johnson County | `off-johnson-ne-medicaid` |
| Office | Kearney County storefront office | Kearney County | `off-kearney-ne-medicaid` |
| ... | *and 235 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
