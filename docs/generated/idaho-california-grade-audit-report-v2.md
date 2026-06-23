# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: official_district_root_packet_and_materialized_exact_office_leaf_packet_exist_but_county_grade_mapping_and_role_fields_still_missing

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_district_root_packet_without_county_or_special_education_fields (The Idaho education packet is now a deterministic district-root authoring lane rather than a generic district search problem. The official School Districts page and its public page JSON preserve 116 exact outbound district website links, including 30 county-bearing district names, but still expose no explicit county field, no county-to-district contract, and no district special-education contact fields. Idaho still needs reviewed district-owned special-education or student-services leaves, but those leaves should now be authored from the official district-link packet rather than from broad search.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial (The Idaho county-local packet is now a materialized exact-office alignment lane. The official DHW sitemap exposes 23 exact office leaves, and 18 current DOI-backed rows reconcile to 17 county-clean exact leaf replacements plus one split Canyon County pair where Caldwell is a real office leaf and Nampa remains the wrong-role SWITC treatment-center mention. Idaho still stays blocked because 27 county rows continue to use the dead legacy locator and the public DHW office stack still exposes no county-to-office contract.)

## Failure ledger

- district_or_county_education_routing: official_district_directory_json_exposes_116_roots_and_30_county_bearing_names_but_not_special_education_leaves :: Reviewed 2026-06-23 bounded live official Idaho SDE probes on https://www.sde.idaho.gov/school-districts/ and https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049, plus the live DB fallback inventory. The rendered School Districts page and the public page JSON preserve 116 exact outbound district website links on official public surfaces. Within those official links, 30 district names are already county-bearing or county-paired, including Bear Lake County District #33, Blaine County District #61, Bonneville Joint District #93, Boundary County District #101, Butte County District #111, Camas County District #121, Canyon-Owyhee School Service Agency #555, Cassia Joint District #151, Clark County District #161, Fremont County Joint District #215, Jefferson County Joint District #251, Jerome Joint District #261, Minidoka County Joint District #331, Oneida County District #351, and Payette Joint District #371. That makes the official directory stronger than a generic statewide shell and gives Idaho a deterministic district-root packet. But the same public surfaces still expose no explicit county field, no county filter or county-to-district contract, and no district special-education contact fields. A live DB reconciliation still shows all 44 Idaho county rows pointing at statewide fallbacks rather than district-owned leaves: 42 rows use https://www.sde.idaho.gov/sped/ and 2 rows (Ada and Canyon) still use the generic SDE root https://www.sde.idaho.gov/. Idaho education therefore remains blocked until reviewed district-owned special-education or student-services leaves are attached from those official district roots.
- county_local_disability_resources: materialized_exact_office_leaf_packet_shows_17_clean_matches_plus_canyon_split_but_no_public_county_contract :: Reviewed 2026-06-23 the live official Idaho DHW sitemap at https://healthandwelfare.idaho.gov/sitemap.xml, the reviewed statewide office directory at https://healthandwelfare.idaho.gov/offices, and the live county_offices DB rows. The sitemap currently exposes 23 exact DHW office leaves, including Boise Office-Westgate Building, Pocatello Office-Horizon Building, Blackfoot Office-Blackfoot Services Complex, Sandpoint-Ponderay Office, Idaho Falls Office, Caldwell Office, Burley Office, Mountain Home Office, Grangeville Office-Camas Resource Center, Coeur d'Alene Office, Moscow Office, Salmon Office-Field Office, Rexburg Office, Lewiston Office-State Office Building, Payette Office, Kellogg Office, and Twin Falls Office-Pole Line Building. A live DB reconciliation shows 18 DOI-backed rows, but they collapse to 17 county-clean exact office leaf matches plus one duplicated Canyon County pair. Canyon's Caldwell row maps to https://healthandwelfare.idaho.gov/dhw/caldwell-office, while the only public Nampa mention still resolves only to Southwest Idaho Treatment Center (SWITC) rather than a county benefits office leaf. The remaining 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations. Idaho therefore still lacks a public county-to-office contract, but the county-local packet is now materially sharper: future repair work can start from exact office leaves for the 17 clean counties and the explicit Canyon split instead of rereading the statewide directory or DOI placeholders.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_official_district_root_packet_without_county_or_special_education_fields; samples=3; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_materialized_exact_office_leaf_packet_without_public_county_contract; samples=3; first=https://healthandwelfare.idaho.gov/sitemap.xml

## Next actions

- [critical] district_or_county_education_routing: author_reviewed_special_education_leaves_from_116_official_district_directory_links_or_keep_county_routing_blocked
- [critical] county_local_disability_resources: use_materialized_exact_office_leaf_packet_for_17_clean_counties_keep_canyon_split_and_27_legacy_counties_blocked

## Repair decision

- Idaho remains BLOCKED and not index-safe.
- Education is still blocked until reviewed district-owned special-education or student-services leaves are attached from the official Idaho district-root packet.
- County-local is now sharper on disk: 23 official DHW office leaves are materialized, 17 counties have clean exact office-leaf replacements ready, Canyon is split between real Caldwell and wrong-role Nampa, and 27 legacy-locator counties remain explicitly blocked.
- Future Idaho county-local repair should start from the exact office-leaf packet, not from DOI mirrors or the dead legacy locator.
