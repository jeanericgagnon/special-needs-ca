# Indiana California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 92
- primary_gap_reason: official_special_education_contact_list_link_410_and_school_directory_not_role_specific

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_contact_list_gone_generic_directory_insufficient (Reviewed current official Indiana DOE special-education and data-center pages. The special-education page still advertises a Special Education Director and Local Administrator Contact List that now resolves to a dead Google Sheets target, while the live 2025-2026 Indiana School Directory artifact on the data-center page is a generic school/corporation directory rather than a special-education routing source.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed authoritative Parent Center Hub Indiana state leaf plus current INSOURCE first-party pages now preserve both the PTI designation and statewide Indiana family-support routing.)
- legal_aid: verified_state_grade (Indiana Legal Services now provides reviewed statewide first-party legal-aid routing from a live homepage.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed current official Indiana DFR county-map page now preserves county-by-county office details directly in the fetched HTML for all 92 counties. Although the embedded county href paths currently 404, the live official county-map surface itself contains the address, phone, office hours, and zip-routing details needed for county-grade local-office proof.)

## Failure ledger

- district_or_county_education_routing: official_special_education_contact_list_link_410_and_school_directory_not_role_specific :: Reviewed 2026-06-22 official Indiana DOE Special Education and Data Center pages. The page still links a Special Education Director and Local Administrator Contact List at https://docs.google.com/spreadsheets/d/1hRtp2zsG3WtdCf2ma69awNDkxTc65jLn/edit#gid=1314039117, but that target now returns HTTP 410 Gone. The live 2025-2026 Indiana School Directory XLSX linked from the data-center page is a generic school/corporation directory and does not itself preserve special-education routing or local special-education contacts.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.in.gov/fssa/ddrs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.indiana.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.indiana.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.in.gov/doe/students/special-education/
- district_or_county_education_routing: blocked_official_contact_list_gone_generic_directory_insufficient; samples=3; first=https://www.in.gov/doe/students/special-education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.in.gov/fssa/ddrs
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.in.gov/idr/
- parent_training_information_center: verified_state_grade; samples=3; first=https://www.parentcenterhub.org/findurcenter/indiana/
- legal_aid: verified_state_grade; samples=1; first=https://www.indianalegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=3; first=https://www.in.gov/fssa/dfr/ebt-hoosier-works-card/find-my-local-dfr-office/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_district_grade_special_education_contact_source_replaces_dead_google_sheet

## Completion decision

- Parent training information center is now repaired: Parent Center Hub’s Indiana state leaf explicitly identifies IN*SOURCE as the Indiana PTI, and current INSOURCE first-party pages still preserve statewide Indiana special-education training and contact routing.
- County/local disability resources are now repaired from the live official Indiana DFR county-map surface because the fetched HTML itself embeds county-by-county office details, office hours, phone, and ZIP routing for all 92 counties.
- Indiana still cannot reach California-grade or become index-safe because district-or-county education routing remains unresolved: the advertised Special Education Director and Local Administrator Contact List now resolves to a dead Google Sheets target, and the live Indiana School Directory artifact is generic school/corporation metadata rather than special-education routing proof.
- Indiana therefore remains BLOCKED and not index-safe until a reviewed district-grade education routing source replaces the dead contact-list lane.
