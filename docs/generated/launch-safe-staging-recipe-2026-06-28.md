# Launch-Safe Staging Recipe 2026-06-28

## Goal

Stage the validated launch-safe subset without pulling in unfinished California/source-pack foundation work.

Use this only after confirming the worktree still matches the validated state described in:

- [launch-readiness-handoff-2026-06-28.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-readiness-handoff-2026-06-28.md)
- [launch-safe-commit-isolation-2026-06-28.md](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/launch-safe-commit-isolation-2026-06-28.md)

## Stage Group A: Reconciled audit truth and handoff

```bash
git add \
  data/generated/all_state_california_grade_audit_v3.json \
  docs/generated/current-truth-audit-2026-06-28.json \
  docs/generated/current-truth-audit-2026-06-28.md \
  docs/generated/truth-registry-2026-06-28.json \
  docs/generated/truth-registry-2026-06-28.md \
  docs/generated/final-website-audit-2026-06-28.json \
  docs/generated/final-website-audit-2026-06-28.md \
  docs/generated/launch-readiness-handoff-2026-06-28.md \
  docs/generated/launch-safe-commit-isolation-2026-06-28.md \
  docs/generated/launch-safe-staging-recipe-2026-06-28.md
```

Why:

- Captures the validated `45 COMPLETE / 5 BLOCKED / 45 index-safe` truth.
- Captures `auditQueueMismatchCount=0`.

## Stage Group B: Core runtime/SEO safety fixes

```bash
git add \
  frontend/src/lib/stateAudit.ts \
  frontend/src/app/robots.ts \
  frontend/src/app/globals.css
```

Why:

- Robust generated-artifact resolution across cwd contexts.
- Robots disallow for `/share` and `/share/*`.
- Confirmed mobile overflow fix.

## Stage Group C: Launch validation tests

```bash
git add \
  scripts/test-seo-hardening-v1.mjs \
  scripts/test-public-copy-hardening.mjs \
  scripts/test-public-route-provenance-contract.mjs \
  scripts/test-ihss-wage-disclosure.mjs \
  scripts/test-directory-public-trust-audit.mjs
```

Why:

- These are directly tied to the passing launch-safe validation lane.

## Stage Group D: E2E expectation refresh

```bash
git add \
  frontend/e2e/florida-launch.spec.ts \
  frontend/e2e/forms-guides.spec.ts \
  frontend/e2e/georgia-launch.spec.ts \
  frontend/e2e/illinois-launch.spec.ts \
  frontend/e2e/new-jersey-launch.spec.ts \
  frontend/e2e/new-york-launch.spec.ts \
  frontend/e2e/ohio-launch.spec.ts \
  frontend/e2e/pennsylvania-launch.spec.ts \
  frontend/e2e/seo-sitemap.spec.ts \
  frontend/e2e/texas-launch.spec.ts \
  frontend/e2e/wave2-launch.spec.ts \
  frontend/e2e/wave3-launch.spec.ts \
  frontend/e2e/wave4-launch.spec.ts \
  frontend/e2e/wave5-launch.spec.ts \
  frontend/e2e/wyoming-launch.spec.ts
```

Why:

- Full Playwright passed with these updated disclosure expectations.

## Optional Stage Group E: Reviewed trust/SEO frontend copy and gating

These files are likely safe based on the reviewed diffs and passing validation, but they widen the commit more than Groups A-D. Stage them only if you want the trust/SEO/product-surface hardening included in the same commit.

```bash
git add \
  'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx' \
  'frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx' \
  frontend/src/app/find-help/find-help-client.tsx \
  frontend/src/app/dashboard/page.tsx \
  'frontend/src/app/share/log/[token]/page.tsx' \
  frontend/src/app/sitemaps/static.xml/route.ts \
  frontend/src/lib/publicTruth.ts \
  frontend/src/lib/seo-data.ts \
  frontend/src/lib/seoRouteManifest.ts \
  frontend/src/lib/directoryFoundation.ts \
  frontend/src/app/components/SourceFreshnessDisclosure.tsx \
  frontend/src/app/components/directory-foundation-panel.tsx \
  frontend/src/app/forms/page.tsx \
  frontend/src/app/benefits/components/ihss-calculator.tsx \
  frontend/src/app/benefits/components/ihss-mini-product.tsx \
  frontend/src/app/components/waiver-comparison.tsx \
  frontend/src/components/state-coverage-badge.tsx \
  frontend/src/app/advocates/advocate-directory-client.tsx
```

Why:

- These diffs are trust/SEO aligned:
  - softer legal and eligibility copy
  - removal of fabricated local addresses from public schema/UI
  - explicit verification-pending banners
  - noindex disclosures on thin directories
  - source-backed wording on forms and waiver/help surfaces
  - sitemap allowlist additions for validated tool landing pages

## Do Not Stage In The Launch-Safe Commit

Keep all current California/source-pack and broader foundation work out of this commit, including:

- `data/generated/ca_*`
- `data/generated/california-*`
- `docs/generated/ca-*`
- `docs/generated/california-*`
- `scripts/*ca-*`
- `scripts/*california-*`
- broad DB seeding/scraper/foundation edits not required for the validated launch-safe posture

## Validation After Staging

If staging only Groups A-D:

```bash
npm run audit:final-website
npm run seo:qa:full
npm run test:public-trust
```

If staging Groups A-E:

```bash
npm run build
npm run lint
npm run audit:current-truth
npm run audit:truth-registry
npm run audit:final-website
npm run seo:qa:full
npm run test:public-trust
npm run test:e2e
```

## Commit Boundary Recommendation

- Minimal validated launch-safe commit:
  - Groups A-D only
- Broader trust/SEO launch-hardening commit:
  - Groups A-E

Do not mix either of those with unfinished California foundation work.
