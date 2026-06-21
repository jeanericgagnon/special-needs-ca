# California Batch 18 Failure-Class Repair Report v1

- classification: PARTIAL
- index_safe: false
- completeness_pct: 42
- repair_queue_count: 7
- primary_repair_lane: county_district_leaf_repair

## Repair queue

- [critical] early_intervention_part_c: lane=county_district_leaf_repair; next_action=author_county_or_district_exact_targets; family_status=legacy_state_grade
- [critical] district_or_county_education_routing: lane=county_district_leaf_repair; next_action=author_county_or_district_exact_targets; family_status=legacy_state_grade
- [major] vocational_rehabilitation_pre_ets: lane=state_manifest_repair; next_action=author_verified_state_manifest; family_status=inventory_only
- [major] protection_and_advocacy: lane=statewide_family_repair; next_action=author_or_verify_statewide_source_family; family_status=missing
- [major] parent_training_information_center: lane=state_manifest_repair; next_action=author_verified_state_manifest; family_status=inventory_only
- [major] legal_aid: lane=statewide_family_repair; next_action=author_or_verify_statewide_source_family; family_status=missing
- [critical] county_local_disability_resources: lane=county_district_leaf_repair; next_action=author_county_or_district_exact_targets; family_status=legacy_state_grade

## Completion decision

- California remains PARTIAL and not index-safe. Batch 18 only converts packet evidence into repair lanes; it does not weaken the California-grade gate.
