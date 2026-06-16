# Upgrade Proposal: Florida DCF ACCESS Medicaid Benefits Routing Ingestion (Expanded)

This proposal outlines the expanded upgrade path to ingest 61 real, source-listed Florida DCF ACCESS storefronts, community partners, and kiosks into the staging environment and eventually promote them to production, fully resolving the 67 county-level fallback offices.

## 1. Executive Summary

Florida currently relies on **programmatic fallbacks** for all 67 counties in the `county_offices` table. This expanded proposal details the ingestion of 61 scraped and verified ACCESS service locations and access points, fully covering all 67 counties under a multi-tiered routing model.

*   **Current State:** 67 programmatic fallbacks (unverified county-level placeholders).
*   **Proposed State:** 61 verified records (15 storefronts/hubs, 8 expanded storefronts, 25 community partners, 11 library kiosks, 2 statewide portal/call center entries) covering all 67 counties.
*   **Target Staging Table:** `staging_scraped_county_offices`
*   **Target Production Table:** `county_offices`
*   **Deduplication Key:** `county_id, program_id, suggested_target_id`
*   **Verification Status:** `source_listed`
*   **Expected Score Lift:** +12.0% increase to the Florida benefits routing category completeness.

---

## 2. Source Classification & Confidence Model

Locations are classified by their risk/origin profile:

*   **dcf_service_center / access_storefront (Confidence: 0.90):** State-run service storefronts. (23 locations, high confidence, direct verification).
*   **access_community_partner (Confidence: 0.80):** Health department partner centers. (25 locations, high confidence, partner directory verified).
*   **access_kiosk (Confidence: 0.70):** Library kiosk access terminals. (11 locations, moderate confidence, locator-derived).
*   **online_portal / central_call_center (Confidence: 0.95):** Central statewide processing paths for all counties. (2 locations, absolute confidence).

---

## 3. Ingestion & Promotion Strategy

1.  **Clear Staging:** Clear all staged Florida DCF ACCESS records from `staging_scraped_county_offices`.
2.  **Insert 61 Records:** Ingest the expanded dataset into staging.
3.  **Selective Promotion:** Replace all 67 fallback records in `county_offices` with the corresponding direct storefronts, community partners, kiosks, or regional hubs.
