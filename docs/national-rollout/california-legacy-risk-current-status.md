# California Legacy Risk Current Status

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **COMPLETE_WITH_LEGACY_EXCEPTION**

This report audits the legacy data quality and indexing exposure risks for California.

---

## 1. California Quality Metrics

Based on direct SQLite database queries, California is classified under the `COMPLETE_WITH_LEGACY_EXCEPTION` status due to the following metrics:
- **Total Database Records:** 961
- **Manual Reviews:** 657
- **Manual Review Rate:** 68.37%
- **Programmatic Fallbacks (School Districts):** 40 (labeled as `programmatic_fallback` with status `manual_review_required`).
- **Verified Badges:** Excluded from all fallback and unverified records. Verified badges are strictly limited to fully verified curated seeds.

---

## 2. Indexing and Public Exposure Controls

California is locked in a frozen indexing state:
- **County Gating:** Only `los-angeles` and `orange` county × diagnosis leaf pages are allowlisted for indexing.
- **Dynamic Gating:** All other CA county × diagnosis pages dynamically serve `noindex` tags to prevent indexing thin search pages.
- **Sitemap Inclusion:** CA counties are dynamically filtered by `passesCountyQualityGate` in the sitemap counties XML generator. Gated/thin CA county pages return `noindex` and are excluded from the sitemap.
