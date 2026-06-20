# Find Help Sample Quality Audit

Generated: 2026-06-16

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This audit mirrors the live `/find-help` sample-card contract: choose up to 3 public-safe rows per table by structured richness first and freshness second, then apply the same render-time truth gating used by the page.

| Table | Public Candidates | Renderable Public Candidates | Selected Before Render | Rendered | Matches Ideal Renderable Set | Hidden Selected Rows | Skipped Better Renderable Rows |
| --- | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| Resource Providers | 39 | 39 | 3 | 3 | yes | 0 | 0 |
| Nonprofit Organizations | 29499 | 29499 | 3 | 3 | yes | 0 | 0 |
| IEP Advocates | 2993 | 2993 | 3 | 3 | yes | 0 | 0 |

## Resource Providers

- public candidates: 39
- renderable public candidates: 39
- selected before render: 3
- rendered cards: 3
- rendered selection matches ideal renderable set: yes

Selected before render:

- pa-clinic-chop: score=4, renderable=yes, issues=none, freshness=2026-06-16
- oh-clinic-nch-autism: score=4, renderable=yes, issues=none, freshness=2026-06-16
- ga-clinic-marcus-autism: score=4, renderable=yes, issues=none, freshness=2026-06-16

Ideal renderable selection under the current contract:

- pa-clinic-chop: score=4, freshness=2026-06-16
- oh-clinic-nch-autism: score=4, freshness=2026-06-16
- ga-clinic-marcus-autism: score=4, freshness=2026-06-16

## Nonprofit Organizations

- public candidates: 29499
- renderable public candidates: 29499
- selected before render: 3
- rendered cards: 3
- rendered selection matches ideal renderable set: yes

Selected before render:

- new-york-new-york-ny-parent-network-of-western-new-york-cprc-np: score=4, renderable=yes, issues=none, freshness=2026-06-16
- np-arc-la: score=4, renderable=yes, issues=none, freshness=2026-06-16
- tx-np-autism-anderson-tx: score=4, renderable=yes, issues=none, freshness=2026-06-16

Ideal renderable selection under the current contract:

- new-york-new-york-ny-parent-network-of-western-new-york-cprc-np: score=4, freshness=2026-06-16
- np-arc-la: score=4, freshness=2026-06-16
- tx-np-autism-anderson-tx: score=4, freshness=2026-06-16

## IEP Advocates

- public candidates: 2993
- renderable public candidates: 2993
- selected before render: 3
- rendered cards: 3
- rendered selection matches ideal renderable set: yes

Selected before render:

- tx-advocate-seal: score=5, renderable=yes, issues=none, freshness=2026-06-16
- fl-advocate-drf: score=5, renderable=yes, issues=none, freshness=2026-06-16
- ny-adv-legal-statewide: score=5, renderable=yes, issues=none, freshness=2026-06-16

Ideal renderable selection under the current contract:

- tx-advocate-seal: score=5, freshness=2026-06-16
- fl-advocate-drf: score=5, freshness=2026-06-16
- ny-adv-legal-statewide: score=5, freshness=2026-06-16
