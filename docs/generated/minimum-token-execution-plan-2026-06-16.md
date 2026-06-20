# Minimum-Token Execution Plan

Generated: 2026-06-16

## Goal

- Reach the full information expectation as cheaply as possible in tokens without relaxing the truth-first bar.

## Why This Order

- Biggest current public information gap: public-safe provider coverage.
- States still missing a public-safe provider layer: 46.
- Strict-gold blocked states: 1.
- Current strict full-information audit: 4 substantial, 4 partial, 2 modeled-only, 1 demo-only layers.

## Principles

- Use one repeatable promotion pattern per blocker family before touching the next family.
- Prefer work that unlocks multiple states with one extraction or promotion rule.
- Do not spend tokens deepening layers that are already broad while provider coverage is still near-empty nationally.
- Fill small controlled reference tables immediately when they are schema-modeled but empty.
- Defer architecture-heavy backfills until they improve truthful public output, not just internal elegance.

## Execution Order

- 1. Provider Wave A expansion (high token efficiency, high automation fit)
- 2. California advocate truth remediation (high token efficiency, medium automation fit)
- 3. Provider Wave B expansion (high token efficiency, high automation fit)
- 4. Reference table seeding for age bands and insurance types (high token efficiency, high automation fit)
- 5. Knowledge article depth expansion (medium token efficiency, medium automation fit)
- 6. Normalization backfill (low token efficiency, medium automation fit)

## Provider Wave A expansion

- Why now: This is the single biggest visible information gap and the best leverage path because three states are otherwise already green in the stricter info audits.
- Token efficiency: high
- Automation fit: high
- States: Ohio, Georgia, North Carolina
- Blockers cleared: no_public_safe_provider_layer_detected
- Evidence: 46 states still lack any public-safe provider layer.
- Evidence: 3 Wave A states already sit at 88.9 info completeness and 91.7 confidence with provider as the only blocker family.
- Evidence: 36 checked-in provider rows exist across only 4/50 states.
- Cheapest why: It reuses the existing state-upgrade pipeline and source-target structure without reopening the much larger program, office, or nonprofit layers.
- Concrete steps:
  - Seed a minimal truthful provider set in Ohio, Georgia, and North Carolina from existing official institutional targets already present in the repo.
  - Promote only hospital or university developmental clinic rows that already meet source-url, contact-signal, and trust requirements.
  - Re-run provider truth, info completeness, and info confidence audits after each state.

## California advocate truth remediation

- Why now: California is the only strict-gold blocker and still masks the true local-directory story if left unresolved.
- Token efficiency: high
- Automation fit: medium
- States: California
- Blockers cleared: advocate_truth_gap, no_public_safe_advocate_layer_detected
- Evidence: 1 state remains blocked from strict gold.
- Evidence: 58 California counties lose all advocate coverage after truth gating.
- Evidence: 580 synthetic-pattern advocate rows were quarantined.
- Cheapest why: It focuses on the only strict-gold blocker instead of broad national enrichment.
- Concrete steps:
  - Replace quarantined California advocate coverage with real source-backed advocates before adding any synthetic-looking fallback.
  - Keep provider expansion separate so California does not appear healthier than it is while advocate truth remains broken.

## Provider Wave B expansion

- Why now: Once Wave A proves the seed pattern, the next five states give the fastest additional national lift.
- Token efficiency: high
- Automation fit: high
- States: Michigan, New Jersey, Virginia, Washington, Massachusetts
- Blockers cleared: no_public_safe_provider_layer_detected
- Evidence: 5 states are already grouped as the next zero-row provider wave in the checked-in provider plan.
- Evidence: 45 states still have zero provider rows.
- Cheapest why: It extends the same proven provider ingestion pattern rather than inventing a second enrichment strategy.
- Concrete steps:
  - Reuse the Wave A promotion pattern for Michigan, New Jersey, Virginia, Washington, and Massachusetts.
  - Prefer one to three official institutional clinics per state before broader provider expansion.

## Reference table seeding for age bands and insurance types

- Why now: These are modeled but empty, and filling them is low-risk, cheap, and closes obvious schema-to-data gaps.
- Token efficiency: high
- Automation fit: high
- Blockers cleared: empty_reference_tables
- Evidence: 0 age bands in checked-in DB.
- Evidence: 0 insurance types in checked-in DB.
- Cheapest why: This is tiny controlled data with no public-truth ambiguity.
- Concrete steps:
  - Seed canonical age bands and insurance types from the schema comments and existing product vocabulary.
  - Add an audit check so these reference tables cannot regress back to empty.

## Knowledge article depth expansion

- Why now: Knowledge content is one of the clearest “we do not yet have all info” gaps after providers.
- Token efficiency: medium
- Automation fit: medium
- Blockers cleared: thin_knowledge_content
- Evidence: 15 knowledge articles exist today.
- Evidence: partial status in the strict full-information audit.
- Cheapest why: Content can be expanded around existing diagnosis, waiver, school, and transition journeys without changing the core data model.
- Concrete steps:
  - Add article plans by journey cluster: diagnosis basics, school rights, waiver entry, respite, transition, appeals.
  - Only publish article pages that are backed by existing structured program and source data.

## Normalization backfill

- Why now: This matters for long-term architecture, but it is not the cheapest near-term move for public information depth.
- Token efficiency: low
- Automation fit: medium
- Blockers cleared: modeled_only_normalization
- Evidence: 0 organizations
- Evidence: 0 organization-program links
- Evidence: 0 service locations
- Evidence: 0 office locations
- Evidence: 0 virtual service areas
- Cheapest why: This is deliberately deferred because it has architectural value but limited immediate public-surface payoff compared with provider depth.
- Concrete steps:
  - Backfill normalization tables only from rows that already have trustworthy organization, program, and location identity.
  - Do not force a migration of the public renderer before the normalized tables hold real data.

## Stop Doing

- Do not treat truth-safe or structurally complete as proof that all information depth already exists.
- Do not spend human review on low-value ambiguous listings before the provider layer exists in the target state.
- Do not backfill normalization tables with guessed org or location joins.
