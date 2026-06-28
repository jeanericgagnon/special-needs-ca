# Directory Freshness Gap Audit

Generated: 2026-06-28

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This audit isolates public-eligible directory rows that still have no machine-usable freshness signal at all. It is narrower than the staleness audit: these rows are not old, they are timestamp-opaque.

| Table | Total | Public Eligible | Gap Rows | Gap % of Public Eligible |
| --- | ---: | ---: | ---: | ---: |
| Resource Providers | 1 | 0 | 0 | 0% |
| Nonprofit Organizations | 1775 | 1390 | 0 | 0% |
| IEP Advocates | 137 | 40 | 0 | 0% |

## Resource Providers

- public eligible rows: 0/1
- rows missing every freshness signal: 0/0 (0%)

## Nonprofit Organizations

- public eligible rows: 1390/1775
- rows missing every freshness signal: 0/1390 (0%)

## IEP Advocates

- public eligible rows: 40/137
- rows missing every freshness signal: 0/40 (0%)
