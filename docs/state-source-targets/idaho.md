# State Source Targets: Idaho (ID)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Idaho with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Idaho County Metadata** | A. State identity and geography / County List | [idaho.gov](https://www.idaho.gov) | `static_fetch` | `counties` |
| **Idaho Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.idaho.gov](https://dhhs.idaho.gov) | `playwright` | `county_offices` |
| **Idaho Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.idaho.gov](https://dhhs.idaho.gov/dd) | `playwright` | `state_resource_agencies` |
| **Idaho HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.idaho.gov](https://dhhs.idaho.gov/dd/waivers) | `static_fetch` | `programs` |
| **Idaho Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.idaho.gov](https://dhhs.idaho.gov/earlyintervention) | `static_fetch` | `programs` |
| **Idaho Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.idaho.gov](https://education.idaho.gov) | `static_fetch` | `programs` |
| **Idaho Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.idaho.gov](https://education.idaho.gov/regional) | `playwright` | `regional_education_agencies` |
| **Idaho Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Idaho** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcidaho.org](https://www.thearcidaho.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Idaho Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.idaho.gov](https://dhhs.idaho.gov/forms) | `pdf_extract` | `forms` |
| **Idaho Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.idaho.gov](https://dhhs.idaho.gov/rehab) | `static_fetch` | `programs` |
| **Idaho Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Idaho Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [idaho.gov](https://www.idaho.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Idaho County Metadata
- **Source URL:** [https://www.idaho.gov](https://www.idaho.gov)
- **Domain:** `idaho.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Idaho Medicaid Portal
- **Source URL:** [https://dhhs.idaho.gov](https://dhhs.idaho.gov)
- **Domain:** `dhhs.idaho.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Idaho Developmental Services Directory
- **Source URL:** [https://dhhs.idaho.gov/dd](https://dhhs.idaho.gov/dd)
- **Domain:** `dhhs.idaho.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Idaho HCBS Waivers Page
- **Source URL:** [https://dhhs.idaho.gov/dd/waivers](https://dhhs.idaho.gov/dd/waivers)
- **Domain:** `dhhs.idaho.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Idaho Early Intervention / Part C
- **Source URL:** [https://dhhs.idaho.gov/earlyintervention](https://dhhs.idaho.gov/earlyintervention)
- **Domain:** `dhhs.idaho.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Idaho Department of Education Special Ed
- **Source URL:** [https://education.idaho.gov](https://education.idaho.gov)
- **Domain:** `education.idaho.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Idaho Regional Special Education Support
- **Source URL:** [https://education.idaho.gov/regional](https://education.idaho.gov/regional)
- **Domain:** `education.idaho.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Idaho Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Idaho
- **Source URL:** [https://www.thearcidaho.org](https://www.thearcidaho.org)
- **Domain:** `thearcidaho.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
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
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Idaho Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.idaho.gov/forms](https://dhhs.idaho.gov/forms)
- **Domain:** `dhhs.idaho.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Idaho Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.idaho.gov/rehab](https://dhhs.idaho.gov/rehab)
- **Domain:** `dhhs.idaho.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Idaho Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Idaho Secretary of State Business Registry
- **Source URL:** [https://www.idaho.gov/business](https://www.idaho.gov/business)
- **Domain:** `idaho.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Idaho.
- **Last Checked:** 2026-06-13

