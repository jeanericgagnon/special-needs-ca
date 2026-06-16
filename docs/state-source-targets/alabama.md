# State Source Targets: Alabama (AL)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Alabama with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Alabama County Metadata** | A. State identity and geography / County List | [alabama.gov](https://www.alabama.gov) | `static_fetch` | `counties` |
| **Alabama Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [medicaid.alabama.gov](https://medicaid.alabama.gov) | `playwright` | `county_offices` |
| **Alabama Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [mh.alabama.gov](https://mh.alabama.gov) | `playwright` | `state_resource_agencies` |
| **Alabama HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [mh.alabama.gov](https://mh.alabama.gov/waivers) | `static_fetch` | `programs` |
| **Alabama Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [rehab.alabama.gov](https://www.rehab.alabama.gov/services/ei) | `static_fetch` | `programs` |
| **Alabama Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [alabama-education.gov](https://www.alabama-education.gov) | `static_fetch` | `programs` |
| **Alabama Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [alabama-education.gov](https://www.alabama-education.gov/regional) | `playwright` | `regional_education_agencies` |
| **Alabama Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [apnsof.org](https://www.apnsof.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Alabama** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcal.org](https://www.thearcal.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Alabama Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [medicaid.alabama.gov](https://medicaid.alabama.gov/forms) | `pdf_extract` | `forms` |
| **Alabama Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [medicaid.alabama.gov](https://medicaid.alabama.gov/rehab) | `static_fetch` | `programs` |
| **Alabama Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrensal.org](https://www.childrensal.org) | `manual_review` | `resource_providers` |
| **Alabama Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [alabama.gov](https://www.alabama.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Alabama County Metadata
- **Source URL:** [https://www.alabama.gov](https://www.alabama.gov)
- **Domain:** `alabama.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Alabama Medicaid Portal
- **Source URL:** [https://medicaid.alabama.gov](https://medicaid.alabama.gov)
- **Domain:** `medicaid.alabama.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Alabama Developmental Services Directory
- **Source URL:** [https://mh.alabama.gov](https://mh.alabama.gov)
- **Domain:** `mh.alabama.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Alabama HCBS Waivers Page
- **Source URL:** [https://mh.alabama.gov/waivers](https://mh.alabama.gov/waivers)
- **Domain:** `mh.alabama.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Alabama Early Intervention / Part C
- **Source URL:** [https://www.rehab.alabama.gov/services/ei](https://www.rehab.alabama.gov/services/ei)
- **Domain:** `rehab.alabama.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Alabama Department of Education Special Ed
- **Source URL:** [https://www.alabama-education.gov](https://www.alabama-education.gov)
- **Domain:** `alabama-education.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Alabama Regional Special Education Support
- **Source URL:** [https://www.alabama-education.gov/regional](https://www.alabama-education.gov/regional)
- **Domain:** `alabama-education.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Alabama Parent Training Center
- **Source URL:** [https://www.apnsof.org](https://www.apnsof.org)
- **Domain:** `apnsof.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Alabama
- **Source URL:** [https://www.thearcal.org](https://www.thearcal.org)
- **Domain:** `thearcal.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
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
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Alabama Medicaid & Special Education Forms
- **Source URL:** [https://medicaid.alabama.gov/forms](https://medicaid.alabama.gov/forms)
- **Domain:** `medicaid.alabama.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Alabama Vocational Rehabilitation Services
- **Source URL:** [https://medicaid.alabama.gov/rehab](https://medicaid.alabama.gov/rehab)
- **Domain:** `medicaid.alabama.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Alabama Children's Hospital Clinics
- **Source URL:** [https://www.childrensal.org](https://www.childrensal.org)
- **Domain:** `childrensal.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Alabama Secretary of State Business Registry
- **Source URL:** [https://www.alabama.gov/business](https://www.alabama.gov/business)
- **Domain:** `alabama.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Alabama.
- **Last Checked:** 2026-06-13

