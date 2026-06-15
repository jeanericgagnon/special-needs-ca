# Sitemap and Noindex Regression Report

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **ACTIVE / VERIFIED**

This report details the code-level sitemap and noindex verification results, confirming that gated states and unapproved leaves are strictly excluded from indexation.

---

## 1. Allowed Counties sitemap Verification

We verified the sitemap generation and county routes:
- **Texas (TX):** Exactly **248** counties allowlisted. All other TX counties return `noindex`.
- **Florida (FL):** Exactly **14** counties allowlisted. All other FL counties return `noindex`.
- **Pennsylvania (PA):** Exactly **8** counties allowlisted. All other PA counties return `noindex`.
- **Total Non-CA Allowlisted Counties:** **270** counties.
- **California (CA) Parent Pages:** Dynamic CA county pages are indexable only if they pass CA quality gates (defined in `counties.xml/route.ts`).
- **All Other 47 States:** Gated states (including Georgia, Illinois, New York, and Ohio) are completely excluded from sitemaps and dynamically return `noindex` tags.

---

## 2. County × Diagnosis Leaf Paths Verification

We verified that county × diagnosis leaf paths (e.g. `/benefits/[state]/[diagnosis]/[county]`) are gated:
- **Non-California States:** Strictly excluded from sitemaps and dynamic route indexing.
- **California (CA):** Only `los-angeles` and `orange` county × diagnosis paths are allowed to index. All other California county × diagnosis paths dynamically return `noindex`.

---

## 3. Discrepancy & Bugfix Log

> [!IMPORTANT]
> **Code Gating Bug Patched:**  
> During our code-level audit of [page.tsx](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/app/benefits/%5Bstate%5D/%5B%5B...slug%5D%5D/page.tsx), we discovered a discrepancy where the dynamic county × diagnosis leaf metadata was allowing indexation of Texas, Florida, and Pennsylvania counties because they were part of `NON_CA_VERIFIED_COUNTIES`.  
>   
> **Fix Applied:**  
> Modified [page.tsx](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/app/benefits/%5Bstate%5D/%5B%5B...slug%5D%5D/page.tsx#L139) to enforce that `isIndexed` for county × diagnosis leaf routes is only `true` if `stateData.id === 'california'` and the county is either `los-angeles` or `orange`. This completely closes the security gap and aligns rendered robots headers with sitemaps.
