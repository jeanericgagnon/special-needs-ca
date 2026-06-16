# Texas Production Deployment Checklist

Use this checklist to prepare and verify the production deployment on Vercel before submitting the sitemap to Google Search Console.

> [!IMPORTANT]
> **Verification Requirements:**
> Target Server: http://localhost:3000 local production build. Public production verification is still required against https://california-navigator.org before Google Search Console sitemap submission.
>
> **Deferral Notice:**
> Public deployment, live-domain verification, and GSC submission are intentionally deferred until after the next state-upgrade phase. Texas remains internally verified and ready for future production launch.

---

## Pre-Deployment Verification

### 1. Database Synchronization
*   [ ] **SQLite File Verification:** Confirm that the production `ca_disability_navigator.db` file in `frontend/` matches the locally validated database (exactly 2,810 Texas records, 248 verified counties, 12 programs, 6 gated counties, and 0 fallbacks).
*   [ ] **Build Sync:** Confirm that `npm run build` is executed in the `frontend/` directory after any database change to compile static caches and routes.

### 2. Environment Variables (Vercel)
*   [ ] **DB_ENCRYPTION_KEY:** Confirm the production decryption key is set correctly in Vercel environment.
*   [ ] **NEXT_PUBLIC_SITE_URL:** Verify that the environment variable `NEXT_PUBLIC_SITE_URL` is set to the production domain: `https://california-navigator.org`.
*   [ ] **NODE_ENV:** Set to `production`.

### 3. DNS and SSL Setup
*   [ ] **Domain Resolution:** Verify that `https://california-navigator.org` resolves correctly.
*   [ ] **SSL Certificate:** Verify that the Vercel-generated Let's Encrypt SSL certificate is active and HTTPS redirects are forced.

---

## Post-Deployment Verification (Live Site)

Once the Vercel deployment completes successfully, run these checks against the live site:

### 1. Sitemap & Robots Index Validation
*   [ ] **Robots.txt Check:** Retrieve `https://california-navigator.org/robots.txt` and verify it allows crawling of `/benefits/*` and `/counties/*` while disallowing administrative paths.
*   [ ] **Sitemap.xml Check:** Retrieve `https://california-navigator.org/sitemap.xml` and verify it references `/sitemaps/static.xml` and `/sitemaps/counties.xml`.
*   [ ] **County Sitemap Inclusions:** Parse `https://california-navigator.org/sitemaps/counties.xml` to confirm exactly 248 Texas counties are listed, and the 6 gated counties are excluded.
*   [ ] **County × Diagnosis Gating:** Confirm that no Texas county × diagnosis leaf pages (e.g. `/benefits/texas/autism-spectrum-disorder/harris-tx`) are present in the sitemap.

### 2. Live Page Smoke Tests
Run the automated live smoke test tool to check status codes, canonicals, ECI/LIDDA separation, trust labels, and waitlists on representative live URLs:
```bash
node src/scratch/smoke_test_live_site.js https://california-navigator.org
```

Verify that:
*   [ ] Indexable county pages return `200 OK` and have NO `noindex` rules.
*   [ ] Gated counties (Brazos, Lavaca, McLennan, Tyler, Victoria, Wichita) return `200 OK` but contain `<meta name="robots" content="noindex, follow" />`.
*   [ ] Canonical links on all pages point to `https://california-navigator.org/...` (not localhost or staging domains).
*   [ ] ECI contractors and LIDDAs render separately on county pages.
*   [ ] Clinic service-area constraints are respected.
*   [ ] Trust badges render correctly with verified metadata.
*   [ ] No staging/debug text (e.g., `localhost:3000` or raw JSON logs) is visible.

---

## Launch Submission (DEFERRED)

*   [ ] **Submit Sitemap:** DEFERRED. (Target Server: http://localhost:3000 local production build. Public production verification is still required against https://california-navigator.org before Google Search Console sitemap submission.)
*   [ ] **Request Indexing:** DEFERRED. (Public deployment, live-domain verification, and GSC submission are intentionally deferred until after the next state-upgrade phase. Texas remains internally verified and ready for future production launch.)
    *   `/benefits/texas`
    *   `/counties/texas`
    *   Texas county hubs (Harris, Dallas, Travis, Bexar, Tarrant, Collin, Denton, Fort Bend, El Paso, Hidalgo)
    *   Texas program pages (tx-hcs, tx-class, tx-txhml, tx-mdcp, tx-dbmd, tx-twc-vr)
