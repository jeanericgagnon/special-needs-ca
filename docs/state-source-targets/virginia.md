# State Source Targets: Virginia (VA)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Virginia with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 2.

## 1. Domain Crawler Targets (Wave 2)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Virginia County Metadata** | A. State identity and geography / County List | [virginia.gov](https://www.virginia.gov) | `static_fetch` | `counties` |
| **Virginia Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.virginia.gov](https://dhhs.virginia.gov) | `playwright` | `county_offices` |
| **Virginia Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.virginia.gov](https://dhhs.virginia.gov/dd) | `playwright` | `state_resource_agencies` |
| **Virginia HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.virginia.gov](https://dhhs.virginia.gov/dd/waivers) | `static_fetch` | `programs` |
| **Virginia Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.virginia.gov](https://dhhs.virginia.gov/earlyintervention) | `static_fetch` | `programs` |
| **Virginia Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.virginia.gov](https://education.virginia.gov) | `static_fetch` | `programs` |
| **Virginia Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.virginia.gov](https://education.virginia.gov/regional) | `playwright` | `regional_education_agencies` |
| **Virginia Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Virginia** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcvirginia.org](https://www.thearcvirginia.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Virginia Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.virginia.gov](https://dhhs.virginia.gov/forms) | `pdf_extract` | `forms` |
| **Virginia Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.virginia.gov](https://dhhs.virginia.gov/rehab) | `static_fetch` | `programs` |
| **Virginia Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Virginia Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [virginia.gov](https://www.virginia.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Virginia County Metadata
- **Source URL:** [https://www.virginia.gov](https://www.virginia.gov)
- **Domain:** `virginia.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Virginia Medicaid Portal
- **Source URL:** [https://dhhs.virginia.gov](https://dhhs.virginia.gov)
- **Domain:** `dhhs.virginia.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Virginia Developmental Services Directory
- **Source URL:** [https://dhhs.virginia.gov/dd](https://dhhs.virginia.gov/dd)
- **Domain:** `dhhs.virginia.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Virginia HCBS Waivers Page
- **Source URL:** [https://dhhs.virginia.gov/dd/waivers](https://dhhs.virginia.gov/dd/waivers)
- **Domain:** `dhhs.virginia.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Virginia Early Intervention / Part C
- **Source URL:** [https://dhhs.virginia.gov/earlyintervention](https://dhhs.virginia.gov/earlyintervention)
- **Domain:** `dhhs.virginia.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Virginia Department of Education Special Ed
- **Source URL:** [https://education.virginia.gov](https://education.virginia.gov)
- **Domain:** `education.virginia.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Virginia Regional Special Education Support
- **Source URL:** [https://education.virginia.gov/regional](https://education.virginia.gov/regional)
- **Domain:** `education.virginia.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Virginia Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Virginia
- **Source URL:** [https://www.thearcvirginia.org](https://www.thearcvirginia.org)
- **Domain:** `thearcvirginia.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
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
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Virginia Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.virginia.gov/forms](https://dhhs.virginia.gov/forms)
- **Domain:** `dhhs.virginia.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Virginia Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.virginia.gov/rehab](https://dhhs.virginia.gov/rehab)
- **Domain:** `dhhs.virginia.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Virginia Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Virginia Secretary of State Business Registry
- **Source URL:** [https://www.virginia.gov/business](https://www.virginia.gov/business)
- **Domain:** `virginia.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Virginia.
- **Last Checked:** 2026-06-13

