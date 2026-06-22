# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: official_directories_now_expose_exact_district_and_office_targets_but_county_keyed_mappings_still_missing

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_district_directory_exists_but_county_mapping_unreviewed (Reviewed 2026-06-22 current official Idaho SDE pages plus the missed official School Districts directory at https://www.sde.idaho.gov/school-districts/. The state page now preserves 116 exact district website links from one first-party directory, so the old "no exact leaves" claim is no longer true. Idaho still remains blocked at county-grade education routing because the current school_district DB rows are 44/44 statewide fallbacks and this official directory does not expose county-keyed mapping or district special-education contacts in reviewed public content.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_exact_office_leafs_exist_but_county_mapping_partial (Reviewed 2026-06-22 current official Idaho DHW office routing pages: https://healthandwelfare.idaho.gov/contact-us, https://healthandwelfare.idaho.gov/offices, the paginated office-list pages, and the DHW sitemap. The official office directory now exposes 27 exact office leaves. Seventeen current DOI-backed county rows already name-match exact office leaves such as Boise, Pocatello Horizon Building, Blackfoot, Caldwell, Burley, Idaho Falls, Lewiston State Office Building, and Twin Falls Pole Line Building. Idaho still remains blocked at county-grade local routing because 27 county rows still use the dead legacy dhhs.idaho.gov/locations storefront root, one DOI-backed Nampa office row does not have a reviewed exact official leaf, and the public DHW office stack exposes search by city or ZIP but no county-keyed mapping contract.)

## Failure ledger

- district_or_county_education_routing: official_school_district_directory_exists_but_county_or_special_education_mapping_not_yet_reviewed :: Reviewed 2026-06-22 current official Idaho SDE pages: https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, https://www.sde.idaho.gov/about-us/idaho-schools/, and the official School Districts directory https://www.sde.idaho.gov/school-districts/ plus its public WordPress page JSON. The School Districts page explicitly says it is a complete list of Idaho K-12 districts and preserves 116 exact outbound district website links, but the directory is not county-keyed and does not expose district special-education contacts in reviewed public content. The live school_district table is still 44/44 statewide fallback rows, so county-grade education routing still cannot be verified.
- county_local_disability_resources: official_dhw_office_directory_exposes_27_exact_office_leaves_but_27_counties_still_lack_public_mapping :: Reviewed 2026-06-22 current official Idaho DHW office routing pages: https://healthandwelfare.idaho.gov/contact-us, https://healthandwelfare.idaho.gov/offices?page=0, https://healthandwelfare.idaho.gov/offices?page=1, https://healthandwelfare.idaho.gov/offices?page=2, and the DHW sitemap https://healthandwelfare.idaho.gov/sitemap.xml, plus live county_offices DB rows. The paginated official directory preserves 27 exact office entries and the sitemap preserves exact office leaves such as /dhw/boise-office-westgate-building, /dhw/pocatello-office-horizon-building, /dhw/blackfoot-office-blackfoot-services-complex, /dhw/caldwell-office, /dhw/idaho-falls-office, /dhw/payette-office, /dhw/rexburg-office, /dhw/sandpoint-ponderay-office, and /dhw/twin-falls-office-pole-line-building. Seventeen DOI-backed county rows already name-match official office leaves, but 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations and the remaining DOI-backed Nampa office row lacks a reviewed exact official leaf. The public office search is city-or-ZIP only, so a county-to-office contract still cannot be verified.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_official_district_directory_exists_but_county_mapping_unreviewed; samples=3; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_exact_office_leafs_exist_but_county_mapping_partial; samples=4; first=https://healthandwelfare.idaho.gov/offices

## Next actions

- [critical] district_or_county_education_routing: author_reviewed_district_targets_from_official_school_districts_directory_or_keep_county_routing_blocked
- [critical] county_local_disability_resources: replace_17_named_doi_rows_with_exact_office_leaves_and_keep_27_legacy_counties_blocked_without_public_mapping

## Completion decision

- Idaho remains BLOCKED and not index-safe.
- Education is sharper, not solved: Idaho now has an official statewide School Districts directory with exact district website links, but the packet still lacks county-keyed routing or reviewed district special-education leaves.
- County-local is also sharper, not solved: Idaho now has an official 27-office DHW directory and 17 current DOI-backed rows can be tied to exact official office leaves, but 27 counties still rely on the dead legacy locator and the public office stack does not expose a county-keyed contract.
