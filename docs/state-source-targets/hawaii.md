# State Source Targets: Hawaii (HI)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Hawaii with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Hawaii County Metadata** | A. State identity and geography / County List | [hawaii.gov](https://www.hawaii.gov) | `static_fetch` | `counties` |
| **Hawaii Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.hawaii.gov](https://dhhs.hawaii.gov) | `playwright` | `county_offices` |
| **Hawaii Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.hawaii.gov](https://dhhs.hawaii.gov/dd) | `playwright` | `state_resource_agencies` |
| **Hawaii HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.hawaii.gov](https://dhhs.hawaii.gov/dd/waivers) | `static_fetch` | `programs` |
| **Hawaii Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.hawaii.gov](https://dhhs.hawaii.gov/earlyintervention) | `static_fetch` | `programs` |
| **Hawaii Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.hawaii.gov](https://education.hawaii.gov) | `static_fetch` | `programs` |
| **Hawaii Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.hawaii.gov](https://education.hawaii.gov/regional) | `playwright` | `regional_education_agencies` |
| **Hawaii Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Hawaii** | I. Condition-specific nonprofits / The Arc State Chapter | [thearchawaii.org](https://www.thearchawaii.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Hawaii Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.hawaii.gov](https://dhhs.hawaii.gov/forms) | `pdf_extract` | `forms` |
| **Hawaii Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.hawaii.gov](https://dhhs.hawaii.gov/rehab) | `static_fetch` | `programs` |
| **Hawaii Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Hawaii Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [hawaii.gov](https://www.hawaii.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Hawaii County Metadata
- **Source URL:** [https://www.hawaii.gov](https://www.hawaii.gov)
- **Domain:** `hawaii.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Hawaii Medicaid Portal
- **Source URL:** [https://dhhs.hawaii.gov](https://dhhs.hawaii.gov)
- **Domain:** `dhhs.hawaii.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Hawaii Developmental Services Directory
- **Source URL:** [https://dhhs.hawaii.gov/dd](https://dhhs.hawaii.gov/dd)
- **Domain:** `dhhs.hawaii.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Hawaii HCBS Waivers Page
- **Source URL:** [https://dhhs.hawaii.gov/dd/waivers](https://dhhs.hawaii.gov/dd/waivers)
- **Domain:** `dhhs.hawaii.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Hawaii Early Intervention / Part C
- **Source URL:** [https://dhhs.hawaii.gov/earlyintervention](https://dhhs.hawaii.gov/earlyintervention)
- **Domain:** `dhhs.hawaii.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Hawaii Department of Education Special Ed
- **Source URL:** [https://education.hawaii.gov](https://education.hawaii.gov)
- **Domain:** `education.hawaii.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Hawaii Regional Special Education Support
- **Source URL:** [https://education.hawaii.gov/regional](https://education.hawaii.gov/regional)
- **Domain:** `education.hawaii.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Hawaii Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Hawaii
- **Source URL:** [https://www.thearchawaii.org](https://www.thearchawaii.org)
- **Domain:** `thearchawaii.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
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
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Hawaii Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.hawaii.gov/forms](https://dhhs.hawaii.gov/forms)
- **Domain:** `dhhs.hawaii.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Hawaii Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.hawaii.gov/rehab](https://dhhs.hawaii.gov/rehab)
- **Domain:** `dhhs.hawaii.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Hawaii Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Hawaii Secretary of State Business Registry
- **Source URL:** [https://www.hawaii.gov/business](https://www.hawaii.gov/business)
- **Domain:** `hawaii.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Hawaii.
- **Last Checked:** 2026-06-13

