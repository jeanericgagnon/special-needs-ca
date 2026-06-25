# North Dakota Blocker Packets v3

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 53
- primary_gap_reason: public_dpi_surfaces_expose_statewide_special_education_and_district_inventory_but_zero_public_county_or_district_special_education_routing_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_public_dpi_without_public_county_or_district_special_education_routing_contract (Reviewed 2026-06-25 bounded first-party North Dakota education surfaces. The live NDDPI Special Education page remains a statewide IDEA guidance hub with dispute-resolution manuals, forms, and transition resources, but it does not publish a county-to-district crosswalk, district-owned special-education contacts, or a district special-education routing directory for families. The live NDDPI List of Districts with NCES Categories page is a public district inventory for teacher-loan-forgiveness eligibility and links a district NCES PDF, but the published page still exposes no county field and no special-education routing contract. North Dakota therefore still lacks a public county-grade or district-owned special-education routing contract on the official DPI host family.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party NDP&A evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: verified_state_grade (reviewed first-party Pathfinder evidence preserves statewide nonprofit scope and explicit Parent Training and Information (PTI) identity)
- legal_aid: verified_state_grade (reviewed first-party Legal Services of North Dakota evidence now preserves statewide legal-aid scope on the live organization domain)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (reviewed official North Dakota HHS Human Service Zone county routing and zone detail pages now provide first-party county-to-local-office evidence)

## Failure ledger

- district_or_county_education_routing: public_dpi_special_education_and_district_inventory_expose_no_public_county_or_district_special_education_routing_contract :: Reviewed 2026-06-25 bounded first-party North Dakota education surfaces. The live NDDPI Special Education page remains a statewide IDEA guidance hub with dispute-resolution manuals, forms, and transition resources, but it does not publish a county-to-district crosswalk, district-owned special-education contacts, or a district special-education routing directory for families. The live NDDPI List of Districts with NCES Categories page is a public district inventory for teacher-loan-forgiveness eligibility and links a district NCES PDF, but the published page still exposes no county field and no special-education routing contract. North Dakota therefore still lacks a public county-grade or district-owned special-education routing contract on the official DPI host family.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hhs.nd.gov/dd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.north-dakota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.north-dakota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.nd.gov/
- district_or_county_education_routing: blocked_public_dpi_without_public_county_or_district_special_education_routing_contract; samples=3; first=https://www.nd.gov/dpi/education-programs/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.hhs.nd.gov/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.ndpanda.org/home
- parent_training_information_center: verified_state_grade; samples=1; first=https://pathfinder-nd.org/
- legal_aid: verified_state_grade; samples=2; first=https://lsnd.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=4; first=https://www.hhs.nd.gov/service-locations/human-service/zones

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_public_dpi_or_district_owned_special_education_surface_exposes_county_or_district_routing

## Completion decision

- North Dakota remains `BLOCKED` and `index_safe=false`.
- `county_local_disability_resources` is now cleared with official HHS Human Service Zone county routing and zone detail pages on the live state host.
- `legal_aid` is now cleared with current first-party Legal Services of North Dakota statewide legal-aid scope evidence.
- `district_or_county_education_routing` is the sole remaining critical blocker because the live DPI public surfaces still expose only statewide special-education guidance and district inventory rather than county-grade or district-owned special-education routing contracts.
