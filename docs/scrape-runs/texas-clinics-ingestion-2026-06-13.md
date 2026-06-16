# Texas Institutional Clinics Ingestion Run Report (Phase 3B)

**Date:** June 13, 2026  
**State:** Texas (TX)  
**Ingestion Type:** Hospital & University Autism / Developmental Clinics  

---

## 1. Clinic Count Reconciliation & Promotion Details

*   **Count Reconciliation:** The clinic count was reconciled from the initial reference of 10 down to exactly **9 starting clinics** to resolve a prior discrepancy. No 10th clinic was invented.
*   **Clinics Staged:** 9
*   **Clinics Promoted:** 9
*   **Target Table:** `resource_providers`
*   **Physical Counties Mapped:**
    *   **Harris County (`harris-tx`):** 3 clinics
    *   **Dallas County (`dallas-tx`):** 3 clinics
    *   **Tarrant County (`tarrant-tx`):** 1 clinic
    *   **Travis County (`travis-tx`):** 1 clinic
    *   **Lubbock County (`lubbock-tx`):** 1 clinic

---

## 2. Service Area & Localization Logic

To prevent database bloat and fake county-specific claims:
*   **Service-Area Claims Made:** **0**. No clinic was mapped to any county other than its physical headquarter county.
*   **Service-Area Claims Left Unknown / Mapped to Physical Location:** **9**.
    *   *Institutional Regional Unknown:* 5 clinics (Texas Children's, Cook Children's, UT Southwestern CADD, TTUHSC Burkhart, BCM Meyer Center) are marked as `institutional_regional_unknown` (i.e. they serve families across Texas/regions but are physically based in their respective counties, and their exact service coverage boundaries are unspecified).
    *   *Physical Location Only:* 4 clinics (UT Dallas Callier, Dell Children's, UT Health Houston, Children's Health Autism Clinic) are marked as `physical_location_only`.
*   **Counties Served Mapping:** Mapped to null or left empty since the sources do not explicitly specify exact lists of county service areas.
*   **Fallback Replacement:** Mapped strictly to the physical location of the clinics; they do not replace county-level fallback records.

---

## 3. Data Characteristics & Trust Metrics

*   **Evidence Level Distribution:** All 9 records are promoted with `evidence_level = 'hospital_or_university_listing'` (representing direct official pages from reputable clinical institutions).
*   **Confidence Score Distribution:** All 9 records have a confidence score of `0.90` (representing verified direct listings with complete physical address and phone number details).
*   **Verification Status:** All 9 records are set to `verification_status = 'source_listed'`.

---

## 4. Validation Results

*   **Audit Method:** 100% check of all 9 staged records using `node src/scratch/validate_texas_clinics.js`.
*   **Classification Breakdown:**
    *   *Exact Match / Institutional Listing Supported:* 9 / 9 records (100%)
    *   *Incorrect Rate:* 0.00% (Pass Criteria: < 5%)
    *   *Source Supported or Better:* 100.00% (Pass Criteria: >= 90%)
*   **Quality Gating:**
    *   No private provider directory leakage detected.
    *   No appointment/patient portals or login-only URLs were scraped.
    *   No unsupported county/service-area claims mapped.

---

## 5. Before/After Database Audit Scores

*   **Advocates / Providers Score:**
    *   *Before:* 50.0%
    *   *After:* 50.0% (The standard audit score remains capped at 50% due to the statewide localization penalty since we only have 28 unique providers across 254 counties. However, verified institutional clinical depth is established for all major metro hubs).
*   **Texas CA-Equivalence Score:**
    *   *Before:* **92.2%** (following Phase 3A: Nonprofits)
    *   *After:* **93.4%** (+1.2% score lift due to increased density in `resource_providers`).

---

## 6. Build and Audit Verification

*   **Standard Audit:** Passed with all categories green (except the localized provider cap).
*   **Depth Audit:** Passed with **93.4% CA-Equivalence Score**.
*   **Next.js Frontend Build:** Compiled cleanly with no compilation issues or TypeScript compiler errors.

---

## 7. Recommended Next Steps

1.  **Priority Counties Submission:** Submit the pilot counties and programs to the human auditing queue for final verification.
2.  **Sitemap Allowlisting:** Review and append the pilot counties into the `counties.xml` sitemap allowlist to enable Google indexation of the new county-level clinic pages.
3.  **Phase 4: Launch Checklist:** Proceed with final launch checks and database backup.
