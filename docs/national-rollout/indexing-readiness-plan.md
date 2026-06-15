# Indexing Readiness Plan

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** HOLD (No GSC Submission Executed)

This document outlines the indexing readiness and gating plan for our national rollout. It aligns search index visibility parameters with our V3 safety guidelines.

---

## 1. Robots.txt and Crawler Directives

To maintain indexation discipline, the codebase operates under a strict release-gated policy:

1. **Allowlisted Counties (TX, FL, PA, CA):**
   - Served with standard canonical links.
   - Omit the `noindex` tag.
   - Included in `/sitemaps/counties.xml`.
2. **Gated Counties (Remaining 47 states):**
   - Injected with `<meta name="robots" content="noindex, follow" />`.
   - Excluded from `/sitemaps/counties.xml`.

This prevents soft-404 and doorway-page templates indexing alerts on search engines.

---

## 2. Release Status & Index Gating

* **Batch 1 (Texas, Florida, Pennsylvania):** Allowed locally in `verifiedCounties.ts` but held from Google Search Console sitemap submission.
* **California (CA):** Retained in `counties.xml` sitemap for legacy compatibility only. All new county × diagnosis leaf paths are gated under `noindex`.
* **Other 47 States (including New York, Ohio, Illinois, and Georgia):** Gated via robots `noindex` tags and strictly excluded from county sitemaps.
* **Geographic Batch Promotions:** Strictly suspended. Upgrades to county storefronts, regional early intervention, and school districts must be serialized state-by-state.

---

## 3. Playwright Indexing Validation Tests
Our Playwright smoke tests (`seo-sitemap.spec.ts`) execute automated checks:
* Asserting that a gated state page (e.g. `/counties/georgia/gwinnett-ga`) returns a `noindex` tag.
* Asserting that allowlisted state pages (e.g. `/counties/texas/travis-tx`) are indexable.
* Verifying that `/sitemap.xml` returns a valid XML structure referencing child sitemaps.
