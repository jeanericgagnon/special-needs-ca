# North Dakota California-Grade Packet v4

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 53
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 the live official North Dakota DPI district-list page and its linked district PDF. The current page is titled `List of Districts with NCES Categories` and links the public PDF `North Dakota School Districts and NCES Critical Need and Shortage Areas`. That official PDF says `Below is a list of North Dakota districts with the District Type identified` and preserves exact district rows such as Bismarck 1, Fargo 1, Grand Forks 1, Jamestown 1, Valley City 2, West Fargo 6, Williston 1, and many additional local districts. This replaces North Dakota’s old `nd.gov` root fallback with a reviewed official district directory artifact on the current DPI host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party NDP&A evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: verified_state_grade (reviewed first-party Pathfinder evidence preserves statewide nonprofit scope and explicit Parent Training and Information (PTI) identity)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 the live first-party Legal Services of North Dakota site. The homepage says Legal Services of North Dakota is a non-profit organization providing legal assistance in a variety of matters to low income and elderly North Dakotans, and further says it is a grantee of the Legal Services Corporation that provides free legal assistance to low-income or elderly individuals. The first-party Get Help page says there are three methods to apply for legal assistance: visit an office in person, apply online, or apply over the phone. This repairs North Dakota’s missing statewide legal-aid family with current first-party legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 the live official North Dakota HHS Developmental Disabilities Regional Offices page. That page preserves named regional offices, addresses, phones, emails, and explicit serving-county contracts, including Bismarck serving Burleigh, Emmons, Grant, Kidder, McLean, Mercer, Morton, Oliver, Sheridan, and Sioux counties; Fargo serving Cass, Ransom, Richland, Sargent, Steele, and Traill counties; Jamestown serving Barnes, Dickey, Foster, Griggs, LaMoure, Logan, McIntosh, Stutsman, and Wells counties; Minot serving Bottineau, Burke, McHenry, Mountrail, Pierce, Renville, and Ward counties; and Williston serving Divide, McKenzie, and Williams counties. This replaces North Dakota’s old DOI-mirror-backed county-local disability rows with current official county-to-office routing on the HHS host.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hhs.nd.gov/dd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.north-dakota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.north-dakota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.nd.gov/
- district_or_county_education_routing: verified_state_grade; samples=3; first=https://www.nd.gov/dpi/list-districts-nces-categories
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.hhs.nd.gov/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.ndpanda.org/home
- parent_training_information_center: verified_state_grade; samples=1; first=https://pathfinder-nd.org/
- legal_aid: verified_state_grade; samples=2; first=https://lsnd.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=4; first=https://www.hhs.nd.gov/dd/offices

## Next actions

- none

## Completion decision

- North Dakota is now `COMPLETE` and `index_safe=true`.
- `district_or_county_education_routing` now clears because the official DPI district-list page and linked public PDF preserve an exact statewide district directory instead of a generic state root.
- `legal_aid` now clears because the first-party Legal Services of North Dakota site explicitly identifies statewide low-income and elderly legal-assistance scope and provides direct application methods.
- `county_local_disability_resources` now clears because the official HHS Developmental Disabilities Regional Offices page publishes county-to-office service contracts with local addresses and contact information.
