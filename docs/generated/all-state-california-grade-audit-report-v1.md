# All-State California-Grade Audit Report v1

Generated at: 2026-06-21T14:26:58.871Z

## Honest National Classification

- COMPLETE: 0
- PARTIAL: 4
- BLOCKED: 4
- UNSTARTED: 42

## Index-Safety Check

- States currently proved index-safe under this hardened audit: 0
- States incorrectly exposed by older legacy reports or allowlists: California (CA), Florida (FL), Pennsylvania (PA), Texas (TX)

## Pilot States

- Texas: `PARTIAL` with 10/12 strong critical families.
- Illinois: `BLOCKED` with 6/12 strong critical families.
- New Mexico: `UNSTARTED` with 6/12 strong critical families.

## Highest-Priority Next States

1. Texas (TX) - batch_1_fast_finish: texas_not_index_safe_under_v9
2. California (CA) - batch_1_fast_finish: generic_or_statewide_evidence_used_where_local_required
3. Pennsylvania (PA) - batch_1_fast_finish: legacy_index_exposed_without_california_grade_reaudit
4. Florida (FL) - batch_1_fast_finish: legacy_index_exposed_without_california_grade_reaudit
5. Georgia (GA) - batch_2_repair_blocked: generic_or_statewide_evidence_used_where_local_required
6. Ohio (OH) - batch_2_repair_blocked: generic_or_statewide_evidence_used_where_local_required
7. New York (NY) - batch_2_repair_blocked: generic_or_statewide_evidence_used_where_local_required
8. Illinois (IL) - batch_3_procedure_hardening: generic_or_statewide_evidence_used_where_local_required
9. New Mexico (NM) - batch_3_procedure_hardening: generic_or_statewide_evidence_used_where_local_required
10. Kentucky (KY) - batch_3_procedure_hardening: generic_or_statewide_evidence_used_where_local_required

## Failure Ledger Coverage

- Unresolved critical failure rows: 268
- Every non-complete state has explicit next-lane rows: yes

## Lessons Learned Update

- No new reusable lesson was learned in this framework-only pass beyond the existing Texas v6-v9 rules. Existing lesson docs remain authoritative and unchanged.

