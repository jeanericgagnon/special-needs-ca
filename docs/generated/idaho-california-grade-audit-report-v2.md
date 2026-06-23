# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: official_directories_expose_real_public_contracts_but_county_grade_mapping_and_role_fields_still_missing

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_district_directory_with_links_but_without_county_contract_or_special_education_fields (The Idaho education packet remains a district-owned leaf authoring lane only. The official School Districts page and its public WordPress page JSON preserve 116 exact outbound district website links and some county-bearing district names, but they still expose no explicit county field, no county-to-district contract, and no district special-education contact fields.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial (The Idaho county-local packet remains an exact-office alignment lane only. The DHW office stack exposes real office leaves, but public county mapping is still missing and the only public Nampa mention remains SWITC rather than a county-benefits office.)

## Failure ledger

- district_or_county_education_routing: official_district_directory_and_page_json_expose_links_and_some_county_bearing_names_but_no_county_contract_or_special_education_fields :: Reviewed 2026-06-23 bounded live official Idaho SDE probes on https://www.sde.idaho.gov/school-districts/, https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049, and the live DB fallback inventory. The rendered School Districts page and the public page JSON both preserve district names plus exact outbound district website links, including county-bearing names such as Blaine County District #61, Boundary County District #101, Butte County District #111, and Camas County District #121. That makes the official directory stronger than a generic statewide shell. But the same public surfaces still expose no explicit county field, no county filter or county-to-district mapping contract, and no district special-education contact fields. A live DB reconciliation still shows all 44 Idaho county rows pointing at statewide fallbacks rather than district-owned leaves: 42 rows use https://www.sde.idaho.gov/sped/ and 2 rows (Ada and Canyon) still use the generic SDE root https://www.sde.idaho.gov/. Idaho education therefore remains blocked until reviewed district-owned special-education or student-services leaves are attached.
- county_local_disability_resources: official_dhw_office_directory_exposes_exact_office_leaves_but_nampa_resolves_only_to_switc_and_county_mapping_stays_publicly_missing :: Reviewed 2026-06-22 current official Idaho DHW office routing pages plus the live county_offices DB rows. The paginated official directory and sitemap still prove exact office leaves such as Boise, Caldwell, Pocatello, Blackfoot, Idaho Falls, Rexburg, Moscow, Payette, and Sandpoint-Ponderay. A live DB reconciliation shows 18 DOI-backed county rows already name-match reviewed official office leaves, 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations, and Canyon County remains duplicated across Caldwell and Nampa. The bounded Nampa follow-up still resolves only to Southwest Idaho Treatment Center (SWITC) at 1660 11th Ave N, Nampa, ID 83687, not to a county office or benefits office leaf. Idaho therefore still lacks a public county-to-office contract, but the next lane can now work from a deterministic office-leaf packet instead of rereading the statewide directory.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_official_district_directory_with_links_but_without_county_contract_or_special_education_fields; samples=3; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial; samples=4; first=https://healthandwelfare.idaho.gov/offices

## Next actions

- [critical] district_or_county_education_routing: author_reviewed_district_targets_from_official_school_districts_directory_links_or_keep_county_routing_blocked
- [critical] county_local_disability_resources: use_idaho_office_leaf_packet_to_replace_doi_rows_and_keep_unmapped_legacy_counties_blocked

## Repair decision

- Idaho remains BLOCKED and not index-safe.
- The SDE district directory is now documented more precisely: it is a real public district-link contract, not a generic statewide shell.
- That still does not clear county-grade education routing because the same public surfaces lack an explicit county mapping contract and district special-education fields.
- Idaho education should reopen only through reviewed district-owned special-education or student-services leaves, not through more statewide SDE rereads.
