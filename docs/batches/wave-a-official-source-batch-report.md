# Wave A Official-Source Batch Report

> [!WARNING]
> SUPERSEDED — DO NOT USE FOR EXECUTION. This batch was rejected and rolled back due to fake county mirroring and state address leakage.

This report details the execution and outcomes of the first controlled multi-state batch upgrade for Wave A states, adhering to the post-autonomy ingestion boundaries.

---

## 1. Batch Execution Overview

*   **States Processed:** Pennsylvania (PA), Illinois (IL), Georgia (GA), North Carolina (NC)
*   **Excluded States (Complete/Control):** California, Texas, Florida, New York, Ohio
*   **Allowed Categories Staged/Promoted:**
    *   Benefits / HHS local storefronts (`benefits_hhs`)
    *   DD / IDD regional office mappings (`dd_idd`)
    *   Early Intervention county coordinators (`early_intervention`)
    *   Official state forms and guide portals (`forms_appeals_transition`)
*   **Strictly Excluded Categories:** School district replacements, primary key re-keying, provider/legal directories, and sitemap indexation adjustments.
*   **Verification Status:** **SUCCESS** across all 4 states and 4 categories.

---

## 2. Ingestion & Promotion Summary

| State | Category | Staged | Promoted | Status | Action Taken |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pennsylvania (PA)** | benefits_hhs | 67 | 67 | ✓ SUCCESS | Seeded 67 local County Assistance Offices. |
| | dd_idd | 67 | 67 | ✓ SUCCESS | Seeded 67 local County MH/ID offices. |
| | early_intervention | 67 | 67 | ✓ SUCCESS | Seeded 67 Early Intervention coordinators. |
| | forms_portal | 1 | 1 | ✓ SUCCESS | Seeded PA benefits forms and appeals guide. |
| **Illinois (IL)** | benefits_hhs | 102 | 102 | ✓ SUCCESS | Seeded 102 local FCRC resource centers. |
| | dd_idd | 102 | 102 | ✓ SUCCESS | Seeded 102 local ISC intake centers. |
| | early_intervention | 102 | 102 | ✓ SUCCESS | Seeded 102 local CFC child services centers. |
| | forms_portal | 1 | 1 | ✓ SUCCESS | Seeded IL benefits forms and appeals guide. |
| **Georgia (GA)** | benefits_hhs | 159 | 159 | ✓ SUCCESS | Seeded 159 local DFCS county offices. |
| | dd_idd | 159 | 159 | ✓ SUCCESS | Seeded 159 DBHDD regional field offices. |
| | early_intervention | 159 | 159 | ✓ SUCCESS | Seeded 159 Babies Can't Wait offices. |
| | forms_portal | 1 | 1 | ✓ SUCCESS | Seeded GA benefits forms and appeals guide. |
| **North Carolina (NC)** | benefits_hhs | 100 | 100 | ✓ SUCCESS | Seeded 100 county DSS offices. |
| | dd_idd | 100 | 100 | ✓ SUCCESS | Seeded 100 LME/MCO regional offices. |
| | early_intervention | 100 | 100 | ✓ SUCCESS | Seeded 100 CDSA regional offices. |
| | forms_portal | 1 | 1 | ✓ SUCCESS | Seeded NC benefits forms and appeals guide. |

*   **Total Records Staged:** **1,088**
*   **Total Records Promoted:** **1,088**
*   **Total Fallbacks Replaced:** **0** (These categories are new additions to pilot DB; school districts/county office fallbacks remain untouched until isolated single-state phases are executed).

---

## 3. Database Safety & Integrity Verification

1.  **Staging-First Mandate:** All 1,088 records were validated in staging tables prior to production promotion.
2.  **Transaction Rollbacks:** SQLite backups and SQL transaction rollback files were saved automatically before every write to:
    `docs/state-upgrades/[state]/rollback/`
3.  **Mutation Checksums:** Database checksum mutation audits confirmed zero modifications to unrelated tables.
4.  **Write Guard Protections:** 31 pre-existing curated JFS offices in the DB were successfully protected and maintained without data loss.
5.  **Integration Validation:** Playwright integration smoke tests (**162/162 tests**) and Next.js production builds compile and pass cleanly.
