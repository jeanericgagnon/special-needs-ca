# State Source Targets: Utah (UT)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Utah with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Utah County Metadata** | A. State identity and geography / County List | [utah.gov](https://www.utah.gov) | `static_fetch` | `counties` |
| **Utah Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.utah.gov](https://dhhs.utah.gov) | `playwright` | `county_offices` |
| **Utah Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.utah.gov](https://dhhs.utah.gov/dd) | `playwright` | `state_resource_agencies` |
| **Utah HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.utah.gov](https://dhhs.utah.gov/dd/waivers) | `static_fetch` | `programs` |
| **Utah Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.utah.gov](https://dhhs.utah.gov/earlyintervention) | `static_fetch` | `programs` |
| **Utah Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.utah.gov](https://education.utah.gov) | `static_fetch` | `programs` |
| **Utah Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.utah.gov](https://education.utah.gov/regional) | `playwright` | `regional_education_agencies` |
| **Utah Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Utah** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcutah.org](https://www.thearcutah.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Utah Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.utah.gov](https://dhhs.utah.gov/forms) | `pdf_extract` | `forms` |
| **Utah Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.utah.gov](https://dhhs.utah.gov/rehab) | `static_fetch` | `programs` |
| **Utah Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Utah Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [utah.gov](https://www.utah.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Utah County Metadata
- **Source URL:** [https://www.utah.gov](https://www.utah.gov)
- **Domain:** `utah.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Utah Medicaid Portal
- **Source URL:** [https://dhhs.utah.gov](https://dhhs.utah.gov)
- **Domain:** `dhhs.utah.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Utah Developmental Services Directory
- **Source URL:** [https://dhhs.utah.gov/dd](https://dhhs.utah.gov/dd)
- **Domain:** `dhhs.utah.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Utah HCBS Waivers Page
- **Source URL:** [https://dhhs.utah.gov/dd/waivers](https://dhhs.utah.gov/dd/waivers)
- **Domain:** `dhhs.utah.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Utah Early Intervention / Part C
- **Source URL:** [https://dhhs.utah.gov/earlyintervention](https://dhhs.utah.gov/earlyintervention)
- **Domain:** `dhhs.utah.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Utah Department of Education Special Ed
- **Source URL:** [https://education.utah.gov](https://education.utah.gov)
- **Domain:** `education.utah.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Utah Regional Special Education Support
- **Source URL:** [https://education.utah.gov/regional](https://education.utah.gov/regional)
- **Domain:** `education.utah.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Utah Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Utah
- **Source URL:** [https://www.thearcutah.org](https://www.thearcutah.org)
- **Domain:** `thearcutah.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
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
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Utah Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.utah.gov/forms](https://dhhs.utah.gov/forms)
- **Domain:** `dhhs.utah.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Utah Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.utah.gov/rehab](https://dhhs.utah.gov/rehab)
- **Domain:** `dhhs.utah.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Utah Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Utah Secretary of State Business Registry
- **Source URL:** [https://www.utah.gov/business](https://www.utah.gov/business)
- **Domain:** `utah.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Utah.
- **Last Checked:** 2026-06-13

