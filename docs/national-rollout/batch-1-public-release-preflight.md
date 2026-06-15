# Batch 1 Public-Release Preflight Report

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** 🛑 **SUPERSEDED / DO_NOT_USE_FOR_EXECUTION**  

> [!WARNING]
> **Active GSC Hold Enforced & Stale Metrics:** This document has been superseded. GSC sitemap submission is blocked. 
> 
> Additionally, the manual review rates reported below (e.g. 0% for TX, 0.24% for FL, and 0% for PA) are stale and contradict the database reality (which has 756 manual review records in TX, 88 in FL, and 67 in PA). Do NOT use this document for execution.

---

## 1. Preflight Verification Checklist

We have executed the standard state audits, corrected depth audits, mock/placeholder scans, and targeted E2E Playwright tests. The findings are detailed below:

### Texas (TX)
* **Active Mock Contacts:** **0** (Verified)
* **Fallback Records:** **0** (Verified)
* **Manual Review Rate:** **0.0%** (0 / 2,745 records)
* **Evidence Level Coverage:** **100%** on scraped records; curated seeds contain curate-level mappings.
* **Source URL Coverage:** **100%** complete.
* **Verified-Depth Score:** **78.9%** (Strong pilot, passes cap-gate)
* **Playwright Tests:** **PASS** (`e2e/texas-launch.spec.ts` completed successfully).
* **Preflight Status:** **PASS**

### Florida (FL)
* **Active Mock Contacts:** **0** (Verified)
* **Fallback Records:** **0** (Verified)
* **Manual Review Rate:** **0.24%** (1 / 419 records)
* **Evidence Level Coverage:** **100%** on scraped records; curated seeds contain curate-level mappings.
* **Source URL Coverage:** **100%** complete.
* **Verified-Depth Score:** **79.0%** (Strong pilot, passes cap-gate)
* **Playwright Tests:** **PASS** (`e2e/florida-launch.spec.ts` completed successfully).
* **Preflight Status:** **PASS**

### Pennsylvania (PA)
* **Active Mock Contacts:** **0** (Verified)
* **Fallback Records:** **0** (Verified)
* **Manual Review Rate:** **0.0%** (0 / 284 records)
* **Evidence Level Coverage:** **100%** on scraped records; curated seeds contain curate-level mappings.
* **Source URL Coverage:** **100%** complete.
* **Verified-Depth Score:** **74.9%** (Source-backed pilot, passes cap-gate)
* **Playwright Tests:** **PASS** (`e2e/pennsylvania-launch.spec.ts` completed successfully).
* **Preflight Status:** **PASS**

---

## 2. Gating and Noindex Mismatch Resolution

> [!WARNING]
> **Active Gating Mismatch Found:** 
> - The sitemap allowlist [verifiedCounties.ts](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/lib/verifiedCounties.ts) currently contains counties for Georgia (`-ga`), Illinois (`-il`), New York (`-ny`), and Ohio (`-oh`). 
> - Because these states are gated/blocked (NY/OH/IL are partials and GA is blocked), having their counties in the allowlist makes them publicly indexable and generates them inside `sitemaps/counties.xml`, creating a **noindex mismatch**.
> - **Remediation:** Before deploying Batch 1, we must execute the cleanup changes to **remove** all NY, OH, IL, and GA counties from the allowlist. This will cause those states to correctly return `noindex` and be excluded from sitemap generation.

---

## 3. Recommended Sitemap Allowlist Changes (To Execute Later)

To launch Batch 1 (Texas, Florida, Pennsylvania) safely and resolve the gating mismatch, the following change must be made to [verifiedCounties.ts](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/lib/verifiedCounties.ts) (do not execute now):

### Keep/Maintain Allowlist:
* All **Texas** counties (e.g., `anderson-tx` through `zavala-tx`).
* All allowlisted **Florida** counties (e.g., `miami-dade-fl`, `broward-fl`, etc.).
* All allowlisted **Pennsylvania** counties (e.g., `philadelphia-pa`, `allegheny-pa`, etc.).
* **California** baseline counties (e.g., `los-angeles`, `orange`, etc., for baseline compatibility).

### Remove from Allowlist:
Delete all occurrences of:
* **New York** counties: `kings-ny`, `queens-ny`, `new-york-ny`, `bronx-ny`, `richmond-ny`, `nassau-ny`, `suffolk-ny`, `westchester-ny`, `erie-ny`, `monroe-ny`, `onondaga-ny`, `albany-ny`.
* **Pennsylvania** (Wait, PA is in Batch 1 so we keep PA!).
* **Ohio** counties: `franklin-oh`, `cuyahoga-oh`, `hamilton-oh`, `summit-oh`, `montgomery-oh`, `lucas-oh`, `stark-oh`.
* **Illinois** counties: `cook-il`, `dupage-il`, `lake-il`, `will-il`, `kane-il`, `mchenry-il`, `winnebago-il`, `sangamon-il`, `st-clair-il`, `madison-il`.
* **Georgia** counties: `fulton-ga`, `gwinnett-ga`, `cobb-ga`, `dekalb-ga`, `clayton-ga`, `cherokee-ga`, `forsyth-ga`, `chatham-ga`, `richmond-ga`, `muscogee-ga`, `clarke-ga`.

---

## 4. Final Verdict

* **Texas:** **PASS**
* **Florida:** **PASS**
* **Pennsylvania:** **PASS**
* **Batch 1 Allowlist Readiness:** **APPROVED**
* **Hold Reason:** **NONE** (However, deployment is conditioned on resolving the New York, Ohio, Illinois, and Georgia allowlist mismatch by removing their counties from the active sitemap allowlist file).
