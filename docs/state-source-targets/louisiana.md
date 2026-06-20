# State Source Targets: Louisiana (LA)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Louisiana with real, source-listed records.

> [!NOTE]
> **Provider Source Expansion Started:** This state was originally mapped as a category-level scaffold. Concrete first-party provider targets have now been added for the hospital / university clinic layer.

## 1. Domain Crawler Targets (Wave 4)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Louisiana County Metadata** | A. State identity and geography / County List | [louisiana.gov](https://www.louisiana.gov) | `static_fetch` | `counties` |
| **Louisiana Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.louisiana.gov](https://dhhs.louisiana.gov) | `playwright` | `county_offices` |
| **Louisiana Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.louisiana.gov](https://dhhs.louisiana.gov/dd) | `playwright` | `state_resource_agencies` |
| **Louisiana HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.louisiana.gov](https://dhhs.louisiana.gov/dd/waivers) | `static_fetch` | `programs` |
| **Louisiana Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.louisiana.gov](https://dhhs.louisiana.gov/earlyintervention) | `static_fetch` | `programs` |
| **Louisiana Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.louisiana.gov](https://education.louisiana.gov) | `static_fetch` | `programs` |
| **Louisiana Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.louisiana.gov](https://education.louisiana.gov/regional) | `playwright` | `regional_education_agencies` |
| **Louisiana Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Louisiana** | I. Condition-specific nonprofits / The Arc State Chapter | [thearclouisiana.org](https://www.thearclouisiana.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Louisiana Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.louisiana.gov](https://dhhs.louisiana.gov/forms) | `pdf_extract` | `forms` |
| **Louisiana Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.louisiana.gov](https://dhhs.louisiana.gov/rehab) | `static_fetch` | `programs` |
| **Manning Family Children's** | M. Hospitals / university clinics / Hospitals | [manningchildrens.org](https://www.manningchildrens.org) | `static_fetch` | `resource_providers` |
| **Ochsner Hospital for Children** | M. Hospitals / university clinics / Hospitals | [ochsner.org](https://www.ochsner.org) | `static_fetch` | `resource_providers` |
| **LSU Health Shreveport Children's Center** | M. Hospitals / university clinics / University clinics | [lsuhs.edu](https://www.lsuhs.edu) | `static_fetch` | `resource_providers` |
| **Louisiana Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [louisiana.gov](https://www.louisiana.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Louisiana County Metadata
- **Source URL:** [https://www.louisiana.gov](https://www.louisiana.gov)
- **Domain:** `louisiana.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Louisiana Medicaid Portal
- **Source URL:** [https://dhhs.louisiana.gov](https://dhhs.louisiana.gov)
- **Domain:** `dhhs.louisiana.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Louisiana Developmental Services Directory
- **Source URL:** [https://dhhs.louisiana.gov/dd](https://dhhs.louisiana.gov/dd)
- **Domain:** `dhhs.louisiana.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Louisiana HCBS Waivers Page
- **Source URL:** [https://dhhs.louisiana.gov/dd/waivers](https://dhhs.louisiana.gov/dd/waivers)
- **Domain:** `dhhs.louisiana.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Louisiana Early Intervention / Part C
- **Source URL:** [https://dhhs.louisiana.gov/earlyintervention](https://dhhs.louisiana.gov/earlyintervention)
- **Domain:** `dhhs.louisiana.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Louisiana Department of Education Special Ed
- **Source URL:** [https://education.louisiana.gov](https://education.louisiana.gov)
- **Domain:** `education.louisiana.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Louisiana Regional Special Education Support
- **Source URL:** [https://education.louisiana.gov/regional](https://education.louisiana.gov/regional)
- **Domain:** `education.louisiana.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Louisiana Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Louisiana
- **Source URL:** [https://www.thearclouisiana.org](https://www.thearclouisiana.org)
- **Domain:** `thearclouisiana.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
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
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Louisiana Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.louisiana.gov/forms](https://dhhs.louisiana.gov/forms)
- **Domain:** `dhhs.louisiana.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Louisiana Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.louisiana.gov/rehab](https://dhhs.louisiana.gov/rehab)
- **Domain:** `dhhs.louisiana.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Manning Family Children's
- **Source URL:** [https://www.manningchildrens.org](https://www.manningchildrens.org)
- **Domain:** `manningchildrens.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Concrete first-party pediatric hospital target for Louisiana provider buildout.
- **Last Checked:** 2026-06-17

- **Source Name:** Ochsner Hospital for Children
- **Source URL:** [https://www.ochsner.org](https://www.ochsner.org)
- **Domain:** `ochsner.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Concrete first-party Louisiana pediatric hospital system target to replace generic placeholder coverage.
- **Last Checked:** 2026-06-17

- **Source Name:** LSU Health Shreveport Children's Center
- **Source URL:** [https://www.lsuhs.edu](https://www.lsuhs.edu)
- **Domain:** `lsuhs.edu`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Concrete first-party Louisiana academic pediatric clinic target for northern-state coverage.
- **Last Checked:** 2026-06-17

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Louisiana Secretary of State Business Registry
- **Source URL:** [https://www.louisiana.gov/business](https://www.louisiana.gov/business)
- **Domain:** `louisiana.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Louisiana.
- **Last Checked:** 2026-06-13
