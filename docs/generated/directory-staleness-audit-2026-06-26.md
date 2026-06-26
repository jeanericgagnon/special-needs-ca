# Directory Staleness Audit

Generated: 2026-06-26

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This audit uses the same freshness priority already baked into the directory foundation audit: `last_verified_at` -> `last_verified_date` -> `checked_at` -> `source_last_updated` -> `last_scraped_at`. Rows older than 425 days are treated as stale.

| Table | Total | Public Eligible | Stale | Public Eligible Stale | Missing Freshness Signal | Manual Review Required |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Resource Providers | 1 | 1 | 0 | 0 | 1 | 0 |
| Nonprofit Organizations | 1 | 1 | 0 | 0 | 1 | 0 |

## Resource Providers

- public eligible rows: 1/1 (100%)
- stale rows: 0/1 (0%)
- stale among public eligible rows: 0/1 (0%)
- rows missing all freshness signals: 1/1 (100%)
- public eligible rows missing all freshness signals: 1/1 (100%)
- rows flagged for manual review: 0/1
- rows with invalid freshness stamps: 0/1

Freshness buckets:

- 0-90d: 0
- 91-180d: 0
- 181-365d: 0
- 366-425d: 0
- 426-730d: 0
- 731d+: 0
- missing: 1

States with the most public-eligible stale rows:

- null: public stale 0/1 (0%), total stale 0/1

## Nonprofit Organizations

- public eligible rows: 1/1 (100%)
- stale rows: 0/1 (0%)
- stale among public eligible rows: 0/1 (0%)
- rows missing all freshness signals: 1/1 (100%)
- public eligible rows missing all freshness signals: 1/1 (100%)
- rows flagged for manual review: 0/1
- rows with invalid freshness stamps: 0/1

Freshness buckets:

- 0-90d: 0
- 91-180d: 0
- 181-365d: 0
- 366-425d: 0
- 426-730d: 0
- 731d+: 0
- missing: 1

States with the most public-eligible stale rows:

- null: public stale 0/1 (0%), total stale 0/1
