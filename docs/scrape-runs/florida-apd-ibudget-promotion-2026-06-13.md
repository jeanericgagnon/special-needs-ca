# Florida APD / iBudget Promotion Report (2026-06-13)

This report documents the promotion of Florida APD/iBudget DD routing records from staging into production.

---

## 1. Promotion Summary

*   **APD Regional Offices Promoted:** 14 (inserted into `state_resource_agencies`)
*   **APD County Mappings Mapped:** 67 counties (inserted into `regional_center_counties`)
*   **iBudget Waiver Program Promoted:** 1 (inserted/updated in `programs`)
*   **iBudget Program Waitlist Promoted:** 1 (inserted/updated in `program_waitlists`)
*   **APD Form 10-007 Status:** Retained in `staging_scraped_forms` with `review_status = 'auto_accepted'`
*   **Family Care Councils Status:** Retained as deferred and skipped from database staging/promotion
*   **Superseded Records Removed:** Removed 14 old APD regional placeholders and 67 county mapping rows
*   **Unrelated State Resource Agencies Touched:** None (Early Steps and other states remained untouched)
*   **Unrelated Categories Touched:** None

---

## 2. Trust Metadata Distributions

*   **Evidence Level Distribution:**
    - `official_locator_result`: 14 records
    - `statewide_routing_official`: 1 records
*   **Confidence Score Distribution:**
    - `0.9`: 14 records
    - `0.95`: 1 records

---

## 3. Before/After Metrics

*   **Florida Readiness Score Before:** 80.0%
*   **Florida Readiness Score After:** 80.0%
*   **Geographic Coverage:** 67/67 counties fully covered (100% mapped)
*   **WAL Checkpoint Status:** PASS
*   **Frontend Database Sync Status:** PASS

---

## 4. Next Step Command

To proceed with Florida Phase 2C (Early Steps routing research):
`node src/state-upgrade/run_state_upgrade.js --state florida --mode research-early-steps` (to be implemented next)
