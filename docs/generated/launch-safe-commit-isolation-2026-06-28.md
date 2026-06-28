# Launch-Safe Commit Isolation 2026-06-28

## Purpose

This manifest separates the validated launch-safe subset from the unfinished California/source-pack worktree churn.

Validation evidence for the launch-safe subset:

- `npm run audit:current-truth`
- `npm run audit:truth-registry`
- `npm run audit:final-website`
- `npm run build`
- `npm run lint`
- `npm run seo:qa:full`
- `npm run test:public-trust`
- `npm run test:e2e` → `446 passed`

## High-Confidence Launch-Safe Candidates

These files have direct evidence from the passing validation runs and are the safest first-pass commit candidates.

### Audit and handoff artifacts

- `data/generated/all_state_california_grade_audit_v3.json`
- `docs/generated/current-truth-audit-2026-06-28.json`
- `docs/generated/current-truth-audit-2026-06-28.md`
- `docs/generated/truth-registry-2026-06-28.json`
- `docs/generated/truth-registry-2026-06-28.md`
- `docs/generated/final-website-audit-2026-06-28.json`
- `docs/generated/final-website-audit-2026-06-28.md`
- `docs/generated/launch-readiness-handoff-2026-06-28.md`

Why:

- These files capture the reconciled `45 COMPLETE / 5 BLOCKED / 45 index-safe` truth.
- `auditQueueMismatchCount=0` is now reflected in the regenerated audit outputs.

### Core launch-safe app/runtime logic

- `frontend/src/lib/stateAudit.ts`
- `frontend/src/app/robots.ts`
- `frontend/src/app/globals.css`

Why:

- `stateAudit.ts` now resolves generated artifacts robustly across repo/test cwd differences.
- `robots.ts` now explicitly blocks `/share` and `/share/*`.
- `globals.css` contains the confirmed mobile overflow fix.

### Targeted trust/SEO test hardening

- `scripts/test-seo-hardening-v1.mjs`
- `scripts/test-public-copy-hardening.mjs`
- `scripts/test-public-route-provenance-contract.mjs`
- `scripts/test-ihss-wage-disclosure.mjs`
- `scripts/test-directory-public-trust-audit.mjs`

Why:

- These are directly part of the passing trust/SEO validation lane.

### E2E expectation refresh

- `frontend/e2e/florida-launch.spec.ts`
- `frontend/e2e/forms-guides.spec.ts`
- `frontend/e2e/georgia-launch.spec.ts`
- `frontend/e2e/illinois-launch.spec.ts`
- `frontend/e2e/new-jersey-launch.spec.ts`
- `frontend/e2e/new-york-launch.spec.ts`
- `frontend/e2e/ohio-launch.spec.ts`
- `frontend/e2e/pennsylvania-launch.spec.ts`
- `frontend/e2e/seo-sitemap.spec.ts`
- `frontend/e2e/texas-launch.spec.ts`
- `frontend/e2e/wave2-launch.spec.ts`
- `frontend/e2e/wave3-launch.spec.ts`
- `frontend/e2e/wave4-launch.spec.ts`
- `frontend/e2e/wave5-launch.spec.ts`
- `frontend/e2e/wyoming-launch.spec.ts`

Why:

- These only update freshness/provenance expectations to match the current public disclosure copy.
- Full Playwright passed with these changes present.

## Likely Launch-Safe But Review Before Staging

These files are likely part of the trust/SEO launch-safe work, but they are mixed with broader content/UI edits and should be diff-reviewed before staging.

- `frontend/src/app/advocates/advocate-directory-client.tsx`
- `frontend/src/app/benefits/[state]/[[...slug]]/page.tsx`
- `frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx`
- `frontend/src/app/benefits/components/county-map-client.tsx`
- `frontend/src/app/benefits/components/ihss-calculator.tsx`
- `frontend/src/app/benefits/components/ihss-mini-product.tsx`
- `frontend/src/app/components/SourceFreshnessDisclosure.tsx`
- `frontend/src/app/components/answer-page.tsx`
- `frontend/src/app/components/directory-foundation-panel.tsx`
- `frontend/src/app/components/waiver-comparison.tsx`
- `frontend/src/app/counties/components/CorrectionFlow.tsx`
- `frontend/src/app/dashboard/page.tsx`
- `frontend/src/app/find-help/find-help-client.tsx`
- `frontend/src/app/forms/page.tsx`
- `frontend/src/app/share/log/[token]/page.tsx`
- `frontend/src/app/sitemaps/static.xml/route.ts`
- `frontend/src/components/state-coverage-badge.tsx`
- `frontend/src/lib/directoryFoundation.ts`
- `frontend/src/lib/ihssWageDisclosure.ts`
- `frontend/src/lib/publicTruth.ts`
- `frontend/src/lib/seo-data.ts`
- `frontend/src/lib/seoRouteManifest.ts`
- `frontend/src/lib/sourceReviewLabels.ts`
- `frontend/src/lib/stateConfigs.ts`

Why:

- Passing `test:public-trust`, `seo:qa:full`, and `test:e2e` strongly suggests these edits are compatible with launch.
- Several of these files include trust-copy hardening, noindex gating, provenance disclosure, and empty-state behavior.
- They still need a final staging review because they are not as mechanically isolated as the files above.

## Exclude From A Launch-Safe Commit

Do not include these in the first launch-safe commit.

### California/source-pack foundation work

Exclude all current California foundation churn, including:

- `data/generated/ca_*`
- `data/generated/california-*`
- `docs/generated/ca-*`
- `docs/generated/california-*`
- `scripts/*ca-*`
- `scripts/*california-*`
- `scripts/audit-ca-source-pack-post-stage.mjs`
- `scripts/ca-source-pack-lightweight-lib.mjs`
- `scripts/ca-v4-semantic-lib.mjs`
- `scripts/run-ca-*`
- `scripts/test-ca-*`
- `scripts/test-california-*`

Why:

- This is active Phase 3 foundation work and is not yet isolated enough for a launch-safe commit.

### Other broad data/foundation churn

- `data/generated/texas_california_grade_summary_v2.json`
- `data/generated/texas_verified_sources_v1.jsonl`
- `docs/generated/texas-california-grade-audit-report-v2.md`
- `docs/generated/information-completeness-audit-2026-06-28.*`
- `docs/generated/directory-public-trust-audit-2026-06-28.*`
- `docs/generated/public-placeholder-quarantine-audit-2026-06-28.*`
- `src/db/scrapers/nationalCountyGenerator.js`
- `src/db/seed_five_states.js`
- `src/db/seed_remaining_states.js`
- `src/engine/matchingEngine.js`
- `src/scrapers/national/ingest_nces_districts.py`
- `package.json`

Why:

- These files may be valid work, but they are not required to prove the validated launch-safe posture and widen the commit scope too much.

## Suggested Staging Order

1. Stage the high-confidence launch-safe candidates first.
2. Re-run:
   - `npm run audit:final-website`
   - `npm run seo:qa:full`
   - `npm run test:public-trust`
3. If still green, optionally stage the “likely launch-safe but review first” frontend files in small groups.
4. Re-run:
   - `npm run build`
   - `npm run test:e2e`
5. Only after that should a launch-safe commit be created.

## Not Yet Proven

This manifest does **not** prove Phase 3 California foundation completion. It only identifies the subset that appears safe for a launch-hardening/trust/SEO commit boundary.
