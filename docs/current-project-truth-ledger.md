# Current Project Truth Ledger

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **AUTHORITATIVE**

This document serves as the single executable source of truth for the Sitemaps, Databases, Forms, GSC posture, and state scoring metrics of the Special Needs Navigator project, resolving all historical contradictions.

---

## 1. Google Search Console & Deployment Posture
* **Indexing Verdict:** 🛑 **HOLD**
* **DNS ownership & GSC verification:** **HOLD** (Do not submit sitemaps, verify properties, or add DNS TXT records).
* **Geographic batch promotions:** **SUSPENDED** (Multi-state promotions are blocked to prevent data mirroring or layout contamination).

## 2. Sitemap Allowlist Configuration (Verified from Code)
* **Sitemap Allowlist File:** [verifiedCounties.ts](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/lib/verifiedCounties.ts)
* **Sitemap Route:** [counties.xml/route.ts](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/app/sitemaps/counties.xml/route.ts)
* **Exact Allowed Non-CA Counties:** **270**
  * **Texas (TX):** 248
  * **Florida (FL):** 14
  * **Pennsylvania (PA):** 8
* **Exclusions:**
  * All other 47 states are strictly excluded from sitemaps and dynamic route indexing (returning `noindex` headers).
  * County × diagnosis leaf paths for all states except California are excluded.
  * For California, only `los-angeles` and `orange` county × diagnosis leaf paths are indexable.

## 3. Database Truth Summary (Verified by SQLite Audit)
* **Database File:** `ca_disability_navigator.db`
* **Table `forms_and_guides`:** Exists with **67** promoted rows.
* **Table `staging_scraped_forms`:** Exists with **76** rows.
* **Gated State Status:** Gated/skeleton states contain programmatically generated placeholder data with fake/generated domains (e.g., `dhhs.[state].gov`). They have a **50%–60% manual-review rate** in the raw database (with skeleton states averaging ~50%-60%, pilot states like Georgia at 37.7%, Pennsylvania at 34.4%, Texas at 27.1%, and Florida at 18.1%). They are labeled `safe_gated_placeholder` or `DATA_BUILDOUT_REQUIRED`, with verified depth scores corrected to **0%**.


## 4. Forms & Guides Schema Status
* **Status:** **MIGRATION COMPLETE**
* **Details:** The schema migration is complete; the production table `forms_and_guides` exists and contains 67 rows. Quality reviews show 52 missing direct PDF links, 0 missing call scripts, and 42 fake/Google search fallback URLs. Public release remains on HOLD.
