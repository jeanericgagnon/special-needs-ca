# Batch 18 Failure-Class Repair States Report v1

This pass converts the first five non-COMPLETE states in all-state v3 priority order into explicit family-level repair lanes. It uses the existing California-grade state packets as the control plane and does not relax the Texas v10 gate.

## Cohort state status

- California: PARTIAL; index_safe=false; completeness_pct=42; repair_queue_count=7; primary_repair_lane=county_district_leaf_repair
- Pennsylvania: PARTIAL; index_safe=false; completeness_pct=50; repair_queue_count=7; primary_repair_lane=launch_gate_hold
- Florida: PARTIAL; index_safe=false; completeness_pct=33; repair_queue_count=9; primary_repair_lane=launch_gate_hold
- Georgia: BLOCKED; index_safe=false; completeness_pct=50; repair_queue_count=6; primary_repair_lane=county_district_leaf_repair
- Ohio: BLOCKED; index_safe=false; completeness_pct=50; repair_queue_count=6; primary_repair_lane=county_district_leaf_repair

## Repair lane counts

- county_district_leaf_repair: 13
- state_manifest_repair: 10
- statewide_family_repair: 10
- launch_gate_hold: 2

## Failure class counts

- generic_or_statewide_evidence_used_where_local_required: 13
- legacy_or_inventory_only_evidence: 10
- missing_required_source_family: 10
- legacy_index_exposed_without_california_grade_reaudit: 2

## Batch outcome

- complete_states: none
- generated_all_state_v4: false
- texas_preserved_complete: true

## Lessons learned update

- After packet coverage reaches 50/50, the next best batch is a shared failure-class repair cohort, not another queue-expansion cohort.
