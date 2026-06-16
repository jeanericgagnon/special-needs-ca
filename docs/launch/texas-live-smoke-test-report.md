# Texas Live Smoke Test Report

This report documents the results of the live-site smoke test run against the Next.js production build of the Special Needs Navigator.

---

## 1. Execution Summary

*   **Test Date:** June 13, 2026
*   **Target Server:** http://localhost:3000 local production build. Public production verification is still required against https://california-navigator.org before Google Search Console sitemap submission.
*   **Deployment Status:** DEFERRED. Public deployment, live-domain verification, and GSC submission are intentionally deferred until after the next state-upgrade phase. Texas remains internally verified and ready for future production launch.
*   **Authentication & Database:** Verified SQLite database (including 2,810 Texas records, 12 programs, 248 verified counties, and 6 gated counties) with active decryption key.
*   **Outcome:** **100% SUCCESS** (118/118 assertions passed)

---

## 2. Detailed Checklist Outcomes

### 1. Sitemap & Robots Index Validation
*   [x] **Sitemap Index:** `/sitemap.xml` loaded successfully and parses as valid XML. It properly references static sitemaps and county sitemaps.
*   [x] **Static Sitemap:** `/sitemaps/static.xml` loaded successfully and contains Texas static routes: `/benefits/texas`, `/counties/texas`, and all 12 Texas programs.
*   [x] **County Sitemap:** `/sitemaps/counties.xml` loaded successfully and parses as valid XML. It lists exactly 248 verified Texas counties and properly excludes the 6 gated counties.
*   [x] **County × Diagnosis Gating:** Confirmed no county × diagnosis leaf pages are present in the sitemap.

### 2. Gated vs Indexable Page Status & Robots
*   [x] **Indexable Counties:** Checked 10 representative counties (Harris, Travis, Dallas, Bexar, Tarrant, El Paso, Collin, Denton, Fort Bend, Hidalgo). All returned `200 OK`, contain correct canonical tags pointing to `https://california-navigator.org`, and do not contain any `noindex` rules.
*   [x] **Gated Counties:** Checked all 6 gated counties (Brazos, Lavaca, McLennan, Tyler, Victoria, Wichita). All returned `200 OK` (to prevent broken user links) but correctly output `<meta name="robots" content="noindex, follow" />`.

### 3. Page Localization and Rendering Checks
*   [x] **ECI & LIDDA Separation:** Verified that Early Childhood Intervention (ECI) contractors and Local IDD Authorities (LIDDAs) render in separate sections with accurate contact information on county pages.
*   [x] **Program Page Localization:** Verified that all 12 Texas program pages (e.g. HCS, CLASS, TxHmL, TWC-VR) are dynamically localized for Texas with zero "California" copy leaks.
*   [x] **Trust Labels:** Trust badges render correctly on all entities with correct verification statuses (`source_listed`, `official_verified`, etc.) and exact review dates.
*   [x] **No Placeholder Leaks:** Confirmed no debug messages, placeholders, or localhost URLs are exposed to the user.

---

## 3. Optimizations & Fixes Made

1.  **Resolved Metadata ReferenceError:** Fixed a circular dependency import crash by moving the `NON_CA_VERIFIED_COUNTIES` array from the counties sitemap route handler to a new shared module `frontend/src/lib/verifiedCounties.ts`, resolving `ReferenceError: NON_CA_VERIFIED_COUNTIES is not defined`.
2.  **Optimized Counties Sitemap Query:** Reduced database queries in the counties sitemap generator from 1,500+ down to ~290 by preloading only California county details (since non-CA counties use `NON_CA_VERIFIED_COUNTIES` directly and do not undergo quality gate checks). This fixed the sitemap request timeout.
3.  **Configured Server Environment:** Documented and verified that `DB_ENCRYPTION_KEY` must be set during server startup to prevent server-side SQLite decryption failures.

---

## 4. Final GSC Submission Recommendation

*   **Vercel Deployment Readiness:** GO
*   **Public Production Verification:** DEFERRED
*   **Google Search Console Submission:** DEFERRED until after the next state-upgrade phase.

**Justification:**
1. All sitemaps, robots rules, and noindex headers are fully verified locally and conform to the data trust and state pilot boundaries.
2. The Next.js local production build compiles cleanly and passes all 118 local smoke tests (100% success).
3. The sitemap structure is verified locally to be 100% correct, including all gated county exclusions.
4. **CRITICAL GATE:** Target Server: http://localhost:3000 local production build. Public production verification is still required against https://california-navigator.org before Google Search Console sitemap submission.
5. **DEFERRAL NOTICE:** Public deployment, live-domain verification, and GSC submission are intentionally deferred until after the next state-upgrade phase. Texas remains internally verified and ready for future production launch.
