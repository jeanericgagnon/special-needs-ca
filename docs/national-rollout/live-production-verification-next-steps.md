# Live Production Verification Next Steps

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **AUTHORITATIVE**

---

## 1. Post-Deployment Verification Protocol

Once authorization for live production deployment is granted, the following protocol must be executed step-by-step:

1. **Deploy Frontend Build & DB Sync:**
   - Execute production deployment.
   - Sync the SQLite database to PostgreSQL (if production environment uses PG) or sync production SQLite container volume.
2. **Verify robots.txt:**
   - Request `https://california-navigator.org/robots.txt` in a browser.
   - Confirm it includes `Allow: /forms` and `Sitemap: https://california-navigator.org/sitemap.xml`.
3. **Verify Counties Sitemap:**
   - Request `https://california-navigator.org/sitemaps/counties.xml`.
   - Confirm it has exactly 270 non-CA counties allowlisted (TX: 248, FL: 14, PA: 8) plus CA counties.
   - Verify that **no** county × diagnosis leaf pages (e.g. `/benefits/texas/autism-spectrum-disorder/harris-tx`) are listed.
4. **Spot-Check Gated Pages:**
   - Request a gated leaf page in a browser: `https://california-navigator.org/benefits/texas/autism-spectrum-disorder/harris-tx`.
   - Inspect the HTML source and confirm it serves `<meta name="robots" content="noindex, follow" />`.
5. **Spot-Check Allowed Pages:**
   - Request an allowed county detail page: `https://california-navigator.org/counties/texas/harris-tx`.
   - Confirm the page renders cleanly, displays correct LIDDA terminology (Texas Medicaid / LIDDA), shows the TrustBadge, and does **not** serve a noindex robots tag.
6. **Submit to Google Search Console:**
   - After confirming sitemaps and meta tags, submit the main sitemap index `https://california-navigator.org/sitemap.xml` in GSC.
