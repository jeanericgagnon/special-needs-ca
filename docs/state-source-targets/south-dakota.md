# State Source Targets: South Dakota (SD)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in South Dakota with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **South Dakota County Metadata** | A. State identity and geography / County List | [south-dakota.gov](https://www.south-dakota.gov) | `static_fetch` | `counties` |
| **South Dakota Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.south-dakota.gov](https://dhhs.south-dakota.gov) | `playwright` | `county_offices` |
| **South Dakota Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.south-dakota.gov](https://dhhs.south-dakota.gov/dd) | `playwright` | `state_resource_agencies` |
| **South Dakota HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.south-dakota.gov](https://dhhs.south-dakota.gov/dd/waivers) | `static_fetch` | `programs` |
| **South Dakota Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.south-dakota.gov](https://dhhs.south-dakota.gov/earlyintervention) | `static_fetch` | `programs` |
| **South Dakota Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.south-dakota.gov](https://education.south-dakota.gov) | `static_fetch` | `programs` |
| **South Dakota Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.south-dakota.gov](https://education.south-dakota.gov/regional) | `playwright` | `regional_education_agencies` |
| **South Dakota Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of South Dakota** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcsouth-dakota.org](https://www.thearcsouth-dakota.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **South Dakota Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.south-dakota.gov](https://dhhs.south-dakota.gov/forms) | `pdf_extract` | `forms` |
| **South Dakota Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.south-dakota.gov](https://dhhs.south-dakota.gov/rehab) | `static_fetch` | `programs` |
| **South Dakota Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **South Dakota Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [south-dakota.gov](https://www.south-dakota.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** South Dakota County Metadata
- **Source URL:** [https://www.south-dakota.gov](https://www.south-dakota.gov)
- **Domain:** `south-dakota.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** South Dakota Medicaid Portal
- **Source URL:** [https://dhhs.south-dakota.gov](https://dhhs.south-dakota.gov)
- **Domain:** `dhhs.south-dakota.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** South Dakota Developmental Services Directory
- **Source URL:** [https://dhhs.south-dakota.gov/dd](https://dhhs.south-dakota.gov/dd)
- **Domain:** `dhhs.south-dakota.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** South Dakota HCBS Waivers Page
- **Source URL:** [https://dhhs.south-dakota.gov/dd/waivers](https://dhhs.south-dakota.gov/dd/waivers)
- **Domain:** `dhhs.south-dakota.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** South Dakota Early Intervention / Part C
- **Source URL:** [https://dhhs.south-dakota.gov/earlyintervention](https://dhhs.south-dakota.gov/earlyintervention)
- **Domain:** `dhhs.south-dakota.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** South Dakota Department of Education Special Ed
- **Source URL:** [https://education.south-dakota.gov](https://education.south-dakota.gov)
- **Domain:** `education.south-dakota.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** South Dakota Regional Special Education Support
- **Source URL:** [https://education.south-dakota.gov/regional](https://education.south-dakota.gov/regional)
- **Domain:** `education.south-dakota.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** South Dakota Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of South Dakota
- **Source URL:** [https://www.thearcsouth-dakota.org](https://www.thearcsouth-dakota.org)
- **Domain:** `thearcsouth-dakota.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
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
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** South Dakota Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.south-dakota.gov/forms](https://dhhs.south-dakota.gov/forms)
- **Domain:** `dhhs.south-dakota.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** South Dakota Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.south-dakota.gov/rehab](https://dhhs.south-dakota.gov/rehab)
- **Domain:** `dhhs.south-dakota.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** South Dakota Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** South Dakota Secretary of State Business Registry
- **Source URL:** [https://www.south-dakota.gov/business](https://www.south-dakota.gov/business)
- **Domain:** `south-dakota.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for South Dakota.
- **Last Checked:** 2026-06-13

