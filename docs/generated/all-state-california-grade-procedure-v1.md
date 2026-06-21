# All-State California-Grade Procedure v1

This procedure generalizes the Texas v6-v9 repair pattern into a repeatable all-state framework. It is intentionally fail-closed: states remain `PARTIAL`, `BLOCKED`, or `UNSTARTED` until direct evidence proves California-grade requirements.

## Core Rules

1. Start from a truthful baseline and preserve existing failure ledgers.
2. Separate statewide evidence from county/district-grade evidence.
3. Never treat generic roots, search pages, statewide fallback, or weak keyword matches as county-grade proof.
4. Keep every incomplete state `noindex` until all launch-critical gates pass.
5. Run state-specific repair lanes before expanding broad scraping volume.
6. Spot-audit repaired rows before changing a state classification.

## State Classification

- `COMPLETE`: every critical family is proven at the required authority/evidence level and the state is index-safe under the hardened gate.
- `PARTIAL`: the state has a useful verified skeleton, but one or more county/district-grade or statewide critical families still fail the hardened gate.
- `BLOCKED`: the state has data, but critical families are weak, generic, stale, or structurally unresolved.
- `UNSTARTED`: the repo has only legacy skeleton signals or inventory hints and no credible California-grade repair lane has been completed yet.

## Texas Lessons Carried Forward

- Require direct district-owned education evidence for county PASS.
- Preserve LIDDA / DD / EI / HHS failure ledgers instead of collapsing into optimistic PASS counts.
- Treat Google Sites and scanned PDFs as conditional evidence only when ownership and text proof are preserved.
- Keep states non-index-safe until the final county baseline shows no unresolved critical gaps.

## Current Lesson Update

This framework pass did not add a new reusable lesson beyond the existing Texas v6-v9 rules. The audit report explicitly says so unless a new verified cross-state rule is learned in a future run.

