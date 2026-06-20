# California Data Quality Audit v2

- Run ID: `ca-v1`
- Total source targets: `209`
- Meaningful fetched evidence: `79`
- Challenge pages: `95`
- Parsed documents: `18`
- Accepted discoveries: `12`
- Rejected discoveries: `0`
- Manual-review discoveries: `188`
- Stage-ready records: `45`
- Unresolved repair records: `130`

## Output Paths

- parse_ready_remediated: `data/source-acquisition-runs/ca-v1/followups/parse-ready-remediated-v2.json`
- browser_assisted: `data/source-acquisition-runs/ca-v1/followups/author-browser-assisted-v2.json`
- discovered_accepted: `data/generated/ca_discovered_targets_accepted_v2.jsonl`
- discovered_rejected: `data/generated/ca_discovered_targets_rejected_v2.jsonl`
- discovered_manual_review: `data/generated/ca_discovered_targets_manual_review_v2.jsonl`
- validation_failures: `data/generated/ca_validation_failures_v2.jsonl`
- stage_ready: `data/generated/ca_stage_ready_v2.jsonl`
- completeness_csv: `data/generated/ca_field_completeness_v2.csv`
- repair_followups: `data/generated/ca_repair_followup_queue_v2.jsonl`
