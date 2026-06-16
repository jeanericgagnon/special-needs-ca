# Texas ECI Ingestion & Promotion Upgrade Proposal (Phase 2)

**Date:** June 13, 2026  
**State:** Texas (TX)  
**Category:** Early Childhood Intervention (ECI)  

---

## 1. Contractor Reconciliation Summary

*   **Official Source Count:** Dynamic network of ECI programs covering the entire state.
*   **Raw ECI Mappings Count:** **270 mappings** across all 254 counties.
*   **Unique Contractor Count:** **39 unique contractors**.
*   **Reconciliation Detail:** The prior truth map referenced 37 regional contractors, and a preliminary scraper draft referenced 33.Standardizing the scraper to extract all program cards under county blocks resolved this. Multi-contractor metropolitan counties like Bexar, Dallas, and Harris account for the extra unique records. For details, see [texas-eci-contractor-reconciliation.md](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/scraping-vs-seeding/texas-eci-contractor-reconciliation.md).

---

## 2. Ingestion & Staging Summary

*   **Records Staged:** 39 unique records staged in `staging_scraped_state_resource_agencies`.
*   **Review Status:** `pending_review`.
*   **Counties Covered:** 100% of 254 Texas counties.
*   **Unmapped Counties:** 0 (none).
*   **Source URL:** [Texas HHSC ECI Program Search](https://citysearch.hhsc.state.tx.us/)
*   **Duplicate Candidates:** 0 (no pre-existing ECI contractors exist in production).

---

## 3. Data Origin, Evidence Levels, & Confidence Distributions

### Staged Contractors (39 records)
*   **Suggested Target Table:** `state_resource_agencies`
*   **Agency Type:** `eci`
*   **Evidence Level:** `official_directory_extract` (Directly listed ECI contractors)
*   **Data Origin / Source Type:** `official_directory_extract`
*   **Verification Status:** `source_listed`
*   **Confidence Score Distribution:**
    *   **0.95 (Metro/Large Contractors):** 9 records (e.g. Metrocare Services, Brighton Center, Easterseals Greater Houston, The Harris Center, etc.)
    *   **0.90 (Standard Regional Contractors):** 30 records

### County Mappings (270 records in junction table)
*   **Junction Table:** `regional_center_counties`
*   **Evidence Level:** `regional_routing_official` (Maps regional ECI contractors to individual counties)

---

## 4. Validation Results

*   **Validation Script Run:** `node src/scrapers/state_sources/texas/validate_staged_eci.js`
*   **Total Sample Checked:** 40 samples (30 counties representing rural, mid-size, and metro demographics + 10 random contractor records).
*   **Exact Matches:** 40 / 40 (100%)
*   **Incorrect Rate:** 0.00% (Pass Criteria: < 5%)
*   **Routing Supported or Better:** 100.00% (Pass Criteria: >= 90%)
*   **Placeholder Checks:** Passed. No placeholder phone numbers or websites found.
*   **Fake County Offices Check:** Passed. All 39 records represent genuine regional administrative ECI contractors.

---

## 5. Expected Score Lift & Impact

*   **ECI Category Lift:** Completing the ECI regional routing replaces missing/empty coverage for early intervention services with 100% official routing.
*   **Texas CA-Equivalence Lift:** Ingesting 39 explicit, highly-trusted source-listed records boosts the overall ratio of explicit records and source-trust density. The Texas CA-Equivalence score is expected to rise from **91.2%** to over **92.0%**.
*   **Frontend Rendering Lift:** With ECI-specific rendering logic added to the county page template, ECI contractors will display in their own dedicated UI section, clearly labeled as **"Early Childhood Intervention / ECI"** without rendering as LIDDAs or regional centers.

---

## 6. Rollback Plan

If promotion causes unexpected issues, the changes can be completely reverted with the following steps:
1.  Run a rollback transaction to delete all records from `state_resource_agencies` where `agency_type = 'eci'` and `state_id = 'texas'`.
2.  Delete corresponding county mapping rows from the `regional_center_counties` junction table.
3.  Update the staging table `staging_scraped_state_resource_agencies` to reset the `review_status` of the 39 staged ECI records back to `pending_review`.
4.  Re-run the database sync script to synchronize the changes to the frontend database.
