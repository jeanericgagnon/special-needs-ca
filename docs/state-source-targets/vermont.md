# State Source Targets: Vermont (VT)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Vermont with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Vermont County Metadata** | A. State identity and geography / County List | [vermont.gov](https://www.vermont.gov) | `static_fetch` | `counties` |
| **Vermont Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.vermont.gov](https://dhhs.vermont.gov) | `playwright` | `county_offices` |
| **Vermont Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.vermont.gov](https://dhhs.vermont.gov/dd) | `playwright` | `state_resource_agencies` |
| **Vermont HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.vermont.gov](https://dhhs.vermont.gov/dd/waivers) | `static_fetch` | `programs` |
| **Vermont Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.vermont.gov](https://dhhs.vermont.gov/earlyintervention) | `static_fetch` | `programs` |
| **Vermont Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.vermont.gov](https://education.vermont.gov) | `static_fetch` | `programs` |
| **Vermont Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.vermont.gov](https://education.vermont.gov/regional) | `playwright` | `regional_education_agencies` |
| **Vermont Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Vermont** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcvermont.org](https://www.thearcvermont.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Vermont Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.vermont.gov](https://dhhs.vermont.gov/forms) | `pdf_extract` | `forms` |
| **Vermont Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.vermont.gov](https://dhhs.vermont.gov/rehab) | `static_fetch` | `programs` |
| **Vermont Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Vermont Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [vermont.gov](https://www.vermont.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Vermont County Metadata
- **Source URL:** [https://www.vermont.gov](https://www.vermont.gov)
- **Domain:** `vermont.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Vermont Medicaid Portal
- **Source URL:** [https://dhhs.vermont.gov](https://dhhs.vermont.gov)
- **Domain:** `dhhs.vermont.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Vermont Developmental Services Directory
- **Source URL:** [https://dhhs.vermont.gov/dd](https://dhhs.vermont.gov/dd)
- **Domain:** `dhhs.vermont.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Vermont HCBS Waivers Page
- **Source URL:** [https://dhhs.vermont.gov/dd/waivers](https://dhhs.vermont.gov/dd/waivers)
- **Domain:** `dhhs.vermont.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Vermont Early Intervention / Part C
- **Source URL:** [https://dhhs.vermont.gov/earlyintervention](https://dhhs.vermont.gov/earlyintervention)
- **Domain:** `dhhs.vermont.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Vermont Department of Education Special Ed
- **Source URL:** [https://education.vermont.gov](https://education.vermont.gov)
- **Domain:** `education.vermont.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Vermont Regional Special Education Support
- **Source URL:** [https://education.vermont.gov/regional](https://education.vermont.gov/regional)
- **Domain:** `education.vermont.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Vermont Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Vermont
- **Source URL:** [https://www.thearcvermont.org](https://www.thearcvermont.org)
- **Domain:** `thearcvermont.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
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
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Vermont Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.vermont.gov/forms](https://dhhs.vermont.gov/forms)
- **Domain:** `dhhs.vermont.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Vermont Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.vermont.gov/rehab](https://dhhs.vermont.gov/rehab)
- **Domain:** `dhhs.vermont.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Vermont Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Vermont Secretary of State Business Registry
- **Source URL:** [https://www.vermont.gov/business](https://www.vermont.gov/business)
- **Domain:** `vermont.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Vermont.
- **Last Checked:** 2026-06-13

