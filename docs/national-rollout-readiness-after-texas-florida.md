# National Rollout Readiness Report (Post-Texas & Florida)

This report evaluates the feasibility, strategy, and risk factors of scaling state-upgrades nationwide following the successful completion of the Texas and Florida state upgrades.

---

## 1. Automation Capabilities

Through the Texas and Florida upgrades, several components of the state-upgrade process have been successfully standardized and can now be fully automated:

*   **Database Ingestion & Validation:** Checks for database constraints, duplicate records, FIPS county code matches, and county coverage completeness are fully automated inside `run_state_upgrade.js`.
*   **Next.js Compile Verification:** Compiling the static routes and verifying there are no syntax or type compilation errors can be run in any local or CI environment automatically.
*   **Playwright E2E Smoke Tests:** Testing for sitemap routing, page load stability, California/Texas terminology leakage, H1 presence, and indexation tags (`noindex` headers) is fully automated.
*   **Evidence Level & Confidence Scoring:** Mapping evidence levels (`direct_official_page`, `official_locator_derived`) and scoring confidence based on provenance is automated based on ingestion rules.

---

## 2. Gated Checkpoints (Must Remain Manual)

While many steps are automated, the following key gates must remain manual to prevent regressions:

*   **Primary-Key Re-keying Audits:** Renaming primary keys of fallback records to clean county-level IDs in production requires manual verification of schema foreign-key dependencies.
*   **Private Provider/Legal Vetting:** Commercial entities, IEP lawyers, and private clinics must be written to a local `provider_legal_review_queue.json` file for manual review of credentials and licensing before promotion.
*   **Search Engine Indexation (GSC):** Adding states to the sitemap allowlist and requesting public indexation on Google Search Console must remain a gated step triggered only after live production domain testing passes.

---

## 3. Ingestion Strategies: Batch vs. Single-State

To scale efficiently without sacrificing quality, we categorize resource ingestion into two distinct strategies:

### Categories That Can Batch Across States
These resources are highly standardized, rely on unified national schemas, or have single statewide portals:
1.  **ABLE Accounts:** Every state has a single, standardized ABLE savings program. ABLE data can be batched for all 50 states simultaneously.
2.  **Vocational Rehabilitation (VR):** Statewide VR agencies can be mapped and ingested using a nationwide template.
3.  **Statewide Forms:** Standardized forms (Medicaid intake, SSI child application, expedited appeal templates) can be seeded using general rules.
4.  **Federal IDEA Special Education Timelines:** Federal baselines apply to all states, serving as a unified fallback when specific state timelines are not documented.

### Categories That Must Remain One-State-at-a-Time
These categories feature highly localized administrative divisions, county assignment rules, and custom crawler targets:
1.  **DD/IDD Local Catchment Routing:** Every state defines developmental disability intake differently (e.g., California's Regional Centers, Texas's LIDDAs, Florida's APD Areas, Ohio's County Boards).
2.  **Early Intervention (Part C):** Geographic contractor divisions are highly custom and often overlap in metropolitan centers.
3.  **School District ESE/Special Ed Contacts:** Contact names, emails, and phone numbers are located on thousands of individual district sites, requiring localized scrapers or state directory parsing.
4.  **Medicaid / HHS Local Offices:** Local storefront structures, partner networks, and physical routing rules are custom to each state's social service department.

---

## 4. Next Recommended States & Wave 1 Order

Based on data structure, directory quality, and user value, the recommended Wave 1 rollout order is:

| Order | State | Code | DD Intake Agency | Education Structures | Justification |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **1** | **New York** | **NY** | OPWDD Front Door | Regional BOCES / Districts | Highly structured, clean directories, and high-density population. |
| **2** | **Ohio** | **OH** | County Boards of DD | Educational Service Centers | Extremely organized county-level boards of DD, simplifying routing. |
| **3** | **Pennsylvania**| **PA** | County MH/ID Offices | Intermediate Units (IUs) | Well-defined regional intermediate educational units and clean state data. |
| **4** | **Georgia** | **GA** | DBHDD Regions | School Districts | Completed baseline pilot, high-value metro target. |

---

## 5. Scaling Risks Before Wave 1

1.  **Sitemap Scale Limit:** As more states transition to exhaustively verified, the sitemap handler `/sitemaps/counties.xml` will query thousands of county-diagnosis routes. We must implement caching or static sitemap generation to prevent serverless function timeouts.
2.  **SQLite Lockups:** Concurrent staging runs or database syncs in CI/CD environments can lead to SQLite write lockups. We must serialize migration executions.
3.  **Personnel Churn:** Special education contact directories churn frequently. Without an automated, recurring validation crawler, contact details will degrade within 6–12 months.
