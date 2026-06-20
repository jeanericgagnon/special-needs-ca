# Max-Info Program

Generated: 2026-06-17

This artifact is the low-token control plane for the repo-wide 100% max-info program.

## Summary

- Track A status: blocked
- Track A ready rows: 4005
- Track A authored targets: 212
- Track A missing families: 5
- Track B status: needs_implementation
- Track B operational surfaces: 3
- Track B partial surfaces: 1
- Track B missing surfaces: 1

## Track A Blockers

- First-party advocate and legal-support sources: Current advocate/legal targets are overwhelmingly quarantined COPAA-style directories and need replacement with first-party or official sources.
- Exact forms libraries for most states: Only 1 forms source is currently scrape-ready; most state form targets are blocked by fake-domain patterns or still too weak.
- Repair generated fake official domains: Many state office, DD, waiver, early intervention, and form targets are blocked because the repo currently has generated fake official domains.
- More named first-party provider targets: Provider coverage is still the biggest visible info gap even after the ready provider URLs are scraped.
- Knowledge article source families: The product needs many more explanatory content inputs, but the current target inventory is mostly directory/routing oriented.
- Local providers, clinics, therapists, and care: This is the biggest information hole if the goal is all local help, especially to compete on care and treatment discovery.
- Advocates and legal/IEP support: Advocate count is decent, but truth-safe local coverage is not yet strong enough to call exhaustive.
- Findhelp-like metadata: availability, accessibility, intake, capacity: The schema exists, but live high-signal metadata is sparse, especially on nonprofits and advocates.
- Canonical org -> program -> location normalization: Normalization exists, but service-location depth is still too thin to support a fully location-rich help product.
- Conditions, functional needs, age bands, insurance types: Conditions and needs are strong, but age-band and insurance reference tables are still empty.
- Help content and explanatory knowledge: The content layer is far too small for a product that aims to cover the full family journey nationally.
- User submissions, coverage gaps, verification queue: Operational feedback loops are not built out enough to sustain exhaustive maintenance.

## Track B Runtime Surfaces

- Family cases, child profiles, and case tracking: status=operational; rows=2; seededExemplarPresent=yes
- Documents and reminders: status=partial; rows=0; seededExemplarPresent=no
- Collaboration threads and shared portal: status=operational; rows=0; seededExemplarPresent=no
- Coverage gaps and verification queue: status=operational; rows=2; seededExemplarPresent=yes
- User-submitted resources: status=missing; rows=0; seededExemplarPresent=no

## Next Actions

- Finish the remaining authored source families before broadening any scrape wave.
- Burn down priority lightweight families in the existing completion plan before nonprofit overflow.
- Keep runtime layers operational and seeded, but do not fabricate broad user-generated data.
- Regenerate this artifact after each source-family unlock or runtime-surface implementation pass.
