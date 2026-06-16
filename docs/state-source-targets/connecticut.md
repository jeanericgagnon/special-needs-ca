# State Source Targets: Connecticut (CT)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Connecticut with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 4.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Connecticut County Metadata** | A. State identity and geography / County List | [connecticut.gov](https://www.connecticut.gov) | `static_fetch` | `counties` |
| **Connecticut Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.connecticut.gov](https://dhhs.connecticut.gov) | `playwright` | `county_offices` |
| **Connecticut Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.connecticut.gov](https://dhhs.connecticut.gov/dd) | `playwright` | `state_resource_agencies` |
| **Connecticut HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.connecticut.gov](https://dhhs.connecticut.gov/dd/waivers) | `static_fetch` | `programs` |
| **Connecticut Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.connecticut.gov](https://dhhs.connecticut.gov/earlyintervention) | `static_fetch` | `programs` |
| **Connecticut Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.connecticut.gov](https://education.connecticut.gov) | `static_fetch` | `programs` |
| **Connecticut Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.connecticut.gov](https://education.connecticut.gov/regional) | `playwright` | `regional_education_agencies` |
| **Connecticut Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Connecticut** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcconnecticut.org](https://www.thearcconnecticut.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Connecticut Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.connecticut.gov](https://dhhs.connecticut.gov/forms) | `pdf_extract` | `forms` |
| **Connecticut Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.connecticut.gov](https://dhhs.connecticut.gov/rehab) | `static_fetch` | `programs` |
| **Connecticut Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Connecticut Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [connecticut.gov](https://www.connecticut.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Connecticut County Metadata
- **Source URL:** [https://www.connecticut.gov](https://www.connecticut.gov)
- **Domain:** `connecticut.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Connecticut Medicaid Portal
- **Source URL:** [https://dhhs.connecticut.gov](https://dhhs.connecticut.gov)
- **Domain:** `dhhs.connecticut.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Connecticut Developmental Services Directory
- **Source URL:** [https://dhhs.connecticut.gov/dd](https://dhhs.connecticut.gov/dd)
- **Domain:** `dhhs.connecticut.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Connecticut HCBS Waivers Page
- **Source URL:** [https://dhhs.connecticut.gov/dd/waivers](https://dhhs.connecticut.gov/dd/waivers)
- **Domain:** `dhhs.connecticut.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Connecticut Early Intervention / Part C
- **Source URL:** [https://dhhs.connecticut.gov/earlyintervention](https://dhhs.connecticut.gov/earlyintervention)
- **Domain:** `dhhs.connecticut.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Connecticut Department of Education Special Ed
- **Source URL:** [https://education.connecticut.gov](https://education.connecticut.gov)
- **Domain:** `education.connecticut.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Connecticut Regional Special Education Support
- **Source URL:** [https://education.connecticut.gov/regional](https://education.connecticut.gov/regional)
- **Domain:** `education.connecticut.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Connecticut Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Connecticut
- **Source URL:** [https://www.thearcconnecticut.org](https://www.thearcconnecticut.org)
- **Domain:** `thearcconnecticut.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
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
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Connecticut Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.connecticut.gov/forms](https://dhhs.connecticut.gov/forms)
- **Domain:** `dhhs.connecticut.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Connecticut Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.connecticut.gov/rehab](https://dhhs.connecticut.gov/rehab)
- **Domain:** `dhhs.connecticut.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Connecticut Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Connecticut Secretary of State Business Registry
- **Source URL:** [https://www.connecticut.gov/business](https://www.connecticut.gov/business)
- **Domain:** `connecticut.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Connecticut.
- **Last Checked:** 2026-06-13

