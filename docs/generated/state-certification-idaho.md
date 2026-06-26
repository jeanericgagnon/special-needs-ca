# State Certification: Idaho

- candidate_branch: current-worktree
- pass: false
- state_classification: BLOCKED
- index_safe: false
- completeness_pct: 87
- checked_files: data/generated/idaho_california_grade_summary_v2.json, data/generated/idaho_gap_matrix_v2.jsonl, data/generated/idaho_failure_ledger_v2.jsonl, data/generated/idaho_verified_sources_v1.jsonl, data/generated/idaho_next_action_queue_v2.jsonl, docs/generated/idaho-california-grade-audit-report-v2.md

## Result

- Candidate failed 1 certification check(s).

## Failures

- `not_completion_candidate`: Candidate classification is BLOCKED, not COMPLETE.
  files: data/generated/idaho_california_grade_summary_v2.json
  suggested_repair_class: keep_blocked_or_repair_more

## Family Snapshot

- medicaid_state_health_coverage: verified_state_grade
- medicaid_waiver_hcbs_disability_services: verified_state_grade
- developmental_disability_idd_authority: verified_state_grade
- early_intervention_part_c: verified_state_grade
- special_education_idea_part_b: verified_state_grade
- district_or_county_education_routing: blocked_residual_camas_and_clark_hosts_still_publish_only_wrong_role_or_too_thin_local_education_surfaces
- vocational_rehabilitation_pre_ets: verified_state_grade
- protection_and_advocacy: verified_state_grade
- parent_training_information_center: verified_state_grade
- legal_aid: verified_state_grade
- able_program: verified_state_grade
- ssi_ssa_federal_reference: verified_state_grade
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract
