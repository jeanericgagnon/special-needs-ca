# State Source Targets: Alaska (AK)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Alaska with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Alaska County Metadata** | A. State identity and geography / County List | [alaska.gov](https://www.alaska.gov) | `static_fetch` | `counties` |
| **Alaska Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.alaska.gov](https://dhhs.alaska.gov) | `playwright` | `county_offices` |
| **Alaska Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.alaska.gov](https://dhhs.alaska.gov/dd) | `playwright` | `state_resource_agencies` |
| **Alaska HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.alaska.gov](https://dhhs.alaska.gov/dd/waivers) | `static_fetch` | `programs` |
| **Alaska Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.alaska.gov](https://dhhs.alaska.gov/earlyintervention) | `static_fetch` | `programs` |
| **Alaska Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.alaska.gov](https://education.alaska.gov) | `static_fetch` | `programs` |
| **Alaska Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.alaska.gov](https://education.alaska.gov/regional) | `playwright` | `regional_education_agencies` |
| **Alaska Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Alaska** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcalaska.org](https://www.thearcalaska.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Alaska Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.alaska.gov](https://dhhs.alaska.gov/forms) | `pdf_extract` | `forms` |
| **Alaska Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.alaska.gov](https://dhhs.alaska.gov/rehab) | `static_fetch` | `programs` |
| **Alaska Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Alaska Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [alaska.gov](https://www.alaska.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Alaska County Metadata
- **Source URL:** [https://www.alaska.gov](https://www.alaska.gov)
- **Domain:** `alaska.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Alaska Medicaid Portal
- **Source URL:** [https://dhhs.alaska.gov](https://dhhs.alaska.gov)
- **Domain:** `dhhs.alaska.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Alaska Developmental Services Directory
- **Source URL:** [https://dhhs.alaska.gov/dd](https://dhhs.alaska.gov/dd)
- **Domain:** `dhhs.alaska.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Alaska HCBS Waivers Page
- **Source URL:** [https://dhhs.alaska.gov/dd/waivers](https://dhhs.alaska.gov/dd/waivers)
- **Domain:** `dhhs.alaska.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Alaska Early Intervention / Part C
- **Source URL:** [https://dhhs.alaska.gov/earlyintervention](https://dhhs.alaska.gov/earlyintervention)
- **Domain:** `dhhs.alaska.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Alaska Department of Education Special Ed
- **Source URL:** [https://education.alaska.gov](https://education.alaska.gov)
- **Domain:** `education.alaska.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Alaska Regional Special Education Support
- **Source URL:** [https://education.alaska.gov/regional](https://education.alaska.gov/regional)
- **Domain:** `education.alaska.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Alaska Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Alaska
- **Source URL:** [https://www.thearcalaska.org](https://www.thearcalaska.org)
- **Domain:** `thearcalaska.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
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
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Alaska Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.alaska.gov/forms](https://dhhs.alaska.gov/forms)
- **Domain:** `dhhs.alaska.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Alaska Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.alaska.gov/rehab](https://dhhs.alaska.gov/rehab)
- **Domain:** `dhhs.alaska.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Alaska Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Alaska Secretary of State Business Registry
- **Source URL:** [https://www.alaska.gov/business](https://www.alaska.gov/business)
- **Domain:** `alaska.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alaska.
- **Last Checked:** 2026-06-13

