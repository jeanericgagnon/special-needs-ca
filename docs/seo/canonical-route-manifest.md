# Canonical Route Manifest

This manifest documents the canonical public route shapes and their publication posture on current main.

## Canonical routes

| Route type | Canonical shape | Publication rule |
| --- | --- | --- |
| Home | `/` | indexable static page |
| Benefits landing | `/benefits` | indexable static page |
| State hub | `/benefits/<state>` | indexable only when state is `COMPLETE`, `indexSafe=true`, and runtime-launch-safe |
| State counties hub | `/counties/<state>` | indexable only when the state-counties hub passes central policy |
| County hub | `/benefits/<state>/<county>` | indexable only when county-level local proof passes central policy |
| Condition hub | `/conditions/<condition>` | indexable only for verified conditions |
| County × condition | `/benefits/<state>/<condition>/<county>` | fail-closed; currently limited to verified California leaves only |
| Program guide | `/programs/<program>` | indexable only when exact state context, official source, verified eligibility, verified steps, and verified documents all exist |
| Forms guide | `/forms/<slug>` | currently noindex unless explicitly verified through central policy |
| Situation guide | `/situations/<slug>` | currently noindex unless explicitly verified through central policy |
| Deadline guide | `/deadlines/<slug>` | currently noindex unless explicitly verified through central policy |
| Advocates landing | `/advocates` | indexable static page |
| Find help | `/find-help` | indexable static page |
| School district page | `/school-districts/<state>/<district>` | hard blocked from indexation |
| City page | `/benefits/<state>/<condition>/<city>` | hard blocked from indexation |

## Static route allowlist

Derived from `frontend/src/lib/seoRouteManifest.ts`.

- `/`
- `/benefits`
- `/advocates`
- `/forms`
- `/school-districts`
- `/find-help`

## Static guide prefixes

These route families are canonicalized but remain publication-gated.

- `/forms/`
- `/situations/`
- `/deadlines/`
- `/programs/`

## Sitemap child manifest

- `/sitemaps/static.xml`
- `/sitemaps/counties.xml`
- `/sitemaps/districts.xml` hard blocked
- `/sitemaps/cities.xml` hard blocked

## Source of truth

Canonical and publication decisions must come from the central policy in:

- `frontend/src/lib/seo-policy.ts`
- `frontend/src/lib/seoRouteManifest.ts`
- `frontend/src/lib/stateAudit.ts`

No route may be added to a sitemap unless the same central policy would allow that exact route to render indexable.
