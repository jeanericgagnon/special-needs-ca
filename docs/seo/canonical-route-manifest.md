# Canonical Route Manifest

This document outlines the canonical routing, redirection, sitemap inclusion, indexing gating, and schema policies enforced across Ablefull to ensure 10/10 SEO safety.

---

## Route Families & Rules

### 1. Home / Landing Page
- **Route Family**: `home`
- **Canonical URL Pattern**: `https://ablefull.org/`
- **Duplicate Route Pattern**: None
- **Redirect Behavior**: None
- **Sitemap Eligibility**: Yes (included in `static.xml`)
- **Indexing Gate**: Always indexed (`index: true`)
- **Schema Eligibility**: Yes (neutral site-level schema: `WebSite`, `Organization`)

### 2. Benefits Landing Page
- **Route Family**: `benefits`
- **Canonical URL Pattern**: `https://ablefull.org/benefits/california`
- **Duplicate Route Pattern**: `/benefits` (self-canonicals to `/benefits/california`)
- **Redirect Behavior**: None
- **Sitemap Eligibility**: Yes (included in `static.xml`)
- **Indexing Gate**: Always indexed (`index: true`)
- **Schema Eligibility**: Yes (neutral site-level schema)

### 3. State Hub Pages
- **Route Family**: `state-hub`
- **Canonical URL Pattern**: `https://ablefull.org/benefits/[state]`
- **Duplicate Route Pattern**: None
- **Redirect Behavior**: 404 for unknown states
- **Sitemap Eligibility**: Yes (included in `static.xml`) if the state is ready (`COMPLETE`) and passes policy checks.
- **Indexing Gate**: Must be a `COMPLETE` state in the audit (classification: `COMPLETE`, `indexSafe: true`). All others fail-closed (`noindex`).
- **Schema Eligibility**: None (neutral site-level schema only)

### 4. State Counties Hub (Directory)
- **Route Family**: `state-counties-hub`
- **Canonical URL Pattern**: `https://ablefull.org/counties/[state]`
- **Duplicate Route Pattern**: None
- **Redirect Behavior**: 404 for unknown states
- **Sitemap Eligibility**: Yes (included in `static.xml`) if the state is ready (`COMPLETE`)
- **Indexing Gate**: State must be `COMPLETE` in the audit.
- **Schema Eligibility**: None

### 5. County Hub Pages
- **Route Family**: `county-hub`
- **Canonical URL Pattern**: `https://ablefull.org/benefits/[state]/[county]`
- **Duplicate Route Pattern**: None
- **Redirect Behavior**: 404 for unknown counties or county-state mismatches
- **Sitemap Eligibility**: Yes (included in `counties.xml`) if state is `COMPLETE`, county has required contact info, real local assets, and no placeholder data.
- **Indexing Gate**: State must be `COMPLETE` and county details must pass all policy checks (no placeholders, real assets).
- **Schema Eligibility**: None

### 6. Diagnosis / Condition Pages
- **Route Family**: `condition-hub`
- **Canonical URL Pattern**: `https://ablefull.org/benefits/[state]/[diagnosis]`
- **Duplicate Route Pattern**: `/conditions/[diagnosis]`
- **Redirect Behavior**: `/conditions/[diagnosis]` 308 redirects to `/benefits/california/[diagnosis]`
- **Sitemap Eligibility**: Yes (included in `counties.xml`) if state is `COMPLETE` and diagnosis is verified.
- **Indexing Gate**: State must be `COMPLETE` and diagnosis must be in `VERIFIED_DIAGNOSIS_SLUGS`.
- **Schema Eligibility**: None

### 7. County Condition Pages
- **Route Family**: `county-condition`
- **Canonical URL Pattern**: `https://ablefull.org/benefits/[state]/[diagnosis]/[county]`
- **Duplicate Route Pattern**: None
- **Redirect Behavior**: 404 for unknown county/diagnosis/state
- **Sitemap Eligibility**: Yes (included in `counties.xml`) if state is `COMPLETE`, diagnosis verified, and county passes policy checks.
- **Indexing Gate**: State must be `COMPLETE`, diagnosis verified, and county details must pass all policy checks.
- **Schema Eligibility**: None

### 8. Program Guide Pages
- **Route Family**: `program-guide`
- **Canonical URL Pattern**: `https://ablefull.org/benefits/[state]/program/[program]`
- **Duplicate Route Pattern**: `/programs/[program]`
- **Redirect Behavior**: `/programs/[program]` 308 redirects to `/benefits/california/program/[program]`
- **Sitemap Eligibility**: Yes (included in `static.xml`) if program belongs to a `COMPLETE` state, has official source URL, has eligibility rules, application steps, and document checklist.
- **Indexing Gate**: Program must belong to a `COMPLETE` state, have verified rule-level evidence, and pass all program guide checklist gates.
- **Schema Eligibility**: None (All page-specific schemas have been deleted to eliminate fabricated/unverified structured data. Only neutral site-level schema is permitted).

### 9. School District Pages
- **Route Family**: `school-district`
- **Canonical URL Pattern**: `https://ablefull.org/school-districts/[state]/[district]`
- **Duplicate Route Pattern**: None
- **Redirect Behavior**: 404 for unknown districts
- **Sitemap Eligibility**: Yes (included in `districts.xml`) if district is indexable (currently blocked/empty).
- **Indexing Gate**: Blocked by default (`index: false`) until verification framework is enabled.
- **Schema Eligibility**: None

### 10. City Pages
- **Route Family**: `city`
- **Canonical URL Pattern**: `https://ablefull.org/benefits/[state]/[diagnosis]/[city]`
- **Duplicate Route Pattern**: None
- **Redirect Behavior**: 404 for unknown cities
- **Sitemap Eligibility**: Yes (included in `cities.xml`) if city is indexable (currently blocked/empty).
- **Indexing Gate**: Blocked by default (`index: false`) until verification framework is enabled.
- **Schema Eligibility**: None

### 11. Static Pages (Forms, Situations, Deadlines)
- **Route Family**: `static-page`
- **Canonical URL Pattern**: `https://ablefull.org/[category]/[slug]` (e.g. `/forms/[slug]`, `/situations/[slug]`, `/deadlines/[slug]`)
- **Duplicate Route Pattern**: None
- **Redirect Behavior**: None
- **Sitemap Eligibility**: Yes (included in `static.xml`) if in explicit allowlist `ALLOWED_STATIC_GUIDES` and belongs to a `COMPLETE` state.
- **Indexing Gate**: Must be in `ALLOWED_STATIC_GUIDES` allowlist and state must be `COMPLETE`.
- **Schema Eligibility**: None
