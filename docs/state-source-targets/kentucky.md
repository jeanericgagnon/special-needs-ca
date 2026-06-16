# State Source Targets: Kentucky (KY)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Kentucky with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Kentucky County Metadata** | A. State identity and geography / County List | [kentucky.gov](https://www.kentucky.gov) | `static_fetch` | `counties` |
| **Kentucky Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.kentucky.gov](https://dhhs.kentucky.gov) | `playwright` | `county_offices` |
| **Kentucky Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.kentucky.gov](https://dhhs.kentucky.gov/dd) | `playwright` | `state_resource_agencies` |
| **Kentucky HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.kentucky.gov](https://dhhs.kentucky.gov/dd/waivers) | `static_fetch` | `programs` |
| **Kentucky Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.kentucky.gov](https://dhhs.kentucky.gov/earlyintervention) | `static_fetch` | `programs` |
| **Kentucky Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.kentucky.gov](https://education.kentucky.gov) | `static_fetch` | `programs` |
| **Kentucky Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.kentucky.gov](https://education.kentucky.gov/regional) | `playwright` | `regional_education_agencies` |
| **Kentucky Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Kentucky** | I. Condition-specific nonprofits / The Arc State Chapter | [thearckentucky.org](https://www.thearckentucky.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Kentucky Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.kentucky.gov](https://dhhs.kentucky.gov/forms) | `pdf_extract` | `forms` |
| **Kentucky Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.kentucky.gov](https://dhhs.kentucky.gov/rehab) | `static_fetch` | `programs` |
| **Kentucky Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Kentucky Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [kentucky.gov](https://www.kentucky.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Kentucky County Metadata
- **Source URL:** [https://www.kentucky.gov](https://www.kentucky.gov)
- **Domain:** `kentucky.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Kentucky Medicaid Portal
- **Source URL:** [https://dhhs.kentucky.gov](https://dhhs.kentucky.gov)
- **Domain:** `dhhs.kentucky.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Kentucky Developmental Services Directory
- **Source URL:** [https://dhhs.kentucky.gov/dd](https://dhhs.kentucky.gov/dd)
- **Domain:** `dhhs.kentucky.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Kentucky HCBS Waivers Page
- **Source URL:** [https://dhhs.kentucky.gov/dd/waivers](https://dhhs.kentucky.gov/dd/waivers)
- **Domain:** `dhhs.kentucky.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Kentucky Early Intervention / Part C
- **Source URL:** [https://dhhs.kentucky.gov/earlyintervention](https://dhhs.kentucky.gov/earlyintervention)
- **Domain:** `dhhs.kentucky.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Kentucky Department of Education Special Ed
- **Source URL:** [https://education.kentucky.gov](https://education.kentucky.gov)
- **Domain:** `education.kentucky.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Kentucky Regional Special Education Support
- **Source URL:** [https://education.kentucky.gov/regional](https://education.kentucky.gov/regional)
- **Domain:** `education.kentucky.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Kentucky Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Kentucky
- **Source URL:** [https://www.thearckentucky.org](https://www.thearckentucky.org)
- **Domain:** `thearckentucky.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
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
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Kentucky Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.kentucky.gov/forms](https://dhhs.kentucky.gov/forms)
- **Domain:** `dhhs.kentucky.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Kentucky Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.kentucky.gov/rehab](https://dhhs.kentucky.gov/rehab)
- **Domain:** `dhhs.kentucky.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Kentucky Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Kentucky Secretary of State Business Registry
- **Source URL:** [https://www.kentucky.gov/business](https://www.kentucky.gov/business)
- **Domain:** `kentucky.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Kentucky.
- **Last Checked:** 2026-06-13

