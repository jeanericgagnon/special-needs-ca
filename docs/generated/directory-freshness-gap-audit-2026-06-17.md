# Directory Freshness Gap Audit

Generated: 2026-06-17

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This audit isolates public-eligible directory rows that still have no machine-usable freshness signal at all. It is narrower than the staleness audit: these rows are not old, they are timestamp-opaque.

| Table | Total | Public Eligible | Gap Rows | Gap % of Public Eligible |
| --- | ---: | ---: | ---: | ---: |
| Resource Providers | 83 | 83 | 0 | 0% |
| Nonprofit Organizations | 29499 | 29499 | 0 | 0% |
| IEP Advocates | 2995 | 2995 | 0 | 0% |

## Resource Providers

- public eligible rows: 83/83
- rows missing every freshness signal: 0/83 (0%)

## Nonprofit Organizations

- public eligible rows: 29499/29499
- rows missing every freshness signal: 0/29499 (0%)

## IEP Advocates

- public eligible rows: 2995/2995
- rows missing every freshness signal: 0/2995 (0%)
