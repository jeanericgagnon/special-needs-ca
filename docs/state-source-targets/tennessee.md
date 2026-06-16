# State Source Targets: Tennessee (TN)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Tennessee with real, source-listed records.

> [!NOTE]
> **Category Scaffold Complete:** This state is currently mapped as a category-level scaffold (14 targets). Source-level expansion will follow in Wave 2.

## 1. Domain Crawler Targets (Wave 2)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Tennessee County Metadata** | A. State identity and geography / County List | [tennessee.gov](https://www.tennessee.gov) | `static_fetch` | `counties` |
| **Tennessee Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.tennessee.gov](https://dhhs.tennessee.gov) | `playwright` | `county_offices` |
| **Tennessee Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.tennessee.gov](https://dhhs.tennessee.gov/dd) | `playwright` | `state_resource_agencies` |
| **Tennessee HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.tennessee.gov](https://dhhs.tennessee.gov/dd/waivers) | `static_fetch` | `programs` |
| **Tennessee Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.tennessee.gov](https://dhhs.tennessee.gov/earlyintervention) | `static_fetch` | `programs` |
| **Tennessee Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.tennessee.gov](https://education.tennessee.gov) | `static_fetch` | `programs` |
| **Tennessee Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.tennessee.gov](https://education.tennessee.gov/regional) | `playwright` | `regional_education_agencies` |
| **Tennessee Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Tennessee** | I. Condition-specific nonprofits / The Arc State Chapter | [thearctennessee.org](https://www.thearctennessee.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Tennessee Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.tennessee.gov](https://dhhs.tennessee.gov/forms) | `pdf_extract` | `forms` |
| **Tennessee Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.tennessee.gov](https://dhhs.tennessee.gov/rehab) | `static_fetch` | `programs` |
| **Tennessee Children's Hospital Clinics** | M. Hospitals / university clinics / Hospitals | [childrenshospital.org](https://www.childrenshospital.org) | `manual_review` | `resource_providers` |
| **Tennessee Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [tennessee.gov](https://www.tennessee.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Tennessee County Metadata
- **Source URL:** [https://www.tennessee.gov](https://www.tennessee.gov)
- **Domain:** `tennessee.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Tennessee Medicaid Portal
- **Source URL:** [https://dhhs.tennessee.gov](https://dhhs.tennessee.gov)
- **Domain:** `dhhs.tennessee.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Tennessee Developmental Services Directory
- **Source URL:** [https://dhhs.tennessee.gov/dd](https://dhhs.tennessee.gov/dd)
- **Domain:** `dhhs.tennessee.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Tennessee HCBS Waivers Page
- **Source URL:** [https://dhhs.tennessee.gov/dd/waivers](https://dhhs.tennessee.gov/dd/waivers)
- **Domain:** `dhhs.tennessee.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Tennessee Early Intervention / Part C
- **Source URL:** [https://dhhs.tennessee.gov/earlyintervention](https://dhhs.tennessee.gov/earlyintervention)
- **Domain:** `dhhs.tennessee.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Tennessee Department of Education Special Ed
- **Source URL:** [https://education.tennessee.gov](https://education.tennessee.gov)
- **Domain:** `education.tennessee.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Tennessee Regional Special Education Support
- **Source URL:** [https://education.tennessee.gov/regional](https://education.tennessee.gov/regional)
- **Domain:** `education.tennessee.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Tennessee Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Tennessee
- **Source URL:** [https://www.thearctennessee.org](https://www.thearctennessee.org)
- **Domain:** `thearctennessee.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
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
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Tennessee Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.tennessee.gov/forms](https://dhhs.tennessee.gov/forms)
- **Domain:** `dhhs.tennessee.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Tennessee Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.tennessee.gov/rehab](https://dhhs.tennessee.gov/rehab)
- **Domain:** `dhhs.tennessee.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Tennessee Children's Hospital Clinics
- **Source URL:** [https://www.childrenshospital.org](https://www.childrenshospital.org)
- **Domain:** `childrenshospital.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `manual_review`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Tennessee Secretary of State Business Registry
- **Source URL:** [https://www.tennessee.gov/business](https://www.tennessee.gov/business)
- **Domain:** `tennessee.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Tennessee.
- **Last Checked:** 2026-06-13

