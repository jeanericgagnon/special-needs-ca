# Find Help Sample Quality Audit

Generated: 2026-06-27

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This audit mirrors the live `/find-help` sample-card contract: choose up to 3 public-safe rows per table by structured richness first and freshness second, then apply the same render-time truth gating used by the page.

| Table | Public Candidates | Renderable Public Candidates | Selected Before Render | Rendered | Matches Ideal Renderable Set | Hidden Selected Rows | Skipped Better Renderable Rows |
| --- | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| Resource Providers | 1 | 0 | 0 | 0 | yes | 0 | 0 |
| Nonprofit Organizations | 1733 | 1390 | 3 | 3 | yes | 0 | 0 |
| IEP Advocates | 137 | 40 | 3 | 3 | yes | 0 | 0 |

## Resource Providers

- public candidates: 1
- renderable public candidates: 0
- selected before render: 0
- rendered cards: 0
- rendered selection matches ideal renderable set: yes

## Nonprofit Organizations

- public candidates: 1733
- renderable public candidates: 1390
- selected before render: 3
- rendered cards: 3
- rendered selection matches ideal renderable set: yes

Selected before render:

- fl-np-drf-alachua-fl: score=0, renderable=yes, issues=none, freshness=2026-06-12
- ny-np-parenttoparent-albany-ny: score=0, renderable=yes, issues=none, freshness=2026-06-12
- pa-np-peal-adams-pa: score=0, renderable=yes, issues=none, freshness=2026-06-12

Ideal renderable selection under the current contract:

- fl-np-drf-alachua-fl: score=0, freshness=2026-06-12
- ny-np-parenttoparent-albany-ny: score=0, freshness=2026-06-12
- pa-np-peal-adams-pa: score=0, freshness=2026-06-12

## IEP Advocates

- public candidates: 137
- renderable public candidates: 40
- selected before render: 3
- rendered cards: 3
- rendered selection matches ideal renderable set: yes

Selected before render:

- fl-advocate-drf: score=1, renderable=yes, issues=none, freshness=2026-06-12
- ny-adv-legal-statewide: score=1, renderable=yes, issues=none, freshness=2026-06-12
- pa-adv-parent-statewide: score=1, renderable=yes, issues=none, freshness=2026-06-12

Ideal renderable selection under the current contract:

- fl-advocate-drf: score=1, freshness=2026-06-12
- ny-adv-legal-statewide: score=1, freshness=2026-06-12
- pa-adv-parent-statewide: score=1, freshness=2026-06-12
