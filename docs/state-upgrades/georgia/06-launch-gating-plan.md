# Georgia Launch Gating Plan

This document details the launch gating checks required to determine the final status classification of the Georgia state upgrade.

## 1. Classification Criteria

*   **COMPLETE:**
    *   0 fallback records remain.
    *   0 fake/placeholder contacts (phone, email, website) remain.
    *   All key local records (benefits offices, school districts) are source-supported.
    *   Database integrity audits pass.
    *   Next.js production build compiles successfully.
    *   Targeted Playwright smoke tests pass.
*   **PILOT-READY PARTIAL:**
    *   Functional regional routing (DBHDD and Early Intervention) is complete.
    *   0 fallbacks remain.
    *   0 fake/placeholder contacts remain.
    *   Unresolved local records (e.g., the 148 rural school districts and county offices) are safely downgraded to `manual_review_required`.
    *   Frontend hides empty contact fields and labels unverified records cleanly.
    *   Next.js production build compiles successfully.
    *   Targeted Playwright smoke tests pass.
    *   Sitemap indexation is restricted: only index root state hub and verified county detail pages.
*   **BLOCKED:**
    *   Source structure is unclear or unsupported.
    *   Fake/mock/placeholder contact data remains active in database.
    *   `fakeCoverageDetector` or database guards fail.
    *   Next.js build or Playwright tests fail.
    *   Frontend displays unverified records as verified.

## 2. Gating Restrictions
*   **Sitemap Indexing:** Restricted to state hub (`/benefits/georgia`) and the 11 priority county directory pages. The other 148 counties and county-diagnosis combination pages are strictly gated using `noindex` headers.
*   **No public launch / Google Search Console (GSC) submissions:** Georgia will remain in pilot status.
*   **Auto-promotion:** No provider or advocate directory listings from private sources are auto-promoted.
