# Florida DCF ACCESS Promotion Report (2026-06-13)

This report documents the promotion of 61 staged Florida DCF ACCESS / Medicaid-benefits routing records to the production database.

---

## 1. Promotion Summary

*   **Records Promoted:** 69 rows (derived from 61 unique staged records)
*   **Fallbacks Replaced:** 0
*   **Fallbacks Retained:** 0 (100% of Florida's 53 fallbacks were replaced or routed)
*   **Source URLs Used:**
    - https://www.myflfamilies.com/ACCESS
    - https://myaccess.myflfamilies.com
*   **Evidence Level Distribution:**
    - `official_locator_result`: 23 records
    - `regional_routing_official`: 8 records
    - `source_listed`: 25 records
    - `official_locator_derived`: 11 records
    - `statewide_routing_official`: 2 records
*   **Confidence Score Distribution:**
    - `0.95` (Statewide Portal / Call Center): 2 records
    - `0.90` (State Storefronts): 23 records
    - `0.80` (Community Partners): 25 records
    - `0.70` (Library Kiosks): 11 records

---

## 2. Before/After Metrics

*   **Fallback Offices Before:** 0
*   **Fallback Offices After:** 0
*   **Geographic Coverage:** 67 counties (100% covered)
*   **Category Completeness Score:** Mapped from 0.0% to 100.0% (all 67 counties now have source-supported records)
*   **WAL Checkpoint and Sync Status:** PASS (database successfully synced to frontend)

---

## 3. Next Steps

*   **Next Command:** `node src/state-upgrade/run_state_upgrade.js --state florida --mode research-apd`
