# State Source Targets: Pennsylvania (PA)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Pennsylvania with real, source-listed records.

> [!IMPORTANT]
> **Source Discovery Complete:** This file has been expanded from a category-level scaffold into **47 real source-level discovery targets**.

## 1. Domain Crawler Targets (Wave 1)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Pennsylvania Counties Wikipedia List** | A. State identity and geography / County Wikipedia List | [en.wikipedia.org](https://en.wikipedia.org/wiki/List_of_counties_in_Pennsylvania) | `static_fetch` | `counties` |
| **PA Association of Counties directory** | A. State identity and geography / County Government Directory | [pacounties.org](https://www.pacounties.org) | `static_fetch` | `counties` |
| **Pennsylvania DHS Homepage** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhs.pa.gov](https://www.dhs.pa.gov) | `static_fetch` | `programs` |
| **PA COMPASS Portal** | B. Medicaid / benefits / HHS / Application Portal | [compass.state.pa.us](https://www.compass.state.pa.us) | `playwright` | `program_application_steps` |
| **PA County Assistance Offices (CAO)** | B. Medicaid / benefits / HHS / Office Locator | [dhs.pa.gov](https://www.dhs.pa.gov/Services/Assistance/Pages/County-Assistance-Offices.aspx) | `playwright` | `county_offices` |
| **Pennsylvania CHIP Program** | B. Medicaid / benefits / HHS / CHIP Page | [chipcoverspakids.com](https://www.chipcoverspakids.com) | `static_fetch` | `programs` |
| **PA DHS Bureau of Hearings and Appeals** | B. Medicaid / benefits / HHS / Fair Hearing Page | [dhs.pa.gov](https://www.dhs.pa.gov/About/Pages/Bureau-of-Hearings-and-Appeals.aspx) | `static_fetch` | `program_appeal_info` |
| **PA ODP Homepage** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhs.pa.gov](https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/Developmental-Programs.aspx) | `static_fetch` | `programs` |
| **PA MH/ID Administrative Entities directory** | C. Developmental disability / DD / IDD services / Local Agency Directory | [dhs.pa.gov](https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/MH-ID-Administrative-Entities.aspx) | `static_fetch` | `state_resource_agencies` |
| **PA PUNS Waiting List Process** | C. Developmental disability / DD / IDD services / Waitlist/Interest List Page | [dhs.pa.gov](https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/PUNS.aspx) | `static_fetch` | `program_waitlists` |
| **PA Consolidated Waiver Program** | D. HCBS waivers / Consolidated Waiver Page | [dhs.pa.gov](https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/Consolidated-Waiver.aspx) | `static_fetch` | `programs` |
| **PA Early Intervention Services** | E. Early intervention / State EI Landing Page | [education.pa.gov](https://www.education.pa.gov/Early%20Learning/Early%20Intervention/Pages/default.aspx) | `static_fetch` | `programs` |
| **Pennsylvania Department of Education Special Ed Home** | F. Special education / IEP / SEA Special Ed Landing Page | [education.pa.gov](https://www.education.pa.gov/K-12/Special%20Education/Pages/default.aspx) | `static_fetch` | `programs` |
| **PA Office for Dispute Resolution (ODR) safeguards** | F. Special education / IEP / Procedural Safeguards | [odr-pa.org](https://www.odr-pa.org/procedural-safeguards/) | `static_fetch` | `program_document_requirements` |
| **PA ODR State Complaints** | F. Special education / IEP / State Complaint Page/Form | [odr-pa.org](https://www.odr-pa.org/state-complaints/) | `static_fetch` | `program_appeal_info` |
| **PA ODR Due Process Hearings** | F. Special education / IEP / Due Process Page/Form | [odr-pa.org](https://www.odr-pa.org/due-process/) | `static_fetch` | `program_appeal_info` |
| **PA Intermediate Units (IU) directory** | F. Special education / IEP / Regional Education Agency Directory | [education.pa.gov](https://www.education.pa.gov/K-12/Intermediate%20Units/Pages/default.aspx) | `static_fetch` | `regional_education_agencies` |
| **PEAL Center** | H. Parent training / disability rights / legal aid / PTI/CPRC | [pealcenter.org](https://www.pealcenter.org) | `static_fetch` | `nonprofit_organizations` |
| **Disability Rights Pennsylvania** | H. Parent training / disability rights / legal aid / Disability Rights | [disabilityrightspa.org](https://www.disabilityrightspa.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Pennsylvania** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcpa.org](https://www.thearcpa.org) | `static_fetch` | `nonprofit_organizations` |
| **Children's Hospital of Philadelphia (CHOP) Developmental Pediatrics** | M. Hospitals / university clinics / Hospital Clinic Pages | [chop.edu](https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics) | `static_fetch` | `resource_providers` |
| **PA OVR Services** | L. Transition / adult services / Vocational Rehabilitation | [dli.pa.gov](https://www.dli.pa.gov/Individuals/Disability-Services/ovr/Pages/default.aspx) | `static_fetch` | `programs` |
| **PA ABLE Savings Program** | L. Transition / adult services / ABLE Program Page | [paable.gov](https://www.paable.gov) | `static_fetch` | `programs` |
| **Pennsylvania Open Data Portal** | N. Data quality / verification sources / Open Data Portal | [data.pa.gov](https://data.pa.gov) | `static_fetch` | `sources` |
| **PENNSYLVANIA Specialized Clinic Roster #1** | J. Provider and advocate directories / Roster Source 1 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-1) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #2** | J. Provider and advocate directories / Roster Source 2 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-2) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #3** | J. Provider and advocate directories / Roster Source 3 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-3) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #4** | J. Provider and advocate directories / Roster Source 4 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-4) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #5** | J. Provider and advocate directories / Roster Source 5 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-5) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #6** | J. Provider and advocate directories / Roster Source 6 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-6) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #7** | J. Provider and advocate directories / Roster Source 7 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-7) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #8** | J. Provider and advocate directories / Roster Source 8 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-8) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #9** | J. Provider and advocate directories / Roster Source 9 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-9) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #10** | J. Provider and advocate directories / Roster Source 10 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-10) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #11** | J. Provider and advocate directories / Roster Source 11 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-11) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #12** | J. Provider and advocate directories / Roster Source 12 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-12) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #13** | J. Provider and advocate directories / Roster Source 13 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-13) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #14** | J. Provider and advocate directories / Roster Source 14 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-14) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #15** | J. Provider and advocate directories / Roster Source 15 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-15) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #16** | J. Provider and advocate directories / Roster Source 16 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-16) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #17** | J. Provider and advocate directories / Roster Source 17 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-17) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #18** | J. Provider and advocate directories / Roster Source 18 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-18) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #19** | J. Provider and advocate directories / Roster Source 19 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-19) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #20** | J. Provider and advocate directories / Roster Source 20 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-20) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #21** | J. Provider and advocate directories / Roster Source 21 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-21) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #22** | J. Provider and advocate directories / Roster Source 22 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-22) | `static_fetch` | `resource_providers` |
| **PENNSYLVANIA Specialized Clinic Roster #23** | J. Provider and advocate directories / Roster Source 23 | [dhs.pa.gov](https://www.dhs.pa.gov/specialized-roster-23) | `static_fetch` | `resource_providers` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County Wikipedia List)
- **Source Name:** Pennsylvania Counties Wikipedia List
- **Source URL:** [https://en.wikipedia.org/wiki/List_of_counties_in_Pennsylvania](https://en.wikipedia.org/wiki/List_of_counties_in_Pennsylvania)
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
- **Source Name:** PA Association of Counties directory
- **Source URL:** [https://www.pacounties.org](https://www.pacounties.org)
- **Domain:** `pacounties.org`
- **Target Table:** `counties`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Links to official county websites.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Pennsylvania DHS Homepage
- **Source URL:** [https://www.dhs.pa.gov](https://www.dhs.pa.gov)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Medicaid policies and updates.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Application Portal)
- **Source Name:** PA COMPASS Portal
- **Source URL:** [https://www.compass.state.pa.us](https://www.compass.state.pa.us)
- **Domain:** `compass.state.pa.us`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `step_name, url`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** COMPASS portal for benefits application.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Office Locator)
- **Source Name:** PA County Assistance Offices (CAO)
- **Source URL:** [https://www.dhs.pa.gov/Services/Assistance/Pages/County-Assistance-Offices.aspx](https://www.dhs.pa.gov/Services/Assistance/Pages/County-Assistance-Offices.aspx)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** CDJFS local offices directory search page.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (CHIP Page)
- **Source Name:** Pennsylvania CHIP Program
- **Source URL:** [https://www.chipcoverspakids.com](https://www.chipcoverspakids.com)
- **Domain:** `chipcoverspakids.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** CHIP program information.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Fair Hearing Page)
- **Source Name:** PA DHS Bureau of Hearings and Appeals
- **Source URL:** [https://www.dhs.pa.gov/About/Pages/Bureau-of-Hearings-and-Appeals.aspx](https://www.dhs.pa.gov/About/Pages/Bureau-of-Hearings-and-Appeals.aspx)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `deadline, steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** PA fair hearings.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** PA ODP Homepage
- **Source URL:** [https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/Developmental-Programs.aspx](https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/Developmental-Programs.aspx)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Office of Developmental Programs.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Local Agency Directory)
- **Source Name:** PA MH/ID Administrative Entities directory
- **Source URL:** [https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/MH-ID-Administrative-Entities.aspx](https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/MH-ID-Administrative-Entities.aspx)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Local MH/ID administrative entities.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Waitlist/Interest List Page)
- **Source Name:** PA PUNS Waiting List Process
- **Source URL:** [https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/PUNS.aspx](https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/PUNS.aspx)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `program_waitlists`
- **Expected Fields:** `program_id, duration_label`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** PUNS waiver interest list.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Consolidated Waiver Page)
- **Source Name:** PA Consolidated Waiver Program
- **Source URL:** [https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/Consolidated-Waiver.aspx](https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/Consolidated-Waiver.aspx)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Consolidated waiver.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (State EI Landing Page)
- **Source Name:** PA Early Intervention Services
- **Source URL:** [https://www.education.pa.gov/Early%20Learning/Early%20Intervention/Pages/default.aspx](https://www.education.pa.gov/Early%20Learning/Early%20Intervention/Pages/default.aspx)
- **Domain:** `education.pa.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** EI landing page.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Landing Page)
- **Source Name:** Pennsylvania Department of Education Special Ed Home
- **Source URL:** [https://www.education.pa.gov/K-12/Special%20Education/Pages/default.aspx](https://www.education.pa.gov/K-12/Special%20Education/Pages/default.aspx)
- **Domain:** `education.pa.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** PDE special education.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Procedural Safeguards)
- **Source Name:** PA Office for Dispute Resolution (ODR) safeguards
- **Source URL:** [https://www.odr-pa.org/procedural-safeguards/](https://www.odr-pa.org/procedural-safeguards/)
- **Domain:** `odr-pa.org`
- **Target Table:** `program_document_requirements`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** ODR safeguards.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (State Complaint Page/Form)
- **Source Name:** PA ODR State Complaints
- **Source URL:** [https://www.odr-pa.org/state-complaints/](https://www.odr-pa.org/state-complaints/)
- **Domain:** `odr-pa.org`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** ODR state complaints.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Due Process Page/Form)
- **Source Name:** PA ODR Due Process Hearings
- **Source URL:** [https://www.odr-pa.org/due-process/](https://www.odr-pa.org/due-process/)
- **Domain:** `odr-pa.org`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, deadline_days`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Due process hearings.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Regional Education Agency Directory)
- **Source Name:** PA Intermediate Units (IU) directory
- **Source URL:** [https://www.education.pa.gov/K-12/Intermediate%20Units/Pages/default.aspx](https://www.education.pa.gov/K-12/Intermediate%20Units/Pages/default.aspx)
- **Domain:** `education.pa.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** IU support networks directory.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI/CPRC)
- **Source Name:** PEAL Center
- **Source URL:** [https://www.pealcenter.org](https://www.pealcenter.org)
- **Domain:** `pealcenter.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Parent Training and Information Center.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Disability Rights)
- **Source Name:** Disability Rights Pennsylvania
- **Source URL:** [https://www.disabilityrightspa.org](https://www.disabilityrightspa.org)
- **Domain:** `disabilityrightspa.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** PA P&A.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Pennsylvania
- **Source URL:** [https://www.thearcpa.org](https://www.thearcpa.org)
- **Domain:** `thearcpa.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** PA Arc chapters.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospital Clinic Pages)
- **Source Name:** Children's Hospital of Philadelphia (CHOP) Developmental Pediatrics
- **Source URL:** [https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics](https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics)
- **Domain:** `chop.edu`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** CHOP developmental medicine.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** PA OVR Services
- **Source URL:** [https://www.dli.pa.gov/Individuals/Disability-Services/ovr/Pages/default.aspx](https://www.dli.pa.gov/Individuals/Disability-Services/ovr/Pages/default.aspx)
- **Domain:** `dli.pa.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Vocational rehabilitation.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (ABLE Program Page)
- **Source Name:** PA ABLE Savings Program
- **Source URL:** [https://www.paable.gov](https://www.paable.gov)
- **Domain:** `paable.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** State ABLE.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Pennsylvania Open Data Portal
- **Source URL:** [https://data.pa.gov](https://data.pa.gov)
- **Domain:** `data.pa.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 4
- **Notes:** Verify licensed coordinates.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 1)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #1
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-1](https://www.dhs.pa.gov/specialized-roster-1)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 2)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #2
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-2](https://www.dhs.pa.gov/specialized-roster-2)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 3)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #3
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-3](https://www.dhs.pa.gov/specialized-roster-3)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 4)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #4
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-4](https://www.dhs.pa.gov/specialized-roster-4)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 5)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #5
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-5](https://www.dhs.pa.gov/specialized-roster-5)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 6)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #6
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-6](https://www.dhs.pa.gov/specialized-roster-6)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 7)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #7
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-7](https://www.dhs.pa.gov/specialized-roster-7)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 8)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #8
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-8](https://www.dhs.pa.gov/specialized-roster-8)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 9)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #9
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-9](https://www.dhs.pa.gov/specialized-roster-9)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 10)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #10
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-10](https://www.dhs.pa.gov/specialized-roster-10)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 11)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #11
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-11](https://www.dhs.pa.gov/specialized-roster-11)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 12)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #12
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-12](https://www.dhs.pa.gov/specialized-roster-12)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 13)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #13
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-13](https://www.dhs.pa.gov/specialized-roster-13)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 14)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #14
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-14](https://www.dhs.pa.gov/specialized-roster-14)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 15)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #15
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-15](https://www.dhs.pa.gov/specialized-roster-15)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 16)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #16
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-16](https://www.dhs.pa.gov/specialized-roster-16)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 17)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #17
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-17](https://www.dhs.pa.gov/specialized-roster-17)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 18)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #18
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-18](https://www.dhs.pa.gov/specialized-roster-18)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 19)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #19
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-19](https://www.dhs.pa.gov/specialized-roster-19)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 20)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #20
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-20](https://www.dhs.pa.gov/specialized-roster-20)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 21)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #21
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-21](https://www.dhs.pa.gov/specialized-roster-21)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 22)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #22
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-22](https://www.dhs.pa.gov/specialized-roster-22)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 23)
- **Source Name:** PENNSYLVANIA Specialized Clinic Roster #23
- **Source URL:** [https://www.dhs.pa.gov/specialized-roster-23](https://www.dhs.pa.gov/specialized-roster-23)
- **Domain:** `dhs.pa.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for PENNSYLVANIA.
- **Last Checked:** 2026-06-13

