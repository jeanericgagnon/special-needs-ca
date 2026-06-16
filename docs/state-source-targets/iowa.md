# State Source Targets: Iowa (IA)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Iowa with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Iowa County Metadata** | A. State identity and geography / County List | [iowa.gov](https://www.iowa.gov) | `static_fetch` | `counties` |
| **Iowa Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.iowa.gov](https://dhhs.iowa.gov) | `playwright` | `county_offices` |
| **Iowa Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.iowa.gov](https://dhhs.iowa.gov/dd) | `playwright` | `state_resource_agencies` |
| **Iowa HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.iowa.gov](https://dhhs.iowa.gov/dd/waivers) | `static_fetch` | `programs` |
| **Iowa Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.iowa.gov](https://dhhs.iowa.gov/earlyintervention) | `static_fetch` | `programs` |
| **Iowa Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.iowa.gov](https://education.iowa.gov) | `static_fetch` | `programs` |
| **Iowa Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.iowa.gov](https://education.iowa.gov/regional) | `playwright` | `regional_education_agencies` |
| **Iowa Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Iowa** | I. Condition-specific nonprofits / The Arc State Chapter | [thearciowa.org](https://www.thearciowa.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Iowa Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.iowa.gov](https://dhhs.iowa.gov/forms) | `pdf_extract` | `forms` |
| **Iowa Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.iowa.gov](https://dhhs.iowa.gov/rehab) | `static_fetch` | `programs` |
| **Iowa Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Iowa Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [iowa.gov](https://www.iowa.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Iowa County Metadata
- **Source URL:** [https://www.iowa.gov](https://www.iowa.gov)
- **Domain:** `iowa.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Iowa Medicaid Portal
- **Source URL:** [https://dhhs.iowa.gov](https://dhhs.iowa.gov)
- **Domain:** `dhhs.iowa.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Iowa Developmental Services Directory
- **Source URL:** [https://dhhs.iowa.gov/dd](https://dhhs.iowa.gov/dd)
- **Domain:** `dhhs.iowa.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Iowa HCBS Waivers Page
- **Source URL:** [https://dhhs.iowa.gov/dd/waivers](https://dhhs.iowa.gov/dd/waivers)
- **Domain:** `dhhs.iowa.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Iowa Early Intervention / Part C
- **Source URL:** [https://dhhs.iowa.gov/earlyintervention](https://dhhs.iowa.gov/earlyintervention)
- **Domain:** `dhhs.iowa.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Iowa Department of Education Special Ed
- **Source URL:** [https://education.iowa.gov](https://education.iowa.gov)
- **Domain:** `education.iowa.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Iowa Regional Special Education Support
- **Source URL:** [https://education.iowa.gov/regional](https://education.iowa.gov/regional)
- **Domain:** `education.iowa.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Iowa Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Iowa
- **Source URL:** [https://www.thearciowa.org](https://www.thearciowa.org)
- **Domain:** `thearciowa.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
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
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Iowa Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.iowa.gov/forms](https://dhhs.iowa.gov/forms)
- **Domain:** `dhhs.iowa.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Iowa Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.iowa.gov/rehab](https://dhhs.iowa.gov/rehab)
- **Domain:** `dhhs.iowa.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Iowa Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Iowa Secretary of State Business Registry
- **Source URL:** [https://www.iowa.gov/business](https://www.iowa.gov/business)
- **Domain:** `iowa.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Iowa.
- **Last Checked:** 2026-06-13

