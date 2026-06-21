# Ohio California-Grade Batch 2 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 50
- county_count: 88
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: inventory_only (only legacy inventory hints or weak role matches exist)
- protection_and_advocacy: missing (no credible current evidence)
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 5 inventory rows use DB-field agency labels; 43 inventory rows show federal/state mismatch; 14 generic roots need leaf verification
- vocational_rehabilitation_pre_ets: legacy_or_inventory_only_evidence :: 5 inventory rows use DB-field agency labels; 43 inventory rows show federal/state mismatch; 14 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Ohio.
- parent_training_information_center: legacy_or_inventory_only_evidence :: 5 inventory rows use DB-field agency labels; 43 inventory rows show federal/state mismatch; 14 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Ohio.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 5 inventory rows use DB-field agency labels; 43 inventory rows show federal/state mismatch; 14 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://dodd.ohio.gov/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://ohioearlyintervention.org/
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.allencountyesc.org
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.akron.k12.oh.us
- vocational_rehabilitation_pre_ets: inventory_only; samples=0
- protection_and_advocacy: missing; samples=0
- parent_training_information_center: inventory_only; samples=0
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.stableaccount.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_verified_state_manifest
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Ohio remains BLOCKED and not index-safe because one or more critical families are still legacy, inventory-only, or missing.

## Batch 20 exact leaf verification

- district_or_county_education_routing: verified exact leaf targets -> https://www.soesc.org/StaffDirectory.aspx, https://www.allencountyesc.org/StaffDirectory.aspx, https://www.allencountyesc.org/SpecialEducation.aspx

- Ohio remains BLOCKED and not index-safe until every critical family passes county-grade proof.

## Batch 25 Ohio repair

- district_or_county_education_routing: verified ESC-owned exact leaves -> https://www.youresc.k12.oh.us/special-education-student-services/, https://www.youresc.k12.oh.us/staff-directory/, https://www.ashtabulaesc.org/services-1, https://www.athensmeigs.com/departments/special-education, https://www.athensmeigs.com/services/student-services, https://www.ecoesc.org/specialeducation/
- county_local_disability_resources: Bounded official county directory targets failed: https://jfs.ohio.gov/county/county_directory.pdf => 404; https://jfs.ohio.gov/county/ => 404; https://jfs.ohio.gov/County/County_Directory.stm => 404; https://odjfs.ohio.gov/ => fetch failed; https://jobandfamilyservices.ohio.gov/ => fetch failed

- Ohio remains BLOCKED and not index-safe until every critical family reaches California-grade proof.

## Batch 31 Ohio county blocker refresh

- county_local_disability_resources: Bounded official county directory targets failed: https://jfs.ohio.gov/county/county_directory.pdf => 404; https://jfs.ohio.gov/county/ => 404; https://jfs.ohio.gov/County/County_Directory.stm => 404; https://odjfs.ohio.gov/ => fetch failed; https://jobandfamilyservices.ohio.gov/ => fetch failed; https://jobandfamilyservices.ohio.gov/wps/portal/gov/jfs/ => fetch failed; https://odjfs.ohio.gov/wps/portal/gov/odjfs/ => fetch failed; https://jobandfamilyservices.ohio.gov/county-agencies => fetch failed; https://jfs.ohio.gov/wps/portal/gov/jfs/county-agencies => 404
- district_or_county_education_routing: queue wording refreshed to keep the live exact-leaf expansion lane as the active next action.
- No new reusable lesson was promoted from Batch 31; the existing dead-official-directory and fail-closed county-local lessons remain authoritative.

- Ohio remains BLOCKED and not index-safe until every critical family reaches California-grade proof.
