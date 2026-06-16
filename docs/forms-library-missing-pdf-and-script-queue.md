# Forms Library Missing PDF & Call-Script Queue

**Date:** June 14, 2026  
**Priority:** High  
**Objective:** Resolve missing PDF download links and empty cover-letter scripts for gated state guides.

---

## 1. Forms Curation Summary

Following the final canonical cleanup pass, all fake/generated domains (e.g. `dhhs.[state].gov`) have been completely purged from the database and replaced with official search queries.

*   **Total Promoted Forms (`forms_and_guides`):** 67
*   **Total Raw Scraped Forms (`staging_scraped_forms`):** 76
*   **Forms Missing Direct PDF (Using Google Search Fallback):** 42
*   **Forms Missing Follow-Up Call Scripts:** 67 (100% of promoted records)
*   **Fake/Generated URLs Remaining:** 0

---

## 2. Missing PDF Roster (42 Guides Using Search Fallbacks)

The following state guides currently use Google search queries as safe fallbacks because direct PDF downloads are missing:

| State | Guide Title | Fallback Search Link |
| :--- | :--- | :--- |
| **Alabama** | Alabama Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Alabama+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Alaska** | Alaska Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Alaska+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Arizona** | Arizona Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Arizona+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Arkansas** | Arkansas Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Arkansas+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Colorado** | Colorado Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Colorado+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Connecticut** | Connecticut Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Connecticut+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Delaware** | Delaware Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Delaware+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Hawaii** | Hawaii Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Hawaii+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Idaho** | Idaho Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Idaho+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Indiana** | Indiana Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Indiana+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Iowa** | Iowa Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Iowa+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Kansas** | Kansas Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Kansas+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Kentucky** | Kentucky Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Kentucky+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Louisiana** | Louisiana Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Louisiana+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Maine** | Maine Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Maine+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Maryland** | Maryland Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Maryland+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Massachusetts** | Massachusetts Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Massachusetts+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Michigan** | Michigan Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Michigan+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Minnesota** | Minnesota Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Minnesota+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Mississippi** | Mississippi Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Mississippi+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Missouri** | Missouri Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Missouri+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Montana** | Montana Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Montana+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Nebraska** | Nebraska Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Nebraska+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Nevada** | Nevada Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Nevada+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **New Hampshire** | New Hampshire Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+New+Hampshire+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **New Jersey** | New Jersey Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+New+Jersey+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **New Mexico** | New Mexico Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+New+Mexico+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **North Carolina** | North Carolina Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+North+Carolina+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **North Dakota** | North Dakota Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+North+Dakota+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Oklahoma** | Oklahoma Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Oklahoma+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Oregon** | Oregon Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Oregon+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Rhode Island** | Rhode Island Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Rhode+Island+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **South Carolina** | South Carolina Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+South+Carolina+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **South Dakota** | South Dakota Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+South+Dakota+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Tennessee** | Tennessee Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Tennessee+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Utah** | Utah Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Utah+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Vermont** | Vermont Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Vermont+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Virginia** | Virginia Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Virginia+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Washington** | Washington Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Washington+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **West Virginia** | West Virginia Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+West+Virginia+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Wisconsin** | Wisconsin Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Wisconsin+Medicaid+Benefits+Application+and+Appeals+Guide) |
| **Wyoming** | Wyoming Benefits Application and Appeals Guide | [Search Link](https://www.google.com/search?q=site%3A.gov+Wyoming+Medicaid+Benefits+Application+and+Appeals+Guide) |

---

## 3. Empty Call-Script Backlog

These guides have empty Follow-Up Call Scripts or cover letters that need to be manually drafted:
- **Total States affected:** 67 states (all promoted records in `forms_and_guides`).
- **Recommended Action:** Copy-paste standard templates or source custom local scripts.
