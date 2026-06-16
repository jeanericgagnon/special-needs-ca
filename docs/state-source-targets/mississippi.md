# State Source Targets: Mississippi (MS)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Mississippi with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Mississippi County Metadata** | A. State identity and geography / County List | [mississippi.gov](https://www.mississippi.gov) | `static_fetch` | `counties` |
| **Mississippi Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.mississippi.gov](https://dhhs.mississippi.gov) | `playwright` | `county_offices` |
| **Mississippi Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.mississippi.gov](https://dhhs.mississippi.gov/dd) | `playwright` | `state_resource_agencies` |
| **Mississippi HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.mississippi.gov](https://dhhs.mississippi.gov/dd/waivers) | `static_fetch` | `programs` |
| **Mississippi Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.mississippi.gov](https://dhhs.mississippi.gov/earlyintervention) | `static_fetch` | `programs` |
| **Mississippi Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.mississippi.gov](https://education.mississippi.gov) | `static_fetch` | `programs` |
| **Mississippi Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.mississippi.gov](https://education.mississippi.gov/regional) | `playwright` | `regional_education_agencies` |
| **Mississippi Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Mississippi** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcmississippi.org](https://www.thearcmississippi.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Mississippi Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.mississippi.gov](https://dhhs.mississippi.gov/forms) | `pdf_extract` | `forms` |
| **Mississippi Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.mississippi.gov](https://dhhs.mississippi.gov/rehab) | `static_fetch` | `programs` |
| **Mississippi Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Mississippi Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [mississippi.gov](https://www.mississippi.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Mississippi County Metadata
- **Source URL:** [https://www.mississippi.gov](https://www.mississippi.gov)
- **Domain:** `mississippi.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Mississippi Medicaid Portal
- **Source URL:** [https://dhhs.mississippi.gov](https://dhhs.mississippi.gov)
- **Domain:** `dhhs.mississippi.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Mississippi Developmental Services Directory
- **Source URL:** [https://dhhs.mississippi.gov/dd](https://dhhs.mississippi.gov/dd)
- **Domain:** `dhhs.mississippi.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Mississippi HCBS Waivers Page
- **Source URL:** [https://dhhs.mississippi.gov/dd/waivers](https://dhhs.mississippi.gov/dd/waivers)
- **Domain:** `dhhs.mississippi.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Mississippi Early Intervention / Part C
- **Source URL:** [https://dhhs.mississippi.gov/earlyintervention](https://dhhs.mississippi.gov/earlyintervention)
- **Domain:** `dhhs.mississippi.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Mississippi Department of Education Special Ed
- **Source URL:** [https://education.mississippi.gov](https://education.mississippi.gov)
- **Domain:** `education.mississippi.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Mississippi Regional Special Education Support
- **Source URL:** [https://education.mississippi.gov/regional](https://education.mississippi.gov/regional)
- **Domain:** `education.mississippi.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Mississippi Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Mississippi
- **Source URL:** [https://www.thearcmississippi.org](https://www.thearcmississippi.org)
- **Domain:** `thearcmississippi.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
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
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Mississippi Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.mississippi.gov/forms](https://dhhs.mississippi.gov/forms)
- **Domain:** `dhhs.mississippi.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Mississippi Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.mississippi.gov/rehab](https://dhhs.mississippi.gov/rehab)
- **Domain:** `dhhs.mississippi.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Mississippi Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Mississippi Secretary of State Business Registry
- **Source URL:** [https://www.mississippi.gov/business](https://www.mississippi.gov/business)
- **Domain:** `mississippi.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Mississippi.
- **Last Checked:** 2026-06-13

