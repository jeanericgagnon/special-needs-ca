# Florida Early Steps Staging Report (2026-06-13)

This report documents the staging ingestion results for Florida Early Steps regional program portals.

---

## 1. Staging Ingestion Summary

*   **Total Records Proposed in JSON:** 15
*   **Early Steps Portals Staged:** 15 (written to `staging_scraped_state_resource_agencies`)
*   **Records Rejected:** 0

---

## 2. Validation & Quality Gates

*   **[x] Exactly 15 Early Steps portals staged:** Verified.
*   **[x] All 67 counties mapped to regional portals:** Verified.
*   **[x] No county unmapped:** Verified (unmapped count: 0).
*   **[x] No fake county-level Early Steps offices:** Verified (only 15 official regional portals created).
*   **[x] Every staged record has source_url:** Verified.
*   **[x] Complete provenance details:** Verified (all staged records contain `source_url`, `evidence_level`, `data_origin`, `verification_status`, and `confidence_score`).
*   **[x] No production records changed:** Verified (database read-write operations were restricted to staging tables only).

---

## 3. Metadata & Score Distributions

### Evidence Level Distribution
*   **official_locator_derived:** 15 record(s)

### Confidence Score Distribution
*   **0.9:** 15 record(s)

---

## 4. Staged Records Details

### Staged Early Steps Regional Portals (`staging_scraped_state_resource_agencies`)

| Program Portal | Physical Location | Counties Served | Website |
| :--- | :--- | :--- | :--- |
| Western Panhandle Early Steps | 5150 Bayou Boulevard, Suite 1-N, Pensacola, FL 32503 | escambia, santa-rosa, okaloosa, walton | [Link](https://www.floridaearlysteps.com) |
| Big Bend Early Steps | 1801 Miccosukee Commons Drive, Tallahassee, FL 32308 | leon, gadsden, jefferson, madison, taylor, wakulla, franklin, liberty, bay, calhoun, gulf, holmes, jackson, washington | [Link](https://www.floridaearlysteps.com) |
| Northeastern Early Steps | 910 North Jefferson Street, Jacksonville, FL 32209 | baker, bradford, clay, duval, nassau, st-johns | [Link](https://www.floridaearlysteps.com) |
| North Central Early Steps | 1701 SW 16th Ave., Building B, Gainesville, FL 32608 | alachua, columbia, dixie, gilchrist, hamilton, lafayette, levy, marion, suwannee, union | [Link](https://www.floridaearlysteps.com) |
| North Beaches Early Steps | 125 N. Ridgewood Ave., Daytona Beach, FL 32114 | flagler, lake, putnam, sumter, volusia | [Link](https://www.floridaearlysteps.com) |
| Central Florida Early Steps | 601 West Michigan Street, Orlando, FL 32805 | orange, osceola, seminole | [Link](https://www.floridaearlysteps.com) |
| Bay Area Early Steps | 13101 North Bruce B. Downs Boulevard, Tampa, FL 33612 | hillsborough, polk | [Link](https://www.floridaearlysteps.com) |
| West Central Early Steps | Johns Hopkins All Children's Hospital, 480 7th Avenue South, St. Petersburg, FL 33701 | citrus, hernando, pasco, pinellas | [Link](https://www.floridaearlysteps.com) |
| Gulf Central Early Steps | Health Planning Council, 4630 17th Street, Sarasota, FL 34235 | charlotte, desoto, hardee, highlands, manatee, sarasota | [Link](https://www.floridaearlysteps.com) |
| Southwest Florida Early Steps | 12220 Towne Lake Dr, Ft. Myers, FL 33913 | collier, lee, hendry, glades | [Link](https://www.floridaearlysteps.com) |
| Gold Coast Early Steps | Children's Diagnostic & Treatment Center, 1401 South Federal Highway, Ft. Lauderdale, FL 33316 | broward | [Link](https://www.floridaearlysteps.com) |
| North Dade Early Steps | University of Miami, 1601 N.W. 12th Avenue, Miami, FL 33136 | miami-dade | [Link](https://www.floridaearlysteps.com) |
| Southernmost Coast Early Steps | 7990 SW 117th Ave, Suite 125, Miami, FL 33183 | miami-dade, monroe | [Link](https://www.floridaearlysteps.com) |
| Space Coast Early Steps | 1802 S Fiske Blvd, Suite 201, Rockledge, FL 32955 | brevard | [Link](https://www.floridaearlysteps.com) |
| Treasure Coast Early Steps | 213 South Congress Avenue, West Palm Beach, FL 33409 | palm-beach, martin, st-lucie, indian-river, okeechobee | [Link](https://www.floridaearlysteps.com) |

---

## 5. Recommendation

**Status:** Phase 2C is **PROMOTION-READY**!
*   All validations are passed successfully.
*   No database production records were modified or deleted.
*   County-level routing mapping is fully prepared.

---

## 6. Next Step Command

To promote these records to production:
`node src/state-upgrade/run_state_upgrade.js --state florida --mode promote-early-steps` (to be implemented next)
