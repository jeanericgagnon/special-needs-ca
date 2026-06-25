# South Dakota California-Grade Batch 84 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 66
- primary_gap_reason: live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_educational_directory_root_without_local_leaves (the live official South Dakota Educational Directory root lists public school districts on a first-party page, but no district-owned special-education leaves are yet attached county by county)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights South Dakota evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: verified_state_grade (authoritative Parent Center Hub South Dakota leaf explicitly labels South Dakota Parent Connection as the South Dakota PTI)
- legal_aid: verified_state_grade (reviewed official South Dakota UJS Get Legal Help page now preserves statewide free or low-cost legal-aid routing through SD Law Help)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_local_offices_shell_without_public_county_contract (the legacy dhhs.south-dakota.gov locator is unresolvable, contact/default.aspx is 404, and the live localoffices root currently serves only a JS loading shell with no county contract in public HTML)

## Failure ledger

- county_local_disability_resources: legacy_locator_dead_and_live_localoffices_root_is_loading_shell :: Reviewed 2026-06-23 live official South Dakota human-services probes at https://dhhs.south-dakota.gov/locations, https://dhs.sd.gov/contact/default.aspx, and https://dhs.sd.gov/en/localoffices. The legacy dhhs host is unresolvable, contact/default.aspx returns a real 404, and the live localoffices root currently serves only a JS Loading shell with no county, office, or locality contract in public HTML.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhs.sd.gov/dd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.south-dakota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.south-dakota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://doe.sd.gov/
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://doe.sd.gov/ofm/edudir.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhs.sd.gov/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drsdlaw.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/south-dakota/
- legal_aid: verified_state_grade; samples=4; first=https://ujs.sd.gov/self-help/get-legal-help/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_current_dhs_host_without_public_county_or_local_office_contract; samples=3; first=https://dhs.sd.gov/en/localoffices

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_a_public_county_or_local_office_contract_is_exposed

## Completion decision

- South Dakota no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy evidence on disk instead of only legacy nonprofit inventory rows.
- Disability Rights South Dakota is preserved as statewide protection-and-advocacy support from the reviewed first-party domain.
- South Dakota still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still lack a public county-grade office contract, and statewide legal aid is still missing on disk.
- South Dakota is therefore terminal BLOCKED, not COMPLETE.
