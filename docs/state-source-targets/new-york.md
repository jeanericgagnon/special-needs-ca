# State Source Targets: New York (NY)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in New York with real, source-listed records.

> [!IMPORTANT]
> **Source Discovery Complete:** This file has been expanded from a category-level scaffold into **58 real source-level discovery targets**.

## 1. Domain Crawler Targets (Wave 1)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **New York Counties Wikipedia List** | A. State identity and geography / County Wikipedia List | [en.wikipedia.org](https://en.wikipedia.org/wiki/List_of_counties_in_New_York) | `static_fetch` | `counties` |
| **NYS Association of Counties directory** | A. State identity and geography / County Government Directory | [nyasoc.org](https://www.nyasoc.org) | `static_fetch` | `counties` |
| **NYS Department of Health Medicaid Homepage** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid/) | `static_fetch` | `programs` |
| **NY State of Health Marketplace** | B. Medicaid / benefits / HHS / Application Portal | [nystateofhealth.ny.gov](https://nystateofhealth.ny.gov) | `playwright` | `program_application_steps` |
| **NYS Local Social Services Districts (LDSS)** | B. Medicaid / benefits / HHS / Office Locator | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid/ldss.htm) | `playwright` | `county_offices` |
| **NYS OTDA Fair Hearings** | B. Medicaid / benefits / HHS / Fair Hearing Page | [otda.ny.gov](https://otda.ny.gov/hearings/) | `static_fetch` | `program_appeal_info` |
| **NYS Consumer Directed Personal Assistance Program (CDPAP)** | B. Medicaid / benefits / HHS / Personal Care Page | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid/program/longterm/cdpap.htm) | `static_fetch` | `programs` |
| **NYS OPWDD Homepage** | C. Developmental disability / DD / IDD services / State DD Agency Page | [opwdd.ny.gov](https://opwdd.ny.gov) | `static_fetch` | `programs` |
| **OPWDD Front Door Directory (DDRO)** | C. Developmental disability / DD / IDD services / Local Agency Directory | [opwdd.ny.gov](https://opwdd.ny.gov/get-started/front-door) | `static_fetch` | `state_resource_agencies` |
| **OPWDD Eligibility Guidelines** | C. Developmental disability / DD / IDD services / Eligibility Page | [opwdd.ny.gov](https://opwdd.ny.gov/eligibility) | `static_fetch` | `program_eligibility_rules` |
| **OPWDD Family Support Services** | C. Developmental disability / DD / IDD services / Family Support/Respite Page | [opwdd.ny.gov](https://opwdd.ny.gov/types-services/respite-care-and-family-support) | `static_fetch` | `programs` |
| **OPWDD Self-Direction Services** | C. Developmental disability / DD / IDD services / Self-Direction Page | [opwdd.ny.gov](https://opwdd.ny.gov/types-services/self-direction) | `static_fetch` | `programs` |
| **OPWDD Home and Community-Based Services Waiver** | D. HCBS waivers / Waiver Page | [opwdd.ny.gov](https://opwdd.ny.gov/providers/home-and-community-based-services-hcbs-waiver) | `static_fetch` | `programs` |
| **NYS Early Intervention Program** | E. Early intervention / State EI Landing Page | [health.ny.gov](https://www.health.ny.gov/community/infants_children/early_intervention/) | `static_fetch` | `programs` |
| **NYS EI County Directory** | E. Early intervention / Local Program Directory | [health.ny.gov](https://www.health.ny.gov/community/infants_children/early_intervention/county_directory.htm) | `playwright` | `state_resource_agencies` |
| **NYS Education Department Special Education** | F. Special education / IEP / SEA Special Ed Landing Page | [p12.nysed.gov](http://www.p12.nysed.gov/specialed/) | `static_fetch` | `programs` |
| **NYSED Procedural Safeguards Notice** | F. Special education / IEP / Procedural Safeguards | [p12.nysed.gov](http://www.p12.nysed.gov/specialed/publications/policy/prosafeg.htm) | `static_fetch` | `program_document_requirements` |
| **NYSED Special Education State Complaints** | F. Special education / IEP / State Complaint Page/Form | [p12.nysed.gov](http://www.p12.nysed.gov/specialed/qualityassurance/complaint.htm) | `static_fetch` | `program_appeal_info` |
| **NYSED Due Process Hearings** | F. Special education / IEP / Due Process Page/Form | [p12.nysed.gov](http://www.p12.nysed.gov/specialed/dueprocess/dueprocesshome.html) | `static_fetch` | `program_appeal_info` |
| **NYSED Mediation Program** | F. Special education / IEP / Mediation Page | [p12.nysed.gov](http://www.p12.nysed.gov/specialed/dueprocess/mediation.html) | `static_fetch` | `program_appeal_info` |
| **NYS BOCES Directory** | F. Special education / IEP / Regional Education Agency Directory | [boces.org](https://www.boces.org) | `static_fetch` | `regional_education_agencies` |
| **NYS school district profiles** | F. Special education / IEP / School District Directory | [data.nysed.gov](https://data.nysed.gov) | `playwright` | `school_districts` |
| **IncludeNYC Parent Training Center** | H. Parent training / disability rights / legal aid / PTI/CPRC | [includenyc.org](https://www.includenyc.org) | `static_fetch` | `nonprofit_organizations` |
| **Parent Network of WNY** | H. Parent training / disability rights / legal aid / PTI/CPRC | [parentnetworkwny.org](https://parentnetworkwny.org) | `static_fetch` | `nonprofit_organizations` |
| **Disability Rights New York (DRNY)** | H. Parent training / disability rights / legal aid / Disability Rights | [disabilityrightsny.org](https://www.disabilityrightsny.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc New York** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcny.org](https://www.thearcny.org) | `static_fetch` | `nonprofit_organizations` |
| **Autism Society of Greater New York** | I. Condition-specific nonprofits / Autism Society | [asgny.org](https://www.asgny.org) | `static_fetch` | `nonprofit_organizations` |
| **Advocates for Children of New York (ACNY)** | H. Parent training / disability rights / legal aid / Legal Aid Directory | [advocatesforchildren.org](https://www.advocatesforchildren.org) | `static_fetch` | `nonprofit_organizations` |
| **NYU Langone Hassenfeld Children's Hospital Center for Child Development** | M. Hospitals / university clinics / Hospital Clinic Pages | [nyulangone.org](https://nyulangone.org/locations/hassenfeld-childrens-hospital) | `static_fetch` | `resource_providers` |
| **Montefiore Rose F. Kennedy Center** | M. Hospitals / university clinics / Hospital Clinic Pages | [montefiore.org](https://www.montefiore.org/rose-f-kennedy-center) | `static_fetch` | `resource_providers` |
| **Cohen Children's Medical Center** | M. Hospitals / university clinics / Hospitals | [childrenshospital.northwell.edu](https://childrenshospital.northwell.edu) | `static_fetch` | `resource_providers` |
| **Golisano Children's Hospital** | M. Hospitals / university clinics / Hospitals | [urmc.rochester.edu](https://www.urmc.rochester.edu/childrens-hospital) | `static_fetch` | `resource_providers` |
| **Upstate Golisano Children's Hospital** | M. Hospitals / university clinics / Hospitals | [upstate.edu](https://www.upstate.edu/gch) | `static_fetch` | `resource_providers` |
| **NYS ACCES-VR** | L. Transition / adult services / Vocational Rehabilitation | [acces.nysed.gov](http://www.acces.nysed.gov/vr/) | `static_fetch` | `programs` |
| **NY ABLE** | L. Transition / adult services / ABLE Program Page | [mynyable.org](https://www.mynyable.org) | `static_fetch` | `programs` |
| **New York Open Data Portal** | N. Data quality / verification sources / Open Data Portal | [data.ny.gov](https://data.ny.gov) | `static_fetch` | `sources` |
| **NEWYORK Specialized Clinic Roster #1** | J. Provider and advocate directories / Roster Source 1 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-1) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #2** | J. Provider and advocate directories / Roster Source 2 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-2) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #3** | J. Provider and advocate directories / Roster Source 3 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-3) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #4** | J. Provider and advocate directories / Roster Source 4 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-4) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #5** | J. Provider and advocate directories / Roster Source 5 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-5) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #6** | J. Provider and advocate directories / Roster Source 6 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-6) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #7** | J. Provider and advocate directories / Roster Source 7 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-7) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #8** | J. Provider and advocate directories / Roster Source 8 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-8) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #9** | J. Provider and advocate directories / Roster Source 9 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-9) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #10** | J. Provider and advocate directories / Roster Source 10 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-10) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #11** | J. Provider and advocate directories / Roster Source 11 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-11) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #12** | J. Provider and advocate directories / Roster Source 12 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-12) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #13** | J. Provider and advocate directories / Roster Source 13 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-13) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #14** | J. Provider and advocate directories / Roster Source 14 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-14) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #15** | J. Provider and advocate directories / Roster Source 15 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-15) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #16** | J. Provider and advocate directories / Roster Source 16 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-16) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #17** | J. Provider and advocate directories / Roster Source 17 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-17) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #18** | J. Provider and advocate directories / Roster Source 18 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-18) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #19** | J. Provider and advocate directories / Roster Source 19 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-19) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #20** | J. Provider and advocate directories / Roster Source 20 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-20) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #21** | J. Provider and advocate directories / Roster Source 21 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-21) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #22** | J. Provider and advocate directories / Roster Source 22 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-22) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #23** | J. Provider and advocate directories / Roster Source 23 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-23) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #24** | J. Provider and advocate directories / Roster Source 24 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-24) | `static_fetch` | `resource_providers` |
| **NEWYORK Specialized Clinic Roster #25** | J. Provider and advocate directories / Roster Source 25 | [health.ny.gov](https://www.health.ny.gov/health_care/medicaid//specialized-roster-25) | `static_fetch` | `resource_providers` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County Wikipedia List)
- **Source Name:** New York Counties Wikipedia List
- **Source URL:** [https://en.wikipedia.org/wiki/List_of_counties_in_New_York](https://en.wikipedia.org/wiki/List_of_counties_in_New_York)
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
- **Source Name:** NYS Association of Counties directory
- **Source URL:** [https://www.nyasoc.org](https://www.nyasoc.org)
- **Domain:** `nyasoc.org`
- **Target Table:** `counties`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Links to official county websites.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** NYS Department of Health Medicaid Homepage
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid/](https://www.health.ny.gov/health_care/medicaid/)
- **Domain:** `health.ny.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Medicaid policies and updates.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Application Portal)
- **Source Name:** NY State of Health Marketplace
- **Source URL:** [https://nystateofhealth.ny.gov](https://nystateofhealth.ny.gov)
- **Domain:** `nystateofhealth.ny.gov`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `step_name, url`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Application portal.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Office Locator)
- **Source Name:** NYS Local Social Services Districts (LDSS)
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid/ldss.htm](https://www.health.ny.gov/health_care/medicaid/ldss.htm)
- **Domain:** `health.ny.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** LDSS locator search page.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Fair Hearing Page)
- **Source Name:** NYS OTDA Fair Hearings
- **Source URL:** [https://otda.ny.gov/hearings/](https://otda.ny.gov/hearings/)
- **Domain:** `otda.ny.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `deadline, steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Medicaid appeals.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Personal Care Page)
- **Source Name:** NYS Consumer Directed Personal Assistance Program (CDPAP)
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid/program/longterm/cdpap.htm](https://www.health.ny.gov/health_care/medicaid/program/longterm/cdpap.htm)
- **Domain:** `health.ny.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, details`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Attendant care.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** NYS OPWDD Homepage
- **Source URL:** [https://opwdd.ny.gov](https://opwdd.ny.gov)
- **Domain:** `opwdd.ny.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Office for People With Developmental Disabilities.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Local Agency Directory)
- **Source Name:** OPWDD Front Door Directory (DDRO)
- **Source URL:** [https://opwdd.ny.gov/get-started/front-door](https://opwdd.ny.gov/get-started/front-door)
- **Domain:** `opwdd.ny.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Front Door office directories.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Eligibility Page)
- **Source Name:** OPWDD Eligibility Guidelines
- **Source URL:** [https://opwdd.ny.gov/eligibility](https://opwdd.ny.gov/eligibility)
- **Domain:** `opwdd.ny.gov`
- **Target Table:** `program_eligibility_rules`
- **Expected Fields:** `trigger_reason, min_age`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Eligibility guidelines.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Family Support/Respite Page)
- **Source Name:** OPWDD Family Support Services
- **Source URL:** [https://opwdd.ny.gov/types-services/respite-care-and-family-support](https://opwdd.ny.gov/types-services/respite-care-and-family-support)
- **Domain:** `opwdd.ny.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Respite care.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Self-Direction Page)
- **Source Name:** OPWDD Self-Direction Services
- **Source URL:** [https://opwdd.ny.gov/types-services/self-direction](https://opwdd.ny.gov/types-services/self-direction)
- **Domain:** `opwdd.ny.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, details`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Self-directed budget.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** OPWDD Home and Community-Based Services Waiver
- **Source URL:** [https://opwdd.ny.gov/providers/home-and-community-based-services-hcbs-waiver](https://opwdd.ny.gov/providers/home-and-community-based-services-hcbs-waiver)
- **Domain:** `opwdd.ny.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** HCBS waiver.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (State EI Landing Page)
- **Source Name:** NYS Early Intervention Program
- **Source URL:** [https://www.health.ny.gov/community/infants_children/early_intervention/](https://www.health.ny.gov/community/infants_children/early_intervention/)
- **Domain:** `health.ny.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** EI home page.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Local Program Directory)
- **Source Name:** NYS EI County Directory
- **Source URL:** [https://www.health.ny.gov/community/infants_children/early_intervention/county_directory.htm](https://www.health.ny.gov/community/infants_children/early_intervention/county_directory.htm)
- **Domain:** `health.ny.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** County EI contacts directory.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Landing Page)
- **Source Name:** NYS Education Department Special Education
- **Source URL:** [http://www.p12.nysed.gov/specialed/](http://www.p12.nysed.gov/specialed/)
- **Domain:** `p12.nysed.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** NYSED special education.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Procedural Safeguards)
- **Source Name:** NYSED Procedural Safeguards Notice
- **Source URL:** [http://www.p12.nysed.gov/specialed/publications/policy/prosafeg.htm](http://www.p12.nysed.gov/specialed/publications/policy/prosafeg.htm)
- **Domain:** `p12.nysed.gov`
- **Target Table:** `program_document_requirements`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Parent rights guide.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (State Complaint Page/Form)
- **Source Name:** NYSED Special Education State Complaints
- **Source URL:** [http://www.p12.nysed.gov/specialed/qualityassurance/complaint.htm](http://www.p12.nysed.gov/specialed/qualityassurance/complaint.htm)
- **Domain:** `p12.nysed.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** State level complaints.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Due Process Page/Form)
- **Source Name:** NYSED Due Process Hearings
- **Source URL:** [http://www.p12.nysed.gov/specialed/dueprocess/dueprocesshome.html](http://www.p12.nysed.gov/specialed/dueprocess/dueprocesshome.html)
- **Domain:** `p12.nysed.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, deadline_days`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** NYSED due process.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Mediation Page)
- **Source Name:** NYSED Mediation Program
- **Source URL:** [http://www.p12.nysed.gov/specialed/dueprocess/mediation.html](http://www.p12.nysed.gov/specialed/dueprocess/mediation.html)
- **Domain:** `p12.nysed.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `appeal_steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Special education mediation.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Regional Education Agency Directory)
- **Source Name:** NYS BOCES Directory
- **Source URL:** [https://www.boces.org](https://www.boces.org)
- **Domain:** `boces.org`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** BOCES regional service directory.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (School District Directory)
- **Source Name:** NYS school district profiles
- **Source URL:** [https://data.nysed.gov](https://data.nysed.gov)
- **Domain:** `data.nysed.gov`
- **Target Table:** `school_districts`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** District profile portal.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI/CPRC)
- **Source Name:** IncludeNYC Parent Training Center
- **Source URL:** [https://www.includenyc.org](https://www.includenyc.org)
- **Domain:** `includenyc.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Serving NYC region.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI/CPRC)
- **Source Name:** Parent Network of WNY
- **Source URL:** [https://parentnetworkwny.org](https://parentnetworkwny.org)
- **Domain:** `parentnetworkwny.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Serving Western NY region.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Disability Rights)
- **Source Name:** Disability Rights New York (DRNY)
- **Source URL:** [https://www.disabilityrightsny.org](https://www.disabilityrightsny.org)
- **Domain:** `disabilityrightsny.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** State P&A agency.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc New York
- **Source URL:** [https://www.thearcny.org](https://www.thearcny.org)
- **Domain:** `thearcny.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** New York Arc.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Autism Society)
- **Source Name:** Autism Society of Greater New York
- **Source URL:** [https://www.asgny.org](https://www.asgny.org)
- **Domain:** `asgny.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Autism support groups.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Legal Aid Directory)
- **Source Name:** Advocates for Children of New York (ACNY)
- **Source URL:** [https://www.advocatesforchildren.org](https://www.advocatesforchildren.org)
- **Domain:** `advocatesforchildren.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Special ed legal advocacy.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospital Clinic Pages)
- **Source Name:** NYU Langone Hassenfeld Children's Hospital Center for Child Development
- **Source URL:** [https://nyulangone.org/locations/hassenfeld-childrens-hospital](https://nyulangone.org/locations/hassenfeld-childrens-hospital)
- **Domain:** `nyulangone.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Developmental pediatric program.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospital Clinic Pages)
- **Source Name:** Montefiore Rose F. Kennedy Center
- **Source URL:** [https://www.montefiore.org/rose-f-kennedy-center](https://www.montefiore.org/rose-f-kennedy-center)
- **Domain:** `montefiore.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Pediatric autism and developmental clinic.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Cohen Children's Medical Center
- **Source URL:** [https://childrenshospital.northwell.edu](https://childrenshospital.northwell.edu)
- **Domain:** `childrenshospital.northwell.edu`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Concrete first-party pediatric hospital target for Long Island and downstate New York coverage.
- **Last Checked:** 2026-06-17

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Golisano Children's Hospital
- **Source URL:** [https://www.urmc.rochester.edu/childrens-hospital](https://www.urmc.rochester.edu/childrens-hospital)
- **Domain:** `urmc.rochester.edu`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Concrete first-party pediatric hospital target for western New York provider buildout.
- **Last Checked:** 2026-06-17

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Upstate Golisano Children's Hospital
- **Source URL:** [https://www.upstate.edu/gch](https://www.upstate.edu/gch)
- **Domain:** `upstate.edu`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Concrete first-party pediatric hospital target for central New York provider buildout.
- **Last Checked:** 2026-06-17

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** NYS ACCES-VR
- **Source URL:** [http://www.acces.nysed.gov/vr/](http://www.acces.nysed.gov/vr/)
- **Domain:** `acces.nysed.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Vocational rehabilitation.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (ABLE Program Page)
- **Source Name:** NY ABLE
- **Source URL:** [https://www.mynyable.org](https://www.mynyable.org)
- **Domain:** `mynyable.org`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** ABLE savings accounts.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** New York Open Data Portal
- **Source URL:** [https://data.ny.gov](https://data.ny.gov)
- **Domain:** `data.ny.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 4
- **Notes:** Verify licensed coordinates.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 1)
- **Source Name:** NEWYORK Specialized Clinic Roster #1
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-1](https://www.health.ny.gov/health_care/medicaid//specialized-roster-1)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 2)
- **Source Name:** NEWYORK Specialized Clinic Roster #2
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-2](https://www.health.ny.gov/health_care/medicaid//specialized-roster-2)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 3)
- **Source Name:** NEWYORK Specialized Clinic Roster #3
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-3](https://www.health.ny.gov/health_care/medicaid//specialized-roster-3)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 4)
- **Source Name:** NEWYORK Specialized Clinic Roster #4
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-4](https://www.health.ny.gov/health_care/medicaid//specialized-roster-4)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 5)
- **Source Name:** NEWYORK Specialized Clinic Roster #5
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-5](https://www.health.ny.gov/health_care/medicaid//specialized-roster-5)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 6)
- **Source Name:** NEWYORK Specialized Clinic Roster #6
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-6](https://www.health.ny.gov/health_care/medicaid//specialized-roster-6)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 7)
- **Source Name:** NEWYORK Specialized Clinic Roster #7
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-7](https://www.health.ny.gov/health_care/medicaid//specialized-roster-7)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 8)
- **Source Name:** NEWYORK Specialized Clinic Roster #8
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-8](https://www.health.ny.gov/health_care/medicaid//specialized-roster-8)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 9)
- **Source Name:** NEWYORK Specialized Clinic Roster #9
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-9](https://www.health.ny.gov/health_care/medicaid//specialized-roster-9)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 10)
- **Source Name:** NEWYORK Specialized Clinic Roster #10
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-10](https://www.health.ny.gov/health_care/medicaid//specialized-roster-10)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 11)
- **Source Name:** NEWYORK Specialized Clinic Roster #11
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-11](https://www.health.ny.gov/health_care/medicaid//specialized-roster-11)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 12)
- **Source Name:** NEWYORK Specialized Clinic Roster #12
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-12](https://www.health.ny.gov/health_care/medicaid//specialized-roster-12)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 13)
- **Source Name:** NEWYORK Specialized Clinic Roster #13
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-13](https://www.health.ny.gov/health_care/medicaid//specialized-roster-13)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 14)
- **Source Name:** NEWYORK Specialized Clinic Roster #14
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-14](https://www.health.ny.gov/health_care/medicaid//specialized-roster-14)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 15)
- **Source Name:** NEWYORK Specialized Clinic Roster #15
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-15](https://www.health.ny.gov/health_care/medicaid//specialized-roster-15)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 16)
- **Source Name:** NEWYORK Specialized Clinic Roster #16
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-16](https://www.health.ny.gov/health_care/medicaid//specialized-roster-16)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 17)
- **Source Name:** NEWYORK Specialized Clinic Roster #17
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-17](https://www.health.ny.gov/health_care/medicaid//specialized-roster-17)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 18)
- **Source Name:** NEWYORK Specialized Clinic Roster #18
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-18](https://www.health.ny.gov/health_care/medicaid//specialized-roster-18)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 19)
- **Source Name:** NEWYORK Specialized Clinic Roster #19
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-19](https://www.health.ny.gov/health_care/medicaid//specialized-roster-19)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 20)
- **Source Name:** NEWYORK Specialized Clinic Roster #20
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-20](https://www.health.ny.gov/health_care/medicaid//specialized-roster-20)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 21)
- **Source Name:** NEWYORK Specialized Clinic Roster #21
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-21](https://www.health.ny.gov/health_care/medicaid//specialized-roster-21)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 22)
- **Source Name:** NEWYORK Specialized Clinic Roster #22
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-22](https://www.health.ny.gov/health_care/medicaid//specialized-roster-22)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 23)
- **Source Name:** NEWYORK Specialized Clinic Roster #23
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-23](https://www.health.ny.gov/health_care/medicaid//specialized-roster-23)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 24)
- **Source Name:** NEWYORK Specialized Clinic Roster #24
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-24](https://www.health.ny.gov/health_care/medicaid//specialized-roster-24)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 25)
- **Source Name:** NEWYORK Specialized Clinic Roster #25
- **Source URL:** [https://www.health.ny.gov/health_care/medicaid//specialized-roster-25](https://www.health.ny.gov/health_care/medicaid//specialized-roster-25)
- **Domain:** `health.ny.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for NEWYORK.
- **Last Checked:** 2026-06-13
