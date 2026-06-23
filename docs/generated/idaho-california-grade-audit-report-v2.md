# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: official_directories_now_expose_exact_targets_but_nampa_negative_proof_and_missing_county_mapping_keep_idaho_blocked

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_district_directory_without_county_or_special_education_fields (The Idaho education packet now has a deterministic district-owned leaf authoring lane, but the family remains blocked because 44/44 current county rows still point at statewide SDE fallbacks rather than reviewed district-owned special-education leaves. The official Idaho SDE district directory proves 116 exact outbound district website links exist, but the public directory itself still exposes no county labels and no district special-education contact fields, so county-grade education routing still depends on reviewed district-owned authoring targets.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial (The Idaho county-local packet now has a deterministic exact-office authoring lane, but the family remains blocked because the public DHW office stack still does not expose county-to-office mapping. Eighteen county rows now name-match reviewed official office leaves, 27 rows still rely on the dead legacy locator, and Canyon County still has a duplicated Caldwell/Nampa split where the only reviewed Nampa mention is Southwest Idaho Treatment Center rather than a county-benefits office leaf.)

## Failure ledger

- district_or_county_education_routing: official_school_district_directory_exposes_district_links_but_not_county_or_special_education_fields :: Reviewed 2026-06-22 current official Idaho SDE pages plus the live school_district DB rows. The official School Districts directory at https://www.sde.idaho.gov/school-districts/ still proves 116 exact outbound district website links, but the public directory page itself still exposes no county labels and no district special-education contact fields. A live DB reconciliation shows all 44 Idaho county rows still point at statewide SDE fallback URLs instead of district-owned leaves: 42 rows use https://www.sde.idaho.gov/sped/ and 2 rows (Ada and Canyon) still use the generic SDE root https://www.sde.idaho.gov/. Idaho therefore still needs district-owned leaf authoring, but the next lane can now work from a deterministic packet instead of rereading the statewide directory.
- county_local_disability_resources: official_dhw_office_directory_exposes_exact_office_leaves_but_nampa_resolves_only_to_switc_and_county_mapping_stays_publicly_missing :: Reviewed 2026-06-22 current official Idaho DHW office routing pages plus the live county_offices DB rows. The paginated official directory and sitemap still prove exact office leaves such as Boise, Caldwell, Pocatello, Blackfoot, Idaho Falls, Rexburg, Moscow, Payette, and Sandpoint-Ponderay. A live DB reconciliation shows 18 DOI-backed county rows already name-match reviewed official office leaves, 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations, and Canyon County remains duplicated across Caldwell and Nampa. The bounded Nampa follow-up still resolves only to Southwest Idaho Treatment Center (SWITC) at 1660 11th Ave N, Nampa, ID 83687, not to a county office or benefits office leaf. Idaho therefore still lacks a public county-to-office contract, but the next lane can now work from a deterministic office-leaf packet instead of rereading the statewide directory.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_official_district_directory_without_county_or_special_education_fields; samples=3; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial; samples=4; first=https://healthandwelfare.idaho.gov/offices

## Next actions

- [critical] district_or_county_education_routing: use_idaho_district_leaf_packet_to_attach_reviewed_district_owned_special_education_or_student_services_leaves
- [critical] county_local_disability_resources: use_idaho_office_leaf_packet_to_replace_doi_rows_and_keep_unmapped_legacy_counties_blocked

## Completion decision

- Idaho remains BLOCKED and not index-safe.
- Education is still blocked on county-keyed or reviewed district special-education routing, but the next lane now has a dedicated Idaho district-owned leaf packet instead of only a statewide directory blocker.
- County-local is still blocked because the public office directory does not map exact office leaves back to counties, but the next lane now has a dedicated Idaho office-leaf packet that captures the 18 exact matches, 27 legacy rows, and the unresolved Canyon/Nampa split.
