# Zero-Churn Final Hardening Start Checkpoint

**Date:** June 15, 2026  
**Timestamp:** 1781535872344  
**Root Database Backup:** `/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/backups/ca_disability_navigator.db.backup-zero-churn-1781535872344`  
**Frontend Database Backup:** `/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/backups/frontend-ca_disability_navigator.db.backup-zero-churn-1781535872344`  
**Root PRAGMA integrity_check:** `ok`  
**Frontend PRAGMA integrity_check:** `ok`  

---

## 1. Protected-Record Snapshot Counts

| Table Name | Root DB Protected Count | Frontend DB Protected Count |
| :--- | :---: | :---: |
| `county_offices` | **249** | **249** |
| `school_districts` | **197** | **197** |
| `nonprofit_organizations` | **8872** | **8872** |
| `regional_education_agencies` | **116** | **116** |
| `iep_advocates` | **408** | **408** |
| `resource_providers` | **6** | **6** |
| `state_resource_agencies` | **40** | **40** |

---

## 2. Sitemap Allowlist Count

* **Sitemap Allowlist File:** `frontend/src/lib/verifiedCounties.ts`
* **Texas (TX):** 248
* **Florida (FL):** 14
* **Pennsylvania (PA):** 8
* **Other States:** 0
* **Total Non-CA Sitemap Count:** 270

---

## 3. Forms Table / Staging Counts

| Table Name | Root DB Count | Frontend DB Count |
| :--- | :---: | :---: |
| `forms_and_guides` | **67** | **67** |
| `staging_scraped_forms` | **76** | **76** |

---

## 4. Fake/Generated Source Counts

* **Docs Directory (`docs/**/*.md`):** 1129
* **Data Directory (`data/**/*.json`):** 298
* **Root Database (`ca_disability_navigator.db`):** 74
* **Frontend Database (`frontend/ca_disability_navigator.db`):** 74
