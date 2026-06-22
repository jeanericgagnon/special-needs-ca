# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 15
- primary_gap_reason: official_browser_challenge_and_generic_local_fallbacks

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_education_root_challenge_and_county_fallback_only_rows (Reviewed 2026-06-22 bounded browser-assisted fetches on Arizona Department of Education special-education leaves returned Cloudflare verification shells, and current Arizona school_district rows are still generic county fallback rows pointing at the statewide AZED special-education root instead of district-owned evidence pages.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (reviewed live Encircle Families homepage, about, services, and resources leaves preserve statewide family-support and training evidence, but no fetched first-party page preserves explicit PTI designation text)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_local_office_roots_challenge_and_doi_fallback_rows (Reviewed 2026-06-22 bounded browser-assisted fetches on Arizona DES local-office roots returned Cloudflare verification shells, while current county_office rows are largely DOI-derived FAA placeholders or generic legacy location rows rather than reviewed county-specific official office leaves.)

## Failure ledger

- district_or_county_education_routing: official_education_root_challenge_and_county_fallback_only_rows :: Reviewed 2026-06-22 bounded browser-assisted fetches on Arizona Department of Education special-education leaves returned Cloudflare verification shells, and current Arizona school_district rows are still generic county fallback rows pointing at https://www.azed.gov/specialeducation instead of district-owned evidence pages.
- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed 2026-06-22 Encircle Families homepage, about, services, and resources leaves preserve Arizona parent-support and training scope, but no live fetched first-party page preserves explicit PTI / Parent Training and Information Center designation text.
- county_local_disability_resources: official_local_office_roots_challenge_and_doi_fallback_rows :: Reviewed 2026-06-22 bounded browser-assisted fetches on Arizona DES local-office roots returned Cloudflare verification shells, while current Arizona county_office rows are largely DOI-derived FAA placeholders or generic legacy location rows rather than reviewed county-specific official office leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_official_education_root_challenge_and_county_fallback_only_rows; samples=3; first=https://www.azed.gov/specialeducation
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=3; first=https://encirclefamilies.org/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_official_local_office_roots_challenge_and_doi_fallback_rows; samples=3; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_district_owned_exact_targets_or_browser_rehydrated_state_directory_exist
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_live_first_party_source
- [critical] county_local_disability_resources: hold_blocked_until_reviewed_county_specific_office_leaves_replace_doi_or_generic_fallback_rows

## Completion decision

- Arizona no longer belongs in UNSTARTED. Reviewed first-party Disability Rights Arizona evidence on disk now truthfully upgrades Protection and Advocacy and statewide disability legal aid from stale missing packet states.
- Disability Rights Arizona is explicit enough for Protection and Advocacy because the saved first-party artifact preserves that DRAZ is the federally mandated protection and advocacy system for Arizona, and it is explicit enough for statewide legal aid because the same saved artifact preserves free legal-services language plus a live assistance intake path.
- Encircle Families is preserved as real reviewed statewide parent-support evidence for Arizona, but the live fetched first-party chain still lacks explicit PTI / Parent Training and Information designation text, so the PTI family remains blocked rather than upgraded by assumption.
- Arizona still cannot reach California-grade or become index-safe because district routing rows still collapse to county fallback entries on the statewide AZED root while the live AZED education leaves challenge in browser, county/local disability resources still depend on DOI or generic locator-style evidence while the live DES office roots challenge in browser, and PTI is not yet explicitly proven at the required designation level.
- Arizona is therefore terminal BLOCKED, not COMPLETE.

## Evidence checks

- Education routing: Reviewed 2026-06-22 bounded browser-assisted fetch on `https://www.azed.gov/specialeducation` returned only a Cloudflare verification shell titled `Just a moment...`; current Arizona `school_districts` rows still point counties such as Apache and Cochise at the same statewide AZED root and label them as county fallbacks.
- Parent training and information center: Reviewed 2026-06-22 live Encircle Families homepage, about, services, and resources leaves. They preserve statewide support, training, and disability-family scope, but none of the fetched first-party pages preserves explicit PTI / Parent Training and Information Center designation text.
- County/local disability resources: Reviewed 2026-06-22 bounded browser-assisted fetch on `https://des.az.gov/` returned only a Cloudflare verification shell titled `Just a moment...`; current `county_offices` rows still rely heavily on DOI-derived FAA placeholders and a generic legacy Arizona locations root.

## Final family count

- strong_critical_families: 9
- weak_critical_families: 3
- missing_critical_families: 0
- district_or_county_education_routing: blocked_official_education_root_challenge_and_county_fallback_only_rows
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation
- county_local_disability_resources: blocked_official_local_office_roots_challenge_and_doi_fallback_rows
