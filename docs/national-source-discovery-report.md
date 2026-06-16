# National Source Discovery Report

This report outlines the national map of authoritative sources, crawler targets, and risk metrics discovered for the 49 pilot states. It tracks progress from category-level scaffolding to exhaustive source-level discovery.

## 1. Executive Summary

- **Total States Configured:** 49
- **Total Source Targets Mapped:** 930
- **Unique Domain Hosts:** 293
- **Scrapeable via Crawler:** 923 targets
- **Requires Manual Review/Curation:** 7 targets (COPAA directories)

## 2. Project Status Definitions & Progress

- **Category scaffold complete:** Mapped 14 basic categories (A-N) for a state. Currently **42 states** are at this level (Waves 2, 3, 4).
- **Source discovery complete:** Expanded to multiple real source-level discovery targets. Currently **7 states** (Wave 1: TX, FL, NY, PA, IL, OH, GA) are at this level, each mapping evidence-exhausted counts.
- **Scrape ready:** Complete robots.txt review and extraction field mapping completed for the targets. Currently **7 states** (Wave 1) are certified **Scrape Ready** for initial crawl pilots.

## 3. Wave 1 Expanded Source Targets Counts (Exhaustion Differentiated)

| State | Wave | Total Source Targets | Discovery Status | Scrape Readiness |
| :--- | :--- | :--- | :--- | :--- |
| **Florida (FL)** | Wave 1 | 49 | Source Discovery Complete | **Scrape Ready** |
| **Georgia (GA)** | Wave 1 | 41 | Source Discovery Complete | **Scrape Ready** |
| **Illinois (IL)** | Wave 1 | 43 | Source Discovery Complete | **Scrape Ready** |
| **New York (NY)** | Wave 1 | 58 | Source Discovery Complete | **Scrape Ready** |
| **Ohio (OH)** | Wave 1 | 50 | Source Discovery Complete | **Scrape Ready** |
| **Pennsylvania (PA)** | Wave 1 | 47 | Source Discovery Complete | **Scrape Ready** |
| **Texas (TX)** | Wave 1 | 54 | Source Discovery Complete | **Scrape Ready** |

- **Target Count Variance across Wave 1:** 17 (Differentiated from actual evidence discovery: Max 58 in NY, Min 41 in GA)

## 4. Source Targets by Category

| Category | Targets Found | Priority |
| :--- | :--- | :--- |
| A. State identity and geography | 57 | High/Medium |
| B. Medicaid / benefits / HHS | 77 | High/Medium |
| C. Developmental disability / DD / IDD services | 73 | High/Medium |
| D. HCBS waivers | 52 | High/Medium |
| E. Early intervention | 56 | High/Medium |
| F. Special education / IEP | 80 | High/Medium |
| G. Regional education structures | 42 | High/Medium |
| H. Parent training / disability rights / legal aid | 64 | High/Medium |
| I. Condition-specific nonprofits | 60 | High/Medium |
| J. Provider and advocate directories | 168 | High/Medium |
| K. Forms and guides | 44 | High/Medium |
| L. Transition / adult services | 55 | High/Medium |
| M. Hospitals / university clinics | 54 | High/Medium |
| N. Data quality / verification sources | 48 | High/Medium |

## 5. Crawl Method & Robots.txt Compliance

- **Robots.txt Rules Status:**
  - Allowed: 929
  - Disallowed: 0
  - Manual Review Needed: 1
- **ToS Risk Levels:**
  - Low Risk (gov/edu): 929
  - Medium Risk (org directories): 1
  - High Risk (Avoided): 0

## 6. Recommended First Scrape Priority

1. **Medicaid/HHS offices locator:** Provides the foundational local benefits routing mapping.
2. **DD local catchments:** Standardizes local intake routing maps.
3. **Early Intervention providers:** Fills early childhood age 0-3 services.
4. **Regional education entities:** Essential for building special education directory connections.
5. **Forms / Guides:** Direct value catalog enrichment for users.
