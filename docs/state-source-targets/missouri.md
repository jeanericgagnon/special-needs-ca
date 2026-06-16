# State Source Targets: Missouri (MO)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Missouri with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Missouri County Metadata** | A. State identity and geography / County List | [missouri.gov](https://www.missouri.gov) | `static_fetch` | `counties` |
| **Missouri Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.missouri.gov](https://dhhs.missouri.gov) | `playwright` | `county_offices` |
| **Missouri Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.missouri.gov](https://dhhs.missouri.gov/dd) | `playwright` | `state_resource_agencies` |
| **Missouri HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.missouri.gov](https://dhhs.missouri.gov/dd/waivers) | `static_fetch` | `programs` |
| **Missouri Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.missouri.gov](https://dhhs.missouri.gov/earlyintervention) | `static_fetch` | `programs` |
| **Missouri Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.missouri.gov](https://education.missouri.gov) | `static_fetch` | `programs` |
| **Missouri Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.missouri.gov](https://education.missouri.gov/regional) | `playwright` | `regional_education_agencies` |
| **Missouri Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Missouri** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcmissouri.org](https://www.thearcmissouri.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Missouri Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.missouri.gov](https://dhhs.missouri.gov/forms) | `pdf_extract` | `forms` |
| **Missouri Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.missouri.gov](https://dhhs.missouri.gov/rehab) | `static_fetch` | `programs` |
| **Missouri Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Missouri Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [missouri.gov](https://www.missouri.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Missouri County Metadata
- **Source URL:** [https://www.missouri.gov](https://www.missouri.gov)
- **Domain:** `missouri.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Missouri Medicaid Portal
- **Source URL:** [https://dhhs.missouri.gov](https://dhhs.missouri.gov)
- **Domain:** `dhhs.missouri.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Missouri Developmental Services Directory
- **Source URL:** [https://dhhs.missouri.gov/dd](https://dhhs.missouri.gov/dd)
- **Domain:** `dhhs.missouri.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Missouri HCBS Waivers Page
- **Source URL:** [https://dhhs.missouri.gov/dd/waivers](https://dhhs.missouri.gov/dd/waivers)
- **Domain:** `dhhs.missouri.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Missouri Early Intervention / Part C
- **Source URL:** [https://dhhs.missouri.gov/earlyintervention](https://dhhs.missouri.gov/earlyintervention)
- **Domain:** `dhhs.missouri.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Missouri Department of Education Special Ed
- **Source URL:** [https://education.missouri.gov](https://education.missouri.gov)
- **Domain:** `education.missouri.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Missouri Regional Special Education Support
- **Source URL:** [https://education.missouri.gov/regional](https://education.missouri.gov/regional)
- **Domain:** `education.missouri.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Missouri Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Missouri
- **Source URL:** [https://www.thearcmissouri.org](https://www.thearcmissouri.org)
- **Domain:** `thearcmissouri.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
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
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Missouri Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.missouri.gov/forms](https://dhhs.missouri.gov/forms)
- **Domain:** `dhhs.missouri.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Missouri Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.missouri.gov/rehab](https://dhhs.missouri.gov/rehab)
- **Domain:** `dhhs.missouri.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Missouri Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Missouri Secretary of State Business Registry
- **Source URL:** [https://www.missouri.gov/business](https://www.missouri.gov/business)
- **Domain:** `missouri.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Missouri.
- **Last Checked:** 2026-06-13

