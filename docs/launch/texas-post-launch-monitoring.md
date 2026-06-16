# Texas Post-Launch Monitoring & QA Manual

This document outlines the standard post-launch QA checks and monitoring procedures to run weekly or upon any new data deployment.

---

## Post-Launch QA Checklist

### 1. Indexing & Sitemap Verification
*   [ ] **Sitemap Presence:** Confirm that `static.xml` and `counties.xml` parse cleanly and are registered under `/sitemap.xml`.
*   [ ] **Index Gating (Sitemap):** Verify exactly 248 verified Texas counties are in the sitemap, and the 6 gated counties are excluded.
*   [ ] **Index Gating (Meta Robots):** Verify that gated counties (e.g. `/counties/texas/brazos-tx`) render with a `<meta name="robots" content="noindex, follow" />` tag.
*   [ ] **Diagnosis Leaf Pages:** Verify that all Texas county x diagnosis leaf pages (e.g., `/benefits/texas/autism-spectrum-disorder/harris-tx`) are gated with `noindex`.
*   [ ] **State Hubs & Programs:** Verify that `/benefits/texas`, `/counties/texas`, and all 12 program pages have no `noindex` rules.

### 2. URL & Routing Integrity
*   [ ] **Canonical Tags:** Ensure all rendered county and program pages contain a `<link rel="canonical" href="..." />` tag pointing to their correct path.
*   [ ] **Broken Link Checks:** Periodically check internal links (back to guides, state benefits, home) for 404 errors.
*   [ ] **External Source Links:** Run the broken source link checker script to verify external state URLs return `200 OK`.

### 3. Rendering & Content Completeness
*   [ ] **LIDDA/ECI Separation:** Confirm that LIDDA and Early Childhood Intervention (ECI) contractors render under separate headings on county pages.
*   [ ] **ECI Classification:** Ensure ECI programs do not render as regional centers or LIDDAs, and contain correct local intake phone numbers.
*   [ ] **Clinic Service Areas:** Ensure developmental clinics (e.g. Cook Children's or Texas Children's) only render on their physical county pages (unless county-specific service areas are explicitly supported).
*   [ ] **Waitlist Disclosures:** Verify HCS/CLASS/TxHmL/MDCP waitlist blocks display the official HHSC status link and use `"Not officially stated"` or explicitly label duration numbers as estimates.
*   [ ] **Trust Labels:** Ensure all regional centers, ECI contractors, and Medicaid offices render with a trust badge (e.g. `source_listed` or `official_verified`) with accurate freshness dates.
*   [ ] **Duplicate Records Check:** Verify there are no duplicate cards (e.g., duplicate LIDDA or ECI contact blocks) on a single county page.
*   [ ] **No Empty Broken Sections:** Verify that no dynamic categories (e.g. "School Districts") display raw database errors or look broken when data is missing.

---

## Weekly Sampling Run Sheet

To execute automated sampled checks, run:
```bash
node src/scratch/sample_texas_routes.js
```
This script will sample 25 random counties, 12 program pages, 5 rural/metro representative counties, and all 6 gated counties.

To verify external source links, run:
```bash
node src/scratch/audit_texas_source_links.js
```
The results will be logged in `docs/launch/texas-source-link-audit.md`.
