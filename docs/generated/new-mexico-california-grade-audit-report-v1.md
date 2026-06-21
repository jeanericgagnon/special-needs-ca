# New Mexico California-Grade Audit Report v1

- Classification: `UNSTARTED`
- Index safe: no
- Legacy status label: `KEEP_GATED (Skeleton)`
- Strong critical families: 6/12
- Missing critical families: 2
- Weak/inventory-only critical families: 4

## Family Status

- Medicaid / state health coverage: `verified_state_grade` (statewide evidence is present at the required authority level)
- Medicaid waiver / HCBS / disability services: `verified_state_grade` (statewide evidence is present at the required authority level)
- Developmental disability / IDD authority: `verified_state_grade` (statewide evidence is present at the required authority level)
- Early intervention / IDEA Part C: `verified_state_grade` (statewide evidence is present at the required authority level)
- Special education / IDEA Part B: `verified_state_grade` (statewide evidence is present at the required authority level)
- District or county education routing: `legacy_state_grade` (statewide or structural evidence exists, but not California-grade proof)
- Vocational rehabilitation / Pre-ETS: `inventory_only` (only legacy inventory hints or weak role matches exist)
- Protection and advocacy: `missing` (no credible current evidence)
- Parent training and information center: `inventory_only` (only legacy inventory hints or weak role matches exist)
- Legal aid: `missing` (no credible current evidence)
- ABLE program: `verified_state_grade` (statewide evidence is present at the required authority level)
- SSI / SSA federal references: `verified_state_grade` (statewide evidence is present at the required authority level)
- County/local disability resources: `legacy_state_grade` (statewide or structural evidence exists, but not California-grade proof)

## Failure Ledger Summary

- district_or_county_education_routing: `generic_or_statewide_evidence_used_where_local_required` -> author_county_or_district_exact_targets
- vocational_rehabilitation_pre_ets: `legacy_or_inventory_only_evidence` -> author_verified_state_manifest
- protection_and_advocacy: `missing_required_source_family` -> author_or_verify_statewide_source_family
- parent_training_information_center: `legacy_or_inventory_only_evidence` -> author_verified_state_manifest
- legal_aid: `missing_required_source_family` -> author_or_verify_statewide_source_family
- county_local_disability_resources: `generic_or_statewide_evidence_used_where_local_required` -> author_county_or_district_exact_targets

