# State Source Targets: Arkansas (AR)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Arkansas with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Arkansas County Metadata** | A. State identity and geography / County List | [arkansas.gov](https://www.arkansas.gov) | `static_fetch` | `counties` |
| **Arkansas Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.arkansas.gov](https://dhhs.arkansas.gov) | `playwright` | `county_offices` |
| **Arkansas Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.arkansas.gov](https://dhhs.arkansas.gov/dd) | `playwright` | `state_resource_agencies` |
| **Arkansas HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.arkansas.gov](https://dhhs.arkansas.gov/dd/waivers) | `static_fetch` | `programs` |
| **Arkansas Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.arkansas.gov](https://dhhs.arkansas.gov/earlyintervention) | `static_fetch` | `programs` |
| **Arkansas Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.arkansas.gov](https://education.arkansas.gov) | `static_fetch` | `programs` |
| **Arkansas Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.arkansas.gov](https://education.arkansas.gov/regional) | `playwright` | `regional_education_agencies` |
| **Arkansas Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Arkansas** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcarkansas.org](https://www.thearcarkansas.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Arkansas Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.arkansas.gov](https://dhhs.arkansas.gov/forms) | `pdf_extract` | `forms` |
| **Arkansas Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.arkansas.gov](https://dhhs.arkansas.gov/rehab) | `static_fetch` | `programs` |
| **Arkansas Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Arkansas Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [arkansas.gov](https://www.arkansas.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Arkansas County Metadata
- **Source URL:** [https://www.arkansas.gov](https://www.arkansas.gov)
- **Domain:** `arkansas.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Arkansas Medicaid Portal
- **Source URL:** [https://dhhs.arkansas.gov](https://dhhs.arkansas.gov)
- **Domain:** `dhhs.arkansas.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Arkansas Developmental Services Directory
- **Source URL:** [https://dhhs.arkansas.gov/dd](https://dhhs.arkansas.gov/dd)
- **Domain:** `dhhs.arkansas.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Arkansas HCBS Waivers Page
- **Source URL:** [https://dhhs.arkansas.gov/dd/waivers](https://dhhs.arkansas.gov/dd/waivers)
- **Domain:** `dhhs.arkansas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Arkansas Early Intervention / Part C
- **Source URL:** [https://dhhs.arkansas.gov/earlyintervention](https://dhhs.arkansas.gov/earlyintervention)
- **Domain:** `dhhs.arkansas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Arkansas Department of Education Special Ed
- **Source URL:** [https://education.arkansas.gov](https://education.arkansas.gov)
- **Domain:** `education.arkansas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Arkansas Regional Special Education Support
- **Source URL:** [https://education.arkansas.gov/regional](https://education.arkansas.gov/regional)
- **Domain:** `education.arkansas.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Arkansas Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Arkansas
- **Source URL:** [https://www.thearcarkansas.org](https://www.thearcarkansas.org)
- **Domain:** `thearcarkansas.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: J. Provider and advocate directories (Attorney Directory)
- **Source Name:** Special Education Attorneys Directory
- **Source URL:** [https://www.copaa.org](https://www.copaa.org)
- **Domain:** `copaa.org`
- **Target Table:** `iep_advocates`
- **Expected Fields:** `name, phone, email`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Arkansas Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.arkansas.gov/forms](https://dhhs.arkansas.gov/forms)
- **Domain:** `dhhs.arkansas.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Arkansas Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.arkansas.gov/rehab](https://dhhs.arkansas.gov/rehab)
- **Domain:** `dhhs.arkansas.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Arkansas Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Arkansas Secretary of State Business Registry
- **Source URL:** [https://www.arkansas.gov/business](https://www.arkansas.gov/business)
- **Domain:** `arkansas.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Arkansas.
- **Last Checked:** 2026-06-13

