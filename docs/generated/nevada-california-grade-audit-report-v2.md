# Nevada California-Grade County Office Packet v3

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
- county_local_disability_resources: blocked_partial_county_bearing_program_offices_page_without_full_contract (Reviewed 2026-06-23 bounded live probes on the official Nevada DSS contact family more tightly. The live Contact, Welfare District Offices-North, and Welfare District Offices-South pages still expose exact office leaves with real addresses and phones but no county-served labels, county filter, or county assignment. However, the sibling official `Program Offices` page does preserve some county-named local partners such as Churchill County Social Services, Douglas County Social Services, Elko County Human & Social Services, Eureka County Social Services, Lincoln County Community Connection, Lyon County Human Services, Nye County Health & Human Services, Pershing County Senior Center, and White Pine County Social Services. That improves the packet because Nevada does have partial official county-bearing local resource evidence on the same host, but it still does not produce a complete 17-county welfare-office or county-to-office routing contract.)

## Failure ledger

- county_local_disability_resources: official_program_offices_page_adds_partial_county_partners_but_no_full_county_to_welfare_contract :: Reviewed 2026-06-23 bounded live probes on the official Nevada DSS welfare-office stack and one sibling official contact page. The live Contact hub plus `Welfare District Offices-North` and `Welfare District Offices-South` pages remain exact office leaves with real addresses and phones but zero county-served labels, zero county filter, and no county assignment. A fresh bounded probe on the sibling official page https://www.dss.nv.gov/contact/program-offices/ showed that Nevada DSS does expose some county-named local partners on the same host, including Churchill County Social Services, Douglas County Social Services, Elko County Human & Social Services, Eureka County Social Services, Lincoln County Community Connection, Lyon County Human Services, Nye County Health & Human Services, Pershing County Senior Center, and White Pine County Social Services, along with Carson City and other locality-specific partners. But the page still does not provide a complete 17-county county-to-office or county-to-welfare-office contract: a bounded county-coverage check found only 11 of Nevada’s 17 county-equivalent names on the page, leaving Clark, Esmeralda, Humboldt, Lander, Storey, and Washoe without a county-named contract there. Nevada therefore remains blocked, but the blocker is now precisely a partial county-bearing sibling page plus incomplete county coverage rather than zero county signal anywhere on the host.

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
- county_local_disability_resources: blocked_partial_county_bearing_program_offices_page_without_full_contract; samples=5; first=https://www.dss.nv.gov/contact/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_full_17_county_contract_or_county_to_welfare_office_mapping_is_reviewed

## Packetized blocker

- County-local packet saved at `data/generated/nevada_county_local_disability_resources_welfare_office_packet_v1.json`.
- The welfare office pages remain exact office leaves without county-served labels.
- The sibling `Program Offices` page adds partial county-bearing local partners, but it still does not provide a complete 17-county welfare-office or county-to-office routing contract.
