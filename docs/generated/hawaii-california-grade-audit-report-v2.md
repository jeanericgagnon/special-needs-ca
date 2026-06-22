# Hawaii California-Grade Batch 64 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 58
- county_count: 5
- primary_gap_reason: fake_domains_and_access_denied_leaves_broke_prior_hawaii_packet_truth

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (Reviewed live Hawaii DOH Developmental Disabilities Division root now replaces the dead dhhs.hawaii.gov DD sample.)
- early_intervention_part_c: missing (Current packet relied on dhhs.hawaii.gov/earlystart, which does not resolve, and no reviewed real official Part C page has yet replaced it.)
- special_education_idea_part_b: blocked_official_leaf_access_denied (The likely official Hawaii public schools special-education leaf redirects and then returns HTTP 403, so statewide IDEA Part B still lacks a reviewed exact authority leaf.)
- district_or_county_education_routing: blocked_statewide_school_root_only (District or county education routing still depends on the statewide Hawaii public schools root; the likely special-education leaf returns HTTP 403 and no county- or district-owned leaves are yet reviewed.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- legal_aid: blocked_reviewed_statewide_support_source_not_explicit_legal_aid_route (reviewed first-party statewide support evidence exists, but the saved artifact does not preserve an explicit statewide legal-aid route)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_fake_domain_and_doi_fallback (County/local disability resources still depend on a dead dhhs.hawaii.gov/locations root plus DOI-derived office extracts instead of reviewed county-specific official leaves.)

## Failure ledger

- early_intervention_part_c: fake_domain_sample_requires_real_part_c_replacement :: The current Hawaii Early Intervention family still points to dhhs.hawaii.gov/earlystart, but that domain does not resolve in live checks and no reviewed real official Part C leaf is yet on disk.
- special_education_idea_part_b: official_special_education_leaf_access_denied :: The likely official Hawaii public schools special-education leaf (https://www.hawaiipublicschools.org/TeachingAndLearning/SpecializedPrograms/SpecialEducation/) redirects and then returns HTTP 403, so statewide IDEA Part B still lacks a reviewed exact authority leaf.
- district_or_county_education_routing: statewide_school_root_only_and_special_education_leaf_403 :: District routing still depends on the statewide Hawaii public schools root, and the likely special-education leaf (https://www.hawaiipublicschools.org/TeachingAndLearning/SpecializedPrograms/SpecialEducation/) returns HTTP 403 instead of county- or district-grade routing evidence.
- legal_aid: reviewed_statewide_support_source_not_explicit_legal_aid_route :: Reviewed Hawaii Disability Rights Center evidence proves statewide rights-routing, casework scope, and apply-for-assistance routing, but the saved first-party artifact does not preserve an explicit statewide legal-aid or legal-representation statement strong enough to satisfy the legal-aid family.
- county_local_disability_resources: dead_locations_root_and_doi_directory_fallback :: County-local disability resources still depend on dhhs.hawaii.gov/locations, which does not resolve, plus DOI-derived office extracts rather than reviewed county-specific official leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://health.hawaii.gov/ddd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://health.hawaii.gov/ddd/
- early_intervention_part_c: missing; samples=0
- special_education_idea_part_b: blocked_official_leaf_access_denied; samples=0
- district_or_county_education_routing: blocked_statewide_school_root_only; samples=1; first=https://www.hawaiipublicschools.org/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://health.hawaii.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.hawaiidisabilityrights.org/
- parent_training_information_center: verified_state_grade; samples=1; first=http://www.ldahawaii.org/
- legal_aid: blocked_reviewed_statewide_support_source_not_explicit_legal_aid_route; samples=1; first=http://www.hawaiidisabilityrights.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_fake_domain_and_doi_fallback; samples=2; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] early_intervention_part_c: author_real_official_part_c_leaf
- [major] special_education_idea_part_b: author_reviewed_special_education_authority_leaf
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] legal_aid: hold_blocked_until_reviewed_first_party_legal_help_route_is_verified
- [critical] county_local_disability_resources: author_reviewed_county_specific_office_leaves

## Completion decision

- Hawaii still preserves real statewide protection-and-advocacy and PTI evidence from first-party reviewed artifacts, and the developmental-disability family can now point to the live Hawaii DOH DDD root instead of the dead dhhs.hawaii.gov sample.
- Early intervention is no longer safely verified because the current packet relied on dhhs.hawaii.gov/earlystart, which does not resolve, and no reviewed real official Part C replacement is yet on disk.
- The likely official statewide special-education leaf (https://www.hawaiipublicschools.org/TeachingAndLearning/SpecializedPrograms/SpecialEducation/) redirects and then returns HTTP 403, so both IDEA Part B and district-or-county education routing remain blocked on current exact official evidence.
- County/local disability resources remain blocked because the old dhhs.hawaii.gov/locations root is dead and the remaining office evidence is DOI-derived rather than reviewed county-specific official leaves.
- Hawaii therefore remains BLOCKED and not index-safe, with a lower but truer completeness score until those fake-domain and access-denied leaves are replaced by reviewed official sources.
