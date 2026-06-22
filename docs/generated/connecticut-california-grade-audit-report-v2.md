# Connecticut California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 8
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_statewide_ct_sde_fallback_rows_only (Reviewed current Connecticut school_district rows on 2026-06-22. Six county-linked rows still point to the statewide CDE special-education leaf https://portal.ct.gov/sde/special-education, and the remaining Fairfield and Hartford rows still point only to the generic CT SDE root https://portal.ct.gov/sde, so no district-owned education leaf is currently verified for any of Connecticut’s 8 counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (Reviewed 2026-06-22 live CPAC homepage plus bounded same-domain follow-ups. The homepage exposed only two same-domain links, likely About roots and sitemap endpoints returned 404, and no fetched first-party page preserved explicit PTI / Parent Training and Information designation text. CPAC still proves statewide Connecticut family-support and training scope, but not the exact PTI designation required for California-grade statewide support.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_doi_and_generic_locations_rows_only (Reviewed current Connecticut county_offices rows on 2026-06-22. Eleven county-office rows still use the DOI mirror https://doi.org/10.7910/DVN/AVRHMI with source_listed evidence, and the remaining Tolland row still points only to the generic locations root https://dhhs.connecticut.gov/locations, so county-local office routing is not yet backed by reviewed county-owned leaves.)

## Failure ledger

- district_or_county_education_routing: all_counties_still_use_statewide_ct_sde_roots :: Reviewed current Connecticut school_district rows on 2026-06-22. Six county-linked rows still point to the statewide CDE special-education leaf https://portal.ct.gov/sde/special-education, and the remaining Fairfield and Hartford rows still point only to the generic CT SDE root https://portal.ct.gov/sde, so no district-owned education leaf is currently verified for any of Connecticut’s 8 counties.
- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed 2026-06-22 live CPAC homepage plus bounded same-domain follow-ups. The homepage exposed only two same-domain links, likely About roots and sitemap endpoints returned 404, and no fetched first-party page preserved explicit PTI / Parent Training and Information designation text. CPAC still proves statewide Connecticut family-support and training scope, but not the exact PTI designation required for California-grade statewide support.
- county_local_disability_resources: county_office_rows_still_backed_by_doi_or_generic_locations_root :: Reviewed current Connecticut county_offices rows on 2026-06-22. Eleven county-office rows still use the DOI mirror https://doi.org/10.7910/DVN/AVRHMI with source_listed evidence, and the remaining Tolland row still points only to the generic locations root https://dhhs.connecticut.gov/locations, so county-local office routing is not yet backed by reviewed county-owned leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://portal.ct.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.connecticut.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.connecticut.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://portal.ct.gov/sde/special-education
- district_or_county_education_routing: blocked_statewide_ct_sde_fallback_rows_only; samples=3; first=https://portal.ct.gov/sde/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://portal.ct.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disrightsct.org/
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=1; first=https://cpacinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.disrightsct.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_doi_and_generic_locations_rows_only; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Connecticut still cannot reach California-grade or become index-safe because district routing remains statewide-root fallback only across all 8 counties, county-local office routing still relies on DOI mirror plus one generic locations root row, and CPAC still lacks explicit PTI designation text in the reviewed first-party chain.
- Connecticut is therefore still BLOCKED and not index-safe, but the remaining blockers are now tied to exact row classes and bounded first-party PTI failure evidence.
