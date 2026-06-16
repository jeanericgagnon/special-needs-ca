# Upgrade Proposal: Florida APD / iBudget DD Ingestion (Phase 2B)

This proposal outlines the ingestion path for Florida developmental disability routing, covering 14 Agency for Persons with Disabilities (APD) regional offices, the iBudget waiver program, its waitlist, and the official application form.

## 1. Executive Summary
Florida currently has no official developmental disability routing information in the database. This proposal introduces 17 records to establish complete DD routing coverage for all 67 Florida counties.

*   **Proposed State:**
    *   14 APD regional/field offices serving all 67 counties mapped to `state_resource_agencies` and `regional_center_counties` mapping tables.
    *   1 Program record for the `iBudget Florida Waiver` mapped to `programs`.
    *   1 Waitlist record for the `APD Waiver Waitlist` mapped to `program_waitlists`.
    *   1 Form record for the `APD Application for Services` mapped to `staging_scraped_forms`.
*   **Deduplication Keys:**
    *   `state_resource_agencies`: `id` / `state_id, agency_type, name`
    *   `programs`: `id`
    *   `program_waitlists`: `id`
    *   `staging_scraped_forms`: `source_url, slug`
*   **Expected Score Lift:** Establishes 100% completeness for the Florida Developmental DD Routing category (+10.0% overall score lift before depth caps).

## 2. Ingestion & Promotion Strategy
1.  **Staging Ingestion:** Clear existing staged APD records and ingest the 17 proposed records into staging tables.
2.  **Promotion:**
    *   Insert the 14 APD regional offices into `state_resource_agencies`.
    *   Insert the iBudget Waiver program into `programs`.
    *   Insert the APD Waiver Waitlist into `program_waitlists`.
    *   Populate `regional_center_counties` mapping table with 67 rows linking the 14 APD offices to their served counties.
3.  **No Fallbacks Overwritten:** APD offices are regional administrative entities and do not overwrite or replace `county_offices` fallback records.

## 3. Validation Plan
*   **Sample Size:** Verify 5 counties spanning different APD regions (e.g., Escambia for Northwest Region, Duval for Northeast Region, Orange for Central Region, Hillsborough for Suncoast Region, Miami-Dade for Southern Region).
*   **Checks:** Verify `counties_served` matches the official APD region maps and that the website and phone numbers are verified.
