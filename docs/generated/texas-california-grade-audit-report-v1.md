# Texas California-Grade Audit Report v1

- Classification: `PARTIAL`
- Index safe: no
- Legacy status label: `READY_FOR_ALLOWLIST`
- Strong critical families: 10/12
- Missing critical families: 2
- Weak/inventory-only critical families: 0

## Family Status

- Medicaid / state health coverage: `verified_state_grade` (statewide evidence is present at the required authority level)
- Medicaid waiver / HCBS / disability services: `verified_state_grade` (statewide evidence is present at the required authority level)
- Developmental disability / IDD authority: `verified_county_grade` (direct county/district-grade evidence exists)
- Early intervention / IDEA Part C: `verified_county_grade` (direct county/district-grade evidence exists)
- Special education / IDEA Part B: `verified_state_grade` (statewide evidence is present at the required authority level)
- District or county education routing: `blocked` (existing verified-pack or audit evidence is unresolved or blocked)
- Vocational rehabilitation / Pre-ETS: `verified_state_grade` (statewide evidence is present at the required authority level)
- Protection and advocacy: `verified_state_grade` (statewide evidence is present at the required authority level)
- Parent training and information center: `verified_state_grade` (statewide evidence is present at the required authority level)
- Legal aid: `verified_state_grade` (statewide evidence is present at the required authority level)
- ABLE program: `verified_state_grade` (statewide evidence is present at the required authority level)
- SSI / SSA federal references: `verified_state_grade` (statewide evidence is present at the required authority level)
- County/local disability resources: `blocked` (existing verified-pack or audit evidence is unresolved or blocked)

## Failure Ledger Summary

- launch_gate: `texas_not_index_safe_under_v9` -> continue_texas_residual_manual_target_repair
- district_or_county_education_routing: `missing_required_source_family` -> start_state_specific_repair_lane
- county_local_disability_resources: `missing_required_source_family` -> start_state_specific_repair_lane

