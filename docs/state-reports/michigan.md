# Data Provenance Report: Michigan (MI)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Michigan under the V3 release-quality standards as of June 2026.

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
- **Medicaid Program Name**: `Michigan Medicaid`
- **Waiver Program Name**: `Michigan HCBS Waivers`
- **Personal Care Program**: `Michigan Medicaid Personal Care`
- **Developmental Disability (DD) Agency**: `Michigan Department of Health and Human Services`
- **State Education Agency**: `Michigan Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Michigan Early Intervention`
- **ABLE Savings Program**: `Michigan ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 83
- **County Social Service Storefronts**: 83
- **School Districts**: 83
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 249
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 356 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 157 records
- **Manual Review Backlog (Flagged)**: 0 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Michigan ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Michigan Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://www.michigan.gov/medicaid
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Michigan Early Intervention Services** (State Program): Source URL: https://www.michigan.gov/mdhhs
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Michigan HCBS Waivers** (State Program): Source URL: https://www.michigan.gov/mdhhs/hcbs/eligibility
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Michigan residents.
- **Michigan Medicaid** (State Program): Source URL: https://www.michigan.gov/medicaid
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Michigan Medicaid Personal Care** (State Program): Source URL: https://www.michigan.gov/medicaid
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Michigan Self-Direction Services** (State Program): Source URL: https://www.michigan.gov/mdhhs
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Michigan Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Michigan Transition & Vocational Rehabilitation** (State Program): Source URL: https://www.michigan.gov/mdhhs
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Michigan)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Michigan Community Mental Health (CMHSP) DD Services** (dd_intake): Website: https://www.michigan.gov/mdhhs/keep-mi-healthy/mentalhealth/mentalhealth/community-mental-health-addresses-and-phone-numbers | Phone: (517) 335-0196 | Status: `official_verified`
- **Michigan Early On Early Intervention** (early_intervention): Website: https://www.1800earlyon.org/ | Phone: (800) 327-5966 | Status: `official_verified`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Alcona County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Alger County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Allegan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Alpena County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Antrim County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Arenac County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Baraga County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Barry County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Bay County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Benzie County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Berrien County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Branch County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Calhoun County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cass County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Charlevoix County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Cheboygan County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Chippewa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clare County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Clinton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Crawford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Delta County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Dickinson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Eaton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Emmet County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Genesee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gladwin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gogebic County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Grand Traverse County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Gratiot County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Hillsdale County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Houghton County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Huron County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ingham County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ionia County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Iosco County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Iron County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Isabella County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kalamazoo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kalkaska County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kent County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Keweenaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lapeer County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Leelanau County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lenawee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Livingston County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Luce County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mackinac County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Macomb County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Manistee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Marquette County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mason County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Mecosta County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Menominee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Midland County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Missaukee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Monroe County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montcalm County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Montmorency County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Muskegon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Newaygo County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oakland County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Oceana County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ogemaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ontonagon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Osceola County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Oscoda County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Otsego County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ottawa County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Presque Isle County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Roscommon County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Saginaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sanilac County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Schoolcraft County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Shiawassee County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Clair County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| St. Joseph County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Tuscola County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Van Buren County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Washtenaw County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Wexford County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
