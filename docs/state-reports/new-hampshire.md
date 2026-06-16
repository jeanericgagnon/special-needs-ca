# Data Provenance Report: New Hampshire (NH)

This report details the data sources, records count, trust classifications, and launch readiness for the State of New Hampshire under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **36.8%** (Manual Review Rate: **63.16%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `New Hampshire Medicaid`
- **Waiver Program Name**: `New Hampshire HCBS Waivers`
- **Personal Care Program**: `New Hampshire Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `New Hampshire Bureau of Developmental Services`
- **State Education Agency**: `New Hampshire Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `New Hampshire Early Intervention`
- **ABLE Savings Program**: `New Hampshire ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 10
- **County Social Service Storefronts**: 10
- **School Districts**: 10
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 30
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 49 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 21 records
- **Manual Review Backlog (Flagged)**: 36 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **New Hampshire ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **New Hampshire Children's Health Insurance Program (CHIP)** (State Program): Source URL: None
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **New Hampshire Early Intervention Services** (State Program): Source URL: None
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **New Hampshire HCBS Waivers** (State Program): Source URL: None
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for New Hampshire resident...
- **New Hampshire Medicaid** (State Program): Source URL: None
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **New Hampshire Medicaid Personal Care** (State Program): Source URL: None
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **New Hampshire Self-Direction Services** (State Program): Source URL: None
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **New Hampshire Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **New Hampshire Transition & Vocational Rehabilitation** (State Program): Source URL: None
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (New Hampshire)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **New Hampshire Developmental Services Intake** (dd_intake): Website: https://dhhs.new-hampshire.gov/dd | Phone: None | Status: `manual_review_required`
- **New Hampshire Early Intervention State Office** (early_intervention): Website: https://dhhs.new-hampshire.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Belknap County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Carroll County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cheshire County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Coös County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grafton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hillsborough County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Merrimack County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Rockingham County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Strafford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sullivan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Belknap County storefront office | Belknap County | `off-belknap-nh-medicaid` |
| Office | Carroll County storefront office | Carroll County | `off-carroll-nh-medicaid` |
| Office | Cheshire County storefront office | Cheshire County | `off-cheshire-nh-medicaid` |
| Office | Coös County storefront office | Coös County | `off-co-s-nh-medicaid` |
| Office | Grafton County storefront office | Grafton County | `off-grafton-nh-medicaid` |
| Office | Hillsborough County storefront office | Hillsborough County | `off-hillsborough-nh-medicaid` |
| Office | Merrimack County storefront office | Merrimack County | `off-merrimack-nh-medicaid` |
| Office | Rockingham County storefront office | Rockingham County | `off-rockingham-nh-medicaid` |
| Office | Strafford County storefront office | Strafford County | `off-strafford-nh-medicaid` |
| Office | Sullivan County storefront office | Sullivan County | `off-sullivan-nh-medicaid` |
| School District | Hillsborough Public Schools Special Education | Hillsborough County | `sd-hillsborough-nh` |
| School District | Rockingham Public Schools Special Education | Rockingham County | `sd-rockingham-nh` |
| School District | Belknap County School District | Belknap County | `sd-belknap-nh` |
| School District | Carroll County School District | Carroll County | `sd-carroll-nh` |
| School District | Cheshire County School District | Cheshire County | `sd-cheshire-nh` |
| School District | Coös County School District | Coös County | `sd-co-s-nh` |
| School District | Grafton County School District | Grafton County | `sd-grafton-nh` |
| School District | Merrimack County School District | Merrimack County | `sd-merrimack-nh` |
| School District | Strafford County School District | Strafford County | `sd-strafford-nh` |
| School District | Sullivan County School District | Sullivan County | `sd-sullivan-nh` |
| Nonprofit | The Arc of New Hampshire | Belknap County | `nh-np-arc-belknap-nh` |
| Nonprofit | The Arc of New Hampshire | Carroll County | `nh-np-arc-carroll-nh` |
| Nonprofit | The Arc of New Hampshire | Cheshire County | `nh-np-arc-cheshire-nh` |
| Nonprofit | The Arc of New Hampshire | Coös County | `nh-np-arc-co-s-nh` |
| Nonprofit | The Arc of New Hampshire | Grafton County | `nh-np-arc-grafton-nh` |
| Nonprofit | The Arc of New Hampshire | Hillsborough County | `nh-np-arc-hillsborough-nh` |
| Nonprofit | The Arc of New Hampshire | Merrimack County | `nh-np-arc-merrimack-nh` |
| Nonprofit | The Arc of New Hampshire | Rockingham County | `nh-np-arc-rockingham-nh` |
| Nonprofit | The Arc of New Hampshire | Strafford County | `nh-np-arc-strafford-nh` |
| Nonprofit | The Arc of New Hampshire | Sullivan County | `nh-np-arc-sullivan-nh` |
| IEP Advocate | New Hampshire Protection & Advocacy Legal Aid | Belknap County | `nh-adv-legal-statewide` |
| IEP Advocate | New Hampshire Protection & Advocacy Legal Aid | Carroll County | `nh-adv-legal-statewide` |
| IEP Advocate | New Hampshire Protection & Advocacy Legal Aid | Cheshire County | `nh-adv-legal-statewide` |
| IEP Advocate | New Hampshire Protection & Advocacy Legal Aid | Coös County | `nh-adv-legal-statewide` |
| IEP Advocate | New Hampshire Protection & Advocacy Legal Aid | Grafton County | `nh-adv-legal-statewide` |
| IEP Advocate | New Hampshire Protection & Advocacy Legal Aid | Hillsborough County | `nh-adv-legal-statewide` |
| IEP Advocate | New Hampshire Protection & Advocacy Legal Aid | Merrimack County | `nh-adv-legal-statewide` |
| IEP Advocate | New Hampshire Protection & Advocacy Legal Aid | Rockingham County | `nh-adv-legal-statewide` |
| IEP Advocate | New Hampshire Protection & Advocacy Legal Aid | Strafford County | `nh-adv-legal-statewide` |
| IEP Advocate | New Hampshire Protection & Advocacy Legal Aid | Sullivan County | `nh-adv-legal-statewide` |
| IEP Advocate | New Hampshire Parent Training Network | Belknap County | `nh-adv-parent-statewide` |
| IEP Advocate | New Hampshire Parent Training Network | Carroll County | `nh-adv-parent-statewide` |
| IEP Advocate | New Hampshire Parent Training Network | Cheshire County | `nh-adv-parent-statewide` |
| IEP Advocate | New Hampshire Parent Training Network | Coös County | `nh-adv-parent-statewide` |
| IEP Advocate | New Hampshire Parent Training Network | Grafton County | `nh-adv-parent-statewide` |
| IEP Advocate | New Hampshire Parent Training Network | Hillsborough County | `nh-adv-parent-statewide` |
| IEP Advocate | New Hampshire Parent Training Network | Merrimack County | `nh-adv-parent-statewide` |
| IEP Advocate | New Hampshire Parent Training Network | Rockingham County | `nh-adv-parent-statewide` |
| IEP Advocate | New Hampshire Parent Training Network | Strafford County | `nh-adv-parent-statewide` |
| IEP Advocate | New Hampshire Parent Training Network | Sullivan County | `nh-adv-parent-statewide` |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
