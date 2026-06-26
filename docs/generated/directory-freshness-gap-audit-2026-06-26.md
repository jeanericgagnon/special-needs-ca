# Directory Freshness Gap Audit

Generated: 2026-06-26

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This audit isolates public-eligible directory rows that still have no machine-usable freshness signal at all. It is narrower than the staleness audit: these rows are not old, they are timestamp-opaque.

| Table | Total | Public Eligible | Gap Rows | Gap % of Public Eligible |
| --- | ---: | ---: | ---: | ---: |
| Resource Providers | 1 | 1 | 1 | 100% |
| Nonprofit Organizations | 1 | 1 | 1 | 100% |

## Resource Providers

- public eligible rows: 1/1
- rows missing every freshness signal: 1/1 (100%)

States with freshness-gap rows:

- null: 1

Rows requiring freshness repair:

- Kids Clinic (rp1), Los Angeles: source=https://clinic.org/path; action=Manual freshness review required before continued public trust assumptions

## Nonprofit Organizations

- public eligible rows: 1/1
- rows missing every freshness signal: 1/1 (100%)

States with freshness-gap rows:

- null: 1

Rows requiring freshness repair:

- Parent Support Center (np1), Los Angeles: source=https://nonprofit.org/programs; action=Manual freshness review required before continued public trust assumptions
