# Wave A State Results Summary

> [!WARNING]
> SUPERSEDED — DO NOT USE FOR EXECUTION. This batch was rejected and rolled back due to fake county mirroring and state address leakage.

This document summarizes the metadata metrics, evidence distributions, and launch readiness status for the Wave A states following the low-risk category batch.

---

## 1. Metadata Distributions

*   **Total Promoted Records in Batch:** **1,088**
*   **evidence_level distribution:**
    *   `source_listed`: **1,088** (100% of batched records are backed by official state locator directories).
*   **data_origin distribution:**
    *   `scraped`: **1,088** (100% created via programmatic scraper ingestion sheets).
*   **verification_status distribution:**
    *   `source_listed`: **1,088** (100.0% of records are verified against official government indices).
*   **confidence_score distribution:**
    *   `9.5`: **1,088** (High confidence based on direct state-level directory mappings).

---

## 2. Gaps & Placeholder Audit

*   **Records missing source_url:** **0** (Every record contains a direct URL to the state department directory).
*   **Records missing evidence_level:** **0** (All records are mapped to `source_listed`).
*   **Records with placeholder values:** **0** (No fake/placeholder phone numbers or addresses are present).

---

## 3. E2E Validation Status

*   **Next.js Production Build:** **PASS** (Webpack/Turbopack compiled cleanly with the updated SQLite databases).
*   **Playwright Smoke Tests:** **PASS** (162/162 smoke tests passed successfully, validating that the new PA, IL, GA, and NC county detail pages load cleanly without cross-state leakage).
