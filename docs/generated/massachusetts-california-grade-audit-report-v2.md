# Massachusetts California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 14
- primary_gap_reason: exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_dds_locations_lane_still_lacks_county_export

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_dese_hidden_replay_without_materialized_local_rows (Massachusetts education is now source-final for the low-token lane with stricter current-state truth. The public `search_link.aspx` surface is still only a hidden-field bridge, but a fresh bounded replay of that exact bridge with its current hidden-field payload no longer materializes district rows at all in this lane. The replay returns the generic `Profiles Search` shell with zero superintendent fields, zero address or telephone fields, and zero county occurrences. Massachusetts therefore still lacks county-grade education routing evidence, and the low-token lane cannot currently even rely on replayed district rows without a reviewed browser/cached capture or a new official county-keyed contract.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed Disability Law Center first-party homepage explicitly preserves Massachusetts Protection and Advocacy identification.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Massachusetts Legal Assistance Corporation first-party homepage preserves a statewide low-income legal-information, advice, and representation mission.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_dds_browser_lane_without_raw_county_contract (Massachusetts county-local routing is now source-final for the low-token raw lane. Prior reviewed browser checks proved the DDS org page, locations index, and interactive regional map are live and town-or-city oriented, but the final bounded exact raw checks against `https://www.mass.gov/orgs/department-of-developmental-services/locations` and `https://www.mass.gov/info-details/interactive-dds-regional-map` returned HTTP 403 in the low-token fetch lane. Combined with the reviewed evidence that those same browser-readable surfaces still expose no county names, no county-served labels, and no machine-readable county crosswalk, the family remains blocked until an official county contract or reviewed browser/cached town-to-office capture appears.)

## Failure ledger

- district_or_county_education_routing: exact_dese_hidden_postback_replay_returns_search_shell_without_local_rows :: Reviewed 2026-06-23 one fresh bounded exact replay of the official Massachusetts DESE hidden bridge at https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238. The bridge still returns HTTP 200 and exposes only three hidden fields (`__VIEWSTATE`, `__VIEWSTATEGENERATOR`, `__EVENTVALIDATION`). Replaying that exact hidden payload into https://profiles.doe.mass.edu/search/search.aspx now returns HTTP 200 only as the generic `Profiles Search` shell, not as rendered district rows. The bounded replay preserved zero `superintendent`, zero `address`, zero `telephone`, zero `grades served`, and zero county occurrences in the returned HTML. Massachusetts therefore cannot currently claim a reusable low-token DESE result surface from the hidden postback replay.
- county_local_disability_resources: live_dds_browser_lane_exists_but_exact_raw_pages_403_and_no_county_crosswalk_exists :: Reviewed 2026-06-23 bounded browser checks on the live Massachusetts DDS first-party lane and one final bounded exact raw check on https://www.mass.gov/orgs/department-of-developmental-services/locations plus https://www.mass.gov/info-details/interactive-dds-regional-map. The org page, locations index, and interactive map had already been proven browser-readable, and the reviewed evidence already showed named area offices plus a town-or-city lookup purpose but no county export or machine-readable county bridge. The final exact raw fetch recheck now tightens the low-token lane boundary further: both the live locations index and the interactive map returned HTTP 403 in the raw fetch lane, so low-token scraping still cannot recover a reusable county crosswalk directly from those pages. Massachusetts therefore still lacks county-grade local routing proof in the low-token lane and should stay blocked unless a county-grade export, county field, or reviewed browser/cached locality capture appears.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.mass.gov/masshealth
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.mass.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.doe.mass.edu/sped/
- district_or_county_education_routing: blocked_exact_dese_hidden_replay_without_materialized_local_rows; samples=3; first=https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.mass.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.dlc-ma.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://fcsn.org/
- legal_aid: verified_state_grade; samples=1; first=https://mlac.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_dds_browser_lane_without_raw_county_contract; samples=4; first=https://www.mass.gov/orgs/department-of-developmental-services

## Next actions

- [critical] district_or_county_education_routing: hold_massachusetts_education_until_official_county_to_district_contract_or_reviewed_browser_capture_exists
- [critical] county_local_disability_resources: hold_massachusetts_dds_until_county_crosswalk_or_reviewed_browser_capture_exists

## Completion decision

- Massachusetts remains BLOCKED and index_safe=false.
- Education is stricter than before: the DESE hidden bridge still exists, but the fresh exact replay now only returns the generic search shell in the low-token lane.
- County-local is still source-final for low-token raw work because the live DDS locations and interactive-map pages remain raw-403 and still expose no county contract.
- Future Massachusetts work should only reopen on an official county contract or on reviewed browser/cached locality capture that can be truthfully bridged to county rows.
