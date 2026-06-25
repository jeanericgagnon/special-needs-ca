# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 85
- county_count: 44
- primary_gap_reason: remaining_idaho_district_roots_and_live_sitemaps_still_materialize_only_wrong_role_or_generic_leaves_without_special_education_routing

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_remaining_live_district_roots_only_materialize_wrong_role_contact_or_title_ix_leaves_after_jefferson_and_oneida_recovery (Reviewed 2026-06-25 one more bounded official Idaho district pass focused on exact same-host leaves for the four remaining district roots. The unresolved remainder is now more specific than generic homepage/sitemap exhaustion. Camas still only materializes a district-owned `Contact Information` leaf with district address and phone. Clark now clearly materializes exact district-owned `Contact Us` and `Title IX` leaves, but they remain wrong-role leaves: `Contact Us` only lists district office staff and superintendent routing, while `Title IX` only links a Title IX policy and repeats generic district accessibility language. Fremont now clearly materializes exact district-owned `Contact Us` and `Title IX-Sexual Harassment` leaves, but they also remain wrong-role leaves: `Contact Us` only preserves district address, phone, and generic resources, while the `Title IX` page collapses back to the same generic contact/resource shell. Shoshone remains live with district-office contacts, principal contacts, and federal-program menu leaves like Title I and Title IX-A for homeless children and youth, but still exposes no reusable district-owned special-education, special-services, student-services, 504, or procedural-safeguards leaf. Idaho therefore remains blocked on a smaller but better-defined education remainder: the surviving district-owned leaves are real, but they are the wrong role for special-education routing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract (The Idaho DHW office lane remains an explicit split, not a generic local-office blocker. The live official office root and sitemap still expose no county terms or county-served fields, so they do not prove county-grade routing by themselves. But the existing deterministic office packet safely materializes 17 clean county-to-exact-office leaf matches plus one Canyon split, while 27 counties remain blocked on the dead legacy locator because no public county-to-office contract exists for them.)

## Failure ledger

- district_or_county_education_routing: remaining_live_idaho_district_roots_materialize_contact_or_title_ix_leaves_but_zero_role_bearing_special_education_or_student_services_routing :: Reviewed 2026-06-25 bounded official Idaho district-root checks on `https://www.camascountyschools.org/`, `https://www.camascountyschools.org/contact-information`, `https://www.clarkcountyschools161.org/`, `https://www.clarkcountyschools161.org/about-us/contact-us-ccsd`, `https://www.clarkcountyschools161.org/administration/title-ix`, `https://www.sd215.net/`, `https://www.sd215.net/page/contact-us`, `https://www.sd215.net/o/sd215/page/title-ix`, `https://shoshonesd.org/`, and the previously reviewed Jefferson and Oneida recovery sources. Jefferson remains positively recovered from district-owned `special-education`, `special-services`, `section-504`, and `student-services` leaves. Oneida remains positively recovered from the district-owned Child Find PDF. But the residual four districts now finalize as wrong-role survivors rather than unknown roots: Camas only exposes a district-owned `Contact Information` leaf with address and phone; Clark exposes exact district-owned `Contact Us` and `Title IX` leaves, but no special-education or student-services routing; Fremont exposes exact district-owned `Contact Us` and `Title IX-Sexual Harassment` leaves, but no special-education or student-services routing; and Shoshone exposes district-office contacts plus federal-program leaves like Title I and Title IX-A for homeless children and youth, but no special-education, special-services, student-services, 504, or procedural-safeguards leaf. Idaho therefore remains blocked because the remaining district-owned leaves are still the wrong role for local special-education routing.
- county_local_disability_resources: official_dhw_office_stack_supports_17_clean_leaf_matches_but_27_legacy_counties_still_lack_public_contract :: Reviewed 2026-06-23 bounded live Idaho DHW confirmation on the official root plus the existing office-leaf packet. The public root at https://healthandwelfare.idaho.gov/offices is live with title `Find a Service Location` and still preserves exact city office cards like Caldwell Office in HTML, but it exposes zero county terms or county-served fields. The exact office leaf https://healthandwelfare.idaho.gov/dhw/caldwell-office is live with title `Caldwell Office`, confirming that the packet is grounded in real reviewable DHW office leaves. Idaho county-local routing therefore splits cleanly into 17 safe county-to-exact-office replacements plus one Canyon split that still rejects Nampa as SWITC-only, while 27 counties remain blocked because the public DHW stack still exposes no truthful county-to-office contract for them.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_remaining_live_district_roots_only_materialize_wrong_role_contact_or_title_ix_leaves_after_jefferson_and_oneida_recovery; samples=37; first=https://5il.co/26a73
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract; samples=4; first=https://healthandwelfare.idaho.gov/offices

## Next actions

- [critical] district_or_county_education_routing: continue_exact_district_leaf_expansion_only_when_camas_clark_fremont_or_shoshone_publish_role_bearing_special_education_special_services_student_services_504_or_procedural_safeguards_leaves
- [critical] county_local_disability_resources: retain_17_clean_exact_office_replacements_keep_canyon_split_explicit_and_leave_27_legacy_counties_blocked_until_idaho_publishes_county_contract

## Completion decision

- Idaho remains BLOCKED and not index-safe.
- County-local remains explicitly split between the existing clean exact-office replacements and the legacy counties that still lack a public county contract.
- Education remains the highest blocker, but the residual live districts are now narrowed to exact wrong-role leaves rather than generic unknown roots.
