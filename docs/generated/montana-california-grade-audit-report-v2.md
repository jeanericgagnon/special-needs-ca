# Montana California-Grade Batch 74 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 58
- county_count: 56
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: blocked_reviewed_first_party_support_without_explicit_statewide_panda_designation (reviewed first-party statewide disability-rights evidence exists, but the saved artifact does not preserve explicit statewide P&A system designation text)
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 5 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- protection_and_advocacy: reviewed_first_party_support_source_lacks_explicit_statewide_panda_designation :: Reviewed Disability Rights Montana evidence preserves disability-rights branding, protection-and-advocacy framing, and Montana contact routing, but the saved first-party artifact does not preserve explicit statewide P&A system designation text.
- parent_training_information_center: legacy_or_inventory_only_evidence :: 5 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Montana.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 5 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dphhs.mt.gov/dsd/ddp/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.montana.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.montana.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://opi.mt.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://opi.mt.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dphhs.mt.gov/dsd/ddp
- protection_and_advocacy: blocked_reviewed_first_party_support_without_explicit_statewide_panda_designation; samples=1; first=https://www.disabilityrightsmt.org/
- parent_training_information_center: inventory_only; samples=3; first=https://pluk.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.montana.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: hold_blocked_until_explicit_statewide_panda_designation_is_preserved_from_reviewed_first_party_source
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Montana no longer belongs in UNSTARTED. The packet already has enough reviewed on-disk evidence to terminalize the real blockers without pretending the state is closer to California-grade than the evidence supports.
- Disability Rights Montana is preserved as real reviewed statewide support evidence because the first-party page explicitly preserves disability-rights branding, protection-and-advocacy framing, and a Montana contact location.
- That reviewed Disability Rights Montana artifact still does not preserve the exact statewide Protection and Advocacy system designation text required for upgrade, so P&A remains blocked rather than being promoted by inference.
- Montana still has no reviewed PLUK or other first-party PTI artifact on disk, so PTI stays blocked on inventory-only evidence.
- Montana still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on mixed statewide/structural sources instead of reviewed county-owned local routing, and statewide legal-aid proof is still missing on disk.
- Montana is therefore terminal BLOCKED, not COMPLETE.
