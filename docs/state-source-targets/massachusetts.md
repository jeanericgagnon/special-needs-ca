# State Source Targets: Massachusetts (MA)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Massachusetts with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 2.

## 1. Domain Crawler Targets (Wave 2)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Massachusetts County Metadata** | A. State identity and geography / County List | [massachusetts.gov](https://www.massachusetts.gov) | `static_fetch` | `counties` |
| **Massachusetts Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.massachusetts.gov](https://dhhs.massachusetts.gov) | `playwright` | `county_offices` |
| **Massachusetts Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.massachusetts.gov](https://dhhs.massachusetts.gov/dd) | `playwright` | `state_resource_agencies` |
| **Massachusetts HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.massachusetts.gov](https://dhhs.massachusetts.gov/dd/waivers) | `static_fetch` | `programs` |
| **Massachusetts Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.massachusetts.gov](https://dhhs.massachusetts.gov/earlyintervention) | `static_fetch` | `programs` |
| **Massachusetts Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.massachusetts.gov](https://education.massachusetts.gov) | `static_fetch` | `programs` |
| **Massachusetts Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.massachusetts.gov](https://education.massachusetts.gov/regional) | `playwright` | `regional_education_agencies` |
| **Massachusetts Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Massachusetts** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcmassachusetts.org](https://www.thearcmassachusetts.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Massachusetts Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.massachusetts.gov](https://dhhs.massachusetts.gov/forms) | `pdf_extract` | `forms` |
| **Massachusetts Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.massachusetts.gov](https://dhhs.massachusetts.gov/rehab) | `static_fetch` | `programs` |
| **Massachusetts Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Massachusetts Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [massachusetts.gov](https://www.massachusetts.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Massachusetts County Metadata
- **Source URL:** [https://www.massachusetts.gov](https://www.massachusetts.gov)
- **Domain:** `massachusetts.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Massachusetts Medicaid Portal
- **Source URL:** [https://dhhs.massachusetts.gov](https://dhhs.massachusetts.gov)
- **Domain:** `dhhs.massachusetts.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Massachusetts Developmental Services Directory
- **Source URL:** [https://dhhs.massachusetts.gov/dd](https://dhhs.massachusetts.gov/dd)
- **Domain:** `dhhs.massachusetts.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Massachusetts HCBS Waivers Page
- **Source URL:** [https://dhhs.massachusetts.gov/dd/waivers](https://dhhs.massachusetts.gov/dd/waivers)
- **Domain:** `dhhs.massachusetts.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Massachusetts Early Intervention / Part C
- **Source URL:** [https://dhhs.massachusetts.gov/earlyintervention](https://dhhs.massachusetts.gov/earlyintervention)
- **Domain:** `dhhs.massachusetts.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Massachusetts Department of Education Special Ed
- **Source URL:** [https://education.massachusetts.gov](https://education.massachusetts.gov)
- **Domain:** `education.massachusetts.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Massachusetts Regional Special Education Support
- **Source URL:** [https://education.massachusetts.gov/regional](https://education.massachusetts.gov/regional)
- **Domain:** `education.massachusetts.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Massachusetts Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Massachusetts
- **Source URL:** [https://www.thearcmassachusetts.org](https://www.thearcmassachusetts.org)
- **Domain:** `thearcmassachusetts.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
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
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Massachusetts Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.massachusetts.gov/forms](https://dhhs.massachusetts.gov/forms)
- **Domain:** `dhhs.massachusetts.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Massachusetts Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.massachusetts.gov/rehab](https://dhhs.massachusetts.gov/rehab)
- **Domain:** `dhhs.massachusetts.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Massachusetts Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Massachusetts Secretary of State Business Registry
- **Source URL:** [https://www.massachusetts.gov/business](https://www.massachusetts.gov/business)
- **Domain:** `massachusetts.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Massachusetts.
- **Last Checked:** 2026-06-13

