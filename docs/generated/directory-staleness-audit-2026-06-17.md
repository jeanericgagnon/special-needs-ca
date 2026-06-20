# Directory Staleness Audit

Generated: 2026-06-17

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This audit uses the same freshness priority already baked into the directory foundation audit: `last_verified_at` -> `last_verified_date` -> `checked_at` -> `source_last_updated` -> `last_scraped_at`. Rows older than 425 days are treated as stale.

| Table | Total | Public Eligible | Stale | Public Eligible Stale | Missing Freshness Signal | Manual Review Required |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Resource Providers | 83 | 83 | 0 | 0 | 0 | 0 |
| Nonprofit Organizations | 29499 | 29499 | 0 | 0 | 0 | 0 |
| IEP Advocates | 2995 | 2995 | 0 | 0 | 0 | 0 |

## Resource Providers

- public eligible rows: 83/83 (100%)
- stale rows: 0/83 (0%)
- stale among public eligible rows: 0/83 (0%)
- rows missing all freshness signals: 0/83 (0%)
- public eligible rows missing all freshness signals: 0/83 (0%)
- rows flagged for manual review: 0/83
- rows with invalid freshness stamps: 0/83

Freshness buckets:

- 0-90d: 83
- 91-180d: 0
- 181-365d: 0
- 366-425d: 0
- 426-730d: 0
- 731d+: 0
- missing: 0

States with the most public-eligible stale rows:

- Florida: public stale 0/14 (0%), total stale 0/14
- Texas: public stale 0/9 (0%), total stale 0/9
- Pennsylvania: public stale 0/7 (0%), total stale 0/7
- Illinois: public stale 0/6 (0%), total stale 0/6
- Louisiana: public stale 0/2 (0%), total stale 0/2
- Alabama: public stale 0/1 (0%), total stale 0/1
- Alaska: public stale 0/1 (0%), total stale 0/1
- Arizona: public stale 0/1 (0%), total stale 0/1

## Nonprofit Organizations

- public eligible rows: 29499/29499 (100%)
- stale rows: 0/29499 (0%)
- stale among public eligible rows: 0/29499 (0%)
- rows missing all freshness signals: 0/29499 (0%)
- public eligible rows missing all freshness signals: 0/29499 (0%)
- rows flagged for manual review: 0/29499
- rows with invalid freshness stamps: 0/29499

Freshness buckets:

- 0-90d: 29499
- 91-180d: 0
- 181-365d: 0
- 366-425d: 0
- 426-730d: 0
- 731d+: 0
- missing: 0

States with the most public-eligible stale rows:

- Texas: public stale 0/4505 (0%), total stale 0/4505
- Louisiana: public stale 0/1664 (0%), total stale 0/1664
- Indiana: public stale 0/1507 (0%), total stale 0/1507
- New York: public stale 0/1403 (0%), total stale 0/1403
- Virginia: public stale 0/1157 (0%), total stale 0/1157
- Florida: public stale 0/1125 (0%), total stale 0/1125
- Michigan: public stale 0/1015 (0%), total stale 0/1015
- Kentucky: public stale 0/962 (0%), total stale 0/962

## IEP Advocates

- public eligible rows: 2995/2995 (100%)
- stale rows: 0/2995 (0%)
- stale among public eligible rows: 0/2995 (0%)
- rows missing all freshness signals: 0/2995 (0%)
- public eligible rows missing all freshness signals: 0/2995 (0%)
- rows flagged for manual review: 0/2995
- rows with invalid freshness stamps: 0/2995

Freshness buckets:

- 0-90d: 2995
- 91-180d: 0
- 181-365d: 0
- 366-425d: 0
- 426-730d: 0
- 731d+: 0
- missing: 0

States with the most public-eligible stale rows:

- New York: public stale 0/262 (0%), total stale 0/262
- Texas: public stale 0/226 (0%), total stale 0/226
- New Jersey: public stale 0/185 (0%), total stale 0/185
- Pennsylvania: public stale 0/181 (0%), total stale 0/181
- Florida: public stale 0/177 (0%), total stale 0/177
- Illinois: public stale 0/158 (0%), total stale 0/158
- Massachusetts: public stale 0/158 (0%), total stale 0/158
- Georgia: public stale 0/130 (0%), total stale 0/130
