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
- district_or_county_education_routing: blocked_official_district_directory_without_county_or_special_education_fields (Reviewed 2026-06-22 official Idaho SDE district routing sources: https://www.sde.idaho.gov/school-districts/, https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, and https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, plus live school_district DB rows and the public WordPress page JSON. The official SDE stack now clearly preserves a real district directory: the public /school-districts/ page exposes 116 exact outbound district website links. But the reviewed public content still exposes no county labels and no district special-education contact fields, and the live DB inventory is still 44 county fallback rows that reuse statewide or generic SDE URLs rather than reviewed county-mapped or district-owned routing leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial (Reviewed 2026-06-22 current official Idaho DHW office routing pages plus the paginated office directory. The official directory still exposes 27 exact office leaves and 18 DOI-backed county rows already name-match reviewed official office leaves. But the unresolved Canyon/Nampa gap is now narrower: the official directory mentions Nampa only on page 2 for Southwest Idaho Treatment Center (SWITC), not for a county office or benefits office leaf. Twenty-seven county rows still rely on the dead legacy `dhhs.idaho.gov/locations` root, and the public DHW office stack remains city-or-ZIP search only, so county-to-office routing is still not publicly verifiable.)

## Failure ledger

- district_or_county_education_routing: official_school_district_directory_exposes_district_links_but_not_county_or_special_education_fields :: Reviewed 2026-06-22 current official Idaho SDE pages: https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, https://www.sde.idaho.gov/about-us/idaho-schools/, and the official School Districts directory https://www.sde.idaho.gov/school-districts/ plus its public WordPress page JSON. The School Districts page explicitly says it is a complete list of Idaho K-12 districts and preserves 116 exact outbound district website links, but bounded live content checks show the public directory page itself does not expose county labels such as Canyon County and does not expose district special-education contact fields in reviewed public content. A live DB reconciliation now makes the fallback shape exact: the current school_district table still has 44 Idaho county rows, with 42 rows still using the statewide fallback https://www.sde.idaho.gov/sped/ and the remaining 2 rows (Ada and Canyon) still using the generic SDE root https://www.sde.idaho.gov/. County-grade education routing still cannot be verified.
- county_local_disability_resources: official_dhw_office_directory_exposes_exact_office_leaves_but_nampa_resolves_only_to_switc_and_county_mapping_stays_publicly_missing :: Reviewed 2026-06-22 current official Idaho DHW office routing pages: https://healthandwelfare.idaho.gov/contact-us, https://healthandwelfare.idaho.gov/offices?page=0, https://healthandwelfare.idaho.gov/offices?page=1, https://healthandwelfare.idaho.gov/offices?page=2, and the DHW sitemap https://healthandwelfare.idaho.gov/sitemap.xml, plus one bounded follow-up on Nampa mentions inside the public office directory HTML. The paginated official directory preserves 27 exact office entries and the sitemap preserves exact office leaves such as /dhw/boise-office-westgate-building, /dhw/pocatello-office-horizon-building, /dhw/blackfoot-office-blackfoot-services-complex, /dhw/caldwell-office, /dhw/idaho-falls-office, /dhw/payette-office, /dhw/rexburg-office, /dhw/sandpoint-ponderay-office, and /dhw/twin-falls-office-pole-line-building. Eighteen DOI-backed county rows already name-match official office leaves, but 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations. The bounded Nampa follow-up showed that the current public directory mentions Nampa only for Southwest Idaho Treatment Center (SWITC) at 1660 11th Ave N, Nampa, ID 83687, not for a reviewed county office or benefits office leaf. The public office search is still city-or-ZIP only, so county-to-office routing cannot yet be verified.

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

- [critical] district_or_county_education_routing: author_reviewed_district_targets_from_official_school_districts_directory_or_keep_county_routing_blocked
- [critical] county_local_disability_resources: replace_18_doi_mirror_rows_with_exact_office_leaves_and_keep_27_legacy_counties_blocked_until_a_public_county_to_office_contract_exists

## Completion decision

- Idaho remains BLOCKED and not index-safe.
- Education is still blocked on county-keyed or reviewed district special-education routing, even though the official state district directory exposes exact district links.
- County-local is still blocked because the public office directory does not map exact office leaves back to counties, and the bounded Nampa follow-up resolves only to Southwest Idaho Treatment Center rather than a county office leaf.
