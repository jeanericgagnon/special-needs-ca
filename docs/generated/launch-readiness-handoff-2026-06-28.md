# Launch Readiness Handoff 2026-06-28

## Status

- Launch-safe national posture: `45 COMPLETE / 5 BLOCKED / 45 index-safe`
- `incorrectlyIndexSafeStates=[]`
- `auditQueueMismatchCount=0`
- South Dakota is reconciled as `COMPLETE` and `index_safe=true` across the current launch audit inputs.

## Validation Completed

- `npm run audit:current-truth`
- `npm run audit:truth-registry`
- `npm run audit:final-website`
- `npm run build`
- `npm run lint`
- `npm run seo:qa:full`
- `npm run test:public-trust`
- `npm run test:e2e`

Observed result:

- `npm run test:e2e`: `446 passed`

## Current Blocked States

These remain truthfully blocked and should stay non-indexable:

1. `alaska`
   - Gap: official local routing still does not expose a borough/census-area contract.
2. `arizona`
   - Gap: Greenlee county assignment still lacks explicit county-proof on the live official lane.
3. `idaho`
   - Gap: attachment/manual evidence still does not create a valid local special-education routing contract.
4. `maine`
   - Gap: DHHS/OFI public surfaces still do not expose a county-to-office or service-area contract.
5. `new-hampshire`
   - Gap: DHHS/DOE/NHES hosts still fail public-access review and remain the deepest blocker.

## Launch-Safe Interpretation

Safe to treat as launch-ready now:

- State hubs for the 45 `COMPLETE` states
- State-level public benefits surfaces that pass current gates
- Sitemap/indexing behavior for allowed launch surfaces
- Public provenance, estimate, and correction-link disclosures on the audited launch routes
- Crawlable tool landing pages already in the validated build:
  - `/benefits-matcher`
  - `/forms-checklist`
  - `/ihss-behavior-log`
  - `/iep-goals`
  - `/regional-center-funding`

Still intentionally gated or partial:

- The 5 blocked states above
- County hubs and county-diagnosis leaves that do not pass truth/index gates
- Thin or unverified provider/advocate surfaces
- Broader California source-pack and regional-center foundation work that is still in progress

## Repo Hygiene Warning

The product/audit posture is clean, but the worktree is not yet clean for a safe `main` commit. There are substantial unrelated California/source-pack and generated-artifact changes mixed with the validated launch-safe edits.

Recommended next step:

1. isolate launch-safe files from unrelated California foundation work
2. stage only the validated launch-safe subset
3. rerun the validation commands above on the isolated subset
4. commit the launch-safe changes separately from California foundation work

## Evidence Sources

- [all_state_california_grade_audit_v3.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/generated/all_state_california_grade_audit_v3.json)
- [all_state_priority_queue_v3.jsonl](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/generated/all_state_priority_queue_v3.jsonl)
- [final-website-audit-2026-06-28.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/final-website-audit-2026-06-28.json)
- [truth-registry-2026-06-28.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/truth-registry-2026-06-28.json)
- [current-truth-audit-2026-06-28.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/docs/generated/current-truth-audit-2026-06-28.json)
