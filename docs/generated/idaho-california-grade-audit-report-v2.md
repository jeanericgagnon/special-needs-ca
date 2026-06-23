# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: district_owned_roots_now_show_live_special_services_leaf_signals_but_county_mapping_and_office_contracts_still_incomplete

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_district_root_packet_without_county_or_special_education_fields (The Idaho education packet is now sharper than a generic root-authoring lane. The official School Districts page and its public page JSON preserve 116 exact outbound district website links, and bounded checks on sampled district-owned roots already show likely education-routing leaves on the district hosts themselves: Cassia District sitemap exposes `/page/special-services/`, Payette Joint District navigation exposes `/departments/special-education`, and Pocatello-Chubbuck SD25 exposes `/departments/special-services` plus `/schools-programs/special-programs`. But the statewide directory still exposes no explicit county field or county-to-district contract, and the current DB rows still all point at statewide SDE fallbacks rather than reviewed district-owned leaves. Idaho therefore remains blocked until those district-owned leaf signals are converted into reviewed county-grade special-education or student-services pages.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial (The Idaho county-local packet is now a materialized exact-office alignment lane. The official DHW sitemap exposes 23 exact office leaves, and 18 current DOI-backed rows reconcile to 17 county-clean exact leaf replacements plus one split Canyon County pair where Caldwell is a real office leaf and Nampa remains the wrong-role SWITC treatment-center mention. Idaho still stays blocked because 27 county rows continue to use the dead legacy locator and the public DHW office stack still exposes no county-to-office contract.)

## Failure ledger

- district_or_county_education_routing: official_district_roots_now_show_live_special_services_leaf_signals_but_not_reviewed_county_grade_leaves :: Reviewed 2026-06-23 bounded live official Idaho SDE probes on https://www.sde.idaho.gov/school-districts/ and https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049, then ran one bounded sample on five district-owned roots taken directly from the official directory. The official SDE surfaces still preserve 116 exact outbound district website links and 30 county-bearing names, but still expose no explicit county field, county filter, or district special-education contacts. The sampled district-owned roots prove the next lane is exact district leaf authoring from those local sites rather than another statewide reread: https://www.cassiaschools.org/sitemap.xml exposes https://www.cassiaschools.org/page/special-services/ and a `compliance504` route; https://www.payetteschools.org/ navigation exposes /our-district/departments/special-education; and https://www.sd25.us/ exposes /departments/special-services plus /schools-programs/special-programs on the public homepage and robots surface. Blaine County District homepage text also preserves special-education and 504 signals on the district-owned host even though an exact department leaf was not yet isolated in this bounded pass. A live DB reconciliation still shows all 44 Idaho county rows pointing at statewide SDE fallbacks rather than reviewed district-owned leaves: 42 rows use https://www.sde.idaho.gov/sped/ and 2 rows (Ada and Canyon) still use the generic SDE root https://www.sde.idaho.gov/. Idaho education therefore remains blocked, but the exact next lane is now narrower: author reviewed district-owned special-education or student-services leaves from the official district roots and their local sitemap/navigation signals.
- county_local_disability_resources: materialized_exact_office_leaf_packet_shows_17_clean_matches_plus_canyon_split_but_no_public_county_contract :: Reviewed 2026-06-23 the live official Idaho DHW sitemap at https://healthandwelfare.idaho.gov/sitemap.xml, the reviewed statewide office directory at https://healthandwelfare.idaho.gov/offices, and the live county_offices DB rows. The sitemap currently exposes 23 exact DHW office leaves, including Boise Office-Westgate Building, Pocatello Office-Horizon Building, Blackfoot Office-Blackfoot Services Complex, Sandpoint-Ponderay Office, Idaho Falls Office, Caldwell Office, Burley Office, Mountain Home Office, Grangeville Office-Camas Resource Center, Coeur d'Alene Office, Moscow Office, Salmon Office-Field Office, Rexburg Office, Lewiston Office-State Office Building, Payette Office, Kellogg Office, and Twin Falls Office-Pole Line Building. A live DB reconciliation shows 18 DOI-backed rows, but they collapse to 17 county-clean exact office leaf matches plus one duplicated Canyon County pair. Canyon's Caldwell row maps to https://healthandwelfare.idaho.gov/dhw/caldwell-office, while the only public Nampa mention still resolves only to Southwest Idaho Treatment Center (SWITC) rather than a county benefits office leaf. The remaining 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations. Idaho therefore still lacks a public county-to-office contract, but the county-local packet is now materially sharper: future repair work can start from exact office leaves for the 17 clean counties and the explicit Canyon split instead of rereading the statewide directory or DOI placeholders.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_official_district_root_packet_without_county_or_special_education_fields; samples=5; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_materialized_exact_office_leaf_packet_without_public_county_contract; samples=3; first=https://healthandwelfare.idaho.gov/sitemap.xml

## Next actions

- [critical] district_or_county_education_routing: author_reviewed_special_education_or_special_services_leaves_from_official_district_roots_and_local_sitemap_navigation_signals
- [critical] county_local_disability_resources: use_materialized_exact_office_leaf_packet_for_17_clean_counties_keep_canyon_split_and_27_legacy_counties_blocked

## Repair decision

- Idaho remains BLOCKED and not index-safe.
- Education is now a clearer district-owned leaf-authoring lane: the official SDE directory still lacks county mapping, but sampled district-owned roots already expose likely special-education or special-services leaves on local sites.
- County-local is still blocked on incomplete county-to-office mapping even though the exact DHW office leaf packet is materially stronger than the old locator placeholder.
- Future Idaho repair should start from district-owned sitemap/navigation leaves and the exact DHW office-leaf packet, not from more statewide root rereads.
