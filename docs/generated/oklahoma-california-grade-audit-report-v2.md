# Oklahoma California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 77
- primary_gap_reason: live_okdhs_public_county_widget_salvages_alfalfa_but_still_only_publishes_two_rows_while_combined_official_county_local_coverage_stops_at_46_and_leaves_31

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
- county_local_disability_resources: blocked_okdhs_public_county_widget_partial_and_kml_service_limited (Reviewed 2026-06-25 one more bounded official Oklahoma county-local pass against the current OKDHS public county widget instead of only the KML. The live successor lane is still real: `https://oklahoma.gov/okdhs/contact-us.html` publishes a county-map widget and the widget points at `https://oklahoma.gov/okdhs/contact-us/map2.html`. The same live contact page still exposes no new county-complete export or public-assistance office directory beyond that widget and the out-of-scope Child Support offices tree. The same official page source still sharpens the blocker, but it also salvages one county. The widget HTML itself exposes one exact county API root through `data-county-map-apiurl`, and that public component API `/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json` returns only two county entries, while the linked public config model `https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json` likewise only publishes county entities for Adair and Alfalfa. The Alfalfa row itself preserves a real county-local office contract with county name, phone, toll-free, fax, and street address, so it can count as one additional truth-safe county. But the Adair row still only says Adair now serves Sequoyah residents and then falls back to a statewide phone route without preserving a local office address or a county-owned leaf for Adair. A bounded official sitemap and sibling-leaf review also failed to reveal a hidden replacement contract: the host search JSON is 403, public search-results routes 404, and the extra `contact-us/*` leaves exposed in sitemap review resolve to wrong-role pages like hotlines, FAQ, workforce, ombudsman complaints, and config shells rather than a county-complete disability/local directory. The broader public KML still contributes the stronger base coverage, and the combined official county-local total now stops at 46 counties. The same host still proves county trees are technically publishable because `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html` exposes a county-by-county tree, but that surface is explicitly Child Support only and cannot substitute for disability/local routing. Oklahoma therefore remains blocked because no current official county-local contract closes the remaining 31 counties.)

## Failure ledger

- county_local_disability_resources: okdhs_public_county_widget_salvages_alfalfa_but_adair_still_lacks_local_contract_and_remaining_31_stay_unclosed :: Reviewed 2026-06-25 bounded official Oklahoma checks on `https://oklahoma.gov/okdhs/contact-us.html`, `https://oklahoma.gov/okdhs/contact-us/dhsofficelocations.html`, `https://oklahoma.gov/okdhs/contact-us/map2.html`, `https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json`, the public component feed at `https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json`, the public KML office-map feed at `https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1`, `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html`, `https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html`, the official sitemap at `https://oklahoma.gov/sitemap.xml`, the blocked search endpoint `https://oklahoma.gov/bin/sok-wcm/search.json?q=office%20locations&path=/content/sok-wcm/en/okdhs`, and the public 404 search-results routes on the same host. The live OKDHS contact page still exposes no new county-complete export or public-assistance office directory beyond the partial widget and the out-of-scope Child Support offices tree. The newly surfaced official county-widget leaves still do not close the blocker overall, but they do salvage Alfalfa. `dhsofficelocations.html` canonically lands back on the generic contact-us page, while the live `map2` page exposes a county-widget shell whose HTML points at one exact `data-county-map-apiurl` root and whose public config model only contains county entities for Adair and Alfalfa. The matching public component feed also returns only those same two county entries. The Alfalfa row preserves an exact local office contract with phone, toll-free, fax, and street address in Cherokee, Oklahoma, so Alfalfa can now count as covered. The Adair row remains too weak because it only says Adair now serves Sequoyah residents and then falls back to the statewide `(405) 522-5050` route without preserving a local office address or county-owned contact leaf for Adair. Official sitemap review did surface additional `contact-us/*` leaves, but the reviewed candidates resolve to wrong-role pages like Long-Term Care Ombudsman complaints, hotlines, FAQ, workforce, generic info, and config shells, not to a county-complete disability/local office directory. The broader public KML still preserves 60 placemarks, and together with the salvaged Alfalfa row it yields 46 benefit-capable counties after strict review and TANF-only access points are excluded. The child-support office tree still proves county trees are technically publishable on the same official host, but it remains child-support-only. Oklahoma therefore still lacks truth-safe county-local proof for the remaining 31 counties: Adair, Beaver, Blaine, Cimarron, Coal, Dewey, Ellis, Grant, Greer, Harmon, Harper, Haskell, Hughes, Jefferson, Kingfisher, Kiowa, Logan, Major, Marshall, McClain, McIntosh, Murray, Noble, Nowata, Okfuskee, Pawnee, Roger Mills, Seminole, Tillman, Washita, Woods.

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
- county_local_disability_resources: blocked_okdhs_public_county_widget_partial_and_kml_service_limited; samples=10; first=https://oklahoma.gov/okdhs/contact-us/dhsofficelocations.html

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_31_counties

## County-local refinement

- The live OKDHS contact-us page still points to one real public county widget and the broader public KML, so the successor lane is official and reviewable.
- That same contact-us page still exposes no new county-complete export or public-assistance office directory beyond the partial widget and the out-of-scope Child Support offices tree.
- The live `map2` widget HTML itself exposes one exact `data-county-map-apiurl`, and the newly surfaced official county-widget contract is itself partial: both the public `electionConfigPageData.json` feed and the linked `mapconfig2.model.json` only publish county entries for Adair and Alfalfa.
- The Alfalfa widget row is still good enough to count because it preserves county name, local phone, toll-free, fax, and street address on the official host.
- The Adair widget row stays below the bar because it only preserves a service note for Sequoyah plus a statewide phone route, not a local office contract for Adair.
- A bounded official sitemap and sibling-leaf review did not reveal a hidden replacement directory: OKDHS search JSON is blocked, public search-results routes 404, and the extra `contact-us/*` leaves are wrong-role pages rather than county-local disability routing.
- The broader KML still outperforms the widget, and together with the salvaged Alfalfa row it yields 46 benefit-capable counties once TANF-only access points are excluded.
- The child-support office tree remains county-complete on the same host, which proves a county contract is technically publishable, but it stays out of scope because it is explicitly child-support-only.
- The DDS area-contact page is still statewide-only and does not close any county remainder.

## Completion decision

- Oklahoma remains `BLOCKED` and `index_safe=false`.
- Education remains cleared by the current official OSDE State School and District Directory.
- County-local remains blocked because the public county widget only publishes Adair and Alfalfa, and only the Alfalfa row is independently sufficient; the combined official evidence still leaves a measured 31-county remainder: Adair, Beaver, Blaine, Cimarron, Coal, Dewey, Ellis, Grant, Greer, Harmon, Harper, Haskell, Hughes, Jefferson, Kingfisher, Kiowa, Logan, Major, Marshall, McClain, McIntosh, Murray, Noble, Nowata, Okfuskee, Pawnee, Roger Mills, Seminole, Tillman, Washita, Woods.
- Oklahoma therefore still cannot be marked `COMPLETE` or index-safe.
