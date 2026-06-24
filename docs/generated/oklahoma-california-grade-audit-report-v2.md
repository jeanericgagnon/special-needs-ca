# Oklahoma California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 77
- primary_gap_reason: live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_county_tree_cannot_close_the_remaining_32

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_current_official_state_school_directory (the official Oklahoma State School and District Directory now clears county-grade education routing. The live OSDE State School Directory page explicitly says OSDE-accredited education contact information can be downloaded or browsed by district or school site and includes physical addresses, mailing addresses, phone numbers, email addresses, website URLs and more. That page also exposes live official School Directory and District Directory download links on the current Oklahoma.gov education host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Oklahoma evidence preserves statewide disability-rights and advocacy identity)
- parent_training_information_center: verified_state_grade (reviewed first-party Oklahoma Parents Center evidence preserves statewide Parent Training and Information identity and Oklahoma special-education support language)
- legal_aid: verified_state_grade (reviewed first-party Legal Aid Services of Oklahoma evidence preserves statewide legal-aid identity and Oklahoma-specific help language)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_okdhs_kml_partial_county_contract_with_service_limited_access_points (Reviewed 2026-06-24 one more bounded official Oklahoma county-local pass against the live OKDHS office-map KML rather than only the older county-key heuristic. The current successor lane is still real: `https://oklahoma.gov/okdhs/contact-us.html` directs users to the public office map and the backing KML at `https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1` is publicly fetchable. But a stricter role-aware review now shows the KML only yields 45 benefit-capable county-local contracts, not 46. It contains 60 placemarks total, yet only 43 preserve an explicit `County Name:` field and only some of the remaining `Access Point - <County>` placemarks are usable for this family. Access points that advertise `SNAP, Child Care, Medical` can count as county-local benefit routing for counties like Caddo, Cherokee, Choctaw, Delaware, Latimer, Love, Mayes, Oklahoma, and Tulsa, but Grady (`TANF`), Pittsburg (`TANF Only`), and Washington (`TANF Only`) do not satisfy the broader disability/local-routing role. The same host still proves county trees are technically publishable because `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html` exposes a county-by-county tree, but that surface is explicitly `Child Support District Offices` and cannot substitute for disability/local routing. The DDS apply page at `https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html` remains statewide-only with one phone/email and no county-served matrix. Oklahoma therefore remains blocked with 32 counties still lacking truth-safe county-local routing on current official evidence.)

## Failure ledger

- county_local_disability_resources: live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_tree_do_not_close_remaining_32 :: Reviewed 2026-06-24 bounded official Oklahoma checks on `https://oklahoma.gov/okdhs/contact-us.html`, the public KML office-map feed at `https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1`, `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html`, and `https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html`. The live KML preserves 60 placemarks, but only 45 counties now qualify as benefit-capable county-local routing after strict review: 43 placemarks expose an explicit `County Name:` field and only a subset of `Access Point - <County>` rows advertise `SNAP, Child Care, Medical`. TANF-limited access points for Grady, Pittsburg, and Washington do not satisfy the broader county-local disability routing role. The same host still publishes a county tree for Child Support District Offices, which proves county trees are technically possible but does not clear disability/local routing. The DDS area-contact page remains one statewide intake route with no county-served matrix. Oklahoma therefore still lacks county-local proof for the remaining 32 counties: Adair, Alfalfa, Beaver, Blaine, Cimarron, Coal, Dewey, Ellis, Grant, Greer, Harmon, Harper, Haskell, Hughes, Jefferson, Kingfisher, Kiowa, Logan, Major, Marshall, McClain, McIntosh, Murray, Noble, Nowata, Okfuskee, Pawnee, Roger Mills, Seminole, Tillman, Washita, and Woods.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://oklahoma.gov/okdhs/services/dds/hcbs/eligibility.html
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.oklahoma.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.oklahoma.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://sde.ok.gov/
- district_or_county_education_routing: verified_current_official_state_school_directory; samples=4; first=https://oklahoma.gov/education/resources/state-school-directory.html
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://oklahoma.gov/okdhs/services/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://okdlc.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://oklahomaparentscenter.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.legalaidok.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_okdhs_kml_partial_county_contract_with_service_limited_access_points; samples=6; first=https://oklahoma.gov/okdhs/contact-us.html

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_32_counties

## County-local refinement

- The live OKDHS contact-us page still points to one real public office-map KML, so the successor lane is official and reviewable.
- The stricter KML review now proves only 45 benefit-capable counties, not 46: 43 `County Name` placemarks plus a small set of county-named access points that advertise `SNAP, Child Care, Medical`.
- TANF-limited access points for Grady, Pittsburg, and Washington do not satisfy the broader county-local disability routing role and therefore cannot be counted toward California-grade coverage.
- The child-support office tree remains county-complete on the same host, which proves a county contract is technically publishable, but it stays out of scope because it is explicitly child-support-only.
- The DDS area-contact page is still statewide-only and does not close any county remainder.

## Completion decision

- Oklahoma remains `BLOCKED` and `index_safe=false`.
- Education remains cleared by the current official OSDE State School and District Directory.
- County-local remains blocked with a measured 32-county remainder: Adair, Alfalfa, Beaver, Blaine, Cimarron, Coal, Dewey, Ellis, Grant, Greer, Harmon, Harper, Haskell, Hughes, Jefferson, Kingfisher, Kiowa, Logan, Major, Marshall, McClain, McIntosh, Murray, Noble, Nowata, Okfuskee, Pawnee, Roger Mills, Seminole, Tillman, Washita, Woods.
- Oklahoma therefore still cannot be marked `COMPLETE` or index-safe.
