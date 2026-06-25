# Massachusetts California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 14
- primary_gap_reason: official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved

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
- county_local_disability_resources: blocked_dds_locality_capture_covers_13_of_14_counties_but_suffolk_unresolved (Massachusetts county-local routing remains blocked, but the remaining gap is now precise. The live Mass.gov DDS locations lane preserves 21 reviewed area-office cards with explicit `This area office serves the following towns and communities:` text, and the saved town-to-county bridge already clears 13 of 14 counties from official browser-readable locality evidence. Suffolk County is still unresolved because bounded Boston, Chelsea, Revere, Winthrop, and Charlestown scans on the same official lane do not preserve a Suffolk-serving town/community contract, and a fresh 2026-06-25 raw recheck to the exact `/locations` endpoint still returns the same HTTP 403 `Not allowed` shell instead of a replayable county export.)

## Failure ledger

- county_local_disability_resources: reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_official_locality_contract_missing :: Reviewed 2026-06-25 the live Massachusetts DDS first-party locations lane plus the saved bounded locality-capture audit, then rechecked the exact `/locations` endpoint again from the low-token raw lane. The public locations pages preserve 21 distinct `DDS ... Area Office` cards with explicit `This area office serves the following towns and communities:` text, and the reviewed town-to-county bridge already clears 13 of 14 counties from official browser-readable locality evidence. The remaining gap is Suffolk County: bounded Boston, Chelsea, Revere, Winthrop, and Charlestown scans on the same official lane still do not preserve a Suffolk-serving town/community contract, while a fresh 2026-06-25 raw probe to `https://www.mass.gov/orgs/department-of-developmental-services/locations` still returns the same HTTP 403 `Not allowed` shell and therefore cannot supply a replayable county export. Massachusetts should stay blocked until an official Suffolk-serving DDS locality contract, county field, or county-grade export is preserved.

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
- county_local_disability_resources: blocked_dds_locality_capture_covers_13_of_14_counties_but_suffolk_unresolved; samples=4; first=https://www.mass.gov/orgs/department-of-developmental-services

## Next actions

- [critical] county_local_disability_resources: hold_massachusetts_dds_until_suffolk_locality_contract_exists

## Completion decision

- Massachusetts remains BLOCKED and index_safe=false.
- Education is still blocked because the reviewed DESE postback bridge exposes district result rows but still no county-to-district routing contract.
- County-local is now more specific: the DDS org page, locations index, and interactive map are live, but the lane still stops at town-or-city routing and office leaves without a county export or machine-readable local contract.
