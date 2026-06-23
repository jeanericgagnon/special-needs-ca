# Batch 274 Kansas Abilene Exact Host Freeze v1

- state: kansas
- classification: BLOCKED
- reviewed_leaf_count: 10
- new_exact_non_match_county: dickinson-ks

## What was confirmed

- Abilene USD 435 / Dickinson County remains export-backed from the official KSDE Directory Reports lane.
- The official district host `https://www.abileneschools.org/` is live.
- The official district sitemap `https://www.abileneschools.org/sitemap.xml` is live.
- A bounded same-domain pass still found no role-exact `special education`, `student services`, `special services`, `procedural safeguards`, or `parent rights` leaf on the district host.

## Repair decision

- Dickinson stays unresolved, but it is now frozen as an exact host non-match rather than a loose authoring candidate.
- Kansas remains blocked because county-grade local education routing is still incomplete across the state packet.

