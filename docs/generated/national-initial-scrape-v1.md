**National Initial Scrape V1**
Generated at `2026-06-26T17:19:57Z`

This milestone freezes the initial national scrape baseline and marks the transition from acquisition-first work into data governance.

- Milestone: `national-initial-scrape-v1`
- Complete states: `45`
- Blocked states: `5`
- Index-safe states: `45`
- Incorrectly index-safe states: `0`

Blocked states:
- `alaska`
- `arizona`
- `idaho`
- `maine`
- `new-hampshire`

Source artifacts:
- [all_state_california_grade_audit_v3.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/generated/all_state_california_grade_audit_v3.json)
- [all_state_priority_queue_v3.jsonl](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/generated/all_state_priority_queue_v3.jsonl)
- [national-initial-scrape-v1.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/generated/national-initial-scrape-v1.json)

Governance meaning:
- The initial scrape baseline is frozen.
- The `45` complete states become the maintained truth set.
- The `5` blocked states remain explicitly blocked until new official public evidence appears.
- Future work should default to governance tasks: audit consistency, truth preservation, blocker tracking, regression prevention, and controlled rechecks.
