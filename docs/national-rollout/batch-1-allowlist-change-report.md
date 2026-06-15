# Batch 1 Sitemap Allowlist Correction & Release-Prep Report

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** 🛑 **SUPERSEDED / DO_NOT_USE_FOR_EXECUTION**  

> [!WARNING]
> **Active GSC Hold Enforced & Stale Metrics:** This document has been superseded. Do NOT submit county sitemaps to Google Search Console or execute live promotions. A strict indexing and verification hold remains active. 
> 
> Additionally, the manual review rates reported below (e.g. 0% for TX and 0% for PA) are stale and contradict the database reality (which has 756 manual review records in TX, 88 in FL, and 67 in PA). Do NOT use this document for execution.

---

## 1. Allowlist Change Summary

We updated the active sitemap/index allowlist in [verifiedCounties.ts](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/lib/verifiedCounties.ts) to restrict public indexation solely to Batch 1 approved states, resolving the noindex metadata mismatch.

### Action Taken:
*   **Kept Allowlisted:** Texas (248 counties), Florida (14 metro counties), Pennsylvania (8 metro counties).
*   **Removed from Allowlist:** **40 counties** belonging to New York, Ohio, Illinois, and Georgia.
*   **Verified Absent:** All 42 newly upgraded pilot-ready partial states remain absent.

### Sitemap County Counts:
*   **Total Counties Allowlisted Before:** **310** (248 TX + 14 FL + 8 PA + 12 NY + 7 OH + 10 IL + 11 GA)
*   **Total Counties Allowlisted After:** **270** (248 TX + 14 FL + 8 PA)
*   **Sitemap URL Reduction:** **80 URLs** (2 per county: 1 `/benefits` and 1 `/counties`)

---

## 2. Gating & Indexing Status

| State | Indexing Status | robots Meta Tag | Sitemap Presence | Justification / Notes |
|:---|:---:|:---:|:---:|:---|
| **Texas** | **INDEXABLE (GSC HOLD)** | `index, follow` (default) | **Yes** (496 URLs) | Approved Batch 1 State; 0 mocks, 0% manual review |
| **Florida** | **INDEXABLE (GSC HOLD)** | `index, follow` (default) | **Yes** (28 URLs) | Approved Batch 1 State; 0 mocks, 0.22% manual review |
| **Pennsylvania** | **INDEXABLE (GSC HOLD)** | `index, follow` (default) | **Yes** (16 URLs) | Approved Batch 1 State; 0 mocks, 0% manual review |
| **California** | **INDEXABLE (GSC HOLD)** | `index, follow` (default) | **Yes** (116 URLs) | Legacy Baseline Exception; subject to future scrub |
| **New York** | **GATED** | `noindex, follow` | **No** (0 URLs) | Needs manual review pass (62 records) |
| **Ohio** | **GATED** | `noindex, follow` | **No** (0 URLs) | Needs manual review pass (166 records) |
| **Illinois** | **GATED** | `noindex, follow` | **No** (0 URLs) | Needs manual review pass (89 records) |
| **Georgia** | **GATED** | `noindex, follow` | **No** (0 URLs) | **BLOCKED** due to 41.33% manual review rate |
| **Other 42 Partials**| **GATED** | `noindex, follow` | **No** (0 URLs) | Gated partial directories (~38% manual review) |

---

## 3. Verification & Build Status

*   **Next.js Production Build:** **SUCCESS** (4215 static routes compiled successfully, including sitemap generation).
*   **Playwright Regression Suite:** **SUCCESS** (**434 tests passed** sequentially).
*   **Negative Control Checks:** Verified that Georgia, Illinois, New York, and Ohio E2E launch specs succeed as negative controls:
    - Their county pages are strictly excluded from `/sitemaps/counties.xml`.
    - Both county root benefits (`/benefits/[state]/[county]`) and details (`/counties/[state]/[county]`) routes return `<meta name="robots" content="noindex, follow" />`.
*   **Positive Control Checks:** Verified that Texas, Florida, and Pennsylvania county routes are present in `/sitemaps/counties.xml` and do not receive `noindex` tags.

---

## 4. Final Verdict & GSC Hold Directive

> [!IMPORTANT]
> The codebase is fully verified for local execution but remains under **GSC HOLD**. Do not deploy publicly or submit sitemaps to Search Console.

### Recommended Next Steps (Deferred / Hold):
1. **Commit and Merge:** Push changes in [verifiedCounties.ts](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/lib/verifiedCounties.ts) to repository.
2. **Frontend Deployment:** DEFERRED (Local validation build only).
3. **Submit to Search Console:** **BLOCKED (GSC HOLD)**. Do not submit sitemap until the remaining bad/fake URLs rendering on Batch 1 pages are repaired.

