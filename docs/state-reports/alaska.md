# Data Provenance Report: Alaska (AK)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Alaska under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Skeleton)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **43.9%** (Manual Review Rate: **56.07%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Developmental Disability Agency`
- **Medicaid Program Name**: `Alaska Medicaid`
- **Waiver Program Name**: `Alaska HCBS Waivers`
- **Personal Care Program**: `Alaska Personal Care Services`
- **Developmental Disability (DD) Agency**: `Alaska Division of Senior and Disabilities Services`
- **State Education Agency**: `Alaska Department of Education`
- **State Education Agency SPED Label**: `Regional Special Education Agencies`
- **State Early Intervention Label**: `Alaska Early Intervention`
- **ABLE Savings Program**: `Alaska ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 20
- **County Social Service Storefronts**: 20
- **School Districts**: 20
- **Regional Education Agencies (REAs)**: 1
- **State-Level Resource Agencies**: 2
- **Local Nonprofit Support Organizations**: 60
- **Special Education (IEP) Advocates/Attorneys**: 6
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 89 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 47 records
- **Manual Review Backlog (Flagged)**: 60 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Alaska ABLE Program** (State Program): Source URL: https://www.ablenrc.org
  * Description: Tax-advantaged savings accounts for individuals with disabilities, protecting eligibility for public benefits.
- **Alaska Children's Health Insurance Program (CHIP)** (State Program): Source URL: https://dhss.alaska.gov/dsds/Pages/pcs
  * Description: Health insurance coverage for children in families whose income is too high to qualify for Medicaid.
- **Alaska Early Intervention Services** (State Program): Source URL: https://dhss.alaska.gov/dsds
  * Description: State early childhood intervention program offering therapies and evaluations for infants and toddlers with delays.
- **Alaska HCBS Waivers** (State Program): Source URL: https://dhss.alaska.gov/dsds/Pages/hcbw/eligibility.aspx
  * Description: Home and community-based services waiver providing respite, habilitation, and family supports for Alaska residents.
- **Alaska Medicaid** (State Program): Source URL: https://dhss.alaska.gov/dsds/Pages/pcs
  * Description: State-administered healthcare program offering comprehensive medical coverage for low-income individuals and waiver part...
- **Alaska Personal Care Services** (State Program): Source URL: https://dhss.alaska.gov/dsds/Pages/pcs
  * Description: In-home personal care services assisting with daily living activities under the state Medicaid plan.
- **Alaska Self-Direction Services** (State Program): Source URL: https://dhss.alaska.gov/dsds
  * Description: Participant-directed service option allowing individuals and families to manage their own service budget and hire caregi...
- **Alaska Special Education IEP** (State Program): Source URL: https://www.ed.gov
  * Description: Individualized Education Program (IEP) services and school accommodations administered by local school districts.
- **Alaska Transition & Vocational Rehabilitation** (State Program): Source URL: https://dhss.alaska.gov/dsds
  * Description: Vocational rehabilitation and transition services assisting students with disabilities to prepare for employment.
- **SSI for Children (Alaska)** (State Program): Source URL: https://www.ssa.gov
  * Description: Federal Supplemental Security Income providing monthly cash benefits and Medicaid routing for disabled children.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Alaska Developmental Services Intake** (dd_intake): Website: https://dhhs.alaska.gov/dd | Phone: None | Status: `manual_review_required`
- **Alaska Early Intervention State Office** (early_intervention): Website: https://dhhs.alaska.gov/earlystart | Phone: None | Status: `manual_review_required`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Aleutians East Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Anchorage County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| Bristol Bay Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Denali Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Fairbanks North Star Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Haines Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Juneau County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kenai Peninsula Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Ketchikan Gateway Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Kodiak Island Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Lake and Peninsula Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Matanuska-Susitna Borough County | 1 | 1 | 3 | 4 | 🟢 COMPLETE |
| North Slope Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Northwest Arctic Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Petersburg Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Sitka County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Skagway County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Unorganized Borough County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Wrangell County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Yakutat County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |

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
| Office | Aleutians East Borough County storefront office | Aleutians East Borough County | `off-aleutians-east-borough-ak-medicaid` |
| Office | Anchorage County storefront office | Anchorage County | `off-anchorage-ak-medicaid` |
| Office | Bristol Bay Borough County storefront office | Bristol Bay Borough County | `off-bristol-bay-borough-ak-medicaid` |
| Office | Denali Borough County storefront office | Denali Borough County | `off-denali-borough-ak-medicaid` |
| Office | Fairbanks North Star Borough County storefront office | Fairbanks North Star Borough County | `off-fairbanks-north-star-borough-ak-medicaid` |
| Office | Haines Borough County storefront office | Haines Borough County | `off-haines-borough-ak-medicaid` |
| Office | Juneau County storefront office | Juneau County | `off-juneau-ak-medicaid` |
| Office | Kenai Peninsula Borough County storefront office | Kenai Peninsula Borough County | `off-kenai-peninsula-borough-ak-medicaid` |
| Office | Ketchikan Gateway Borough County storefront office | Ketchikan Gateway Borough County | `off-ketchikan-gateway-borough-ak-medicaid` |
| Office | Kodiak Island Borough County storefront office | Kodiak Island Borough County | `off-kodiak-island-borough-ak-medicaid` |
| Office | Lake and Peninsula Borough County storefront office | Lake and Peninsula Borough County | `off-lake-and-peninsula-borough-ak-medicaid` |
| Office | Matanuska-Susitna Borough County storefront office | Matanuska-Susitna Borough County | `off-matanuska-susitna-borough-ak-medicaid` |
| Office | North Slope Borough County storefront office | North Slope Borough County | `off-north-slope-borough-ak-medicaid` |
| Office | Northwest Arctic Borough County storefront office | Northwest Arctic Borough County | `off-northwest-arctic-borough-ak-medicaid` |
| Office | Petersburg Borough County storefront office | Petersburg Borough County | `off-petersburg-borough-ak-medicaid` |
| Office | Sitka County storefront office | Sitka County | `off-sitka-ak-medicaid` |
| Office | Skagway County storefront office | Skagway County | `off-skagway-ak-medicaid` |
| Office | Unorganized Borough County storefront office | Unorganized Borough County | `off-unorganized-borough-ak-medicaid` |
| Office | Wrangell County storefront office | Wrangell County | `off-wrangell-ak-medicaid` |
| Office | Yakutat County storefront office | Yakutat County | `off-yakutat-ak-medicaid` |
| School District | Anchorage Public Schools Special Education | Anchorage County | `sd-anchorage-ak` |
| School District | Matanuska-Susitna Borough Public Schools Special Education | Matanuska-Susitna Borough County | `sd-matanuska-susitna-borough-ak` |
| School District | Aleutians East Borough County School District | Aleutians East Borough County | `sd-aleutians-east-borough-ak` |
| School District | Bristol Bay Borough County School District | Bristol Bay Borough County | `sd-bristol-bay-borough-ak` |
| School District | Denali Borough County School District | Denali Borough County | `sd-denali-borough-ak` |
| School District | Fairbanks North Star Borough County School District | Fairbanks North Star Borough County | `sd-fairbanks-north-star-borough-ak` |
| School District | Haines Borough County School District | Haines Borough County | `sd-haines-borough-ak` |
| School District | Juneau County School District | Juneau County | `sd-juneau-ak` |
| School District | Kenai Peninsula Borough County School District | Kenai Peninsula Borough County | `sd-kenai-peninsula-borough-ak` |
| School District | Ketchikan Gateway Borough County School District | Ketchikan Gateway Borough County | `sd-ketchikan-gateway-borough-ak` |
| School District | Kodiak Island Borough County School District | Kodiak Island Borough County | `sd-kodiak-island-borough-ak` |
| School District | Lake and Peninsula Borough County School District | Lake and Peninsula Borough County | `sd-lake-and-peninsula-borough-ak` |
| School District | North Slope Borough County School District | North Slope Borough County | `sd-north-slope-borough-ak` |
| School District | Northwest Arctic Borough County School District | Northwest Arctic Borough County | `sd-northwest-arctic-borough-ak` |
| School District | Petersburg Borough County School District | Petersburg Borough County | `sd-petersburg-borough-ak` |
| School District | Sitka County School District | Sitka County | `sd-sitka-ak` |
| School District | Skagway County School District | Skagway County | `sd-skagway-ak` |
| School District | Unorganized Borough County School District | Unorganized Borough County | `sd-unorganized-borough-ak` |
| School District | Wrangell County School District | Wrangell County | `sd-wrangell-ak` |
| School District | Yakutat County School District | Yakutat County | `sd-yakutat-ak` |
| Nonprofit | The Arc of Alaska | Aleutians East Borough County | `ak-np-arc-aleutians-east-borough-ak` |
| Nonprofit | The Arc of Alaska | Anchorage County | `ak-np-arc-anchorage-ak` |
| Nonprofit | The Arc of Alaska | Bristol Bay Borough County | `ak-np-arc-bristol-bay-borough-ak` |
| Nonprofit | The Arc of Alaska | Denali Borough County | `ak-np-arc-denali-borough-ak` |
| Nonprofit | The Arc of Alaska | Fairbanks North Star Borough County | `ak-np-arc-fairbanks-north-star-borough-ak` |
| Nonprofit | The Arc of Alaska | Haines Borough County | `ak-np-arc-haines-borough-ak` |
| Nonprofit | The Arc of Alaska | Juneau County | `ak-np-arc-juneau-ak` |
| Nonprofit | The Arc of Alaska | Kenai Peninsula Borough County | `ak-np-arc-kenai-peninsula-borough-ak` |
| Nonprofit | The Arc of Alaska | Ketchikan Gateway Borough County | `ak-np-arc-ketchikan-gateway-borough-ak` |
| Nonprofit | The Arc of Alaska | Kodiak Island Borough County | `ak-np-arc-kodiak-island-borough-ak` |
| ... | *and 10 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
