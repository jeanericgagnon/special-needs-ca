# Actual Sitemap Allowlist Audit

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Database Status:** WAL Checkpointed & Synced

This report documents the exact allowlist county counts and sitemap configurations currently configured in the Next.js frontend codebase, verifying compliance with our GSC gating requirements.

---

## 1. Allowed Counties Audit Metrics

We parsed the active allowlist `NON_CA_VERIFIED_COUNTIES` in [verifiedCounties.ts](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/lib/verifiedCounties.ts) and verified the following:

- **Total Non-CA Counties Allowed:** **270**
  - **Texas (TX) Allowed:** **248** (of 254 total database counties)
  - **Florida (FL) Allowed:** **14** (of 67 total database counties)
  - **Pennsylvania (PA) Allowed:** **8** (of 67 total database counties)

---

## 2. Gating and Exclusion Controls

We verified that the sitemap generator and metadata headers correctly gate other states:

- **Gated States Excluded (GA, IL, NY, OH):** **EXCLUDED.** None of these states' counties are listed in `NON_CA_VERIFIED_COUNTIES`, and their county pages dynamically serve `noindex` tags.
- **Other 43 States Excluded:** **EXCLUDED.** All county routes return `noindex, follow` tags and are omitted from `counties.xml`.
- **California (CA) Legacy Gating:** **ACTIVE.** In the county × diagnosis sitemap leaves, only `los-angeles` and `orange` are allowed to index. All other California county × diagnosis paths are served with `<meta name="robots" content="noindex" />`.

---

## 3. Compliance Verdict

The codebase is in **100% compliance** with the Batch 1 gating policy. No gated states are included in the county sitemaps, and robots meta tags are correctly injected dynamically.
