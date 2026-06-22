# Colorado California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 64
- primary_gap_reason: district_grade_education_and_county_local_office_proof_still_unverified

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_statewide_cde_fallback_rows_only (Reviewed current Colorado school_district rows on 2026-06-22. All 64 county-linked school_district rows still collapse to the same statewide CDE special-education URL https://www.cde.state.co.us/cdesped, including county fallback names like Adams, Alamosa, and Arapahoe, so no district-owned education leaf is currently verified for California-grade county routing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- legal_aid: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_doi_mirror_county_rows_only (Reviewed current Colorado county_offices rows on 2026-06-22. At least 67 county-office rows for Colorado counties still use the DOI mirror https://doi.org/10.7910/DVN/AVRHMI with source_listed evidence levels, including Adams, Alamosa, Arapahoe, and Boulder, so county-local office routing is still backed by mirror data rather than reviewed county-owned leaves.)

## Failure ledger

- district_or_county_education_routing: all_counties_still_use_statewide_cde_special_education_root :: Reviewed current Colorado school_district rows on 2026-06-22. All 64 county-linked school_district rows still collapse to the same statewide CDE special-education URL https://www.cde.state.co.us/cdesped, including county fallback names like Adams, Alamosa, and Arapahoe, so no district-owned education leaf is currently verified for California-grade county routing.
- county_local_disability_resources: county_office_rows_still_backed_by_doi_mirror :: Reviewed current Colorado county_offices rows on 2026-06-22. At least 67 county-office rows for Colorado counties still use the DOI mirror https://doi.org/10.7910/DVN/AVRHMI with source_listed evidence levels, including Adams, Alamosa, Arapahoe, and Boulder, so county-local office routing is still backed by mirror data rather than reviewed county-owned leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://hcpf.colorado.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.colorado.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.colorado.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.cde.state.co.us/cdesped
- district_or_county_education_routing: blocked_statewide_cde_fallback_rows_only; samples=3; first=https://www.cde.state.co.us/cdesped
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://hcpf.colorado.gov/developmental-disabilities
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilitylawco.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://peakparent.org
- legal_aid: verified_state_grade; samples=1; first=https://www.coloradolegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_doi_mirror_county_rows_only; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Colorado still cannot reach California-grade or become index-safe because district or county education routing still collapses to one statewide CDE root across all 64 counties, and county/local disability resources still rely on DOI mirror rows instead of reviewed county-owned office leaves.
- Colorado is therefore still BLOCKED and not index-safe, but the remaining blockers are now tied to exact fallback row classes rather than vague inventory counts.
