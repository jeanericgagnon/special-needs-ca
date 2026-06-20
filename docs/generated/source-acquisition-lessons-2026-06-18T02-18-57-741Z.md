# Source Acquisition Lessons Learned

- Run ID: `2026-06-18T02-18-57-741Z`
- Selected URLs: `25`
- Fetch Successes: `18`
- Fetch Failures: `7`
- Success Rate: `72.0%`
- Parse-Ready High Signal: `18`
- Parse-Ready Suspect: `0`
- Retryable Failures: `1`
- Blocked Failures: `2`
- Source Repair Needed: `4`

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
- www.chop.edu: 1
- www.kansashealthsystem.com: 1
- www.lsuhs.edu: 1
- www.luriechildrens.org: 1
- www.marcus.org: 1
- www.ochsner.org: 1
- www.stanfordchildrens.org: 1
- www.uabmedicine.org: 1
- www.unitypoint.org: 1

## Top Suspect Domains

_None_

## Top Retry Reasons

- network_timeout: 1

## Top Blocked Reasons

- access_blocked_403: 2

## Top Source Repair Reasons

- stale_or_invalid_404: 4

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.
- Rerun the retryable queue separately before assuming content is missing.
- Treat blocked domains as special handling candidates instead of burning tokens on manual review.
- Repair stale or invalid source targets before scheduling more fetch attempts.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-18-57-741Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-18-57-741Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-18-57-741Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-18-57-741Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-18-57-741Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-18-57-741Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-18-57-741Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-18-57-741Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

