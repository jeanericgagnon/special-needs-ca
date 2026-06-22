# Delaware California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 3
- primary_gap_reason: legacy_or_inventory_only_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (reviewed live Delaware DOE navigation now preserves an exact statewide special-education authority leaf)
- district_or_county_education_routing: blocked_statewide_de_doe_root_rows_only (Reviewed current Delaware school_district rows on 2026-06-22. All 3 county-linked district-routing rows still point only to the statewide Delaware DOE root https://www.doe.k12.de.us/ rather than district-owned special-education leaves, so no county-grade district routing page is currently verified for Kent, New Castle, or Sussex.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- legal_aid: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_doi_mirror_county_rows_only (Reviewed current Delaware county_offices rows on 2026-06-22. Nineteen county-office rows still use the DOI mirror https://doi.org/10.7910/DVN/AVRHMI with source_listed evidence, so county-local office routing remains backed by mirror data rather than reviewed county-owned leaves.)

## Failure ledger

- district_or_county_education_routing: all_counties_still_use_statewide_de_doe_root :: Reviewed current Delaware school_district rows on 2026-06-22. All 3 county-linked district-routing rows still point only to the statewide Delaware DOE root https://www.doe.k12.de.us/ rather than district-owned special-education leaves, so no county-grade district routing page is currently verified for Kent, New Castle, or Sussex.
- county_local_disability_resources: county_office_rows_still_backed_by_doi_mirror :: Reviewed current Delaware county_offices rows on 2026-06-22. Nineteen county-office rows still use the DOI mirror https://doi.org/10.7910/DVN/AVRHMI with source_listed evidence, so county-local office routing remains backed by mirror data rather than reviewed county-owned leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhss.delaware.gov/ddds/hcbs/eligibility.html
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.delaware.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.delaware.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.delaware.gov/families/k12/special-education/
- district_or_county_education_routing: blocked_statewide_de_doe_root_rows_only; samples=3; first=https://www.doe.k12.de.us/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhss.delaware.gov/ddds
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.declasi.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://picofdel.org/
- legal_aid: verified_state_grade; samples=1; first=http://www.declasi.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_doi_mirror_county_rows_only; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Delaware now has reviewed statewide special-education authority evidence again, because the live DOE navigation exposes an exact current special-education leaf that resolves to the legacy special-education page.
- Delaware still cannot reach California-grade or become index-safe because district routing remains statewide-root fallback only across all 3 counties and county-local office routing still relies on DOI mirror rows instead of reviewed county-owned office leaves.
- Delaware is therefore still BLOCKED and not index-safe, but the remaining blockers are now limited to exact local-proof failures.
