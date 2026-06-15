# Next Release Candidate Plan

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **DRAFT FOR REVIEW**

---

## 1. Rollout Context & Strategy

We have successfully completed the source curation sprint for the **10 priority states** (North Carolina, Michigan, New Jersey, Virginia, Washington, Arizona, Massachusetts, Colorado, Tennessee, Indiana). The local database placeholders have been replaced with verified official state portals and helplines.

To transition these states from gated `noindex` status to `index` (publicly released), we will follow a phased sitemap promotion plan. 

> [!IMPORTANT]
> The current Google Search Console (GSC) and DNS verification posture remains on strict **HOLD**.
> No states will be promoted to the sitemap allowlist until quality verification and sequential Playwright smoke testing pass successfully.

---

## 2. Release Candidates (Phase 1 & 2)

Based on the data discovery completeness and geographic importance, we recommend the following promotion ordering:

### Batch 2 (Next Promotion Candidates)
1. **New York (NY):** High-value population center. Staged data needs manual schema review.
2. **Ohio (OH):** County boards of DD and school districts fully mapped. Staged.
3. **Illinois (IL):** Family support networks and local DHS office maps staged.
4. **Georgia (GA):** DFCS offices and regional catchment boundaries staged.

### Batch 3 (Priority Gated States)
1. **North Carolina (NC):** 0 backlog remaining. Staged with central fallback.
2. **Michigan (MI):** 0 backlog remaining. Staged with central fallback.
3. **New Jersey (NJ):** 0 backlog remaining. Staged with central fallback.

---

## 3. Verification & Quality Gates

Before any state or county is added to the sitemap allowlist (which currently contains **270 counties** in TX, FL, and PA), it must pass the following quality gates:

### Gate 1: Schema & DB Integrity Check
- Execute `PRAGMA integrity_check` on the root and frontend replica databases.
- Confirm there are **0** fake domain references in active tables.

### Gate 2: Source/Provenance Audit
- Verify that every promoted record in the state maps to an official government site (`.gov`), trusted PTI/P&A, or children's hospital clinic.
- Confirm that no commercial directory URLs are present.

### Gate 3: Geographic Catchment Audit (`fakeCoverageDetector`)
- Run geographic checks to ensure county-level services are not mirrored across counties without catchment evidence.
- Verify that physical office locations are not marked as serving the entire state unless explicitly supported.

### Gate 4: Sitemap & Noindex Gate
- Verify that only approved counties are listed in `counties.xml`.
- Ensure all other counties and states return the `noindex` meta header.

---

## 4. Promotion Checklist

For each release candidate:
- [ ] Run state-specific scraper/extractor.
- [ ] Write data to `staging_scraped_forms` and database staging tables.
- [ ] Generate HTML/JSON before/after diff reports.
- [ ] Generate matching SQL rollback scripts in the `rollback/` folder.
- [ ] Run automated DB sanity audits.
- [ ] Promote to production database tables.
- [ ] Sync the frontend replica database.
- [ ] Run the Next.js production build (`npm run build --prefix frontend`).
- [ ] Execute sequential Playwright E2E tests (`npx playwright test --workers=1`).
- [ ] Add the newly verified counties to the sitemap allowlist in the code configuration.
