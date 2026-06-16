# Florida ESE District Replacement Promotion Run Report (2026-06-13)

Promoted 47 source-supported Florida ESE school districts from staging to production, replacing fallback placeholders with verified contact details.

## 1. Executive Summary
*   **Ready-to-Stage ESE Districts Promoted:** 47
*   **Manual-Review ESE Districts Preserved:** 6 (Escambia, Lake, Manatee, Monroe, Okeechobee, Putnam)
*   **Total Florida Districts in Production:** 67 (Unchanged)
*   **Fallback Districts Remaining:** 6
*   **Primary Keys Re-keyed:** Yes (old id sd-{county}-fl-fallback renamed to sd-{county}-fl)
*   **Readiness Score:** 20.9% → 91.0%
*   **Audit Rows Written:** 47

## 2. Pre-Promotion Validation
*   [x] Exactly 47 records with pending_review or source_supported_ready_to_stage in staging (Pass).
*   [x] Exactly 6 records with manual_review_required in staging (Pass).
*   [x] Zero duplicate target IDs in staging (Pass).
*   [x] All promoted records contain source_url, evidence_level, confidence_score (Pass).
*   [x] Production school_districts has 67 Florida rows (Pass).
*   [x] Production school_districts has 53 fallback records (Pass).

## 3. Post-Promotion Validation
*   [x] Total Florida school districts in production remains 67 (Pass).
*   [x] Fallback school districts remaining = 6 (Pass).
*   [x] Verified/promoted Florida school districts = 61 (Pass).
*   [x] staging_promotion_audit has 47 new promotion rows (Pass).

## 4. Evidence Level & Confidence Distribution (FL Districts Total: 67)

### Evidence Level Distribution:
*   `null (fallback)`: 6
*   `direct_official_page`: 45
*   `official_locator_derived`: 2
*   `source_listed`: 14

### Confidence Score Distribution:
*   `0.88`: 2
*   `0.90`: 27
*   `0.91`: 15
*   `0.92`: 15
*   `0.93`: 2
*   `3.00 (fallback)`: 6

## 5. Next Phase Recommendation
*   **State Upgrade Mode:** `research-card-clinics`
*   **Command:** `node src/state-upgrade/run_state_upgrade.js --state florida --mode research-card-clinics`
