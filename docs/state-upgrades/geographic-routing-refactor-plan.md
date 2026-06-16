# Geographic Routing Refactor Plan

This plan details the technical and data-structure changes required to make geographic routing state-specific, catchment-aware, and safe from fake county-count mirroring.

---

## 1. Separation of Entity and Coverage

To prevent fake county-level storefront duplication, the state-upgrade runner will separate the physical entity (the office location) from its service coverage area (the counties served):

*   **Source Entity:** One unique row is stored in the primary agency table (e.g. `state_resource_agencies`) representing the true physical location of the agency.
*   **Catchment Mapping:** Multiple counties served are mapped in the database mapping tables (e.g. `regional_center_counties` or `selpa_counties`). A single regional office will never be duplicated into multiple county rows.
*   **Routing Type:** Explicitly defined by the record's `routing_model` to designate how families access the services.

---

## 2. Required Data Model Fields

Every promoted geographic record must declare:

*   `entity_id`: Unique identifier (e.g. `pa-dd-allegheny-intake`).
*   `entity_name`: True official name.
*   `physical_address`: Real street address of the office (nullable for virtual portals).
*   `service_area_type`: Classified as `county`, `regional`, or `statewide`.
*   `counties_served`: Array/catchment list.
*   `routing_model`: Matches one of the allowed routing models below.

---

## 3. Allowed Routing Models

All geographic records must match one of these official routing models:

1.  `county_office`: A local physical storefront serving one county (e.g., JFS offices).
2.  `regional_office` / `regional_catchment`: A regional hub serving multiple counties (e.g., California Regional Centers, Pennsylvania Intermediate Units).
3.  `statewide_office` / `online_portal` / `central_call_center`: A centralized entity serving the entire state.
4.  `community_partner` / `kiosk_or_access_point`: A third-party partner site with lower confidence (never replaces official offices).

---

## 4. Integration of the Fake Coverage Detector

The newly created module `src/state-upgrade/lib/fakeCoverageDetector.js` will run automatically during the **Staging Validation Phase** of the runner. If any of the following checks fail, the runner will block promotion and fail closed:

*   **County-Count Mirroring:** Flagged if the count of regional records matches the county count exactly.
*   **Statewide Hotline Mirroring:** Flagged if the same hotline number is repeated across > 10% of records in county office categories.
*   **Capital Address Leakage:** Flagged if a single default address is duplicated.
*   **Suspicious Confidence Uniformity:** Flagged if all records have identical confidence scores (like 9.5).
