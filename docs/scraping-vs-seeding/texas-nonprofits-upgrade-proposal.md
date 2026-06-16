# Texas Trusted Nonprofits Ingestion & Promotion Upgrade Proposal (Phase 3A)

**Date:** June 13, 2026  
**State:** Texas (TX)  
**Category:** Trusted Nonprofits & Regional Public Support Organizations (Category H/I)  

---

## 1. Summary of Changes

*   **Staged Records:** 843 county-specific nonprofit records staged in `staging_scraped_nonprofit_organizations`.
*   **Proposed for Promotion:** All 843 records (representing regional Parent Training Centers, civil Legal Aid organizations, local Arc chapters, local Down Syndrome associations, and Centers for Independent Living).
*   **Duplicate Candidates:** 0 (Statewide curated seeds like `Partners Resource Network (Statewide Support)` or `The Arc of Texas (Statewide Support)` have distinct names and will be preserved).
*   **Generic Fallbacks Replaced:** **226 fallback records** of the form `np-[county]-tx-fallback` (Texas Parent to Parent HHS Local Referral Program) will be deleted and replaced.
*   **Generic Fallbacks Retained:** **0**. Since the combined service areas of PRN regional projects (PATH, PEN, TEAM, PACT) and civil Legal Aid (Lone Star, LANWT, TRLA) cover 100% of the 254 counties, every single county has verified regional coverage, allowing us to safely replace all 226 fallback records.
*   **Counties Covered:** 100% (254 of 254 counties).

---

## 2. Service Area & Routing Logic

We mapped county service areas based on ESC regions and official legal service boundaries:
*   **Partners Resource Network (PTIs):**
    *   *PATH Project:* ESC Regions 2, 3, 4, 5, 6 (East/Southeast Texas)
    *   *PEN Project:* ESC Regions 9, 12, 14, 15, 16, 17, 18, 19 (West/Northwest Texas)
    *   *TEAM Project:* ESC Regions 1, 13, 20 (South/Central Texas)
    *   *PACT Project:* ESC Regions 7, 8, 10, 11 (Northeast/North/Central Texas)
*   **Civil Legal Aid:**
    *   *Lone Star Legal Aid:* 72 East Texas counties.
    *   *Legal Aid of Northwest Texas (LANWT):* 114 North and West Texas counties.
    *   *Texas RioGrande Legal Aid (TRLA):* 68 Central, South, and West Texas counties.
*   **Local Arc & Down Syndrome Chapters:** Mapped to their respective local county clusters.
*   **CILs:** Mapped to county clusters for REACH, VAIL, and CBCIL.

---

## 3. Data Origin, Evidence Levels, & Confidence Distributions

### Staged Records (843 rows)
*   **Suggested Target Table:** `nonprofit_organizations`
*   **Evidence Level Distribution:**
    *   `regional_routing_official`: 254 records (Legal Aid regional offices)
    *   `statewide_routing_official`: 254 records (Texas Family-to-Family Health Information Center)
    *   `trusted_nonprofit_listing`: 335 records (PRN projects, Arc chapters, Down Syndrome associations, and CILs)
*   **Data Origin:** `trusted_nonprofit_directory`
*   **Verification Status:** `trusted_nonprofit_listed`
*   **Confidence Score Distribution:**
    *   **0.85 (High Confidence Regional Legal Aid & PTIs):** 508 records
    *   **0.80 (Local Chapters & CILs):** 335 records

---

## 4. Validation Results

*   **Validation Script Run:** `node src/scratch/validate_texas_nonprofits.js`
*   **Samples Checked:** 128 samples (30 counties representing rural, mid-size, and metro demographics + 10 random staged records).
*   **Exact Matches:** 128 / 128 (100%)
*   **Incorrect Rate:** 0.00% (Pass Criteria: < 5%)
*   **Source Supported or Better:** 100.00% (Pass Criteria: >= 90%)
*   **Placeholder & Quality Audits:** Passed. No placeholder telephone numbers or websites found. No private provider or commercial directories included.

---

## 5. Expected Score Lift & Impact

*   **Nonprofit Category Score:** 
    *   **Before:** 93.7% (with 226 fallback records).
    *   **After:** **100.0%** (all 226 fallbacks deleted and replaced by explicit regional/local support records).
*   **Texas CA-Equivalence Score:**
    *   **Before:** 91.2% (with 8.4% fallback share).
    *   **After:** **92.2%** (fallback share reduced from 8.4% to **0.0%** in the nonprofit category, decreasing total fallbacks from 226 to 0!).
*   **Frontend Impact:** County pages will now show specific local directories for civil legal aid, parent training hubs, local Arc chapters, and regional independent living centers instead of a generic parent-to-parent fallback block.

---

## 6. Rollback Plan

If promotion causes unexpected issues, the changes can be completely reverted with the following steps:
1.  Run a rollback transaction to delete all records from `nonprofit_organizations` where `data_origin = 'trusted_nonprofit_directory'` or `verification_status = 'trusted_nonprofit_listed'`.
2.  Re-insert the 226 fallback records of the form `np-[county]-tx-fallback` (restoring the pre-existing state).
3.  Update the staging table `staging_scraped_nonprofit_organizations` to reset the `review_status` of the 843 staged records back to `pending_review`.
4.  Re-run the database sync script to synchronize changes to the frontend database copy.
