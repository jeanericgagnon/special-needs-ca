# Data Provenance Report: Colorado (CO)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Colorado under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **80.5%** (Manual Review Rate: **19.51%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Colorado Medicaid`
- **Waiver Program Name**: `Colorado HCBS Waivers`
- **Personal Care Program**: `Colorado Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Colorado Division for Developmental Disabilities`
- **State Education Agency**: `Colorado Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Colorado Early Intervention`
- **ABLE Savings Program**: `Colorado ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 64
- **County Social Service Storefronts**: 65
- **School Districts**: 64
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 192
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 263 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 264 records
- **Manual Review Backlog (Flagged)**: 64 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Colorado ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Colorado Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://hcpf.colorado.gov/pcs
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Colorado Early Intervention Services** (State Program): Source URL: https://hcpf.colorado.gov/developmental-disabilities
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Colorado HCBS Waivers** (State Program): Source URL: https://hcpf.colorado.gov/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Colorado residents.
- **Colorado Medicaid** (State Program): Source URL: https://hcpf.colorado.gov/pcs
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Colorado Medicaid Personal Care** (State Program): Source URL: https://hcpf.colorado.gov/pcs
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Colorado Self-Direction Services** (State Program): Source URL: https://hcpf.colorado.gov/developmental-disabilities
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Colorado Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Colorado Transition & Vocational Rehabilitation** (State Program): Source URL: https://hcpf.colorado.gov/developmental-disabilities
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Colorado)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Colorado Developmental Services Intake** (dd_intake): Website: https://dhhs.colorado.gov/dd | Phone: None | Status: `manual_review_required`
- **Colorado Early Intervention State Office** (early_intervention): Website: https://dhhs.colorado.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adams County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Alamosa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Arapahoe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Archuleta County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Baca County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bent County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Boulder County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chaffee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cheyenne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| City and County of Broomfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| City and County of Denver County | 2 | 1 | 3 | 4 | 🟢 COMPLETE |
| Clear Creek County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Conejos County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Costilla County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crowley County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Custer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Delta County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dolores County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Douglas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Eagle County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| El Paso County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Elbert County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fremont County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Garfield County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gilpin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grand County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gunnison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hinsdale County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Huerfano County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kiowa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kit Carson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| La Plata County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Larimer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Las Animas County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Logan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mesa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mineral County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Moffat County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montezuma County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montrose County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morgan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Otero County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ouray County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Park County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Phillips County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pitkin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Prowers County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pueblo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rio Blanco County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rio Grande County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Routt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saguache County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| San Juan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| San Miguel County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sedgwick County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Summit County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Teller County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Weld County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yuma County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Nonprofit | The Arc of Colorado | Adams County | `co-np-arc-adams-co` |
| Nonprofit | The Arc of Colorado | Alamosa County | `co-np-arc-alamosa-co` |
| Nonprofit | The Arc of Colorado | Arapahoe County | `co-np-arc-arapahoe-co` |
| Nonprofit | The Arc of Colorado | Archuleta County | `co-np-arc-archuleta-co` |
| Nonprofit | The Arc of Colorado | Baca County | `co-np-arc-baca-co` |
| Nonprofit | The Arc of Colorado | Bent County | `co-np-arc-bent-co` |
| Nonprofit | The Arc of Colorado | Boulder County | `co-np-arc-boulder-co` |
| Nonprofit | The Arc of Colorado | City and County of Broomfield County | `co-np-arc-city-and-county-of-broomfield-co` |
| Nonprofit | The Arc of Colorado | Chaffee County | `co-np-arc-chaffee-co` |
| Nonprofit | The Arc of Colorado | Cheyenne County | `co-np-arc-cheyenne-co` |
| Nonprofit | The Arc of Colorado | Clear Creek County | `co-np-arc-clear-creek-co` |
| Nonprofit | The Arc of Colorado | Conejos County | `co-np-arc-conejos-co` |
| Nonprofit | The Arc of Colorado | Costilla County | `co-np-arc-costilla-co` |
| Nonprofit | The Arc of Colorado | Crowley County | `co-np-arc-crowley-co` |
| Nonprofit | The Arc of Colorado | Custer County | `co-np-arc-custer-co` |
| Nonprofit | The Arc of Colorado | Delta County | `co-np-arc-delta-co` |
| Nonprofit | The Arc of Colorado | City and County of Denver County | `co-np-arc-city-and-county-of-denver-co` |
| Nonprofit | The Arc of Colorado | Dolores County | `co-np-arc-dolores-co` |
| Nonprofit | The Arc of Colorado | Douglas County | `co-np-arc-douglas-co` |
| Nonprofit | The Arc of Colorado | Eagle County | `co-np-arc-eagle-co` |
| Nonprofit | The Arc of Colorado | El Paso County | `co-np-arc-el-paso-co` |
| Nonprofit | The Arc of Colorado | Elbert County | `co-np-arc-elbert-co` |
| Nonprofit | The Arc of Colorado | Fremont County | `co-np-arc-fremont-co` |
| Nonprofit | The Arc of Colorado | Garfield County | `co-np-arc-garfield-co` |
| Nonprofit | The Arc of Colorado | Gilpin County | `co-np-arc-gilpin-co` |
| Nonprofit | The Arc of Colorado | Grand County | `co-np-arc-grand-co` |
| Nonprofit | The Arc of Colorado | Gunnison County | `co-np-arc-gunnison-co` |
| Nonprofit | The Arc of Colorado | Hinsdale County | `co-np-arc-hinsdale-co` |
| Nonprofit | The Arc of Colorado | Huerfano County | `co-np-arc-huerfano-co` |
| Nonprofit | The Arc of Colorado | Jackson County | `co-np-arc-jackson-co` |
| Nonprofit | The Arc of Colorado | Jefferson County | `co-np-arc-jefferson-co` |
| Nonprofit | The Arc of Colorado | Kiowa County | `co-np-arc-kiowa-co` |
| Nonprofit | The Arc of Colorado | Kit Carson County | `co-np-arc-kit-carson-co` |
| Nonprofit | The Arc of Colorado | La Plata County | `co-np-arc-la-plata-co` |
| Nonprofit | The Arc of Colorado | Lake County | `co-np-arc-lake-co` |
| Nonprofit | The Arc of Colorado | Larimer County | `co-np-arc-larimer-co` |
| Nonprofit | The Arc of Colorado | Las Animas County | `co-np-arc-las-animas-co` |
| Nonprofit | The Arc of Colorado | Lincoln County | `co-np-arc-lincoln-co` |
| Nonprofit | The Arc of Colorado | Logan County | `co-np-arc-logan-co` |
| Nonprofit | The Arc of Colorado | Mesa County | `co-np-arc-mesa-co` |
| Nonprofit | The Arc of Colorado | Mineral County | `co-np-arc-mineral-co` |
| Nonprofit | The Arc of Colorado | Moffat County | `co-np-arc-moffat-co` |
| Nonprofit | The Arc of Colorado | Montezuma County | `co-np-arc-montezuma-co` |
| Nonprofit | The Arc of Colorado | Montrose County | `co-np-arc-montrose-co` |
| Nonprofit | The Arc of Colorado | Morgan County | `co-np-arc-morgan-co` |
| Nonprofit | The Arc of Colorado | Otero County | `co-np-arc-otero-co` |
| Nonprofit | The Arc of Colorado | Ouray County | `co-np-arc-ouray-co` |
| Nonprofit | The Arc of Colorado | Park County | `co-np-arc-park-co` |
| Nonprofit | The Arc of Colorado | Phillips County | `co-np-arc-phillips-co` |
| Nonprofit | The Arc of Colorado | Pitkin County | `co-np-arc-pitkin-co` |
| ... | *and 14 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
