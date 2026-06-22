# Alabama California-Grade Batch 7 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 67
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 7 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Alabama.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 7 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://medicaid.alabama.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.alabama.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.alabama.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.alabamaachieves.org/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.alabamaachieves.org/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mh.alabama.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=http://adap.ua.edu/
- parent_training_information_center: verified_state_grade; samples=1; first=https://alabamaparentcenter.com/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Alabama no longer belongs in UNSTARTED. Reviewed first-party statewide support evidence on disk now truthfully upgrades Protection and Advocacy and the Parent Training & Information Center from stale missing/inventory-only packet states.
- Alabama still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or statewide locator-style evidence, and legal aid still lacks a reviewed statewide first-party source family.
- Alabama is therefore terminal BLOCKED, not COMPLETE: the statewide support families are now repaired, but the remaining county-grade routing gaps are explicit and still unresolved.
