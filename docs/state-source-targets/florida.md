# State Source Targets: Florida (FL)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Florida with real, source-listed records.

> [!IMPORTANT]
> **Source Discovery Complete:** This file has been expanded from a category-level scaffold into **49 real source-level discovery targets**.

## 1. Domain Crawler Targets (Wave 1)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Florida Counties Wikipedia List** | A. State identity and geography / County Wikipedia List | [en.wikipedia.org](https://en.wikipedia.org/wiki/List_of_counties_in_Florida) | `static_fetch` | `counties` |
| **Florida Association of Counties directory** | A. State identity and geography / County Government Directory | [flcounties.com](https://www.flcounties.com) | `static_fetch` | `counties` |
| **Florida AHCA Medicaid Homepage** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [ahca.myflorida.com](https://ahca.myflorida.com) | `static_fetch` | `programs` |
| **ACCESS Florida Portal** | B. Medicaid / benefits / HHS / Application Portal | [myflfamilies.com](https://www.myflfamilies.com/services/public-assistance) | `playwright` | `program_application_steps` |
| **ACCESS Local Service Center Lookup** | B. Medicaid / benefits / HHS / Office Locator | [myflfamilies.com](https://www.myflfamilies.com/service-programs/access/map.shtml) | `playwright` | `county_offices` |
| **Florida KidCare** | B. Medicaid / benefits / HHS / CHIP Page | [floridakidcare.org](https://www.floridakidcare.org) | `static_fetch` | `programs` |
| **Children's Medical Services (CMS) Plan** | B. Medicaid / benefits / HHS / Children's Special Health | [cmsplan.floridahealth.gov](https://www.cmsplan.floridahealth.gov) | `static_fetch` | `programs` |
| **ACCESS Office of Public Benefits Hearings** | B. Medicaid / benefits / HHS / Fair Hearing Page | [myflfamilies.com](https://www.myflfamilies.com/about/office-public-benefits-hearings) | `static_fetch` | `program_appeal_info` |
| **Florida Subscriber Assistance Program** | B. Medicaid / benefits / HHS / Managed Care Appeal Page | [ahca.myflorida.com](https://ahca.myflorida.com/medicaid/statewide-medicaid-managed-care/subscriber-assistance-program) | `static_fetch` | `program_appeal_info` |
| **Florida Consumer Directed Care Plus (CDC+)** | B. Medicaid / benefits / HHS / Personal Care Page | [apd.myflorida.com](https://apd.myflorida.com/cdcplus/) | `static_fetch` | `programs` |
| **Florida APD Homepage** | C. Developmental disability / DD / IDD services / State DD Agency Page | [apd.myflorida.com](https://apd.myflorida.com) | `static_fetch` | `programs` |
| **Florida APD Regional Offices Directory** | C. Developmental disability / DD / IDD services / Local Agency Directory | [apd.myflorida.com](https://apd.myflorida.com/region/) | `static_fetch` | `state_resource_agencies` |
| **Florida APD Eligibility Overview** | C. Developmental disability / DD / IDD services / Eligibility Page | [apd.myflorida.com](https://apd.myflorida.com/customers/eligibility/) | `static_fetch` | `program_eligibility_rules` |
| **Florida APD Intake Application** | C. Developmental disability / DD / IDD services / Intake/Application Page | [apd.myflorida.com](https://apd.myflorida.com/customers/application/) | `static_fetch` | `program_application_steps` |
| **Florida APD Family Support Services** | C. Developmental disability / DD / IDD services / Family Support/Respite Page | [apd.myflorida.com](https://apd.myflorida.com/customers/family-support/) | `static_fetch` | `programs` |
| **Florida APD Waitlist Statistics** | C. Developmental disability / DD / IDD services / Waitlist/Interest List Page | [apd.myflorida.com](https://apd.myflorida.com/customers/waitlist/) | `static_fetch` | `program_waitlists` |
| **Florida iBudget Waiver Program** | D. HCBS waivers / iBudget Waiver Page | [apd.myflorida.com](https://apd.myflorida.com/ibudget/) | `static_fetch` | `programs` |
| **Florida Early Steps Program** | E. Early intervention / State EI Landing Page | [floridaearlysteps.com](https://www.floridaearlysteps.com) | `static_fetch` | `programs` |
| **Florida Early Steps Local Directories** | E. Early intervention / Local Program Directory | [cmsplan.floridahealth.gov](https://www.cmsplan.floridahealth.gov/earlysteps/directories/) | `playwright` | `state_resource_agencies` |
| **Florida DOE Exceptional Student Education (ESE) Home** | F. Special education / IEP / SEA Special Ed Landing Page | [fldoe.org](https://www.fldoe.org/academics/exceptional-student-edu/) | `static_fetch` | `programs` |
| **FLDOE Exceptional Student Education Dispute Resolution** | F. Special education / IEP / Procedural Safeguards | [fldoe.org](https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/) | `static_fetch` | `program_document_requirements` |
| **FLDOE State Complaint Form** | F. Special education / IEP / State Complaint Page/Form | [fldoe.org](https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/state-complaint.shtml) | `static_fetch` | `program_appeal_info` |
| **FLDOE Due Process Hearings** | F. Special education / IEP / Due Process Page/Form | [fldoe.org](https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/due-process.shtml) | `static_fetch` | `program_appeal_info` |
| **FLDOE Mediation Option** | F. Special education / IEP / Mediation Page | [fldoe.org](https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/mediation.shtml) | `static_fetch` | `program_appeal_info` |
| **FLDOE Parent Info Home** | F. Special education / IEP / Parent Rights Guide | [fldoe.org](https://www.fldoe.org/academics/exceptional-student-edu/parent-info/) | `static_fetch` | `nonprofit_organizations` |
| **FDLRS Find a Center Map** | F. Special education / IEP / Regional Education Agency Directory | [fdlrs.org](https://www.fdlrs.org/find-a-center) | `static_fetch` | `regional_education_agencies` |
| **Florida School District Directory** | F. Special education / IEP / School District Directory | [fldoe.org](https://www.fldoe.org/contact-us/districts.shtml) | `playwright` | `school_districts` |
| **Family Network on Disabilities (FND)** | H. Parent training / disability rights / legal aid / PTI/CPRC | [fndusa.org](https://fndusa.org) | `static_fetch` | `nonprofit_organizations` |
| **Disability Rights Florida** | H. Parent training / disability rights / legal aid / Disability Rights | [disabilityrightsflorida.org](https://www.disabilityrightsflorida.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Florida** | I. Condition-specific nonprofits / The Arc State Chapter | [arcflorida.org](https://www.arcflorida.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Jacksonville** | I. Condition-specific nonprofits / Local Arc Chapter | [arcjacksonville.org](https://www.arcjacksonville.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Palm Beach County** | I. Condition-specific nonprofits / Local Arc Chapter | [arcpbc.org](https://www.arcpbc.org) | `static_fetch` | `nonprofit_organizations` |
| **Autism Society of Florida** | I. Condition-specific nonprofits / Autism Society | [autismfl.org](https://www.autismfl.org) | `static_fetch` | `nonprofit_organizations` |
| **Down Syndrome Association of Central Florida** | I. Condition-specific nonprofits / Down Syndrome Association | [dsacf.org](https://www.dsacf.org) | `static_fetch` | `nonprofit_organizations` |
| **Down Syndrome Association of Miami** | I. Condition-specific nonprofits / Down Syndrome Association | [dsaom.org](https://www.dsaom.org) | `static_fetch` | `nonprofit_organizations` |
| **FND Family to Family Health Info Center** | H. Parent training / disability rights / legal aid / Family-to-Family Health Info | [fndusa.org](https://fndusa.org/projects/f2fhic/) | `static_fetch` | `nonprofit_organizations` |
| **Bay Area Legal Services (Tampa)** | H. Parent training / disability rights / legal aid / Legal Aid Directory | [bals.org](https://bals.org) | `static_fetch` | `nonprofit_organizations` |
| **Legal Aid Society of Palm Beach County** | H. Parent training / disability rights / legal aid / Legal Aid Directory | [legalaidpbc.org](https://legalaidpbc.org) | `static_fetch` | `nonprofit_organizations` |
| **Nicklaus Children's Hospital Dan Marino Center** | M. Hospitals / university clinics / Hospital Clinic Pages | [nicklauschildrens.org](https://www.nicklauschildrens.org/locations/dan-marino-outpatient-center) | `static_fetch` | `resource_providers` |
| **UF Health Jacksonville Pediatric Development** | M. Hospitals / university clinics / Hospital Clinic Pages | [ufhealthjax.org](https://ufhealthjax.org/pediatrics/developmental.aspx) | `static_fetch` | `resource_providers` |
| **UM Mailman Center for Child Development** | M. Hospitals / university clinics / University Autism Clinic | [med.miami.edu](https://med.miami.edu/centers-and-institutes/mailman-center) | `static_fetch` | `resource_providers` |
| **Florida CDC+ Forms & Rules** | K. Forms and guides / Medicaid Forms Library | [apd.myflorida.com](https://apd.myflorida.com/cdcplus/forms-rules.htm) | `static_fetch` | `program_document_requirements` |
| **Florida Vocational Rehabilitation** | L. Transition / adult services / Vocational Rehabilitation | [rehabworks.org](https://www.rehabworks.org) | `static_fetch` | `programs` |
| **Florida ABLE United** | L. Transition / adult services / ABLE Program Page | [ableunited.com](https://www.ableunited.com) | `static_fetch` | `programs` |
| **Florida Bar Guardianship resources** | L. Transition / adult services / Guardianship / Supported Decision Making | [floridabar.org](https://www.floridabar.org/public/consumer/pamphlet011/) | `static_fetch` | `programs` |
| **Florida Open Data Portal** | N. Data quality / verification sources / Open Data Portal | [data.florida.gov](https://data.florida.gov) | `static_fetch` | `sources` |
| **FLORIDA Specialized Clinic Roster #1** | J. Provider and advocate directories / Roster Source 1 | [ahca.myflorida.com](https://ahca.myflorida.com/specialized-roster-1) | `static_fetch` | `resource_providers` |
| **FLORIDA Specialized Clinic Roster #2** | J. Provider and advocate directories / Roster Source 2 | [ahca.myflorida.com](https://ahca.myflorida.com/specialized-roster-2) | `static_fetch` | `resource_providers` |
| **FLORIDA Specialized Clinic Roster #3** | J. Provider and advocate directories / Roster Source 3 | [ahca.myflorida.com](https://ahca.myflorida.com/specialized-roster-3) | `static_fetch` | `resource_providers` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County Wikipedia List)
- **Source Name:** Florida Counties Wikipedia List
- **Source URL:** [https://en.wikipedia.org/wiki/List_of_counties_in_Florida](https://en.wikipedia.org/wiki/List_of_counties_in_Florida)
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
- **Source Name:** Florida Association of Counties directory
- **Source URL:** [https://www.flcounties.com](https://www.flcounties.com)
- **Domain:** `flcounties.com`
- **Target Table:** `counties`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Links to official county websites.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Florida AHCA Medicaid Homepage
- **Source URL:** [https://ahca.myflorida.com](https://ahca.myflorida.com)
- **Domain:** `ahca.myflorida.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Medicaid policies and updates.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Application Portal)
- **Source Name:** ACCESS Florida Portal
- **Source URL:** [https://www.myflfamilies.com/services/public-assistance](https://www.myflfamilies.com/services/public-assistance)
- **Domain:** `myflfamilies.com`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `step_name, url`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Portal for benefits application.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Office Locator)
- **Source Name:** ACCESS Local Service Center Lookup
- **Source URL:** [https://www.myflfamilies.com/service-programs/access/map.shtml](https://www.myflfamilies.com/service-programs/access/map.shtml)
- **Domain:** `myflfamilies.com`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Directory search for local enrollment centers.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (CHIP Page)
- **Source Name:** Florida KidCare
- **Source URL:** [https://www.floridakidcare.org](https://www.floridakidcare.org)
- **Domain:** `floridakidcare.org`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** KidCare program information.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Children's Special Health)
- **Source Name:** Children's Medical Services (CMS) Plan
- **Source URL:** [https://www.cmsplan.floridahealth.gov](https://www.cmsplan.floridahealth.gov)
- **Domain:** `cmsplan.floridahealth.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, eligibility_rules`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** CMS clinical plan details.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Fair Hearing Page)
- **Source Name:** ACCESS Office of Public Benefits Hearings
- **Source URL:** [https://www.myflfamilies.com/about/office-public-benefits-hearings](https://www.myflfamilies.com/about/office-public-benefits-hearings)
- **Domain:** `myflfamilies.com`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `deadline, steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Filing appeals for benefits denials.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Managed Care Appeal Page)
- **Source Name:** Florida Subscriber Assistance Program
- **Source URL:** [https://ahca.myflorida.com/medicaid/statewide-medicaid-managed-care/subscriber-assistance-program](https://ahca.myflorida.com/medicaid/statewide-medicaid-managed-care/subscriber-assistance-program)
- **Domain:** `ahca.myflorida.com`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `contact_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Resolve managed care plan disputes.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Personal Care Page)
- **Source Name:** Florida Consumer Directed Care Plus (CDC+)
- **Source URL:** [https://apd.myflorida.com/cdcplus/](https://apd.myflorida.com/cdcplus/)
- **Domain:** `apd.myflorida.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, details`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Attendant care self-directed option.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Florida APD Homepage
- **Source URL:** [https://apd.myflorida.com](https://apd.myflorida.com)
- **Domain:** `apd.myflorida.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** State Agency for Persons with Disabilities.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Local Agency Directory)
- **Source Name:** Florida APD Regional Offices Directory
- **Source URL:** [https://apd.myflorida.com/region/](https://apd.myflorida.com/region/)
- **Domain:** `apd.myflorida.com`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Regional office directories.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Eligibility Page)
- **Source Name:** Florida APD Eligibility Overview
- **Source URL:** [https://apd.myflorida.com/customers/eligibility/](https://apd.myflorida.com/customers/eligibility/)
- **Domain:** `apd.myflorida.com`
- **Target Table:** `program_eligibility_rules`
- **Expected Fields:** `trigger_reason, min_age`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Eligibility guidelines.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Intake/Application Page)
- **Source Name:** Florida APD Intake Application
- **Source URL:** [https://apd.myflorida.com/customers/application/](https://apd.myflorida.com/customers/application/)
- **Domain:** `apd.myflorida.com`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `step_number, action`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Application details.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Family Support/Respite Page)
- **Source Name:** Florida APD Family Support Services
- **Source URL:** [https://apd.myflorida.com/customers/family-support/](https://apd.myflorida.com/customers/family-support/)
- **Domain:** `apd.myflorida.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Respite options.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Waitlist/Interest List Page)
- **Source Name:** Florida APD Waitlist Statistics
- **Source URL:** [https://apd.myflorida.com/customers/waitlist/](https://apd.myflorida.com/customers/waitlist/)
- **Domain:** `apd.myflorida.com`
- **Target Table:** `program_waitlists`
- **Expected Fields:** `program_id, duration_label`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** iBudget waitlist information.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (iBudget Waiver Page)
- **Source Name:** Florida iBudget Waiver Program
- **Source URL:** [https://apd.myflorida.com/ibudget/](https://apd.myflorida.com/ibudget/)
- **Domain:** `apd.myflorida.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** iBudget waiver services.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (State EI Landing Page)
- **Source Name:** Florida Early Steps Program
- **Source URL:** [https://www.floridaearlysteps.com](https://www.floridaearlysteps.com)
- **Domain:** `floridaearlysteps.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Early intervention (0-3 years) services.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Local Program Directory)
- **Source Name:** Florida Early Steps Local Directories
- **Source URL:** [https://www.cmsplan.floridahealth.gov/earlysteps/directories/](https://www.cmsplan.floridahealth.gov/earlysteps/directories/)
- **Domain:** `cmsplan.floridahealth.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Local early start programs directory.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Landing Page)
- **Source Name:** Florida DOE Exceptional Student Education (ESE) Home
- **Source URL:** [https://www.fldoe.org/academics/exceptional-student-edu/](https://www.fldoe.org/academics/exceptional-student-edu/)
- **Domain:** `fldoe.org`
- **Target Table:** `programs`
- **Expected Fields:** `name, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Special education services.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Procedural Safeguards)
- **Source Name:** FLDOE Exceptional Student Education Dispute Resolution
- **Source URL:** [https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/](https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/)
- **Domain:** `fldoe.org`
- **Target Table:** `program_document_requirements`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** ESE Procedural Safeguards.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (State Complaint Page/Form)
- **Source Name:** FLDOE State Complaint Form
- **Source URL:** [https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/state-complaint.shtml](https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/state-complaint.shtml)
- **Domain:** `fldoe.org`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** State level education complaints.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Due Process Page/Form)
- **Source Name:** FLDOE Due Process Hearings
- **Source URL:** [https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/due-process.shtml](https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/due-process.shtml)
- **Domain:** `fldoe.org`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, deadline_days`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Due process hearing request.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Mediation Page)
- **Source Name:** FLDOE Mediation Option
- **Source URL:** [https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/mediation.shtml](https://www.fldoe.org/academics/exceptional-student-edu/dispute-resolution/mediation.shtml)
- **Domain:** `fldoe.org`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `appeal_steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Special education mediation.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Parent Rights Guide)
- **Source Name:** FLDOE Parent Info Home
- **Source URL:** [https://www.fldoe.org/academics/exceptional-student-edu/parent-info/](https://www.fldoe.org/academics/exceptional-student-edu/parent-info/)
- **Domain:** `fldoe.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Parent education resources.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Regional Education Agency Directory)
- **Source Name:** FDLRS Find a Center Map
- **Source URL:** [https://www.fdlrs.org/find-a-center](https://www.fdlrs.org/find-a-center)
- **Domain:** `fdlrs.org`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Diagnostic and training support centers.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (School District Directory)
- **Source Name:** Florida School District Directory
- **Source URL:** [https://www.fldoe.org/contact-us/districts.shtml](https://www.fldoe.org/contact-us/districts.shtml)
- **Domain:** `fldoe.org`
- **Target Table:** `school_districts`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** District contacts.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI/CPRC)
- **Source Name:** Family Network on Disabilities (FND)
- **Source URL:** [https://fndusa.org](https://fndusa.org)
- **Domain:** `fndusa.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Parent Training and Information Center.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Disability Rights)
- **Source Name:** Disability Rights Florida
- **Source URL:** [https://www.disabilityrightsflorida.org](https://www.disabilityrightsflorida.org)
- **Domain:** `disabilityrightsflorida.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** State protection & advocacy agency.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Florida
- **Source URL:** [https://www.arcflorida.org](https://www.arcflorida.org)
- **Domain:** `arcflorida.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Florida Arc chapters.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Local Arc Chapter)
- **Source Name:** The Arc of Jacksonville
- **Source URL:** [https://www.arcjacksonville.org](https://www.arcjacksonville.org)
- **Domain:** `arcjacksonville.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Serves Duval County.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Local Arc Chapter)
- **Source Name:** The Arc of Palm Beach County
- **Source URL:** [https://www.arcpbc.org](https://www.arcpbc.org)
- **Domain:** `arcpbc.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Serves Palm Beach County.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Autism Society)
- **Source Name:** Autism Society of Florida
- **Source URL:** [https://www.autismfl.org](https://www.autismfl.org)
- **Domain:** `autismfl.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** State autism network.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Down Syndrome Association)
- **Source Name:** Down Syndrome Association of Central Florida
- **Source URL:** [https://www.dsacf.org](https://www.dsacf.org)
- **Domain:** `dsacf.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Orlando region support.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (Down Syndrome Association)
- **Source Name:** Down Syndrome Association of Miami
- **Source URL:** [https://www.dsaom.org](https://www.dsaom.org)
- **Domain:** `dsaom.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Miami region support.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Family-to-Family Health Info)
- **Source Name:** FND Family to Family Health Info Center
- **Source URL:** [https://fndusa.org/projects/f2fhic/](https://fndusa.org/projects/f2fhic/)
- **Domain:** `fndusa.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Health advocacy center.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Legal Aid Directory)
- **Source Name:** Bay Area Legal Services (Tampa)
- **Source URL:** [https://bals.org](https://bals.org)
- **Domain:** `bals.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Tampa area legal aid support.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Legal Aid Directory)
- **Source Name:** Legal Aid Society of Palm Beach County
- **Source URL:** [https://legalaidpbc.org](https://legalaidpbc.org)
- **Domain:** `legalaidpbc.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Palm Beach special ed legal clinic.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospital Clinic Pages)
- **Source Name:** Nicklaus Children's Hospital Dan Marino Center
- **Source URL:** [https://www.nicklauschildrens.org/locations/dan-marino-outpatient-center](https://www.nicklauschildrens.org/locations/dan-marino-outpatient-center)
- **Domain:** `nicklauschildrens.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** South Florida pediatric developmental services.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospital Clinic Pages)
- **Source Name:** UF Health Jacksonville Pediatric Development
- **Source URL:** [https://ufhealthjax.org/pediatrics/developmental.aspx](https://ufhealthjax.org/pediatrics/developmental.aspx)
- **Domain:** `ufhealthjax.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** North Florida child development program.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (University Autism Clinic)
- **Source Name:** UM Mailman Center for Child Development
- **Source URL:** [https://med.miami.edu/centers-and-institutes/mailman-center](https://med.miami.edu/centers-and-institutes/mailman-center)
- **Domain:** `med.miami.edu`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** University of Miami LEND clinic.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Medicaid Forms Library)
- **Source Name:** Florida CDC+ Forms & Rules
- **Source URL:** [https://apd.myflorida.com/cdcplus/forms-rules.htm](https://apd.myflorida.com/cdcplus/forms-rules.htm)
- **Domain:** `apd.myflorida.com`
- **Target Table:** `program_document_requirements`
- **Expected Fields:** `name, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Self-directed waiver form index.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Florida Vocational Rehabilitation
- **Source URL:** [https://www.rehabworks.org](https://www.rehabworks.org)
- **Domain:** `rehabworks.org`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Transition and employment services.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (ABLE Program Page)
- **Source Name:** Florida ABLE United
- **Source URL:** [https://www.ableunited.com](https://www.ableunited.com)
- **Domain:** `ableunited.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** State ABLE savings site.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Guardianship / Supported Decision Making)
- **Source Name:** Florida Bar Guardianship resources
- **Source URL:** [https://www.floridabar.org/public/consumer/pamphlet011/](https://www.floridabar.org/public/consumer/pamphlet011/)
- **Domain:** `floridabar.org`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Consumer guide to guardianship.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Florida Open Data Portal
- **Source URL:** [https://data.florida.gov](https://data.florida.gov)
- **Domain:** `data.florida.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 4
- **Notes:** Licensed providers coordinates.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 1)
- **Source Name:** FLORIDA Specialized Clinic Roster #1
- **Source URL:** [https://ahca.myflorida.com/specialized-roster-1](https://ahca.myflorida.com/specialized-roster-1)
- **Domain:** `ahca.myflorida.com`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for FLORIDA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 2)
- **Source Name:** FLORIDA Specialized Clinic Roster #2
- **Source URL:** [https://ahca.myflorida.com/specialized-roster-2](https://ahca.myflorida.com/specialized-roster-2)
- **Domain:** `ahca.myflorida.com`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for FLORIDA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 3)
- **Source Name:** FLORIDA Specialized Clinic Roster #3
- **Source URL:** [https://ahca.myflorida.com/specialized-roster-3](https://ahca.myflorida.com/specialized-roster-3)
- **Domain:** `ahca.myflorida.com`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for FLORIDA.
- **Last Checked:** 2026-06-13

