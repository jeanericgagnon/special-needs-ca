# Source Acquisition Lessons Learned

- Run ID: `2026-06-17T16-58-43-900Z`
- Selected URLs: `3432`
- Fetch Successes: `2122`
- Fetch Failures: `1310`
- Success Rate: `61.8%`
- Parse-Ready High Signal: `2061`
- Parse-Ready Suspect: `61`
- Retryable Failures: `825`
- Blocked Failures: `168`
- Source Repair Needed: `317`

## What Worked

- The run produced a large parser-safe queue without requiring Codex to read raw page bodies.
- Followup bucketing separated parser-safe artifacts from retry, blocked, and stale-url work.
- High-signal domains are now visible from compact summaries, which makes the next parser wave cheaper to plan.

## What Needs Caution

- A successful fetch is not the same as parser-safe public evidence; suspect redirects and platform pages still need isolation.
- Retryable and blocked failures should not be treated as missing information.
- Stale source targets need repair before more acquisition volume is added.

## Top High-Signal Domains

- thearc.org: 499
- www.pa.gov: 41
- www.dhs.state.il.us: 11
- www.hhs.texas.gov: 11
- www.dhcs.ca.gov: 10
- www.dds.ca.gov: 9
- en.wikipedia.org: 7
- www.nj.gov: 6
- www.maine.gov: 6
- opwdd.ny.gov: 6
- health.wyo.gov: 5
- oklahoma.gov: 5
- www.in.gov: 5
- apd.myflorida.com: 5
- health.maryland.gov: 4

## Top Suspect Domains

- www.hugedomains.com: 16
- www.facebook.com: 15
- www.vistaprint.com: 10
- accounts.google.com: 6
- www.yahoo.com: 6
- sites.google.com: 6
- www.linkedin.com: 1
- palmettoelderlaw.com: 1

## Top Retry Reasons

- network_fetch_failed: 797
- network_timeout: 11
- server_503: 8
- server_500: 4
- server_502: 2
- server_504: 1
- server_530: 1
- server_523: 1

## Top Blocked Reasons

- access_blocked_403: 154
- access_blocked_401: 4
- access_blocked_999: 4
- access_blocked_409: 4
- access_blocked_444: 1
- access_blocked_421: 1

## Top Source Repair Reasons

- stale_or_invalid_404: 312
- stale_or_invalid_410: 2
- stale_or_invalid_400: 1
- stale_or_invalid_451: 1
- invalid_url_credentials: 1

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.
- Rerun the retryable queue separately before assuming content is missing.
- Treat blocked domains as special handling candidates instead of burning tokens on manual review.
- Repair stale or invalid source targets before scheduling more fetch attempts.
- Keep suspect parse-ready artifacts out of default parser waves until domain rules are tightened.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-17T16-58-43-900Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-17T16-58-43-900Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-17T16-58-43-900Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-17T16-58-43-900Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-17T16-58-43-900Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-17T16-58-43-900Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-17T16-58-43-900Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-17T16-58-43-900Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

