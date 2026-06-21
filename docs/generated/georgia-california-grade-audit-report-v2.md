# Georgia California-Grade Batch 2 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 50
- county_count: 159
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: missing (no credible current evidence)
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- developmental_disability_idd_authority: generic_or_statewide_evidence_used_where_local_required :: 12 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 13 generic roots need leaf verification
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 12 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 13 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Georgia.
- parent_training_information_center: legacy_or_inventory_only_evidence :: 12 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 13 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Georgia.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 12 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 13 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dph.georgia.gov/babies-cant-wait
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dbhdd.georgia.gov/nowcomp
- developmental_disability_idd_authority: legacy_state_grade; samples=3; first=https://dbhdd.georgia.gov/region-1-field-office
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dph.georgia.gov/babies-cant-wait
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.csraresa.org
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.cherokeek12.net
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=0
- protection_and_advocacy: missing; samples=3; first=https://thegao.org
- parent_training_information_center: inventory_only; samples=3; first=https://www.p2pga.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.georgiaable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] developmental_disability_idd_authority: author_county_or_district_exact_targets
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Georgia remains BLOCKED and not index-safe because one or more critical families are still legacy, inventory-only, or missing.

## Batch 20 exact leaf verification

- developmental_disability_idd_authority: verified exact leaf targets -> https://dbhdd.georgia.gov/regional-field-office-county, https://dbhdd.georgia.gov/regional-field-offices, https://dbhdd.georgia.gov/contacts/east-central-regional-hospital-mental-health-campus
- county_local_disability_resources: verified exact leaf targets -> https://dfcs.georgia.gov/locations

- Georgia remains BLOCKED and not index-safe until every critical family passes county-grade proof.

## Batch 21 statewide mapping repair

- county_local_disability_resources: Official DFCS county offices directory lists county office coverage across 159/159 Georgia counties.

- Georgia remains gated unless every critical family reaches California-grade proof.

## Batch 24 Georgia repair

- district_or_county_education_routing: verified district-owned exact leaves -> https://www.cherokeek12.net/divisions/curriculum-instruction/special-educationsection-504, https://www.cherokeek12.net/divisions/curriculum-instruction/special-educationsection-504/parent-rights, https://www.clayton.k12.ga.us/departments/special-education, https://www.clayton.k12.ga.us/departments/student-services, https://www.clarke.k12.ga.us/o/elc/page/preschool-special-education/
- developmental_disability_idd_authority: remained blocked after bounded live re-check; official county table exposed 159 region rows but 159/159 county cells were blank in static HTML.

- Georgia remains BLOCKED and not index-safe until every critical family reaches California-grade proof.
