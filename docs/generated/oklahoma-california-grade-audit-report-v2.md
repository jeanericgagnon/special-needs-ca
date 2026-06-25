# Oklahoma California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 77
- primary_gap_reason: live_okdhs_public_county_widget_only_publishes_adair_and_alfalfa_while_kml_still_yields_only_45_benefit_capable_counties_and_no_contract_for_remaining_32

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
- county_local_disability_resources: blocked_okdhs_public_county_widget_partial_and_kml_service_limited (Reviewed 2026-06-25 one more bounded official Oklahoma county-local pass against the current OKDHS public county widget instead of only the KML. The live successor lane is still real: `https://oklahoma.gov/okdhs/contact-us.html` publishes a county-map widget and the widget points at `https://oklahoma.gov/okdhs/contact-us/map2.html`. But the same official page source now sharpens the blocker further. The widget's public component API `/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json` returns only two county entries, and the linked public config model `https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json` likewise only publishes county entities for Adair and Alfalfa. The broader public KML still exists, but it only yields 45 benefit-capable county-local contracts once TANF-only access points are excluded. The same host still proves county trees are technically publishable because `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html` exposes a county-by-county tree, but that surface is explicitly Child Support only and cannot substitute for disability/local routing. Oklahoma therefore remains blocked because its current public county widget is partial to Adair and Alfalfa, and no current official county-local contract closes the remaining 32 counties.)

## Failure ledger

- county_local_disability_resources: okdhs_public_county_widget_is_partial_to_adair_and_alfalfa_while_kml_and_child_support_tree_still_do_not_close_remaining_32 :: Reviewed 2026-06-25 bounded official Oklahoma checks on `https://oklahoma.gov/okdhs/contact-us.html`, `https://oklahoma.gov/okdhs/contact-us/dhsofficelocations.html`, `https://oklahoma.gov/okdhs/contact-us/map2.html`, `https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json`, the public component feed at `https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json`, the public KML office-map feed at `https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1`, `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html`, and `https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html`. The newly surfaced official county-widget leaves do not close the blocker: `dhsofficelocations.html` canonically lands back on the generic contact-us page, while the live `map2` page exposes a county-widget shell whose public config model only contains county entities for Adair and Alfalfa. The matching public component feed also returns only those same two county entries. The broader public KML still preserves 60 placemarks, but only 45 counties qualify as benefit-capable county-local routing after strict review and TANF-only access points are excluded. The child-support office tree still proves county trees are technically publishable on the same official host, but it remains child-support-only. Oklahoma therefore still lacks truth-safe county-local proof for the remaining 32 counties: Adair, Alfalfa, Beaver, Blaine, Cimarron, Coal, Dewey, Ellis, Grant, Greer, Harmon, Harper, Haskell, Hughes, Jefferson, Kingfisher, Kiowa, Logan, Major, Marshall, McClain, McIntosh, Murray, Noble, Nowata, Okfuskee, Pawnee, Roger Mills, Seminole, Tillman, Washita, Woods.

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
- county_local_disability_resources: blocked_okdhs_public_county_widget_partial_and_kml_service_limited; samples=6; first=https://oklahoma.gov/okdhs/contact-us/dhsofficelocations.html

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_32_counties

## County-local refinement

- The live OKDHS contact-us page still points to one real public county widget and the broader public KML, so the successor lane is official and reviewable.
- The newly surfaced official county-widget contract is itself partial: both the public `electionConfigPageData.json` feed and the linked `mapconfig2.model.json` only publish county entries for Adair and Alfalfa.
- The broader KML still outperforms the widget, but it only yields 45 benefit-capable counties once TANF-only access points are excluded.
- The child-support office tree remains county-complete on the same host, which proves a county contract is technically publishable, but it stays out of scope because it is explicitly child-support-only.
- The DDS area-contact page is still statewide-only and does not close any county remainder.

## Completion decision

- Oklahoma remains `BLOCKED` and `index_safe=false`.
- Education remains cleared by the current official OSDE State School and District Directory.
- County-local remains blocked because the public county widget only publishes Adair and Alfalfa, while the broader KML still leaves a measured 32-county remainder: Adair, Alfalfa, Beaver, Blaine, Cimarron, Coal, Dewey, Ellis, Grant, Greer, Harmon, Harper, Haskell, Hughes, Jefferson, Kingfisher, Kiowa, Logan, Major, Marshall, McClain, McIntosh, Murray, Noble, Nowata, Okfuskee, Pawnee, Roger Mills, Seminole, Tillman, Washita, Woods.
- Oklahoma therefore still cannot be marked `COMPLETE` or index-safe.
