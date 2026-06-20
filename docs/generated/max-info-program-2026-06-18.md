# Max-Info Program

Generated: 2026-06-18

This artifact is the low-token control plane for the repo-wide 100% max-info program.

## Summary

- Scope mode: data_only
- Track A status: explicitly_blocked
- Track A ready rows: 2532
- Track A authored targets: 380
- Track A missing families: 0
- Track A actionable blockers: 0
- Track A source-repair rows: 0
- Track A provider source-repair rows: 0
- Track A focus mode: none
- Track A current family focus: none
- Track A current blocker focus: none
- Top-level command: npm run run:next-track-a-step
- Track B status: needs_implementation (out of scope for this program)
- Track B operational surfaces: 3
- Track B partial surfaces: 1
- Track B missing surfaces: 1

## Track A Blockers

- Local providers, clinics, therapists, and care: This is the biggest information hole if the goal is all local help, especially to compete on care and treatment discovery.
- Advocates and legal/IEP support: Advocate count is decent, but truth-safe local coverage is not yet strong enough to call exhaustive.
- Findhelp-like metadata: availability, accessibility, intake, capacity: The schema exists, but live high-signal metadata is sparse, especially on nonprofits and advocates.
- Canonical org -> program -> location normalization: Normalization exists, but service-location depth is still too thin to support a fully location-rich help product.
- Help content and explanatory knowledge: The content layer is still far too small for the full family journey nationally, but staged knowledge growth is now present and measured.

## Track A Family Closure Order


## Exhausted Burn-Down Families

- Local providers, clinics, therapists, and care: latestRun=2026-06-18T22-27-56-935Z; selectedCount=0; manifest=/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T22-27-56-935Z/manifest.json
- Forms, guides, and exact official libraries: latestRun=2026-06-18T22-04-48-203Z; selectedCount=0; manifest=/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T22-04-48-203Z/manifest.json
- Advocates and legal/IEP support: latestRun=2026-06-18T04-47-02-783Z; selectedCount=141; manifest=/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-47-02-783Z/manifest.json; exhaustionReason=consecutive_live_source_repair_only_runs; threshold=3
- Housing help: latestRun=2026-06-18T04-28-00-512Z; selectedCount=0; manifest=/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-28-00-512Z/manifest.json

## Track A Command Cadence

- npm run run:next-track-a-step
- npm run audit:track-a-burndown-backlog
- npm run audit:max-info-program

## Next Commands

- npm run run:next-track-a-step

## Track B Runtime Surfaces

- Family cases, child profiles, and case tracking: status=operational; rows=2; seededExemplarPresent=yes
- Documents and reminders: status=partial; rows=0; seededExemplarPresent=no
- Collaboration threads and shared portal: status=operational; rows=0; seededExemplarPresent=no
- Coverage gaps and verification queue: status=operational; rows=2; seededExemplarPresent=yes
- User-submitted resources: status=missing; rows=0; seededExemplarPresent=no

## Next Actions

- No authored source-family blockers remain; shift the loop to ready-target scrape and validation burn-down.
- No source-repair blockers are currently recorded in the master ledger.
- No backlog focus is currently selected.
- Use docs/generated/track-a-blocker-registry-2026-06-18.json as the resumable blocker registry for the remaining non-runtime Track A gap classes.
- Burn down priority lightweight families in the existing completion plan before nonprofit overflow.
- Ignore UI, UX, and runtime-product work in this program; this control plane is data-only.
- Regenerate this artifact after each data-family unlock or data burn-down pass.
