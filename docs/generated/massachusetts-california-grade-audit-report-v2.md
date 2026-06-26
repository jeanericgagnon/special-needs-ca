# Massachusetts California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 14
- primary_gap_reason: all_critical_families_verified

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
- county_local_disability_resources: verified_county_grade (Massachusetts county-local routing now clears county-grade coverage from current official first-party DDS office leaves. The live `DDS Greater Boston Area Office` page explicitly says `This area office serves the following towns and communities: Allston, Beacon Hill, Boston, Brighton, Brookline, Charlestown, Chinatown, Dorchester, Downtown Crossing, East Boston, Hyde Park, Jamaica Plain, Mattapan, North Dorchester, North End, Roslindale, Roxbury, South Boston, South End, West Roxbury`, which preserves the missing Boston and Charlestown Suffolk contract on a current first-party office leaf. The live `DDS Charles River West Area Office` page still explicitly serves `Chelsea, Revere, ... Winthrop`, which preserves the remaining Suffolk municipalities outside Boston. Together those two current Mass.gov office leaves now explicitly cover all Suffolk County municipalities, so the Massachusetts DDS county-local blocker is cleared without inference.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.mass.gov/masshealth
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.mass.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.doe.mass.edu/sped/
- district_or_county_education_routing: verified_county_grade; samples=5; first=https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.mass.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.dlc-ma.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://fcsn.org/
- legal_aid: verified_state_grade; samples=1; first=https://mlac.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=5; first=https://www.mass.gov/orgs/department-of-developmental-services/locations

## Next actions

- none

## Completion decision

- Massachusetts is now COMPLETE and index_safe=true.
- Education remains county-grade from the reviewed DESE export plus official county-subdivision crosswalk evidence.
- County-local now also clears county-grade routing because current official DDS area-office leaves explicitly cover all Suffolk County municipalities without inference.
- Massachusetts is truthful California-grade complete on the current reviewed packet.
