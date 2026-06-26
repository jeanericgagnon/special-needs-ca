# SEO Hardening V4 Validation

## Scope

This validation pass covers:

- final-state audit alignment
- state-level index gating
- sitemap and robots consistency
- stronger program-guide gating
- placeholder and YMYL fallback scanning

## Required commands

Run from repo root:

```bash
npm run setup:local
npm run seo:qa
npm run seo:qa:full
npm run build
npm --prefix frontend run test:e2e -- e2e/public-launch.spec.ts e2e/seo-sitemap.spec.ts
```

## Expected pass conditions

- `data/generated/all_state_california_grade_audit_v3.json` and `data/generated/all_state_priority_queue_v3.jsonl` agree on classification and index-safe status.
- Only `COMPLETE` + `indexSafe=true` states can become indexable.
- Blocked states are excluded from sitemaps and must render noindex if reachable.
- `robots.txt` does not block `/_next/*`.
- No sitemap route is emitted for hard-blocked city or district surfaces.
- Program guides cannot index without:
  - exact state context
  - official first-party source
  - source verification date
  - verified eligibility rules
  - verified application steps
  - verified document requirements
- Placeholder and unsupported YMYL fallback phrases fail QA.

## Manual smoke checks

Verify live rendered behavior for:

- one complete state hub, for example `/benefits/texas`
- one blocked state hub, for example `/benefits/alaska`
- one gated state-counties hub, for example `/counties/texas`
- one static guide page, for example `/forms`
- `/robots.txt`
- `/sitemap.xml`
- `/sitemaps/static.xml`

## Current known truth posture

- State hubs can be launch-indexable when runtime parity exists.
- County hubs, state-counties hubs, and most guide surfaces remain stricter and may stay noindex even for complete states.
- Truth beats breadth: unresolved local proof must stay blocked or noindex.
