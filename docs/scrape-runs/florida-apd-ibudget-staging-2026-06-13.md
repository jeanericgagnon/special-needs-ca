# Florida APD / iBudget Staging Report (2026-06-13)

This report documents the staging ingestion results for Florida APD regional offices, waitlist registry, and application forms.

---

## 1. Staging Ingestion Summary

*   **Total Records Proposed in JSON:** 32 (including 15 Family Care Councils and 1 program record)
*   **APD Regional Offices Staged:** 14 (written to `staging_scraped_state_resource_agencies`)
*   **iBudget Program Waitlist Staged:** 1 (written to `staging_scraped_waitlists`)
*   **APD Form 10-007 Staged:** 1 (written to `staging_scraped_forms`)
*   **Family Care Councils Deferred:** 15 records (retained in JSON queue only, skipped SQLite database staging)
*   **iBudget Program Records Proposed:** 1 records (retained in JSON queue only)
*   **Records Rejected:** 0

---

## 2. Validation & Quality Gates

*   **[x] Exactly 14 APD offices staged:** Verified.
*   **[x] All 67 counties mapped to regional APD offices:** Verified.
*   **[x] No county unmapped:** Verified (unmapped count: 0).
*   **[x] No fake county-level APD offices:** Verified (only 14 official regional field offices created).
*   **[x] Complete provenance details:** Verified (all staged records contain `source_url`, `evidence_level`, `data_origin`, `verification_status`, and `confidence_score`).
*   **[x] FCC deferred status:** Verified (all 15 councils marked as deferred and skipped from SQLite staging).
*   **[x] Waitlist metrics source-labeled:** Verified (`duration_label = "Not officially stated"`, `estimate_source_url` and `estimate_source_type` populated).
*   **[x] No production records changed:** Verified (database read-write operations were restricted to staging tables only).

---

## 3. Staged Records Details

### Staged APD Regional Field Offices (`staging_scraped_state_resource_agencies`)

| Field Office | Physical Location | Counties Served | Website |
| :--- | :--- | :--- | :--- |
| Pensacola (FO 1) | Pensacola, FL | Escambia, Okaloosa, Santa Rosa, Walton | [Link](https://apd.myflorida.com/region/) |
| Panama City (FO 2A) | Panama City, FL | Bay, Calhoun, Gulf, Holmes, Jackson, Washington | [Link](https://apd.myflorida.com/region/) |
| Tallahassee (FO 2B) | Tallahassee, FL | Franklin, Gadsden, Jefferson, Leon, Liberty, Wakulla | [Link](https://apd.myflorida.com/region/) |
| Gainesville (FO 3) | Gainesville, FL | Alachua, Bradford, Columbia, Dixie, Gilchrist, Hamilton, Lafayette, Levy, Madison, Putnam, Suwannee, Taylor, Union | [Link](https://apd.myflorida.com/region/) |
| Jacksonville (FO 4) | Jacksonville, FL | Baker, Clay, Duval, Nassau, St. Johns | [Link](https://apd.myflorida.com/region/) |
| Orlando (FO 7) | Orlando, FL | Brevard, Orange, Osceola, Seminole | [Link](https://apd.myflorida.com/region/) |
| Fort Myers (FO 8) | Fort Myers, FL | Charlotte, Collier, Glades, Hendry, Lee | [Link](https://apd.myflorida.com/region/) |
| West Palm Beach (FO 9) | West Palm Beach, FL | Indian River, Martin, Okeechobee, Palm Beach, St. Lucie | [Link](https://apd.myflorida.com/region/) |
| Fort Lauderdale (FO 10) | Fort Lauderdale, FL | Broward | [Link](https://apd.myflorida.com/region/) |
| Miami (FO 11) | Miami, FL | Miami-Dade, Monroe | [Link](https://apd.myflorida.com/region/) |
| Daytona Beach (FO 12) | Daytona Beach, FL | Flagler, Volusia | [Link](https://apd.myflorida.com/region/) |
| Wildwood (FO 13) | Wildwood, FL | Citrus, Hernando, Lake, Marion, Sumter | [Link](https://apd.myflorida.com/region/) |
| Lakeland (FO 14) | Lakeland, FL | Hardee, Highlands, Polk | [Link](https://apd.myflorida.com/region/) |
| Tampa (FO 23) | Tampa, FL | DeSoto, Hillsborough, Manatee, Pasco, Pinellas, Sarasota | [Link](https://apd.myflorida.com/region/) |

### Staged Waitlist Registry (`staging_scraped_waitlists`)

*   **Name:** Florida APD Waiver Waitlist / Interest List
*   **Program ID:** fl-ibudget-waiver
*   **Duration Label:** "Not officially stated" (Informational waitlist only, over 22,000+ individuals estimated but unverified operationally)
*   **Estimate Source URL:** https://apd.myflorida.com/publications/reports/
*   **Estimate Source Type:** official_report
*   **Last Checked At:** 2026-06-13
*   **Description:** Pre-enrollment waitlist for the iBudget waiver. This is informational and subject to change.

### Staged Forms (`staging_scraped_forms`)

*   **Name:** Florida APD Application for Services (Form 10-007)
*   **Program:** fl-ibudget-waiver
*   **Official Download URL:** https://apd.myflorida.com/customers/application/docs/APD%20Application%20for%20Services.pdf
*   **Who Uses It:** Individuals with developmental disabilities applying for APD services.
*   **Where to Send:** The APD regional/field office serving the applicant's physical county of residence.

---

## 4. Family Care Council (FCC) Deferred Queue

The following 15 FCC records are deferred to the nonprofit/support resources phase and are stored only in the JSON queue:
*   Statewide: Family Care Council Florida (Statewide)
*   Regional: Family Care Councils for Areas 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, and 14.

---

## 5. Recommendation

**Status:** Phase 2B is **PROMOTION-READY**!
*   All validations are passed successfully.
*   No database production records were modified or deleted.
*   County-level routing mapping is fully prepared.

---

## 6. Next Step Command

To promote these records to production:
`node src/state-upgrade/run_state_upgrade.js --state florida --mode promote-apd` (to be implemented next)
