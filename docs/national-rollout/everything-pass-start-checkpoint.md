# Everything Pass Start Checkpoint

**Date:** June 15, 2026  
**Timestamp:** 1781538248950  
**Root Database Backup:** `backups/ca_disability_navigator.db.backup-everything-pass-1781538248950`  
**Frontend Database Backup:** `backups/frontend-ca_disability_navigator.db.backup-everything-pass-1781538248950`  
**Root PRAGMA integrity_check:** `ok`  
**Frontend PRAGMA integrity_check:** `ok`  
**GSC Posture:** **HOLD**  
**Sitemap Exclusions:** Active (gated states returning noindex)

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

---

## 5. Manual-Review, Fallback, and Mock Counts

* **Manual Review Counts (Root DB total):** 8282
* **Programmatic Fallback Counts (Root DB):** 40
* **Mock/Placeholder Counts (Root DB):** 0

### Manual Review Breakdown by State:
* **california:** 657
* **kentucky:** 606
* **nebraska:** 471
* **minnesota:** 441
* **missouri:** 347
* **kansas:** 317
* **iowa:** 299
* **tennessee:** 287
* **virginia:** 287
* **indiana:** 278
* **georgia:** 265
* **mississippi:** 248
* **oklahoma:** 233
* **arkansas:** 227
* **wisconsin:** 218
* **alabama:** 203
* **south-dakota:** 200
* **colorado:** 195
* **louisiana:** 194
* **north-carolina:** 186
* **montana:** 170
* **west-virginia:** 167
* **ohio:** 167
* **north-dakota:** 161
* **michigan:** 151
* **south-carolina:** 140
* **idaho:** 134
* **washington:** 119
* **oregon:** 110
* **new-mexico:** 101
* **utah:** 89
* **maryland:** 74
* **alaska:** 62
* **new-hampshire:** 56
* **nevada:** 53
* **maine:** 50
* **wyoming:** 50
* **arizona:** 47
* **massachusetts:** 44
* **vermont:** 44
* **pennsylvania:** 29
* **connecticut:** 26
* **new-jersey:** 23
* **delaware:** 21
* **hawaii:** 17
* **rhode-island:** 17
* **illinois:** 1
