# Directory Staleness Audit

Generated: 2026-06-27

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca-v4/frontend/ca_disability_navigator.db

This audit uses the same freshness priority already baked into the directory foundation audit: `last_verified_at` -> `last_verified_date` -> `checked_at` -> `source_last_updated` -> `last_scraped_at`. Rows older than 425 days are treated as stale.

| Table | Total | Public Eligible | Stale | Public Eligible Stale | Missing Freshness Signal | Manual Review Required |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Resource Providers | 1 | 1 | 0 | 0 | 1 | 0 |
| Nonprofit Organizations | 1775 | 1733 | 0 | 0 | 1 | 0 |
| IEP Advocates | 137 | 41 | 0 | 0 | 0 | 0 |

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

- California: public stale 0/1 (0%), total stale 0/1

## Nonprofit Organizations

- public eligible rows: 1733/1775 (97.6%)
- stale rows: 0/1775 (0%)
- stale among public eligible rows: 0/1733 (0%)
- rows missing all freshness signals: 1/1775 (0.1%)
- public eligible rows missing all freshness signals: 1/1733 (0.1%)
- rows flagged for manual review: 0/1775
- rows with invalid freshness stamps: 0/1775

Freshness buckets:

- 0-90d: 1774
- 91-180d: 0
- 181-365d: 0
- 366-425d: 0
- 426-730d: 0
- 731d+: 0
- missing: 1

States with the most public-eligible stale rows:

- Georgia: public stale 0/488 (0%), total stale 0/488
- Illinois: public stale 0/316 (0%), total stale 0/316
- Ohio: public stale 0/271 (0%), total stale 0/271
- Florida: public stale 0/215 (0%), total stale 0/215
- Pennsylvania: public stale 0/209 (0%), total stale 0/209
- New York: public stale 0/198 (0%), total stale 0/198
- California: public stale 0/36 (0%), total stale 0/78

## IEP Advocates

- public eligible rows: 41/137 (29.9%)
- stale rows: 0/137 (0%)
- stale among public eligible rows: 0/41 (0%)
- rows missing all freshness signals: 0/137 (0%)
- public eligible rows missing all freshness signals: 0/41 (0%)
- rows flagged for manual review: 0/137
- rows with invalid freshness stamps: 0/137

Freshness buckets:

- 0-90d: 137
- 91-180d: 0
- 181-365d: 0
- 366-425d: 0
- 426-730d: 0
- 731d+: 0
- missing: 0

States with the most public-eligible stale rows:

- Florida: public stale 0/31 (0%), total stale 0/31
- New York: public stale 0/2 (0%), total stale 0/26
- Georgia: public stale 0/2 (0%), total stale 0/24
- Illinois: public stale 0/2 (0%), total stale 0/22
- Pennsylvania: public stale 0/2 (0%), total stale 0/18
- Ohio: public stale 0/2 (0%), total stale 0/16
