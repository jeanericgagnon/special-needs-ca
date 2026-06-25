# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 93
- county_count: 105
- primary_gap_reason: current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_30_counties

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: verified_state_grade (Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_reviewed_local_kansas_district_leaves_expand_to_30_counties_but_current_live_ksde_submit_replay_is_rejected (Kansas still has reviewed local education-routing proof for only 30 counties, so the state remains blocked on incomplete county-grade local education evidence. The preserved district-owned and district-linked local leaf lane is still the only trustworthy repair path because the current live KSDE state directory/export lane still fails as `Request Rejected`, while three more unresolved district domains now also fail closed in reviewed ways: Chase County USD 284 exposes a live sitemap plus exact role-slug 404s with zero role-bearing sitemap URLs, Woodson USD 366 exposes a live sitemap plus exact role-slug 404s with zero role-bearing sitemap URLs, and Chanute USD 413 returns the same generic `Blue Comets Connect` app shell for arbitrary role-like slugs with no special-education text. The correct next lane is therefore saved district-owned or district-linked local leaf authoring only, not more retries against the current live KSDE roots or these reviewed non-match/app-shell district hosts.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- district_or_county_education_routing: current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_30_counties :: Reviewed 2026-06-25 one more bounded official Kansas district-host freeze pass against unresolved saved district domains instead of retrying the rejected KSDE export lane. Chase County USD 284 now proves a reviewed public non-match: the district homepage, robots.txt, sitemap.xml, and site_map are all public, but the sitemap exposes zero role-bearing special-education, student-services, child-find, parent-rights, or 504 URLs, and the exact same-domain candidate slugs `/page/special-education`, `/page/student-services`, and `/page/child-find` each return explicit 404 pages. Woodson USD 366 now proves the same public non-match class: the district homepage, robots.txt, and sitemap.xml are live, but the sitemap exposes zero role-bearing local education-routing URLs and the exact same-domain candidate slugs `/page/special-education`, `/page/student-services`, and `/page/child-find` each return explicit 404 pages. Chanute USD 413 now proves a separate false-positive class: the official district app host returns HTTP 200 for arbitrary role-like slugs such as `/page/special-education`, `/departments/special-education`, `/special-education`, and `/student-services`, but each page resolves only to the same generic app shell with title `Blue Comets Connect` and no special-education, child-find, 504, procedural-safeguards, or parent-rights text. Kansas therefore still remains blocked on incomplete county-grade local education proof, and these reviewed hosts should stay frozen until an exact role-bearing local leaf appears on the district-owned stack.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: verified_state_grade; samples=4; first=https://www.kdads.ks.gov/
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_reviewed_local_kansas_district_leaves_expand_to_30_counties_but_current_live_ksde_submit_replay_is_rejected; samples=34; first=https://uapps.ksde.gov/Directory_Rpts/default.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] district_or_county_education_routing: continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- Education is still the only remaining critical blocker.
- Kansas still has reviewed local education-routing proof for 30 counties and no new county clears in this pass.
- Chase County USD 284 now freezes as a reviewed district-owned non-match because the public sitemap exposes zero role-bearing local-routing URLs and exact role slugs return 404.
- Woodson USD 366 now freezes as a reviewed district-owned non-match because the public sitemap exposes zero role-bearing local-routing URLs and exact role slugs return 404.
- Chanute USD 413 now freezes as a district-owned false-positive app shell because role-like slugs all resolve to the same generic `Blue Comets Connect` shell with no special-education text.
- The live KSDE state directory/export lane still fails closed as `Request Rejected`, so the only trustworthy next lane remains saved district-owned or district-linked local leaves.
