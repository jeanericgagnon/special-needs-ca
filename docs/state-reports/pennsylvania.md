# Data Provenance Report: Pennsylvania (PA)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Pennsylvania under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `READY_FOR_ALLOWLIST`
- **Canonical Release Gate Score**: **94.70%**
- **Live Raw Database Depth Score**: **85.3%** (Manual Review Rate: **14.72%**)
- **Sitemap Indexing Posture**: `Exposed`
- **Search Engine Gating Policy**: `Eligible` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (8):** Allegheny County, Berks County, Bucks County, Chester County, Delaware County, Lancaster County, Montgomery County, Philadelphia County

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `County MH/ID AE`
- **Medicaid Program Name**: `Pennsylvania Medicaid`
- **Waiver Program Name**: `ODP waivers`
- **Personal Care Program**: `Participant Directed Services`
- **Developmental Disability (DD) Agency**: `Office of Developmental Programs (ODP)`
- **State Education Agency**: `Pennsylvania Department of Education`
- **State Education Agency SPED Label**: `Intermediate Units (IUs)`
- **State Early Intervention Label**: `PA Early Intervention (Ages 0-3)`
- **ABLE Savings Program**: `PA ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 67
- **County Social Service Storefronts**: 67
- **School Districts**: 67
- **Regional Education Agencies (REAs)**: 37
- **State-Level Resource Agencies**: 105
- **Local Nonprofit Support Organizations**: 8
- **Special Education (IEP) Advocates/Attorneys**: 18
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 109 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 168 records
- **Manual Review Backlog (Flagged)**: 29 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **ODP Community Living Waiver** (State Program): Source URL: https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
  * Description: Moderate cap waiver designed to support individuals in the community with residential and respite services.
- **ODP Consolidated Waiver** (State Program): Source URL: https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
  * Description: Exhaustive home and community-based services waiver for children and adults with ID or autism.
- **OVR Transition Services** (State Program): Source URL: https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/OVR.aspx
  * Description: Transition services assisting high school students with disabilities to move into post-school activities.
- **PA ABLE** (State Program): Source URL: https://www.paable.gov/
  * Description: PA's tax-advantaged savings program for individuals with disabilities.
- **PA Bureau of Special Education IEP** (State Program): Source URL: None
  * Description: Individualized Education Programs (IEP) and school services under the Pennsylvania Department of Education.
- **PA CHIP** (State Program): Source URL: https://www.dhs.pa.gov/CHIP/Pages/CHIP.aspx
  * Description: PA Children's Health Insurance Program for kids who don't qualify for Medicaid.
- **PA Early Intervention Services** (State Program): Source URL: https://www.dhs.pa.gov/Services/Children/Pages/Early-Intervention.aspx
  * Description: Early childhood intervention therapies for infants, toddlers, and preschool children.
- **Pennsylvania Medicaid (COMPASS)** (State Program): Source URL: https://www.compass.state.pa.us/
  * Description: Medical Assistance processed through COMPASS. Bypasses parent income for waiver participants.
- **Person/Family Directed Support (P/FDS) Waiver** (State Program): Source URL: https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
  * Description: Lower cap waiver focusing on employment and community participation support.
- **SSI for Children (Pennsylvania)** (State Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Federal cash benefits with state supplement and automatic Medicaid eligibility through COMPASS.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Allegheny County DHS - Intellectual Disability Services** (county_ae): Website: https://www.alleghenycounty.us/Human-Services/About/Offices/Developmental-Disabilities.aspx | Phone: (412) 350-4446 | Status: `source_listed`
- **Allegheny County Department of Human Services Office of Developmental Supports** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 412-253-1399 | Status: `source_listed`
- **Allegheny County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 412-253-1399 | Status: `source_listed`
- **Armstrong-Indiana Behavioral and Developmental Health Program** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-548-3451 | Status: `source_listed`
- **Armstrong-Indiana Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-548-3451 | Status: `source_listed`
- **Beaver County Behavioral Health-Developmental Disabilities** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-847-6225 | Status: `source_listed`
- **Beaver County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-847-6225 | Status: `source_listed`
- **Bedford-Somerset Developmental and Behavioral Health Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-443-4891 | Status: `source_listed`
- **Bedford-Somerset Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-443-4891 | Status: `source_listed`
- **Berks County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-478-3271 | Status: `source_listed`
- **Berks County MH/DD AE** (county_ae): Website: https://www.berkspa.gov/departments/mental-health-developmental-disabilities | Phone: (610) 478-3200 | Status: `source_listed`
- **Berks County Mental Health/Developmental Disabilities** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-478-3271 | Status: `source_listed`
- **Blair County Department of Social Services & Mental Health** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-693-3023 | Status: `source_listed`
- **Blair County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-693-3023 | Status: `source_listed`
- **Bradford-Sullivan Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-265-1760 | Status: `source_listed`
- **Bradford-Sullivan Office of Mental Health & Intellectual Disabilities** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-265-1760 | Status: `source_listed`
- **Bucks County Department of Behavioral Health/Developmental Programs** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 215-444-2800 | Status: `source_listed`
- **Bucks County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 215-444-2800 | Status: `source_listed`
- **Bucks County MH/DP Program AE** (county_ae): Website: https://www.buckscounty.gov/247/Mental-Health-Developmental-Programs | Phone: (215) 444-2800 | Status: `source_listed`
- **Butler County Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-284-5114 | Status: `source_listed`
- **Butler County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-284-5114 | Status: `source_listed`
- **Cambria County Behavioral Health/Intellectual Disabilities/Early Intervention** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-534-2800 | Status: `source_listed`
- **Cambria County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-534-2800 | Status: `source_listed`
- **Cameron-Elk Behavioral & Developmental Programs** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-772-8016 | Status: `source_listed`
- **Cameron-Elk Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-772-8016 | Status: `source_listed`
- **Carbon-Monroe-Pike Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-421-2901 | Status: `source_listed`
- **Carbon-Monroe-Pike Mental Health & Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-421-2901 | Status: `source_listed`
- **Centre County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-355-6782 | Status: `source_listed`
- **Centre County Mental Health/Intellectual Disabilities/Early Intervention** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-355-6782 | Status: `source_listed`
- **Chester County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-344-6265 | Status: `source_listed`
- **Chester County MH/ID AE** (county_ae): Website: https://www.chesco.org/615/Mental-HealthIntellectual-Dev-Disabiliti | Phone: (610) 344-6265 | Status: `source_listed`
- **Chester County Mental Health/Intellectual and Developmental Disabilities** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-344-6265 | Status: `source_listed`
- **City of Philadelphia Department of Behavioral Health and Intellectual disAbility Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 215-685-5400 | Status: `source_listed`
- **City of Philadelphia Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 215-685-5400 | Status: `source_listed`
- **Clarion County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-226-4000 | Status: `source_listed`
- **Clarion County Mental Health/Developmental Disabilities/Early Intervention** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-226-4000 | Status: `source_listed`
- **Columbia-Montour-Snyder-Union (CMSU) Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-275-6080 | Status: `source_listed`
- **Columbia-Montour-Snyder-Union (CMSU) Service System Behavioral Health/Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-275-6080 | Status: `source_listed`
- **Community Connections of Clearfield-Jefferson Counties** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-371-5100 | Status: `source_listed`
- **Community Connections of Clearfield-Jefferson Counties Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-371-5100 | Status: `source_listed`
- **Crawford County Human Services Mental Health/Intellectual Disabilities** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-724-8380 | Status: `source_listed`
- **Crawford County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-724-8380 | Status: `source_listed`
- **Cumberland-Perry Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-240-6325 | Status: `source_listed`
- **Cumberland-Perry Mental Health/Intellectual & Developmental Disabilities** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-240-6325 | Status: `source_listed`
- **Dauphin County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-780-7050 | Status: `source_listed`
- **Dauphin County Mental Health/Autism & Developmental Programs** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-780-7050 | Status: `source_listed`
- **Delaware County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-713-2400 | Status: `source_listed`
- **Delaware County Office of Intellectual Disabilities** (county_ae): Website: https://www.delcohsa.org/oidd.html | Phone: (610) 713-2400 | Status: `source_listed`
- **Delaware County Office of Intellectual and Developmental Disabilities** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-713-2400 | Status: `source_listed`
- **Erie County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-451-6800 | Status: `source_listed`
- **Erie County Office of Mental Health/Intellectual Disabilities** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-451-6800 | Status: `source_listed`
- **Fayette County Behavioral Health Administration** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-430-1370 | Status: `source_listed`
- **Fayette County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-430-1370 | Status: `source_listed`
- **Forest-Warren Human Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-726-2100 | Status: `source_listed`
- **Forest-Warren Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-726-2100 | Status: `source_listed`
- **Franklin–Fulton Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-264-5387 | Status: `source_listed`
- **Franklin–Fulton Mental Health/Intellectual and Developmental Disabilities Programs** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-264-5387 | Status: `source_listed`
- **Greene County Human Services Department Mental Health and Intellectual/Developmental Disabilities Programs** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-852-5276 | Status: `source_listed`
- **Greene County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-852-5276 | Status: `source_listed`
- **Juniata Valley Behavioral and Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-242-6467 | Status: `source_listed`
- **Juniata Valley Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-242-6467 | Status: `source_listed`
- **Lackawanna/Susquehanna Behavioral Health/Intellectual Disabilities/Early Intervention** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-346-5741 | Status: `source_listed`
- **Lackawanna/Susquehanna Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-346-5741 | Status: `source_listed`
- **Lancaster County BH/DS AE** (county_ae): Website: https://www.lancastercountybhds.org/ | Phone: (717) 299-8021 | Status: `source_listed`
- **Lancaster County Behavioral Health and Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-299-8021 | Status: `source_listed`
- **Lancaster County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-299-8021 | Status: `source_listed`
- **Lawrence County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-658-2538 | Status: `source_listed`
- **Lawrence County Mental Health and Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-658-2538 | Status: `source_listed`
- **Lebanon County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-274-3415 | Status: `source_listed`
- **Lebanon County Mental Health/Intellectual Disability/Early Intervention Programs** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-274-3415 | Status: `source_listed`
- **Lehigh County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-782-3126 | Status: `source_listed`
- **Lehigh County Office of Intellectual Disabilities and Mental Health** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-782-3126 | Status: `source_listed`
- **Luzerne–Wyoming Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-825-9441 | Status: `source_listed`
- **Luzerne–Wyoming Mental Health and Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-825-9441 | Status: `source_listed`
- **Lycoming-Clinton Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-326-7895 | Status: `source_listed`
- **Lycoming-Clinton Mental Health and Developmental Disabilities/Autism Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-326-7895 | Status: `source_listed`
- **McKean County Department of Human Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-887-3350 | Status: `source_listed`
- **McKean County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-887-3350 | Status: `source_listed`
- **Mercer County Behavioral Health Commission Inc.** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-662-1550 | Status: `source_listed`
- **Mercer County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-662-1550 | Status: `source_listed`
- **Montgomery County Behavioral Health/Developmental Disabilities Department** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-278-3642 | Status: `source_listed`
- **Montgomery County Developmental Disability Services** (county_ae): Website: https://www.montgomerycountypa.gov/ | Phone: (610) 278-3666 | Status: `source_listed`
- **Montgomery County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-278-3642 | Status: `source_listed`
- **Northampton County Human Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-974-7500 | Status: `source_listed`
- **Northampton County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 610-974-7500 | Status: `source_listed`
- **Northumberland County Behavioral Health / Intellectual Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-495-2039 | Status: `source_listed`
- **Northumberland County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-495-2039 | Status: `source_listed`
- **Pennsylvania CONNECT Helpline (Statewide Early Intervention Referral)** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/resources/early-learning-child-care/early-intervention-services.html | Phone: 1-800-692-7288 | Status: `source_listed`
- **Philadelphia County Intellectual disAbility Services** (county_ae): Website: https://www.phila.gov/departments/department-of-behavioral-health-and-intellectual-disability-services/ | Phone: (215) 685-5900 | Status: `source_listed`
- **Potter County Human Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-544-7315 | Status: `source_listed`
- **Potter County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-544-7315 | Status: `source_listed`
- **Schuylkill County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-621-2890 | Status: `source_listed`
- **Schuylkill County Mental Health/Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-621-2890 | Status: `source_listed`
- **Tioga County Department of Human Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-724-5766 | Status: `source_listed`
- **Tioga County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-724-5766 | Status: `source_listed`
- **Venango County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-432-9100 | Status: `source_listed`
- **Venango County Mental Health/Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 814-432-9100 | Status: `source_listed`
- **Washington County Behavioral Health and Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-228-6832 | Status: `source_listed`
- **Washington County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-228-6832 | Status: `source_listed`
- **Wayne County Behavioral Health/Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-253-9200 | Status: `source_listed`
- **Wayne County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 570-253-9200 | Status: `source_listed`
- **Westmoreland County Behavioral Health & Developmental Services** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-830-3617 | Status: `source_listed`
- **Westmoreland County Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 724-830-3617 | Status: `source_listed`
- **York/Adams Infant/Toddler Early Intervention Coordinator** (early_intervention): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-771-9618 | Status: `source_listed`
- **York/Adams Mental Health/Intellectual and Developmental Disabilities Departments** (developmental_services_agency): Website: https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html | Phone: 717-771-9618 | Status: `source_listed`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adams County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Allegheny County | 1 | 1 | 2 | 4 | 🟢 COMPLETE |
| Armstrong County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Beaver County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Bedford County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Berks County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Blair County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Bradford County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Bucks County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Butler County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Cambria County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Cameron County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Carbon County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Centre County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Chester County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Clarion County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Clearfield County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Clinton County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Columbia County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Crawford County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Cumberland County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Dauphin County | 1 | 1 | 3 | 2 | 🟢 COMPLETE |
| Delaware County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Elk County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Erie County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Fayette County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Forest County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Franklin County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Fulton County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Greene County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Huntingdon County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Indiana County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Jefferson County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Juniata County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lackawanna County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lancaster County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lawrence County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lebanon County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lehigh County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Luzerne County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lycoming County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| McKean County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Mercer County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Mifflin County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Monroe County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Montgomery County | 1 | 1 | 1 | 4 | 🟢 COMPLETE |
| Montour County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Northampton County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Northumberland County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Perry County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Philadelphia County | 1 | 1 | 1 | 4 | 🟢 COMPLETE |
| Pike County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Potter County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Schuylkill County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Snyder County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Somerset County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Sullivan County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Susquehanna County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Tioga County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Union County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Venango County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Warren County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Washington County | 1 | 1 | 1 | 2 | 🟢 COMPLETE |
| Wayne County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Westmoreland County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Wyoming County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| York County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |

---

## 8. Detailed County-Level Gap Registry
List of specific counties with zero resource mappings:
- **Counties Missing Social Service Offices**: None
- **Counties Missing School Districts**: None
- **Counties Missing Local Nonprofits**: Adams County, Armstrong County, Beaver County, Bedford County, Berks County, Blair County, Bradford County, Bucks County, Butler County, Cambria County, Cameron County, Carbon County, Centre County, Chester County, Clarion County, Clearfield County, Clinton County, Columbia County, Crawford County, Cumberland County, Delaware County, Elk County, Erie County, Fayette County, Forest County, Franklin County, Fulton County, Greene County, Huntingdon County, Indiana County, Jefferson County, Juniata County, Lackawanna County, Lancaster County, Lawrence County, Lebanon County, Lehigh County, Luzerne County, Lycoming County, McKean County, Mercer County, Mifflin County, Monroe County, Montour County, Northampton County, Northumberland County, Perry County, Pike County, Potter County, Schuylkill County, Snyder County, Somerset County, Sullivan County, Susquehanna County, Tioga County, Union County, Venango County, Warren County, Wayne County, Westmoreland County, Wyoming County, York County

---

## 9. Manual Review Queue Registry
List of records flagged as `manual_review_required` in the database, representing exactly what needs to be verified before this state can be advanced:

No records in manual review queue.


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
