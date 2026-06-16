# State Source Targets: Wyoming (WY)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Wyoming with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Wyoming County Metadata** | A. State identity and geography / County List | [wyoming.gov](https://www.wyoming.gov) | `static_fetch` | `counties` |
| **Wyoming Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.wyoming.gov](https://dhhs.wyoming.gov) | `playwright` | `county_offices` |
| **Wyoming Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.wyoming.gov](https://dhhs.wyoming.gov/dd) | `playwright` | `state_resource_agencies` |
| **Wyoming HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.wyoming.gov](https://dhhs.wyoming.gov/dd/waivers) | `static_fetch` | `programs` |
| **Wyoming Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.wyoming.gov](https://dhhs.wyoming.gov/earlyintervention) | `static_fetch` | `programs` |
| **Wyoming Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.wyoming.gov](https://education.wyoming.gov) | `static_fetch` | `programs` |
| **Wyoming Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.wyoming.gov](https://education.wyoming.gov/regional) | `playwright` | `regional_education_agencies` |
| **Wyoming Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Wyoming** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcwyoming.org](https://www.thearcwyoming.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Wyoming Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.wyoming.gov](https://dhhs.wyoming.gov/forms) | `pdf_extract` | `forms` |
| **Wyoming Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.wyoming.gov](https://dhhs.wyoming.gov/rehab) | `static_fetch` | `programs` |
| **Wyoming Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Wyoming Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [wyoming.gov](https://www.wyoming.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Wyoming County Metadata
- **Source URL:** [https://www.wyoming.gov](https://www.wyoming.gov)
- **Domain:** `wyoming.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Wyoming Medicaid Portal
- **Source URL:** [https://dhhs.wyoming.gov](https://dhhs.wyoming.gov)
- **Domain:** `dhhs.wyoming.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Wyoming Developmental Services Directory
- **Source URL:** [https://dhhs.wyoming.gov/dd](https://dhhs.wyoming.gov/dd)
- **Domain:** `dhhs.wyoming.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Wyoming HCBS Waivers Page
- **Source URL:** [https://dhhs.wyoming.gov/dd/waivers](https://dhhs.wyoming.gov/dd/waivers)
- **Domain:** `dhhs.wyoming.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Wyoming Early Intervention / Part C
- **Source URL:** [https://dhhs.wyoming.gov/earlyintervention](https://dhhs.wyoming.gov/earlyintervention)
- **Domain:** `dhhs.wyoming.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Wyoming Department of Education Special Ed
- **Source URL:** [https://education.wyoming.gov](https://education.wyoming.gov)
- **Domain:** `education.wyoming.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Wyoming Regional Special Education Support
- **Source URL:** [https://education.wyoming.gov/regional](https://education.wyoming.gov/regional)
- **Domain:** `education.wyoming.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Wyoming Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Wyoming
- **Source URL:** [https://www.thearcwyoming.org](https://www.thearcwyoming.org)
- **Domain:** `thearcwyoming.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
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
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Wyoming Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.wyoming.gov/forms](https://dhhs.wyoming.gov/forms)
- **Domain:** `dhhs.wyoming.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Wyoming Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.wyoming.gov/rehab](https://dhhs.wyoming.gov/rehab)
- **Domain:** `dhhs.wyoming.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Wyoming Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Wyoming Secretary of State Business Registry
- **Source URL:** [https://www.wyoming.gov/business](https://www.wyoming.gov/business)
- **Domain:** `wyoming.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Wyoming.
- **Last Checked:** 2026-06-13

