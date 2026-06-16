# Upgrade Proposal: Florida Early Steps Part C Early Intervention Ingestion

This proposal outlines the upgrade path to ingest 15 real, source-listed Florida Early Steps local program offices and map their county service catchments, transitioning from seeded placeholders to verified listings.

## 1. Executive Summary
Florida's early intervention system (Part C) serves infants and toddlers from birth to age 3. Services are coordinated through 15 regional Local Early Steps programs contracted by the Florida Department of Health (Children's Medical Services).

*   **Proposed State:** 15 verified Local Early Steps program records mapped to 67 counties.
*   **Target Staging Table:** `staging_scraped_state_resource_agencies`
*   **Target Production Table:** `state_resource_agencies` (agency_type: 'early_steps')
*   **County Catchment Table:** `regional_center_counties`
*   **Deduplication Key:** `state_id, agency_type, name`
*   **Verification Status:** `source_listed`
*   **Expected Score Completeness:** 100% for Florida Early Intervention routing.

## 2. Ingestion & Promotion Strategy
1.  **Staging Ingestion:** Ingest 15 local program records into `staging_scraped_state_resource_agencies`.
2.  **Promotion:**
    *   Insert/update the 15 Local Early Steps programs in `state_resource_agencies`.
    *   Populate `regional_center_counties` with 68 county mapping rows linking the 15 programs to the 67 served counties (Miami-Dade is served by two programs).
3.  **No Fallbacks Overwritten:** Early Steps programs are regional resources and do not replace local county-office fallbacks.

## 3. Validation Plan
*   **Checkpoints:** Verify that all 15 local programs are correctly associated with their host agencies and physical addresses.
*   **Catchment Verification:** Confirm all 67 Florida counties are mapped to at least one Early Steps portal.
