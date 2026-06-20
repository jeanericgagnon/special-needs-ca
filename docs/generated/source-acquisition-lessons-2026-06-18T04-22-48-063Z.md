# Source Acquisition Lessons Learned

- Run ID: `2026-06-18T04-22-48-063Z`
- Selected URLs: `25`
- Fetch Successes: `24`
- Fetch Failures: `1`
- Success Rate: `96.0%`
- Parse-Ready High Signal: `24`
- Parse-Ready Suspect: `0`
- Retryable Failures: `0`
- Blocked Failures: `0`
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
- www.jwadvocates.com: 1
- ospi.k12.wa.us: 1
- www.lawtexs.com: 1
- www.learningassoc.com: 1

## Top Suspect Domains

_None_

## Top Retry Reasons

_None_

## Top Blocked Reasons

_None_

## Top Source Repair Reasons

- dns_lookup_failed: 1

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.
- Repair stale or invalid source targets before scheduling more fetch attempts.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-22-48-063Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-22-48-063Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-22-48-063Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-22-48-063Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-22-48-063Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-22-48-063Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-22-48-063Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-22-48-063Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

