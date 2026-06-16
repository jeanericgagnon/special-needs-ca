# Data Provenance Report: New Jersey (NJ)

This report details the data sources, records count, trust classifications, and launch readiness for the State of New Jersey under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **100.0%** (Manual Review Rate: **0.0%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `New Jersey Medicaid`
- **Waiver Program Name**: `New Jersey HCBS Waivers`
- **Personal Care Program**: `New Jersey Personal Care Assistant Program`
- **Developmental Disability (DD) Agency**: `New Jersey Division of Developmental Disabilities`
- **State Education Agency**: `New Jersey Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `New Jersey Early Intervention`
- **ABLE Savings Program**: `New Jersey ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 21
- **County Social Service Storefronts**: 21
- **School Districts**: 21
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 15
- **Local Nonprofit Support Organizations**: 63
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 91 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 112 records
- **Manual Review Backlog (Flagged)**: 0 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **New Jersey ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **New Jersey Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.nj.gov/humanservices/dmahs
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **New Jersey Early Intervention Services** (State Program): Source URL: https://www.nj.gov/humanservices/ddd
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **New Jersey HCBS Waivers** (State Program): Source URL: https://www.nj.gov/humanservices/ddd/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for New Jersey residents.
- **New Jersey Medicaid** (State Program): Source URL: https://www.nj.gov/humanservices/dmahs
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **New Jersey Personal Care Assistant Program** (State Program): Source URL: https://www.nj.gov/humanservices/dmahs
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **New Jersey Self-Direction Services** (State Program): Source URL: https://www.nj.gov/humanservices/ddd
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **New Jersey Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **New Jersey Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.nj.gov/humanservices/ddd
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (New Jersey)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Egg Harbor Community Services Office** (regional_center): Website: https://nj.gov/humanservices/ddd/ | Phone: (609) 300-1898 | Status: `source_listed`
- **Family Link REIC** (early_intervention): Website: https://www.nj.gov/health/fhs/eis/ | Phone: (908) 964-5303 | Status: `source_listed`
- **Flanders Community Services Office** (regional_center): Website: https://nj.gov/humanservices/ddd/ | Phone: (973) 927-2600 | Status: `source_listed`
- **Freehold Community Services Office** (regional_center): Website: https://nj.gov/humanservices/ddd/ | Phone: (732) 863-4500 | Status: `source_listed`
- **Green Brook Community Services Office** (regional_center): Website: https://nj.gov/humanservices/ddd/ | Phone: (908) 226-7800 | Status: `source_listed`
- **Helpful Hands REIC** (early_intervention): Website: https://www.nj.gov/health/fhs/eis/ | Phone: (973) 256-8484 | Status: `source_listed`
- **Mid-Jersey CARES REIC** (early_intervention): Website: https://www.nj.gov/health/fhs/eis/ | Phone: (732) 937-5437 | Status: `source_listed`
- **New Jersey Developmental Services Intake** (dd_intake): Website: https://dhhs.new-jersey.gov/dd | Phone: None | Status: `manual_review_required`
- **New Jersey Division of Developmental Disabilities** (regional_center): Website: https://nj.gov/humanservices/ddd/ | Phone: (609) 633-1482 | Status: `source_listed`
- **New Jersey Early Intervention State Office** (early_intervention): Website: https://dhhs.new-jersey.gov/earlystart | Phone: None | Status: `manual_review_required`
- **Newark Community Services Office** (regional_center): Website: https://nj.gov/humanservices/ddd/ | Phone: (973) 693-5080 | Status: `source_listed`
- **Paterson Community Services Office** (regional_center): Website: https://nj.gov/humanservices/ddd/ | Phone: (973) 977-4004 | Status: `source_listed`
- **Southern New Jersey REIC** (early_intervention): Website: https://www.nj.gov/health/fhs/eis/ | Phone: (856) 768-6747 | Status: `source_listed`
- **Trenton Community Services Office** (regional_center): Website: https://nj.gov/humanservices/ddd/ | Phone: (609) 292-1922 | Status: `source_listed`
- **Voorhees Community Services Office** (regional_center): Website: https://nj.gov/humanservices/ddd/ | Phone: (856) 770-5404 | Status: `source_listed`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Atlantic County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bergen County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Burlington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Camden County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cape May County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cumberland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Essex County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gloucester County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hudson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hunterdon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mercer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Middlesex County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Monmouth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Morris County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ocean County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Passaic County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Salem County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Somerset County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sussex County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Warren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

---

## 8. Detailed County-Level Gap Registry
List of specific counties with zero resource mappings:
- **Counties Missing Social Service Offices**: None
- **Counties Missing School Districts**: None
- **Counties Missing Local Nonprofits**: None

---

## 9. Manual Review Queue Registry
List of records flagged as `manual_review_required` in the database, representing exactly what needs to be verified before this state can be advanced:

No records in manual review queue.


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
