# Massachusetts California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 14
- primary_gap_reason: exact_dese_hidden_postback_replay_materializes_district_rows_but_zero_county_contract_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_dese_replay_renders_rows_but_zero_county_contract (Massachusetts education is still blocked, but the current low-token truth is narrower than the existing packet says. The official `search_link.aspx` bridge still auto-posts into `search.aspx`, and a fresh exact replay of that hidden payload still materializes real DESE district rows with superintendent contacts and grades-served fields. But those rendered rows still preserve zero county column, zero county filter, zero county-keyed export lane, and no reusable county routing contract. The separate live `get_closest_orgs.aspx` School Finder remains address/city/town based only and still exposes no county label or export lane. Massachusetts therefore still lacks county-grade education routing evidence even though the hidden replay itself is live and productive.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed Disability Law Center first-party homepage explicitly preserves Massachusetts Protection and Advocacy identification.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Massachusetts Legal Assistance Corporation first-party homepage preserves a statewide low-income legal-information, advice, and representation mission.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_dds_browser_lane_without_raw_county_contract (Massachusetts county-local routing is now source-final for the low-token raw lane. Prior reviewed browser checks proved the DDS org page, locations index, and interactive regional map are live and town-or-city oriented, but the final bounded exact raw checks against `https://www.mass.gov/orgs/department-of-developmental-services/locations` and `https://www.mass.gov/info-details/interactive-dds-regional-map` returned HTTP 403 in the low-token fetch lane. Combined with the reviewed evidence that those same browser-readable surfaces still expose no county names, no county-served labels, and no machine-readable county crosswalk, the family remains blocked until an official county contract or reviewed browser/cached town-to-office capture appears.)

## Failure ledger

- district_or_county_education_routing: exact_dese_hidden_postback_replay_renders_real_district_rows_but_zero_county_fields_or_export :: Reviewed 2026-06-25 one exact replay of the live official Massachusetts DESE bridge at https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238. The bridge still returns a real hidden-field auto-post shell, and replaying its current `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, `__EVENTVALIDATION`, `orgType`, `runOrgSearch`, and `leftNavId` payload into https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238 returned HTTP 200 with rendered district rows. The returned HTML now proves the replay is not empty: it contains hundreds of `superintendent` and `grades served` occurrences and real district result content. But the same rendered result page still preserves zero county column, zero county filter, and no county-keyed export contract; the only `county` occurrences are inside district names like county agricultural districts, not as routing fields. A live recheck of https://profiles.doe.mass.edu/search/get_closest_orgs.aspx also still shows a School Finder that is address/city/town based with no county selector or export lane. Massachusetts education therefore remains blocked because the official DESE surfaces still do not expose county-grade routing fields, not because the hidden replay is empty.
- county_local_disability_resources: live_dds_browser_lane_exists_but_exact_raw_pages_403_and_no_county_crosswalk_exists :: Reviewed 2026-06-23 bounded browser checks on the live Massachusetts DDS first-party lane and one final bounded exact raw check on https://www.mass.gov/orgs/department-of-developmental-services/locations plus https://www.mass.gov/info-details/interactive-dds-regional-map. The org page, locations index, and interactive map had already been proven browser-readable, and the reviewed evidence already showed named area offices plus a town-or-city lookup purpose but no county export or machine-readable county bridge. The final exact raw fetch recheck now tightens the low-token lane boundary further: both the live locations index and the interactive map returned HTTP 403 in the raw fetch lane, so low-token scraping still cannot recover a reusable county crosswalk directly from those pages. Massachusetts therefore still lacks county-grade local routing proof in the low-token lane and should stay blocked unless a county-grade export, county field, or reviewed browser/cached locality capture appears.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.mass.gov/masshealth
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.mass.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.doe.mass.edu/sped/
- district_or_county_education_routing: blocked_exact_dese_replay_renders_rows_but_zero_county_contract; samples=4; first=https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.mass.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.dlc-ma.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://fcsn.org/
- legal_aid: verified_state_grade; samples=1; first=https://mlac.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_dds_browser_lane_without_raw_county_contract; samples=4; first=https://www.mass.gov/orgs/department-of-developmental-services

## Next actions

- [critical] district_or_county_education_routing: hold_massachusetts_education_until_official_county_to_district_contract_or_reviewed_county_keyed_capture_exists
- [critical] county_local_disability_resources: hold_massachusetts_dds_until_county_crosswalk_or_reviewed_browser_capture_exists

## Completion decision

- Massachusetts remains BLOCKED and index_safe=false.
- Education is narrower than the prior packet claimed: the hidden DESE replay still renders real district rows, but those rows still do not expose any county-grade routing contract.
- County-local remains source-final for low-token raw work because the live DDS locations and interactive-map pages remain raw-403 and still expose no county contract.
- Future Massachusetts work should only reopen on an official county contract or on reviewed browser/cached locality capture that can be truthfully bridged to county rows.
