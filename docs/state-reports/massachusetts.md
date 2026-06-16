# Data Provenance Report: Massachusetts (MA)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Massachusetts under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **81.8%** (Manual Review Rate: **18.18%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Massachusetts Medicaid`
- **Waiver Program Name**: `Massachusetts HCBS Waivers`
- **Personal Care Program**: `MassHealth Personal Care Attendant Program`
- **Developmental Disability (DD) Agency**: `Massachusetts Department of Developmental Services`
- **State Education Agency**: `Massachusetts Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Massachusetts Early Intervention`
- **ABLE Savings Program**: `Massachusetts ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 14
- **County Social Service Storefronts**: 14
- **School Districts**: 14
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 42
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 63 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 63 records
- **Manual Review Backlog (Flagged)**: 14 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **MassHealth Personal Care Attendant Program** (State Program): Source URL: https://www.mass.gov/masshealth
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Massachusetts ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Massachusetts Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.mass.gov/masshealth
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Massachusetts Early Intervention Services** (State Program): Source URL: https://www.mass.gov/dds
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Massachusetts HCBS Waivers** (State Program): Source URL: https://www.mass.gov/dds/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Massachusetts resident...
- **Massachusetts Medicaid** (State Program): Source URL: https://www.mass.gov/masshealth
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Massachusetts Self-Direction Services** (State Program): Source URL: https://www.mass.gov/dds
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Massachusetts Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Massachusetts Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.mass.gov/dds
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Massachusetts)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Massachusetts Developmental Services Intake** (dd_intake): Website: https://dhhs.massachusetts.gov/dd | Phone: None | Status: `manual_review_required`
- **Massachusetts Early Intervention State Office** (early_intervention): Website: https://dhhs.massachusetts.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Barnstable County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Berkshire County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bristol County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dukes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Essex County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hampden County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hampshire County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Middlesex County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Nantucket County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Norfolk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Plymouth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Suffolk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Worcester County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |

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
| Nonprofit | The Arc of Massachusetts | Barnstable County | `ma-np-arc-barnstable-ma` |
| Nonprofit | The Arc of Massachusetts | Berkshire County | `ma-np-arc-berkshire-ma` |
| Nonprofit | The Arc of Massachusetts | Bristol County | `ma-np-arc-bristol-ma` |
| Nonprofit | The Arc of Massachusetts | Dukes County | `ma-np-arc-dukes-ma` |
| Nonprofit | The Arc of Massachusetts | Essex County | `ma-np-arc-essex-ma` |
| Nonprofit | The Arc of Massachusetts | Franklin County | `ma-np-arc-franklin-ma` |
| Nonprofit | The Arc of Massachusetts | Hampden County | `ma-np-arc-hampden-ma` |
| Nonprofit | The Arc of Massachusetts | Hampshire County | `ma-np-arc-hampshire-ma` |
| Nonprofit | The Arc of Massachusetts | Middlesex County | `ma-np-arc-middlesex-ma` |
| Nonprofit | The Arc of Massachusetts | Nantucket County | `ma-np-arc-nantucket-ma` |
| Nonprofit | The Arc of Massachusetts | Norfolk County | `ma-np-arc-norfolk-ma` |
| Nonprofit | The Arc of Massachusetts | Plymouth County | `ma-np-arc-plymouth-ma` |
| Nonprofit | The Arc of Massachusetts | Suffolk County | `ma-np-arc-suffolk-ma` |
| Nonprofit | The Arc of Massachusetts | Worcester County | `ma-np-arc-worcester-ma` |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
