# Batch 2 Candidate Plan

**Prepared for:** Curation & Growth Teams  
**States Targeted:** New York (NY), Ohio (OH), Illinois (IL)  
**Goal:** Promote these states from `KEEP_GATED` to `READY_FOR_ALLOWLIST` in the next 14 days.

---

## 1. Batch 2 Readiness Summary

Following the post-rollout repair sprint, these three states represent our highest-leverage release targets:

| State | Current MR Rate | Remaining Fallbacks | Critical Missing Verification | Target Launch Date |
| :--- | :---: | :---: | :--- | :---: |
| **Illinois** | 15.27% | 0 | 89 school districts in rural counties | June 28, 2026 |
| **New York** | 16.95% | 0 | 50 rural school districts and county offices | June 30, 2026 |
| **Ohio** | 33.60% | 0 | 160 school districts in rural counties | July 05, 2026 |

---

## 2. Recovery Action Plan Sprints

### Sprint 1: Illinois Curation (Target: < 5.0% MR Rate)
* **Objective:** Verify and promote remaining school districts in collar counties.
* **Process:** Allocate 10 VA hours to search and populate direct special ed coordinators.
* **Release Gate:** Once standard audit reports a manual review rate under 5.0%, append Illinois counties to `NON_CA_VERIFIED_COUNTIES` in `verifiedCounties.ts`.

### Sprint 2: New York Curation (Target: < 5.0% MR Rate)
* **Objective:** Verify Upstate and Western NY school district special education director phone numbers.
* **Process:** Allocate 15 VA hours to cross-reference BOCES directories.

### Sprint 3: Ohio Curation (Target: < 5.0% MR Rate)
* **Objective:** Curation of county-level developmental disabilities boards.
* **Process:** Allocate 15 VA hours.
