# Delaware California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 3
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (reviewed live Delaware DOE navigation now preserves an exact statewide special-education authority leaf)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-22 bounded first-party district checks for one district-owned education-routing leaf in each Delaware county: Capital School District (Kent) https://www.capital.k12.de.us/programs_and_services/special_education, Brandywine School District (New Castle) https://www.brandywineschools.org/learning/supporting-our-unique-learners/special-education, and Indian River School District (Sussex) https://www.irsd.net/departments/special-services. All three pages resolved on district-controlled domains and preserved direct special-education or special-services routing language, so Delaware now has one county-specific district-owned routing source for Kent, New Castle, and Sussex.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- legal_aid: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (The live DHSS State Service Centers page preserves county-grouped local office routing directly in HTML for New Castle, Kent, and Sussex.)

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhss.delaware.gov/ddds/hcbs/eligibility.html
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.delaware.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.delaware.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.delaware.gov/families/k12/special-education/
- district_or_county_education_routing: verified_county_grade; samples=3; first=https://www.capital.k12.de.us/programs_and_services/special_education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhss.delaware.gov/ddds
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.declasi.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://picofdel.org/
- legal_aid: verified_state_grade; samples=1; first=http://www.declasi.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=1; first=https://dhss.delaware.gov/dss/division-of-social-services/state-service-centers/

## Completion decision

- Delaware now has county-grade district routing because each of its three counties has a reviewed district-owned special-education or special-services leaf on a first-party district domain.
- Delaware already had county-local routing from the DHSS State Service Centers page and statewide authority coverage for the remaining critical families.
- Delaware is therefore COMPLETE and index-safe under the hardened California-grade gate.
