# State Source Targets: Maine (ME)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Maine with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Maine County Metadata** | A. State identity and geography / County List | [maine.gov](https://www.maine.gov) | `static_fetch` | `counties` |
| **Maine Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.maine.gov](https://dhhs.maine.gov) | `playwright` | `county_offices` |
| **Maine Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.maine.gov](https://dhhs.maine.gov/dd) | `playwright` | `state_resource_agencies` |
| **Maine HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.maine.gov](https://dhhs.maine.gov/dd/waivers) | `static_fetch` | `programs` |
| **Maine Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.maine.gov](https://dhhs.maine.gov/earlyintervention) | `static_fetch` | `programs` |
| **Maine Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.maine.gov](https://education.maine.gov) | `static_fetch` | `programs` |
| **Maine Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.maine.gov](https://education.maine.gov/regional) | `playwright` | `regional_education_agencies` |
| **Maine Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Maine** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcmaine.org](https://www.thearcmaine.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Maine Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.maine.gov](https://dhhs.maine.gov/forms) | `pdf_extract` | `forms` |
| **Maine Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.maine.gov](https://dhhs.maine.gov/rehab) | `static_fetch` | `programs` |
| **Maine Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Maine Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [maine.gov](https://www.maine.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Maine County Metadata
- **Source URL:** [https://www.maine.gov](https://www.maine.gov)
- **Domain:** `maine.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Maine Medicaid Portal
- **Source URL:** [https://dhhs.maine.gov](https://dhhs.maine.gov)
- **Domain:** `dhhs.maine.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Maine Developmental Services Directory
- **Source URL:** [https://dhhs.maine.gov/dd](https://dhhs.maine.gov/dd)
- **Domain:** `dhhs.maine.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Maine HCBS Waivers Page
- **Source URL:** [https://dhhs.maine.gov/dd/waivers](https://dhhs.maine.gov/dd/waivers)
- **Domain:** `dhhs.maine.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Maine Early Intervention / Part C
- **Source URL:** [https://dhhs.maine.gov/earlyintervention](https://dhhs.maine.gov/earlyintervention)
- **Domain:** `dhhs.maine.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Maine Department of Education Special Ed
- **Source URL:** [https://education.maine.gov](https://education.maine.gov)
- **Domain:** `education.maine.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Maine Regional Special Education Support
- **Source URL:** [https://education.maine.gov/regional](https://education.maine.gov/regional)
- **Domain:** `education.maine.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Maine Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Maine
- **Source URL:** [https://www.thearcmaine.org](https://www.thearcmaine.org)
- **Domain:** `thearcmaine.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
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
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Maine Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.maine.gov/forms](https://dhhs.maine.gov/forms)
- **Domain:** `dhhs.maine.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Maine Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.maine.gov/rehab](https://dhhs.maine.gov/rehab)
- **Domain:** `dhhs.maine.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Maine Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Maine Secretary of State Business Registry
- **Source URL:** [https://www.maine.gov/business](https://www.maine.gov/business)
- **Domain:** `maine.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Maine.
- **Last Checked:** 2026-06-13

