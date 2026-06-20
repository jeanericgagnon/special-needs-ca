# Source Acquisition Lessons Learned

- Run ID: `2026-06-18T04-10-48-118Z`
- Selected URLs: `25`
- Fetch Successes: `18`
- Fetch Failures: `7`
- Success Rate: `72.0%`
- Parse-Ready High Signal: `17`
- Parse-Ready Suspect: `1`
- Retryable Failures: `1`
- Blocked Failures: `1`
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

- sites.ed.gov: 1
- www.ndrn.org: 1
- www.parentcenterhub.org: 1
- www.caryloberman.com: 1
- www.njlawfirm.com: 1
- sgwlawfirm.com: 1
- www.specialkidscompany.com: 1
- www.communityamerica.com: 1
- specialsupportservices.com: 1
- adamsesq.com: 1
- www.philadelphiaspecialeducationattorney.com: 1
- josephrabblaw.com: 1
- www.kcslegal.com: 1
- nhahealth.com: 1
- www.partnersinlearningllc.com: 1

## Top Suspect Domains

- accounts.google.com: 1

## Top Retry Reasons

- network_timeout: 1

## Top Blocked Reasons

- needs_review_unknown: 1

## Top Source Repair Reasons

- dns_lookup_failed: 5

## Recommended Next Actions

- Start parser work from `followups/parse-ready-high-signal.json` instead of the raw manifest.
- Rerun the retryable queue separately before assuming content is missing.
- Treat blocked domains as special handling candidates instead of burning tokens on manual review.
- Repair stale or invalid source targets before scheduling more fetch attempts.
- Keep suspect parse-ready artifacts out of default parser waves until domain rules are tightened.

## Artifact Paths

- Run Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-10-48-118Z/summary.json`
- Run Manifest: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-10-48-118Z/manifest.json`
- Run Report: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-10-48-118Z/report.md`
- Followup Summary: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-10-48-118Z/followups/followup-summary.json`
- Parse-Ready High Signal: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-10-48-118Z/followups/parse-ready-high-signal.json`
- Retryable Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-10-48-118Z/followups/retryable-failures.json`
- Blocked Failures: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-10-48-118Z/followups/blocked-failures.json`
- Source Repair: `/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T04-10-48-118Z/followups/source-repair.json`

## Reuse Rule

- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.

