# Florida DCF ACCESS Staging Report (2026-06-13)

This report documents the staging ingestion results for Florida DCF ACCESS local offices.

---

## 1. Staging Ingestion Summary

*   **Records Proposed:** 61
*   **Records Staged:** 61
*   **Records Rejected:** 0
*   **Source URLs Used:**
    - https://www.myflfamilies.com/ACCESS
*   **Evidence Level Distribution:**
    - `official_locator_result`: 23 records
    - `source_listed`: 25 records
    - `official_locator_derived`: 11 records
    - `statewide_routing_official`: 2 records
*   **Confidence Score Distribution:**
    - `0.9`: 61 records

---

## 2. County Coverage Summary

*   **Counties Mapped Directly:** 14 (Alachua, Brevard, Broward, Duval, Hillsborough, Lee, Leon, Miami-Dade, Orange, Palm Beach, Pasco, Pinellas, Polk, Seminole).
*   **Regional Mappings (Rural):** 2 (Jacksonville FRC serving Baker, Clay, Nassau, St. Johns; Panama City FRC serving Calhoun, Bay, Gulf, Washington, Holmes).
*   **Counties Covered:** 19 (14 direct + 5 regional).
*   **Counties Not Covered (Remaining Fallbacks):** 48 (To be mapped to regional hubs in subsequent runs).

---

## 3. Staged Records Details (Proposed for Promotion)

| County ID | Storefront / FRC Name | Physical Address | Routing Type |
| :--- | :--- | :--- | :--- |
| `alachua-fl` | DCF ACCESS Service Center - Gainesville | 1000 NE 16th Ave, Gainesville, FL 32601 | Direct |
| `brevard-fl` | DCF ACCESS Service Center - Rockledge | 375 Commerce Pkwy, Rockledge, FL 32955 | Direct |
| `broward-fl` | DCF ACCESS Service Center - Fort Lauderdale | 1400 W Commercial Blvd, Fort Lauderdale, FL 33309 | Direct |
| `duval-fl` | DCF ACCESS Service Center - Jacksonville | 5920 Arlington Expressway, Jacksonville, FL 32211 | Regional Hub |
| `hillsborough-fl` | DCF ACCESS Service Center - Tampa | 1313 N Tampa St, Tampa, FL 33602 | Direct |
| `lee-fl` | DCF ACCESS Service Center - Fort Myers | 2295 Victoria Ave, Fort Myers, FL 33901 | Direct |
| `leon-fl` | DCF ACCESS Service Center - Tallahassee | 2810 Sharer Rd, Tallahassee, FL 32303 | Direct |
| `miami-dade-fl` | DCF ACCESS Service Center - Miami | 1490 NW 27th Ave, Miami, FL 33125 | Direct |
| `orange-fl` | DCF ACCESS Service Center - Orlando | 400 W Robinson St, Orlando, FL 32801 | Direct |
| `palm-beach-fl` | DCF ACCESS Service Center - West Palm Beach | 111 S Sapodilla Ave, West Palm Beach, FL 33401 | Direct |
| `pasco-fl` | DCF ACCESS Service Center - New Port Richey | 7623 Little Rd, New Port Richey, FL 34654 | Direct |
| `pinellas-fl` | DCF ACCESS Service Center - Largo | 11351 Ulmerton Rd, Largo, FL 33778 | Direct |
| `polk-fl` | DCF ACCESS Service Center - Lakeland | 200 N Kentucky Ave, Lakeland, FL 33801 | Direct |
| `seminole-fl` | DCF ACCESS Service Center - Lake Mary | 1301 S International Pkwy, Lake Mary, FL 32746 | Direct |
| `bay-fl` | DCF ACCESS Service Center - Panama City | 2505 W 15th St, Panama City, FL 32401 | Regional Hub |

---

## 4. Unresolved Routing Questions

1.  **Community Partner Directory Ingestion:** Should we map the 100+ ACCESS community partner kiosks in rural areas in subsequent stages, or keep the routing clean using regional storefront hubs only?

---

## 5. Explicit DB & Sitemap Gate Confirmations

*   [x] **No production records changed:** SQLite `county_offices` production table remains unmodified.
*   [x] **No fallback records deleted:** Fallbacks are preserved.
*   [x] **No sitemap/indexing changes occurred:** Sitemap routing configuration is untouched.

---

## 6. Next Upgrade Steps

*   **Next Recommended Phase:** Phase 2B (Stage APD / iBudget / DD routing).
*   **Run Command:** `node src/state-upgrade/run_state_upgrade.js --state florida --mode research-apd`
