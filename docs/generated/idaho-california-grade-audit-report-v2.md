# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 87
- county_count: 44
- primary_gap_reason: bounded_2026_06_26_live_recheck_still_confirms_camas_and_clark_wrong_role_surfaces_only_and_idaho_dhw_office_inventory_without_county_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_residual_camas_and_clark_hosts_still_publish_only_wrong_role_or_too_thin_local_education_surfaces (Reviewed 2026-06-26 one more bounded live Idaho district pass on the exact residual Camas and Clark hosts. Camas root, `Contact Information`, `All Resources`, `Federal Programs`, and `Advanced Opportunities` all still return HTTP 200 on the district host, while `https://www.camascountyschools.org/sitemap.xml` still returns HTTP 404. The live Camas leaves still remain the wrong role: `Federal Programs` preserves Title I and Title IX program material, and `Advanced Opportunities` preserves accelerated-course guidance. None of the reviewed Camas leaves exposes district-owned special-education, special-services, student-services, 504, Child Find, or procedural-safeguards routing with local contact evidence. Clark root, `Parent Resources`, `Contact Us`, `Title IX`, and `Parent Notification of General Education Instruction` still return HTTP 200 on the district host, while `https://www.clarkcountyschools161.org/sitemap.xml` still returns HTTP 404. The current Clark leaves still bottom out in wrong-role or too-thin routing only: contact information, Title IX, general-education notice, and previously reviewed district-hosted Child Find flyer attachments without district-specific special-education routing evidence. Idaho therefore remains blocked because the last residual district-owned public surfaces are still live but still do not publish role-bearing local special-education routing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract (Reviewed 2026-06-26 one more bounded live Idaho DHW office-contract pass on the exact official office stack. `https://healthandwelfare.idaho.gov/offices`, `https://healthandwelfare.idaho.gov/dhw/caldwell-office`, `/offices?page=0`, `/offices?page=1`, `/offices?page=2`, and `https://healthandwelfare.idaho.gov/sitemap.xml` all still return HTTP 200 on the current official DHW host. The DHW stack is real and reviewable, but it still preserves office inventory only rather than county assignment. The reviewed pages still expose office names and exact office leaves, while the public sitemap still enumerates office URLs only. No reviewed live DHW page or sitemap surface publishes `county served`, `counties served`, `serves`, `service area`, or any county-to-office table or export. Idaho county-local routing therefore still remains an explicit split between the existing safe exact-office replacements and the legacy counties that still lack a public county contract.)

## Failure ledger

- district_or_county_education_routing: remaining_camas_and_clark_surfaces_materialize_contact_board_roster_title_ix_or_general_education_notice_leaves_but_zero_role_bearing_special_education_or_student_services_routing :: Reviewed 2026-06-26 one more bounded live Idaho district pass on the exact residual Camas and Clark hosts. Camas root, `Contact Information`, `All Resources`, `Federal Programs`, and `Advanced Opportunities` all still return HTTP 200 on the district host, while `https://www.camascountyschools.org/sitemap.xml` still returns HTTP 404. The live Camas leaves still remain the wrong role: `Federal Programs` preserves Title I and Title IX program material, and `Advanced Opportunities` preserves accelerated-course guidance. None of the reviewed Camas leaves exposes district-owned special-education, special-services, student-services, 504, Child Find, or procedural-safeguards routing with local contact evidence. Clark root, `Parent Resources`, `Contact Us`, `Title IX`, and `Parent Notification of General Education Instruction` still return HTTP 200 on the district host, while `https://www.clarkcountyschools161.org/sitemap.xml` still returns HTTP 404. The current Clark leaves still bottom out in wrong-role or too-thin routing only: contact information, Title IX, general-education notice, and previously reviewed district-hosted Child Find flyer attachments without district-specific special-education routing evidence. Idaho therefore remains blocked because the last residual district-owned public surfaces are still live but still do not publish role-bearing local special-education routing.
- county_local_disability_resources: official_dhw_office_stack_supports_17_clean_leaf_matches_but_27_legacy_counties_still_lack_public_contract :: Reviewed 2026-06-26 one more bounded live Idaho DHW office-contract pass on the exact official office stack. `https://healthandwelfare.idaho.gov/offices`, `https://healthandwelfare.idaho.gov/dhw/caldwell-office`, `/offices?page=0`, `/offices?page=1`, `/offices?page=2`, and `https://healthandwelfare.idaho.gov/sitemap.xml` all still return HTTP 200 on the current official DHW host. The DHW stack is real and reviewable, but it still preserves office inventory only rather than county assignment. The reviewed pages still expose office names and exact office leaves, while the public sitemap still enumerates office URLs only. No reviewed live DHW page or sitemap surface publishes `county served`, `counties served`, `serves`, `service area`, or any county-to-office table or export. Idaho county-local routing therefore still remains an explicit split between the existing safe exact-office replacements and the legacy counties that still lack a public county contract.

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
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract; samples=5; first=https://healthandwelfare.idaho.gov/offices

## Next actions

- [critical] district_or_county_education_routing: continue_exact_district_leaf_expansion_only_when_camas_or_clark_publish_role_bearing_special_education_special_services_student_services_504_child_find_or_procedural_safeguards_leaves_with_local_contact
- [critical] county_local_disability_resources: retain_17_clean_exact_office_replacements_keep_canyon_split_explicit_and_leave_27_legacy_counties_blocked_until_idaho_publishes_county_contract

## Completion decision

- Idaho remains BLOCKED and not index-safe.
- District-grade routing is still blocked because the last residual Camas and Clark district-owned surfaces are live but still wrong-role or too thin.
- County-local remains blocked because the live Idaho DHW stack is office inventory only and still publishes no county-to-office contract.
