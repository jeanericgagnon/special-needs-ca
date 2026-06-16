# Data Provenance Report: Wyoming (WY)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Wyoming under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **60.7%** (Manual Review Rate: **39.34%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Wyoming Medicaid`
- **Waiver Program Name**: `Wyoming HCBS Waivers`
- **Personal Care Program**: `Wyoming Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Wyoming Developmental Disabilities Division`
- **State Education Agency**: `Wyoming Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Wyoming Early Intervention`
- **ABLE Savings Program**: `Wyoming ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 23
- **County Social Service Storefronts**: 23
- **School Districts**: 23
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 16
- **Local Nonprofit Support Organizations**: 69
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 101 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 74 records
- **Manual Review Backlog (Flagged)**: 48 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **SSI for Children (Wyoming)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...
- **Wyoming ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Wyoming Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://health.wyo.gov/healthcarefin
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Wyoming Early Intervention Services** (State Program): Source URL: https://health.wyo.gov/behavioralhealth/dd
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Wyoming HCBS Waivers** (State Program): Source URL: https://health.wyo.gov/behavioralhealth/dd/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Wyoming residents.
- **Wyoming Medicaid** (State Program): Source URL: https://health.wyo.gov/healthcarefin
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Wyoming Medicaid Personal Care** (State Program): Source URL: https://health.wyo.gov/healthcarefin
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Wyoming Self-Direction Services** (State Program): Source URL: https://health.wyo.gov/behavioralhealth/dd
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Wyoming Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Wyoming Transition & Vocational Rehabilitation** (State Program): Source URL: https://health.wyo.gov/behavioralhealth/dd
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Bighorn Development Center (Region 2)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-2 | Phone: (307) 672-6610 | Status: `source_listed`
- **Carbon County Child Development Center (Region 8)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-8 | Phone: (307) 324-9656 | Status: `source_listed`
- **Child Development Center of Natrona County (Region 9)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-9 | Phone: (307) 235-5097 | Status: `source_listed`
- **Child Development Services of Fremont County (Region 6)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-6 | Phone: (307) 332-5508 | Status: `source_listed`
- **Children's Developmental Services of Campbell County (Region 13)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-13 | Phone: (307) 682-2392 | Status: `source_listed`
- **Children's Resource Center (Region 1)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-1 | Phone: (307) 587-1331 | Status: `source_listed`
- **Developmental Preschool & Day Care Center (Region 11)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-11 | Phone: (307) 742-3571 | Status: `source_listed`
- **STRIDE Learning Center (Region 12)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-12 | Phone: (307) 632-2991 | Status: `source_listed`
- **Shoshone & Arapaho Early Intervention Program (Region 14)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-14 | Phone: (307) 332-3516 | Status: `source_listed`
- **Sweetwater County Child Development Center (Region 7)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-7 | Phone: (307) 875-0268 | Status: `source_listed`
- **Teton County Child Development Center (Region 4)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-4 | Phone: (307) 733-1616 | Status: `source_listed`
- **Uinta County Child Development Center (Region 5)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-5 | Phone: (307) 782-6602 | Status: `source_listed`
- **Weston County Children's Center (Region 3)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-3 | Phone: (307) 746-4560 | Status: `source_listed`
- **Wyoming Child and Family Development (Region 10)** (early_intervention): Website: https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-10 | Phone: (307) 836-2751 | Status: `source_listed`
- **Wyoming Developmental Services Intake** (dd_intake): Website: https://dhhs.wyoming.gov/dd | Phone: None | Status: `manual_review_required`
- **Wyoming Early Intervention State Office** (early_intervention): Website: https://dhhs.wyoming.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Albany County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Big Horn County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Campbell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carbon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Converse County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crook County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fremont County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Goshen County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hot Springs County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Laramie County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Natrona County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Niobrara County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Park County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Platte County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sheridan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sublette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sweetwater County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Teton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Uinta County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washakie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Weston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Albany County storefront office | Albany County | `off-albany-wy-medicaid` |
| Office | Big Horn County storefront office | Big Horn County | `off-big-horn-wy-medicaid` |
| Office | Campbell County storefront office | Campbell County | `off-campbell-wy-medicaid` |
| Office | Carbon County storefront office | Carbon County | `off-carbon-wy-medicaid` |
| Office | Converse County storefront office | Converse County | `off-converse-wy-medicaid` |
| Office | Crook County storefront office | Crook County | `off-crook-wy-medicaid` |
| Office | Fremont County storefront office | Fremont County | `off-fremont-wy-medicaid` |
| Office | Goshen County storefront office | Goshen County | `off-goshen-wy-medicaid` |
| Office | Hot Springs County storefront office | Hot Springs County | `off-hot-springs-wy-medicaid` |
| Office | Johnson County storefront office | Johnson County | `off-johnson-wy-medicaid` |
| Office | Laramie County storefront office | Laramie County | `off-laramie-wy-medicaid` |
| Office | Lincoln County storefront office | Lincoln County | `off-lincoln-wy-medicaid` |
| Office | Natrona County storefront office | Natrona County | `off-natrona-wy-medicaid` |
| Office | Niobrara County storefront office | Niobrara County | `off-niobrara-wy-medicaid` |
| Office | Park County storefront office | Park County | `off-park-wy-medicaid` |
| Office | Platte County storefront office | Platte County | `off-platte-wy-medicaid` |
| Office | Sheridan County storefront office | Sheridan County | `off-sheridan-wy-medicaid` |
| Office | Sublette County storefront office | Sublette County | `off-sublette-wy-medicaid` |
| Office | Sweetwater County storefront office | Sweetwater County | `off-sweetwater-wy-medicaid` |
| Office | Teton County storefront office | Teton County | `off-teton-wy-medicaid` |
| Office | Uinta County storefront office | Uinta County | `off-uinta-wy-medicaid` |
| Office | Washakie County storefront office | Washakie County | `off-washakie-wy-medicaid` |
| Office | Weston County storefront office | Weston County | `off-weston-wy-medicaid` |
| School District | Laramie Public Schools Special Education | Laramie County | `sd-laramie-wy` |
| School District | Natrona Public Schools Special Education | Natrona County | `sd-natrona-wy` |
| Nonprofit | The Arc of Wyoming | Albany County | `wy-np-arc-albany-wy` |
| Nonprofit | The Arc of Wyoming | Big Horn County | `wy-np-arc-big-horn-wy` |
| Nonprofit | The Arc of Wyoming | Campbell County | `wy-np-arc-campbell-wy` |
| Nonprofit | The Arc of Wyoming | Carbon County | `wy-np-arc-carbon-wy` |
| Nonprofit | The Arc of Wyoming | Converse County | `wy-np-arc-converse-wy` |
| Nonprofit | The Arc of Wyoming | Crook County | `wy-np-arc-crook-wy` |
| Nonprofit | The Arc of Wyoming | Fremont County | `wy-np-arc-fremont-wy` |
| Nonprofit | The Arc of Wyoming | Goshen County | `wy-np-arc-goshen-wy` |
| Nonprofit | The Arc of Wyoming | Hot Springs County | `wy-np-arc-hot-springs-wy` |
| Nonprofit | The Arc of Wyoming | Johnson County | `wy-np-arc-johnson-wy` |
| Nonprofit | The Arc of Wyoming | Laramie County | `wy-np-arc-laramie-wy` |
| Nonprofit | The Arc of Wyoming | Lincoln County | `wy-np-arc-lincoln-wy` |
| Nonprofit | The Arc of Wyoming | Natrona County | `wy-np-arc-natrona-wy` |
| Nonprofit | The Arc of Wyoming | Niobrara County | `wy-np-arc-niobrara-wy` |
| Nonprofit | The Arc of Wyoming | Park County | `wy-np-arc-park-wy` |
| Nonprofit | The Arc of Wyoming | Platte County | `wy-np-arc-platte-wy` |
| Nonprofit | The Arc of Wyoming | Sheridan County | `wy-np-arc-sheridan-wy` |
| Nonprofit | The Arc of Wyoming | Sublette County | `wy-np-arc-sublette-wy` |
| Nonprofit | The Arc of Wyoming | Sweetwater County | `wy-np-arc-sweetwater-wy` |
| Nonprofit | The Arc of Wyoming | Teton County | `wy-np-arc-teton-wy` |
| Nonprofit | The Arc of Wyoming | Uinta County | `wy-np-arc-uinta-wy` |
| Nonprofit | The Arc of Wyoming | Washakie County | `wy-np-arc-washakie-wy` |
| Nonprofit | The Arc of Wyoming | Weston County | `wy-np-arc-weston-wy` |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
