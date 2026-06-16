# Georgia Validation Plan

This document establishes the verification plan to guarantee the correctness of the Georgia state upgrade.

## 1. Automated Checks
After each promotion phase, the runner automatically executes:
*   **Standard Audit:** Runs `audit_state_standard.js` for Georgia.
*   **Depth Audit:** Runs `audit_state_depth.js` for Georgia.
*   **Mutation Guard:** Checks that only the allowed tables were modified and that no write-protected records were deleted or modified.
*   **fakeCoverageDetector:** Audits the staged records to ensure no repeated phone numbers, repeated fictional addresses, or county-count mirroring exist.
*   **Rollback SQL Verification:** Checks that the generated rollback SQL matches the changes.
*   **Before/After Diff Verification:** Captures before/after diffs in database records.

## 2. Post-Upgrade Verification
At the end of the full upgrade sequence, the runner executes:
*   **Next.js Production Build:** Compiles the frontend application to confirm that there are no type errors or compile-time failures.
*   **Targeted Playwright Smoke Test:** Runs `npx playwright test e2e/georgia-launch.spec.ts` to verify county directory rendering, terminology, and sitemap exclusion gating.

## 3. Database Constraints Validation
A validation script will verify:
*   **0 Fallback Record Counts:** No records with `data_origin = 'programmatic_fallback'` or ID ending in `-fallback` remain in the database for Georgia.
*   **0 Fake/Placeholder Contacts:** No records in `county_offices`, `state_resource_agencies`, `school_districts`, or `nonprofit_organizations` for Georgia contain `555` phone numbers, mock emails, or placeholder websites.
*   **Statewide Hotline Isolation:** The centralized helpline `(877) 423-4746` is NOT copied into any local county office or school district records.
*   **Correct Catchments:** Mappings in `regional_center_counties` match the 6 DBHDD regions and 1 BCW coordinator.
