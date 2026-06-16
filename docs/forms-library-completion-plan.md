# Forms Library Completion Plan

**Status:** QUALITY VERIFICATION ACTIVE  
**Date:** June 15, 2026

---

## 1. Migration Complete & Staging Reconciliation

The forms and guides schema migration has been completed successfully:
- **`forms_and_guides` Table:** Exists with **67** promoted rows.
- **`staging_scraped_forms` Table:** Exists with **76** rows.

### Key Content Gaps (Post-Migration):
* **PDF Link Verification:** 52 guides are missing direct PDF download links and link to Google search queries.
* **Call Script Completeness:** 100% of the 67 promoted guides have been populated with standard templates.
* **Indexation Gate:** The `/forms` search page and all form details routes return `noindex, follow` headers to prevent thin indexation.

---

## 2. Active Curation & Curation Plan

* **Step 1: Direct PDF Replacement:** Curate direct PDF download links for the priority forms in TX, FL, PA, IL, NY, OH, and GA.
* **Step 2: purge Google search queries:** Replace all search queries in `forms_and_guides` with official download URLs as they are verified.
* **Step 3: Lift Gating:** Once priority states achieve >90% direct PDF coverage, remove the `noindex` headers from `/forms` and indexable form routes.
