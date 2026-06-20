# State Source Targets: Michigan (MI)

This document outlines the authoritative crawler target domains, specific agencies, and extraction methods required to replace programmatic placeholders in Michigan with real, source-listed records.

> [!NOTE]
> **Provider Source Expansion Started:** This state was originally mapped as a category-level scaffold. Concrete first-party provider targets have now been added for the hospital / university clinic layer.

## 1. Domain Crawler Targets (Wave 2)

| Target Name | Category / Subcategory | Source Domain | Crawl Method | Target Table |
| :--- | :--- | :--- | :--- | :--- |
| **Michigan County Metadata** | A. State identity and geography / County List | [michigan.gov](https://www.michigan.gov) | `static_fetch` | `counties` |
| **Michigan Medicaid Portal** | B. Medicaid / benefits / HHS / Medicaid Landing Page | [dhhs.michigan.gov](https://dhhs.michigan.gov) | `playwright` | `county_offices` |
| **Michigan Developmental Services Directory** | C. Developmental disability / DD / IDD services / State DD Agency Page | [dhhs.michigan.gov](https://dhhs.michigan.gov/dd) | `playwright` | `state_resource_agencies` |
| **Michigan HCBS Waivers Page** | D. HCBS waivers / Waiver Page | [dhhs.michigan.gov](https://dhhs.michigan.gov/dd/waivers) | `static_fetch` | `programs` |
| **Michigan Early Intervention / Part C** | E. Early intervention / Early Intervention Landing Page | [dhhs.michigan.gov](https://dhhs.michigan.gov/earlyintervention) | `static_fetch` | `programs` |
| **Michigan Department of Education Special Ed** | F. Special education / IEP / SEA Special Ed Page | [education.michigan.gov](https://education.michigan.gov) | `static_fetch` | `programs` |
| **Michigan Regional Special Education Support** | G. Regional education structures / Regional Agency Directory | [education.michigan.gov](https://education.michigan.gov/regional) | `playwright` | `regional_education_agencies` |
| **Michigan Parent Training Center** | H. Parent training / disability rights / legal aid / PTI Center | [parentcenterhub.org](https://www.parentcenterhub.org) | `static_fetch` | `nonprofit_organizations` |
| **The Arc of Michigan** | I. Condition-specific nonprofits / The Arc State Chapter | [thearcmichigan.org](https://www.thearcmichigan.org) | `static_fetch` | `nonprofit_organizations` |
| **Special Education Attorneys Directory** | J. Provider and advocate directories / Attorney Directory | [copaa.org](https://www.copaa.org) | `playwright` | `iep_advocates` |
| **Michigan Medicaid & Special Education Forms** | K. Forms and guides / Forms Library | [dhhs.michigan.gov](https://dhhs.michigan.gov/forms) | `pdf_extract` | `forms` |
| **Michigan Vocational Rehabilitation Services** | L. Transition / adult services / Vocational Rehabilitation | [dhhs.michigan.gov](https://dhhs.michigan.gov/rehab) | `static_fetch` | `programs` |
| **C.S. Mott Children's Hospital** | M. Hospitals / university clinics / Hospitals | [mottchildren.org](https://www.mottchildren.org) | `static_fetch` | `resource_providers` |
| **Children's Hospital of Michigan** | M. Hospitals / university clinics / Hospitals | [childrensdmc.org](https://www.childrensdmc.org) | `static_fetch` | `resource_providers` |
| **Helen DeVos Children's Hospital** | M. Hospitals / university clinics / Hospitals | [spectrumhealth.org](https://www.spectrumhealth.org/locations/spectrum-health-hospitals-helen-devos-childrens-hospital) | `static_fetch` | `resource_providers` |
| **Michigan Secretary of State Business Registry** | N. Data quality / verification sources / Open Data Portal | [michigan.gov](https://www.michigan.gov/business) | `playwright` | `sources` |

## 2. Detailed Category Targets

### Category: A. State identity and geography (County List)
- **Source Name:** Michigan County Metadata
- **Source URL:** [https://www.michigan.gov](https://www.michigan.gov)
- **Domain:** `michigan.gov`
- **Target Table:** `counties`
- **Expected Fields:** `name, state_id`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: B. Medicaid / benefits / HHS (Medicaid Landing Page)
- **Source Name:** Michigan Medicaid Portal
- **Source URL:** [https://dhhs.michigan.gov](https://dhhs.michigan.gov)
- **Domain:** `dhhs.michigan.gov`
- **Target Table:** `county_offices`
- **Expected Fields:** `office_name, address, phone`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: C. Developmental disability / DD / IDD services (State DD Agency Page)
- **Source Name:** Michigan Developmental Services Directory
- **Source URL:** [https://dhhs.michigan.gov/dd](https://dhhs.michigan.gov/dd)
- **Domain:** `dhhs.michigan.gov`
- **Target Table:** `state_resource_agencies`
- **Expected Fields:** `name, phone, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: D. HCBS waivers (Waiver Page)
- **Source Name:** Michigan HCBS Waivers Page
- **Source URL:** [https://dhhs.michigan.gov/dd/waivers](https://dhhs.michigan.gov/dd/waivers)
- **Domain:** `dhhs.michigan.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: E. Early intervention (Early Intervention Landing Page)
- **Source Name:** Michigan Early Intervention / Part C
- **Source URL:** [https://dhhs.michigan.gov/earlyintervention](https://dhhs.michigan.gov/earlyintervention)
- **Domain:** `dhhs.michigan.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, intake_phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: F. Special education / IEP (SEA Special Ed Page)
- **Source Name:** Michigan Department of Education Special Ed
- **Source URL:** [https://education.michigan.gov](https://education.michigan.gov)
- **Domain:** `education.michigan.gov`
- **Target Table:** `programs`
- **Expected Fields:** `program_id, name`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: G. Regional education structures (Regional Agency Directory)
- **Source Name:** Michigan Regional Special Education Support
- **Source URL:** [https://education.michigan.gov/regional](https://education.michigan.gov/regional)
- **Domain:** `education.michigan.gov`
- **Target Table:** `regional_education_agencies`
- **Expected Fields:** `name, website`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: H. Parent training / disability rights / legal aid (PTI Center)
- **Source Name:** Michigan Parent Training Center
- **Source URL:** [https://www.parentcenterhub.org](https://www.parentcenterhub.org)
- **Domain:** `parentcenterhub.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: I. Condition-specific nonprofits (The Arc State Chapter)
- **Source Name:** The Arc of Michigan
- **Source URL:** [https://www.thearcmichigan.org](https://www.thearcmichigan.org)
- **Domain:** `thearcmichigan.org`
- **Target Table:** `nonprofit_organizations`
- **Expected Fields:** `name, website, phone`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
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
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: K. Forms and guides (Forms Library)
- **Source Name:** Michigan Medicaid & Special Education Forms
- **Source URL:** [https://dhhs.michigan.gov/forms](https://dhhs.michigan.gov/forms)
- **Domain:** `dhhs.michigan.gov`
- **Target Table:** `forms`
- **Expected Fields:** `slug, download_url`
- **Crawl Method:** `pdf_extract`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: L. Transition / adult services (Vocational Rehabilitation)
- **Source Name:** Michigan Vocational Rehabilitation Services
- **Source URL:** [https://dhhs.michigan.gov/rehab](https://dhhs.michigan.gov/rehab)
- **Domain:** `dhhs.michigan.gov`
- **Target Table:** `programs`
- **Expected Fields:** `name, website`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13

### Category: M. Hospitals / university clinics (Hospitals)
- **Source Name:** C.S. Mott Children's Hospital
- **Source URL:** [https://www.mottchildren.org](https://www.mottchildren.org)
- **Domain:** `mottchildren.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Concrete first-party pediatric hospital target for Michigan provider buildout.
- **Last Checked:** 2026-06-17

- **Source Name:** Children's Hospital of Michigan
- **Source URL:** [https://www.childrensdmc.org](https://www.childrensdmc.org)
- **Domain:** `childrensdmc.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Concrete first-party pediatric hospital target for Detroit-area Michigan provider buildout.
- **Last Checked:** 2026-06-17

- **Source Name:** Helen DeVos Children's Hospital
- **Source URL:** [https://www.spectrumhealth.org/locations/spectrum-health-hospitals-helen-devos-childrens-hospital](https://www.spectrumhealth.org/locations/spectrum-health-hospitals-helen-devos-childrens-hospital)
- **Domain:** `spectrumhealth.org`
- **Target Table:** `resource_providers`
- **Expected Fields:** `name, phone, address`
- **Crawl Method:** `static_fetch`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 1
- **Notes:** Concrete first-party pediatric hospital target for west Michigan provider buildout.
- **Last Checked:** 2026-06-17

### Category: N. Data quality / verification sources (Open Data Portal)
- **Source Name:** Michigan Secretary of State Business Registry
- **Source URL:** [https://www.michigan.gov/business](https://www.michigan.gov/business)
- **Domain:** `michigan.gov`
- **Target Table:** `sources`
- **Expected Fields:** `url, type`
- **Crawl Method:** `playwright`
- **Robots.txt Status:** `allowed`
- **Terms Risk:** `low`
- **Priority:** 2
- **Notes:** Initial category-level scaffold source target for Michigan.
- **Last Checked:** 2026-06-13
