# Source Acquisition Lessons Learned

- Run ID: `2026-06-18T04-13-59-194Z`
- Selected URLs: `25`
- Fetch Successes: `19`
- Fetch Failures: `6`
- Success Rate: `76.0%`
- Parse-Ready High Signal: `18`
- Parse-Ready Suspect: `1`
- Retryable Failures: `1`
- Blocked Failures: `2`
- Source Repair Needed: `3`

## What Worked

- The run produced a large parser-safe queue without requiring Codex to read raw page bodies.
- Followup bucketing separated parser-safe artifacts from retry, blocked, and stale-url work.
- High-signal domains are now visible from compact summaries, which makes the next parser wave cheaper to plan.

## What Needs Caution

- A successful fetch is not the same as parser-safe public evidence; suspect redirects and platform pages still need isolation.
- Retryable and blocked failures should not be treated as missing information.
- Stale source targets need repair before more acquisition volume is added.

## Top High-Signal Domains

- nhahealth.com: 1
- www.partnersinlearningllc.com: 1
- schoolkidslawyer.com: 1
- special-ed-advocate-frisco.com: 1
- www.stambaughlawfirm.com: 1
- www.susanclarklawgroup.com: 1
- theadvocacyalliance.org: 1
- www.arizonaspecedadvocates.com: 1
- www.askadvocate.org: 1
- communityadvocates.org: 1
- www.corchnoylaw.com: 1
- cuddylawfirm.com: 1
- www.davefrankel.com: 1
- gadoe.org: 1
- fhfofgno.org: 1

## Top Suspect Domains

- accounts.google.com: 1

## Top Retry Reasons

- server_500: 1

## Top Blocked Reasons

- needs_review_unknown: 2

## Top Source Repair Reasons

- dns_lookup_failed: 2
- stale_or_invalid_404: 1

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.
- Rerun the retryable queue separately before assuming content is missing.
- Treat blocked domains as special handling candidates instead of burning tokens on manual review.
- Repair stale or invalid source targets before scheduling more fetch attempts.
- Keep suspect parse-ready artifacts out of default parser waves until domain rules are tightened.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-13-59-194Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-13-59-194Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-13-59-194Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-13-59-194Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-13-59-194Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-13-59-194Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-13-59-194Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-13-59-194Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

