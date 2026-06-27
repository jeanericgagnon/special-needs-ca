# Canonical Route Manifest

Updated: 2026-06-26

This manifest records the current canonical route contract enforced by the central SEO policy in [frontend/src/lib/seo-policy.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/lib/seo-policy.ts) and the sitemap child manifest in [frontend/src/lib/seoRouteManifest.ts](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/src/lib/seoRouteManifest.ts).

## Global Rules

- Canonical, indexability, sitemap inclusion, schema eligibility, and verification state must all come from `evaluateSeoPolicy`.
- Unknown states, unknown slugs, and missing audit data fail closed.
- Only `COMPLETE` plus `indexSafe/index_safe=true` states may index.
- `BLOCKED` states must render `noindex, follow` and stay out of sitemaps.
- `school-district` and `city` route families are hard blocked from sitemap inclusion.

## Current State Gate

- `COMPLETE`: 45
- `BLOCKED`: 5
- `indexSafe`: 45
- `incorrectlyIndexSafeStates`: `[]`
- Blocked states: `alaska`, `arizona`, `idaho`, `maine`, `new-hampshire`

Source of truth:
- [data/generated/all_state_california_grade_audit_v3.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/generated/all_state_california_grade_audit_v3.json)
- [data/generated/all_state_priority_queue_v3.jsonl](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/generated/all_state_priority_queue_v3.jsonl)

## Canonical Dynamic Routes

| Route type | Canonical pattern | Indexable when | Sitemap eligible |
| --- | --- | --- | --- |
| `state-hub` | `/benefits/[state]` | State is `COMPLETE` and `indexSafe`; no placeholder data | Yes |
| `state-counties-hub` | `/counties/[state]` | State is `COMPLETE` and `indexSafe`; route has real local assets and no placeholders | No direct child sitemap entry; county roots flow through counties sitemap |
| `county-hub` | `/benefits/[state]/[county]` | State is `COMPLETE` and `indexSafe`; local data, contact signal, freshness, and trust all pass | Yes |
| `condition-hub` | `/benefits/[state]/[diagnosis]` | State is `COMPLETE` and `indexSafe`; diagnosis is verified; no placeholder data | Yes |
| `program-guide` | `/programs/[slug]` or cluster canonical returned by policy | State context is index-safe and page has verified official program data | Yes via static sitemap route |
| `category-hub` | `/benefits/[state]/category/[category]` | State is index-safe and category has real program content | Yes |
| `comparison` | `/benefits/[state]/compare` | State is index-safe and comparison page has enough real entities | Yes |
| `county-condition` | `/benefits/[state]/[diagnosis]/[county]` | Only when the state is index-safe and the county-diagnosis leaf meets the strict local-data gate | Yes only when policy allows |
| `school-district` | Policy canonical only | Never currently indexable | No |
| `city` | Policy canonical only | Never currently indexable | No |
| `static-page` | Manifest allowlist only | Only for allowlisted static pages and verified guides | Yes when allowlisted |

## Static Route Allowlist

Current allowlisted static roots:

- `/`
- `/benefits`
- `/advocates`
- `/forms`
- `/school-districts`
- `/find-help`

Current static guide prefixes:

- `/forms/`
- `/situations/`
- `/deadlines/`
- `/programs/`

Anything outside those allowlists fails closed unless separately handled by the central policy.

## Sitemap Manifest

Current sitemap index children:

- `/sitemaps/static.xml`
- `/sitemaps/counties.xml`

Hard blocked sitemap children:

- `/sitemaps/districts.xml`
- `/sitemaps/cities.xml`

The sitemap index route excludes hard-blocked children and derives `<lastmod>` from the max real `last_verified_date` across core tables, not from a synthetic "today" fallback.

## Robots Contract

The current robots contract:

- allows `/`
- allows `/forms`
- allows `/sitemap.xml`
- allows `/sitemaps/static.xml`
- allows `/sitemaps/counties.xml`
- disallows `/dashboard`
- disallows `/dashboard/*`
- disallows `/login`
- disallows `/register`
- disallows `/api/*`

Important V4 hardening:

- `/_next/*` is no longer blanket-blocked in `robots.txt`
- noindex decisions for public pages must come from page metadata, not `robots.txt`

## Program Guide Gate

Program pages are only meant to be indexable when the page has:

- exact state context
- official first-party source support
- verification date
- verified eligibility rules
- verified application steps
- verified document requirements
- no generic-template fallback content
- no placeholder or unsupported YMYL claims

If any of those inputs are absent or inconsistent, policy must fail closed.

## Copy / Coverage Guardrail

Public copy must stay aligned with the audit truth:

- do not claim national completeness
- do not call blocked states complete
- do not surface stale "California only" launch copy
- do surface current dynamic counts where the UI exposes coverage status
