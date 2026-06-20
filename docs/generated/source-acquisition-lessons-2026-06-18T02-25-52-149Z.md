# Source Acquisition Lessons Learned

- Run ID: `2026-06-18T02-25-52-149Z`
- Selected URLs: `25`
- Fetch Successes: `21`
- Fetch Failures: `4`
- Success Rate: `84.0%`
- Parse-Ready High Signal: `21`
- Parse-Ready Suspect: `0`
- Retryable Failures: `2`
- Blocked Failures: `1`
- Source Repair Needed: `1`

## What Worked

- The run produced a large parser-safe queue without requiring Codex to read raw page bodies.
- Followup bucketing separated parser-safe artifacts from retry, blocked, and stale-url work.
- High-signal domains are now visible from compact summaries, which makes the next parser wave cheaper to plan.

## What Needs Caution

- A successful fetch is not the same as parser-safe public evidence; suspect redirects and platform pages still need isolation.
- Retryable and blocked failures should not be treated as missing information.
- Stale source targets need repair before more acquisition volume is added.

## Top High-Signal Domains

- card-usf.fmhi.usf.edu: 1
- card.ufl.edu: 1
- childrenswi.org: 1
- fsucard.com: 1
- pediatrics.med.jax.ufl.edu: 1
- icei.fmhi.usf.edu: 1
- intermountainhealthcare.org: 1
- mdc.fsu.edu: 1
- children.muschealth.org: 1
- phoenixchildrens.org: 1
- stlukesonline.org: 1
- ucf-card.org: 1
- uihc.org: 1
- ukhealthcare.uky.edu: 1
- umcsn.com: 1

## Top Suspect Domains

_None_

## Top Retry Reasons

- network_fetch_failed: 2

## Top Blocked Reasons

- access_blocked_403: 1

## Top Source Repair Reasons

- stale_or_invalid_404: 1

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.
- Rerun the retryable queue separately before assuming content is missing.
- Treat blocked domains as special handling candidates instead of burning tokens on manual review.
- Repair stale or invalid source targets before scheduling more fetch attempts.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-25-52-149Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-25-52-149Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-25-52-149Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-25-52-149Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-25-52-149Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-25-52-149Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-25-52-149Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T02-25-52-149Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

