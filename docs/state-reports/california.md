# Data Provenance Report: California (CA)

This report details the data sources, records count, trust classifications, and launch readiness for the State of California under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `COMPLETE_WITH_LEGACY_EXCEPTION`
- **Canonical Release Gate Score**: **26.70%**
- **Live Raw Database Depth Score**: **29.3%** (Manual Review Rate: **70.65%**)
- **Sitemap Indexing Posture**: `Exposed`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `Regional Center`
- **Medicaid Program Name**: `Medi-Cal`
- **Waiver Program Name**: `HCBS DD Waiver`
- **Personal Care Program**: `IHSS Protective Supervision`
- **Developmental Disability (DD) Agency**: `California Department of Developmental Services`
- **State Education Agency**: `California Department of Education`
- **State Education Agency SPED Label**: `Special Education Local Plan Areas (SELPAs)`
- **State Early Intervention Label**: `California Early Start (Ages 0-3)`
- **ABLE Savings Program**: `CalABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 58
- **County Social Service Storefronts**: 174
- **School Districts**: 80
- **Regional Education Agencies (REAs)**: 62
- **State-Level Resource Agencies**: 21
- **Local Nonprofit Support Organizations**: 34
- **Special Education (IEP) Advocates/Attorneys**: 580
- **Medicaid Waitlist Profiles**: 4
- **Waiver Denial Appeal Guides**: 9

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 331 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 273 records
- **Manual Review Backlog (Flagged)**: 657 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 40 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **CalABLE (ABLE Accounts)** (State Program): Source URL: https://calable.ca.gov
  * Description: Tax-advantaged savings and investment portal letting families save money for future therapy, college, or housing, comple...
- **California Children's Services (CCS)** (State Program): Source URL: https://www.dhcs.ca.gov/services/ccs/Pages/default.aspx
  * Description: A state program that coordinates and pays for specialized pediatric medical care, surgery, wheel-chairs, and school Medi...
- **California Early Start (Early Intervention)** (State Program): Source URL: https://www.dds.ca.gov/services/early-start/
  * Description: California's system of early intervention services for infants and toddlers from birth to 36 months who have significant...
- **California Home & Community-Based Alternatives (HCBA) Waiver** (State Program): Source URL: https://www.dhcs.ca.gov/services/ltc/Pages/Home-and-Community-Based-Alternatives-Waiver.aspx
  * Description: Provides in-home private duty nursing and care coordination for medically fragile individuals who would otherwise requir...
- **California Regional Centers (Lanterman Act)** (State Program): Source URL: https://www.dds.ca.gov
  * Description: Lifelong service coordination network funding respite care, adaptive behavioral support, and social skills coaching for ...
- **California Self-Determination Program (SDP)** (State Program): Source URL: https://www.dds.ca.gov/initiatives/sdp/
  * Description: An alternative way to receive Regional Center services, allowing consumers and families more control over their service ...
- **Hearing Aid Coverage for Children Program (HACCP)** (State Program): Source URL: https://www.dhcs.ca.gov/services/Pages/HACCP.aspx
  * Description: California state program covering audiology tests and hearing aid fittings for children who do not qualify for full-scop...
- **In-Home Supportive Services (IHSS) for Children** (State Program): Source URL: https://www.cdss.ca.gov/in-home-supportive-services
  * Description: Pays a caregiver (including a parent) to provide essential supervision and care for a child with a severe disability to ...
- **Individualized Education Program (IEP) / Special Education** (State Program): Source URL: https://www.cde.ca.gov/sp/se/
  * Description: Legally binding public school document detailing academic accommodations, behavior support, assistive devices, and speec...
- **Medi-Cal for Kids & Teens (EPSDT)** (State Program): Source URL: https://www.dhcs.ca.gov/services/medi-cal/Pages/default.aspx
  * Description: Free healthcare and developmental medical therapy program for eligible youth under age 21, guaranteeing checkups, dental...
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Alta California Regional Center (ACRC)** (regional_center): Website: https://www.altaregional.org | Phone: (916) 978-6400 | Status: `official_verified`
- **Central Valley Regional Center (CVRC)** (regional_center): Website: https://www.cvrc.org | Phone: (559) 276-4300 | Status: `official_verified`
- **Eastern Los Angeles Regional Center (ELARC)** (regional_center): Website: https://www.elarc.org | Phone: (626) 299-4700 | Status: `official_verified`
- **Far Northern Regional Center (FNRC)** (regional_center): Website: https://www.farnorthernrc.org | Phone: (530) 222-4791 | Status: `official_verified`
- **Frank D. Lanterman Regional Center (FDLRC)** (regional_center): Website: https://www.lanterman.org | Phone: (213) 383-1300 | Status: `official_verified`
- **Golden Gate Regional Center (GGRC)** (regional_center): Website: https://www.ggrc.org | Phone: (415) 546-9222 | Status: `official_verified`
- **Harbor Regional Center (HRC)** (regional_center): Website: https://www.harborrc.org | Phone: (310) 540-1711 | Status: `official_verified`
- **Inland Regional Center (IRC)** (regional_center): Website: https://www.inlandrc.org | Phone: (909) 890-3000 | Status: `official_verified`
- **Kern Regional Center (KRC)** (regional_center): Website: https://www.kernrc.org | Phone: (661) 327-8531 | Status: `official_verified`
- **North Bay Regional Center (NBRC)** (regional_center): Website: https://www.nbrc.net | Phone: (707) 256-1100 | Status: `official_verified`
- **North Los Angeles County Regional Center (NLACRC)** (regional_center): Website: https://www.nlacrc.org | Phone: (818) 778-1900 | Status: `official_verified`
- **Redwood Coast Regional Center (RCRC)** (regional_center): Website: https://www.redwoodcoastrc.org | Phone: (707) 445-0893 | Status: `official_verified`
- **Regional Center of Orange County (RCOC)** (regional_center): Website: https://www.rcocdd.com | Phone: (714) 796-5100 | Status: `official_verified`
- **Regional Center of the East Bay (RCEB)** (regional_center): Website: https://www.rceb.org | Phone: (510) 618-6100 | Status: `official_verified`
- **San Andreas Regional Center (SARC)** (regional_center): Website: https://www.sarc.org | Phone: (408) 374-9960 | Status: `official_verified`
- **San Diego Regional Center (SDRC)** (regional_center): Website: https://www.sdrc.org | Phone: (858) 576-2996 | Status: `official_verified`
- **San Gabriel/Pomona Regional Center (SGPRC)** (regional_center): Website: https://www.sgprc.org | Phone: (909) 620-7722 | Status: `official_verified`
- **South Central Los Angeles County Regional Center (SCLARC)** (regional_center): Website: https://www.sclarc.org | Phone: (213) 744-7000 | Status: `official_verified`
- **Tri-Counties Regional Center (TCRC)** (regional_center): Website: https://www.tri-counties.org | Phone: (805) 962-7881 | Status: `official_verified`
- **Valley Mountain Regional Center (VMRC)** (regional_center): Website: https://www.vmrc.net | Phone: (209) 473-0951 | Status: `official_verified`
- **Westside Regional Center (WRC)** (regional_center): Website: https://www.westsiderc.org | Phone: (310) 258-4000 | Status: `official_verified`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Alameda County | 3 | 3 | 3 | 10 | 🟢 COMPLETE |
| Alpine County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Amador County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Butte County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Calaveras County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Colusa County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Contra Costa County | 3 | 2 | 1 | 10 | 🟢 COMPLETE |
| Del Norte County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| El Dorado County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Fresno County | 3 | 2 | 1 | 10 | 🟢 COMPLETE |
| Glenn County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Humboldt County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Imperial County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Inyo County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Kern County | 3 | 2 | 1 | 10 | 🟢 COMPLETE |
| Kings County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lake County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lassen County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Los Angeles County | 3 | 5 | 10 | 10 | 🟢 COMPLETE |
| Madera County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Marin County | 3 | 1 | 1 | 10 | 🟢 COMPLETE |
| Mariposa County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Mendocino County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Merced County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Modoc County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Mono County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Monterey County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Napa County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Nevada County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Orange County | 3 | 4 | 3 | 10 | 🟢 COMPLETE |
| Placer County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Plumas County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Riverside County | 3 | 2 | 1 | 10 | 🟢 COMPLETE |
| Sacramento County | 3 | 3 | 1 | 10 | 🟢 COMPLETE |
| San Benito County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| San Bernardino County | 3 | 2 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| San Diego County | 3 | 3 | 4 | 10 | 🟢 COMPLETE |
| San Francisco County | 3 | 1 | 3 | 10 | 🟢 COMPLETE |
| San Joaquin County | 3 | 1 | 1 | 10 | 🟢 COMPLETE |
| San Luis Obispo County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| San Mateo County | 3 | 2 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Santa Barbara County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Santa Clara County | 3 | 3 | 1 | 10 | 🟢 COMPLETE |
| Santa Cruz County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Shasta County | 3 | 1 | 1 | 10 | 🟢 COMPLETE |
| Sierra County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Siskiyou County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Solano County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Sonoma County | 3 | 1 | 1 | 10 | 🟢 COMPLETE |
| Stanislaus County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Sutter County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Tehama County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Trinity County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Tulare County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Tuolumne County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Ventura County | 3 | 2 | 1 | 10 | 🟢 COMPLETE |
| Yolo County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |
| Yuba County | 3 | 1 | 0 | 10 | ⚠️ PARTIAL (Missing Nonprofits) |

---

## 8. Detailed County-Level Gap Registry
List of specific counties with zero resource mappings:
- **Counties Missing Social Service Offices**: None
- **Counties Missing School Districts**: None
- **Counties Missing Local Nonprofits**: Alpine County, Amador County, Butte County, Calaveras County, Colusa County, Del Norte County, El Dorado County, Glenn County, Humboldt County, Imperial County, Inyo County, Kings County, Lake County, Lassen County, Madera County, Mariposa County, Mendocino County, Merced County, Modoc County, Mono County, Monterey County, Napa County, Nevada County, Placer County, Plumas County, San Benito County, San Bernardino County, San Luis Obispo County, San Mateo County, Santa Barbara County, Santa Cruz County, Sierra County, Siskiyou County, Solano County, Stanislaus County, Sutter County, Tehama County, Trinity County, Tulare County, Tuolumne County, Yolo County, Yuba County

---

## 9. Manual Review Queue Registry
List of records flagged as `manual_review_required` in the database, representing exactly what needs to be verified before this state can be advanced:

| Category | Record Name | County | ID |
| :--- | :--- | :--- | :--- |
| School District | Alpine County Unified School District | Alpine County | `sd-gen-alpine` |
| School District | Amador County Unified School District | Amador County | `sd-gen-amador` |
| School District | Butte County Unified School District | Butte County | `sd-gen-butte` |
| School District | Calaveras County Unified School District | Calaveras County | `sd-gen-calaveras` |
| School District | Colusa County Unified School District | Colusa County | `sd-gen-colusa` |
| School District | Del Norte County Unified School District | Del Norte County | `sd-gen-del-norte` |
| School District | El Dorado County Unified School District | El Dorado County | `sd-gen-el-dorado` |
| School District | Glenn County Unified School District | Glenn County | `sd-gen-glenn` |
| School District | Humboldt County Unified School District | Humboldt County | `sd-gen-humboldt` |
| School District | Imperial County Unified School District | Imperial County | `sd-gen-imperial` |
| School District | Inyo County Unified School District | Inyo County | `sd-gen-inyo` |
| School District | Kings County Unified School District | Kings County | `sd-gen-kings` |
| School District | Lake County Unified School District | Lake County | `sd-gen-lake` |
| School District | Lassen County Unified School District | Lassen County | `sd-gen-lassen` |
| School District | Madera County Unified School District | Madera County | `sd-gen-madera` |
| School District | Marin County Unified School District | Marin County | `sd-gen-marin` |
| School District | Mariposa County Unified School District | Mariposa County | `sd-gen-mariposa` |
| School District | Mendocino County Unified School District | Mendocino County | `sd-gen-mendocino` |
| School District | Merced County Unified School District | Merced County | `sd-gen-merced` |
| School District | Modoc County Unified School District | Modoc County | `sd-gen-modoc` |
| School District | Mono County Unified School District | Mono County | `sd-gen-mono` |
| School District | Monterey County Unified School District | Monterey County | `sd-gen-monterey` |
| School District | Napa County Unified School District | Napa County | `sd-gen-napa` |
| School District | Nevada County Unified School District | Nevada County | `sd-gen-nevada` |
| School District | Placer County Unified School District | Placer County | `sd-gen-placer` |
| School District | Plumas County Unified School District | Plumas County | `sd-gen-plumas` |
| School District | San Benito County Unified School District | San Benito County | `sd-gen-san-benito` |
| School District | San Luis Obispo County Unified School District | San Luis Obispo County | `sd-gen-san-luis-obispo` |
| School District | Santa Cruz County Unified School District | Santa Cruz County | `sd-gen-santa-cruz` |
| School District | Shasta County Unified School District | Shasta County | `sd-gen-shasta` |
| School District | Sierra County Unified School District | Sierra County | `sd-gen-sierra` |
| School District | Siskiyou County Unified School District | Siskiyou County | `sd-gen-siskiyou` |
| School District | Solano County Unified School District | Solano County | `sd-gen-solano` |
| School District | Sutter County Unified School District | Sutter County | `sd-gen-sutter` |
| School District | Tehama County Unified School District | Tehama County | `sd-gen-tehama` |
| School District | Trinity County Unified School District | Trinity County | `sd-gen-trinity` |
| School District | Tulare County Unified School District | Tulare County | `sd-gen-tulare` |
| School District | Tuolumne County Unified School District | Tuolumne County | `sd-gen-tuolumne` |
| School District | Yolo County Unified School District | Yolo County | `sd-gen-yolo` |
| School District | Yuba County Unified School District | Yuba County | `sd-gen-yuba` |
| IEP Advocate | Sarah Rostova | Alameda County | `gen-alameda-sarahrostova-1` |
| IEP Advocate | Clara Wu | Alameda County | `gen-alameda-clarawu-2` |
| IEP Advocate | Elizabeth Rodriguez | Alameda County | `gen-alameda-elizabethrodriguez-3` |
| IEP Advocate | Susan Hernandez | Alameda County | `gen-alameda-susanhernandez-4` |
| IEP Advocate | Robert Brown | Alameda County | `gen-alameda-robertbrown-5` |
| IEP Advocate | Robert Martinez | Alameda County | `gen-alameda-robertmartinez-6` |
| IEP Advocate | William Davis | Alameda County | `gen-alameda-williamdavis-7` |
| IEP Advocate | Thomas Rodriguez | Alameda County | `gen-alameda-thomasrodriguez-8` |
| IEP Advocate | Jessica Newman | Alameda County | `gen-alameda-jessicanewman-9` |
| IEP Advocate | William McArthur | Alameda County | `gen-alameda-williammcarthur-10` |
| ... | *and 607 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
