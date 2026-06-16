# Texas LIDDA Promotion & HCS Routing Cleanup Report

**Date:** June 13, 2026  
**State:** Texas (TX)  
**Phase:** Phase 1 Ingestion & Routing Correction  

This report details the execution of Step 1 to Step 7 of the Texas DD/IDD and HCS routing correction. This run successfully added the `evidence_level` field, upgraded the 39 Local Intellectual and Developmental Disability Authorities (LIDDAs) with official local websites and intake phone numbers, and cleaned up the 254 incorrect county-level HCS office fallbacks.

---

## 1. Schema Migration Status

*   **Action:** Added `evidence_level TEXT` column to both the root and frontend databases (`ca_disability_navigator.db` and `frontend/ca_disability_navigator.db`).
*   **Target Production Tables:**
    *   `nonprofit_organizations`
    *   `state_resource_agencies`
    *   `regional_education_agencies`
    *   `iep_advocates`
    *   `resource_providers`
*   **Target Staging Tables:**
    *   `staging_scraped_nonprofit_organizations`
    *   `staging_scraped_state_resource_agencies`
    *   `staging_scraped_regional_education_agencies`
    *   `staging_scraped_iep_advocates`
    *   `staging_scraped_resource_providers`
*   **Verification:** Verified via `PRAGMA table_info` columns match exactly.

---

## 2. LIDDA Staging and Promotion

*   **Records Staged:** 39 official LIDDA records staged in `staging_scraped_state_resource_agencies` using the scraper script.
*   **Placeholder Details Replaced:**
    *   Removed generic hotline `(855) 937-2372` and replaced with local intake phone numbers for all 39 entities.
    *   Removed placeholder websites in the format `[name]-lidda.tx.gov` and replaced with official websites (e.g. `andrewscenter.com`, `bettyhardwick.org`, `bbtrails.org`).
*   **Evidence and Confidence:**
    *   `evidence_level = 'regional_routing_official'` or `'official_directory_extract'`
    *   `data_origin = 'official_directory_extract'` or `'official_locator_derived'`
    *   `verification_status = 'source_listed'`
    *   `confidence_score = 0.90` (for direct match) or `0.85` (for derived routing support)
*   **Promotion Status:** 39 records promoted to `state_resource_agencies` with target IDs mapped. All promotions logged to `staging_promotion_audit` table. Curated seeds and human-verified records were preserved.
*   **Counties Covered:** All 254 counties covered. Exactly 0 counties unmapped.
*   **Counties Served Overlaps:** 4 counties officially served by two overlapping LIDDAs (Pecos, Terrell, Ward, and Winkler are served by PermiaCare and West Texas Centers).

---

## 3. HCS Fallbacks Routing Cleanup

*   **Action:** Removed 254 incorrect county-level HCS fallbacks from the `county_offices` table.
*   **Reasoning:** Placing HCS fallbacks in `county_offices` represents a table-routing error because HCS intake does not occur at county offices. The fallbacks also displayed fake local email addresses (e.g. `intake@anderson-tx.tx.gov`) and fake physical addresses.
*   **Cleanup Execution:** Deleted 254 records in `county_offices` where `program_id = 'tx-hcs'` and `data_origin = 'programmatic_fallback'`.
*   **Protection:** Curated seeds (including the 15 regional HHSC Medicaid offices) were protected. Fallbacks for unrelated programs (such as `tx-mdcp` or other states' Medicaid offices) were not deleted.
*   **Audit Logging:** All 254 deletions were recorded in the `staging_promotion_audit` table with full before-state JSON strings.
*   **Remaining Fallbacks:** 0 HCS fallbacks remain in `county_offices`.

---

## 4. Score and Build Audits

We ran standard and depth audits before and after these adjustments to track completeness.

### Score Metrics Comparison

| Metric / Category | Before Run | After Run |
| :--- | :--- | :--- |
| **Texas Pilot Launch Score** | **80.0%** (Capped due to Medicaid cap) | **80.0%** (Capped due to sitemap gating) |
| **Texas CA-Equivalence Score** | **~85.2%** | **91.2%** |
| **Local Developmental DD Routing** | Generic placeholders | **100.0%** (39 LIDDAs fully source-listed) |
| **Local Medicaid / HHS Offices** | 239 fallbacks + 254 HCS fallbacks | **100.0%** (254 source-backed offices, 0 HCS fallbacks) |
| **Total Texas Fallbacks in DB** | 719 | **226** (Only nonprofits remain) |

### Hard Cap Status

*   **Medicaid/HHS Local Depth (<25%)**: **Resolved** (Scraped Medicaid offices at 100% and fake HCS offices removed).
*   **Education Local Depth (<35%)**: **Resolved** (School districts fully upgraded).
*   **Fallback Share (>50%)**: **Resolved** (Fallback share drops to 8.5% of total Texas records).

### NextJS Production Build
*   **Result:** `Compiled successfully`
*   **Page Counts:** 4,215 static pages successfully generated.
*   **Verification:** Verified that county pages render regional LIDDAs under Section 1 without displaying the incorrect HCS county-level fallbacks in Section 2.

---

## 5. Issues Found

*   **Overlapping catchments:** Pecos, Terrell, Ward, and Winkler counties officially overlap between two regional LIDDAs. This was verified against the official HHSC locator and is handled correctly by displaying both LIDDAs.
*   **Audit constraints:** The `staging_promotion_audit` table has `NOT NULL` constraints on `staging_record_id`, which was resolved in the deletion script by setting it to `0` since no staging records exist for direct database cleanups.

---

## 6. Recommended Next Ingestion Phase

We recommend proceeding to **Phase 2 Ingestion: Early Childhood Intervention (ECI) Regional Contractors**.
*   **Target Table:** `state_resource_agencies`
*   **Objective:** Ingest the 37 ECI regional contractors and map them to their 254 county catchments, resolving the major ECI data gap identified in the gap analysis.
