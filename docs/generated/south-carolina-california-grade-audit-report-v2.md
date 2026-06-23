# South Carolina California-Grade Batch 83 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 46
- primary_gap_reason: official_school_directory_root_is_live_but_not_yet_converted_into_district_owned_special_education_leaves

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights South Carolina evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: verified_state_grade (authoritative Parent Center Hub South Carolina leaf explicitly labels Family Connection of SC as the South Carolina PTI serving the entire state)
- legal_aid: verified_state_grade (reviewed first-party South Carolina Legal Services evidence preserves statewide low-income civil legal-aid identity plus direct intake routing on the live first-party domain)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (reviewed live official SCDSS contact hub now links 46 county-named DSS office leaves with county-specific office addresses and county-specific DSS email routing)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://ddsn.sc.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.south-carolina.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.south-carolina.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://ed.sc.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://ed.sc.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ddsn.sc.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightssc.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/south-carolina/
- legal_aid: verified_state_grade; samples=1; first=https://sclegal.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=46; first=https://dss.sc.gov/contact-dss/

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets

## Completion decision

- South Carolina no longer belongs in UNSTARTED because the packet now preserves reviewed or authoritative statewide P&A, PTI, legal-aid, and county-local DSS routing evidence on disk instead of only legacy inventory rows.
- Disability Rights South Carolina is preserved as statewide protection-and-advocacy support from the reviewed first-party domain.
- Parent Center Hub now clears PTI because its South Carolina leaf explicitly labels Family Connection of SC as the South Carolina PTI serving the entire state.
- South Carolina Legal Services is preserved as statewide legal aid because the reviewed first-party page explicitly describes a statewide civil legal-services role for low-income South Carolinians and preserves direct intake routes.
- The official SCDSS contact stack now clears county-local routing because the first-party hub links 46 county-named DSS office leaves with county-specific office addresses and county-specific DSS email routing.
- South Carolina still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves.
- South Carolina is therefore terminal BLOCKED, not COMPLETE.
