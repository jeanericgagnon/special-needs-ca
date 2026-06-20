# Find Help Sample Diversity Audit

Generated: 2026-06-16

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This audit compares a naive richness-and-freshness-only top-3 sample set against the current diversity-aware `/find-help` sample selection. The goal is not randomization. The goal is avoiding unnecessarily narrow public examples when equally strong rows from other states or org families already exist.

| Table | Public Candidates | Naive Distinct States | Diverse Distinct States | Naive Distinct Families | Diverse Distinct Families |
| --- | ---: | ---: | ---: | ---: | ---: |
| Resource Providers | 39 | 1 | 3 | 3 | 3 |
| Nonprofit Organizations | 29499 | 1 | 3 | 1 | 3 |
| IEP Advocates | 2993 | 1 | 3 | 3 | 3 |

## Resource Providers

- naive sample IDs: pa-clinic-chop, pa-clinic-upmc, pa-clinic-psu
- diverse sample IDs: pa-clinic-chop, oh-clinic-nch-autism, ga-clinic-marcus-autism
- naive distinct states: 1
- diverse distinct states: 3
- naive distinct families: 3
- diverse distinct families: 3
- state diversity delta: +2
- family diversity delta: +0

## Nonprofit Organizations

- naive sample IDs: np-arc-la, np-arc-sf, np-arc-sd
- diverse sample IDs: np-arc-la, tx-np-autism-anderson-tx, fl-np-arc-jax-duval-fl
- naive distinct states: 1
- diverse distinct states: 3
- naive distinct families: 1
- diverse distinct families: 3
- state diversity delta: +2
- family diversity delta: +2

## IEP Advocates

- naive sample IDs: tx-advocate-seal, tx-advocate-cuddy, tx-advocate-whittier
- diverse sample IDs: tx-advocate-seal, fl-advocate-drf, ny-adv-legal-statewide
- naive distinct states: 1
- diverse distinct states: 3
- naive distinct families: 3
- diverse distinct families: 3
- state diversity delta: +2
- family diversity delta: +0
