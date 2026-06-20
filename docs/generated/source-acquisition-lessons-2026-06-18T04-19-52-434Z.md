# Source Acquisition Lessons Learned

- Run ID: `2026-06-18T04-19-52-434Z`
- Selected URLs: `25`
- Fetch Successes: `25`
- Fetch Failures: `0`
- Success Rate: `100.0%`
- Parse-Ready High Signal: `24`
- Parse-Ready Suspect: `1`
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

_None_

## Top Blocked Reasons

_None_

## Top Source Repair Reasons

_None_

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.
- Keep suspect parse-ready artifacts out of default parser waves until domain rules are tightened.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-19-52-434Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-19-52-434Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-19-52-434Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-19-52-434Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-19-52-434Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-19-52-434Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-19-52-434Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-19-52-434Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

