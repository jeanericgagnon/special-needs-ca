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

### Residual County Cleanup Must Be Failure-Class Driven
*   **Problem:** After Texas v5, the remaining 38 counties did not behave like one uniform scrape backlog. Most were either true `search_fallback_exhausted` cases, a few had broken district-homepage seeds, and one had only weak student-services evidence.
*   **Lesson:** Once a state reaches the final cleanup stage, stop treating the remainder as a generic queue. Split the residual counties by failure class and use different repair lanes:
    1.  manual exact-target authoring for `search_fallback_exhausted`,
    2.  homepage/domain repair for `district_homepage_broken`, and
    3.  stronger same-domain evidence search for `weak_student_services_only`.

### Small-County District Routing Requires Full County Candidate Exhaustion
*   **Problem:** Stopping at the first district candidate leaves rural counties under-repaired because the first AskTED district homepage often lacks a usable special-education page while another district in the same county has one.
*   **Lesson:** For final county-grade education repair, the runner must try every AskTED district candidate in the county until one direct district-grade source verifies or the bounded budget is exhausted. “First district failed” is not a truthful county-level stopping rule.

### Navigation Text Can Create False District-Page Rejections
*   **Problem:** Texas v7 found valid district-owned pages for `Special Populations`, `Dyslexia`, and related special-education surfaces that were initially rejected because the validator saw unrelated navigation words like `board`, `athletics`, and `calendar`.
*   **Lesson:** For California-grade district routing, governance-page rejection logic must inspect the page’s evidence header surface first: URL path, title, and headings. Full-body navigation text is too noisy to decide whether a page is truly a governance page or a valid special-education route.

### Sitemap-First Manual Repair Beats Another Search Loop
*   **Problem:** By Texas v8, the remaining county failures were no longer caused by missing district sites so much as by exact district-owned targets being hidden one layer deeper than homepage heuristics and path guesses could reach.
*   **Lesson:** In the final county-repair lane, fetch the district sitemap and author exact district-owned targets from it before reopening any search fallback. District sitemaps frequently expose the real `special-education`, `special-programs`, `dyslexia`, `504`, or document endpoints that make the county pass truthfully without another broad crawl.

### District-Owned Google Sites Need Ownership Plus Content Proof
*   **Problem:** Some Texas districts publish valid special-services workflows on Google Sites, but a Google host alone is not enough to prove district ownership or routing quality.
*   **Lesson:** Accept a Google Site for California-grade county routing only when the fetched final URL embeds the district-controlled domain and the fetched text explicitly proves district-owned special-education routing, such as `Child Find`, `Department of Special Services`, or a named special-education contact.

### Scanned District Documents Need OCR Before Promotion
*   **Problem:** The last residual counties can hide valid special-education routing inside district-owned scanned PDFs, which look promising but are still unproven until the text is extracted.
*   **Lesson:** Treat district documents as partial until OCR or a deterministic manual-text review preserves the special-education snippet, contact evidence, and document hash. Binary fetch success alone is not California-grade proof.

### District-Owned Parent Resource Hubs Can Count Only With Explicit Special-Education Assets
*   **Problem:** Some final residual districts do not maintain a standalone `special-education` page but do publish a district-owned parent hub with the real routing materials embedded as resource links.
*   **Lesson:** A district-owned parent resource page may satisfy California-grade education routing only when the fetched body explicitly lists multiple special-education assets such as `Special Education Guides`, `Section 504`, `Dyslexia Handbook`, `Parent's Guide to the ARD Process`, `Notice of Procedural Safeguards`, or an equivalent district-facing complaint/referral resource. Generic parent hubs still fail closed.

### Full Packet Coverage Must Trigger Failure-Class Repair Mode
*   **Problem:** Once every non-complete state has a packet artifact, continuing to create more queue-expansion passes burns time without moving any state closer to `COMPLETE/index_safe`.
*   **Lesson:** After all states have packet coverage, stop expanding the queue and switch to failure-class repair mode. Use the generated state packet artifacts as the only control plane for deciding which family-specific repair lane should run next.

### Shared Failure Classes Should Be Repaired As Cohorts
*   **Problem:** After packet coverage is complete, the next five high-priority states often share the same blocker pattern: county or district leaf pages are still generic-root or statewide-only, while statewide support families are either inventory-only or missing.
*   **Lesson:** Build repair cohorts by shared failure class, not by the original packet-generation batch label. This keeps the next operator focused on one repair method at a time, makes lessons portable across states, and avoids re-planning the same county-grade problem state by state.

### Root-Domain Review Packets Should Precede County-Grade Leaf Authoring
*   **Problem:** The hardest post-packet blocker is often not a missing state program page but a known generic root like a regional-center homepage, APD region root, DODD root, or district homepage that still lacks a reviewed county/district leaf target.
*   **Lesson:** Before reopening scraping, package each county-grade family into a deterministic root-domain review packet with exact-target goals, sample source URLs, and required leaf terms. This makes manual or semi-automated authoring reproducible and prevents repeating broad discovery for the same domains.

### Statewide Agency Landings Must Fail Closed In County-Grade Leaf Repair
*   **Problem:** Bounded same-domain discovery can still surface attractive but misleading statewide pages like `/agencies/dhs` or generic application pages that mention services without actually proving county office or district routing.
*   **Lesson:** County-grade leaf repair must reject statewide agency landings unless the title, headings, and URL itself prove local office, district, regional, or locator semantics. Contact-only or apply-only state pages are progress hints, not county-grade proof.
