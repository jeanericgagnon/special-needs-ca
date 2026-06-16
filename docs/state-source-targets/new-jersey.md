# State Source Targets: New Jersey (NJ)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in New Jersey with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 2.

## 1. Domain Crawler Targets (Wave 2)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **New Jersey County Metadata** | A. State identity and geography / County List | [new-jersey.gov](https://www.new-jersey.gov) | `static_fetch` | `counties` |
| **New Jersey Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.new-jersey.gov](https://dhhs.new-jersey.gov) | `playwright` | `county_offices` |
| **New Jersey Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.new-jersey.gov](https://dhhs.new-jersey.gov/dd) | `playwright` | `state_resource_agencies` |
| **New Jersey HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.new-jersey.gov](https://dhhs.new-jersey.gov/dd/waivers) | `static_fetch` | `programs` |
| **New Jersey Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.new-jersey.gov](https://dhhs.new-jersey.gov/earlyintervention) | `static_fetch` | `programs` |
| **New Jersey Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.new-jersey.gov](https://education.new-jersey.gov) | `static_fetch` | `programs` |
| **New Jersey Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.new-jersey.gov](https://education.new-jersey.gov/regional) | `playwright` | `regional_education_agencies` |
| **New Jersey Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of New Jersey** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcnew-jersey.org](https://www.thearcnew-jersey.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **New Jersey Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.new-jersey.gov](https://dhhs.new-jersey.gov/forms) | `pdf_extract` | `forms` |
| **New Jersey Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.new-jersey.gov](https://dhhs.new-jersey.gov/rehab) | `static_fetch` | `programs` |
| **New Jersey Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **New Jersey Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [new-jersey.gov](https://www.new-jersey.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** New Jersey County Metadata
- **Source URL:** [https://www.new-jersey.gov](https://www.new-jersey.gov)
- **Domain:** `new-jersey.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** New Jersey Medicaid Portal
- **Source URL:** [https://dhhs.new-jersey.gov](https://dhhs.new-jersey.gov)
- **Domain:** `dhhs.new-jersey.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** New Jersey Developmental Services Directory
- **Source URL:** [https://dhhs.new-jersey.gov/dd](https://dhhs.new-jersey.gov/dd)
- **Domain:** `dhhs.new-jersey.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** New Jersey HCBS Waivers Page
- **Source URL:** [https://dhhs.new-jersey.gov/dd/waivers](https://dhhs.new-jersey.gov/dd/waivers)
- **Domain:** `dhhs.new-jersey.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** New Jersey Early Intervention / Part C
- **Source URL:** [https://dhhs.new-jersey.gov/earlyintervention](https://dhhs.new-jersey.gov/earlyintervention)
- **Domain:** `dhhs.new-jersey.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** New Jersey Department of Education Special Ed
- **Source URL:** [https://education.new-jersey.gov](https://education.new-jersey.gov)
- **Domain:** `education.new-jersey.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** New Jersey Regional Special Education Support
- **Source URL:** [https://education.new-jersey.gov/regional](https://education.new-jersey.gov/regional)
- **Domain:** `education.new-jersey.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** New Jersey Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of New Jersey
- **Source URL:** [https://www.thearcnew-jersey.org](https://www.thearcnew-jersey.org)
- **Domain:** `thearcnew-jersey.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
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
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** New Jersey Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.new-jersey.gov/forms](https://dhhs.new-jersey.gov/forms)
- **Domain:** `dhhs.new-jersey.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** New Jersey Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.new-jersey.gov/rehab](https://dhhs.new-jersey.gov/rehab)
- **Domain:** `dhhs.new-jersey.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** New Jersey Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** New Jersey Secretary of State Business Registry
- **Source URL:** [https://www.new-jersey.gov/business](https://www.new-jersey.gov/business)
- **Domain:** `new-jersey.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for New Jersey.
- **Last Checked:** 2026-06-13

