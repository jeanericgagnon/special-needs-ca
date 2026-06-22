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

### Structured County Coverage Can Upgrade One Official Leaf To Statewide County-Grade
*   **Problem:** Some statewide repair leaves stay partial because they only prove one district or one local office, while others genuinely carry statewide county coverage in structured HTML that should not be left trapped in a generic partial bucket.
*   **Lesson:** Promote a family from exact-leaf partial to verified state-grade only when the official leaf itself enumerates county coverage explicitly, such as `Counties Served` lists or a county-office table. If the county mapping is interactive-only, hidden behind scripts, or absent from the fetched HTML, keep the family partial and ledger the blocker rather than inferring coverage.

### Live Official Paths Must Replace Legacy Packet URLs Before Rejection
*   **Problem:** Pennsylvania’s old `dhs.pa.gov` packet hints looked dead because they now resolve to generic agency shells, even though the live `pa.gov` contact pages still expose the exact county MH/ID and CAO resources we need.
*   **Lesson:** When a packet URL redirects to a generic agency landing, do one bounded live-path repair on the same official domain before classifying the family as blocked. If the live replacement page preserves the exact role in the title and fetched body, repair the packet and continue; do not treat the stale legacy path itself as proof that the source family is gone.

### Bare `403` Text In Navigation Must Not Trigger A Block Verdict
*   **Problem:** Pennsylvania IU special-education leaves can include unrelated navigation text such as `403(b)` retirement-plan links, which caused a false block when the verifier treated any bare `403` body substring as challenge or forbidden evidence.
*   **Lesson:** Blocked-page detection must rely on explicit blocked phrases in the title, headings, or final URL, or on known challenge/error shells. Do not reject an otherwise valid county- or district-grade page just because the raw body contains an unrelated `403` substring in navigation or footer text.

### Portal And Community-Partner Replacements Cannot Substitute For County-Grade Local Office Proof
*   **Problem:** Florida’s legacy ACCESS local service-center map now returns `404`, and bounded same-domain repair on the official DCF site only exposes a statewide customer-service center plus community-partner search, not a real county-grade office locator.
*   **Lesson:** When an official county-office locator disappears, do not silently replace it with a portal login, statewide call center, or community-partner directory. Keep the county-local family blocked until the official site again exposes county-grade office or locator evidence.

### Stale Launch-Gate Exposure Flags Should Clear Once A State Packet Is Reaudited
*   **Problem:** Some states carry a `legacy_index_exposed_without_california_grade_reaudit` blocker long after a state packet has been rerun and the state is already explicitly `index_safe=false`; that leaves a stale procedural blocker sitting ahead of the real critical family.
*   **Lesson:** Clear the launch-gate blocker only after a fresh state repair pass rewrites the packet summary, preserves `index_safe=false`, and leaves a concrete current critical-family blocker in place. This removes fake progress swings without loosening the California-grade gate.

### Exhausted Exact-Leaf Packets Should End In Explicit Blocked State, Not Fake Fast-Finish Partial
*   **Problem:** A state can linger in `PARTIAL` even after its bounded official packet roots have already been exhausted, which creates the illusion that another rerun of the same reviewed roots might still finish county-grade coverage.
*   **Lesson:** Once the reviewed exact-leaf packet has been exhausted and the remaining blocker is either a missing official locator or unauthored county/district leaves beyond the bounded packet roots, reclassify the state as `BLOCKED` with explicit terminal blockers. Do not keep it in a fast-finish bucket unless a new exact official target set actually exists.

### Discovery-Exhaustion Planning Does Not Count As Verified Statewide Support Evidence
*   **Problem:** A state can carry planning artifacts or source-discovery exhaustion notes claiming that PTI, P&A, or legal-aid coverage is “mapped,” while the packet still lacks a reviewed verified-source row for that family.
*   **Lesson:** Discovery reports and authored target plans are planning evidence only. Upgrade a statewide support family only when the packet already contains a reviewed first-party or authoritative verified source; otherwise keep it blocked or missing, even if the planning layer says the category is covered.

### Third-Party Data Mirrors Cannot Substitute For Live Official County Directories
*   **Problem:** Ohio’s county-local packet looked partially covered because legacy county-office rows pointed to a DOI-hosted dataset mirror after the official Ohio JFS county directory and locator roots went dead.
*   **Lesson:** A third-party archive, open-data mirror, or DOI dataset may preserve research context, but it cannot satisfy California-grade county-local routing once the official county directory fails. County-grade local office proof must come from a live official county directory, locator, or county-owned office page.

### Unrelated Packet Samples Must Not Masquerade As The Designated Statewide Support Family
*   **Problem:** New York’s packet carried verified nonprofit samples for P&A and PTI slots, but the sample rows pointed to unrelated advocacy organizations and regional parent centers instead of the designated statewide authorities DRNY and Parent Network of WNY.
*   **Lesson:** A statewide support family only upgrades when the reviewed packet evidence actually matches the designated first-party statewide source. Nearby advocacy or parent-support organizations may be useful, but they cannot satisfy the P&A or PTI gate by association.

### Regional PTI Coverage Cannot Be Promoted As Statewide PTI Completion
*   **Problem:** Illinois had a real reviewed PTI source on disk, but the fetched evidence was explicitly scoped to downstate Illinois while the designated statewide PTI target was a different organization.
*   **Lesson:** A reviewed PTI source only upgrades the statewide PTI family when its service scope actually matches the statewide gate. Regional or downstate-only PTI coverage is useful evidence, but it must remain blocked or partial until the designated statewide PTI source is reviewed and verified.

### Reviewed Source-Pack Evidence Should Repair Stale State Packets Before New Discovery
*   **Problem:** California’s packet still marked Early Start, VR, P&A, and legal-aid families as weak or missing even though reviewed first-party fetch evidence for those families already existed on disk in the California source-pack outputs.
*   **Lesson:** Before authoring new targets or reopening discovery, reconcile the state packet against reviewed source-pack fetch artifacts. If authoritative first-party evidence is already fetched and role-aligned, upgrade the packet from that evidence first and reserve new discovery only for the families that still remain blocked after reconciliation.

### One Unresolved Regional Root Can Truthfully Block Multiple Counties At Once
*   **Problem:** Pennsylvania’s final education gap was not three independent county mysteries. Lackawanna, Susquehanna, and Wayne counties all depended on the same unresolved Northeastern Educational Intermediate Unit 19 root after the bounded exact-leaf packet was exhausted.
*   **Lesson:** When multiple counties collapse to one unresolved official regional root, ledger the blocker at the shared-root level and final-block the state if no reviewed exact leaf exists. Do not keep a state in `PARTIAL` just because the residual count is small.

### District-Owned County Leaves Can Clear A Stale Shared Regional Blocker
*   **Problem:** Pennsylvania’s IU19 blocker looked final only because the packet had stopped at the unresolved regional root, while live district-owned leaves still existed in the three affected counties on Scranton, Susquehanna Community, and Wallenpaupack domains.
*   **Lesson:** Before preserving a shared-root blocker, run one bounded district-owned repair pass across the affected counties themselves. If reviewed county-specific district leaves exist, upgrade the family from those exact leaves and retire the stale regional-root blocker instead of keeping the whole state blocked.

### Replatformed Official Map Pages Can Hide Structured Data Feeds
*   **Problem:** Florida’s legacy ACCESS local-office map was dead, but the replatformed DCF benefits page still linked to a live official Family Resource Center experience whose county storefront data lived in a same-domain `providers.csv` feed rather than in the old static map URL.
*   **Lesson:** When an official locator page dies, inspect the live replacement page source for same-domain CSV, JSON, or county accordion data before preserving a missing-locator blocker. Replatformed official experiences may still carry truthful structured coverage even when the legacy root is gone.

### Complementary First-Party Legal-Aid Sources Can Satisfy One Statewide Support Family
*   **Problem:** Georgia looked blocked on legal aid because no single reviewed source on disk covered the whole state, even though Georgia Legal Services Program and Atlanta Legal Aid together cleanly split the state by service area on first-party pages.
*   **Lesson:** A statewide support family can be upgraded from multiple reviewed first-party sources when each source explicitly states its service area and the combined coverage closes the statewide gap without overlap-by-assumption. Preserve the split in the evidence chain instead of forcing a fake single-source statewide claim.

### Statewide Legal-Help Portals Can Count When They Explicitly Route To Lawyers
*   **Problem:** Ohio looked blocked on legal aid because the packet stopped at an authored LSC planning target even though a reviewed Ohio-specific first-party portal already offered legal information, forms, and direct lawyer-finding routes statewide.
*   **Lesson:** A statewide legal-aid family can be upgraded from one reviewed first-party legal-help portal when the live page explicitly serves the state and clearly offers legal information, forms, and lawyer or organization connections. Do not require a separate legal-services corporation row if the reviewed statewide portal already satisfies the routing role truthfully.

### Official Replatform Redirects Must Refresh The Reviewed Authority Domain
*   **Problem:** New Mexico’s low-token role queue rejected live official HCA pages as `wrong_domain_after_fetch` because the reviewed allowlist and packet still expected the retired `nmhealth.org` or `hsd.state.nm.us` roots, even when the official source had moved to `hca.nm.gov`.
*   **Lesson:** When a reviewed official state source redirects to a new cabinet or replatform domain on the same state authority, refresh the packet’s reviewed authority domain before calling the role rejected. A stale allowlist is a packet bug, not proof that the official family is gone.

### Zero-Sample Verified Families Must Be Rehydrated Or Downgraded
*   **Problem:** Georgia carried `vocational_rehabilitation_pre_ets` as `verified_state_grade` while the packet’s verified-source row had `sample_count = 0`, which made the all-state audit look stronger than the state evidence ledger actually showed.
*   **Lesson:** A family cannot stay `verified_state_grade` with an empty sample chain. When the DB already contains a reviewed verified row, rehydrate the packet from that concrete evidence; otherwise downgrade the family until a real verified sample exists on disk.

### JavaScript Loading Shells Do Not Count As Reviewed Official Evidence
*   **Problem:** Kentucky’s reviewed replacement URLs for DBHDID DD routing and HCBS waiver eligibility returned HTTP `200`, but both static fetch and Playwright render only produced a generic loading shell with no headings, contacts, eligibility text, or action content.
*   **Lesson:** An HTTP `200` official page is still unverified when the rendered body is just a JavaScript loading shell. Do not preserve `verified_state_grade` from title or path alone; either capture the real role-aligned rendered content through a reviewed browser/API lane or downgrade the family until substantive evidence exists on disk.

### Dead Packet Roots Do Not Invalidate Live Same-Agency Leaves
*   **Problem:** Kentucky’s statewide packet treated Medicaid, HCBS waiver, Part C, and KDE special-education families as dead or missing because the old packet roots were stale, broken, or pointed at the wrong authority surface, even though live reviewed first-party leaves still existed on the same CHFS or KDE domains.
*   **Lesson:** When an inherited packet root is dead or misaligned, do a bounded sibling-leaf check on the same reviewed state agency domain before leaving the family downgraded. A stale root should be replaced by a live role-pure official leaf when one exists, but that repair does not relax county-grade or district-grade requirements.

### Generic Employment Pages Do Not Prove VR, But VR + Youth Leaves Can
*   **Problem:** Missouri’s packet treated vocational rehabilitation as missing because the old sample was a DD page and a later repair probe hit a generic DMH employment-services page that still did not prove statewide VR or Pre-ETS routing.
*   **Lesson:** Do not upgrade vocational rehabilitation from a generic employment or workforce page. Upgrade only when the reviewed official VR leaf provides statewide VR routing and a companion youth or transition leaf explicitly proves Pre-Employment Transition Services or student-disability routing.

### Statewide Support Truth Can Survive A Local Staging Rejection
*   **Problem:** Ohio’s Disability Rights Ohio page had already been accepted as first-party parsed evidence, but the staging lane still routed it to manual review because the nonprofit promotion path expected a county ID. That local-table constraint made the statewide P&A family look falsely missing in the packet.
*   **Lesson:** When a reviewed first-party artifact clearly proves a statewide support family, do not let a county-level staging requirement erase that truth from the California-grade packet. Use the accepted artifact directly for packet evidence, and keep the local-table issue separate from the statewide gate.

### Explicit First-Party Designation Text Can Resolve Statewide Support Families
*   **Problem:** Some state packets leave PTI, P&A, or similar statewide support families as `missing` or `inventory_only` even when a reviewed first-party artifact already states the exact statewide designation on the homepage or About surface.
*   **Lesson:** When a reviewed first-party page explicitly says it is the federally designated PTI, the statewide protection-and-advocacy organization, or another exact statewide support authority, upgrade the family from that designation text directly. Do not keep the family blocked just because the old packet lacked a clean sample chain.

### Official Interactive Locators Do Not Count As County-Grade Proof Until Their County Data Is Reviewed
*   **Problem:** Nebraska exposed a live official county-office chain through a `Public Assistance Offices` page that linked to a GIS Experience Builder locator, but the fetched locator only rendered a generic `Experience` shell and did not preserve county rows or structured office evidence in the reviewed artifact chain.
*   **Lesson:** A live official locator link is not county-grade proof by itself. Upgrade county-local routing only when the reviewed HTML, document, or extracted data preserves concrete county offices, counties served, or structured local routing evidence. Interactive locator shells stay blocked until the county data itself is reviewed.

### Statewide Program Repair Must Not Erase A Remaining County-Grade Blocker
*   **Problem:** New Mexico’s official ECECD FIT page and HCA Medicaid leaves were enough to repair stale or missing statewide source families, but they still did not prove county-grade local routing for FIT offices or county-local disability resources.
*   **Lesson:** When a reviewed official statewide program leaf exists, upgrade the family from `missing` to the most accurate blocked state instead of leaving it missing or falsely promoting it to complete. A live statewide program page can truthfully repair the state-level source family while the county-grade gate remains blocked on local-office or district-owned proof.

### Older State Refresh Scripts Must Not Regress Newer Family Repairs
*   **Problem:** Georgia’s `batch37` blocker-refresh runner and test still expected legal aid to be blocked even after a later repair pass had already upgraded legal aid to reviewed statewide first-party coverage. Re-running the stale helper would have rewritten the packet back to an older, less truthful state.
*   **Lesson:** Whenever a later state-specific repair changes one family’s packet truth, update any older refresh helpers and their tests that still rewrite that state’s summary, gap matrix, verified sources, or blocker queues. A state refresh script must never regress a newer reviewed family upgrade just because its own batch assumptions are stale.

### Browser-Visible Official Pages Can Falsely Look Like Static 403s
*   **Problem:** Georgia DBHDD region pages returned `403` in the low-token static fetch lane and were treated as dead or forbidden, while browser-visible official pages still exposed counties served and DD intake contacts.
*   **Lesson:** Before final-blocking an official county-grade family on repeated static `403` shells, run one bounded browser-visible verification pass on the same reviewed official URLs. Treat a static/browser mismatch as a scraper-lane blocker that needs browser-assisted rehydration, not as proof that the official source family is gone.

### Reused Legacy Domains Must Be Treated As Drift, Not Evidence
*   **Problem:** Arkansas inherited `adcpti.org` as a PTI hint, but the reviewed live page had drifted into unrelated Korean investment and betting content while the real Arkansas PTI evidence lived on The Center for Exceptional Families first-party domain.
*   **Lesson:** When a legacy support-family domain now serves unrelated non-state content, treat it as explicit domain drift and remove it from evidence consideration immediately. Do not preserve it as weak inventory. Reconcile the packet against a reviewed first-party replacement only if the replacement itself explicitly preserves the role text and state scope.

### Reviewed Raw First-Party HTML Can Repair A Rejected Support Page
*   **Problem:** Hawaii’s LDAH page was rejected by the lightweight nonprofit validator because its contact details were rendered inside injected footer markup, yet the reviewed raw first-party HTML still preserved explicit Parent Training & Information Center designation text plus office-contact evidence.
*   **Lesson:** When a reviewed first-party statewide support page is rejected only because lightweight extraction missed JS-injected contact blocks, inspect the saved raw HTML before preserving an `inventory_only` blocker. If the reviewed body itself clearly preserves explicit designation text and direct contact evidence, repair the packet from that artifact instead of reopening discovery.

### First-Party 404 Shells Do Not Count As Statewide Support Proof
*   **Problem:** Minnesota inherited Mid-Minnesota Legal Aid / Minnesota Disability Law Center evidence in the packet, but the reviewed first-party fetch preserved only a `Page not found` shell with site chrome, nav links, and contact snippets rather than a live role-aligned legal-aid or P&A leaf.
*   **Lesson:** Do not preserve statewide support verification from a first-party 404 shell just because the page still shows the right organization name, navigation, or footer contact information. Demote the sample chain and keep the family blocked until a live role-aligned first-party leaf is reviewed.

### PTI Navigation Alone Does Not Prove Statewide PTI Designation
*   **Problem:** North Carolina’s reviewed ECAC homepage preserved strong family-support language and direct navigation to a `Parent Training and Information Center (PTI)` page, but the saved artifact chain did not include a fetched leaf that explicitly stated statewide PTI designation.
*   **Lesson:** Do not upgrade a PTI family from homepage navigation alone. Keep the family `inventory_only` or blocked until the reviewed artifact chain preserves an explicit statewide PTI designation on the fetched page itself, not just a menu link or inferred organization role.

### Official WordPress JSON Endpoints Can Resolve Accordion-Heavy State Leaves Without A Browser Pass
*   **Problem:** Alabama's live ALSDE and ADMH county-grade pages looked too thin in cheap HTML reads because the visible leaves were accordion-heavy and menu-noisy, which made the packet look like it still needed district discovery and locator review.
*   **Lesson:** Before escalating an official WordPress state leaf to browser-assisted review, check the matching `wp-json/wp/v2/pages/<id>` rendered content. If the JSON body preserves county lists, LEA coordinators, regions served, office phones, or counties covered, use that reviewed first-party content directly and reconcile it against the state's county list.

### Official State District Directories Can Replace County Fallbacks In Borough-Based States
*   **Problem:** Alaska's packet treated district routing as statewide fallback evidence even though DEED already exposed an official district-profiles search, district map, and district detail leaves with district-owned contact fields.
*   **Lesson:** In borough-based or district-structured states, check the official state district directory before opening district-by-district discovery. If the directory deterministically resolves to district detail pages with address, phone, email, and superintendent fields, use that official directory chain to repair local education routing.

### Live Parent-Support Leaves Do Not Prove PTI When Exact PTI Leaves Are Missing
*   **Problem:** Alaska's Stone Soup Group site exposed live homepage, contact, FAQ, resource-guide, and parent-navigation leaves with statewide support and office evidence, but likely PTI-style leaves returned 404 and no fetched first-party page preserved explicit PTI designation text.
*   **Lesson:** Do not upgrade a PTI family from strong parent-support or contact evidence alone. If the live first-party chain still lacks explicit `Parent Training and Information Center` text, and likely PTI leaves are 404 or missing, keep the family blocked and record that exact first-party designation gap.

### Browser-Challenged State Roots Plus Generic County Fallback Rows Are A Terminal Local Blocker
*   **Problem:** Arizona's AZED and DES roots both rendered Cloudflare verification shells in the bounded browser lane, while the current `school_districts` and `county_offices` rows still collapsed to statewide fallbacks or DOI-derived placeholders instead of reviewed local leaves.
*   **Lesson:** When the live official state roots are browser-challenged and the current local rows are still generic fallbacks, stop calling the family `legacy_state_grade`. Reclassify it as a blocked local-proof family and preserve both truths: the official root is unreadable in the current lane, and the existing county/district rows are not exact evidence.

### Official Searchable District And County Directories Can Clear Local-Proof Families Without County-Specific Packet Authoring
*   **Problem:** Arkansas looked blocked because the packet only preserved statewide DESE and DHS roots plus generic county fallback rows, even though the live official Arkansas School Personnel Directory and DHS County Offices Map already exposed district-specific SPED/504 contacts and county-specific office leaves.
*   **Lesson:** Before opening county-by-county authoring, check whether the state already runs one searchable official district directory and one searchable official county-office directory. If the district directory preserves district-level SPED/504 contact fields and the office directory resolves to county-specific office leaves, those official directory chains can satisfy local routing truthfully without separate county packet authoring.

### Reviewed PTI Designation Can Still Fail The Statewide Gate On Scope
*   **Problem:** California's Matrix Parents page is a live first-party page with explicit `Parent Training and Information Center (PTI)` text, but the same reviewed page limits PTI coverage to Marin, Napa, Solano, and Sonoma Counties.
*   **Lesson:** When a reviewed PTI page preserves explicit designation text, promote it from `unreviewed` to the most accurate blocked state instead of leaving it missing. But do not clear a statewide PTI family unless the reviewed scope text itself proves statewide coverage rather than a regional multi-county footprint.

### Exact First-Party Legal-Aid Homepages Beat Weak Planning Seeds
*   **Problem:** Colorado legal aid looked missing because the packet only preserved an LSC planning seed and a statewide P&A page that was strong for advocacy but too weak for legal-representation routing.
*   **Lesson:** If a legal-aid family is blocked on weak planning or advocacy evidence, try one bounded first-party legal-aid homepage check before reopening discovery. A reviewed homepage that explicitly says it offers free civil legal help to qualifying residents statewide and exposes an apply-for-help route is strong enough to clear the statewide legal-aid family.

### County Leaf Packets Can Fail Because The Root Host Drifted, Not Because The County Lacks An Official Site
*   **Problem:** California's bounded leaf packets carried some county roots that now drift or fail at the hostname level, while adjacent county variants such as `alpinecountyca.gov` still respond live and could support exact county-local authoring.
*   **Lesson:** When a county/district leaf packet dies at `root_fetch_failed_0` or a redirect mismatch, probe the county's likely official hostname variants before declaring the family exhausted. Treat stale packet hosts as repair-first packet drift, not as evidence that local official coverage is impossible.

### Legal-Aid Homepages Can Be Enough Even When Guessed Subpages 404
*   **Problem:** Indiana Legal Services returned 404 on guessed `/about-us/` and `/get-help/` leaves, but the live homepage itself already preserved statewide free civil legal assistance language plus a direct Get Help route.
*   **Lesson:** If a first-party legal-aid homepage explicitly says it provides free civil legal assistance statewide and exposes a direct help/apply route, clear the legal-aid family from the homepage and stop. Do not keep probing guessed subpaths once the role-pure homepage already satisfies the statewide gate.

### Same-Domain Sitemaps Can Hide The Exact PTI Leaf One Level Past A Generic About Page
*   **Problem:** Iowa's reviewed ASK About page preserved real statewide family-support evidence but still failed the PTI gate, while the same-domain sitemap exposed a deeper leaf named `parent-training-and-information-center-ptic` with the exact designation text.
*   **Lesson:** When a first-party About page is real but too generic for PTI, fetch the same-domain sitemap before reopening broader discovery. If the sitemap exposes a role-pure PTI leaf, verify that exact leaf and stop instead of leaving the family blocked on the generic About page.

### Cloudflare On Robots And Sitemap Means The Office-Directory Blocker Is Domain-Wide
*   **Problem:** Alaska's `health.alaska.gov` office-directory leaves looked blocked, and the follow-up check showed the same Cloudflare / 403 shell on `robots.txt` and sitemap endpoints too.
*   **Lesson:** If the office leaf, `robots.txt`, and sitemap endpoints all return the same challenge shell, treat it as a domain-level fetch blocker in the current lane. Stop trying sibling office URLs and record the blocker as lane-wide until a different fetch method or reviewed alternate official domain exists.

### PTI Designation Can Hide On Acknowledgements Or Grant-Funding Pages
*   **Problem:** Arizona's Encircle Families homepage, About, services, FAQs, and resources pages all preserved real statewide support scope but still failed the PTI gate, while the live first-party acknowledgements page explicitly stated that Encircle Families is Arizona's Parent Training and Information (PTI) Center and cited IDEA Part D support.
*   **Lesson:** When a real first-party parent-support site still lacks explicit PTI text on its main navigation leaves, check same-domain acknowledgements, funding, or grant-support pages before preserving the blocker. Those pages can carry the exact designation text needed to clear PTI without broad discovery.

### Equivalent Parent-Center Blocks Need Exact Candidate-Failure Ledgers
*   **Problem:** California's statewide PTI-equivalent lane looked generically blocked until the bounded candidate set was checked directly: Matrix Parents stayed regional, the official DDS FRCN root returned 404, frcnca.org failed TLS in the current lane, and Support for Families returned 403.
*   **Lesson:** When a state allows a PTI-equivalent parent-center source, record the exact bounded candidate failures before leaving the family blocked. That turns a vague statewide-support gap into a resumable repair ledger and prevents rechecking the same dead or transport-broken roots later.

### Whole-State Fallback Rows Should Be Counted Explicitly, Not Described Vaguely
*   **Problem:** Colorado's local blockers were still summarized as generic inventory noise even though the live tables had a much sharper shape: all 64 education rows pointed to one statewide CDE special-education root, and at least 67 county-office rows still pointed to the same DOI mirror.
*   **Lesson:** When a blocked local family collapses to one fallback source URL or mirror across most or all counties, replace generic inventory-count blocker text with exact row-count + source-URL evidence. That makes the blocker actionable without rereading the whole state packet.

### Sparse First-Party Homepages Can Prove Bounded PTI Exhaustion Quickly
*   **Problem:** Connecticut's CPAC homepage exposed only two same-domain links, common About and sitemap roots returned 404, and the bounded follow-up still never preserved explicit PTI text.
*   **Lesson:** When a reviewed statewide family-support site has a very sparse homepage link graph, use that bounded same-domain check to close the PTI search quickly. If the homepage has almost no internal leaves and the likely About/sitemap roots are dead, record bounded exhaustion instead of reopening broad discovery.

### Live Homepage Navigation Can Rehydrate A Zero-Sample Statewide Family
*   **Problem:** Delaware's statewide special-education family had fallen to zero preserved samples even though the live DOE homepage still linked to a current special-education leaf that resolved into the state's legacy special-education page.
*   **Lesson:** When a statewide family shows zero verified samples, check the live homepage navigation before assuming the family is still legacy-only. A current nav link that resolves into a live legacy leaf can truthfully rehydrate the statewide family without solving the separate county-grade routing blocker.

### A Live JS Locator Plus Appconfig Endpoint Hint Is A Browser-Lane Blocker, Not A Static-Scrape Miss
*   **Problem:** Florida's remaining county-local office gap looked like a vague partial CSV issue until the live MyACCESS Community Partner Search proved to be a JS shell and appconfig.js exposed `officeMapping=/dataexchangeproxy`, while a bounded plain GET to that path still returned the shell.
*   **Lesson:** When an official local-office locator returns only a JS shell but the first-party app config exposes an internal mapping endpoint, stop static rechecks and move the family to a browser-assisted or documented API-contract lane. Preserve the partial static coverage count and record the endpoint hint explicitly.

### Browser-Assisted Rechecks Can Invalidate Older “Visible Page” Proof
*   **Problem:** Georgia's DBHDD blocker still claimed Regions 2, 3, and 6 were browser-visible active pages, but a fresh bounded Playwright check showed all six region pages now return official access-denied shells while the county lookup page stays live.
*   **Lesson:** When a blocker depends on older browser-visible evidence, recheck the same official pages before assuming the browser lane still clears them. If the browser now sees the same access-denied shell as static fetch, downgrade the family to a true official-access blocker and stop promising browser-assisted rehydration alone.

### Dead `dhhs.<state>.gov` Samples Must Be Replaced Or Downgraded Immediately
*   **Problem:** Hawaii still carried verified statewide DD and Early Intervention families on `dhhs.hawaii.gov` even though live checks showed the domain does not resolve, while the real DDD content lived on `health.hawaii.gov/ddd/`.
*   **Lesson:** If a “verified” statewide family still points to a synthetic `dhhs.<state>.gov` root, live-check it before trusting the packet. Replace it with the real agency subdomain when one exists; otherwise downgrade the family instead of leaving fake-domain samples in verified state-grade rows.
### Official Early-Childhood Pages Can Preserve Part C Even When The Old Part C Domain Is Dead
*   **Problem:** Kansas lost its old early-start root entirely, and the first likely Part C domain hint also died, but the live KSDE Early Childhood Special Education page still preserved birth-to-three entitlement, KDHE Part C administration, and the external local ITS directory pointer.
*   **Lesson:** When a state's old Part C root is dead, check the live official early-childhood or preschool-special-education leaf on the education agency domain before opening broader discovery. If that page explicitly states who administers Part C and points families to the local intake network, it can repair the statewide Part C family.

## 3. Cross-State Repair Patterns

### Official County Directories Can Count When They Enumerate Every County
*   **Lesson:** A statewide official directory is county-grade enough when the fetched page itself enumerates every county with county-labeled local-routing links. California CDSS IHSS cleared county-local routing once the live page proved 58 county links on one official directory page, without needing 58 separate county re-fetches.

### Browser Lanes Must Be Rechecked When Static JS Shell Evidence Looks Promising
*   **Lesson:** If static fetches show a live JS shell plus config hints, still run one bounded browser probe before promising browser-assisted completion. Florida MyACCESS looked browser-repairable from static shell evidence, but Playwright hit an immediate CloudFront 403 document block, so the lane had to be downgraded from “needs automation” to “official browser access blocked.”

### Live Official County Tables Can Still Fail Closed When The Key Cells Are Blank
*   **Lesson:** Do not count a live official county-routing table just because it returns HTTP 200. Georgia DBHDD still fails county-grade DD routing because the official county page renders blank county cells and repeated region links, even before you consider the blocked region leaves.

### Reflected Search Titles Are Not PTI Designation Evidence
*   **Lesson:** Do not upgrade PTI from a first-party or authoritative search-results page that merely reflects the query in the title. Alaska's Stone Soup search page rendered `Parent Training and Information` in the title, but the body was only generic search results and did not name Stone Soup as the Alaska PTI.

### Matching 403 Challenge Shells Across Sibling Office Roots Are A Domain-Level Block
*   **Lesson:** When office-location, default, and contact roots on the same official domain all return the same Cloudflare `Just a moment...` HTTP 403 shell, stop guessing sibling URLs in the same lane. Treat the family as domain-level fetch blocked until a browser-reviewed or alternate official office listing is available.

### Try Both `www` And Bare County COE Hosts Before Abandoning A Packet Root
*   **Lesson:** California county education packet roots can fail in different ways across host variants. If a county COE `www` host is dead, check the bare domain once; if both fail DNS, record the root as terminally dead and move to the next packet root instead of spending more scrape budget there.

### Statewide County Directories Can Replace DOI Mirrors When They Already Link Every County
*   **Lesson:** If a live official county-services directory already preserves one county-labeled local-routing link for every county on the page itself, use that single reviewed leaf to replace DOI mirror county-office fallbacks instead of reopening 50-plus county leaf fetches.

### State-Hosted District Contact Directories Are Not “Generic” When They Preserve District-Owned Special-Ed Contacts
*   **Lesson:** A state DOE leaf can satisfy county-grade education routing when the page itself lists district-specific Special Education Director entries with district names plus phone/email fields statewide. Do not reject it just because it lives on the state domain; reject only generic special-education roots that lack district-level contact evidence.

### Legacy Nonprofit PTI Sites May Hide Explicit Designation On `.aspx` About Leaves
*   **Lesson:** If a family-support nonprofit homepage is real but the modern `/about/` path 404s, try the legacy `about.aspx` leaf once before leaving PTI blocked. Connecticut CPAC’s homepage looked too generic, but `about.aspx` explicitly preserved federally funded Parent Training and Information (PTI) Center designation text.

### Check `robots.txt` When A WordPress State Site Returns 404 For `sitemap_index.xml`
*   **Lesson:** If an official WordPress state site returns 404 for the common sitemap path, read `robots.txt` before giving up on bounded discovery. Delaware DOE exposed `wp-sitemap.xml` there, which was enough to find the official public-school-list leaves without broad searching.

### Treat A Public Homepage’s Own CSV Fetch As The First-Party Data Contract
*   **Lesson:** If the live official homepage JavaScript explicitly fetches a public CSV to populate county filters or map results, treat that CSV as the published county-coverage contract before chasing blocked browser-only locators. Florida’s Family Resource Center homepage itself fetches `providers.csv`, which proved the official dataset stops at 34 counties.

### Parent Center Hub State Leafs Can Close PTI Gaps When First-Party Pages Omit The Label
*   **Lesson:** When a state parent-center organization’s own site preserves real statewide support scope but not the PTI label, check the exact Parent Center Hub state leaf at `/findurcenter/<state>/`. Those reviewed state leaves can preserve the authoritative `State PTI` or `CPRC` designation plus the named organization and contact block without reopening broad directory discovery.

### Full-Domain 403 Plus Fallback-Only Rows Means Packet Gap, Not Just Browser Gap
*   **Lesson:** When an official state domain 403s on the root, robots.txt, sitemap, and obvious leaf guesses, check whether the live rows are still 100% statewide or DOI-style placeholders. If so, record the blocker as missing authored local leaf coverage too, so later repairs do not stall waiting on a browser lane that still has no exact local targets to verify.

### On California DDS, The Replacement FRC Paths Matter More Than The Dead Legacy Root
*   **Lesson:** If `https://www.dds.ca.gov/rc/frcn` is dead, do not stop there. Check the live DDS replacements under `/services/early-start/family-resource-center/` and `/services/early-start/family-resource-center/regional-center-early-start-intake-and-family-resource-centers/`; together they can preserve statewide equivalent parent-center mission text plus county-by-county FRC routing.

### Connecticut DDS Live Replacements Can Collapse Into PDF Plus Archive Lanes
*   **Lesson:** When stale local-office packet URLs 404 but the live state agency hub survives, check the replacement hub for downloadable regional contact lists and archive town finders before concluding the family has no official replacement. Treat the family as a bounded PDF/archive extraction blocker, not a generic missing-source blocker.

### Public Directory Shells Do Not Equal Anonymous Query Results
*   **Lesson:** A public finder shell can still hide the real records behind an authenticated query endpoint. If the official query URL bounces to a login page, keep the family blocked and record the exact authenticated endpoint instead of counting the shell as district-grade evidence.

### School-List Pages Can Leak County-Useful District Seeds Through Embedded Datasets
*   **Lesson:** If a public school-list page looks generic, inspect the page source once before discarding it. Delaware’s DOE list page embedded a machine-readable district dataset plus report-card link template, which was enough to pick one real district per county and jump straight to first-party special-education leaves.

### Host-Level Challenge Plus Dead Legacy Locator Is A Terminal Local-Office Blocker
*   **Lesson:** If a state office host blocks not just leaves but also `robots.txt` and `sitemap.xml` with `cf-mitigated: challenge`, and the last legacy locator URL is an official 404, treat the local-office family as host-level blocked and stop probing sibling paths until a new official host or browser-readable artifact appears.

### Dead California COE `.org` Roots Can Move To `k12.ca.us` Or District-Owned Replacements
*   **Lesson:** If a California county-office-of-education `.org` root dies or a legacy district host fails TLS, try the county `k12.ca.us` office host and any district-owned replacement domain before declaring the packet exhausted. California cleared its last education blocker by replacing dead `alpinecoe.org` and `colusacoe.org`-style assumptions with `alpinecoe.k12.ca.us`, `ccoe.net`, `ccoe.k12.ca.us`, and `fremontunified.org` exact leaves.

### Official App Config Hints Are Not County-Grade Evidence By Themselves
*   **Lesson:** If an official portal app config exposes a promising endpoint like `officeMapping=/dataexchangeproxy`, do not treat that hint as verified county-routing proof unless a bounded same-domain check also yields reviewed county rows or a documented API contract. Florida still stays blocked because the remaining counties only appear behind a MyACCESS JavaScript shell and an undocumented office-mapping lane.

### Unpublished Markup On Official Links Is A Public-Evidence Failure
*   **Lesson:** If an official county or district lookup page links to leaves marked `data-status-unpublished="1"`, `data-status-in-trash="1"`, or `aria-label="Not visible to public"`, treat the link set as non-public evidence even when the page itself returns HTTP 200. Georgia DBHDD stayed blocked because the public county page pointed only to unpublished region leaves.

### Domain-Wide 404 Plus NXDOMAIN Replacement Is Stronger Than A Dead Leaf
*   **Lesson:** If the root, sitemap, robots, and known child paths on an official domain all return `404`, and the obvious replacement authority subdomains are `NXDOMAIN`, classify the source family as retired at the domain level rather than as a single dead leaf. Ohio county-local routing stayed blocked because the whole `jfs.ohio.gov` family was retired and no live official replacement domain resolved.

### Host-Wide 403 Across Root, Robots, And Sitemap Is Not A Single-Page Failure
*   **Lesson:** If the target page, `robots.txt`, `sitemap.xml`, and the obvious same-host section roots all return `403`, treat the blocker as a host-wide public-access failure rather than as one stale page. New York county-local routing stayed blocked because the whole bounded `health.ny.gov` Medicaid lane was inaccessible, not just `ldss.htm`.

### Packet Scaffolds Do Not Count As Runnable Exact-Leaf Queues
*   **Lesson:** A state packet is not meaningfully “authored” just because a leaf-authoring JSON exists. If `authoredExactLeafCount=0`, keep the family blocked and route the next action to exact-target authoring, not to scraping or browser retries. Arizona’s challenged education and county-office families both needed this distinction.

### Live Regional Contact Pages Can Retire A PDF-Only Blocker
*   **Lesson:** If a state replaces dead county-office leaves with a live regional hub, check whether that hub also links public region-specific contact pages before stopping at the PDF. Connecticut DDS became county-grade again because the counties-served text lived on the hub while region headquarters and satellite contacts lived on the public North/South/West contact leaves.

### County Root Inventory Must Pass Live DNS Before It Seeds A Leaf Packet
*   **Lesson:** Do not treat county homepage URLs from legacy inventory as valid authoring seeds until they survive a live DNS/HTTP probe. Arizona showed that 14/15 stored `*-az.gov` county roots did not resolve at all and the lone surviving root returned 403, so a packet can look populated while still having no live local repair surface.

### District-Controlled Sitemap Leaves Can Retire An Authenticated State Directory Blocker
*   **Lesson:** If a state education directory is public-shell-only or auth-gated, do one bounded district-controlled sitemap pass before preserving the blocker. Connecticut cleared its last blocker because live district-owned pages like `Special Education`, `Student Services & Special Education`, and `Pupil Services` existed on district domains even though EdSight itself would not return anonymous district records.

### Public Shell And Admin Bundle Evidence Must Be Separated Before Reopening A Blocked Portal Lane
*   **Lesson:** If a public portal exposes a promising proxy path but the fetched same-domain JS module is really an admin/location-form bundle, do not reopen the lane as scrapeable. Florida stayed blocked because both `CPCPS` and `/dataexchangeproxy` returned the same shell while `UXModule.flPartnerLocation` only proved an internal location form with county fields, not a public county-office result contract.

### Browser-Assisted Rechecks Should End A Challenge Lane When The Exact Official Leaf Still Returns The Verification Shell
*   **Lesson:** If the exact official leaf already fails static fetches and a bounded browser-assisted check still lands on the same `Just a moment...` or `Performing security verification` shell, treat the blocker as current-host-wide and stop reopening sibling URLs. Only a republished official host or a truly different official artifact should reopen the lane.

### Exhausted Replacement Roots Should Be Written Into The Packet Before Another Challenged-Host Retry
*   **Lesson:** When a challenged state host blocks the obvious replacement leaves too, record the exact exhausted URLs in the packet and stop guessing sibling roots. Arizona only became decision-complete after the packet named the challenged AZED `school-district-web-sites` / `ess` leaves and the DES office-locator guesses, plus the AHCCCS `Page/Document not found` companion URLs.

### Embedded Official County Maps Can Close A Regional Routing Family Without Reopening District Discovery
*   **Lesson:** When a live official education page looks sparse, inspect its embedded page JSON before reopening district discovery. Georgia’s official GaDOE RESA page carried a complete 159-county FIPS-to-RESA contract in `__NEXT_DATA__` / `AcfGeoMap`, which was enough to verify county-grade routing from one official source plus named RESA targets.

### Official Site Search And Current WordPress Leaves Can Replace Dead Legacy Paths Without Broad Rediscovery
*   **Lesson:** When an old state-host path 403s or dies, try the current official site search and live navigation before reopening broad discovery. Hawaii’s old public-schools `Pages/default.aspx` paths were unusable, but the current official search exposed live `what-is-special-education`, `child-find`, and `complex-area-directory` leaves that cleared multiple blockers in one bounded pass.

### Idaho-Type Pattern: Official Sitemaps Can Expose Exact Office Leaves Even When The Visible Directory Only Looks Like One Generic Locator
*   **Lesson:** When a state packet is blocked on a generic statewide office locator, check the official sitemap before reopening discovery. Idaho’s visible DHW `/offices` directory looked like one statewide page, but the sitemap exposed exact office leaves such as Boise, Caldwell, Pocatello, and Idaho Falls. That was enough to sharpen county-local blockers and separate real office coverage from placeholder county rows without broad crawling.

### PTI Successor Pattern: Use The Outgoing Center To Prove The Role Change, Then Verify The Incoming Center On Its Own First-Party Site
*   **Lesson:** When a statewide PTI blocker turns into a successor question, do not rely on the old sample alone. For Illinois, FRCD explicitly documented that it stopped holding the PTIC role on October 1, 2025, and Family Matters’ own site separately proved it became the only federally funded statewide Illinois PTI. That pair of first-party pages closed the role-transition gap without broader nonprofit rediscovery.

### Embedded County-Map Content Can Still Count Even When The Child County Hrefs 404
*   **Lesson:** If an official county-office map page renders one fetched HTML document that already embeds county-by-county office details, do not fail it just because the decorative county hrefs 404. Indiana’s DFR county map preserved addresses, hours, phone, and ZIP routing for all 92 counties directly in the source HTML, so the family could be upgraded without re-fetching every broken child link.

### One Shared Statewide Fallback URL Across Every County Row Is A Packet Placeholder Signal
*   **Lesson:** If every county or district row in a blocked family points to the same statewide root, treat the DB inventory as placeholder-only and stop retrying that root as if it were local coverage. Arizona’s 15/15 `school_districts` rows all pointed at one challenged AZED page, and 14/15 `county_offices` rows all pointed at one DOI/AHCCCS placeholder, so the real next step was exact-leaf authoring, not more host retries.

### Generic ArcGIS Instant-App Shells Do Not Count As County Contracts
*   **Lesson:** If an official `*.maps.arcgis.com` app only fetches as a generic “Zone Lookup” shell and the public HTML exposes no county names, region names, or service/layer references, do not treat it as a county-routing contract. Georgia still stayed blocked because the DBHDD ArcGIS app revealed no public county-to-region evidence beyond the shell.

### Official State-Administered County Exceptions Can Replace Impossible Local Storefront Proof
*   **Lesson:** If a county is officially administered by a state agency rather than by a normal county government, a reviewed first-party exception page can satisfy the local-routing family. Hawaii cleared once the DOH Kalaupapa page explicitly stated that HRS 326 places Kalawao County under DOH jurisdiction and control, so the dead county storefront row no longer needed a fake county office replacement.

### Named Office Labels Still Count As Placeholders When The URL Is Generic
*   **Lesson:** Do not let a realistic office name fool the packet if the stored URL is still generic. Idaho looked partially repaired because rows were labeled `Boise Office`, `Blackfoot Office`, and `Idaho Falls Office`, but the live URLs still pointed at one generic Medicaid page or a dead legacy locator, so those rows were still placeholders until the exact office leaves were attached.
