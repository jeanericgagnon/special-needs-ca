# Data Provenance Report: North Carolina (NC)

This report details the data sources, records count, trust classifications, and launch readiness for the State of North Carolina under the V3 release-quality standards as of June 2026.

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
- **Medicaid Program Name**: `North Carolina Medicaid`
- **Waiver Program Name**: `North Carolina Innovations HCBS Waiver`
- **Personal Care Program**: `North Carolina Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `North Carolina Division of Mental Health, Developmental Disabilities and Substance Abuse Services`
- **State Education Agency**: `North Carolina Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `North Carolina Early Intervention`
- **ABLE Savings Program**: `North Carolina ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 100
- **County Social Service Storefronts**: 100
- **School Districts**: 100
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 300
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 423 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 192 records
- **Manual Review Backlog (Flagged)**: 0 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **North Carolina ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **North Carolina Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://medicaid.ncdhhs.gov
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **North Carolina Early Intervention Services** (State Program): Source URL: https://www.ncdhhs.gov/divisions/mhddsas
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **North Carolina Innovations HCBS Waiver** (State Program): Source URL: https://www.ncdhhs.gov/innovations/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for North Carolina residen...
- **North Carolina Medicaid** (State Program): Source URL: https://medicaid.ncdhhs.gov
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **North Carolina Medicaid Personal Care** (State Program): Source URL: https://medicaid.ncdhhs.gov
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **North Carolina Self-Direction Services** (State Program): Source URL: https://www.ncdhhs.gov/divisions/mhddsas
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **North Carolina Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **North Carolina Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.ncdhhs.gov/divisions/mhddsas
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (North Carolina)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **North Carolina CDSA Early Intervention** (early_intervention): Website: https://www.ncdhhs.gov/divisions/child-and-family-well-being/early-intervention-section | Phone: (919) 707-5520 | Status: `official_verified`
- **North Carolina LME/MCO System (Innovations Waiver)** (dd_intake): Website: https://www.ncdhhs.gov/providers/lmemco-directory | Phone: (800) 662-7030 | Status: `official_verified`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Alamance County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Alexander County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Alleghany County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Anson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ashe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Avery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Beaufort County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bertie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bladen County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Brunswick County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Buncombe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Burke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cabarrus County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Caldwell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Camden County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carteret County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Caswell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Catawba County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chatham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cherokee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chowan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cleveland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Columbus County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Craven County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cumberland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Currituck County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dare County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Davidson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Davie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Duplin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Durham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Edgecombe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Forsyth County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gaston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gates County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Graham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Granville County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Greene County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Guilford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Halifax County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Harnett County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Haywood County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Henderson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hertford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hoke County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hyde County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Iredell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Johnston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jones County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lenoir County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lincoln County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Macon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Martin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| McDowell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mecklenburg County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Mitchell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Moore County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Nash County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| New Hanover County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Northampton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Onslow County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Orange County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pamlico County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pasquotank County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pender County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Perquimans County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Person County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Pitt County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Randolph County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Richmond County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Robeson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rockingham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rowan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rutherford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sampson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Scotland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stanly County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Stokes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Surry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Swain County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Transylvania County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tyrrell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Union County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Vance County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wake County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Warren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Watauga County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wilkes County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wilson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yadkin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yancey County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
