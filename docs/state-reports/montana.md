# Data Provenance Report: Montana (MT)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Montana under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **41.5%** (Manual Review Rate: **58.54%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Montana Medicaid`
- **Waiver Program Name**: `Montana HCBS Waivers`
- **Personal Care Program**: `Montana Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Montana Developmental Disabilities Program`
- **State Education Agency**: `Montana Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Montana Early Intervention`
- **ABLE Savings Program**: `Montana ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 56
- **County Social Service Storefronts**: 56
- **School Districts**: 56
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 168
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 233 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 119 records
- **Manual Review Backlog (Flagged)**: 168 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Montana ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Montana Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://dphhs.mt.gov/brd/medicaid
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Montana Early Intervention Services** (State Program): Source URL: https://dphhs.mt.gov/dsd/ddp
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Montana HCBS Waivers** (State Program): Source URL: https://dphhs.mt.gov/dsd/ddp/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Montana residents.
- **Montana Medicaid** (State Program): Source URL: https://dphhs.mt.gov/brd/medicaid
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Montana Medicaid Personal Care** (State Program): Source URL: https://dphhs.mt.gov/brd/medicaid
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Montana Self-Direction Services** (State Program): Source URL: https://dphhs.mt.gov/dsd/ddp
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Montana Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Montana Transition & Vocational Rehabilitation** (State Program): Source URL: https://dphhs.mt.gov/dsd/ddp
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Montana)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Montana Developmental Services Intake** (dd_intake): Website: https://dhhs.montana.gov/dd | Phone: None | Status: `manual_review_required`
- **Montana Early Intervention State Office** (early_intervention): Website: https://dhhs.montana.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Beaverhead County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Big Horn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Blaine County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Broadwater County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carbon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carter County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cascade County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chouteau County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Custer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Daniels County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dawson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Deer Lodge County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fallon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fergus County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Flathead County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gallatin County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Garfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Glacier County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Golden Valley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Granite County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hill County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Judith Basin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lewis and Clark County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Liberty County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McCone County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Meagher County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mineral County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Missoula County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Musselshell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Park County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Petroleum County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Phillips County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pondera County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Powder River County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Powell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Prairie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ravalli County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Richland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Roosevelt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rosebud County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sanders County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sheridan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Silver Bow County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stillwater County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sweet Grass County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Teton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Toole County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Treasure County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Valley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wheatland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wibaux County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yellowstone County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |

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
| Office | Beaverhead County storefront office | Beaverhead County | `off-beaverhead-mt-medicaid` |
| Office | Big Horn County storefront office | Big Horn County | `off-big-horn-mt-medicaid` |
| Office | Blaine County storefront office | Blaine County | `off-blaine-mt-medicaid` |
| Office | Broadwater County storefront office | Broadwater County | `off-broadwater-mt-medicaid` |
| Office | Carbon County storefront office | Carbon County | `off-carbon-mt-medicaid` |
| Office | Carter County storefront office | Carter County | `off-carter-mt-medicaid` |
| Office | Cascade County storefront office | Cascade County | `off-cascade-mt-medicaid` |
| Office | Chouteau County storefront office | Chouteau County | `off-chouteau-mt-medicaid` |
| Office | Custer County storefront office | Custer County | `off-custer-mt-medicaid` |
| Office | Daniels County storefront office | Daniels County | `off-daniels-mt-medicaid` |
| Office | Dawson County storefront office | Dawson County | `off-dawson-mt-medicaid` |
| Office | Deer Lodge County storefront office | Deer Lodge County | `off-deer-lodge-mt-medicaid` |
| Office | Fallon County storefront office | Fallon County | `off-fallon-mt-medicaid` |
| Office | Fergus County storefront office | Fergus County | `off-fergus-mt-medicaid` |
| Office | Flathead County storefront office | Flathead County | `off-flathead-mt-medicaid` |
| Office | Gallatin County storefront office | Gallatin County | `off-gallatin-mt-medicaid` |
| Office | Garfield County storefront office | Garfield County | `off-garfield-mt-medicaid` |
| Office | Glacier County storefront office | Glacier County | `off-glacier-mt-medicaid` |
| Office | Golden Valley County storefront office | Golden Valley County | `off-golden-valley-mt-medicaid` |
| Office | Granite County storefront office | Granite County | `off-granite-mt-medicaid` |
| Office | Hill County storefront office | Hill County | `off-hill-mt-medicaid` |
| Office | Jefferson County storefront office | Jefferson County | `off-jefferson-mt-medicaid` |
| Office | Judith Basin County storefront office | Judith Basin County | `off-judith-basin-mt-medicaid` |
| Office | Lake County storefront office | Lake County | `off-lake-mt-medicaid` |
| Office | Lewis and Clark County storefront office | Lewis and Clark County | `off-lewis-and-clark-mt-medicaid` |
| Office | Liberty County storefront office | Liberty County | `off-liberty-mt-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-mt-medicaid` |
| Office | Madison County storefront office | Madison County | `off-madison-mt-medicaid` |
| Office | McCone County storefront office | McCone County | `off-mccone-mt-medicaid` |
| Office | Meagher County storefront office | Meagher County | `off-meagher-mt-medicaid` |
| Office | Mineral County storefront office | Mineral County | `off-mineral-mt-medicaid` |
| Office | Missoula County storefront office | Missoula County | `off-missoula-mt-medicaid` |
| Office | Musselshell County storefront office | Musselshell County | `off-musselshell-mt-medicaid` |
| Office | Park County storefront office | Park County | `off-park-mt-medicaid` |
| Office | Petroleum County storefront office | Petroleum County | `off-petroleum-mt-medicaid` |
| Office | Phillips County storefront office | Phillips County | `off-phillips-mt-medicaid` |
| Office | Pondera County storefront office | Pondera County | `off-pondera-mt-medicaid` |
| Office | Powder River County storefront office | Powder River County | `off-powder-river-mt-medicaid` |
| Office | Powell County storefront office | Powell County | `off-powell-mt-medicaid` |
| Office | Prairie County storefront office | Prairie County | `off-prairie-mt-medicaid` |
| Office | Ravalli County storefront office | Ravalli County | `off-ravalli-mt-medicaid` |
| Office | Richland County storefront office | Richland County | `off-richland-mt-medicaid` |
| Office | Roosevelt County storefront office | Roosevelt County | `off-roosevelt-mt-medicaid` |
| Office | Rosebud County storefront office | Rosebud County | `off-rosebud-mt-medicaid` |
| Office | Sanders County storefront office | Sanders County | `off-sanders-mt-medicaid` |
| Office | Sheridan County storefront office | Sheridan County | `off-sheridan-mt-medicaid` |
| Office | Silver Bow County storefront office | Silver Bow County | `off-silver-bow-mt-medicaid` |
| Office | Stillwater County storefront office | Stillwater County | `off-stillwater-mt-medicaid` |
| Office | Sweet Grass County storefront office | Sweet Grass County | `off-sweet-grass-mt-medicaid` |
| Office | Teton County storefront office | Teton County | `off-teton-mt-medicaid` |
| ... | *and 118 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
