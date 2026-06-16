# State Source Targets: Rhode Island (RI)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Rhode Island with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Rhode Island County Metadata** | A. State identity and geography / County List | [rhode-island.gov](https://www.rhode-island.gov) | `static_fetch` | `counties` |
| **Rhode Island Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.rhode-island.gov](https://dhhs.rhode-island.gov) | `playwright` | `county_offices` |
| **Rhode Island Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.rhode-island.gov](https://dhhs.rhode-island.gov/dd) | `playwright` | `state_resource_agencies` |
| **Rhode Island HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.rhode-island.gov](https://dhhs.rhode-island.gov/dd/waivers) | `static_fetch` | `programs` |
| **Rhode Island Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.rhode-island.gov](https://dhhs.rhode-island.gov/earlyintervention) | `static_fetch` | `programs` |
| **Rhode Island Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.rhode-island.gov](https://education.rhode-island.gov) | `static_fetch` | `programs` |
| **Rhode Island Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.rhode-island.gov](https://education.rhode-island.gov/regional) | `playwright` | `regional_education_agencies` |
| **Rhode Island Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Rhode Island** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcrhode-island.org](https://www.thearcrhode-island.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Rhode Island Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.rhode-island.gov](https://dhhs.rhode-island.gov/forms) | `pdf_extract` | `forms` |
| **Rhode Island Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.rhode-island.gov](https://dhhs.rhode-island.gov/rehab) | `static_fetch` | `programs` |
| **Rhode Island Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Rhode Island Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [rhode-island.gov](https://www.rhode-island.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Rhode Island County Metadata
- **Source URL:** [https://www.rhode-island.gov](https://www.rhode-island.gov)
- **Domain:** `rhode-island.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Rhode Island Medicaid Portal
- **Source URL:** [https://dhhs.rhode-island.gov](https://dhhs.rhode-island.gov)
- **Domain:** `dhhs.rhode-island.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Rhode Island Developmental Services Directory
- **Source URL:** [https://dhhs.rhode-island.gov/dd](https://dhhs.rhode-island.gov/dd)
- **Domain:** `dhhs.rhode-island.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Rhode Island HCBS Waivers Page
- **Source URL:** [https://dhhs.rhode-island.gov/dd/waivers](https://dhhs.rhode-island.gov/dd/waivers)
- **Domain:** `dhhs.rhode-island.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Rhode Island Early Intervention / Part C
- **Source URL:** [https://dhhs.rhode-island.gov/earlyintervention](https://dhhs.rhode-island.gov/earlyintervention)
- **Domain:** `dhhs.rhode-island.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Rhode Island Department of Education Special Ed
- **Source URL:** [https://education.rhode-island.gov](https://education.rhode-island.gov)
- **Domain:** `education.rhode-island.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Rhode Island Regional Special Education Support
- **Source URL:** [https://education.rhode-island.gov/regional](https://education.rhode-island.gov/regional)
- **Domain:** `education.rhode-island.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Rhode Island Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Rhode Island
- **Source URL:** [https://www.thearcrhode-island.org](https://www.thearcrhode-island.org)
- **Domain:** `thearcrhode-island.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
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
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Rhode Island Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.rhode-island.gov/forms](https://dhhs.rhode-island.gov/forms)
- **Domain:** `dhhs.rhode-island.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Rhode Island Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.rhode-island.gov/rehab](https://dhhs.rhode-island.gov/rehab)
- **Domain:** `dhhs.rhode-island.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Rhode Island Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Rhode Island Secretary of State Business Registry
- **Source URL:** [https://www.rhode-island.gov/business](https://www.rhode-island.gov/business)
- **Domain:** `rhode-island.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Rhode Island.
- **Last Checked:** 2026-06-13

