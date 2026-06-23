# Massachusetts California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 14
- primary_gap_reason: official_dese_hidden_postback_bridge_renders_real_district_rows_but_no_county_contract_and_live_dds_locations_lane_still_lacks_county_export

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_dese_postback_results_without_county_mapping (Massachusetts education is now narrowed more precisely: the reviewed `search_link.aspx` surface is only a hidden-field auto-post bridge, and the real rendered `search.aspx` result page still has district rows with superintendent contacts, addresses, phones, and grades but no county column, county filter, or county-keyed export contract. All 14 county rows still depend on one statewide DESE fallback, so the family remains blocked until an official county-to-district routing contract exists.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed Disability Law Center first-party homepage explicitly preserves Massachusetts Protection and Advocacy identification.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Massachusetts Legal Assistance Corporation first-party homepage preserves a statewide low-income legal-information, advice, and representation mission.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_dds_locations_and_interactive_map_without_county_contract (Massachusetts county-local routing is no longer a host-wide 403 blocker. The live DDS org page, the org-locations index, and the interactive DDS regional map all render on Mass.gov in browser review, but the old `dds-area-offices` child is now a true 404 and the live interactive map still exposes only a town-or-city lookup contract in rendered HTML. The live locations index lists named DDS area offices and regions, but the current low-token lane still has no county column, county export, or machine-readable town list to bridge those offices back to all 14 county rows.)

## Failure ledger

- district_or_county_education_routing: official_dese_profiles_postback_results_lack_county_to_district_contract :: Reviewed 2026-06-23 one new live official DESE bridge audit plus the current blocker artifacts. The public URL https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238 is not the real result surface; it only emits a hidden-field passForm that auto-posts __VIEWSTATE, __EVENTVALIDATION, orgType=5,12, and leftNavId=11238 into /search/search.aspx. Replaying that exact hidden-field POST does render real district rows with superintendent contacts, addresses, phones, and grades served, but the final page still preserves no county column, county filter, or county export contract. County words only appear inside district names such as Bristol County Agricultural, not as a routing key. Massachusetts therefore still lacks county-grade education routing evidence even though the official DESE postback bridge is real.
- county_local_disability_resources: live_dds_locations_and_interactive_map_without_county_contract :: Reviewed 2026-06-23 bounded browser checks on the live Massachusetts DDS first-party lane. The org page at https://www.mass.gov/orgs/department-of-developmental-services now renders normally and links exact child surfaces, including `Contact a DDS Area Office`, `Find Your Regional and Area Office`, and `/orgs/department-of-developmental-services/locations`. The old guessed page https://www.mass.gov/info-details/dds-area-offices is not a host-403 lane after all; it is a real 404 `We can't find that page`. The live locations index at https://www.mass.gov/orgs/department-of-developmental-services/locations renders 28 results, including named leaves such as DDS Berkshire Area Office, DDS Brockton Area Office, DDS Cape Cod/Islands Area Office, DDS Central Middlesex Area Office, DDS Fall River Area Office, and DDS Franklin/Hampshire Area Office with office addresses. The live interactive map page at https://www.mass.gov/info-details/interactive-dds-regional-map also renders and explicitly says it is used to find which DDS Regional Office and Area Office serves your town or city, but the rendered HTML still preserves no county names, no machine-readable town list, and no county-to-office export contract. Massachusetts therefore still lacks county-grade local routing proof in the low-token lane, but the blocker is now correctly narrowed to a live town/city DDS mapping surface without a reusable county contract.

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
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_dds_locations_and_interactive_map_without_county_contract; samples=4; first=https://www.mass.gov/orgs/department-of-developmental-services

## Next actions

- [critical] district_or_county_education_routing: use_massachusetts_dese_postback_packet_and_hold_blocked_until_official_county_to_district_contract_exists
- [critical] county_local_disability_resources: use_live_massachusetts_dds_locations_and_interactive_map_for_browser_or_cached_town_to_office_capture_only

## Completion decision

- Massachusetts remains BLOCKED and index_safe=false.
- Education is still blocked because the reviewed DESE postback bridge exposes district result rows but still no county-to-district routing contract.
- County-local is now more specific: the DDS org page, locations index, and interactive map are live, but the lane still stops at town-or-city routing and office leaves without a county export or machine-readable local contract.
