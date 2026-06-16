# Incident Postmortem: Illinois Protected Nonprofits Deletion

**Incident Date:** 2026-06-14  
**Severity:** Critical (Data Deletion of Protected Records)  
**Status:** Resolved & Permanently Guarded  

---

## Executive Summary

During the state-upgrade promotion phase for Illinois (IL), **309 write-protected nonprofit organizations** were silently deleted from the production database. The deletion was caused by a bulk `DELETE` query executing in `run_state_upgrade.js` that bypassed single-record safety checks.

The records have been fully restored from a clean database backup, and permanent safety guardrails have been added to the runner to prevent any future silent deletions or modifications of write-protected records.

---

## 1. Incident Details

### What Records Were Lost?
A total of **309 write-protected nonprofit records** belonging to the state of Illinois. These records had curation origins/statuses (e.g. `curated_seed`, `human_verified`, `official_verified`, or `write_protected`).

### Affected Table
`nonprofit_organizations`

### Command/Query That Caused Deletion
The deletion occurred during the promotion of the `trusted_nonprofits` phase. The upgrade runner executed a raw SQLite bulk delete command to clear out existing nonprofit records matching the county suffix:
```javascript
const deleteStmt = db.prepare("DELETE FROM nonprofit_organizations WHERE county_id LIKE ?");
deleteStmt.run(`%${stateConfig.county_id_suffix}`);
```

---

## 2. Root Cause Analysis

### Why Were Protected Records Not Blocked?
1. **Bypassed Single-Record Checks**: The runner utilized `assertWriteProtection(db, tableName, recordId)` to block modifications to individual protected records. However, the `trusted_nonprofits` phase cleared existing records using a raw SQL **bulk delete** statement (`DELETE FROM nonprofit_organizations WHERE county_id LIKE ?`).
2. **No Bulk Query Inspection**: The bulk deletion did not query the targeted rows beforehand to verify if any protected records fell within the deletion scope. As a result, the database engine executed the delete operation directly, bypassing the single-record application-level write guards.

---

## 3. Restoration and Recovery

### Backup Used
`ca_disability_navigator.db.backup-1781449087848`

### Recovery Method
A recovery script (`restore_and_cleanup_il.py`) was executed to:
1. Extract the 309 write-protected nonprofit records from the backup database.
2. Re-insert them into the `nonprofit_organizations` table of `ca_disability_navigator.db` under a transaction.
3. Clean up 92 leftover Medicaid programmatic fallback offices (`off-*-il-medicaid`) from the `county_offices` table that were replaced by scraped FCRCs.

### Verification After Restore
Ran the Illinois standard audit:
```bash
node --experimental-strip-types src/db/audit_state_standard.js illinois
```
**Results:**
*   **Nonprofits Coverage Score:** 100% (316 records, including the 309 restored write-protected records).
*   **Medicaid Fallbacks Count:** 0.
*   **Playwright Smoke Tests:** All Illinois E2E test scenarios passed successfully.

---

## 4. Permanent Guardrails & Code Fix

To prevent this class of bug from ever occurring again, the following safety mechanisms have been implemented:

### 1. Bulk Write Protection Guards
Added `assertBulkWriteProtection(db, tableName, whereClause, whereArgs, forceProtected)` to [src/state-upgrade/lib/protectionGuards.js](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/src/state-upgrade/lib/protectionGuards.js).
Before running a bulk `DELETE` or `UPDATE` query, the runner now issues a query to select all matching records' IDs and checks if any record meets the protection criteria:
*   `data_origin` is `curated_seed` or `write_protected`
*   `verification_status` is `human_verified`, `official_verified`, or `write_protected`

If any matching record is protected, the command throws a `Write Guard Violation` and aborts.

### 2. Transaction Phase Count Check (Mutation Guard)
Added count-based protection checks in [src/state-upgrade/lib/mutationGuard.js](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/src/state-upgrade/lib/mutationGuard.js):
*   `getProtectedRecordCounts(db)` counts all protected records across all database tables before a transaction.
*   `assertProtectedCountsSafety(preCounts, postCounts, forceProtected)` compares pre- and post-transaction counts.
*   If the post-transaction count is lower than the pre-transaction count for any table, a `Promotion Guard Violation` is thrown, rolling back the transaction.

### 3. CLI --force-protected Constraints
*   Bypassing the write guards requires passing the explicit flag `--force-protected`.
*   **Batch Mode Block**: The `--force-protected` flag is strictly blocked when batch mode is active (`BATCH_MODE=true`, `IS_BATCH=true`, or `--batch` is in CLI arguments) to prevent accidental bulk overrides.

### 4. Phase Reports Integration
The before/after diff reporter now appends a **Protected-Record Summary** displaying counts before and after the phase, ensuring visibility.

---

## 5. Verification Tests Added
An automated integration test has been added to [tests/protected_records_guard.js](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/tests/protected_records_guard.js) that:
1. Inserts a dummy write-protected nonprofit record in a test database instance.
2. Asserts that running a promotion phase that targets that county fails with a `Write Guard Violation`.
3. Asserts that passing `--force-protected` bypasses the check.
4. Asserts that attempting to use `--force-protected` in batch mode throws an immediate validation error.
