# Florida Early Steps Promotion Report (2026-06-13)

This report documents the promotion of Florida Early Steps regional program portals and county mappings from staging into production.

---

## 1. Promotion Summary

*   **Early Steps Regional Portals Promoted:** 15 (inserted/updated in `state_resource_agencies`)
*   **Early Steps County Mappings Mapped:** 68 counties (inserted/replaced in `regional_center_counties`)
*   **Superseded Records Removed:** Removed 15 old Early Steps records and 68 mapping rows
*   **Unrelated State Resource Agencies Touched:** None (APD, DCF, LIDDA, ECI, or other states remained untouched)
*   **Unrelated Categories Touched:** None

---

## 2. Trust Metadata Distributions

*   **Evidence Level Distribution:**
    - `official_locator_derived`: 15 records
*   **Confidence Score Distribution:**
    - `0.9`: 15 records

---

## 3. Before/After Metrics

*   **Florida Readiness Score Before:** 80.0%
*   **Florida Readiness Score After:** 80.0%
*   **Geographic Coverage:** 67/67 counties fully covered (100% mapped)
*   **WAL Checkpoint Status:** PASS
*   **Frontend Database Sync Status:** PASS

---

## 4. Next Step Command

To proceed with Florida Phase 2D (FDLRS / ESE school districts research):
`node src/state-upgrade/run_state_upgrade.js --state florida --mode research-fdlrs-ese` (to be implemented next)
