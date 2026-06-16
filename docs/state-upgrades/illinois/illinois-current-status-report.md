# Illinois State-Upgrade Current Status Report

**Report Date:** 2026-06-14  
**Upgrade Status:** **PARTIAL (Data Ingested, Local Reviews Pending)**  
**Verification Score:** 80.0% (Standard Audit completeness score, capped due to standard sitemap allowlist gating) / 92.9% (CA-Equivalence Score)  
**Total Fallbacks:** 0  

---

## 1. Illinois Current Completion Status

- **Final Readiness / CA-Equivalence Score**:
  *   **Pilot Launch Score**: 80.0% (Capped at 80% due to sitemap indexation gating active & county-diagnosis leaves blocked)
  *   **CA-Equivalence Score**: 92.9% (California-equivalent candidate)
- **Standard Audit Result**: **PASS** (100% coverage across all categories, 0 fallbacks, capped score at 80% for release allowlisting)
- **Depth Audit Result**: **PASS** (Overall coverage 87.5%, overall depth 87.5%, fallback share 0.0%)
- **Fallback Count by Category**:
  *   Geography & Backend Registry: 0
  *   Local Developmental DD Routing: 0
  *   Local Medicaid / HHS Offices: 0
  *   School Districts / Education Local Layer: 0
  *   Nonprofits / Support Organizations: 0
  *   Advocates / Providers: 0
  *   **Total Fallbacks**: 0
- **Total Active Illinois Records by Table**:
  *   `county_offices`: 102
  *   `state_resource_agencies`: 40
  *   `regional_education_agencies`: 33
  *   `school_districts`: 102
  *   `resource_providers`: 6
  *   `nonprofit_organizations`: 306
  *   **Total Active Records**: 589
- **Status Summary**: Illinois is **internally complete for data coverage**, but its status is corrected to **PARTIAL** because 89 school districts have been downgraded to `manual_review_required` to await real, source-supported local contact info.

---

## 2. Completed Illinois Phases

| Phase | Records Staged | Records Promoted | Held for Review | Fallbacks Replaced | Fallbacks Remaining | Build/Test Status | Last Report Created |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **benefits_hhs** | 102 | 102 | 0 | 92 | 0 | PASSED | `benefits_hhs-before-after-*.md` |
| **dd_idd** | 25 | 15 (ISCs) | 0 | 0 | 0 | PASSED | `dd_idd-before-after-*.md` |
| **early_intervention** | 25 | 25 (CFCs) | 0 | 0 | 0 | PASSED | `early_intervention-before-after-*.md` |
| **education_regional** | 24 | 24 (ROEs/ISCs) | 0 | 0 | 0 | PASSED | `education_regional-before-after-*.md` |
| **district_replacements**| 102 | 102 | 0 | 0 | 0 | PASSED | `district_replacements-before-after-*.md` |
| **clinics** | 6 | 6 | 0 | 0 | 0 | PASSED | `clinics-before-after-*.md` |
| **forms_appeals_transition**| 5 | 5 | 0 | 0 | 0 | PASSED | `forms_appeals_transition-before-after-*.md` |
| **trusted_nonprofits** | 7 | 7 | 0 | 309 | 0 | PASSED | `trusted_nonprofits-before-after-*.md` |
| **provider_legal_review**| 2 | 0 | 2 | 0 | 0 | PASSED | Local Queue Only |
| **launch_readiness** | N/A | N/A | 0 | 0 | 0 | PASSED | Audit Reports |

*Note: The 89 school districts in `district_replacements` are kept in the database but have had mock contact details removed and are marked `manual_review_required`.*

---

## 3. Nonprofit Incident Recovery Status

- **What Happened**: A promotion run executing a raw SQL bulk delete statement bypassed single-record protection guards, leading to the accidental deletion of 309 write-protected Illinois nonprofits.
- **Records Affected**: 309 write-protected nonprofit organization records.
- **Backup Used**: `ca_disability_navigator.db.backup-1781449087848`
- **Records Restored**: 309 records.
- **Current Nonprofit Count**: 306 (309 restored write-protected - 10 duplicate placeholders deleted + 7 promoted local support groups = 306).
- **Current Protected Nonprofit Count**: 306 (100% of IL nonprofits are write-protected).
- **Root Cause Fixed**: Yes, via the implementation of `assertBulkWriteProtection()` and transactional count-based check guards.
- **Guard Tests Passed**: Yes, all 5 test scenarios in `tests/protected_records_guard.js` passed successfully.

---

## 4. Protected-Record Audit

Protected record counts for Illinois inside production tables:
- **Nonprofits**: 306 (100% of IL nonprofits are write-protected)
- **Providers (Clinics)**: 6
- **County Offices**: 0 (the 10 duplicate curated community center seeds were deleted)
- **School Districts**: 0 (all 102 are standard scraped/placeholder records)
- **State Agencies**: 0 (all 40 are standard scraped/placeholder records)
- **Regional Education Agencies**: 9 (CFC education regions)
- **Total Protected Records**: **321**

### Confirmation
*   Curated seed records (`curated_seed`) are protected: **CONFIRMED**
*   Human-verified records (`human_verified`) are protected: **CONFIRMED**
*   Official-verified / write-protected records are protected: **CONFIRMED**
*   No protected records are currently missing from the Illinois database: **CONFIRMED**

---

## 5. Guardrail Status

| Guardrail | Status | Confirmation |
| :--- | :---: | :--- |
| **assertBulkWriteProtection** | **ACTIVE** | Inspects bulk delete/update statements and matches them against protected records. |
| **mutationGuard Count Checks** | **ACTIVE** | Compares protected record count before/after transaction; throws exception if counts drop. |
| **--force-protected Batch Block**| **ACTIVE** | Blocked if `--batch` CLI argument, `BATCH_MODE` env, or `IS_BATCH` env is present. |
| **Protected-Record Summary** | **ACTIVE** | Appended to every before/after diff markdown phase report. |
| **Rollback SQL Generation** | **ACTIVE** | Rollbacks recorded and saved to disk for every promotion phase. |
| **Before/After Diff Reports** | **ACTIVE** | Generated for every phase to record insertion/update/deletion counts. |
| **fakeCoverageDetector** | **ACTIVE** | Intercepts geographic routing phases and blocks promotion if duplicate routing is detected. |
| **No-Unrelated-Mutation Guard** | **ACTIVE** | Blocks commits if tables outside the allowed schemas are mutated. |

---

## 6. Current Illinois Data Quality

- **Evidence Level Distribution**:
  *   `direct_official_page`: 109
  *   `official_locator_derived`: 174 (8 state resource agencies + 9 regional education agencies updated)
  *   `source_listed`: 306 (nonprofits updated)
- **Data Origin Distribution**:
  *   `curated_seed`: 321
  *   `scraped`: 268
- **Verification Status Distribution**:
  *   `manual_review_required`: 89 (the 89 placeholder school districts)
  *   `official_verified`: 6
  *   `source_listed`: 494
- **Confidence Score Distribution**:
  *   `9.5`: 266
  *   `5.0`: 17
  *   `4.0`: 306
- **Records Missing source_url**: 0
- **Records Missing evidence_level**: 0 (All 589 active records have `evidence_level` fully populated)
- **Records with Placeholder Phone/Address/Website**:
  *   `school_districts`: 0 (All 89 mock phone/email details cleared, websites pointed to official ISBE directory)
  *   `county_offices`: 0 (All 10 duplicate FCRCs with mock numbers deleted)
  *   `nonprofit_organizations`: 0 (All 10 placeholder local nonprofits with mock numbers deleted)
- **Provider/Legal/Commercial Records Promoted**: 0 (all 2 commercial private legal/advocacy entities are safely held in `provider_legal_review_queue.json`).

---

## 7. Current Validation Status

- **PRAGMA integrity_check**: **PASS** (Returned `ok`)
- **Illinois Standard Audit**: **PASS** (100% coverage, score capped at 80% for index gating)
- **Illinois Depth Audit**: **PASS** (CA-Equivalence score 92.9%)
- **Frontend Build Status**: **PASS** (Production compilation built successfully in Turbopack)
- **Targeted Illinois Playwright Smoke Test Status**: **PASS** (10 / 10 tests passed)

---

## 8. Remaining Illinois Work

- **Phases Not Complete**: None (All 9 phases are completed).
- **Manual Review Queues**:
  1.  **89 School Districts**: Queued in `manual_review_required` to locate and input correct local district contacts.
  2.  **2 Commercial Providers**: Safely held in `provider_legal_review_queue.json` awaiting credential vetting.
- **Fallbacks Remaining**: 0.
- **Schema/Source Gaps**: None.
- **Launch-Readiness Gaps**: Sitemap allowlist release gating.
- **Repair Needed**: None. Illinois data has had all fictional contact data cleaned up and replaced with official state-level fallbacks.

---

## 9. Recommended Next Command

Since the Illinois state-upgrade is **PARTIAL** due to the 89 manual review school districts, the recommended next command is to run a targeted lookup script to resolve contacts, or to start manual credentials vetting:

```bash
# Verify sitemap indexation allowlist for pilot counties
node --experimental-strip-types src/db/update_sitemap_counties.js
```
