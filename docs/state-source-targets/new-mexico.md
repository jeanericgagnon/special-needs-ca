# State Source Targets: New Mexico (NM)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in New Mexico with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **New Mexico County Metadata** | A. State identity and geography / County List | [new-mexico.gov](https://www.new-mexico.gov) | `static_fetch` | `counties` |
| **New Mexico Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.new-mexico.gov](https://dhhs.new-mexico.gov) | `playwright` | `county_offices` |
| **New Mexico Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.new-mexico.gov](https://dhhs.new-mexico.gov/dd) | `playwright` | `state_resource_agencies` |
| **New Mexico HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.new-mexico.gov](https://dhhs.new-mexico.gov/dd/waivers) | `static_fetch` | `programs` |
| **New Mexico Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.new-mexico.gov](https://dhhs.new-mexico.gov/earlyintervention) | `static_fetch` | `programs` |
| **New Mexico Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.new-mexico.gov](https://education.new-mexico.gov) | `static_fetch` | `programs` |
| **New Mexico Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.new-mexico.gov](https://education.new-mexico.gov/regional) | `playwright` | `regional_education_agencies` |
| **New Mexico Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of New Mexico** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcnew-mexico.org](https://www.thearcnew-mexico.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **New Mexico Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.new-mexico.gov](https://dhhs.new-mexico.gov/forms) | `pdf_extract` | `forms` |
| **New Mexico Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.new-mexico.gov](https://dhhs.new-mexico.gov/rehab) | `static_fetch` | `programs` |
| **New Mexico Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **New Mexico Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [new-mexico.gov](https://www.new-mexico.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** New Mexico County Metadata
- **Source URL:** [https://www.new-mexico.gov](https://www.new-mexico.gov)
- **Domain:** `new-mexico.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** New Mexico Medicaid Portal
- **Source URL:** [https://dhhs.new-mexico.gov](https://dhhs.new-mexico.gov)
- **Domain:** `dhhs.new-mexico.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** New Mexico Developmental Services Directory
- **Source URL:** [https://dhhs.new-mexico.gov/dd](https://dhhs.new-mexico.gov/dd)
- **Domain:** `dhhs.new-mexico.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** New Mexico HCBS Waivers Page
- **Source URL:** [https://dhhs.new-mexico.gov/dd/waivers](https://dhhs.new-mexico.gov/dd/waivers)
- **Domain:** `dhhs.new-mexico.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** New Mexico Early Intervention / Part C
- **Source URL:** [https://dhhs.new-mexico.gov/earlyintervention](https://dhhs.new-mexico.gov/earlyintervention)
- **Domain:** `dhhs.new-mexico.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** New Mexico Department of Education Special Ed
- **Source URL:** [https://education.new-mexico.gov](https://education.new-mexico.gov)
- **Domain:** `education.new-mexico.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** New Mexico Regional Special Education Support
- **Source URL:** [https://education.new-mexico.gov/regional](https://education.new-mexico.gov/regional)
- **Domain:** `education.new-mexico.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** New Mexico Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of New Mexico
- **Source URL:** [https://www.thearcnew-mexico.org](https://www.thearcnew-mexico.org)
- **Domain:** `thearcnew-mexico.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
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
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** New Mexico Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.new-mexico.gov/forms](https://dhhs.new-mexico.gov/forms)
- **Domain:** `dhhs.new-mexico.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** New Mexico Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.new-mexico.gov/rehab](https://dhhs.new-mexico.gov/rehab)
- **Domain:** `dhhs.new-mexico.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** New Mexico Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** New Mexico Secretary of State Business Registry
- **Source URL:** [https://www.new-mexico.gov/business](https://www.new-mexico.gov/business)
- **Domain:** `new-mexico.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Mexico.
- **Last Checked:** 2026-06-13

