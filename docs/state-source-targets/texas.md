# State Source Targets: Texas (TX)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Texas with real, source-listed records.

> [!IMPORTANT]
> **Source Discovery Complete:** This file has been expanded from a category-level scaffold into **54 real source-level discovery targets**.

## 1. Domain Crawler Targets (Wave 1)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Texas Counties Wikipedia List** | A. State identity and geography / County Wikipedia List | [en.wikipedia.org](https://en.wikipedia.org/wiki/List_of_counties_in_Texas) | `static_fetch` | `counties` |
| **Texas Association of Counties directory** | A. State identity and geography / County Government Directory | [county.org](https://www.county.org/About-Texas-Counties/Texas-County-Directory) | `static_fetch` | `counties` |
| **Texas.gov Local Services** | A. State identity and geography / Local Government Lookup | [texas.gov](https://www.texas.gov/services/local-services/) | `static_fetch` | `counties` |
| **Texas HHSC Medicaid Homepage** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [hhs.texas.gov](https://hhs.texas.gov) | `static_fetch` | `programs` |
| **Your Texas Benefits Application Portal** | B. Medicaid / benefits / HHS / Application Portal | [yourtexasbenefits.com](https://www.yourtexasbenefits.com) | `playwright` | `program_application_steps` |
| **Texas HHSC Social Service Office locator** | B. Medicaid / benefits / HHS / Office Locator | [hhs.texas.gov](https://hhs.texas.gov/services/financial/social-services-offices) | `playwright` | `county_offices` |
| **Texas Medicaid and CHIP Program Info** | B. Medicaid / benefits / HHS / CHIP Page | [hhs.texas.gov](https://www.hhs.texas.gov/services/health/medicaid-chip) | `static_fetch` | `programs` |
| **Children with Special Health Care Needs (CSHCN) Services Program** | B. Medicaid / benefits / HHS / Children's Special Health | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability/children-special-health-care-needs-services-program) | `static_fetch` | `programs` |
| **Texas HHS Office of Appeals** | B. Medicaid / benefits / HHS / Fair Hearing Page | [hhs.texas.gov](https://www.hhs.texas.gov/about/your-rights/hhs-office-appeals) | `static_fetch` | `program_appeal_info` |
| **Texas HHS Ombudsman Managed Care Help** | B. Medicaid / benefits / HHS / Managed Care Appeal Page | [hhs.texas.gov](https://www.hhs.texas.gov/about/your-rights/hhs-ombudsman/managed-care-help) | `static_fetch` | `program_appeal_info` |
| **Texas Medicaid Personal Care Services (PCS)** | B. Medicaid / benefits / HHS / Personal Care Page | [hhs.texas.gov](https://www.hhs.texas.gov/providers/health-services-providers/texas-medicaid-wellness-program/personal-care-services) | `static_fetch` | `programs` |
| **Texas HHSC IDD Services Home** | C. Developmental disability / DD / IDD services / State DD Agency Page | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability) | `static_fetch` | `programs` |
| **Texas LIDDAs Providers** | C. Developmental disability / DD / IDD services / Local Agency Directory | [hhs.texas.gov](https://www.hhs.texas.gov/providers/liddas) | `static_fetch` | `state_resource_agencies` |
| **Texas LIDDA County Catchment locator** | C. Developmental disability / DD / IDD services / County Catchment Source | [hhs.texas.gov](https://www.hhs.texas.gov/services/mental-health-substance-use/mental-health-cre-reports/local-intellectual-developmental-disability-authorities-lidda-directory) | `playwright` | `state_resource_agencies` |
| **Texas IDD Services Eligibility Overview** | C. Developmental disability / DD / IDD services / Eligibility Page | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability/intellectual-developmental-disability-idd-services) | `static_fetch` | `program_eligibility_rules` |
| **How to Apply for Texas IDD Services** | C. Developmental disability / DD / IDD services / Intake/Application Page | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability/how-apply-idd-services) | `static_fetch` | `program_application_steps` |
| **Texas Family Support and Respite services** | C. Developmental disability / DD / IDD services / Family Support/Respite Page | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability/respite-care) | `static_fetch` | `programs` |
| **Texas Consumer Directed Services (CDS)** | C. Developmental disability / DD / IDD services / Self-Direction Page | [hhs.texas.gov](https://www.hhs.texas.gov/providers/long-term-care-providers/consumer-directed-services-cds) | `static_fetch` | `programs` |
| **Texas HHS Waiver Interest List Milestones** | C. Developmental disability / DD / IDD services / Waitlist/Interest List Page | [hhs.texas.gov](https://www.hhs.texas.gov/doing-business-hhs/provider-portals/resources/interest-list-milestones) | `static_fetch` | `program_waitlists` |
| **Texas Home and Community-Based Services (HCS) Waiver** | D. HCBS waivers / HCS Waiver Page | [hhs.texas.gov](https://www.hhs.texas.gov/providers/long-term-care-providers/home-community-based-services-hcs) | `static_fetch` | `programs` |
| **Texas Home Living (TxHmL) Waiver** | D. HCBS waivers / TxHmL Waiver Page | [hhs.texas.gov](https://www.hhs.texas.gov/providers/long-term-care-providers/texas-home-living-txhml) | `static_fetch` | `programs` |
| **Texas CLASS Waiver Program** | D. HCBS waivers / CLASS Waiver Page | [hhs.texas.gov](https://www.hhs.texas.gov/providers/long-term-care-providers/community-living-assistance-support-services-class) | `static_fetch` | `programs` |
| **Texas Medically Dependent Children's Program (MDCP)** | D. HCBS waivers / MDCP Waiver Page | [hhs.texas.gov](https://www.hhs.texas.gov/providers/long-term-care-providers/medically-dependent-childrens-program-mdcp) | `static_fetch` | `programs` |
| **Texas Early Childhood Intervention (ECI) Home** | E. Early intervention / State EI Landing Page | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services) | `static_fetch` | `programs` |
| **Texas ECI Programs & Locations Directory** | E. Early intervention / Local Program Directory | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-programs-locations) | `playwright` | `state_resource_agencies` |
| **How to Make ECI Referrals** | E. Early intervention / Referral Page/Form | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/how-make-referral-eci) | `static_fetch` | `program_application_steps` |
| **Texas ECI Eligibility criteria** | E. Early intervention / Eligibility Page | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-eligibility) | `static_fetch` | `program_eligibility_rules` |
| **Texas ECI Transition Beyond ECI** | E. Early intervention / Transition at Age 3 | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-transition-beyond-eci) | `static_fetch` | `program_application_steps` |
| **Texas ECI Parent Rights & Complaints** | E. Early intervention / Complaint/Dispute Process | [hhs.texas.gov](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-parent-rights-complaints) | `static_fetch` | `program_appeal_info` |
| **Texas Education Agency (TEA) Special Education Home** | F. Special education / IEP / SEA Special Ed Landing Page | [tea.texas.gov](https://tea.texas.gov/academics/special-student-populations/special-education) | `static_fetch` | `programs` |
| **TEA Special Education Procedural Safeguards** | F. Special education / IEP / Procedural Safeguards | [tea.texas.gov](https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/procedural-safeguards) | `static_fetch` | `program_document_requirements` |
| **TEA Special Education State Complaints** | F. Special education / IEP / State Complaint Page/Form | [tea.texas.gov](https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/special-education-state-complaints) | `static_fetch` | `program_appeal_info` |
| **TEA Due Process Hearings Program** | F. Special education / IEP / Due Process Page/Form | [tea.texas.gov](https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/special-education-due-process-hearing-program) | `static_fetch` | `program_appeal_info` |
| **TEA Special Education Mediation Program** | F. Special education / IEP / Mediation Page | [tea.texas.gov](https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/special-education-mediation-program) | `static_fetch` | `program_appeal_info` |
| **SpedTex - Special Education Information Center** | F. Special education / IEP / Parent Rights Guide | [spedtex.org](https://www.spedtex.org) | `static_fetch` | `nonprofit_organizations` |
| **TEA Guidance on Prior Written Notice** | F. Special education / IEP / Prior Written Notice Guidance | [tea.texas.gov](https://tea.texas.gov/academics/special-student-populations/special-education/guidance-on-prior-written-notice) | `static_fetch` | `programs` |
| **Texas Education Service Centers (ESCs) directory** | F. Special education / IEP / Regional Education Agency Directory | [tea.texas.gov](https://tea.texas.gov/about-tea/other-services/education-service-centers) | `static_fetch` | `regional_education_agencies` |
| **Texas School District Locator** | F. Special education / IEP / School District Directory | [tea.texas.gov](https://tea.texas.gov/reports-and-data/school-performance/accountability-research/school-district-locator) | `playwright` | `school_districts` |
| **Partners Resource Network (PRN)** | H. Parent training / disability rights / legal aid / PTI/CPRC | [prntexas.org](https://prntexas.org) | `static_fetch` | `nonprofit_organizations` |
| **Disability Rights Texas** | H. Parent training / disability rights / legal aid / Disability Rights | [disabilityrightstx.org](https://www.disabilityrightstx.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Texas** | I. Condition-specific nonprofits / The Arc State Chapter | [thearctexas.org](https://www.thearctexas.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of the Capital Area** | I. Condition-specific nonprofits / Local Arc Chapter | [thearcofcapitalarea.org](https://www.thearcofcapitalarea.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Greater Houston** | I. Condition-specific nonprofits / Local Arc Chapter | [thearcofgreaterhouston.com](https://www.thearcofgreaterhouston.com) | `static_fetch` | `nonprofit_organizations` |
| **Autism Society of Texas** | I. Condition-specific nonprofits / Autism Society | [texasautismsociety.org](https://www.texasautismsociety.org) | `static_fetch` | `nonprofit_organizations` |
| **Down Syndrome Association of Houston** | I. Condition-specific nonprofits / Down Syndrome Association | [dsah.org](https://www.dsah.org) | `static_fetch` | `nonprofit_organizations` |
| **Down Syndrome Association of Central Texas** | I. Condition-specific nonprofits / Down Syndrome Association | [dsact.org](https://www.dsact.org) | `static_fetch` | `nonprofit_organizations` |
| **Texas Parent to Parent** | H. Parent training / disability rights / legal aid / Family-to-Family Health Info | [txp2p.org](https://www.txp2p.org) | `static_fetch` | `nonprofit_organizations` |
| **Lone Star Legal Aid** | H. Parent training / disability rights / legal aid / Legal Aid Directory | [lonestarlegal.org](https://www.lonestarlegal.org) | `static_fetch` | `nonprofit_organizations` |
| **Legal Aid of Northwest Texas** | H. Parent training / disability rights / legal aid / Legal Aid Directory | [lanwt.org](https://www.lanwt.org) | `static_fetch` | `nonprofit_organizations` |
| **COPAA Attorney and Advocate Search** | J. Provider and advocate directories / COPAA Directory | [copaa.org](https://www.copaa.org/search/custom.asp?id=3289) | `playwright` | `iep_advocates` |
| **Texas Children's Hospital Autism Center** | M. Hospitals / university clinics / Hospital Clinic Pages | [texaschildrens.org](https://www.texaschildrens.org/departments/autism-center) | `static_fetch` | `resource_providers` |
| **Cook Children's Child Development Center** | M. Hospitals / university clinics / Hospital Clinic Pages | [cookchildrens.org](https://www.cookchildrens.org/services/child-development/) | `static_fetch` | `resource_providers` |
| **UT Dallas Callier Center for Communication Disorders** | M. Hospitals / university clinics / University Autism Clinic | [calliercenter.utdallas.edu](https://calliercenter.utdallas.edu) | `static_fetch` | `resource_providers` |
| **Texas HHSC Official Forms Catalog** | K. Forms and guides / Medicaid Forms Library | [hhs.texas.gov](https://www.hhs.texas.gov/laws-regulations/forms) | `static_fetch` | `program_document_requirements` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County Wikipedia List)
- **Source Name:** Texas Counties Wikipedia List
- **Source URL:** [https://en.wikipedia.org/wiki/List_of_counties_in_Texas](https://en.wikipedia.org/wiki/List_of_counties_in_Texas)
- **Domain:** `en.wikipedia.org`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Reference county names and FIPS codes.
- **Last Checked:** 2026-06-13

### Category: A. State identity and geography (County Government Directory)
- **Source Name:** Texas Association of Counties directory
- **Source URL:** [https://www.county.org/About-Texas-Counties/Texas-County-Directory](https://www.county.org/About-Texas-Counties/Texas-County-Directory)
- **Domain:** `county.org`
- **Target Table:** `counties`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Links to official county websites.
- **Last Checked:** 2026-06-13

### Category: A. State identity and geography (Local Government Lookup)
- **Source Name:** Texas.gov Local Services
- **Source URL:** [https://www.texas.gov/services/local-services/](https://www.texas.gov/services/local-services/)
- **Domain:** `texas.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Mapping city to county relationships.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Texas HHSC Medicaid Homepage
- **Source URL:** [https://hhs.texas.gov](https://hhs.texas.gov)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Medicaid policies and updates.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Application Portal)
- **Source Name:** Your Texas Benefits Application Portal
- **Source URL:** [https://www.yourtexasbenefits.com](https://www.yourtexasbenefits.com)
- **Domain:** `yourtexasbenefits.com`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `step_name, url`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Core portal for public benefit applications.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Office Locator)
- **Source Name:** Texas HHSC Social Service Office locator
- **Source URL:** [https://hhs.texas.gov/services/financial/social-services-offices](https://hhs.texas.gov/services/financial/social-services-offices)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** County dropdown search for local enrollment offices.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (CHIP Page)
- **Source Name:** Texas Medicaid and CHIP Program Info
- **Source URL:** [https://www.hhs.texas.gov/services/health/medicaid-chip](https://www.hhs.texas.gov/services/health/medicaid-chip)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, age_band`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Covers children's health insurance options.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Children's Special Health)
- **Source Name:** Children with Special Health Care Needs (CSHCN) Services Program
- **Source URL:** [https://www.hhs.texas.gov/services/disability/children-special-health-care-needs-services-program](https://www.hhs.texas.gov/services/disability/children-special-health-care-needs-services-program)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, eligibility_rules`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Title V children's program details.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Fair Hearing Page)
- **Source Name:** Texas HHS Office of Appeals
- **Source URL:** [https://www.hhs.texas.gov/about/your-rights/hhs-office-appeals](https://www.hhs.texas.gov/about/your-rights/hhs-office-appeals)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `deadline, steps, form`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Filing appeals for Medicaid service denials.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Managed Care Appeal Page)
- **Source Name:** Texas HHS Ombudsman Managed Care Help
- **Source URL:** [https://www.hhs.texas.gov/about/your-rights/hhs-ombudsman/managed-care-help](https://www.hhs.texas.gov/about/your-rights/hhs-ombudsman/managed-care-help)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `contact_phone, appeal_url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Resolve managed care plan disputes.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Personal Care Page)
- **Source Name:** Texas Medicaid Personal Care Services (PCS)
- **Source URL:** [https://www.hhs.texas.gov/providers/health-services-providers/texas-medicaid-wellness-program/personal-care-services](https://www.hhs.texas.gov/providers/health-services-providers/texas-medicaid-wellness-program/personal-care-services)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, details`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Attendant care for children under age 21.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Texas HHSC IDD Services Home
- **Source URL:** [https://www.hhs.texas.gov/services/disability](https://www.hhs.texas.gov/services/disability)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** State DD entry point regulations.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Local Agency Directory)
- **Source Name:** Texas LIDDAs Providers
- **Source URL:** [https://www.hhs.texas.gov/providers/liddas](https://www.hhs.texas.gov/providers/liddas)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Directory of local authorities for intake.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (County Catchment Source)
- **Source Name:** Texas LIDDA County Catchment locator
- **Source URL:** [https://www.hhs.texas.gov/services/mental-health-substance-use/mental-health-cre-reports/local-intellectual-developmental-disability-authorities-lidda-directory](https://www.hhs.texas.gov/services/mental-health-substance-use/mental-health-cre-reports/local-intellectual-developmental-disability-authorities-lidda-directory)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, counties_served, intake_phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Maps all 254 Texas counties to LIDDA catchments.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Eligibility Page)
- **Source Name:** Texas IDD Services Eligibility Overview
- **Source URL:** [https://www.hhs.texas.gov/services/disability/intellectual-developmental-disability-idd-services](https://www.hhs.texas.gov/services/disability/intellectual-developmental-disability-idd-services)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `program_eligibility_rules`
- **Expected Fields:** `trigger_reason, min_age`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Diagnostic and functional criteria.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Intake/Application Page)
- **Source Name:** How to Apply for Texas IDD Services
- **Source URL:** [https://www.hhs.texas.gov/services/disability/how-apply-idd-services](https://www.hhs.texas.gov/services/disability/how-apply-idd-services)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `step_number, action`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Contact details for requesting an intake assessment.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Family Support/Respite Page)
- **Source Name:** Texas Family Support and Respite services
- **Source URL:** [https://www.hhs.texas.gov/services/disability/respite-care](https://www.hhs.texas.gov/services/disability/respite-care)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Respite program funding and options.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Self-Direction Page)
- **Source Name:** Texas Consumer Directed Services (CDS)
- **Source URL:** [https://www.hhs.texas.gov/providers/long-term-care-providers/consumer-directed-services-cds](https://www.hhs.texas.gov/providers/long-term-care-providers/consumer-directed-services-cds)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, details`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Participant directed care guidelines.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Waitlist/Interest List Page)
- **Source Name:** Texas HHS Waiver Interest List Milestones
- **Source URL:** [https://www.hhs.texas.gov/doing-business-hhs/provider-portals/resources/interest-list-milestones](https://www.hhs.texas.gov/doing-business-hhs/provider-portals/resources/interest-list-milestones)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `program_waitlists`
- **Expected Fields:** `program_id, duration_label`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Interest list counts and wait times.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (HCS Waiver Page)
- **Source Name:** Texas Home and Community-Based Services (HCS) Waiver
- **Source URL:** [https://www.hhs.texas.gov/providers/long-term-care-providers/home-community-based-services-hcs](https://www.hhs.texas.gov/providers/long-term-care-providers/home-community-based-services-hcs)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Waiver target group and services.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (TxHmL Waiver Page)
- **Source Name:** Texas Home Living (TxHmL) Waiver
- **Source URL:** [https://www.hhs.texas.gov/providers/long-term-care-providers/texas-home-living-txhml](https://www.hhs.texas.gov/providers/long-term-care-providers/texas-home-living-txhml)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** In-home waiver details.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (CLASS Waiver Page)
- **Source Name:** Texas CLASS Waiver Program
- **Source URL:** [https://www.hhs.texas.gov/providers/long-term-care-providers/community-living-assistance-support-services-class](https://www.hhs.texas.gov/providers/long-term-care-providers/community-living-assistance-support-services-class)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** CLASS waiver for related conditions.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (MDCP Waiver Page)
- **Source Name:** Texas Medically Dependent Children's Program (MDCP)
- **Source URL:** [https://www.hhs.texas.gov/providers/long-term-care-providers/medically-dependent-childrens-program-mdcp](https://www.hhs.texas.gov/providers/long-term-care-providers/medically-dependent-childrens-program-mdcp)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Waiver for medically fragile children.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (State EI Landing Page)
- **Source Name:** Texas Early Childhood Intervention (ECI) Home
- **Source URL:** [https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Early intervention (0-3 years) services.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Local Program Directory)
- **Source Name:** Texas ECI Programs & Locations Directory
- **Source URL:** [https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-programs-locations](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-programs-locations)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Search or directory of local early start programs.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Referral Page/Form)
- **Source Name:** How to Make ECI Referrals
- **Source URL:** [https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/how-make-referral-eci](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/how-make-referral-eci)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `step_number, form_url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Intake phone lines and online referral forms.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Eligibility Page)
- **Source Name:** Texas ECI Eligibility criteria
- **Source URL:** [https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-eligibility](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-eligibility)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `program_eligibility_rules`
- **Expected Fields:** `min_age, max_age, required_condition`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Developmental delay thresholds.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Transition at Age 3)
- **Source Name:** Texas ECI Transition Beyond ECI
- **Source URL:** [https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-transition-beyond-eci](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-transition-beyond-eci)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `title, action_description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Transitioning children from ECI to IEP special education.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Complaint/Dispute Process)
- **Source Name:** Texas ECI Parent Rights & Complaints
- **Source URL:** [https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-parent-rights-complaints](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-parent-rights-complaints)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `deadline_days, appeal_steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Filing state complaints and due process.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Landing Page)
- **Source Name:** Texas Education Agency (TEA) Special Education Home
- **Source URL:** [https://tea.texas.gov/academics/special-student-populations/special-education](https://tea.texas.gov/academics/special-student-populations/special-education)
- **Domain:** `tea.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Special education policies and rules.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Procedural Safeguards)
- **Source Name:** TEA Special Education Procedural Safeguards
- **Source URL:** [https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/procedural-safeguards](https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/procedural-safeguards)
- **Domain:** `tea.texas.gov`
- **Target Table:** `program_document_requirements`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Parent rights guide in special education.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (State Complaint Page/Form)
- **Source Name:** TEA Special Education State Complaints
- **Source URL:** [https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/special-education-state-complaints](https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/special-education-state-complaints)
- **Domain:** `tea.texas.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** State level special education complaints.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Due Process Page/Form)
- **Source Name:** TEA Due Process Hearings Program
- **Source URL:** [https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/special-education-due-process-hearing-program](https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/special-education-due-process-hearing-program)
- **Domain:** `tea.texas.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, deadline_days`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Filing due process complaints.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Mediation Page)
- **Source Name:** TEA Special Education Mediation Program
- **Source URL:** [https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/special-education-mediation-program](https://tea.texas.gov/academics/special-student-populations/special-education/dispute-resolution/special-education-mediation-program)
- **Domain:** `tea.texas.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `appeal_steps, appeal_form_name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Mediation services for special education disputes.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Parent Rights Guide)
- **Source Name:** SpedTex - Special Education Information Center
- **Source URL:** [https://www.spedtex.org](https://www.spedtex.org)
- **Domain:** `spedtex.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Parent resources and hotline for IEP concerns.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Prior Written Notice Guidance)
- **Source Name:** TEA Guidance on Prior Written Notice
- **Source URL:** [https://tea.texas.gov/academics/special-student-populations/special-education/guidance-on-prior-written-notice](https://tea.texas.gov/academics/special-student-populations/special-education/guidance-on-prior-written-notice)
- **Domain:** `tea.texas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** District obligations for notice.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Regional Education Agency Directory)
- **Source Name:** Texas Education Service Centers (ESCs) directory
- **Source URL:** [https://tea.texas.gov/about-tea/other-services/education-service-centers](https://tea.texas.gov/about-tea/other-services/education-service-centers)
- **Domain:** `tea.texas.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Directory of the 20 Education Service Centers.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (School District Directory)
- **Source Name:** Texas School District Locator
- **Source URL:** [https://tea.texas.gov/reports-and-data/school-performance/accountability-research/school-district-locator](https://tea.texas.gov/reports-and-data/school-performance/accountability-research/school-district-locator)
- **Domain:** `tea.texas.gov`
- **Target Table:** `school_districts`
- **Expected Fields:** `name, website, county_id`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Directory lookup for school district special ed contacts.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI/CPRC)
- **Source Name:** Partners Resource Network (PRN)
- **Source URL:** [https://prntexas.org](https://prntexas.org)
- **Domain:** `prntexas.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Parent Training and Information (PTI) Center for Texas.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Disability Rights)
- **Source Name:** Disability Rights Texas
- **Source URL:** [https://www.disabilityrightstx.org](https://www.disabilityrightstx.org)
- **Domain:** `disabilityrightstx.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Protection and Advocacy organization.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Texas
- **Source URL:** [https://www.thearctexas.org](https://www.thearctexas.org)
- **Domain:** `thearctexas.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** State chapter of advocacy group.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Local Arc Chapter)
- **Source Name:** The Arc of the Capital Area
- **Source URL:** [https://www.thearcofcapitalarea.org](https://www.thearcofcapitalarea.org)
- **Domain:** `thearcofcapitalarea.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone, county_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Serves Travis County and Austin area.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Local Arc Chapter)
- **Source Name:** The Arc of Greater Houston
- **Source URL:** [https://www.thearcofgreaterhouston.com](https://www.thearcofgreaterhouston.com)
- **Domain:** `thearcofgreaterhouston.com`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone, county_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Serves Harris County and Houston area.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Autism Society)
- **Source Name:** Autism Society of Texas
- **Source URL:** [https://www.texasautismsociety.org](https://www.texasautismsociety.org)
- **Domain:** `texasautismsociety.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Autism support groups and local networks.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Down Syndrome Association)
- **Source Name:** Down Syndrome Association of Houston
- **Source URL:** [https://www.dsah.org](https://www.dsah.org)
- **Domain:** `dsah.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone, county_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Houston metro support center.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Down Syndrome Association)
- **Source Name:** Down Syndrome Association of Central Texas
- **Source URL:** [https://www.dsact.org](https://www.dsact.org)
- **Domain:** `dsact.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone, county_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Austin and Central Texas metro support.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Family-to-Family Health Info)
- **Source Name:** Texas Parent to Parent
- **Source URL:** [https://www.txp2p.org](https://www.txp2p.org)
- **Domain:** `txp2p.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Family to Family health information network.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Legal Aid Directory)
- **Source Name:** Lone Star Legal Aid
- **Source URL:** [https://www.lonestarlegal.org](https://www.lonestarlegal.org)
- **Domain:** `lonestarlegal.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Legal assistance for low income families in East Texas.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Legal Aid Directory)
- **Source Name:** Legal Aid of Northwest Texas
- **Source URL:** [https://www.lanwt.org](https://www.lanwt.org)
- **Domain:** `lanwt.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Legal assistance for Dallas/Fort Worth and West Texas.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (COPAA Directory)
- **Source Name:** COPAA Attorney and Advocate Search
- **Source URL:** [https://www.copaa.org/search/custom.asp?id=3289](https://www.copaa.org/search/custom.asp?id=3289)
- **Domain:** `copaa.org`
- **Target Table:** `iep_advocates`
- **Expected Fields:** `name, credentials, website, phone, email`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `manual_review`
- **Terms Risk:** `medium`
- **Priority:** 3
- **Notes:** Search directory of special ed attorneys. Verify scraper terms.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospital Clinic Pages)
- **Source Name:** Texas Children's Hospital Autism Center
- **Source URL:** [https://www.texaschildrens.org/departments/autism-center](https://www.texaschildrens.org/departments/autism-center)
- **Domain:** `texaschildrens.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Houston hospital pediatric autism program.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospital Clinic Pages)
- **Source Name:** Cook Children's Child Development Center
- **Source URL:** [https://www.cookchildrens.org/services/child-development/](https://www.cookchildrens.org/services/child-development/)
- **Domain:** `cookchildrens.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Fort Worth developmental pediatrics clinic.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (University Autism Clinic)
- **Source Name:** UT Dallas Callier Center for Communication Disorders
- **Source URL:** [https://calliercenter.utdallas.edu](https://calliercenter.utdallas.edu)
- **Domain:** `calliercenter.utdallas.edu`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Pediatric diagnostic and speech therapy clinics.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Medicaid Forms Library)
- **Source Name:** Texas HHSC Official Forms Catalog
- **Source URL:** [https://www.hhs.texas.gov/laws-regulations/forms](https://www.hhs.texas.gov/laws-regulations/forms)
- **Domain:** `hhs.texas.gov`
- **Target Table:** `program_document_requirements`
- **Expected Fields:** `name, url, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Searchable state PDF form archive.
- **Last Checked:** 2026-06-13

