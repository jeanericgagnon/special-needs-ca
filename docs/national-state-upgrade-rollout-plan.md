# National State-Upgrade Rollout Plan

> [!WARNING]
> SUPERSEDED — DO NOT USE FOR EXECUTION. This document contains deprecated/stale directives, county/state bounds, or metrics, and is superseded by the Zero-Churn Authoritative Truth Ledger.


This document establishes the strategic roadmap and rollout plan for upgrading all remaining US states to California-equivalent data depth, completeness, and search engine readiness. 

---

## 1. Executive Summary

Having successfully upgraded California (baseline), Texas, Florida, and New York, the universal state-upgrade engine is now mature, generic, and decoupled from state-specific code. 

The national rollout plan outlines how we will systematically upgrade the remaining 47 jurisdictions (46 states + Washington D.C.) in structured waves. Our priority is to maximize value to parents, minimize ingestion risk, and batch common administrative structures (like Medicaid office structures or Early Intervention portals) while isolating state-specific education and provider review queues.

---

## 2. State Prioritization Methodology

States are ranked based on a composite score ($S$) of eight weighted factors:
\[S = 0.20(\text{Demand}) + 0.15(\text{Population}) - 0.10(\text{Complexity}) + 0.15(\text{Source Availability}) + 0.10(\text{Similarity}) - 0.10(\text{Routing Risk}) + 0.20(\text{Parent Value})\]

### Scoring Criteria:
1.  **SEO/User Demand (20%):** Estimated traffic potential and search queries from parents of children with special needs.
2.  **Population Size (15%):** Total population as a proxy for the volume of families served.
3.  **Complexity (10% - Negative):** Administrative complexity (e.g., highly fragmented local districts vs. unified state-managed structures).
4.  **Source Availability (15%):** Presence of clean, machine-readable official directories (Medicaid, EIP, School Districts).
5.  **Similarity to Completed States (10%):** Direct alignment with CA (regional center model), TX (LIDDAs), FL (APD/Early Steps), or NY (OPWDD/BOCES).
6.  **Routing/Exception Risk (10% - Negative):** Likelihood of NYC-like borough splits or overlapping catchments.
7.  **Value to Parents (20%):** Lack of consolidated alternative resources in that state, making our directory highly impactful.

---

## 3. Top 5 Recommended Next States (Wave A)

Based on the prioritization scoring, the next five states to be upgraded are:

1.  **Ohio (OH) — [Score: 94/100]:** Perfect fit for the regional center catchment architecture via its 88 County Boards of Developmental Disabilities (CBDD). Clean sources and high population.
2.  **Pennsylvania (PA) — [Score: 91/100]:** High population, county-based MH/ID (Mental Health & Intellectual Disabilities) local offices.
3.  **Illinois (IL) — [Score: 89/100]:** Highly structured Early Intervention (Child & Family Connections - CFC) regions. High population and user demand.
4.  **Georgia (GA) — [Score: 87/100]:** State-managed county DFCS offices and Babies Can't Wait early intervention regions. Highly repeatable.
5.  **North Carolina (NC) — [Score: 85/100]:** Structured Local Management Entities/Managed Care Organizations (LME/MCO) routing model for IDD waiver management.

---

## 4. Completed Control State: Ohio (OH)

Ohio (OH) has been successfully upgraded as the control state.

> [!NOTE]
> **Ohio was the post-autonomy control state and has successfully PASSED all gates.**
> 
> Multi-state batch ingestion for approved low-risk categories is now ACTIVE.
> 
> *   **Ohio County-Level Routing Coverage:** Complete
> *   **Ohio Expanded School District Layer:** 176 total records (including 95 promoted city/local districts)
> *   **Full Ohio District Universe:** Approximately 611 public school districts
> *   **Remaining Full-District Expansion:** Deferred / Manual-heavy (not exhaustive)
> 
> **Important Limitation:** Ohio's success must not be used to justify batching school district replacements or district-level expansions. School district promotion work must remain strictly isolated on a state-by-state basis.

### Justification and Results:
*   **Catchment Alignment:** Ohio's developmental services are governed by **County Boards of Developmental Disabilities (CBDD)**. There are exactly 88 boards (one for each of Ohio's 88 counties). This maps 1:1 with the database's `state_resource_agencies` and `regional_center_counties` structure, which was cleanly implemented and verified.
*   **Clean Sourcing:** The Ohio Department of Developmental Disabilities (DODD) directory of all 88 boards was used to seed intake details.
*   **High Value / Low Risk:** Ohio was upgraded with zero overlapping catchments and no complex municipal borough splits, verifying the universal runner's robustness.

### Ohio Success Criteria Status:
To satisfy the control-state gate, Ohio has successfully passed the following criteria:
*   [x] Full research packet generated without hardcoded leakage.
*   [x] Benefits/HHS routing promoted cleanly.
*   [x] County boards of DD / DODD routing promoted cleanly.
*   [x] Early Intervention structure promoted cleanly.
*   [x] Education/regional structures handled without fake county coverage.
*   [x] School district contacts resolved or cleanly held for manual review.
*   [x] Trusted nonprofits and clinics handled with correct service-area semantics.
*   [x] Provider/legal review queue created without auto-promotion.
*   [x] Next.js build compiles and passes.
*   [x] Playwright integration tests pass.
*   [x] Launch readiness report generated.
*   [x] No database rollback required.
*   [x] No unrelated table mutation.
*   [x] No provider/legal/commercial leakage.
*   [x] No fake county service-area expansion.

---

## 5. Rollback and Safeguard Protocols

Every state upgrade, regardless of wave or batching, must adhere to the **Universal Safety Guardrails**:
1.  **Strict Serialization:** Only one state upgrade may be actively promoted to production at a time.
2.  **Staging-First Mandate:** All scraped data must land in staging tables and undergo validation before promotion.
3.  **Automatic Backups:** Every database write must be preceded by a physical DB checkpoint copy.
4.  **Rollback Scripts:** SQL transaction rollback scripts must be generated and saved to the state folder automatically.
5.  **Private Provider Boundary:** No automated promotion is allowed for private legal entities or therapists; they must reside in `provider_legal_review_queue.json` for manual review.
