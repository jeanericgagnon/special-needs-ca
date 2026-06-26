# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 87
- county_count: 44
- primary_gap_reason: remaining_idaho_camas_and_clark_surfaces_now_reduce_to_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_without_special_education_or_student_services_routing

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_remaining_camas_and_clark_surfaces_only_materialize_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_after_shoshone_recovery (Reviewed 2026-06-25 and rechecked 2026-06-26 one more bounded official Idaho district pass on the residual two-district remainder and tightened both weak-lead lanes. Camas still only materializes a district-owned `Contact Information` leaf with district address and phone, and a fresh same-host link scan on both the root and contact page still surfaces no district-owned `special`, `504`, `student-services`, `child-find`, or procedural-safeguards leaf at all. The only additional non-root artifact still reachable from the reviewed Camas lane is the same district-linked Google Doc, and it still resolves to a board-of-trustees roster rather than special-education, student-services, 504, Child Find, or procedural-safeguards routing. Clark still materially exposes reviewed district-owned `Contact Us`, `Title IX`, `Parent Notification of General Education Instruction`, and `Parent Resources` leaves, but a fresh same-host link scan on the root and Parent Resources leaf still surfaces no role-bearing district-owned special-education or student-services URL. The parent-notification page links district-hosted PDFs whose filenames and prior bounded binary inspection confirmed the same general-education intervention notice lane. The Parent Resources page also links district-hosted `Idaho Child Find` PDFs, but bounded review still only confirms image-only flyer artifacts with no extractable Clark-, Dubois-, phone-, screening-, or district-specific special-education routing evidence. Idaho therefore remains blocked, but the residual education remainder is now sharper than generic wrong-role leaves: the surviving Camas and Clark artifacts are real and public, yet they are still the wrong role or too thin to serve as local special-education routing proof.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract (The Idaho DHW office lane remains an explicit split, not a generic local-office blocker. The live official office root still exposes no county terms or county-served fields, so it does not prove county-grade routing by itself. But the existing deterministic office packet safely materializes 17 clean county-to-exact-office leaf matches plus one Canyon split, while 27 counties remain blocked because no public county-to-office contract exists.)

## Failure ledger

- district_or_county_education_routing: remaining_camas_and_clark_surfaces_materialize_contact_board_roster_title_ix_or_general_education_notice_leaves_but_zero_role_bearing_special_education_or_student_services_routing :: Reviewed 2026-06-25 and rechecked 2026-06-26 bounded official Idaho district-root checks on `https://www.camascountyschools.org/`, `https://www.camascountyschools.org/contact-information`, the district-linked Google Doc exported from `https://docs.google.com/document/d/1OHWebOtQk9Wvwy8zMd5eFYwub5xPQ7Pg_nnMT20hOOA/export?format=txt`, `https://www.clarkcountyschools161.org/`, `https://www.clarkcountyschools161.org/about-us/contact-us-ccsd`, `https://www.clarkcountyschools161.org/administration/title-ix`, `https://www.clarkcountyschools161.org/about-us/parent-notification-of-general-education-instruction`, `https://www.clarkcountyschools161.org/parent-resources`, and the district-hosted PDF attachments linked from those Clark pages. The Camas root stayed live and the Contact Information page still only preserved district address and phone; a fresh same-host href scan across those reviewed Camas pages surfaced no district-owned `special`, `504`, `student-services`, `child-find`, or procedural-safeguards leaf at all. The district-linked Google Doc still exported as a board-of-trustees roster with zone names and trustee names, not special-education or student-services routing. Clark stayed live and still exposed exact district-owned `Contact Us`, `Title IX`, `Parent Notification of General Education Instruction`, and `Parent Resources` leaves. A fresh same-host href scan across the Clark root and Parent Resources page likewise surfaced no district-owned role-bearing `special-education`, `special-services`, `student-services`, or procedural-safeguards URL. The parent-notification page linked district-hosted PDFs whose filenames and prior bounded binary inspection confirmed the same general-education intervention notice lane. The Parent Resources page linked district-hosted `Idaho Child Find` flyers, but bounded review still only confirms image-only PDF artifacts titled `Child Find Flyer 2025-2026 English` and `Child Find Flyer 2025-2026 Spanish` without extractable Clark-, Dubois-, phone-, screening-, or district-specific special-education routing evidence. Idaho therefore remains blocked because the remaining Camas and Clark surfaces are public and reviewable but still the wrong role or too thin for local special-education routing.
- county_local_disability_resources: official_dhw_office_stack_supports_17_clean_leaf_matches_but_27_legacy_counties_still_lack_public_contract :: Reviewed 2026-06-25 and rechecked 2026-06-26 one more bounded live Idaho DHW confirmation on the official office root plus the existing office-leaf packet. The public root at https://healthandwelfare.idaho.gov/offices is still live with title `Find a Service Location` and still preserves exact city office cards like Caldwell Office in HTML, but it still exposes no public county terms, county-served fields, or service-area contract. A fresh bounded content scan on the live root did surface office-inventory labels such as `Boise Office - Westgate Building` and `Grangeville Office - Camas Resource Center`, which confirms the page is richer office inventory rather than a dead shell. But those office-name and resource-center labels still do not bind counties to offices, and the exact office leaf https://healthandwelfare.idaho.gov/dhw/caldwell-office is still live with title `Caldwell Office`, confirming that the packet is grounded in real reviewable DHW office leaves. Idaho county-local routing therefore still splits cleanly into 17 safe county-to-exact-office replacements plus one Canyon split that still rejects Nampa as SWITC-only, while 27 counties remain blocked because the public DHW stack still exposes no truthful county-to-office contract for them.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_remaining_camas_and_clark_surfaces_only_materialize_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_after_shoshone_recovery; samples=41; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract; samples=7; first=https://healthandwelfare.idaho.gov/offices

## Next actions

- [critical] district_or_county_education_routing: continue_exact_district_leaf_expansion_only_when_camas_or_clark_publish_role_bearing_special_education_special_services_student_services_504_child_find_or_procedural_safeguards_leaves_with_local_contact
- [critical] county_local_disability_resources: retain_17_clean_exact_office_replacements_keep_canyon_split_explicit_and_leave_27_legacy_counties_blocked_until_idaho_publishes_county_contract

## Completion decision

- Idaho remains BLOCKED and not index-safe.
- County-local remains explicitly split between the existing clean exact-office replacements and the legacy counties that still lack a public county contract.
- Education is narrower again: the residual remainder is now specifically Camas and Clark wrong-role contact, board-roster, Title IX, general-education-notice, and image-only Child Find flyer lanes rather than any unknown district root.
