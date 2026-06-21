# State Upgrade Lessons Learned

This document captures key technical, data modeling, and procedural lessons learned during the Texas and Florida state pilot upgrades. Future state upgrades must implement these principles to avoid regressions.

---

## 1. Florida Upgrade Lessons Learned

### DCF ACCESS Mixed Routing Model
*   **Problem:** Florida's welfare intake (DCF ACCESS) relies on a combination of official state storefronts and hundreds of local "community partner" sites (e.g. libraries, nonprofits) hosting public terminals. Staging all partner sites in `county_offices` causes database bloat.
*   **Lesson:** Partition storefronts from community partners. Only stage direct, state-operated storefronts as primary county office records, keeping community partners out of the database unless direct coverage is missing.

### APD / iBudget Regional Catchment Mappings
*   **Problem:** The Agency for Persons with Disabilities (APD) administers the iBudget waiver through 14 Area Offices serving all 67 counties. Duplicating office records for each county violates database normalization.
*   **Lesson:** Model regional catchment routing using a one-to-many county mapping in a junction table, mapping each of the 67 counties to their respective regional Area Office.

### Early Steps Regional Overlap Handling
*   **Problem:** Early Steps (Florida's Part C early intervention program) splits the state into 15 local program portals. However, Miami-Dade County is geographically split and served by two separate portals (Southernmost and North Dade).
*   **Lesson:** Do not assume a strict 1-to-1 county-to-agency relationship. Catchment junction tables (like `regional_center_counties` or equivalent) must support many-to-many relationships to handle overlapping boundaries.

### FDLRS `counties_served` Semantic Mappings
*   **Problem:** FDLRS Associate Centers list served counties as comma-separated text strings, which cannot be directly matched to relational database fields.
*   **Lesson:** Ingestion scripts must parse and trim comma-separated list values, resolving them to official database FIPS county identifiers before mapping.

### ESE District Source Hierarchy
*   **Problem:** Direct ESE contact details on school district websites change frequently and are highly unstable.
*   **Lesson:** Rely on a multi-tiered official source hierarchy: first, the official state FLDOE ESE Director Directory for verified emails/names; second, the school district's official ESE department page for direct office lines; and third, local transition directories (like Project10) for verification of edge cases.

### ESE Re-Keying Reference Safety Audit
*   **Problem:** Replacing fallback school districts required re-keying database primary keys from `sd-{county}-fl-fallback` to clean county IDs `sd-{county}-fl`.
*   **Lesson:** Run a database reference audit script before executing primary-key updates to ensure no foreign keys reference the old ID. Since no tables referenced school district IDs, the re-keying was safe.

### CARD/Clinic Physical Location vs. Service Area
*   **Problem:** CARD clinics serve large multi-county regions from a single university or hospital campus (e.g. CARD UF Gainesville serving 14 counties).
*   **Lesson:** Never duplicate clinic records in `resource_providers` for each county served. Ingest the clinic once at its physical address, and document its regional service area in description text or catchment tables.

### Forms Schema Gap Handling
*   **Problem:** The SQLite database lacks a staging table for forms, which can lead to relational constraint failures.
*   **Lesson:** Stage forms directly inside the migration transaction under `review_status = 'auto_accepted'` to satisfy relational check gates without requiring schema modifications.

### Private Provider Review Queue Boundary
*   **Problem:** Private legal firms and commercial therapy centers carry high liability and reputational risk if published without bar credential vetting.
*   **Lesson:** Place all commercial advocacy, legal, and therapy resources in a local `provider_legal_review_queue.json` file for manual verification. Only non-profit organizations and official state services may be promoted directly to the production database automatically.

### Launch Gating & GSC Indexation
*   **Problem:** Submitting sitemaps or indexing new states before validation is complete leads to broken routes leaking to search engines.
*   **Lesson:** Keep sitemaps and county pages gated via `noindex` and allowlist configurations during local/staging runs. Only enable indexation once the final public domain smoke test returns 100% success.

---

## 2. Texas Pilot Lessons Learned

### DB_ENCRYPTION_KEY Runtime Dependency
*   **Problem:** Next.js production builds (`npm run build`) and runtime page requests returned `500 Server Error` or crashed at startup when database decryption failed.
*   **Lesson:** The SQLite database is encrypted. Ensure the `DB_ENCRYPTION_KEY` environment variable is defined in the local shell for builds/tests, and configured in Vercel environment settings for deployment.

### Circular Dependency Fix via `verifiedCounties.ts`
*   **Problem:** Importing verified county arrays directly from Route Handlers (`counties.xml/route.ts`) into Page Components (`page.tsx`) caused runtime `ReferenceError: NON_CA_VERIFIED_COUNTIES is not defined` due to Next.js compilation differences.
*   **Lesson:** Never import constants from route handlers into pages. Move shared state configuration and list constants to a dedicated shared library, e.g. `frontend/src/lib/verifiedCounties.ts`.

### Sitemap Query Performance Optimization
*   **Problem:** The counties sitemap `/sitemaps/counties.xml` timed out (or exceeded serverless execution limits) because it queried full database details for all 1,500+ county-diagnosis links.
*   **Lesson:** Optimize queries by preloading database details only for the primary state (California). Use lightweight static arrays (`verifiedCounties`) for the pilot state's counties to avoid repetitive, heavy database lookups in sitemap handlers.

### Staging-First Ingestion
*   **Problem:** Early versions of crawler scripts wrote records directly into production tables, resulting in corrupted schemas or duplicate entries when runs were interrupted.
*   **Lesson:** Always ingest new records into staging tables first. Validate the staging output against completeness, validation, and deduplication rules before promoting to production.

### Evidence, Origin, and Verification Status Schema
*   **Principle:** Maintain absolute data transparency. Every record must specify:
    1.  `evidence_level`: Sourcing quality (e.g. `official_locator_derived`, `curated_seed`, `county_seat_fallback`).
    2.  `data_origin`: Where the data was obtained (e.g. `official_directory_extract`, `scraped`).
    3.  `verification_status`: Vetting status (e.g. `official_verified`, `source_listed`, `generated_county_fallback`).

### Confidence Scoring by Evidence Type
*   **Principle:** Do not assign arbitrary trust scores. Base confidence scores on evidence type (e.g., official directories get 90-100%, scraped provider lists get 70-80%, fallbacks get <50%).

### No Fallback Deletion Before Replacement Routing Exists
*   **Problem:** Deleting fallback records prematurely led to page rendering failures (404s or broken templates) when no valid replacement routing map existed.
*   **Lesson:** Keep generated county fallbacks active in the database until real, verified replacement resources are successfully seeded and mapped.

### Physical Location vs. Service Area (Texas ECIs)
*   **Problem:** Similar to CARD clinics, Texas ECI (Early Childhood Intervention) contractors serve specific county clusters from a single headquarters location.
*   **Lesson:** Map headquarters physically and county service coverage via regional junction tables. Do not duplicate headquarter addresses.

### Rendered HTML noindex Checks
*   **Problem:** Smoke tests that only check metadata configuration files can miss runtime hydration errors that prevent `noindex` tags from rendering.
*   **Lesson:** Playwright E2E smoke tests must parse the final, fully rendered HTML document to assert the literal presence of `<meta name="robots" content="noindex, follow" />`.

### District-Grade Education Proof Must Reject Word-Fragment False Positives
*   **Problem:** Texas v5 initially promoted many counties because `ARD` matching was too loose and fired inside unrelated words like `board`, allowing trustee and governance pages to pass as special-education evidence.
*   **Lesson:** District-grade education validation must use role-aware term patterns with word boundaries and strong/weak evidence classes. Governance, calendar, athletics, employment, agenda, and board-policy pages must be explicit hard rejects even when they live on a real district domain.

### AskTED Homepage Provenance Cannot Substitute for Verified District Evidence
*   **Problem:** AskTED district homepage URLs were sometimes stale, district-owned subdomains changed over time, and the verified special-education page lived on a different but still district-controlled host.
*   **Lesson:** Preserve two distinct truths in the artifact chain:
    1.  the AskTED district seed URL used for candidate discovery, and
    2.  the actual verified evidence URL/domain that satisfied the district-grade gate.
    PASS counties must be justified by the fetched district evidence page itself, not by the generic AskTED seed or a stale homepage field.

### California-Grade PASS Requires Direct District Evidence, Not Regional Fallback
*   **Problem:** ESC pages, TEA generic pages, and other regional fallback sources can provide helpful routing, but they overstate county completion if treated as district-grade proof.
*   **Lesson:** For California-grade education completion, a county only passes when an official district-owned page proves special-education routing directly. ESC or statewide fallback may keep a county operationally useful, but it remains PARTIAL and non-index-safe until direct district-grade evidence exists.
