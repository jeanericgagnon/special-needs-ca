# Founder's Decision Brief (V2)

**Prepared for:** Founders / Leadership Team  
**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Classification:** CONFIDENTIAL / FOUNDER REVIEW REQUIRED  

This brief outlines the final release-readiness decisions under the **V3 release-quality rules**. It summarizes the exact release posture, CA cleanup results, and developer-led curation alternatives to remote VA outsourcing.

---

## 1. Authoritative Release Decisions

### Decision 1: Batch 1 Public Release (Texas, Florida, Pennsylvania)
- **Verdict:** 🟢 **GO (Staged Locally)** / 🛑 **HOLD (Google Search Console)**
- **Action:** Allowlist counties for Texas, Florida, and Pennsylvania in the local codebase. Prerender all 4,215 county paths during build. **Do not submit county sitemaps to Google Search Console** until final localized intake testing is approved by the founders. Pilot states (such as New York, Ohio, Illinois, and Georgia) and all other states must remain strictly index-gated under noindex.

### Decision 2: California Release Strategy
- **Verdict:** 🔒 **LEGACY_EXCEPTION (Keep Gated)**
- **Action:** Retain California county routes in the county sitemaps for backward compatibility, but enforce a strict `noindex` policy on all county-diagnosis leaf pages and new directory routes to prevent search engine doorway-page penalties (owing to 77 fallback districts).

### Decision 3: Forms Library Productionization
- **Verdict:** 📄 **MIGRATION COMPLETE**
- **Action:** The migration to create the `forms_and_guides` table is complete; the production table exists and contains 67 rows. However, content quality reviews (for direct PDF download URLs and missing call scripts) remain incomplete. Weak generic state guides are kept in review status.

### Decision 4: Virtual Assistant Curation Budget
- **Verdict:** ⏳ **DEFERRED (Developer-Led API Verification Alternative)**
- **Action:** Reject the budget for remote virtual assistants. Instead of manual phone calls, implement a developer-led validation script utilizing automated business registry APIs and telecom carrier lookup tools to clean the remaining 6,091 records in the backlog.

### Decision 5: Geographic Batch Promotion
- **Verdict:** 🛑 **SUSPENDED**
- **Action:** Suspend all multi-state geographic batch promotions for local storefronts, school districts, and EI catchments. Upgrades to these localized layers must be executed in isolated, single-state serial mode only.

---

## 2. National Quality Dashboard

* **National Backlog:** **6,091 records** marked `manual_review_required`.
* **Verified local offices:** APD Florida and Texas ECI/LIDDA routing are 100% verified.
* **School District special education contact backlog:** **2,696 districts** lack direct lines.
* **County DSS/Medicaid office contact backlog:** **2,350 offices** require local intake checks.
* **Clinic/Nonprofit coverage:** Texas and Florida nonprofit directories are complete. Pennsylvania is thin.
* **SQLite Database Health:** Both production and frontend databases are 100% WAL-checkpointed and report `ok`.
* **Playwright E2E Tests:** 100% pass on core routes and state-specific Medicaid checks.
