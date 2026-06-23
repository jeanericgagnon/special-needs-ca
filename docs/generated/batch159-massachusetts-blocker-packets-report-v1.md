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
- district_or_county_education_routing: blocked_official_dese_postback_results_without_county_mapping (Massachusetts education remains blocked because the official DESE Profiles POST bridge is real but still does not produce any county-keyed routing contract. All 14 county rows still point at one statewide DESE fallback, so the next lane is evidence-only until an official county-to-district export or filter exists.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed Disability Law Center first-party homepage explicitly preserves Massachusetts Protection and Advocacy identification.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Massachusetts Legal Assistance Corporation first-party homepage preserves a statewide low-income legal-information, advice, and representation mission.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_mass_gov_dds_lane_host_wide_403_without_county_grade_capture (Massachusetts county-local routing remains blocked because the likely official DDS lane is host-wide 403 in the low-token runtime, while the current county_offices inventory is only a mix of 8 dead legacy storefront placeholders and 7 DOI mirrors. The next lane is browser-or-cached host capture only, not generic discovery.)

## Failure ledger

- district_or_county_education_routing: official_dese_profiles_postback_results_lack_county_to_district_contract :: Reviewed 2026-06-22 current Massachusetts DESE blocker artifacts plus the live school_districts DB rows. All 14 Massachusetts county education rows still point at the same statewide DESE fallback https://www.doe.mass.edu/sped/. The official DESE Profiles bridge does return real district result rows with district names, superintendent contacts, addresses, phones, and grades, but the reviewed result surface still exposes no county column, county filter, or county-to-district export contract. Massachusetts therefore still lacks county-grade education routing evidence, but the next lane can now work from a deterministic postback packet instead of a generic blocker note.
- county_local_disability_resources: mass_gov_dds_org_area_office_and_sitemap_return_403 :: Reviewed 2026-06-22 current Massachusetts DDS blocker artifacts plus the live county_offices DB rows. Bounded low-token fetches to the Mass.gov DDS org page, the DDS area-offices page, and the Mass.gov sitemap all returned HTTP 403, which means the likely official county-local lane is blocked at the host level in the current runtime. A live DB reconciliation shows the county_offices table still contains only 8 dead legacy storefront placeholders rooted at https://dhhs.massachusetts.gov/locations and 7 DOI mirror rows, with Suffolk County duplicated across Charlestown and Chelsea enrollment center guesses. Massachusetts therefore still lacks a reviewed county-grade local office contract, but the next lane can now work from a deterministic host-403 packet instead of an open-ended browser-assisted note.

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
- county_local_disability_resources: blocked_mass_gov_dds_lane_host_wide_403_without_county_grade_capture; samples=3; first=https://www.mass.gov/orgs/department-of-developmental-services

## Next actions

- [critical] district_or_county_education_routing: use_massachusetts_dese_postback_packet_and_hold_blocked_until_official_county_to_district_contract_exists
- [critical] county_local_disability_resources: use_massachusetts_dds_host403_packet_for_browser_or_cached_capture_only

## Completion decision

- Massachusetts remains BLOCKED and index_safe=false.
- Education is still blocked because the DESE Profiles result surface is real but not county-keyed, and the next lane now has an explicit postback packet instead of a generic hold note.
- County-local is still blocked because the Mass.gov DDS lane is host-wide 403 in the low-token runtime, and the next lane now has an explicit host-403 packet instead of an open-ended browser-assisted note.

