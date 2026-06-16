# Florida FDLRS / ESE Promotion Run Report (2026-06-13)

Promoted FDLRS Associate Centers, county-to-FDLRS mappings, and verified priority ESE School Districts into production tables.

## 1. Executive Summary
*   **FDLRS Centers Promoted:** 4 inserted, 15 upserted → 19 total in `regional_education_agencies`
*   **FDLRS County Mappings:** 67 county-to-FDLRS rows inserted covering 67/67 counties
*   **Verified ESE Districts Promoted:** 14 records updated in `school_districts`
*   **Fallback ESE Districts Skipped:** 53 records remain as `current_generated_fallback` / `needs_official_source`
*   **Audit Rows Written:** 35
*   **Readiness Score:** 100.0% → 100.0%

## 2. Pre-Promotion Validation
*   [x] Exactly 19 FDLRS centers staged
*   [x] Exactly 14 verified ESE districts staged
*   [x] 0 fallback ESE placeholders in staging
*   [x] 67/67 counties covered by FDLRS mapping artifact
*   [x] All staged records have source_url, evidence_level, confidence_score
*   [x] Production FL school_districts: 67 rows (unchanged before promotion)
*   [x] Production FL regional_education_agencies: 16 rows (pre-promotion)

## 3. Promotion Details

### FDLRS Centers
*   **Inserted (new):** 4 centers
*   **Upserted (updated):** 15 centers
*   **Total in production:** 19
*   **evidence_level:** `official_locator_derived`
*   **confidence_score:** 0.9

### FDLRS County Mappings
*   **Inserted:** 67 rows in `regional_center_counties`
*   **Counties covered:** 67/67
*   **APD, Early Steps, other mappings:** Untouched

### Verified ESE Districts
*   **Updated:** 14 rows in `school_districts`
*   **evidence_level:** `source_listed`
*   **confidence_score:** 0.9
*   **Fallback districts (53) untouched:** Retained as `current_generated_fallback`

## 4. Post-Promotion Validation
*   [x] 19 FDLRS centers in production
*   [x] 67 FDLRS county mappings in production
*   [x] 14 verified ESE districts promoted
*   [x] 0 fallback ESE districts remain (unchanged, undeleted)
*   [x] FL school_districts total: 67 (unchanged)
*   [x] DCF ACCESS, APD/iBudget, Early Steps — not touched
*   [x] No sitemap/indexing changes

## 5. Promotion Readiness for Next Phase
*   **FDLRS:** ✅ Complete — all 19 centers and 67 county mappings live in production.
*   **Verified ESE Districts (14):** ✅ Complete — upgraded to `source_listed`.
*   **Fallback ESE Districts (53):** ⛔ Needs dedicated FLDOE directory source-discovery pass.
*   **Next Recommended Command:** `node src/state-upgrade/run_state_upgrade.js --state florida --mode research-ese-districts`
