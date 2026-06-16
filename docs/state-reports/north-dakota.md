# Data Provenance Report: North Dakota (ND)

This report details the data sources, records count, trust classifications, and launch readiness for the State of North Dakota under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.5%** (Manual Review Rate: **58.46%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `North Dakota Medicaid`
- **Waiver Program Name**: `North Dakota HCBS Waivers`
- **Personal Care Program**: `North Dakota Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `North Dakota Developmental Disabilities Division`
- **State Education Agency**: `North Dakota Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `North Dakota Early Intervention`
- **ABLE Savings Program**: `North Dakota ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 53
- **County Social Service Storefronts**: 53
- **School Districts**: 53
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 159
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 221 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 113 records
- **Manual Review Backlog (Flagged)**: 159 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **North Dakota ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **North Dakota Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.hhs.nd.gov/medicaid
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **North Dakota Early Intervention Services** (State Program): Source URL: https://www.hhs.nd.gov/dd
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **North Dakota HCBS Waivers** (State Program): Source URL: https://www.hhs.nd.gov/dd/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for North Dakota residents...
- **North Dakota Medicaid** (State Program): Source URL: https://www.hhs.nd.gov/medicaid
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **North Dakota Medicaid Personal Care** (State Program): Source URL: https://www.hhs.nd.gov/medicaid
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **North Dakota Self-Direction Services** (State Program): Source URL: https://www.hhs.nd.gov/dd
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **North Dakota Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **North Dakota Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.hhs.nd.gov/dd
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (North Dakota)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **North Dakota Developmental Services Intake** (dd_intake): Website: https://dhhs.north-dakota.gov/dd | Phone: None | Status: `manual_review_required`
- **North Dakota Early Intervention State Office** (early_intervention): Website: https://dhhs.north-dakota.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adams County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Barnes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Billings County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bottineau County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bowman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Burke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Burleigh County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Cass County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Cavalier County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dickey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Divide County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dunn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Eddy County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Emmons County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Foster County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Golden Valley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grand Forks County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grant County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Griggs County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hettinger County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kidder County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| LaMoure County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Logan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McHenry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McIntosh County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McKenzie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McLean County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mercer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mountrail County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nelson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oliver County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pembina County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pierce County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ramsey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ransom County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Renville County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Richland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rolette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sargent County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sheridan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sioux County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Slope County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Steele County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stutsman County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Towner County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Traill County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Walsh County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ward County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wells County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Williams County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Adams County storefront office | Adams County | `off-adams-nd-medicaid` |
| Office | Barnes County storefront office | Barnes County | `off-barnes-nd-medicaid` |
| Office | Benson County storefront office | Benson County | `off-benson-nd-medicaid` |
| Office | Billings County storefront office | Billings County | `off-billings-nd-medicaid` |
| Office | Bottineau County storefront office | Bottineau County | `off-bottineau-nd-medicaid` |
| Office | Bowman County storefront office | Bowman County | `off-bowman-nd-medicaid` |
| Office | Burke County storefront office | Burke County | `off-burke-nd-medicaid` |
| Office | Burleigh County storefront office | Burleigh County | `off-burleigh-nd-medicaid` |
| Office | Cass County storefront office | Cass County | `off-cass-nd-medicaid` |
| Office | Cavalier County storefront office | Cavalier County | `off-cavalier-nd-medicaid` |
| Office | Dickey County storefront office | Dickey County | `off-dickey-nd-medicaid` |
| Office | Divide County storefront office | Divide County | `off-divide-nd-medicaid` |
| Office | Dunn County storefront office | Dunn County | `off-dunn-nd-medicaid` |
| Office | Eddy County storefront office | Eddy County | `off-eddy-nd-medicaid` |
| Office | Emmons County storefront office | Emmons County | `off-emmons-nd-medicaid` |
| Office | Foster County storefront office | Foster County | `off-foster-nd-medicaid` |
| Office | Golden Valley County storefront office | Golden Valley County | `off-golden-valley-nd-medicaid` |
| Office | Grand Forks County storefront office | Grand Forks County | `off-grand-forks-nd-medicaid` |
| Office | Grant County storefront office | Grant County | `off-grant-nd-medicaid` |
| Office | Griggs County storefront office | Griggs County | `off-griggs-nd-medicaid` |
| Office | Hettinger County storefront office | Hettinger County | `off-hettinger-nd-medicaid` |
| Office | Kidder County storefront office | Kidder County | `off-kidder-nd-medicaid` |
| Office | LaMoure County storefront office | LaMoure County | `off-lamoure-nd-medicaid` |
| Office | Logan County storefront office | Logan County | `off-logan-nd-medicaid` |
| Office | McHenry County storefront office | McHenry County | `off-mchenry-nd-medicaid` |
| Office | McIntosh County storefront office | McIntosh County | `off-mcintosh-nd-medicaid` |
| Office | McKenzie County storefront office | McKenzie County | `off-mckenzie-nd-medicaid` |
| Office | McLean County storefront office | McLean County | `off-mclean-nd-medicaid` |
| Office | Mercer County storefront office | Mercer County | `off-mercer-nd-medicaid` |
| Office | Morton County storefront office | Morton County | `off-morton-nd-medicaid` |
| Office | Mountrail County storefront office | Mountrail County | `off-mountrail-nd-medicaid` |
| Office | Nelson County storefront office | Nelson County | `off-nelson-nd-medicaid` |
| Office | Oliver County storefront office | Oliver County | `off-oliver-nd-medicaid` |
| Office | Pembina County storefront office | Pembina County | `off-pembina-nd-medicaid` |
| Office | Pierce County storefront office | Pierce County | `off-pierce-nd-medicaid` |
| Office | Ramsey County storefront office | Ramsey County | `off-ramsey-nd-medicaid` |
| Office | Ransom County storefront office | Ransom County | `off-ransom-nd-medicaid` |
| Office | Renville County storefront office | Renville County | `off-renville-nd-medicaid` |
| Office | Richland County storefront office | Richland County | `off-richland-nd-medicaid` |
| Office | Rolette County storefront office | Rolette County | `off-rolette-nd-medicaid` |
| Office | Sargent County storefront office | Sargent County | `off-sargent-nd-medicaid` |
| Office | Sheridan County storefront office | Sheridan County | `off-sheridan-nd-medicaid` |
| Office | Sioux County storefront office | Sioux County | `off-sioux-nd-medicaid` |
| Office | Slope County storefront office | Slope County | `off-slope-nd-medicaid` |
| Office | Stark County storefront office | Stark County | `off-stark-nd-medicaid` |
| Office | Steele County storefront office | Steele County | `off-steele-nd-medicaid` |
| Office | Stutsman County storefront office | Stutsman County | `off-stutsman-nd-medicaid` |
| Office | Towner County storefront office | Towner County | `off-towner-nd-medicaid` |
| Office | Traill County storefront office | Traill County | `off-traill-nd-medicaid` |
| Office | Walsh County storefront office | Walsh County | `off-walsh-nd-medicaid` |
| ... | *and 109 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
