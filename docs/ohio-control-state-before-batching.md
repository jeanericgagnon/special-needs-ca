# Ohio Control-State Runbook

> [!IMPORTANT]
> **Ohio is the required post-autonomy control state.**
> 
> No multi-state batch ingestion may begin until Ohio completes end-to-end and passes all control-state gates.

---

## 1. Ohio Success Criteria

To certify Ohio as the control state and approve the transition to wave-based processing, Ohio must satisfy the following strict criteria:

*   **Full Research Packet Generated:** Complete baseline configuration, truth map, and gap analyses generated without hardcoded Florida, Texas, or California leakage.
*   **HHS / Benefits Routing:** Promoted cleanly, replacing all county fallback offices.
*   **County Boards of DD / DODD Routing:** Promoted cleanly, mapping the 88 county boards without gaps.
*   **Early Intervention (Part C):** Promoted cleanly, mapping all regional and municipal intake points.
*   **Education / Regional Structures:** Promoted cleanly without fake county coverage.
*   **School District Contacts:** Resolved cleanly or held in manual review.
*   **Trusted Nonprofits and Clinics:** Handled with correct service-area semantics.
*   **Provider/Legal Review Queue:** Created with correct private/commercial exclusions, and zero auto-promotion of commercial records.
*   **Next.js Production Build:** Compiles cleanly with zero type or file exceptions.
*   **Playwright Test Suite:** Executes with 100% pass rate.
*   **Launch Readiness Report:** Generated and saved to disk.
*   **No Rollback Required:** The promotion process must finish in a single transaction without triggering backup restores.
*   **No Unrelated Table Mutation:** Mutation guards verify that only the allowed tables for each phase are modified.
*   **No Provider/Legal/Commercial Leakage:** Strict separation of directories; zero unverified legal/ABA/therapy entities in the production database.
*   **No Fake County Service-Area Expansion:** Geographical catchments must reflect official directories, not expanded placeholders.

---

## 2. Ingestion Batching Scope Boundaries

After Ohio passes all control-state gates, only the following categories are approved for batching across multiple states:

*   Forms / appeals / VR / ABLE programs.
*   HHS locator research/staging.
*   DD regional office research/staging.
*   Early Intervention research/staging.
*   Institutional clinic research.
*   Source-link audits.

### Still Not Batchable (Must Remain State-by-State):
*   School district replacements.
*   Primary-key re-keying and reference audits.
*   Provider / legal / commercial data directories.
*   Metro-specific routing (borough/city exceptions).
*   Fallback deletion without replacement validation.
*   Sitemap / indexing changes.
*   Public launch / Google Search Console (GSC) submissions.
