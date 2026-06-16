# National Risk Register

This document registers the primary operational, structural, and data integrity risks associated with the remaining state upgrades, along with their mitigation strategies.

---

## 1. Risk Matrix

```
       High  | [R-03: LME/MCO]     [R-02: CSB/IU]
             | 
L            | 
I            | 
K  Medium    |                     [R-01: Metro Splits]
E             | 
L             | 
I            | 
H     Low    | [R-04: Centralized]
O            | 
T            |_________________________________________
             |        Low             Medium            High
             |                  I M P A C T
```

---

## 2. Active Risk Log

### Risk R-01: Major Metropolitan Splits (NYC-like Exceptions)
*   **Likelihood:** Medium
*   **Impact:** Medium
*   **Description:** Major cities like Chicago (Cook County, IL), Houston (Harris County, TX), Philadelphia (Philadelphia County, PA), and Los Angeles (Los Angeles County, CA) operate independent municipal structures that bypass county health or educational systems.
*   **Mitigation:** Configure metropolitan exceptions explicitly in the state's `state_config.json` file. Map city-specific offices (e.g., Chicago Public Schools regional networks) to their respective borough or metropolitan districts rather than forcing a single county-wide placeholder.

### Risk R-02: Complex DD/IDD Regional Catchments (CSB/IU Models)
*   **Likelihood:** High
*   **Impact:** Medium
*   **Description:** States like Pennsylvania and Virginia do not map IDD services to simple county storefronts. Virginia uses **Community Services Boards (CSBs)**, and Pennsylvania uses **County MH/ID Offices** and **Intermediate Units (IUs)**. These regions overlap and cover irregular catchments.
*   **Mitigation:** Map these regional boundaries explicitly in `state_resource_agencies` and seed the junction records in `regional_center_counties` / `selpa_counties`. Never force 1:1 mapping when a multi-county catchment is documented in official sources.

### Risk R-03: North Carolina Managed Care (LME/MCO) Routing Model
*   **Likelihood:** High
*   **Impact:** High
*   **Description:** North Carolina routes developmental services through private Medicaid managed care networks called **Local Management Entities / Managed Care Organizations (LME/MCO)**. This represents a managed-care routing model rather than a public agency model, which can cause routing definition confusion.
*   **Mitigation:** Treat LME/MCO networks as the regional catchment equivalent. Map counties served to the appropriate LME/MCO (e.g., Alliance Health, Vaya Health, Trillium Health Resources).

### Risk R-04: Centralized States "Failing Open"
*   **Likelihood:** Low
*   **Impact:** Low
*   **Description:** States in Wave D (e.g., Hawaii, Delaware) have highly centralized single-district or state-run administrations. Applying complex regional center routing scripts to these states is overkill and can result in redundant data structures.
*   **Mitigation:** Use the "Centralized Seeding" mode. Map all counties to the single state-level agency directly, and bypass multi-agency catchment maps.

### Risk R-05: SQLite WAL/SHM Lock Conflicts in CI/CD Environments
*   **Likelihood:** High
*   **Impact:** Medium
*   **Description:** Copying SQLite files during automated testing without first executing a `wal_checkpoint(TRUNCATE)` and clearing temporary `-shm` and `-wal` files leads to `SQLITE_CORRUPT` failures on the dev server.
*   **Mitigation:** The runner must strictly execute checkpoints and delete WAL/SHM replica logs before triggering Next.js builds or Playwright E2E suites.

### Risk R-06: Fake Coverage & County Mirroring in Batch Ingestion
*   **Likelihood:** High
*   **Impact:** High
*   **Description:** Multi-state batching of local routing layers can cause scrapers/generators to duplicate a single regional office 1:1 into every county, creating fake storefronts and leaking capital addresses.
*   **Mitigation:** All geographic local routing phases are strictly suspended from batch mode and reverted to single-state mode. The runner enforces `src/state-upgrade/lib/fakeCoverageDetector.js` checks during staging validation to block mirrored/duplicate records from promotion.
