# State Source Targets: North Carolina (NC)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in North Carolina with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 2.

## 1. Domain Crawler Targets (Wave 2)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **North Carolina County Metadata** | A. State identity and geography / County List | [north-carolina.gov](https://www.north-carolina.gov) | `static_fetch` | `counties` |
| **North Carolina Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.north-carolina.gov](https://dhhs.north-carolina.gov) | `playwright` | `county_offices` |
| **North Carolina Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.north-carolina.gov](https://dhhs.north-carolina.gov/dd) | `playwright` | `state_resource_agencies` |
| **North Carolina HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.north-carolina.gov](https://dhhs.north-carolina.gov/dd/waivers) | `static_fetch` | `programs` |
| **North Carolina Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.north-carolina.gov](https://dhhs.north-carolina.gov/earlyintervention) | `static_fetch` | `programs` |
| **North Carolina Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.north-carolina.gov](https://education.north-carolina.gov) | `static_fetch` | `programs` |
| **North Carolina Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.north-carolina.gov](https://education.north-carolina.gov/regional) | `playwright` | `regional_education_agencies` |
| **North Carolina Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of North Carolina** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcnorth-carolina.org](https://www.thearcnorth-carolina.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **North Carolina Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.north-carolina.gov](https://dhhs.north-carolina.gov/forms) | `pdf_extract` | `forms` |
| **North Carolina Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.north-carolina.gov](https://dhhs.north-carolina.gov/rehab) | `static_fetch` | `programs` |
| **North Carolina Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **North Carolina Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [north-carolina.gov](https://www.north-carolina.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** North Carolina County Metadata
- **Source URL:** [https://www.north-carolina.gov](https://www.north-carolina.gov)
- **Domain:** `north-carolina.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** North Carolina Medicaid Portal
- **Source URL:** [https://dhhs.north-carolina.gov](https://dhhs.north-carolina.gov)
- **Domain:** `dhhs.north-carolina.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** North Carolina Developmental Services Directory
- **Source URL:** [https://dhhs.north-carolina.gov/dd](https://dhhs.north-carolina.gov/dd)
- **Domain:** `dhhs.north-carolina.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** North Carolina HCBS Waivers Page
- **Source URL:** [https://dhhs.north-carolina.gov/dd/waivers](https://dhhs.north-carolina.gov/dd/waivers)
- **Domain:** `dhhs.north-carolina.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** North Carolina Early Intervention / Part C
- **Source URL:** [https://dhhs.north-carolina.gov/earlyintervention](https://dhhs.north-carolina.gov/earlyintervention)
- **Domain:** `dhhs.north-carolina.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** North Carolina Department of Education Special Ed
- **Source URL:** [https://education.north-carolina.gov](https://education.north-carolina.gov)
- **Domain:** `education.north-carolina.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** North Carolina Regional Special Education Support
- **Source URL:** [https://education.north-carolina.gov/regional](https://education.north-carolina.gov/regional)
- **Domain:** `education.north-carolina.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** North Carolina Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of North Carolina
- **Source URL:** [https://www.thearcnorth-carolina.org](https://www.thearcnorth-carolina.org)
- **Domain:** `thearcnorth-carolina.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
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
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** North Carolina Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.north-carolina.gov/forms](https://dhhs.north-carolina.gov/forms)
- **Domain:** `dhhs.north-carolina.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** North Carolina Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.north-carolina.gov/rehab](https://dhhs.north-carolina.gov/rehab)
- **Domain:** `dhhs.north-carolina.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** North Carolina Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** North Carolina Secretary of State Business Registry
- **Source URL:** [https://www.north-carolina.gov/business](https://www.north-carolina.gov/business)
- **Domain:** `north-carolina.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for North Carolina.
- **Last Checked:** 2026-06-13

