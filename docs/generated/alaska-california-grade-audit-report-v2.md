# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: official_dpa_offices_page_names_only_five_regions_and_ten_office_cities_without_borough_or_census_area_coverage

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Official Alaska DEED district-profiles directory and district map pages preserve named district detail leaves with addresses, phones, emails, and superintendent contacts for Alaska local school systems, including borough districts plus REAA routing for unorganized areas.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Law Center of Alaska pages now preserve explicit Protection and Advocacy grant designations, including PADD, PAIMI, PAIR, and related federal P&A authorities on the DLCAK funding page.)
- parent_training_information_center: verified_state_grade (Reviewed authoritative Parent Center Hub Alaska leaf explicitly labels Stone Soup Group as Alaska PTI and preserves statewide Alaska contact evidence, so the PTI family is now verified even though Stone Soup Group’s own first-party pages still emphasize support scope instead of repeating the PTI designation.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_dpa_offices_page_lacks_county_equivalent_mapping (The live official DPA offices page is real, but its rendered contract stops at five broad regional headings and ten office-city leaves. It preserves no borough names, no census-area names, and no county-equivalent coverage table or locator contract, while bounded raw fetches still return HTTP 403 and the DFCS reorg host still exposes only Pioneer Home local leaves rather than Public Assistance routing.)

## Failure ledger

- county_local_disability_resources: official_dpa_offices_page_names_only_five_regions_and_ten_office_cities_without_borough_or_census_area_coverage :: Reviewed 2026-06-23 bounded official Alaska rechecks against the live health host plus narrow official-site searches for borough and census-area terms. The reviewed rendered DPA offices page at `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/` is a real official directory, but its public contract is limited to five broad regional headings (Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, Southwest Alaska) and ten office-city leaves (Homer, Kenai, Fairbanks, Nome, Anchorage, Wasilla, Juneau, Ketchikan, Sitka, Bethel, Kodiak) plus the statewide Virtual Contact Center. The rendered HTML preserves no borough names, no census-area names, and no county-equivalent `counties served` table or locator contract, narrow official-domain searches for borough examples such as Aleutians East Borough, Bethel Census Area, Matanuska-Susitna Borough, and Nome Census Area returned no reviewed DPA office leaf, the DFCS reorg host still exposes only narrow Pioneer Home local leaves rather than Public Assistance routing, and bounded raw fetches of the live DPA offices page still return HTTP 403 even though browser-style rendering exposes the office text.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds/Pages/hcbw/eligibility.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.alaska.gov/sped
- district_or_county_education_routing: verified_state_grade; samples=20; first=https://education.alaska.gov/DOE_Rolodex/DistrictProfiles2000/DistrictProfilesSearch.cfm
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds
- protection_and_advocacy: verified_state_grade; samples=2; first=https://www.dlcak.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/alaska/
- legal_aid: verified_state_grade; samples=1; first=http://www.dlcak.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_dpa_offices_page_lacks_county_equivalent_mapping; samples=11; first=https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_or_an_equivalent_official_county_grade_locator

## Repair decision

- The only remaining Alaska blocker is county/local disability resources.
- This bounded pass improves the blocker materially: Alaska now has a reviewed official DPA offices page on the current health host, so the problem is no longer "no office directory recovered."
- The remaining failure is narrower and more honest: the official DPA offices resource stops at five broad regional headings and ten office-city leaves, preserves no borough or census-area coverage terms, bounded raw fetches of that live page still return HTTP 403 even though browser-style rendering exposes the office text, and the DFCS reorg host still exposes only Pioneer Home local leaves rather than a county-equivalent Public Assistance or disability routing contract.
- Alaska remains BLOCKED and not index-safe until the state publishes borough or census-area to DPA office mapping, or another equivalent official county-grade locator.
