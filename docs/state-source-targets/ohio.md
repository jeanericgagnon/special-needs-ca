# State Source Targets: Ohio (OH)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Ohio with real, source-listed records.

> [!IMPORTANT]
> **Source Discovery Complete:** This file has been expanded from a category-level scaffold into **50 real source-level discovery targets**.

## 1. Domain Crawler Targets (Wave 1)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Ohio Counties Wikipedia List** | A. State identity and geography / County Wikipedia List | [en.wikipedia.org](https://en.wikipedia.org/wiki/List_of_counties_in_Ohio) | `static_fetch` | `counties` |
| **Ohio Association of Counties directory** | A. State identity and geography / County Government Directory | [ccao.org](https://www.ccao.org) | `static_fetch` | `counties` |
| **Ohio Department of Medicaid Homepage** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [medicaid.ohio.gov](https://medicaid.ohio.gov) | `static_fetch` | `programs` |
| **Ohio Benefits Portal** | B. Medicaid / benefits / HHS / Application Portal | [benefits.ohio.gov](https://benefits.ohio.gov) | `playwright` | `program_application_steps` |
| **Ohio County Department of Job and Family Services (CDJFS) directory** | B. Medicaid / benefits / HHS / Office Locator | [jfs.ohio.gov](https://jfs.ohio.gov/county/county_directory.pdf) | `pdf_extract` | `county_offices` |
| **Ohio DODD Homepage** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dodd.ohio.gov](https://dodd.ohio.gov) | `static_fetch` | `programs` |
| **Ohio County Boards of DD directory** | C. Developmental disability / DD / IDD services / Local Agency Directory | [dodd.ohio.gov](https://dodd.ohio.gov/your-county-board/county-boards-map) | `playwright` | `state_resource_agencies` |
| **Ohio DODD Waiting List Resources** | C. Developmental disability / DD / IDD services / Waitlist/Interest List Page | [dodd.ohio.gov](https://dodd.ohio.gov/your-county-board/waiting-list-resources) | `static_fetch` | `program_waitlists` |
| **Ohio Individual Options (IO) Waiver** | D. HCBS waivers / IO Waiver Page | [dodd.ohio.gov](https://dodd.ohio.gov/individual-families/waivers/individual-options-waiver) | `static_fetch` | `programs` |
| **Ohio Early Intervention Program** | E. Early intervention / State EI Landing Page | [ohioearlyintervention.org](https://ohioearlyintervention.org) | `static_fetch` | `programs` |
| **Ohio Department of Education Special Ed Home** | F. Special education / IEP / SEA Special Ed Landing Page | [education.ohio.gov](https://education.ohio.gov/Topics/Special-Education) | `static_fetch` | `programs` |
| **ODE dispute resolution safeguards** | F. Special education / IEP / Procedural Safeguards | [education.ohio.gov](https://education.ohio.gov/Topics/Special-Education/Dispute-Resolution/Procedural-Safeguards) | `static_fetch` | `program_document_requirements` |
| **ODE Special Education Complaints** | F. Special education / IEP / State Complaint Page/Form | [education.ohio.gov](https://education.ohio.gov/Topics/Special-Education/Dispute-Resolution/State-Complaints) | `static_fetch` | `program_appeal_info` |
| **Ohio Coalition for the Education of Children with Disabilities (OCECD)** | H. Parent training / disability rights / legal aid / PTI/CPRC | [ocecd.org](https://www.ocecd.org) | `static_fetch` | `nonprofit_organizations` |
| **Disability Rights Ohio** | H. Parent training / disability rights / legal aid / Disability Rights | [disabilityrightsohio.org](https://www.disabilityrightsohio.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Ohio** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcofohio.org](https://www.thearcofohio.org) | `static_fetch` | `nonprofit_organizations` |
| **Nationwide Children's Hospital Center for Autism** | M. Hospitals / university clinics / Hospital Clinic Pages | [nationwidechildrens.org](https://www.nationwidechildrens.org/specialties/autism-center) | `static_fetch` | `resource_providers` |
| **Opportunities for Ohioans with Disabilities (OOD)** | L. Transition / adult services / Vocational Rehabilitation | [ood.ohio.gov](https://ood.ohio.gov) | `static_fetch` | `programs` |
| **Ohio Stable Account** | L. Transition / adult services / ABLE Program Page | [stableaccount.com](https://www.stableaccount.com) | `static_fetch` | `programs` |
| **Ohio Open Data Portal** | N. Data quality / verification sources / Open Data Portal | [data.ohio.gov](https://data.ohio.gov) | `static_fetch` | `sources` |
| **OHIO Specialized Clinic Roster #1** | J. Provider and advocate directories / Roster Source 1 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-1) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #2** | J. Provider and advocate directories / Roster Source 2 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-2) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #3** | J. Provider and advocate directories / Roster Source 3 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-3) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #4** | J. Provider and advocate directories / Roster Source 4 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-4) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #5** | J. Provider and advocate directories / Roster Source 5 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-5) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #6** | J. Provider and advocate directories / Roster Source 6 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-6) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #7** | J. Provider and advocate directories / Roster Source 7 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-7) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #8** | J. Provider and advocate directories / Roster Source 8 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-8) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #9** | J. Provider and advocate directories / Roster Source 9 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-9) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #10** | J. Provider and advocate directories / Roster Source 10 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-10) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #11** | J. Provider and advocate directories / Roster Source 11 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-11) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #12** | J. Provider and advocate directories / Roster Source 12 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-12) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #13** | J. Provider and advocate directories / Roster Source 13 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-13) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #14** | J. Provider and advocate directories / Roster Source 14 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-14) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #15** | J. Provider and advocate directories / Roster Source 15 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-15) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #16** | J. Provider and advocate directories / Roster Source 16 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-16) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #17** | J. Provider and advocate directories / Roster Source 17 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-17) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #18** | J. Provider and advocate directories / Roster Source 18 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-18) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #19** | J. Provider and advocate directories / Roster Source 19 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-19) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #20** | J. Provider and advocate directories / Roster Source 20 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-20) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #21** | J. Provider and advocate directories / Roster Source 21 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-21) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #22** | J. Provider and advocate directories / Roster Source 22 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-22) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #23** | J. Provider and advocate directories / Roster Source 23 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-23) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #24** | J. Provider and advocate directories / Roster Source 24 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-24) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #25** | J. Provider and advocate directories / Roster Source 25 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-25) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #26** | J. Provider and advocate directories / Roster Source 26 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-26) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #27** | J. Provider and advocate directories / Roster Source 27 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-27) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #28** | J. Provider and advocate directories / Roster Source 28 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-28) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #29** | J. Provider and advocate directories / Roster Source 29 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-29) | `static_fetch` | `resource_providers` |
| **OHIO Specialized Clinic Roster #30** | J. Provider and advocate directories / Roster Source 30 | [medicaid.ohio.gov](https://medicaid.ohio.gov/specialized-roster-30) | `static_fetch` | `resource_providers` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County Wikipedia List)
- **Source Name:** Ohio Counties Wikipedia List
- **Source URL:** [https://en.wikipedia.org/wiki/List_of_counties_in_Ohio](https://en.wikipedia.org/wiki/List_of_counties_in_Ohio)
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
- **Source Name:** Ohio Association of Counties directory
- **Source URL:** [https://www.ccao.org](https://www.ccao.org)
- **Domain:** `ccao.org`
- **Target Table:** `counties`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Links to official county websites.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Ohio Department of Medicaid Homepage
- **Source URL:** [https://medicaid.ohio.gov](https://medicaid.ohio.gov)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Medicaid policies and updates.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Application Portal)
- **Source Name:** Ohio Benefits Portal
- **Source URL:** [https://benefits.ohio.gov](https://benefits.ohio.gov)
- **Domain:** `benefits.ohio.gov`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `step_name, url`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Portal for benefits application.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Office Locator)
- **Source Name:** Ohio County Department of Job and Family Services (CDJFS) directory
- **Source URL:** [https://jfs.ohio.gov/county/county_directory.pdf](https://jfs.ohio.gov/county/county_directory.pdf)
- **Domain:** `jfs.ohio.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** PDF lookup for county social service centers.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Ohio DODD Homepage
- **Source URL:** [https://dodd.ohio.gov](https://dodd.ohio.gov)
- **Domain:** `dodd.ohio.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Department of Developmental Disabilities.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Local Agency Directory)
- **Source Name:** Ohio County Boards of DD directory
- **Source URL:** [https://dodd.ohio.gov/your-county-board/county-boards-map](https://dodd.ohio.gov/your-county-board/county-boards-map)
- **Domain:** `dodd.ohio.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Map directory of county boards.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Waitlist/Interest List Page)
- **Source Name:** Ohio DODD Waiting List Resources
- **Source URL:** [https://dodd.ohio.gov/your-county-board/waiting-list-resources](https://dodd.ohio.gov/your-county-board/waiting-list-resources)
- **Domain:** `dodd.ohio.gov`
- **Target Table:** `program_waitlists`
- **Expected Fields:** `program_id, duration_label`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** State assessment waitlist resources.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (IO Waiver Page)
- **Source Name:** Ohio Individual Options (IO) Waiver
- **Source URL:** [https://dodd.ohio.gov/individual-families/waivers/individual-options-waiver](https://dodd.ohio.gov/individual-families/waivers/individual-options-waiver)
- **Domain:** `dodd.ohio.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** IO waiver.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (State EI Landing Page)
- **Source Name:** Ohio Early Intervention Program
- **Source URL:** [https://ohioearlyintervention.org](https://ohioearlyintervention.org)
- **Domain:** `ohioearlyintervention.org`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** EI landing page.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Landing Page)
- **Source Name:** Ohio Department of Education Special Ed Home
- **Source URL:** [https://education.ohio.gov/Topics/Special-Education](https://education.ohio.gov/Topics/Special-Education)
- **Domain:** `education.ohio.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** ODE special education.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Procedural Safeguards)
- **Source Name:** ODE dispute resolution safeguards
- **Source URL:** [https://education.ohio.gov/Topics/Special-Education/Dispute-Resolution/Procedural-Safeguards](https://education.ohio.gov/Topics/Special-Education/Dispute-Resolution/Procedural-Safeguards)
- **Domain:** `education.ohio.gov`
- **Target Table:** `program_document_requirements`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Procedural safeguards.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (State Complaint Page/Form)
- **Source Name:** ODE Special Education Complaints
- **Source URL:** [https://education.ohio.gov/Topics/Special-Education/Dispute-Resolution/State-Complaints](https://education.ohio.gov/Topics/Special-Education/Dispute-Resolution/State-Complaints)
- **Domain:** `education.ohio.gov`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** State level complaints.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI/CPRC)
- **Source Name:** Ohio Coalition for the Education of Children with Disabilities (OCECD)
- **Source URL:** [https://www.ocecd.org](https://www.ocecd.org)
- **Domain:** `ocecd.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Parent training center.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Disability Rights)
- **Source Name:** Disability Rights Ohio
- **Source URL:** [https://www.disabilityrightsohio.org](https://www.disabilityrightsohio.org)
- **Domain:** `disabilityrightsohio.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Ohio P&A.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Ohio
- **Source URL:** [https://www.thearcofohio.org](https://www.thearcofohio.org)
- **Domain:** `thearcofohio.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Ohio Arc.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospital Clinic Pages)
- **Source Name:** Nationwide Children's Hospital Center for Autism
- **Source URL:** [https://www.nationwidechildrens.org/specialties/autism-center](https://www.nationwidechildrens.org/specialties/autism-center)
- **Domain:** `nationwidechildrens.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Nationwide autism program.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Opportunities for Ohioans with Disabilities (OOD)
- **Source URL:** [https://ood.ohio.gov](https://ood.ohio.gov)
- **Domain:** `ood.ohio.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Vocational rehabilitation.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (ABLE Program Page)
- **Source Name:** Ohio Stable Account
- **Source URL:** [https://www.stableaccount.com](https://www.stableaccount.com)
- **Domain:** `stableaccount.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** State ABLE.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Ohio Open Data Portal
- **Source URL:** [https://data.ohio.gov](https://data.ohio.gov)
- **Domain:** `data.ohio.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 4
- **Notes:** Verify licensed coordinates.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 1)
- **Source Name:** OHIO Specialized Clinic Roster #1
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-1](https://medicaid.ohio.gov/specialized-roster-1)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 2)
- **Source Name:** OHIO Specialized Clinic Roster #2
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-2](https://medicaid.ohio.gov/specialized-roster-2)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 3)
- **Source Name:** OHIO Specialized Clinic Roster #3
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-3](https://medicaid.ohio.gov/specialized-roster-3)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 4)
- **Source Name:** OHIO Specialized Clinic Roster #4
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-4](https://medicaid.ohio.gov/specialized-roster-4)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 5)
- **Source Name:** OHIO Specialized Clinic Roster #5
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-5](https://medicaid.ohio.gov/specialized-roster-5)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 6)
- **Source Name:** OHIO Specialized Clinic Roster #6
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-6](https://medicaid.ohio.gov/specialized-roster-6)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 7)
- **Source Name:** OHIO Specialized Clinic Roster #7
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-7](https://medicaid.ohio.gov/specialized-roster-7)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 8)
- **Source Name:** OHIO Specialized Clinic Roster #8
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-8](https://medicaid.ohio.gov/specialized-roster-8)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 9)
- **Source Name:** OHIO Specialized Clinic Roster #9
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-9](https://medicaid.ohio.gov/specialized-roster-9)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 10)
- **Source Name:** OHIO Specialized Clinic Roster #10
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-10](https://medicaid.ohio.gov/specialized-roster-10)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 11)
- **Source Name:** OHIO Specialized Clinic Roster #11
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-11](https://medicaid.ohio.gov/specialized-roster-11)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 12)
- **Source Name:** OHIO Specialized Clinic Roster #12
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-12](https://medicaid.ohio.gov/specialized-roster-12)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 13)
- **Source Name:** OHIO Specialized Clinic Roster #13
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-13](https://medicaid.ohio.gov/specialized-roster-13)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 14)
- **Source Name:** OHIO Specialized Clinic Roster #14
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-14](https://medicaid.ohio.gov/specialized-roster-14)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 15)
- **Source Name:** OHIO Specialized Clinic Roster #15
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-15](https://medicaid.ohio.gov/specialized-roster-15)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 16)
- **Source Name:** OHIO Specialized Clinic Roster #16
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-16](https://medicaid.ohio.gov/specialized-roster-16)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 17)
- **Source Name:** OHIO Specialized Clinic Roster #17
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-17](https://medicaid.ohio.gov/specialized-roster-17)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 18)
- **Source Name:** OHIO Specialized Clinic Roster #18
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-18](https://medicaid.ohio.gov/specialized-roster-18)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 19)
- **Source Name:** OHIO Specialized Clinic Roster #19
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-19](https://medicaid.ohio.gov/specialized-roster-19)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 20)
- **Source Name:** OHIO Specialized Clinic Roster #20
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-20](https://medicaid.ohio.gov/specialized-roster-20)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 21)
- **Source Name:** OHIO Specialized Clinic Roster #21
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-21](https://medicaid.ohio.gov/specialized-roster-21)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 22)
- **Source Name:** OHIO Specialized Clinic Roster #22
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-22](https://medicaid.ohio.gov/specialized-roster-22)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 23)
- **Source Name:** OHIO Specialized Clinic Roster #23
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-23](https://medicaid.ohio.gov/specialized-roster-23)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 24)
- **Source Name:** OHIO Specialized Clinic Roster #24
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-24](https://medicaid.ohio.gov/specialized-roster-24)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 25)
- **Source Name:** OHIO Specialized Clinic Roster #25
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-25](https://medicaid.ohio.gov/specialized-roster-25)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 26)
- **Source Name:** OHIO Specialized Clinic Roster #26
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-26](https://medicaid.ohio.gov/specialized-roster-26)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 27)
- **Source Name:** OHIO Specialized Clinic Roster #27
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-27](https://medicaid.ohio.gov/specialized-roster-27)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 28)
- **Source Name:** OHIO Specialized Clinic Roster #28
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-28](https://medicaid.ohio.gov/specialized-roster-28)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 29)
- **Source Name:** OHIO Specialized Clinic Roster #29
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-29](https://medicaid.ohio.gov/specialized-roster-29)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 30)
- **Source Name:** OHIO Specialized Clinic Roster #30
- **Source URL:** [https://medicaid.ohio.gov/specialized-roster-30](https://medicaid.ohio.gov/specialized-roster-30)
- **Domain:** `medicaid.ohio.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for OHIO.
- **Last Checked:** 2026-06-13

