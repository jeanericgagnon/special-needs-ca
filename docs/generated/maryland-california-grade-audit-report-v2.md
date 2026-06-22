# Maryland California-Grade Batch 69 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 24
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed Disability Rights Maryland About page explicitly preserves designated Protection & Advocacy language.)
- parent_training_information_center: verified_state_grade (Reviewed Parents’ Place of Maryland About page explicitly preserves PTI designation.)
- legal_aid: verified_state_grade (Reviewed Maryland Legal Aid homepage now provides direct statewide free civil legal services evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dda.health.maryland.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maryland.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maryland.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://marylandpublicschools.org/programs/SpecialEducation/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://marylandpublicschools.org/programs/SpecialEducation/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dda.health.maryland.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsmd.org/about/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.ppmd.org/about-us/
- legal_aid: verified_state_grade; samples=1; first=https://www.mdlab.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.maryland.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Maryland Parents’ Place of Maryland now clears PTI because the reviewed About page explicitly says it serves as Maryland’s Parent Training and Information Center.
- Maryland Disability Rights now clears protection and advocacy because the reviewed About page preserves Maryland’s designated Protection & Advocacy language.
- Maryland Legal Aid now clears legal aid because the reviewed homepage explicitly states free civil legal services and statewide intake.
- Maryland district/county education routing remains blocked because district rows still depend on generic statewide fallback pages instead of county- or district-owned leaves.
- Maryland county/local disability resources remain blocked because packet rows still depend on generic statewide or structural sources instead of reviewed county-owned local routing.
- Maryland is therefore still truthfully BLOCKED and not index-safe. The only remaining blockers are the two county-grade local-routing families.
