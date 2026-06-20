# Source Acquisition Lessons Learned

- Run ID: `2026-06-18T03-58-19-669Z`
- Selected URLs: `25`
- Fetch Successes: `12`
- Fetch Failures: `13`
- Success Rate: `48.0%`
- Parse-Ready High Signal: `12`
- Parse-Ready Suspect: `0`
- Retryable Failures: `1`
- Blocked Failures: `8`
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

- ufhealthjax.org: 1
- www.unitypoint.org: 1
- www.ssmhealth.com: 1
- uihc.org: 1
- pediatrics.med.jax.ufl.edu: 1
- children.muschealth.org: 1
- ukhealthcare.uky.edu: 1
- healthcare.ascension.org: 1
- www.floridacard.org: 1
- www.brownhealth.org: 1
- www.nicklauschildrens.org: 1
- www.rwjbh.org: 1

## Top Suspect Domains

_None_

## Top Retry Reasons

- network_timeout: 1

## Top Blocked Reasons

- access_blocked_403: 8

## Top Source Repair Reasons

- stale_or_invalid_404: 4

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.
- Rerun the retryable queue separately before assuming content is missing.
- Treat blocked domains as special handling candidates instead of burning tokens on manual review.
- Repair stale or invalid source targets before scheduling more fetch attempts.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-58-19-669Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-58-19-669Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-58-19-669Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-58-19-669Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-58-19-669Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-58-19-669Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-58-19-669Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-58-19-669Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

