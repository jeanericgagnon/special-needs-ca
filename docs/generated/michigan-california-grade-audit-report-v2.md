# Michigan California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 83
- primary_gap_reason: eighty_one_michigan_district_rows_still_use_statewide_special_education_fallbacks_and_no_county_office_rows_are_backed_by_the_live_mdhhs_county_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_eighty_one_district_rows_still_on_statewide_mde_fallbacks (Michigan currently has 83 school_district rows, but only Oakland and Wayne are locally verified; the remaining 81 rows still depend on the statewide MDE special-education page instead of district- or ISD-owned local routing leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Michigan Legal Help first-party homepage preserves a statewide legal-help and legal-aid access route.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_mdhhs_county_directory_without_reviewed_db_rows (The official MDHHS county-offices root is live and exposes county and regional office leaves plus a composite county directory, but the current packet still has zero reviewed county_offices rows and the composite directory exceeded a bounded low-token fetch window.)

## Failure ledger

- district_or_county_education_routing: eighty_one_district_rows_still_depend_on_statewide_mde_special_education_fallbacks :: Michigan currently has 83 school_district rows, but only Oakland and Wayne are locally verified; the remaining 81 rows still depend on the statewide MDE special-education page instead of district- or ISD-owned local routing leaves.
- county_local_disability_resources: live_mdhhs_county_directory_exists_but_db_has_zero_reviewed_county_rows_and_composite_directory_times_out :: The official MDHHS county-offices root is live and exposes county and regional office leaves plus a composite county directory, but the current packet still has zero reviewed county_offices rows and the composite directory exceeded a bounded low-token fetch window.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.michigan.gov/mde/services/special-education
- district_or_county_education_routing: blocked_eighty_one_district_rows_still_on_statewide_mde_fallbacks; samples=3; first=https://www.detroitk12.org/admin/exceptional_education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drmich.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.michiganallianceforfamilies.org/
- legal_aid: verified_state_grade; samples=1; first=https://michiganlegalhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/ssi
- county_local_disability_resources: blocked_live_mdhhs_county_directory_without_reviewed_db_rows; samples=3; first=https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices

## Next actions

- [critical] district_or_county_education_routing: author_or_extract_district_or_isd_local_targets
- [critical] county_local_disability_resources: capture_county_or_regional_office_mappings_from_live_mdhhs_directory

## Completion decision

- Michigan remains `BLOCKED` and `index_safe=false`.
- Legal aid is now repaired through Michigan Legal Help.
- Education routing remains blocked because only 2 of 83 district rows are locally verified and the remaining 81 still use statewide MDE fallback evidence.
- County/local disability resources remain blocked because the live MDHHS county-office directory is not yet converted into reviewed county_offices rows, and the official composite directory exceeded a bounded low-token fetch window.
