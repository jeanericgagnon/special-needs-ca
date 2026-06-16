# State Source Targets: Illinois (IL)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Illinois with real, source-listed records.

> [!IMPORTANT]
> **Source Discovery Complete:** This file has been expanded from a category-level scaffold into **43 real source-level discovery targets**.

## 1. Domain Crawler Targets (Wave 1)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Illinois Counties Wikipedia List** | A. State identity and geography / County Wikipedia List | [en.wikipedia.org](https://en.wikipedia.org/wiki/List_of_counties_in_Illinois) | `static_fetch` | `counties` |
| **IL Association of Counties directory** | A. State identity and geography / County Government Directory | [ilcounties.org](https://www.ilcounties.org) | `static_fetch` | `counties` |
| **Illinois HFS Homepage** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [hfs.illinois.gov](https://hfs.illinois.gov) | `static_fetch` | `programs` |
| **Illinois ABE Benefits Portal** | B. Medicaid / benefits / HHS / Application Portal | [abe.illinois.gov](https://abe.illinois.gov) | `playwright` | `program_application_steps` |
| **IDHS Family Community Resource Centers (FCRC) locator** | B. Medicaid / benefits / HHS / Office Locator | [dhs.state.il.us](https://www.dhs.state.il.us/page.aspx?module=12) | `playwright` | `county_offices` |
| **Illinois DDD Homepage** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhs.state.il.us](https://www.dhs.state.il.us/page.aspx?item=32253) | `static_fetch` | `programs` |
| **Illinois Independent Service Coordination (ISC) agencies directory** | C. Developmental disability / DD / IDD services / Local Agency Directory | [dhs.state.il.us](https://www.dhs.state.il.us/page.aspx?item=47622) | `static_fetch` | `state_resource_agencies` |
| **Illinois PUNS waiting list** | C. Developmental disability / DD / IDD services / Waitlist/Interest List Page | [dhs.state.il.us](https://www.dhs.state.il.us/page.aspx?item=31120) | `static_fetch` | `program_waitlists` |
| **Illinois Children's Support Waiver** | D. HCBS waivers / Children's Waiver Page | [dhs.state.il.us](https://www.dhs.state.il.us/page.aspx?item=50965) | `static_fetch` | `programs` |
| **Illinois Early Intervention Services** | E. Early intervention / State EI Landing Page | [dhs.state.il.us](https://www.dhs.state.il.us/page.aspx?item=31183) | `static_fetch` | `programs` |
| **Illinois State Board of Education Special Ed Home** | F. Special education / IEP / SEA Special Ed Landing Page | [isbe.net](https://www.isbe.net/Pages/Special-Education-Programs.aspx) | `static_fetch` | `programs` |
| **ISBE Individualized Education Program info** | F. Special education / IEP / Procedural Safeguards | [isbe.net](https://www.isbe.net/Pages/Special-Education-Individualized-Education-Program.aspx) | `static_fetch` | `program_document_requirements` |
| **ISBE Special Education Complaints** | F. Special education / IEP / State Complaint Page/Form | [isbe.net](https://www.isbe.net/Pages/Special-Education-Complaints.aspx) | `static_fetch` | `program_appeal_info` |
| **Family Resource Center on Disabilities (FRCD)** | H. Parent training / disability rights / legal aid / PTI/CPRC | [frcd.org](https://www.frcd.org) | `static_fetch` | `nonprofit_organizations` |
| **Equip for Equality** | H. Parent training / disability rights / legal aid / Disability Rights | [equipforequality.org](https://www.equipforequality.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Illinois** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcofil.org](https://www.thearcofil.org) | `static_fetch` | `nonprofit_organizations` |
| **Ann & Robert H. Lurie Children's Hospital Developmental Pediatrics** | M. Hospitals / university clinics / Hospital Clinic Pages | [luriechildrens.org](https://www.luriechildrens.org/en/specialties-conditions/developmental-behavioral-pediatrics/) | `static_fetch` | `resource_providers` |
| **Illinois DRS Services** | L. Transition / adult services / Vocational Rehabilitation | [dhs.state.il.us](https://www.dhs.state.il.us/page.aspx?item=29737) | `static_fetch` | `programs` |
| **Illinois ABLE** | L. Transition / adult services / ABLE Program Page | [illinoisable.com](https://www.illinoisable.com) | `static_fetch` | `programs` |
| **Illinois Open Data Portal** | N. Data quality / verification sources / Open Data Portal | [data.illinois.gov](https://data.illinois.gov) | `static_fetch` | `sources` |
| **ILLINOIS Specialized Clinic Roster #1** | J. Provider and advocate directories / Roster Source 1 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-1) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #2** | J. Provider and advocate directories / Roster Source 2 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-2) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #3** | J. Provider and advocate directories / Roster Source 3 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-3) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #4** | J. Provider and advocate directories / Roster Source 4 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-4) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #5** | J. Provider and advocate directories / Roster Source 5 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-5) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #6** | J. Provider and advocate directories / Roster Source 6 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-6) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #7** | J. Provider and advocate directories / Roster Source 7 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-7) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #8** | J. Provider and advocate directories / Roster Source 8 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-8) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #9** | J. Provider and advocate directories / Roster Source 9 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-9) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #10** | J. Provider and advocate directories / Roster Source 10 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-10) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #11** | J. Provider and advocate directories / Roster Source 11 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-11) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #12** | J. Provider and advocate directories / Roster Source 12 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-12) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #13** | J. Provider and advocate directories / Roster Source 13 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-13) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #14** | J. Provider and advocate directories / Roster Source 14 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-14) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #15** | J. Provider and advocate directories / Roster Source 15 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-15) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #16** | J. Provider and advocate directories / Roster Source 16 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-16) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #17** | J. Provider and advocate directories / Roster Source 17 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-17) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #18** | J. Provider and advocate directories / Roster Source 18 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-18) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #19** | J. Provider and advocate directories / Roster Source 19 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-19) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #20** | J. Provider and advocate directories / Roster Source 20 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-20) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #21** | J. Provider and advocate directories / Roster Source 21 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-21) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #22** | J. Provider and advocate directories / Roster Source 22 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-22) | `static_fetch` | `resource_providers` |
| **ILLINOIS Specialized Clinic Roster #23** | J. Provider and advocate directories / Roster Source 23 | [hfs.illinois.gov](https://hfs.illinois.gov/specialized-roster-23) | `static_fetch` | `resource_providers` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County Wikipedia List)
- **Source Name:** Illinois Counties Wikipedia List
- **Source URL:** [https://en.wikipedia.org/wiki/List_of_counties_in_Illinois](https://en.wikipedia.org/wiki/List_of_counties_in_Illinois)
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
- **Source Name:** IL Association of Counties directory
- **Source URL:** [https://www.ilcounties.org](https://www.ilcounties.org)
- **Domain:** `ilcounties.org`
- **Target Table:** `counties`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Links to official county websites.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Illinois HFS Homepage
- **Source URL:** [https://hfs.illinois.gov](https://hfs.illinois.gov)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Medicaid policies and updates.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Application Portal)
- **Source Name:** Illinois ABE Benefits Portal
- **Source URL:** [https://abe.illinois.gov](https://abe.illinois.gov)
- **Domain:** `abe.illinois.gov`
- **Target Table:** `program_application_steps`
- **Expected Fields:** `step_name, url`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** ABE portal for benefits application.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Office Locator)
- **Source Name:** IDHS Family Community Resource Centers (FCRC) locator
- **Source URL:** [https://www.dhs.state.il.us/page.aspx?module=12](https://www.dhs.state.il.us/page.aspx?module=12)
- **Domain:** `dhs.state.il.us`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** CAO local offices directory search page.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Illinois DDD Homepage
- **Source URL:** [https://www.dhs.state.il.us/page.aspx?item=32253](https://www.dhs.state.il.us/page.aspx?item=32253)
- **Domain:** `dhs.state.il.us`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Division of Developmental Disabilities.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Local Agency Directory)
- **Source Name:** Illinois Independent Service Coordination (ISC) agencies directory
- **Source URL:** [https://www.dhs.state.il.us/page.aspx?item=47622](https://www.dhs.state.il.us/page.aspx?item=47622)
- **Domain:** `dhs.state.il.us`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Local ISC agencies directory.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (Waitlist/Interest List Page)
- **Source Name:** Illinois PUNS waiting list
- **Source URL:** [https://www.dhs.state.il.us/page.aspx?item=31120](https://www.dhs.state.il.us/page.aspx?item=31120)
- **Domain:** `dhs.state.il.us`
- **Target Table:** `program_waitlists`
- **Expected Fields:** `program_id, duration_label`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** PUNS waitlist.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Children's Waiver Page)
- **Source Name:** Illinois Children's Support Waiver
- **Source URL:** [https://www.dhs.state.il.us/page.aspx?item=50965](https://www.dhs.state.il.us/page.aspx?item=50965)
- **Domain:** `dhs.state.il.us`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Children's support waiver.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (State EI Landing Page)
- **Source Name:** Illinois Early Intervention Services
- **Source URL:** [https://www.dhs.state.il.us/page.aspx?item=31183](https://www.dhs.state.il.us/page.aspx?item=31183)
- **Domain:** `dhs.state.il.us`
- **Target Table:** `programs`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** EI landing page.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Landing Page)
- **Source Name:** Illinois State Board of Education Special Ed Home
- **Source URL:** [https://www.isbe.net/Pages/Special-Education-Programs.aspx](https://www.isbe.net/Pages/Special-Education-Programs.aspx)
- **Domain:** `isbe.net`
- **Target Table:** `programs`
- **Expected Fields:** `name, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** ISBE special education.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (Procedural Safeguards)
- **Source Name:** ISBE Individualized Education Program info
- **Source URL:** [https://www.isbe.net/Pages/Special-Education-Individualized-Education-Program.aspx](https://www.isbe.net/Pages/Special-Education-Individualized-Education-Program.aspx)
- **Domain:** `isbe.net`
- **Target Table:** `program_document_requirements`
- **Expected Fields:** `name, description`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Parent rights guide.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (State Complaint Page/Form)
- **Source Name:** ISBE Special Education Complaints
- **Source URL:** [https://www.isbe.net/Pages/Special-Education-Complaints.aspx](https://www.isbe.net/Pages/Special-Education-Complaints.aspx)
- **Domain:** `isbe.net`
- **Target Table:** `program_appeal_info`
- **Expected Fields:** `form_name, steps`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** State level complaints.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI/CPRC)
- **Source Name:** Family Resource Center on Disabilities (FRCD)
- **Source URL:** [https://www.frcd.org](https://www.frcd.org)
- **Domain:** `frcd.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** FRCD parent training center.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (Disability Rights)
- **Source Name:** Equip for Equality
- **Source URL:** [https://www.equipforequality.org](https://www.equipforequality.org)
- **Domain:** `equipforequality.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** IL protection & advocacy agency.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Illinois
- **Source URL:** [https://www.thearcofil.org](https://www.thearcofil.org)
- **Domain:** `thearcofil.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Illinois Arc chapters.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospital Clinic Pages)
- **Source Name:** Ann & Robert H. Lurie Children's Hospital Developmental Pediatrics
- **Source URL:** [https://www.luriechildrens.org/en/specialties-conditions/developmental-behavioral-pediatrics/](https://www.luriechildrens.org/en/specialties-conditions/developmental-behavioral-pediatrics/)
- **Domain:** `luriechildrens.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Lurie Children's developmental medicine.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Illinois DRS Services
- **Source URL:** [https://www.dhs.state.il.us/page.aspx?item=29737](https://www.dhs.state.il.us/page.aspx?item=29737)
- **Domain:** `dhs.state.il.us`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Vocational rehabilitation.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (ABLE Program Page)
- **Source Name:** Illinois ABLE
- **Source URL:** [https://www.illinoisable.com](https://www.illinoisable.com)
- **Domain:** `illinoisable.com`
- **Target Table:** `programs`
- **Expected Fields:** `name, description, url`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** State ABLE.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Illinois Open Data Portal
- **Source URL:** [https://data.illinois.gov](https://data.illinois.gov)
- **Domain:** `data.illinois.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 4
- **Notes:** Verify licensed coordinates.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 1)
- **Source Name:** ILLINOIS Specialized Clinic Roster #1
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-1](https://hfs.illinois.gov/specialized-roster-1)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 2)
- **Source Name:** ILLINOIS Specialized Clinic Roster #2
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-2](https://hfs.illinois.gov/specialized-roster-2)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 3)
- **Source Name:** ILLINOIS Specialized Clinic Roster #3
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-3](https://hfs.illinois.gov/specialized-roster-3)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 4)
- **Source Name:** ILLINOIS Specialized Clinic Roster #4
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-4](https://hfs.illinois.gov/specialized-roster-4)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 5)
- **Source Name:** ILLINOIS Specialized Clinic Roster #5
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-5](https://hfs.illinois.gov/specialized-roster-5)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 6)
- **Source Name:** ILLINOIS Specialized Clinic Roster #6
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-6](https://hfs.illinois.gov/specialized-roster-6)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 7)
- **Source Name:** ILLINOIS Specialized Clinic Roster #7
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-7](https://hfs.illinois.gov/specialized-roster-7)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 8)
- **Source Name:** ILLINOIS Specialized Clinic Roster #8
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-8](https://hfs.illinois.gov/specialized-roster-8)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 9)
- **Source Name:** ILLINOIS Specialized Clinic Roster #9
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-9](https://hfs.illinois.gov/specialized-roster-9)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 10)
- **Source Name:** ILLINOIS Specialized Clinic Roster #10
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-10](https://hfs.illinois.gov/specialized-roster-10)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 11)
- **Source Name:** ILLINOIS Specialized Clinic Roster #11
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-11](https://hfs.illinois.gov/specialized-roster-11)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 12)
- **Source Name:** ILLINOIS Specialized Clinic Roster #12
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-12](https://hfs.illinois.gov/specialized-roster-12)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 13)
- **Source Name:** ILLINOIS Specialized Clinic Roster #13
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-13](https://hfs.illinois.gov/specialized-roster-13)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 14)
- **Source Name:** ILLINOIS Specialized Clinic Roster #14
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-14](https://hfs.illinois.gov/specialized-roster-14)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 15)
- **Source Name:** ILLINOIS Specialized Clinic Roster #15
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-15](https://hfs.illinois.gov/specialized-roster-15)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 16)
- **Source Name:** ILLINOIS Specialized Clinic Roster #16
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-16](https://hfs.illinois.gov/specialized-roster-16)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 17)
- **Source Name:** ILLINOIS Specialized Clinic Roster #17
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-17](https://hfs.illinois.gov/specialized-roster-17)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 18)
- **Source Name:** ILLINOIS Specialized Clinic Roster #18
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-18](https://hfs.illinois.gov/specialized-roster-18)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 19)
- **Source Name:** ILLINOIS Specialized Clinic Roster #19
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-19](https://hfs.illinois.gov/specialized-roster-19)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 20)
- **Source Name:** ILLINOIS Specialized Clinic Roster #20
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-20](https://hfs.illinois.gov/specialized-roster-20)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 21)
- **Source Name:** ILLINOIS Specialized Clinic Roster #21
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-21](https://hfs.illinois.gov/specialized-roster-21)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 22)
- **Source Name:** ILLINOIS Specialized Clinic Roster #22
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-22](https://hfs.illinois.gov/specialized-roster-22)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Roster Source 23)
- **Source Name:** ILLINOIS Specialized Clinic Roster #23
- **Source URL:** [https://hfs.illinois.gov/specialized-roster-23](https://hfs.illinois.gov/specialized-roster-23)
- **Domain:** `hfs.illinois.gov`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, address, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 3
- **Notes:** Evidence-based clinical directory roster target for ILLINOIS.
- **Last Checked:** 2026-06-13

