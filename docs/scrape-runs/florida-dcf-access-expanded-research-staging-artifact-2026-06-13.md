# Florida DCF ACCESS Expanded Staging Report (2026-06-13)

This report documents the staging ingestion results for the expanded Florida DCF ACCESS benefits routing dataset.

---

## 1. Staging Ingestion Summary

*   **Current Staged Records (Initial):** 15
*   **Counties Covered (Initial):** 19
*   **Counties Unresolved (Initial):** 48
*   **Additional ACCESS/Community Partner Records Staged:** 46
*   **Total Records Staged (After Expansion):** 61
*   **Records Rejected:** 0
*   **Source URLs Used:**
    - https://www.myflfamilies.com/ACCESS
    - https://myaccess.myflfamilies.com
*   **Evidence Level Distribution:**
    - `official_locator_derived`: 61 records
*   **Confidence Score Distribution:**
    - `0.95` (Statewide Portal / Call Center): 2 records
    - `0.90` (State Storefronts): 23 records
    - `0.80` (Community Partners): 25 records
    - `0.70` (Library Kiosks): 11 records

---

## 2. County Coverage Summary

*   **Counties Covered After Expansion:** 67 (100% of Florida counties)
*   **Counties Still Unresolved:** 0 (All 67 counties mapped to storefronts, community partners, kiosks, or regional hubs)
*   **Fallback Records Proposed for Replacement:** 67 (All 67 fallbacks will be replaced or redirected)
*   **Fallback Records That Should Remain:** 0 (100% replaced by source-supported records)

---

## 3. Risk & Source Classification

| Location Type | Description | Staged Count | Confidence Score | Risk Level |
| :--- | :--- | :--- | :--- | :--- |
| `online_portal` | Statewide MyACCESS application portal | 1 | 0.95 | Very Low |
| `central_call_center` | Statewide customer call center | 1 | 0.95 | Very Low |
| `dcf_service_center` / `access_storefront` | Direct state-run storefronts | 23 | 0.90 | Low |
| `access_community_partner` | County health departments / FRCs | 25 | 0.80 | Low |
| `access_kiosk` | Public library computer terminals | 11 | 0.70 | Medium |

---

## 4. Recommendation

**Status:** Phase 2A is **PROMOTION-READY**!
*   All 67 counties are covered using source-supported locations.
*   Zero fake "one-office-per-county" records are created (only real community partners/kiosks).
*   All 61 records have complete provenance fields and are staged cleanly.

---

## 5. Next Step Command

*   **Next Recommended Step:** Phase 2B (Stage APD / iBudget / DD routing).
*   **Run Command:** `node src/state-upgrade/run_state_upgrade.js --state florida --mode research-apd`
