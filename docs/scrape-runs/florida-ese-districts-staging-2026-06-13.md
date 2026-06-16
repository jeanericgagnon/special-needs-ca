# Florida ESE Districts Staging Report (2026-06-13)

Staging run for Phase 2D-2 ESE District Fallback Replacement.

## 1. Staging Summary
*   **Ready to Stage (pending_review):** 47 records
*   **Requires Manual Review (manual_review_required):** 6 records
*   **Total Staged:** 53 records
*   **Status:** Staging Complete. Ready for promotion.

## 2. Validation Results
*   **Counts Check:** Exactly 47 ready-to-stage and 6 manual-review districts staged (Pass).
*   **Metadata Check:** All records contain valid source_url, evidence_level, and confidence_score (Pass).
*   **Uniqueness Check:** Zero duplicate suggested_target_id values (Pass).
*   **Production Safety Check:** 67 FL school_districts rows and 53 fallbacks remain completely unchanged in the production database (Pass).

## 3. Evidence Level & Confidence Distribution
*   `direct_official_page` / `source_listed`: 47 records (confidence 0.88 - 0.93)
*   `official_locator_derived`: 6 records (confidence 0.82)
