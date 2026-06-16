# State Source Targets: Nevada (NV)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Nevada with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Nevada County Metadata** | A. State identity and geography / County List | [nevada.gov](https://www.nevada.gov) | `static_fetch` | `counties` |
| **Nevada Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.nevada.gov](https://dhhs.nevada.gov) | `playwright` | `county_offices` |
| **Nevada Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.nevada.gov](https://dhhs.nevada.gov/dd) | `playwright` | `state_resource_agencies` |
| **Nevada HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.nevada.gov](https://dhhs.nevada.gov/dd/waivers) | `static_fetch` | `programs` |
| **Nevada Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.nevada.gov](https://dhhs.nevada.gov/earlyintervention) | `static_fetch` | `programs` |
| **Nevada Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.nevada.gov](https://education.nevada.gov) | `static_fetch` | `programs` |
| **Nevada Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.nevada.gov](https://education.nevada.gov/regional) | `playwright` | `regional_education_agencies` |
| **Nevada Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Nevada** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcnevada.org](https://www.thearcnevada.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Nevada Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.nevada.gov](https://dhhs.nevada.gov/forms) | `pdf_extract` | `forms` |
| **Nevada Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.nevada.gov](https://dhhs.nevada.gov/rehab) | `static_fetch` | `programs` |
| **Nevada Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Nevada Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [nevada.gov](https://www.nevada.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Nevada County Metadata
- **Source URL:** [https://www.nevada.gov](https://www.nevada.gov)
- **Domain:** `nevada.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Nevada Medicaid Portal
- **Source URL:** [https://dhhs.nevada.gov](https://dhhs.nevada.gov)
- **Domain:** `dhhs.nevada.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Nevada Developmental Services Directory
- **Source URL:** [https://dhhs.nevada.gov/dd](https://dhhs.nevada.gov/dd)
- **Domain:** `dhhs.nevada.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Nevada HCBS Waivers Page
- **Source URL:** [https://dhhs.nevada.gov/dd/waivers](https://dhhs.nevada.gov/dd/waivers)
- **Domain:** `dhhs.nevada.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Nevada Early Intervention / Part C
- **Source URL:** [https://dhhs.nevada.gov/earlyintervention](https://dhhs.nevada.gov/earlyintervention)
- **Domain:** `dhhs.nevada.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Nevada Department of Education Special Ed
- **Source URL:** [https://education.nevada.gov](https://education.nevada.gov)
- **Domain:** `education.nevada.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Nevada Regional Special Education Support
- **Source URL:** [https://education.nevada.gov/regional](https://education.nevada.gov/regional)
- **Domain:** `education.nevada.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Nevada Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Nevada
- **Source URL:** [https://www.thearcnevada.org](https://www.thearcnevada.org)
- **Domain:** `thearcnevada.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
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
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Nevada Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.nevada.gov/forms](https://dhhs.nevada.gov/forms)
- **Domain:** `dhhs.nevada.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Nevada Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.nevada.gov/rehab](https://dhhs.nevada.gov/rehab)
- **Domain:** `dhhs.nevada.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Nevada Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Nevada Secretary of State Business Registry
- **Source URL:** [https://www.nevada.gov/business](https://www.nevada.gov/business)
- **Domain:** `nevada.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nevada.
- **Last Checked:** 2026-06-13

