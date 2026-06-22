# Indiana California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 92
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-22 the live official Indiana DOE school-directory XLSX. The official CORP sheet now provides county-grade district routing: 460 corporation rows cover all 92 Indiana counties and preserve corporation name, superintendent email, phone, address, and corporation homepage. That county-mapped official directory is sufficient district-owned routing evidence, so district_or_county_education_routing now passes.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed authoritative Parent Center Hub Indiana state leaf plus current INSOURCE first-party pages now preserve both the PTI designation and statewide Indiana family-support routing.)
- legal_aid: verified_state_grade (Indiana Legal Services now provides reviewed statewide first-party legal-aid routing from a live homepage.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed current official Indiana DFR county-map page now preserves county-by-county office details directly in the fetched HTML for all 92 counties. Although the embedded county href paths currently 404, the live official county-map surface itself contains the address, phone, office hours, and zip-routing details needed for county-grade local-office proof.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.in.gov/fssa/ddrs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.indiana.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.indiana.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.in.gov/doe/students/special-education/
- district_or_county_education_routing: verified_county_grade; samples=3; first=https://www.in.gov/doe/files/2025-2026-school-directory-2026-03-23.xlsx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.in.gov/fssa/ddrs
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.in.gov/idr/
- parent_training_information_center: verified_state_grade; samples=3; first=https://www.parentcenterhub.org/findurcenter/indiana/
- legal_aid: verified_state_grade; samples=1; first=https://www.indianalegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=3; first=https://www.in.gov/fssa/dfr/ebt-hoosier-works-card/find-my-local-dfr-office/

## Next actions

- [info] maintenance: Preserve Indiana as COMPLETE/index_safe and rerun only maintenance truth audits unless new evidence regresses.

## Completion decision

- Indiana now reaches California-grade and is index-safe.
- The live official Indiana DOE school-directory CORP sheet is a real county-mapped district-routing source, not generic statewide fallback.
- Because all 92 counties are covered by one or more official corporation rows with district-owned or district-contact routing fields, the last education blocker is cleared.
