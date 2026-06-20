# Source Acquisition Lessons Learned

- Run ID: `2026-06-18T02-56-32-367Z`
- Selected URLs: `25`
- Fetch Successes: `25`
- Fetch Failures: `0`
- Success Rate: `100.0%`
- Parse-Ready High Signal: `25`
- Parse-Ready Suspect: `0`
- Retryable Failures: `0`
- Blocked Failures: `0`
- Source Repair Needed: `0`

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
- www.nationwidechildrens.org: 1
- www.ochsner.org: 1
- www.stanfordchildrens.org: 1

## Top Suspect Domains

_None_

## Top Retry Reasons

_None_

## Top Blocked Reasons

_None_

## Top Source Repair Reasons

_None_

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-56-32-367Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-56-32-367Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-56-32-367Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-56-32-367Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-56-32-367Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-56-32-367Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-56-32-367Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-56-32-367Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

