# State Source Targets: Nebraska (NE)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Nebraska with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Nebraska County Metadata** | A. State identity and geography / County List | [nebraska.gov](https://www.nebraska.gov) | `static_fetch` | `counties` |
| **Nebraska Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.nebraska.gov](https://dhhs.nebraska.gov) | `playwright` | `county_offices` |
| **Nebraska Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.nebraska.gov](https://dhhs.nebraska.gov/dd) | `playwright` | `state_resource_agencies` |
| **Nebraska HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.nebraska.gov](https://dhhs.nebraska.gov/dd/waivers) | `static_fetch` | `programs` |
| **Nebraska Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.nebraska.gov](https://dhhs.nebraska.gov/earlyintervention) | `static_fetch` | `programs` |
| **Nebraska Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.nebraska.gov](https://education.nebraska.gov) | `static_fetch` | `programs` |
| **Nebraska Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.nebraska.gov](https://education.nebraska.gov/regional) | `playwright` | `regional_education_agencies` |
| **Nebraska Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Nebraska** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcnebraska.org](https://www.thearcnebraska.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Nebraska Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.nebraska.gov](https://dhhs.nebraska.gov/forms) | `pdf_extract` | `forms` |
| **Nebraska Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.nebraska.gov](https://dhhs.nebraska.gov/rehab) | `static_fetch` | `programs` |
| **Nebraska Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Nebraska Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [nebraska.gov](https://www.nebraska.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Nebraska County Metadata
- **Source URL:** [https://www.nebraska.gov](https://www.nebraska.gov)
- **Domain:** `nebraska.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Nebraska Medicaid Portal
- **Source URL:** [https://dhhs.nebraska.gov](https://dhhs.nebraska.gov)
- **Domain:** `dhhs.nebraska.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Nebraska Developmental Services Directory
- **Source URL:** [https://dhhs.nebraska.gov/dd](https://dhhs.nebraska.gov/dd)
- **Domain:** `dhhs.nebraska.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Nebraska HCBS Waivers Page
- **Source URL:** [https://dhhs.nebraska.gov/dd/waivers](https://dhhs.nebraska.gov/dd/waivers)
- **Domain:** `dhhs.nebraska.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Nebraska Early Intervention / Part C
- **Source URL:** [https://dhhs.nebraska.gov/earlyintervention](https://dhhs.nebraska.gov/earlyintervention)
- **Domain:** `dhhs.nebraska.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Nebraska Department of Education Special Ed
- **Source URL:** [https://education.nebraska.gov](https://education.nebraska.gov)
- **Domain:** `education.nebraska.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Nebraska Regional Special Education Support
- **Source URL:** [https://education.nebraska.gov/regional](https://education.nebraska.gov/regional)
- **Domain:** `education.nebraska.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Nebraska Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Nebraska
- **Source URL:** [https://www.thearcnebraska.org](https://www.thearcnebraska.org)
- **Domain:** `thearcnebraska.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
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
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Nebraska Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.nebraska.gov/forms](https://dhhs.nebraska.gov/forms)
- **Domain:** `dhhs.nebraska.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Nebraska Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.nebraska.gov/rehab](https://dhhs.nebraska.gov/rehab)
- **Domain:** `dhhs.nebraska.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Nebraska Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Nebraska Secretary of State Business Registry
- **Source URL:** [https://www.nebraska.gov/business](https://www.nebraska.gov/business)
- **Domain:** `nebraska.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Nebraska.
- **Last Checked:** 2026-06-13

