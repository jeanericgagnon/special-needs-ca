# State Certification: South Dakota

- candidate_branch: origin/parallel-state-repair-b2
- pass: false
- state_classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- checked_files: data/generated/south-dakota_california_grade_summary_v2.json, data/generated/south-dakota_gap_matrix_v2.jsonl, data/generated/south-dakota_failure_ledger_v2.jsonl, data/generated/south-dakota_verified_sources_v1.jsonl, data/generated/south-dakota_next_action_queue_v2.jsonl, docs/generated/south-dakota-california-grade-audit-report-v2.md

## Result

- Candidate failed 4 certification check(s).

## Failures

- `not_completion_candidate`: Candidate classification is BLOCKED, not COMPLETE.
  files: data/generated/south-dakota_california_grade_summary_v2.json
  suggested_repair_class: keep_blocked_or_repair_more
- `statewide_roster_used_as_local_routing` [district_or_county_education_routing]: district_or_county_education_routing relies on a statewide roster, website list, or directory inventory without an explicit local routing contract.
  files: data/generated/south-dakota_verified_sources_v1.jsonl, data/generated/south-dakota_gap_matrix_v2.jsonl
  suggested_repair_class: find_local_routing_contract
- `missing_explicit_geography_mappings` [district_or_county_education_routing]: district_or_county_education_routing does not preserve an explicit geography mapping contract sufficient to justify complete local coverage.
  files: data/generated/south-dakota_verified_sources_v1.jsonl, data/generated/south-dakota_gap_matrix_v2.jsonl
  suggested_repair_class: add_county_district_region_mapping
- `test_missing_geography_coverage_assertions`: State-specific test scripts/test-batch84-south-dakota-statewide-family-truth-refresh-v1.mjs does not assert explicit geography coverage or mapping behavior.
  files: scripts/test-batch84-south-dakota-statewide-family-truth-refresh-v1.mjs
  suggested_repair_class: add_geography_coverage_assertions

## Family Snapshot

- medicaid_state_health_coverage: verified_state_grade
- medicaid_waiver_hcbs_disability_services: verified_state_grade
- developmental_disability_idd_authority: verified_state_grade
- early_intervention_part_c: verified_state_grade
- special_education_idea_part_b: verified_state_grade
- district_or_county_education_routing: verified_state_grade
- vocational_rehabilitation_pre_ets: verified_state_grade
- protection_and_advocacy: verified_state_grade
- parent_training_information_center: verified_state_grade
- legal_aid: verified_state_grade
- able_program: verified_state_grade
- ssi_ssa_federal_reference: verified_state_grade
- county_local_disability_resources: blocked_no_public_county_or_region_disability_office_contract
