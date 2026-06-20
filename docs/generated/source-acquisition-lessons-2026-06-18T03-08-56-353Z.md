# Source Acquisition Lessons Learned

- Run ID: `2026-06-18T03-08-56-353Z`
- Selected URLs: `10`
- Fetch Successes: `8`
- Fetch Failures: `2`
- Success Rate: `80.0%`
- Parse-Ready High Signal: `8`
- Parse-Ready Suspect: `0`
- Retryable Failures: `0`
- Blocked Failures: `2`
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

- www.cdc.gov: 3
- sites.ed.gov: 2
- www.medicaid.gov: 2
- acl.gov: 1

## Top Suspect Domains

_None_

## Top Retry Reasons

_None_

## Top Blocked Reasons

- access_blocked_403: 2

## Top Source Repair Reasons

_None_

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.
- Treat blocked domains as special handling candidates instead of burning tokens on manual review.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-08-56-353Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-08-56-353Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-08-56-353Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-08-56-353Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-08-56-353Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-08-56-353Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-08-56-353Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-08-56-353Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

