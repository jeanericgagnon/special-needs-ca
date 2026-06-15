# National Post-Rollout Integrity Audit Report

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Goal:** Verify that the autonomous Waves 1–6 rollout did not create bad data, fake coverage, duplicate state records, unsafe frontend rendering, or inflated completion claims.  

---

## Executive Summary

A comprehensive national integrity audit was conducted on the SQLite database (`ca_disability_navigator.db`) and Next.js frontend rendering components. 
- **Registry Integrity:** 100% clean. No duplicate states, folder mismatches, wrong state mappings, or cross-state county overrides.
- **Fallbacks:** 0 active fallbacks exist in all 49 newly upgraded or partial states. The only state with active fallbacks is the California baseline (119 total).
- **Placeholders/Mocks:** 44 upgraded partial states contain exactly 2 mock records each (in `school_districts` under `curated_seed` data origin). However, older Wave 1 "COMPLETE" states contain significant mock data: Ohio (166 mock school districts) and New York (62 mock county offices). 
- **Protected Records:** All 9,555 write-protected, curated, and human-verified records are preserved intact. Both `assertBulkWriteProtection` and `mutationGuard` checks are verified active.
- **Frontend Safety:** Sampled pages show no California leakage, no verified badges on manual-review records (they default to a gray `Unverified directory listing` label), and correct statewide links. A rendering bug was identified where empty phone fields on county offices and local nonprofits render a broken `tel:` link and empty phone label.

---

## Audit Findings by Check

### 1. State Registry Integrity
* **Canonical Slugs:** Verified that all 50 states in the database have exactly one canonical ID/slug and matching name.
* **Folder Structure:** Folder structures under [data/state-upgrades/](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades) match state IDs exactly. No duplicates or misnamed folders exist.
* **County Counts:** Verified that county counts for all 50 states match their official expected totals (e.g., California = 58, Florida = 67, Texas = 254, Georgia = 159).
* **Cross-State County Mapping:** 0 cross-state county mappings. All county IDs end with their correct state suffix (except CA baseline, which has no suffix but is verified correct).
* **Wrong-State Records:** 0 records in `county_offices`, `school_districts`, or `nonprofit_organizations` are unassigned or assigned to counties outside their parent state.

### 2. Fallback Audit
* **Active Fallbacks:**
  - **California (Baseline):** 119 active fallbacks (40 school districts, 42 nonprofits, 37 regional education agencies).
  - **All Other 49 States:** Truly 0 active fallbacks in the database (verified no records with `programmatic_fallback` or `generated_county_fallback` data origin or `-fallback` suffix).
* **Visual vs. True Fallbacks:** The 49 upgraded states are truly 0 fallback. There are no hidden fallback records masked behind non-fallback labels.

### 3. Placeholder / Fake Data Audit
* **Mock Contacts:**
  - **Ohio (Claimed COMPLETE):** 166 mock school district records with phone numbers like `(614) 555-01xx` (data origin: `scraped`).
  - **New York (Claimed COMPLETE):** 62 mock county offices (Medicaid) with phone numbers like `(800) 555-0155` (data origin: `curated_seed`).
  - **44 Newly Upgraded States:** Exactly 2 mock school districts each (e.g., `sd-jefferson-al` and `sd-madison-al` in Alabama) with phone number `(800) 555-0200` under `curated_seed` data origin. These represent template seeds for the priority counties created in early project phases.
  - **California (Baseline):** 82 mock phone numbers embedded in fallback records.
  - **Florida, Georgia, Illinois, Pennsylvania, Texas:** 0 mock contacts.
* **Empty Cards & Records:**
  - 84 nonprofit records across 42 upgraded states (exactly 2 per state, named `[County] Special Needs Support Network`) have empty phone and website fields.
  - These records represent empty curated seed cards in the database.
* **Fictional Addresses & Domains:** 0 fictional addresses (like "123 Main St") or temp/placeholder domains. All websites point to official domain routes.

### 4. Manual-Review Audit
* **Distribution:** Georgia (296) and Illinois (89) have the highest manual review counts. For the other 42 upgraded states, manual-review records account for ~35% to ~39% of total state records.
* **Safety:** No manual-review record displays a verified badge (which is strictly reserved for `verified`, `official_verified`, or `human_verified`). They render as `Unverified directory listing`.
* **Fake Data:** Manual-review records have 0 fake contact details; they have empty phone/email fields and route to official statewide portals.
* **Directory Routing:** All manual-review records are safely directory-routed to statewide resources (e.g., Department of Human Services or State Board of Education directories).

### 5. Protected-Record Audit
* **Counts & Preservation:** Verified that all write-protected seeds and verified records are preserved. 
  - **Texas:** 1,600 protected records.
  - **Georgia:** 354 protected records.
  - **Illinois:** 315 protected records.
  - **Florida:** 215 protected records.
  - **California:** 100 protected records.
* **Guards:**
  - `assertBulkWriteProtection`: Verified active during the promotion phase, preventing deletion or overwrite of protected seeds.
  - `mutationGuard` Row-Count & Protected Check: Active during upgrades. It compares pre- and post-upgrade row counts and throws an error if protected record counts decrease.

### 6. Geographic Routing Audit
* **HHS/Medicaid & DD/IDD:** Local intake DFCS and waiver offices map correctly to their target counties. No fake-expansion.
* **Regional Education:** Regional education agencies and school board catchment boundaries (e.g., ESCs in Ohio, Intermediate Units in Pennsylvania, BOCES in New York) map to multi-county regions accurately without physical location expansion.
* **Statewide Hotlines:** Handled as statewide resources; they do not leak into local county records.

### 7. Provider / Legal Audit
* **Auto-Promotion:** 0 commercial providers, attorneys, or private ABA therapy directories were auto-promoted to active local records.
* **Active Providers:** Only 36 active providers exist in `resource_providers` across Florida (14), Texas (9), Pennsylvania (7), and Illinois (6). All are major academic children's hospitals, university medical centers, or official CARD centers. All other states have 0 active providers (candidates remain in review queues).
* **Unsanctioned Sources:** 0 records are sourced from Google, Yelp, Facebook, LinkedIn, or Psychology Today. All source URLs point to official university, hospital, or state portals.

### 8. Frontend Rendering Audit
* **Verified Badges:** Confirmed that `manual_review_required` records correctly render the gray `Unverified directory listing` badge, preventing misleading verified indicators.
* **California/Florida Leakage:** Sampled county pages in new states (e.g., Alabama, Colorado, Washington) to ensure page copies, headers, and metadata do not leak reference text or links from California, Florida, or Texas.
* **Rendering Bug:**
  > [!WARNING]
  > In `frontend/src/app/counties/[state]/[slug]/page.tsx`, empty phone fields in `county_offices` and `nonprofit_organizations` are rendered unconditionally. If a record has no phone number, it renders `Phone: [empty]` and a broken `<a href="tel:">` tag. This needs to be wrapped in a conditional check, similar to `school_districts`.
