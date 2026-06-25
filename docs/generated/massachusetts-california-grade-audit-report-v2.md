# Massachusetts California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 14
- primary_gap_reason: official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_but_live_dds_browser_lane_without_raw_county_contract_remains

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Massachusetts education now clears county-grade routing from reviewed official structured evidence. The live DESE district export at `search_export.aspx` returns a real `search.xls` attachment with district rows that preserve `Org Name`, `Org Type`, `Function`, `Contact Name`, `Address 1`, `Town`, `State`, `Zip`, `Phone`, and `Grade` fields. A bounded exact-basename join from the export `Town` field into the official Census TIGERweb Massachusetts county-subdivision layer matched 406 rows directly and still covered all 14 Massachusetts counties, so county-grade district routing is now preserved by reviewed official export-plus-crosswalk evidence rather than a statewide fallback.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed Disability Law Center first-party homepage explicitly preserves Massachusetts Protection and Advocacy identification.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Massachusetts Legal Assistance Corporation first-party homepage preserves a statewide low-income legal-information, advice, and representation mission.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_dds_browser_lane_without_raw_county_contract (Massachusetts county-local routing remains blocked. The live Mass.gov DDS org page, locations index, and interactive regional map are real first-party surfaces, but the low-token raw lane still does not preserve any county field, county export, or machine-readable town-to-office contract that can be replayed directly from disk. Until an official county contract or a reviewed browser/cached locality capture is preserved, county-local rows must remain blocked.)

## Failure ledger

- county_local_disability_resources: live_dds_browser_lane_exists_but_exact_raw_pages_403_and_no_county_crosswalk_exists :: Reviewed 2026-06-23 bounded browser checks on the live Massachusetts DDS first-party lane and one final bounded exact raw check on https://www.mass.gov/orgs/department-of-developmental-services/locations plus https://www.mass.gov/info-details/interactive-dds-regional-map. The org page, locations index, and interactive map had already been proven browser-readable, and the reviewed evidence already showed named area offices plus a town-or-city lookup purpose but no county export or machine-readable county bridge. The final exact raw fetch recheck now tightens the low-token lane boundary further: both the live locations index and the interactive map returned HTTP 403 in the raw fetch lane, so low-token scraping still cannot recover a reusable county crosswalk directly from those pages. Massachusetts therefore still lacks county-grade local routing proof in the low-token lane and should stay blocked unless a county-grade export, county field, or reviewed browser/cached locality capture appears.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.mass.gov/masshealth
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.mass.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.doe.mass.edu/sped/
- district_or_county_education_routing: verified_county_grade; samples=4; first=https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.mass.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.dlc-ma.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://fcsn.org/
- legal_aid: verified_state_grade; samples=1; first=https://mlac.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_dds_browser_lane_without_raw_county_contract; samples=4; first=https://www.mass.gov/orgs/department-of-developmental-services

## Next actions

- [critical] county_local_disability_resources: hold_massachusetts_dds_until_county_crosswalk_or_reviewed_browser_capture_exists

## Completion decision

- Massachusetts remains BLOCKED and index_safe=false.
- Education is no longer a blocker: the official DESE district export plus the official Census TIGERweb county subdivision layer now preserves county-grade district routing across all 14 Massachusetts counties.
- County-local remains blocked because the live DDS locations and interactive-map lane still preserves no raw county field, county export, or machine-readable locality contract in the low-token path.
- Future Massachusetts work should focus only on the DDS county-local lane unless a new official county-grade education contract supersedes the export-plus-crosswalk method.
