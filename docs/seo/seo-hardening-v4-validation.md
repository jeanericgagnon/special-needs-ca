# SEO Hardening V4 Validation

Updated: 2026-06-26

This document records the current validation evidence for the V4 SEO hardening objective on current `main`.

## Current Audit Truth

Derived from:

- [data/generated/all_state_california_grade_audit_v3.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/generated/all_state_california_grade_audit_v3.json)
- [data/generated/all_state_priority_queue_v3.jsonl](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/generated/all_state_priority_queue_v3.jsonl)
- [docs/generated/all-state-california-grade-audit-report-v3.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/all-state-california-grade-audit-report-v3.md)

Current counts:

- `COMPLETE = 45`
- `BLOCKED = 5`
- `indexSafe = 45`
- `incorrectlyIndexSafeStates = []`
- blocked states:
  - `alaska`
  - `arizona`
  - `idaho`
  - `maine`
  - `new-hampshire`

## V4 Requirements Checked

### 1. Robots

Current status:

- `/_next/*` is not blanket-disallowed in [frontend/src/app/robots.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/robots.ts)
- private/auth routes remain blocked:
  - `/dashboard`
  - `/dashboard/*`
  - `/login`
  - `/register`
  - `/api/*`

Result: pass

### 2. Central SEO policy

Current source of truth:

- [frontend/src/lib/seo-policy.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/lib/seo-policy.ts)

Confirmed behaviors:

- one policy decides index/noindex
- one policy decides sitemap inclusion
- one policy decides canonical URL
- one policy decides schema eligibility
- unknown states and slugs fail closed
- only audit-approved states index

Result: pass

### 3. Sitemap gating

Current source of truth:

- [frontend/src/lib/seoRouteManifest.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/lib/seoRouteManifest.ts)
- [frontend/src/app/sitemap.xml/route.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/sitemap.xml/route.ts)
- [frontend/src/app/sitemaps/static.xml/route.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/sitemaps/static.xml/route.ts)
- [frontend/src/app/sitemaps/counties.xml/route.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/app/sitemaps/counties.xml/route.ts)

Confirmed behaviors:

- blocked states must not index
- blocked states must stay out of sitemaps
- `districts` and `cities` sitemap children are hard blocked
- sitemap index `<lastmod>` is derived from real DB verification dates

Result: pass

### 4. Program-guide gating

Current enforcement paths:

- [frontend/src/lib/seo-policy.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/lib/seo-policy.ts)
- [scripts/qa-seo-checker.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/qa-seo-checker.ts)

Confirmed behaviors:

- generic/static fallback program pages must fail closed
- official-source detection is validated
- placeholder and unsupported claim patterns are checked
- blocked state program surfaces do not become indexable

Result: pass

### 5. YMYL and placeholder controls

Current enforcement paths:

- [frontend/src/lib/seo-policy.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/lib/seo-policy.ts)
- [scripts/qa-seo-checker.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/qa-seo-checker.ts)
- [scripts/test-seo-hardening-v1.mjs](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/scripts/test-seo-hardening-v1.mjs)

Confirmed checks:

- placeholder phones, fake addresses, example domains, and mock language are blocked
- unsupported legal/eligibility claims fail the evidence gate
- sitemap and indexability use the same policy path

Result: pass

### 6. Canonicals

Current enforcement paths:

- [frontend/src/lib/seo-policy.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/lib/seo-policy.ts)
- [docs/seo/canonical-route-manifest.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/seo/canonical-route-manifest.md)

Confirmed behaviors:

- canonical URLs are derived centrally by route type
- noindex and sitemap checks reference the same policy
- school district and city pages remain blocked unless the policy changes explicitly

Result: pass

## Validation Commands

Commands verified in the repo:

- `npm run setup:local`
- `npm run audit:current-truth`
- `npm run audit:truth-registry`
- `npm run audit:info-confidence`
- `npm run audit:info-completeness`
- `npm run audit:directory-staleness`
- `npm run audit:directory-freshness-gaps`
- `npm run audit:final-website`
- `npm run build`
- `npm run seo:qa`
- `npm run seo:qa:full`
- `npm run test:seo-hardening-v1`
- `npm run test:e2e`

Additional frontend validation:

- no dedicated `frontend typecheck` script currently exists in `frontend/package.json`
- direct frontend typecheck can be run with:
  - `npm exec tsc -- -p tsconfig.json --noEmit` from `frontend/`
- `next build --webpack` remains the strongest full production gate in this repo

## Current Validation Evidence

Current green evidence from this repo state:

- launch E2E subset passed: `340 passed`
- wizard E2E subset passed after stale expectation hardening: `6 passed`
- audit counts matched across audit and priority queue
- `npm run test:seo-hardening-v1` passed after the `robots.txt` V4 fix
- `npm run seo:qa:full` passed after the `robots.txt` V4 fix
- `npm exec tsc -- -p tsconfig.json --noEmit` passed from `frontend/`
- `npm run build` passed after restoring the missing `getAllPrograms` import in the benefits catch-all route

Artifacts regenerated on 2026-06-27:

- [docs/generated/current-truth-audit-2026-06-27.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/current-truth-audit-2026-06-27.json)
- [docs/generated/truth-registry-2026-06-27.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/truth-registry-2026-06-27.json)
- [docs/generated/information-confidence-audit-2026-06-27.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/information-confidence-audit-2026-06-27.json)
- [docs/generated/information-completeness-audit-2026-06-27.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/information-completeness-audit-2026-06-27.json)
- [docs/generated/directory-staleness-audit-2026-06-27.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/directory-staleness-audit-2026-06-27.json)
- [docs/generated/directory-freshness-gap-audit-2026-06-27.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/directory-freshness-gap-audit-2026-06-27.json)
- [docs/generated/final-website-audit-2026-06-27.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/final-website-audit-2026-06-27.json)

## Remaining Objective Gap

The final-five blocked states remain truthfully blocked and are not resolved by SEO hardening alone:

- Arizona
- Idaho
- Alaska
- Maine
- New Hampshire

That means V4 SEO hardening can be documented and enforced, but the broader V4 objective is not fully complete until those state-side blockers are either solved or explicitly frozen with final reviewed evidence.
