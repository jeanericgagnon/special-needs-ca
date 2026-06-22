# Delaware California-Grade Batch 63 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 3
- primary_gap_reason: legacy_or_inventory_only_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- legal_aid: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- special_education_idea_part_b: legacy_or_inventory_only_evidence :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 15 generic roots need leaf verification
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 15 generic roots need leaf verification
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 15 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhss.delaware.gov/ddds/hcbs/eligibility.html
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.delaware.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.delaware.gov/earlystart
- special_education_idea_part_b: legacy_state_grade; samples=0
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.doe.k12.de.us/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhss.delaware.gov/ddds
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.declasi.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://picofdel.org/
- legal_aid: verified_state_grade; samples=1; first=http://www.declasi.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [major] special_education_idea_part_b: author_verified_state_manifest
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Delaware no longer belongs in UNSTARTED. Reviewed first-party CLASI and PIC of Delaware evidence on disk now truthfully upgrades all three statewide support families from stale missing or inventory-only packet states.
- CLASI is explicit enough for Protection and Advocacy because the saved first-party artifact preserves Disability Rights Delaware as Delaware’s designated Protection & Advocacy system, and it is explicit enough for statewide legal aid because the same reviewed artifact preserves free legal-services language plus direct disability-rights and Get Help routing.
- PIC of Delaware is explicit enough for PTI because the saved first-party artifact preserves the Parent Training and Information Center (PTI) Project designation plus direct consultation routing for Delaware families.
- Delaware still cannot reach California-grade or become index-safe because statewide special-education authority remains legacy-only, district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, and county/local disability resources still depend on generic or statewide locator-style evidence.
- Delaware is therefore terminal BLOCKED, not COMPLETE.
