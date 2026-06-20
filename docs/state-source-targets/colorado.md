# State Source Targets: Colorado (CO)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Colorado with real, source-listed records.

> [!NOTE]
> **Provider Source Expansion Started:** This state was originally mapped as a category-level scaffold. Concrete first-party provider targets have now been added for the hospital / university clinic layer.

## 1. Domain Crawler Targets (Wave 2)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Colorado County Metadata** | A. State identity and geography / County List | [colorado.gov](https://www.colorado.gov) | `static_fetch` | `counties` |
| **Colorado Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.colorado.gov](https://dhhs.colorado.gov) | `playwright` | `county_offices` |
| **Colorado Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.colorado.gov](https://dhhs.colorado.gov/dd) | `playwright` | `state_resource_agencies` |
| **Colorado HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.colorado.gov](https://dhhs.colorado.gov/dd/waivers) | `static_fetch` | `programs` |
| **Colorado Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.colorado.gov](https://dhhs.colorado.gov/earlyintervention) | `static_fetch` | `programs` |
| **Colorado Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.colorado.gov](https://education.colorado.gov) | `static_fetch` | `programs` |
| **Colorado Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.colorado.gov](https://education.colorado.gov/regional) | `playwright` | `regional_education_agencies` |
| **Colorado Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Colorado** | I. Condition-specific nonprofits / The Arc State Chapter | [thearccolorado.org](https://www.thearccolorado.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Colorado Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.colorado.gov](https://dhhs.colorado.gov/forms) | `pdf_extract` | `forms` |
| **Colorado Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.colorado.gov](https://dhhs.colorado.gov/rehab) | `static_fetch` | `programs` |
| **Children's Hospital Colorado** | M. Hospitals / university clinics / Hospitals | [childrenscolorado.org](https://www.childrenscolorado.org) | `static_fetch` | `resource_providers` |
| **JFK Partners** | M. Hospitals / university clinics / University clinics | [medschool.cuanschutz.edu](https://medschool.cuanschutz.edu/jfk-partners) | `static_fetch` | `resource_providers` |
| **Colorado Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [colorado.gov](https://www.colorado.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Colorado County Metadata
- **Source URL:** [https://www.colorado.gov](https://www.colorado.gov)
- **Domain:** `colorado.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Colorado Medicaid Portal
- **Source URL:** [https://dhhs.colorado.gov](https://dhhs.colorado.gov)
- **Domain:** `dhhs.colorado.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Colorado Developmental Services Directory
- **Source URL:** [https://dhhs.colorado.gov/dd](https://dhhs.colorado.gov/dd)
- **Domain:** `dhhs.colorado.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Colorado HCBS Waivers Page
- **Source URL:** [https://dhhs.colorado.gov/dd/waivers](https://dhhs.colorado.gov/dd/waivers)
- **Domain:** `dhhs.colorado.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Colorado Early Intervention / Part C
- **Source URL:** [https://dhhs.colorado.gov/earlyintervention](https://dhhs.colorado.gov/earlyintervention)
- **Domain:** `dhhs.colorado.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Colorado Department of Education Special Ed
- **Source URL:** [https://education.colorado.gov](https://education.colorado.gov)
- **Domain:** `education.colorado.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Colorado Regional Special Education Support
- **Source URL:** [https://education.colorado.gov/regional](https://education.colorado.gov/regional)
- **Domain:** `education.colorado.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Colorado Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Colorado
- **Source URL:** [https://www.thearccolorado.org](https://www.thearccolorado.org)
- **Domain:** `thearccolorado.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
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
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Colorado Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.colorado.gov/forms](https://dhhs.colorado.gov/forms)
- **Domain:** `dhhs.colorado.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Colorado Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.colorado.gov/rehab](https://dhhs.colorado.gov/rehab)
- **Domain:** `dhhs.colorado.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** Children's Hospital Colorado
- **Source URL:** [https://www.childrenscolorado.org](https://www.childrenscolorado.org)
- **Domain:** `childrenscolorado.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Concrete first-party pediatric hospital target for Colorado provider buildout.
- **Last Checked:** 2026-06-17

### Category: M. Hospitals / university clinics (University clinics)
- **Source Name:** JFK Partners
- **Source URL:** [https://medschool.cuanschutz.edu/jfk-partners](https://medschool.cuanschutz.edu/jfk-partners)
- **Domain:** `medschool.cuanschutz.edu`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Concrete first-party university developmental disabilities clinic target for Colorado.
- **Last Checked:** 2026-06-17

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Colorado Secretary of State Business Registry
- **Source URL:** [https://www.colorado.gov/business](https://www.colorado.gov/business)
- **Domain:** `colorado.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Colorado.
- **Last Checked:** 2026-06-13
