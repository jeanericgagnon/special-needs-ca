# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_now_fail_into_404_or_blank_shell_negative_checks

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade (Idaho education is still blocked, but the reviewed district-owned leaf set is stronger and the remaining gap is now sharper. On 2026-06-24 the live Bear Lake School District root exposed an embedded district-owned `Special Education` page object, and the exact district leaf resolved publicly at `https://www.blsd.net/en-US/special-education-e92c299d` with district-specific special-education text, director contact, and IDEA/FAPE/LRE language. That raises Idaho to thirteen reviewed county-grade district-owned education leaves. A fresh bounded recheck on 2026-06-25 then hardened the remaining county-bearing district roots: Camas and Oneida returned district-branded 404s on likely `special-education`, `special-services`, and `student-services` leaves; Shoshone returned WordPress `Page not found` on the same role-bearing guesses even though the public sitemap stayed live; Fremont preserved a live sitemap but no role-bearing URLs, and likely exact leaf guesses still 404ed; Clark's likely Apptegy page guesses all 404ed into the same `News and Announcements` shell; and Jefferson's sitemap plus likely role-bearing leaf routes collapsed into blank titleless Incapsula-style shells with no reusable education text. So statewide county-grade education routing is still incomplete.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract (The Idaho DHW office lane remains an explicit split, not a generic local-office blocker. The live official office root and sitemap still expose no county terms or county-served fields, so they do not prove county-grade routing by themselves. But the existing deterministic office packet safely materializes 17 clean county-to-exact-office leaf matches plus one Canyon split, while 27 counties remain blocked on the dead legacy locator because no public county-to-office contract exists for them.)

## Failure ledger

- district_or_county_education_routing: reviewed_district_special_services_leaves_hold_at_13_counties_after_live_bear_lake_leaf_and_remaining_county_bearing_roots_now_fail_into_404_or_blank_shell_checks :: Reviewed 2026-06-24 the live official Idaho district root https://www.blsd.net/ and the exact district-owned leaf https://www.blsd.net/en-US/special-education-e92c299d. The Bear Lake root publicly exposes an embedded `Special Education` page object with relative route `/pages/e92c299d-8559-433e-b16e-b40882764e60`, and that route resolves to the public final URL `https://www.blsd.net/en-US/special-education-e92c299d`. The exact leaf returned HTTP 200 with title `Special Education - Bear Lake School District` and visible district-owned text including `Special Education Director Holly Tanner`, `Welcome to Special Education`, and IDEA/FAPE/LRE language about students who meet eligibility requirements. Idaho therefore now holds at thirteen reviewed county-grade district-owned education leaves, not twelve. A bounded official recheck on 2026-06-25 then confirmed the remaining county-bearing roots still fail closed: https://www.camascountyschools.org/page/special-education, /page/special-services, and /page/student-services all returned district-branded 404s; https://www.clarkcountyschools161.org/apps/pages/index.jsp guesses all 404ed into the same `News and Announcements - Clark Co School District 161` shell; https://www.sd215.net/sitemap.xml stayed live but exposed no role-bearing URLs and likely `special-education` or `special-services` leaves 404ed; https://www.jeffersonsd251.org/sitemap.xml and /page/special-education style routes collapsed into blank titleless Incapsula-style shells with no role-bearing text; https://www.oneidaschooldistrict.org/sitemap.xml stayed live but likely role-bearing leaves 404ed; and https://shoshonesd.org/wp-sitemap.xml stayed live while likely `special-education` and `student-services` leaves returned `Page not found`. The family therefore remains blocked because the remaining county-bearing district roots still expose no exact reusable role-bearing leaf in bounded public review.
- county_local_disability_resources: official_dhw_office_stack_supports_17_clean_leaf_matches_but_27_legacy_counties_still_lack_public_contract :: Reviewed 2026-06-23 bounded live Idaho DHW confirmation on the official root plus the existing office-leaf packet. The public root at https://healthandwelfare.idaho.gov/offices is live with title `Find a Service Location` and still preserves exact city office cards like Caldwell Office in HTML, but it exposes zero county terms or county-served fields. The exact office leaf https://healthandwelfare.idaho.gov/dhw/caldwell-office is live with title `Caldwell Office`, confirming that the packet is grounded in real reviewable DHW office leaves. Idaho county-local routing therefore splits cleanly into 17 safe county-to-exact-office replacements plus one Canyon split that still rejects Nampa as SWITC-only, while 27 counties remain blocked because the public DHW stack still exposes no truthful county-to-office contract for them.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade; samples=16; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract; samples=4; first=https://healthandwelfare.idaho.gov/offices

## Next actions

- [critical] district_or_county_education_routing: continue_exact_district_leaf_expansion_only_when_uncovered_idaho_district_hosts_expose_role_bearing_special_education_or_special_services_leaves
- [critical] county_local_disability_resources: retain_17_clean_exact_office_replacements_keep_canyon_split_explicit_and_leave_27_legacy_counties_blocked_until_idaho_publishes_county_contract

## Repair decision

- Idaho remains BLOCKED and not index-safe.
- Education is stronger than the prior packet claimed because Bear Lake now has a reviewed district-owned Special Education leaf, raising Idaho to thirteen reviewed county-grade district-owned education leaves.
- Idaho still does not clear because the remaining county-bearing district roots still lack exact reusable role-bearing leaves in bounded public review, and county-local remains separately blocked on missing public county-to-office contract evidence.
- County-local remains the same explicit split: 17 clean office replacements plus the Canyon split are preserved, and 27 counties stay blocked until Idaho publishes a public county-to-office contract.
