# Massachusetts California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 14
- primary_gap_reason: official_dese_profiles_postback_results_preserve_district_rows_but_no_county_mapping_and_mass_gov_dds_lane_is_host_wide_403

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_dese_postback_results_without_county_mapping (Replaying the official DESE Profiles district-directory bridge returns a real results surface with district names, superintendent contacts, addresses, phones, and grades, but the reviewed result page still preserves no county column, county filter, or county-to-district export contract.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed Disability Law Center first-party homepage explicitly preserves Massachusetts Protection and Advocacy identification.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Massachusetts Legal Assistance Corporation first-party homepage preserves a statewide low-income legal-information, advice, and representation mission.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_mass_gov_dds_lane_host_wide_403_without_county_grade_capture (The likely official Massachusetts DDS county-local lane stays blocked because bounded low-token fetches to the public org page, the DDS area-offices page, and the Mass.gov sitemap all returned HTTP 403, and no alternate county-grade local office contract is preserved on disk.)

## Failure ledger

- district_or_county_education_routing: official_dese_profiles_postback_results_lack_county_to_district_contract :: Replaying the official DESE Profiles district-directory bridge now returns a real results surface with district names, superintendent contacts, addresses, phones, and grades, but the reviewed result page still preserves no county column, county filter, or county-to-district export contract. The packet therefore still cannot truthfully map Massachusetts counties to district routing from official reviewed evidence.
- county_local_disability_resources: mass_gov_dds_org_area_office_and_sitemap_return_403 :: The likely official Massachusetts DDS county-local lane stays blocked because bounded low-token fetches to the public org page, the DDS area-offices page, and the Mass.gov sitemap all returned HTTP 403, and no alternate county-grade local office contract is preserved on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.mass.gov/masshealth
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.mass.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.doe.mass.edu/sped/
- district_or_county_education_routing: blocked_official_dese_postback_results_without_county_mapping; samples=3; first=https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.mass.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.dlc-ma.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://fcsn.org/
- legal_aid: verified_state_grade; samples=1; first=https://mlac.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/ssi
- county_local_disability_resources: blocked_mass_gov_dds_lane_host_wide_403_without_county_grade_capture; samples=3; first=https://www.mass.gov/orgs/department-of-developmental-services

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_official_county_to_district_contract_exists
- [critical] county_local_disability_resources: browser_assisted_or_cached_mass_gov_area_office_capture

## Completion decision

- Massachusetts remains `BLOCKED` and `index_safe=false`.
- Protection and advocacy is now repaired through Disability Law Center.
- Legal aid is now repaired through Massachusetts Legal Assistance Corporation.
- Education routing remains blocked because the official DESE Profiles bridge only becomes useful after replaying its hidden-field POST, and the resulting district directory still does not expose a county column, county filter, or county-to-district export contract.
- County/local disability resources remain blocked because the likely official Massachusetts DDS lane is host-wide 403 in the bounded low-token runtime: the org page, area-office page, and sitemap all returned Forbidden and no alternate county-grade local office contract is preserved on disk.
