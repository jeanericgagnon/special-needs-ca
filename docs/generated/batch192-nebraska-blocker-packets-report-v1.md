# Nebraska California-Grade Truth Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 93
- primary_gap_reason: live_nde_host_without_county_or_esu_contract_and_public_office_layer_only_37_counties

## Family status

- medicaid_state_health_coverage: verified_state_grade (Live Nebraska DHHS Medicaid eligibility and overview leaves now provide the statewide application, eligibility, and coverage path on the real official domain.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Live Nebraska DHHS waiver-eligibility evidence now replaces the dead legacy waiver root.)
- developmental_disability_idd_authority: verified_state_grade (Live Nebraska DHHS Developmental Disabilities and waiver-eligibility leaves now prove the statewide DD authority and appeals path on the reviewed official domain.)
- early_intervention_part_c: verified_state_grade (The official Nebraska Early Development Network site now provides a live statewide Part C route with referral, eligibility, service-coordination, and planning-region navigation.)
- special_education_idea_part_b: verified_state_grade (Live Nebraska Department of Education special-education, complaint, mediation, and due-process leaves now replace the stale generic home-page packet sample.)
- district_or_county_education_routing: blocked_live_nde_host_without_county_or_esu_contract (Reviewed 2026-06-23 bounded browser-style probes on the live official NDE host. The Special Education page and Contact Us / SPED Staff Directory page are publicly reachable again and now preserve one additional exact official leaf: `SPED Contact List-Directory by Topic` on the NDE domain. But that directory is still statewide by staff topic rather than county-to-ESU or county-to-district routing, and the only clearly local-looking outbound program page remains the single ESU 9 Deaf or Hard of Hearing page. No reviewed district-owned, ESU-wide, or county-mapped education-routing surface is preserved on disk yet.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Live Nebraska VR now provides the statewide vocational-rehabilitation route on the correct official subdomain.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Rights Nebraska evidence explicitly proves the statewide P&A role.)
- parent_training_information_center: verified_state_grade (Reviewed first-party PTI Nebraska evidence explicitly states that it has served as Nebraska’s Parent Training and Information Center since 2001 and that Nebraska has one federally funded Parent Center.)
- legal_aid: verified_state_grade (Reviewed first-party Legal Aid of Nebraska evidence now provides a real statewide civil legal-aid route.)
- able_program: verified_state_grade (Statewide evidence is present at the required authority level.)
- ssi_ssa_federal_reference: verified_state_grade (Statewide evidence is present at the required authority level.)
- county_local_disability_resources: blocked_public_office_layer_only_37_counties (Reviewed 2026-06-23 the official Nebraska Public Office Location ExperienceBuilder config and backing web map directly. The public app data is open and points to the official web map plus a public office feature layer, but that layer contains only 42 office rows and 37 distinct USER_County values while Nebraska has 93 counties. The county-boundary layer carries only county geometry fields and no county-to-office assignment. Nebraska therefore still lacks a reviewed official service-area contract for the remaining counties.)

## Failure ledger

- district_or_county_education_routing: live_nde_host_accessible_but_no_county_or_esu_routing_contract_reviewed :: Reviewed 2026-06-23 bounded browser-style probes on the live official NDE Special Education and SPED staff-directory pages. The host is publicly reachable and now exposes one more exact official leaf at https://www.education.ne.gov/wp-content/uploads/2025/11/SPED-Calling-Tree-January-2026.pdf titled `SPED Contact List-Directory by Topic`, plus the previously reviewed ESU 9 Deaf or Hard of Hearing program page. However, the topic directory is statewide by staff function and does not publish county-to-ESU assignments, district-owned special-education routing, or an ESU service-area contract. The ESU 9 page is still only one regional program page, not a statewide local-routing contract. Nebraska therefore remains blocked because the live NDE SPED lane still lacks reviewed county-mapped education routing despite the now-live official leaves.
- county_local_disability_resources: official_public_office_experiencebuilder_config_opens_but_public_layer_only_covers_37_counties :: Reviewed 2026-06-23 the official Nebraska Public Office Location ExperienceBuilder config and backing web map directly. The public app data is open and points to the official web map plus a public office feature layer, but that layer contains only 42 office rows and 37 distinct USER_County values while Nebraska has 93 counties. The county-boundary layer carries only county geometry fields and no county-to-office assignment. Nebraska therefore still lacks a reviewed official service-area contract for the remaining counties.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://dhhs.ne.gov/Pages/Medicaid-Eligibility.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhhs.ne.gov/Pages/DD-Eligibility.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://dhhs.ne.gov/Pages/Developmental-Disabilities.aspx
- early_intervention_part_c: verified_state_grade; samples=1; first=https://edn.ne.gov/cms/
- special_education_idea_part_b: verified_state_grade; samples=4; first=https://www.education.ne.gov/sped/
- district_or_county_education_routing: blocked_live_nde_host_without_county_or_esu_contract; samples=4; first=https://www.education.ne.gov/sped/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://vr.nebraska.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsnebraska.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://pti-nebraska.org/about/
- legal_aid: verified_state_grade; samples=1; first=https://legalaidofnebraska.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_public_office_layer_only_37_counties; samples=4; first=https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_live_official_county_to_esu_or_district_contract_is_reviewed
- [critical] county_local_disability_resources: hold_blocked_until_official_service_area_or_full_county_office_contract_is_reviewed

## Completion decision

- Nebraska remains `BLOCKED` and `index_safe=false`.
- Education remains blocked because the live NDE SPED host now preserves deeper official leaves, including a topic directory PDF, but still no reviewed county-to-ESU or district-owned routing contract.
- County/local disability resources remain blocked because the open official DHHS office app config still proves the public office layer only names 37 counties and the county boundary layer has no office-assignment fields for the remaining counties.

