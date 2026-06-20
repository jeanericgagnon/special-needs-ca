# Gold Program Queue

Generated: 2026-06-16

## Minimum-Token Strategy

- Fix blocker families in descending automation leverage, not state by state.
- Promote coverage before trust depth, and trust depth before nonprofit legitimacy work.
- Reserve manual review for ambiguous nonprofits, advocates, and education contacts only after public-safe coverage exists.

## Global Status

- Gold states now: 49
- Public-safe states now: 50
- Index-safe states now: 50
- States still blocked from gold: 1
- Legacy-gold / strict-gold mismatches: 1

## Blocker Families

| Family | States | Automation Leverage | Manual Review | Recommended Action |
| --- | ---: | ---: | --- | --- |
| Missing Core Waitlists | 0 | 100 | none | Fill state-config-defined waitlists in batch before any local enrichment. |
| DD Routing Null Trust Metadata | 0 | 95 | none | Backfill null DD verification_status and data_origin fields with source-backed normalization. |
| Incomplete Office Coverage | 0 | 92 | low | Batch-promote Medicaid/HHS office layers by state office structure and county coverage gaps. |
| Incomplete Education Coverage | 0 | 88 | low | Fill missing district or regional education coverage through state education directory extraction. |
| DD Routing Still Source-Listed | 0 | 85 | low | Promote DD routing trust from source_listed toward verified using official agency sources. |
| DD Routing Still Manual Review | 0 | 84 | medium | Replace or normalize DD routing rows that still require manual review before a state can be gold. |
| Office Layer Still Source-Listed | 0 | 82 | low | Raise office trust depth only after coverage is complete and public-safe. |
| Office Layer Still Manual Review | 0 | 80 | medium | Hide, replace, or confirm office rows that still require manual review before gold promotion. |
| Education Layer Still Source-Listed | 0 | 78 | medium | Upgrade education rows from source_listed to verified with district-level contact validation. |
| Priority County-Diagnosis Rollout Gap | 0 | 76 | low | Promote the remaining state-config priority county-diagnosis pages that already satisfy the truth-first bar. |
| Education Layer Still Manual Review | 0 | 74 | medium | Fill or validate district and regional education contacts that still require manual review. |
| Advocate Layer Still Source-Listed | 0 | 72 | medium | Demote synthetic advocate/provider rows and promote only source-backed public advocates with direct contact signal. |
| Advocate Truth Coverage Gap | 1 | 70 | medium | Replace quarantined advocate coverage with real source-backed local advocates before public gold promotion. |
| Advocate Layer Still Manual Review | 0 | 68 | medium | Keep advocate/provider rows hidden until a real source, direct contact, and credential signal support public use. |
| Nonprofit Layer Still Source-Listed | 0 | 60 | medium | Keep only useful local nonprofits and generate legitimacy review queues for ambiguous orgs. |
| Nonprofit Layer Still Manual Review | 0 | 58 | high | Hide or review nonprofit rows that still lack enough trust to support gold output. |

## Waves

### Global Preconditions

- Focus: Run the shared, highest-leverage fixes that unblock many states at once.
- Blocker families: missing-waitlists, dd-null-trust
- States: global only

### Coverage Completion Wave

- Focus: Finish office and education county coverage before deeper trust promotions.
- Blocker families: office-coverage, education-coverage
- States: global only

### High-Readiness Depth Wave

- Focus: Push the most advanced public-safe states to gold with the fewest extra tokens.
- Blocker families: dd-source-listed, dd-manual-review, office-source-listed, office-manual-review, education-source-listed, education-manual-review, nonprofit-source-listed, nonprofit-manual-review, advocate-source-listed, advocate-manual-review, county-diagnosis-priority-gap, advocate-truth-gap
- States: california

### Remaining Depth Wave

- Focus: Apply the same trust-depth and nonprofit legitimacy playbook to the rest once coverage is done.
- Blocker families: dd-source-listed, dd-manual-review, office-source-listed, office-manual-review, education-source-listed, education-manual-review, nonprofit-source-listed, nonprofit-manual-review, advocate-source-listed, advocate-manual-review, county-diagnosis-priority-gap, advocate-truth-gap
- States: global only

## Top Cheapest Near-Gold States

| State | Readiness | Registry Status | Blocker Count | Blockers |
| --- | ---: | --- | ---: | --- |
| California | 100% | public_safe_but_blocked | 1 | advocate-truth-gap |

