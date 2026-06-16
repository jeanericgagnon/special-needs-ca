# State Source Targets: Oregon (OR)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Oregon with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Oregon County Metadata** | A. State identity and geography / County List | [oregon.gov](https://www.oregon.gov) | `static_fetch` | `counties` |
| **Oregon Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.oregon.gov](https://dhhs.oregon.gov) | `playwright` | `county_offices` |
| **Oregon Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.oregon.gov](https://dhhs.oregon.gov/dd) | `playwright` | `state_resource_agencies` |
| **Oregon HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.oregon.gov](https://dhhs.oregon.gov/dd/waivers) | `static_fetch` | `programs` |
| **Oregon Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.oregon.gov](https://dhhs.oregon.gov/earlyintervention) | `static_fetch` | `programs` |
| **Oregon Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.oregon.gov](https://education.oregon.gov) | `static_fetch` | `programs` |
| **Oregon Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.oregon.gov](https://education.oregon.gov/regional) | `playwright` | `regional_education_agencies` |
| **Oregon Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Oregon** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcoregon.org](https://www.thearcoregon.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Oregon Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.oregon.gov](https://dhhs.oregon.gov/forms) | `pdf_extract` | `forms` |
| **Oregon Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.oregon.gov](https://dhhs.oregon.gov/rehab) | `static_fetch` | `programs` |
| **Oregon Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Oregon Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [oregon.gov](https://www.oregon.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Oregon County Metadata
- **Source URL:** [https://www.oregon.gov](https://www.oregon.gov)
- **Domain:** `oregon.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Oregon Medicaid Portal
- **Source URL:** [https://dhhs.oregon.gov](https://dhhs.oregon.gov)
- **Domain:** `dhhs.oregon.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Oregon Developmental Services Directory
- **Source URL:** [https://dhhs.oregon.gov/dd](https://dhhs.oregon.gov/dd)
- **Domain:** `dhhs.oregon.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Oregon HCBS Waivers Page
- **Source URL:** [https://dhhs.oregon.gov/dd/waivers](https://dhhs.oregon.gov/dd/waivers)
- **Domain:** `dhhs.oregon.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Oregon Early Intervention / Part C
- **Source URL:** [https://dhhs.oregon.gov/earlyintervention](https://dhhs.oregon.gov/earlyintervention)
- **Domain:** `dhhs.oregon.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Oregon Department of Education Special Ed
- **Source URL:** [https://education.oregon.gov](https://education.oregon.gov)
- **Domain:** `education.oregon.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Oregon Regional Special Education Support
- **Source URL:** [https://education.oregon.gov/regional](https://education.oregon.gov/regional)
- **Domain:** `education.oregon.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Oregon Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Oregon
- **Source URL:** [https://www.thearcoregon.org](https://www.thearcoregon.org)
- **Domain:** `thearcoregon.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
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
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Oregon Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.oregon.gov/forms](https://dhhs.oregon.gov/forms)
- **Domain:** `dhhs.oregon.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Oregon Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.oregon.gov/rehab](https://dhhs.oregon.gov/rehab)
- **Domain:** `dhhs.oregon.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Oregon Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Oregon Secretary of State Business Registry
- **Source URL:** [https://www.oregon.gov/business](https://www.oregon.gov/business)
- **Domain:** `oregon.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Oregon.
- **Last Checked:** 2026-06-13

