# Texas Live Production Verification Report

This report documents the status of public live-site production verification and Google Search Console (GSC) sitemap submission readiness.

---

## 1. Verification Summary

*   **Live Domain Tested:** `https://california-navigator.org` (Deferred)
*   **Vercel Deployment Status:** DEFERRED until after the next state-upgrade phase.
*   **Local Production Build status:** **PASS** (100% success on `http://localhost:3000` smoke test)
*   **Live Domain DNS status:** **DEFERRED**
*   **GSC Sitemap Submission status:** **DEFERRED**

> [!IMPORTANT]
> **Verification Requirements:**
> Target Server: http://localhost:3000 local production build. Public production verification is still required against https://california-navigator.org before Google Search Console sitemap submission.
>
> **Deferral Notice:**
> Public deployment, live-domain verification, and GSC submission are intentionally deferred until after the next state-upgrade phase. Texas remains internally verified and ready for future production launch.

---

## 2. Production Environment Requirements (Vercel)

Confirm that the following environment variables are set correctly in the Vercel production deployment settings:

*   [ ] `DB_ENCRYPTION_KEY` — Set to the production decryption key.
*   [ ] `NEXT_PUBLIC_SITE_URL` — Set to `https://california-navigator.org`.
*   [ ] `NODE_ENV` — Set to `production`.

---

## 3. Required Live-Domain Verification Checks

Once the Vercel deployment is live and DNS resolves to `https://california-navigator.org`, the following smoke tests must be run using:

```bash
node src/scratch/smoke_test_live_site.js https://california-navigator.org
```

### 1. Routes to Test Directly
*   `https://california-navigator.org/robots.txt`
*   `https://california-navigator.org/sitemap.xml`
*   `https://california-navigator.org/sitemaps/counties.xml`
*   `https://california-navigator.org/benefits/texas`
*   `https://california-navigator.org/counties/texas`
*   **20 Indexable Texas County Hubs:** Harris, Travis, Dallas, Bexar, Tarrant, El Paso, Collin, Denton, Fort Bend, Hidalgo, Lubbock, Galveston, Nueces, Webb, Montgomery, Williamson, Cameron, Bell, Brazoria, Jefferson.
*   **All 6 Gated Texas Counties:** Brazos, Lavaca, McLennan, Tyler, Victoria, Wichita.
*   **All 12 Texas Program Pages:** HCS, CLASS, TxHmL, MDCP, YES, DBMD, STAR+PLUS HCBS, ECI, TEA Special Education, ABLE, Medicaid, TWC Vocational Rehabilitation.

### 2. Status & Robots Meta Checks
*   [ ] **Status Codes:** Expected indexable pages return `200 OK`. Gated counties return `200 OK` but must render with noindex rules.
*   [ ] **Robots/noindex:** Gated counties must include `<meta name="robots" content="noindex, follow" />` and be excluded from sitemaps. Indexable pages must not have noindex.
*   [ ] **Canonicals:** All canonical URLs must use the domain `https://california-navigator.org` and match their paths exactly. No `localhost` or staging domain names may appear.

### 3. Sitemap Verification
*   [ ] **Hub Inclusions:** `/benefits/texas` and `/counties/texas` included.
*   [ ] **County Counts:** Exactly 248 verified Texas counties included; 6 gated counties excluded.
*   [ ] **Program Pages:** All 12 Texas program pages included.
*   [ ] **Exclusions:** All 1,860 Texas county × diagnosis leaf pages (e.g. `/benefits/texas/autism-spectrum-disorder/harris-tx`) excluded.

### 4. Page Rendering Validation
*   [ ] **ECI/LIDDA Separation:** ECI contractors and LIDDAs render separately on county pages.
*   [ ] **Trust Labels:** Trust badges render with proper verification status (`source_listed`, `official_verified`).
*   [ ] **Waitlists:** Interest list/waitlist duration labels do not state estimates as official facts unless HHSC source-supported (advocacy/historical data labeled as estimate).
*   [ ] **Clinics:** Clinic records are physical-county mapped only, with no claims of county-wide service area coverage.
*   [ ] **Clean Layout:** No empty card sections, double headers, or raw debug/JSON text.

---

## 4. Issues Found & Fixes Made (Pre-Deployment)

1.  **ReferenceError: NON_CA_VERIFIED_COUNTIES is not defined:** Resolved page crashes on Texas county metadata generation by extracting the verified counties array to `frontend/src/lib/verifiedCounties.ts` and updating references.
2.  **Sitemap Count Timeout:** Optimized `/sitemaps/counties.xml` database generation by preloading details for California counties only, resolving request timeouts.
3.  **Dynamic Program copy leaks:** Localized the dynamic `/programs/[slug]` template to fetch state metadata dynamically.

---

## 5. Google Search Console Submission Gate

### **Recommendation: DEFERRED**

Do NOT submit `https://california-navigator.org/sitemap.xml` to Google Search Console.

**Current Status:**
1. Target Server: http://localhost:3000 local production build. Public production verification is still required against https://california-navigator.org before Google Search Console sitemap submission.
2. Public deployment, live-domain verification, and GSC submission are intentionally deferred until after the next state-upgrade phase. Texas remains internally verified and ready for future production launch.

Once the next state-upgrade phase is complete and the project moves to the final public launch phase:
1. Submit `https://california-navigator.org/sitemap.xml` to GSC only after live smoke test passes.
2. Request indexing for the following priority hub routes:
   - `/benefits/texas`
   - `/counties/texas`
3. Request indexing for the top 10 county hubs:
   - Harris, Dallas, Travis, Bexar, Tarrant, Collin, Denton, Fort Bend, El Paso, Hidalgo
4. Request indexing for the core Texas programs:
   - `tx-hcs`, `tx-class`, `tx-txhml`, `tx-mdcp`, `tx-dbmd`, `tx-twc-vr`
