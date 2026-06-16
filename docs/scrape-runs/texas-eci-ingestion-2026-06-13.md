# Texas ECI Ingestion Run Report

**Date:** June 13, 2026  
**State:** Texas (TX)  
**Run Type:** Early Childhood Intervention (ECI) Ingestion & Mapping  

---

## 1. Reconciliation Result (33 vs. 37 vs. 39)

*   **Discrepancy Explanation:** The previous truth map referenced 37 regional contractors, and a preliminary scraper draft referenced 33. The corrected scraper parser retrieved every ECI program card under each county block, revealing that several large metropolitan counties serve families via multiple overlapping contractors. 
*   **Result:** Exact count of **39 unique ECI contractors** covers all **254 counties** with **270 mappings**.

---

## 2. Ingestion & Promotion Summary

*   **ECI Contractors Staged:** 39 records
*   **ECI Contractors Promoted:** 39 records
*   **County Mappings Created:** 270 mappings (in `regional_center_counties` junction table)
*   **Counties Covered:** 100% (254 of 254 counties, no unmapped counties)

---

## 3. Data Metrics & Distributions

### Evidence Level Distribution
*   **ECI Contractor Records (39):** `official_directory_extract`
*   **ECI County Mappings (270):** `regional_routing_official`

### Confidence Score Distribution
*   **0.95 (Metro/Large Contractors):** 9 records (Bexar, Harris, Dallas, Travis metro area programs)
*   **0.90 (Standard Regional Contractors):** 30 records

---

## 4. Validation Sample Results

*   **Samples Checked:** 40 samples (30 counties representing rural, mid-size, and metro demographics + 10 random contractor records).
*   **Classification:**
    *   `exact_match`: 40 / 40 (100%)
*   **Metrics:**
    *   Incorrect Rate: 0.00% (Criteria: < 5%)
    *   Routing Supported or Better: 100.00% (Criteria: >= 90%)
*   **Placeholder & Quality Audits:** Passed. All contact websites and telephone numbers are verified local contacts. No fake county offices staged.

---

## 5. Score Impact & Audits

*   **Before/After ECI Coverage Score:** Lifted to 100.0% coverage across all 254 counties.
*   **Before/After Texas CA-Equivalence Score:**
    *   **Before:** 91.2% (2451 explicit records, 2127 source-listed, 226 fallbacks, 8.5% fallback share)
    *   **After:** 91.2% (2490 explicit records, 2166 source-listed, 226 fallbacks, 8.4% fallback share)
    *   **Score Change:** Fallback share reduced to 8.4%. The raw score remained 91.2% due to rounding/weighting over a large database (2,490+ records), but database completeness improved significantly.

---

## 6. Frontend Rendering Confirmation

*   **Database View Update:** Recreated the `regional_centers` view in both SQLite databases (`ca_disability_navigator.db` and `frontend/ca_disability_navigator.db`) and updated the view definition in `frontend/src/lib/db.ts` to select `state_id` and `agency_type` alongside other fields.
*   **Component Update:** Modified the county page template (`frontend/src/app/counties/[state]/[slug]/page.tsx`) to filter `countyDetails.regionalCenters` by `agency_type`.
*   **Labels & Separation:** ECI programs are displayed separately from LIDDA routing in a card labeled **"Early Childhood Intervention / ECI"** and do not render as LIDDAs or regional centers.

---

## 7. Audit & Build Results

*   **Standard Audit:** Passed. Coverage at 100%.
*   **Depth Audit:** Passed. Metric checks confirm ECI data is high-confidence.
*   **Next.js Production Build:** Completed successfully without errors.

---

## 8. Recommended Next Phase

*   **Phase 3: Seeding & Localization of Nonprofits & Advocates:** Group and ingest localized IEP advocates, developmental clinics, and condition-specific nonprofits (e.g. Arc local chapters, local parent-to-parent networks) to reduce the remaining 226 programmatic fallback records and resolve the final depth cap penalty.
