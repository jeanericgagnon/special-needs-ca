# State Source Targets: Wisconsin (WI)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Wisconsin with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Wisconsin County Metadata** | A. State identity and geography / County List | [wisconsin.gov](https://www.wisconsin.gov) | `static_fetch` | `counties` |
| **Wisconsin Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.wisconsin.gov](https://dhhs.wisconsin.gov) | `playwright` | `county_offices` |
| **Wisconsin Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.wisconsin.gov](https://dhhs.wisconsin.gov/dd) | `playwright` | `state_resource_agencies` |
| **Wisconsin HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.wisconsin.gov](https://dhhs.wisconsin.gov/dd/waivers) | `static_fetch` | `programs` |
| **Wisconsin Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.wisconsin.gov](https://dhhs.wisconsin.gov/earlyintervention) | `static_fetch` | `programs` |
| **Wisconsin Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.wisconsin.gov](https://education.wisconsin.gov) | `static_fetch` | `programs` |
| **Wisconsin Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.wisconsin.gov](https://education.wisconsin.gov/regional) | `playwright` | `regional_education_agencies` |
| **Wisconsin Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Wisconsin** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcwisconsin.org](https://www.thearcwisconsin.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Wisconsin Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.wisconsin.gov](https://dhhs.wisconsin.gov/forms) | `pdf_extract` | `forms` |
| **Wisconsin Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.wisconsin.gov](https://dhhs.wisconsin.gov/rehab) | `static_fetch` | `programs` |
| **Wisconsin Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Wisconsin Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [wisconsin.gov](https://www.wisconsin.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Wisconsin County Metadata
- **Source URL:** [https://www.wisconsin.gov](https://www.wisconsin.gov)
- **Domain:** `wisconsin.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Wisconsin Medicaid Portal
- **Source URL:** [https://dhhs.wisconsin.gov](https://dhhs.wisconsin.gov)
- **Domain:** `dhhs.wisconsin.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Wisconsin Developmental Services Directory
- **Source URL:** [https://dhhs.wisconsin.gov/dd](https://dhhs.wisconsin.gov/dd)
- **Domain:** `dhhs.wisconsin.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Wisconsin HCBS Waivers Page
- **Source URL:** [https://dhhs.wisconsin.gov/dd/waivers](https://dhhs.wisconsin.gov/dd/waivers)
- **Domain:** `dhhs.wisconsin.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Wisconsin Early Intervention / Part C
- **Source URL:** [https://dhhs.wisconsin.gov/earlyintervention](https://dhhs.wisconsin.gov/earlyintervention)
- **Domain:** `dhhs.wisconsin.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Wisconsin Department of Education Special Ed
- **Source URL:** [https://education.wisconsin.gov](https://education.wisconsin.gov)
- **Domain:** `education.wisconsin.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Wisconsin Regional Special Education Support
- **Source URL:** [https://education.wisconsin.gov/regional](https://education.wisconsin.gov/regional)
- **Domain:** `education.wisconsin.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Wisconsin Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Wisconsin
- **Source URL:** [https://www.thearcwisconsin.org](https://www.thearcwisconsin.org)
- **Domain:** `thearcwisconsin.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
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
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Wisconsin Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.wisconsin.gov/forms](https://dhhs.wisconsin.gov/forms)
- **Domain:** `dhhs.wisconsin.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Wisconsin Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.wisconsin.gov/rehab](https://dhhs.wisconsin.gov/rehab)
- **Domain:** `dhhs.wisconsin.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Wisconsin Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Wisconsin Secretary of State Business Registry
- **Source URL:** [https://www.wisconsin.gov/business](https://www.wisconsin.gov/business)
- **Domain:** `wisconsin.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wisconsin.
- **Last Checked:** 2026-06-13

