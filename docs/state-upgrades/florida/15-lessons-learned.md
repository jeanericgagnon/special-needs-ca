# Florida Upgrade Lessons Learned

This document outlines key technical, architectural, and data modeling lessons compiled during the Florida state pilot upgrade.

---

## 1. DCF ACCESS Mixed Routing Model
*   **The Scenario:** Florida's welfare and Medicaid intake (DCF ACCESS) relies on a combination of official state storefronts and hundreds of local "community partner" sites (e.g. churches, libraries, nonprofits) that host computer terminals.
*   **The Lesson:** Staging all community partners directly into `county_offices` results in huge database clutter and duplicates. Upgrades must separate official storefronts from community partners, staging only direct state-operated service offices as primary storefronts, while keeping community partners as secondary resources or ignoring them if coverage is met.

## 2. APD / iBudget Regional Routing Model
*   **The Scenario:** The Agency for Persons with Disabilities (APD) administers the iBudget waiver through 14 Area Offices serving all 67 counties in Florida.
*   **The Lesson:** Instead of duplicating office listings for every county (which breaks database normal form), we must model the relationship as a one-to-many catchment mapping in a junction table, mapping each of the 67 counties to their respective regional Area Office.

## 3. Early Steps Regional Overlap Handling
*   **The Scenario:** Early Steps (Florida's Part C early intervention agency) splits the state into 15 local program portals. However, Miami-Dade County is geographically divided and served by two separate portals: *Southernmost Early Steps* and *North Dade Early Steps*.
*   **The Lesson:** Do not assume a strict 1-to-1 county-to-agency relationship. Junction tables (like `regional_center_counties` or equivalent) must support many-to-many mappings to gracefully handle overlapping service boundaries in dense metro areas.

## 4. FDLRS `counties_served` Semantic Lesson
*   **The Scenario:** FDLRS (Florida Diagnostic and Learning Resources System) supports special education across 19 Associate Centers, where each center serves a comma-separated list of counties.
*   **The Lesson:** Scraping and mapping scripts must implement parser normalizers to split, trim, and match comma-separated county lists against official database FIPS county identifiers, rather than attempting text-matching or writing literal strings to relational fields.

## 5. ESE District Source Hierarchy
*   **The Scenario:** Direct ESE contact information is notoriously unstable on school district websites.
*   **The Lesson:** Establish a strict source verification hierarchy:
    1.  *State Directory:* Sourced first from the official FLDOE ESE Director Directory for verified contact emails/names.
    2.  *District Site:* Direct ESE department pages to verify intake phone numbers and office locations.
    3.  *Secondary Verification:* Project10 or local transition directories to cross-reference discrepancies.

## 6. ESE Re-Keying Reference Audit Lesson
*   **The Scenario:** Replacing fallback school districts required re-keying primary keys from `sd-{county}-fl-fallback` to clean, verified IDs `sd-{county}-fl` in production.
*   **The Lesson:** Before changing a primary key in a production database, a reference audit script must query the entire database schema to identify any foreign key constraints referencing the old ID. Since school district IDs were not referenced elsewhere, the primary key re-key was safe to execute.

## 7. CARD/Clinic Physical Location vs. Service Area
*   **The Scenario:** CARD (Center for Autism and Related Disabilities) centers serve large multi-county catchment areas from a single university or hospital campus (e.g. CARD UF Gainesville serving 14 counties).
*   **The Lesson:** Never duplicate clinic records in `resource_providers` for each county served. Ingest the clinic once at its physical address, and document its regional service area in text or in a dedicated catchment mapping structure.

## 8. Forms Schema Gap Lesson
*   **The Scenario:** The database schema did not include a staging table for forms, meaning forms had to be promoted during script runs.
*   **The Lesson:** Stage forms directly inside the migration transaction under `review_status = 'auto_accepted'` to satisfy relational check gates without requiring schema additions.

## 9. Provider / Legal Review Queue Boundary
*   **The Scenario:** High-liability commercial entities, such as IEP lawyers and private therapy clinics, carry reputational risks if launched without thorough vetting of credentials.
*   **The Lesson:** Route all commercial legal and therapy resources to a local `provider_legal_review_queue.json` file. Only non-profit organizations and official state services may be promoted directly to the production database automatically.

## 10. Launch Gating / Deferred GSC Submission
*   **The Scenario:** Testing live pages and compilations is crucial, but submitting new states to Google Search Console early leads to indexation of incomplete routes.
*   **The Lesson:** Keep all new state routes gated with `noindex` and exclude them from the sitemap allowlist until the full launch validation passes. This allows complete end-to-end local testing without leaking routes to search engines.
