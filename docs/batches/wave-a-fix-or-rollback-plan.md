# Wave A Fix or Rollback Plan

This document details the database rollback verification, fix proposal, and future multi-state batching rules.

---

## 1. Rollback Execution Verification

To address the data quality issues identified during the validation audit, the database was rolled back to its pre-batch state on **June 14, 2026**:

*   **Restored Checkpoint:** `ca_disability_navigator.db.backup-1781386075382`
*   **Result:** All 1,288 Wave A records staged/promoted during the batch were successfully deleted from production tables. Pre-existing curated seeds and North Carolina fallback records (`programmatic_fallback`) were restored.
*   **Ohio Safety:** Checked and verified. Ohio's 88 county JFS, CBDD, EI, and 176 school districts remain fully intact and unaffected.
*   **Verification:** Production Next.js build compiled cleanly and all 162 Playwright E2E smoke tests passed.

---

## 2. Ingestion Rules for Future Batches

Before resuming any multi-state batching, the following rules must be implemented:

1.  **Direct Regional Catchment Mapping:** Scrapers and dataset generators must seed regional offices once, utilizing mapping tables (like `regional_center_counties` or `selpa_counties`) to assign county service areas instead of duplicating records 1:1.
2.  **No Capital City Address Defaults:** Programmatic generator sheets must map real local administrative addresses. Cross-state leaks (e.g. seeding IL/GA/NC with Harrisburg, PA addresses) are strictly blocked.
3.  **Strict State Isolation:** Multi-state batching remains **SUSPENDED** for all local routing layers. We will revert to single-state mode until directory scrapers have been refactored.
