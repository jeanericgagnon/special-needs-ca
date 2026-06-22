# Connecticut California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 8
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-22 bounded first-party district checks for one district-owned education-routing leaf in each Connecticut county: Fairfield Public Schools Special Education (Fairfield) https://www.fairfieldschools.org/departments/special-education, Hartford Public Schools Special Education (Hartford) https://www.hartfordschools.org/page/special-education/, Torrington Public Schools Special Education (Litchfield) https://www.torrington.org/departments/departments/student-services/special-education, Middletown Public Schools Special Education & Pupil Services (Middlesex) https://www.middletownschools.org/page/special-education-and-pupil-services/, New Haven Public Schools Office of Special Education & Student Services (New Haven) https://www.nhps.net/page/office-of-special-education-student-services/, Norwich Public Schools Student Services & Special Education (New London) https://www.norwichpublicschools.org/departments/student-services-special-education, Vernon Public Schools Office of Pupil Services (Tolland) https://www.vernonpublicschools.org/page/office-of-pupil-services/, and Windham Public Schools Pupil Services (Windham) https://www.windhamps.org/page/pupil-services/. All eight pages resolved on district-controlled domains and preserved direct district-owned education-routing department titles, replacing Connecticut’s statewide SDE fallback rows.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (The live first-party CPAC About page now explicitly preserves federally funded Parent Training and Information (PTI) Center designation text.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Connecticut DDS county-local routing is now recoverable from live official first-party pages: the DDS Regions hub names the counties served by North, South, and West, and the public regional general-contact pages preserve region headquarters, satellite offices, phones, emails, and toll-free numbers. New Haven county remains dual-routed because the official hub assigns New Haven broadly to South while explicitly assigning Northern New Haven to West.)

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://portal.ct.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.connecticut.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.connecticut.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://portal.ct.gov/sde/special-education
- district_or_county_education_routing: verified_county_grade; samples=8; first=https://www.fairfieldschools.org/departments/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://portal.ct.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disrightsct.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://cpacinc.org/about.aspx
- legal_aid: verified_state_grade; samples=1; first=https://www.disrightsct.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=9; first=https://portal.ct.gov/dds/about/dds-regions

## Completion decision

- Connecticut now has county-grade district routing because each of its eight counties has a reviewed district-owned education-routing leaf on a first-party district domain.
- Connecticut already had county-local DDS routing and statewide authority coverage for the remaining critical families.
- Connecticut is therefore COMPLETE and index-safe under the hardened California-grade gate.
