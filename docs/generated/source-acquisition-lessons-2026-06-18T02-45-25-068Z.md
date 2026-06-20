# Source Acquisition Lessons Learned

- Run ID: `2026-06-18T02-45-25-068Z`
- Selected URLs: `25`
- Fetch Successes: `16`
- Fetch Failures: `9`
- Success Rate: `64.0%`
- Parse-Ready High Signal: `16`
- Parse-Ready Suspect: `0`
- Retryable Failures: `0`
- Blocked Failures: `4`
- Source Repair Needed: `5`

## What Worked

- The run produced a large parser-safe queue without requiring Codex to read raw page bodies.
- Followup bucketing separated parser-safe artifacts from retry, blocked, and stale-url work.
- High-signal domains are now visible from compact summaries, which makes the next parser wave cheaper to plan.

## What Needs Caution

- A successful fetch is not the same as parser-safe public evidence; suspect redirects and platform pages still need isolation.
- Retryable and blocked failures should not be treated as missing information.
- Stale source targets need repair before more acquisition volume is added.

## Top High-Signal Domains

- calliercenter.utdallas.edu: 1
- health.ucdavis.edu: 1
- med.miami.edu: 1
- medschool.cuanschutz.edu: 1
- nyulangone.org: 1
- ufhealthjax.org: 1
- www.carle.org: 1
- www.chop.edu: 1
- www.kansashealthsystem.com: 1
- www.lsuhs.edu: 1
- www.luriechildrens.org: 1
- www.marcus.org: 1
- www.ochsner.org: 1
- www.stanfordchildrens.org: 1
- www.uabmedicine.org: 1

## Top Suspect Domains

_None_

## Top Retry Reasons

_None_

## Top Blocked Reasons

- needs_review_unknown: 2
- access_blocked_403: 2

## Top Source Repair Reasons

- stale_or_invalid_404: 5

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.
- Treat blocked domains as special handling candidates instead of burning tokens on manual review.
- Repair stale or invalid source targets before scheduling more fetch attempts.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-45-25-068Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-45-25-068Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-45-25-068Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-45-25-068Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-45-25-068Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-45-25-068Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-45-25-068Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-45-25-068Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

