# Minnesota California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 87
- primary_gap_reason: official_mde_school_directory_now_only_returns_a_moved_shell_and_mn_dhs_local_office_lanes_are_bot_challenged_or_stale

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_school_directory_moved_shell_without_live_replacement (The old Minnesota school-directory path now returns only a moved shell, and the current packet still falls back to statewide Minnesota special-education evidence instead of preserved district- or county-grade local routing leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page. It explicitly says MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in Minnesota, which is enough to verify the protection_and_advocacy family at statewide grade.)
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (reviewed first-party statewide family-support evidence exists, but the saved artifact does not preserve explicit PTI designation text)
- legal_aid: verified_state_grade (Reviewed Mid-Minnesota Legal Aid preserves a live statewide legal-aid access route on first-party pages.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_mn_dhs_county_and_tribal_office_pages_bot_challenged (The likely official Minnesota county and tribal office pages under mn.gov/dhs now redirect to a Radware Bot Manager challenge instead of returning county-grade office content to bounded low-token fetches.)

## Failure ledger

- district_or_county_education_routing: official_school_directory_moved_shell_without_live_replacement :: The old Minnesota school-directory path now returns only a moved shell, and the current packet still falls back to statewide Minnesota special-education evidence instead of preserved district- or county-grade local routing leaves.
- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed PACER Center evidence preserves Minnesota family-support language, special-education guidance, and direct advocate/help routing, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.
- county_local_disability_resources: minnesota_dhs_county_and_tribal_office_pages_redirect_to_radware_bot_manager :: The likely official Minnesota county and tribal office pages under mn.gov/dhs now redirect to a Radware Bot Manager challenge instead of returning county and tribal office content to bounded low-token fetches.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: blocked_official_school_directory_moved_shell_without_live_replacement; samples=3; first=https://education.mn.gov/MDE/dse/sped/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: verified_state_grade; samples=2; first=https://mylegalaid.org/disability-law-center/
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=1; first=https://www.pacer.org/
- legal_aid: verified_state_grade; samples=1; first=https://mylegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: blocked_mn_dhs_county_and_tribal_office_pages_bot_challenged; samples=3; first=https://mn.gov/dhs/people-we-serve/adults/services/disability-services/

## Next actions

- [critical] district_or_county_education_routing: find_or_capture_live_mde_district_directory_replacement
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source
- [critical] county_local_disability_resources: browser_assisted_capture_of_mn_dhs_county_and_tribal_offices

## Completion decision

- Protection and advocacy is now repaired through the dedicated first-party Minnesota Disability Law Center page, which explicitly preserves the federally designated Protection and Advocacy agency designation.
- Legal aid remains verified through Mid-Minnesota Legal Aid and is no longer carried as a pseudo-blocker in the summary packet.
- Minnesota remains `BLOCKED` and `index_safe=false` because county- or district-grade education routing, explicit PTI designation, and county-local DHS office routing are still unresolved.
