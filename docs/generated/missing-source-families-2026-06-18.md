# Missing Source Families

Generated: 2026-06-18

No authored source-family blockers remain right now; this artifact now acts as a confirmation checkpoint plus a depth-backlog snapshot.

## Why This Exists

- `scrape-now-only` tells us what we can crawl immediately.
- This file confirms that authoring is cleared and that the remaining work is queue burn-down, validation, staging, and explicit blocker capture.

## Critical Exhaustive Gaps

- Local providers, clinics, therapists, and care: This is the biggest information hole if the goal is all local help, especially to compete on care and treatment discovery.
- Advocates and legal/IEP support: Advocate count is decent, but truth-safe local coverage is not yet strong enough to call exhaustive.
- Findhelp-like metadata: availability, accessibility, intake, capacity: The schema exists, but live high-signal metadata is sparse, especially on nonprofits and advocates.
- Canonical org -> program -> location normalization: Normalization exists, but service-location depth is still too thin to support a fully location-rich help product.
- Help content and explanatory knowledge: The content layer is still far too small for the full family journey nationally, but staged knowledge growth is now present and measured.
- Family workflow, case tracking, reminders, and documents: The runtime workflow model exists but is not populated as a real product layer.
- Support planning, collaboration, and care coordination: This entire product surface is still schema-only in practice.
- User submissions, coverage gaps, verification queue: Operational feedback loops are not built out enough to sustain exhaustive maintenance.

## Gap Family Coverage Snapshot

- nonprofit_support: total=1396, ready=1293, blocked=0, discovery=103, manual=0, trustedMissingRows=34009
- providers_care: total=92, ready=61, blocked=28, discovery=0, manual=3, trustedMissingRows=0
- programs_benefits: total=83, ready=47, blocked=36, discovery=0, manual=0, trustedMissingRows=0
- parent_training_nonprofits: total=67, ready=25, blocked=42, discovery=0, manual=0, trustedMissingRows=0
- condition_nonprofits: total=61, ready=18, blocked=42, discovery=0, manual=1, trustedMissingRows=0
- geography_counties: total=59, ready=48, blocked=11, discovery=0, manual=0, trustedMissingRows=0
- general_gap_fill: total=58, ready=58, blocked=0, discovery=0, manual=0, trustedMissingRows=0
- transition_programs: total=57, ready=17, blocked=40, discovery=0, manual=0, trustedMissingRows=0
- dd_routing: total=55, ready=54, blocked=1, discovery=0, manual=0, trustedMissingRows=0
- waivers: total=53, ready=52, blocked=1, discovery=0, manual=0, trustedMissingRows=0
- medicaid_hhs_offices: total=50, ready=10, blocked=40, discovery=0, manual=0, trustedMissingRows=0
- early_intervention_programs: total=50, ready=10, blocked=40, discovery=0, manual=0, trustedMissingRows=0
- education_routing: total=50, ready=15, blocked=35, discovery=0, manual=0, trustedMissingRows=0
- source_registry: total=49, ready=39, blocked=10, discovery=0, manual=0, trustedMissingRows=0
- advocates_legal: total=44, ready=1, blocked=43, discovery=0, manual=0, trustedMissingRows=0
- forms_guides: total=43, ready=6, blocked=37, discovery=0, manual=0, trustedMissingRows=0

## Authored Source-Family Blockers

- none; authoring is currently cleared for the tracked family set.
