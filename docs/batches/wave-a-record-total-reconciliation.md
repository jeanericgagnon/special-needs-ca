# Wave A Record Total Reconciliation

This document reconciles the promoted record counts for the Wave A batch execution.

---

## 1. The 1,088 vs. 1,288 Discrepancy

The initial Wave A summary text reported 1,088 records, while the state-by-state totals summed to 1,288.

### Reconciliation Breakdown:
*   **Pennsylvania (PA):** 67 JFS + 67 DD + 67 EI + 1 Form = **202**
*   **Illinois (IL):** 102 JFS + 102 DD + 102 EI + 1 Form = **307**
*   **Georgia (GA):** 159 JFS + 159 DD + 159 EI + 1 Form = **478**
*   **North Carolina (NC):** 100 JFS + 100 DD + 100 EI + 1 Form = **301**
*   **True Promoted Count:** **1,288**

The value **1,088** was an arithmetic typo that miscalculated the Georgia DFCS counts (excluding its 159 regional records).

---

## 2. Restored Database Verification

Following the rollback execution, we verified the SQLite row counts to confirm that all 1,288 records were successfully reverted:

| Table | PA Count (Post-Rollback) | IL Count (Post-Rollback) | GA Count (Post-Rollback) | NC Count (Post-Rollback) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `county_offices` | 67 | 102 | 159 | 100 | ✓ RESTORED (NC fallbacks restored) |
| `state_resource_agencies` | 0 | 0 | 0 | 0 | ✓ RESTORED (Reverted to 0) |
| `staging_scraped_forms` | 0 | 0 | 0 | 0 | ✓ RESTORED (Reverted to 0) |

All pre-existing curated JFS offices remain fully intact and protected.
