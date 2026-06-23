# Nevada California-Grade Welfare Office Blocker Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 17
- primary_gap_reason: live_welfare_office_pages_without_county_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (the official Nevada School and District Information page enumerates all 17 county school district websites, and bounded live probes confirmed each listed district-owned homepage is reachable)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party NDALC evidence explicitly identifies Nevada’s federally mandated protection and advocacy system)
- parent_training_information_center: verified_state_grade (reviewed first-party Nevada PEP evidence preserves statewide family support, training, and Department of Education-backed services)
- legal_aid: verified_state_grade (reviewed first-party NDALC evidence preserves statewide disability legal-rights routing through the Nevada Disability Advocacy and Law Center)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_welfare_office_pages_without_county_contract (Reviewed 2026-06-23 bounded live probes on the official Nevada DSS contact stack. The DSS contact hub now preserves exact Welfare District Offices-North and Welfare District Offices-South leaves with real office addresses, phones, fax numbers, and reschedule lines, but the reviewed pages label offices by city or district name only and do not map counties served. Nevada therefore still lacks a reviewed official county-to-office routing contract for all 17 counties.)

## Failure ledger

- county_local_disability_resources: official_welfare_district_office_pages_live_but_no_county_coverage_contract :: Reviewed 2026-06-23 bounded live probes on the official Nevada DSS contact stack. The DSS contact hub now preserves exact Welfare District Offices-North and Welfare District Offices-South leaves with real office addresses, phones, fax numbers, and reschedule lines, but the reviewed pages label offices by city or district name only and do not map counties served. Nevada therefore still lacks a reviewed official county-to-office routing contract for all 17 counties.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://adsd.nv.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.nevada.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.nevada.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://doe.nv.gov/Special_Education/
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://doe.nv.gov/school-and-district-information
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://adsd.nv.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://ndalc.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://nvpep.org/
- legal_aid: verified_state_grade; samples=1; first=https://ndalc.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_welfare_office_pages_without_county_contract; samples=4; first=https://dhhs.nv.gov/locations

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_county_to_welfare_office_contract_is_reviewed

## Completion decision

- Nevada remains `BLOCKED` and `index_safe=false`.
- The old stale-locator explanation has been replaced with live official Nevada DSS evidence.
- Nevada education routing remains cleared because the official School and District Information page still enumerates all 17 county district websites and the bounded district homepage probes already passed.
- County/local disability resources remain blocked because the official DSS contact stack now exposes exact North/South welfare office pages with real office details, but those leaves still do not preserve a county-to-office contract for all 17 counties.
