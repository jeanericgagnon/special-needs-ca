# Source Curation Sprint Start Checkpoint

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **ESTABLISHED BASELINE**

---

## 1. Safety & Deployment Posture
- **Google Search Console (GSC) Posture:** 🛑 **HOLD**
- **DNS Properties / TXT Verification:** 🛑 **HOLD**
- **Public Deployments:** 🛑 **HOLD**
- **Geographic Batch Promotions:** 🛑 **SUSPENDED**

---

## 2. Sitemap Allowlist Configuration
- **Sitemap Counties Allowed:** **270**
  - **Texas (TX):** 248 counties
  - **Florida (FL):** 14 counties
  - **Pennsylvania (PA):** 8 counties
- **Exclusion Gating:** All other 47 states are strictly configured as `noindex` and excluded from public sitemaps. County × diagnosis leaf paths are index-gated outside California legacy exception rules.

---

## 3. Database & Forms Metrics
- **Root Database File:** `ca_disability_navigator.db` (Integrity: `ok`)
- **Frontend Database File:** `frontend/ca_disability_navigator.db` (Integrity: `ok`)
- **Table `forms_and_guides` Row Count:** **67**
- **Table `staging_scraped_forms` Row Count:** **76**
- **Active DB Fake/Generated Domains:** **0** (All active tables have 0 fake/generated domains).
- **Rendered Batch 1 Bad URLs:** **0** (Audited and verified).

---

## 4. Quality & Curation Backlog
- **Total National Curation Backlog:** **7,723 records** in `manual_review_required`.
  - `county_offices`: 2,350
  - `school_districts`: 2,524
  - `nonprofit_organizations`: 2,036
  - `iep_advocates`: 610
  - `state_resource_agencies`: 80
  - `regional_education_agencies`: 66
  - `programs`: 15
  - `forms_and_guides`: 42
