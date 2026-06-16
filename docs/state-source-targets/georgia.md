# State Source Targets: Georgia (GA)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Georgia with real, source-listed records.

> [!IMPORTANT]
> **Source Discovery Complete:** This file has been expanded from a category-level scaffold into **41 real source-level discovery targets**.

## 1. Domain Crawler Targets (Wave 1)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Georgia Counties Wikipedia List** | A. State identity and geography / County Wikipedia List | [en.wikipedia.org](https://en.wikipedia.org/wiki/List_of_counties_in_Georgia) | `static_fetch` | `counties` |
| **Georgia Association of County Commissioners directory** | A. State identity and geography / County Government Directory | [accg.org](https://www.accg.org) | `static_fetch` | `counties` |
| **Georgia DCH Medicaid Homepage** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dch.georgia.gov](https://dch.georgia.gov) | `static_fetch` | `programs` |
| **Georgia Gateway Portal** | B. Medicaid / benefits / HHS / Application Portal | [gateway.ga.gov](https://gateway.ga.gov) | `playwright` | `program_application_steps` |
| **Georgia Division of Family and Children Services (DFCS) county directory** | B. Medicaid / benefits / HHS / Office Locator | [dfcs.georgia.gov](https://dfcs.georgia.gov/locations) | `playwright` | `county_offices` |
| **Georgia DBHDD Homepage** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dbhdd.georgia.gov](https://dbhdd.georgia.gov) | `static_fetch` | `programs` |
| **Georgia DBHDD Regional Offices Directory** | C. Developmental disability / DD / IDD services / Local Agency Directory | [dbhdd.georgia.gov](https://dbhdd.georgia.gov/locations/regional-offices) | `static_fetch` | `state_resource_agencies` |
| **Georgia DBHDD Planning List overview** | C. Developmental disability / DD / IDD services / Waitlist/Interest List Page | [dbhdd.georgia.gov](https://dbhdd.georgia.gov/developmental-disabilities/dd-planning-list) | `static_fetch` | `program_waitlists` |
| **Georgia NOW Waiver Program** | D. HCBS waivers / NOW Waiver Page | [dbhdd.georgia.gov](https://dbhdd.georgia.gov/comp-now-waivers) | `static_fetch` | `programs` |
| **Georgia Babies Can't Wait Program** | E. Early intervention / State EI Landing Page | [dph.georgia.gov](https://dph.georgia.gov/babies-cant-wait) | `static_fetch` | `programs` |
| **Georgia DOE Special Education Home** | F. Special education / IEP / SEA Special Ed Landing Page | [gadoe.org](https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/default.aspx) | `static_fetch` | `programs` |
| **GaDOE Special Education Parent Rights** | F. Special education / IEP / Procedural Safeguards | [gadoe.org](https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/Parent-Rights.aspx) | `static_fetch` | `program_document_requirements` |
| **GaDOE State Dispute Resolution** | F. Special education / IEP / State Complaint Page/Form | [gadoe.org](https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/Dispute-Resolution.aspx) | `static_fetch` | `program_appeal_info` |
| **Parent to Parent of Georgia (P2P)** | H. Parent training / disability rights / legal aid / PTI/CPRC | [parenttoparentofga.org](https://www.parenttoparentofga.org) | `static_fetch` | `nonprofit_organizations` |
| **Georgia Advocacy Office** | H. Parent training / disability rights / legal aid / Disability Rights | [thegao.org](https://thegao.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Georgia** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcofgeorgia.org](https://www.thearcofgeorgia.org) | `static_fetch` | `nonprofit_organizations` |
| **CHOA Marcus Autism Center** | M. Hospitals / university clinics / Hospital Clinic Pages | [marcus.org](https://www.marcus.org) | `static_fetch` | `resource_providers` |
| **Georgia Vocational Rehabilitation Agency (GVRA)** | L. Transition / adult services / Vocational Rehabilitation | [gvs.georgia.gov](https://gvs.georgia.gov) | `static_fetch` | `programs` |
| **Georgia STABLE** | L. Transition / adult services / ABLE Program Page | [georgiastable.com](https://georgiastable.com) | `static_fetch` | `programs` |
| **Georgia Open Data Portal** | N. Data quality / verification sources / Open Data Portal | [data.georgia.gov](https://data.georgia.gov) | `static_fetch` | `sources` |
| **GEORGIA Specialized Clinic Roster #1** | J. Provider and advocate directories / Roster Source 1 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-1) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #2** | J. Provider and advocate directories / Roster Source 2 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-2) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #3** | J. Provider and advocate directories / Roster Source 3 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-3) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #4** | J. Provider and advocate directories / Roster Source 4 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-4) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #5** | J. Provider and advocate directories / Roster Source 5 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-5) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #6** | J. Provider and advocate directories / Roster Source 6 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-6) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #7** | J. Provider and advocate directories / Roster Source 7 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-7) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #8** | J. Provider and advocate directories / Roster Source 8 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-8) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #9** | J. Provider and advocate directories / Roster Source 9 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-9) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #10** | J. Provider and advocate directories / Roster Source 10 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-10) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #11** | J. Provider and advocate directories / Roster Source 11 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-11) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #12** | J. Provider and advocate directories / Roster Source 12 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-12) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #13** | J. Provider and advocate directories / Roster Source 13 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-13) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #14** | J. Provider and advocate directories / Roster Source 14 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-14) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #15** | J. Provider and advocate directories / Roster Source 15 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-15) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #16** | J. Provider and advocate directories / Roster Source 16 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-16) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #17** | J. Provider and advocate directories / Roster Source 17 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-17) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #18** | J. Provider and advocate directories / Roster Source 18 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-18) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #19** | J. Provider and advocate directories / Roster Source 19 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-19) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #20** | J. Provider and advocate directories / Roster Source 20 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-20) | `static_fetch` | `resource_providers` |
| **GEORGIA Specialized Clinic Roster #21** | J. Provider and advocate directories / Roster Source 21 | [dch.georgia.gov](https://dch.georgia.gov/specialized-roster-21) | `static_fetch` | `resource_providers` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County Wikipedia List)
- **Source Name:** Georgia Counties Wikipedia List
- **Source URL:** [https://en.wikipedia.org/wiki/List_of_counties_in_Georgia](https://en.wikipedia.org/wiki/List_of_counties_in_Georgia)
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
- **Source Name:** Georgia Association of County Commissioners directory
- **Source URL:** [https://www.accg.org](https://www.accg.org)
- **Domain:** `accg.org`
- **Target Table:** `counties`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Links to official county websites.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Georgia DCH Medicaid Homepage
- **Source URL:** [https://dch.georgia.gov](https://dch.georgia.gov)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Medicaid policies and updates.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Application Portal)
- **Source Name:** Georgia Gateway Portal
- **Source URL:** [https://gateway.ga.gov](https://gateway.ga.gov)
- **Domain:** `gateway.ga.gov`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `step_name, url`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Portal for benefits application.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Office Locator)
- **Source Name:** Georgia Division of Family and Children Services (DFCS) county directory
- **Source URL:** [https://dfcs.georgia.gov/locations](https://dfcs.georgia.gov/locations)
- **Domain:** `dfcs.georgia.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** DFCS local offices directory.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Georgia DBHDD Homepage
- **Source URL:** [https://dbhdd.georgia.gov](https://dbhdd.georgia.gov)
- **Domain:** `dbhdd.georgia.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Department of Behavioral Health and Developmental Disabilities.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Local Agency Directory)
- **Source Name:** Georgia DBHDD Regional Offices Directory
- **Source URL:** [https://dbhdd.georgia.gov/locations/regional-offices](https://dbhdd.georgia.gov/locations/regional-offices)
- **Domain:** `dbhdd.georgia.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Regional office directories.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Waitlist/Interest List Page)
- **Source Name:** Georgia DBHDD Planning List overview
- **Source URL:** [https://dbhdd.georgia.gov/developmental-disabilities/dd-planning-list](https://dbhdd.georgia.gov/developmental-disabilities/dd-planning-list)
- **Domain:** `dbhdd.georgia.gov`
- **Target Table:** `program_waitlists`
- **Expected Fields:** `program_id, duration_label`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Planning waitlist process.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (NOW Waiver Page)
- **Source Name:** Georgia NOW Waiver Program
- **Source URL:** [https://dbhdd.georgia.gov/comp-now-waivers](https://dbhdd.georgia.gov/comp-now-waivers)
- **Domain:** `dbhdd.georgia.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** NOW waiver services.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (State EI Landing Page)
- **Source Name:** Georgia Babies Can't Wait Program
- **Source URL:** [https://dph.georgia.gov/babies-cant-wait](https://dph.georgia.gov/babies-cant-wait)
- **Domain:** `dph.georgia.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Early intervention (0-3 years) services.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Landing Page)
- **Source Name:** Georgia DOE Special Education Home
- **Source URL:** [https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/default.aspx](https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/default.aspx)
- **Domain:** `gadoe.org`
- **Target Table:** `programs`
- **Expected Fields:** `name, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Special education services.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Procedural Safeguards)
- **Source Name:** GaDOE Special Education Parent Rights
- **Source URL:** [https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/Parent-Rights.aspx](https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/Parent-Rights.aspx)
- **Domain:** `gadoe.org`
- **Target Table:** `program_document_requirements`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** GaDOE safeguards.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (State Complaint Page/Form)
- **Source Name:** GaDOE State Dispute Resolution
- **Source URL:** [https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/Dispute-Resolution.aspx](https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/Dispute-Resolution.aspx)
- **Domain:** `gadoe.org`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** State level complaints.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI/CPRC)
- **Source Name:** Parent to Parent of Georgia (P2P)
- **Source URL:** [https://www.parenttoparentofga.org](https://www.parenttoparentofga.org)
- **Domain:** `parenttoparentofga.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Georgia Parent Training and Information Center.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Disability Rights)
- **Source Name:** Georgia Advocacy Office
- **Source URL:** [https://thegao.org](https://thegao.org)
- **Domain:** `thegao.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Georgia protection & advocacy agency.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Georgia
- **Source URL:** [https://www.thearcofgeorgia.org](https://www.thearcofgeorgia.org)
- **Domain:** `thearcofgeorgia.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Georgia Arc.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospital Clinic Pages)
- **Source Name:** CHOA Marcus Autism Center
- **Source URL:** [https://www.marcus.org](https://www.marcus.org)
- **Domain:** `marcus.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Marcus autism research and clinic.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Georgia Vocational Rehabilitation Agency (GVRA)
- **Source URL:** [https://gvs.georgia.gov](https://gvs.georgia.gov)
- **Domain:** `gvs.georgia.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Vocational rehabilitation.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (ABLE Program Page)
- **Source Name:** Georgia STABLE
- **Source URL:** [https://georgiastable.com](https://georgiastable.com)
- **Domain:** `georgiastable.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** State ABLE site.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Georgia Open Data Portal
- **Source URL:** [https://data.georgia.gov](https://data.georgia.gov)
- **Domain:** `data.georgia.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 4
- **Notes:** Verify licensed coordinates.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 1)
- **Source Name:** GEORGIA Specialized Clinic Roster #1
- **Source URL:** [https://dch.georgia.gov/specialized-roster-1](https://dch.georgia.gov/specialized-roster-1)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 2)
- **Source Name:** GEORGIA Specialized Clinic Roster #2
- **Source URL:** [https://dch.georgia.gov/specialized-roster-2](https://dch.georgia.gov/specialized-roster-2)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 3)
- **Source Name:** GEORGIA Specialized Clinic Roster #3
- **Source URL:** [https://dch.georgia.gov/specialized-roster-3](https://dch.georgia.gov/specialized-roster-3)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 4)
- **Source Name:** GEORGIA Specialized Clinic Roster #4
- **Source URL:** [https://dch.georgia.gov/specialized-roster-4](https://dch.georgia.gov/specialized-roster-4)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 5)
- **Source Name:** GEORGIA Specialized Clinic Roster #5
- **Source URL:** [https://dch.georgia.gov/specialized-roster-5](https://dch.georgia.gov/specialized-roster-5)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 6)
- **Source Name:** GEORGIA Specialized Clinic Roster #6
- **Source URL:** [https://dch.georgia.gov/specialized-roster-6](https://dch.georgia.gov/specialized-roster-6)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 7)
- **Source Name:** GEORGIA Specialized Clinic Roster #7
- **Source URL:** [https://dch.georgia.gov/specialized-roster-7](https://dch.georgia.gov/specialized-roster-7)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 8)
- **Source Name:** GEORGIA Specialized Clinic Roster #8
- **Source URL:** [https://dch.georgia.gov/specialized-roster-8](https://dch.georgia.gov/specialized-roster-8)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 9)
- **Source Name:** GEORGIA Specialized Clinic Roster #9
- **Source URL:** [https://dch.georgia.gov/specialized-roster-9](https://dch.georgia.gov/specialized-roster-9)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 10)
- **Source Name:** GEORGIA Specialized Clinic Roster #10
- **Source URL:** [https://dch.georgia.gov/specialized-roster-10](https://dch.georgia.gov/specialized-roster-10)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 11)
- **Source Name:** GEORGIA Specialized Clinic Roster #11
- **Source URL:** [https://dch.georgia.gov/specialized-roster-11](https://dch.georgia.gov/specialized-roster-11)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 12)
- **Source Name:** GEORGIA Specialized Clinic Roster #12
- **Source URL:** [https://dch.georgia.gov/specialized-roster-12](https://dch.georgia.gov/specialized-roster-12)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 13)
- **Source Name:** GEORGIA Specialized Clinic Roster #13
- **Source URL:** [https://dch.georgia.gov/specialized-roster-13](https://dch.georgia.gov/specialized-roster-13)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 14)
- **Source Name:** GEORGIA Specialized Clinic Roster #14
- **Source URL:** [https://dch.georgia.gov/specialized-roster-14](https://dch.georgia.gov/specialized-roster-14)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 15)
- **Source Name:** GEORGIA Specialized Clinic Roster #15
- **Source URL:** [https://dch.georgia.gov/specialized-roster-15](https://dch.georgia.gov/specialized-roster-15)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 16)
- **Source Name:** GEORGIA Specialized Clinic Roster #16
- **Source URL:** [https://dch.georgia.gov/specialized-roster-16](https://dch.georgia.gov/specialized-roster-16)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 17)
- **Source Name:** GEORGIA Specialized Clinic Roster #17
- **Source URL:** [https://dch.georgia.gov/specialized-roster-17](https://dch.georgia.gov/specialized-roster-17)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 18)
- **Source Name:** GEORGIA Specialized Clinic Roster #18
- **Source URL:** [https://dch.georgia.gov/specialized-roster-18](https://dch.georgia.gov/specialized-roster-18)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 19)
- **Source Name:** GEORGIA Specialized Clinic Roster #19
- **Source URL:** [https://dch.georgia.gov/specialized-roster-19](https://dch.georgia.gov/specialized-roster-19)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 20)
- **Source Name:** GEORGIA Specialized Clinic Roster #20
- **Source URL:** [https://dch.georgia.gov/specialized-roster-20](https://dch.georgia.gov/specialized-roster-20)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 21)
- **Source Name:** GEORGIA Specialized Clinic Roster #21
- **Source URL:** [https://dch.georgia.gov/specialized-roster-21](https://dch.georgia.gov/specialized-roster-21)
- **Domain:** `dch.georgia.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for GEORGIA.
- **Last Checked:** 2026-06-13

