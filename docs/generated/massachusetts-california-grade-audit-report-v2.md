# Massachusetts California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 14
- primary_gap_reason: official_dese_profiles_district_directory_exists_but_county_to_district_routing_is_unmapped_and_mass_gov_local_office_pages_return_403_to_low_token_fetches

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_dese_profiles_directory_without_county_to_district_mapping (The official DESE Profiles search exposes a public school district directory contract and postback bridge, but the packet still stores county fallbacks and does not yet preserve a truthful county-to-district routing contract from the district directory results.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed Disability Law Center first-party homepage explicitly preserves Massachusetts Protection and Advocacy identification.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Massachusetts Legal Assistance Corporation first-party homepage preserves a statewide low-income legal-information, advice, and representation mission.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_mass_gov_area_office_pages_return_403_without_county_grade_capture (The likely official Massachusetts local-office lane narrows to Mass.gov DDS area-office pages, but bounded low-token fetches to the public org and area-office pages returned HTTP 403 and no alternate county-grade local office contract is preserved on disk.)

## Failure ledger

- district_or_county_education_routing: official_dese_profiles_directory_without_county_to_district_mapping :: The official DESE Profiles search exposes a public school district directory contract and postback bridge, but the packet still stores county fallbacks and does not yet preserve a truthful county-to-district routing contract from the district directory results.
- county_local_disability_resources: mass_gov_area_office_pages_return_403_and_no_alternate_county_grade_local_contract_is_on_disk :: The likely official Massachusetts local-office lane now narrows to Mass.gov DDS area-office pages, but bounded low-token fetches to the public org and area-office pages returned HTTP 403 and no alternate county-grade local office contract is preserved on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.mass.gov/masshealth
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.mass.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.doe.mass.edu/sped/
- district_or_county_education_routing: blocked_official_dese_profiles_directory_without_county_to_district_mapping; samples=3; first=https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.mass.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.dlc-ma.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://fcsn.org/
- legal_aid: verified_state_grade; samples=1; first=https://mlac.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/ssi
- county_local_disability_resources: blocked_mass_gov_area_office_pages_return_403_without_county_grade_capture; samples=2; first=https://www.mass.gov/orgs/department-of-developmental-services

## Next actions

- [critical] district_or_county_education_routing: extract_or_map_dese_district_directory_results
- [critical] county_local_disability_resources: browser_assisted_or_cached_mass_gov_area_office_capture

## Completion decision

- Massachusetts remains `BLOCKED` and `index_safe=false`.
- Protection and advocacy is now repaired through Disability Law Center.
- Legal aid is now repaired through Massachusetts Legal Assistance Corporation.
- Education routing remains blocked because the official DESE Profiles district directory is real but the packet still lacks truthful county-to-district routing extracted from that directory.
- County/local disability resources remain blocked because the likely official Mass.gov DDS area-office pages returned HTTP 403 to bounded low-token fetches and no alternate county-grade local office contract is preserved on disk.
