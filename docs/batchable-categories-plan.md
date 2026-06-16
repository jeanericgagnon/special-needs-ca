# Batchable Categories Plan

This document details the categories that can be processed, staged, and promoted in multi-state batches, as well as the categories that must remain strictly isolated on a state-by-state basis.

> [!NOTE]
> **Ohio was the post-autonomy control state and has successfully PASSED all gates.**
> 
> Multi-state batch ingestion is now ACTIVE only for approved low-risk categories.
> School district replacements and district-level expansions remain strictly isolated state-by-state. Ohio's success must not be used to justify batching school district replacements.

---

## 1. Batchable Categories (Multi-State Executions)

The state-upgrade runner's generic architecture allows certain categories to be compiled and ingested across multiple states simultaneously. These are typically centralized state-level resources or national organization chapters.

### Category A: State Forms, Appeals, VR, and ABLE Programs
*   **Why it's batchable:** Every state has a single ABLE savings program (often managed by the state treasurer), a single vocational rehabilitation (VR) agency, and a handful of core state-level appeal forms (like Medicaid fair hearing request PDFs).
*   **Batching Strategy:** Compile forms and ABLE links for a wave (e.g. 5–10 states) into a single batch JSON, and run the staging command in a loop.

### Category B: DD / IDD Regional Office Mappings (SUSPENDED FROM BATCH PROMOTION)
*   **Status:** **SUSPENDED**. DD regional office routing is suspended from batch promotion due to the high risk of fake county-count mirroring. It may only be batched in research/staging validation mode. Promotion must remain state-specific and catchment-aware.

### Category C: Medicaid storefront/DSS Office Locators (SUSPENDED FROM BATCH PROMOTION)
*   **Status:** **SUSPENDED**. HHS storefront routing is suspended from batch promotion due to the risk of cross-state address leakage. Local benefits routing must remain state-specific.

---

## 2. Strictly State-by-State Categories (Manual/Isolated)

Due to structural fragmentation, high data volumes, or verification liabilities, the following categories must **never** be batched and must remain strictly isolated within individual state upgrades:

### Category A: Local School Districts & Special Education Contacts
*   **Why it must remain isolated:** School districts are highly fragmented (e.g., Illinois has over 850 districts; Pennsylvania has 500). Upgrading them requires:
    1.  **Primary Key Re-keying:** Renaming placeholders like `sd-county-state-fallback` to official IDs.
    2.  **Reference Audits:** Scanning all other tables (providers, nonprofits) database-wide to ensure no orphan records are created.
    3.  **Local Terminology Adapters:** NY uses BOCES, FL uses FDLRS/School Boards, CA uses SELPAs.
*   **Rule:** Run school district replacements only in isolated, single-state transactions with active database backups.

### Category B: Private Providers and Legal Review Queue
*   **Why it must remain isolated:** Private speech/OT/PT therapists, ABA clinics, and special education attorneys carry high liability. Auto-promoting unchecked listings can lead to credential fraud or SEO spam.
*   **Rule:** All commercial providers must land in `provider_legal_review_queue.json` locally for that specific state. They must undergo manual verification before being promoted.

### Category C: Major Metropolitan Exceptions
*   **Why it must remain isolated:** Major cities often deviate from state-wide routing models. For example, New York City bypasses county DSS offices in favor of the centralized HRA, and divides municipal Early Intervention into 5 borough offices instead of county health departments.
*   **Rule:** Metropolitan anomalies must be handled via custom mapping logic within the state's configuration files.

---

## 3. Testing Policy for Batch Upgrades

To prevent E2E testing from slowing down batch migrations, we enforce the following validation checkpoints:

1.  **Staged Phase Promotions**:
    After every individual state/phase promotion in a batch, run the fast local integrity suite:
    *   `audit_state_standard.js` & `audit_state_depth.js` for that state.
    *   `assertMutationSafety` checksum checks.
    *   `fakeCoverageDetector` checks if regional catchments are modified.
    *   Rollback SQL and diff report validation.
    *   *Do not run the build or Playwright tests at this stage.*
2.  **State-Level Boundaries**:
    At the completion of a full state upgrade sequence:
    *   Trigger `npm run build --prefix frontend`.
    *   Execute only the targeted smoke test: `npx playwright test e2e/[state]-launch.spec.ts`.
3.  **End of Batch/Integrated Runs**:
    At the very end of the entire batch migration:
    *   Trigger a clean production compile `npm run build --prefix frontend`.
    *   Execute the full Playwright E2E suite (`npx playwright test`) to guarantee zero regression across all states.
4.  **Immediate Build Gating**:
    If a batch category changes route paths, noindex/indexing rules, sitemap generation, or database schema structures, you must trigger a full Next.js production build check immediately to fail fast.
