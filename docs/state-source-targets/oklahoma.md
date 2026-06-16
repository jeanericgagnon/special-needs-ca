# State Source Targets: Oklahoma (OK)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Oklahoma with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Oklahoma County Metadata** | A. State identity and geography / County List | [oklahoma.gov](https://www.oklahoma.gov) | `static_fetch` | `counties` |
| **Oklahoma Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.oklahoma.gov](https://dhhs.oklahoma.gov) | `playwright` | `county_offices` |
| **Oklahoma Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.oklahoma.gov](https://dhhs.oklahoma.gov/dd) | `playwright` | `state_resource_agencies` |
| **Oklahoma HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.oklahoma.gov](https://dhhs.oklahoma.gov/dd/waivers) | `static_fetch` | `programs` |
| **Oklahoma Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.oklahoma.gov](https://dhhs.oklahoma.gov/earlyintervention) | `static_fetch` | `programs` |
| **Oklahoma Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.oklahoma.gov](https://education.oklahoma.gov) | `static_fetch` | `programs` |
| **Oklahoma Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.oklahoma.gov](https://education.oklahoma.gov/regional) | `playwright` | `regional_education_agencies` |
| **Oklahoma Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Oklahoma** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcoklahoma.org](https://www.thearcoklahoma.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Oklahoma Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.oklahoma.gov](https://dhhs.oklahoma.gov/forms) | `pdf_extract` | `forms` |
| **Oklahoma Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.oklahoma.gov](https://dhhs.oklahoma.gov/rehab) | `static_fetch` | `programs` |
| **Oklahoma Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Oklahoma Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [oklahoma.gov](https://www.oklahoma.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Oklahoma County Metadata
- **Source URL:** [https://www.oklahoma.gov](https://www.oklahoma.gov)
- **Domain:** `oklahoma.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Oklahoma Medicaid Portal
- **Source URL:** [https://dhhs.oklahoma.gov](https://dhhs.oklahoma.gov)
- **Domain:** `dhhs.oklahoma.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Oklahoma Developmental Services Directory
- **Source URL:** [https://dhhs.oklahoma.gov/dd](https://dhhs.oklahoma.gov/dd)
- **Domain:** `dhhs.oklahoma.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Oklahoma HCBS Waivers Page
- **Source URL:** [https://dhhs.oklahoma.gov/dd/waivers](https://dhhs.oklahoma.gov/dd/waivers)
- **Domain:** `dhhs.oklahoma.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Oklahoma Early Intervention / Part C
- **Source URL:** [https://dhhs.oklahoma.gov/earlyintervention](https://dhhs.oklahoma.gov/earlyintervention)
- **Domain:** `dhhs.oklahoma.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Oklahoma Department of Education Special Ed
- **Source URL:** [https://education.oklahoma.gov](https://education.oklahoma.gov)
- **Domain:** `education.oklahoma.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Oklahoma Regional Special Education Support
- **Source URL:** [https://education.oklahoma.gov/regional](https://education.oklahoma.gov/regional)
- **Domain:** `education.oklahoma.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Oklahoma Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Oklahoma
- **Source URL:** [https://www.thearcoklahoma.org](https://www.thearcoklahoma.org)
- **Domain:** `thearcoklahoma.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
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
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Oklahoma Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.oklahoma.gov/forms](https://dhhs.oklahoma.gov/forms)
- **Domain:** `dhhs.oklahoma.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Oklahoma Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.oklahoma.gov/rehab](https://dhhs.oklahoma.gov/rehab)
- **Domain:** `dhhs.oklahoma.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Oklahoma Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Oklahoma Secretary of State Business Registry
- **Source URL:** [https://www.oklahoma.gov/business](https://www.oklahoma.gov/business)
- **Domain:** `oklahoma.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oklahoma.
- **Last Checked:** 2026-06-13

