# Virginia California-Grade Batch 88 Report v1

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 95
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 first-party Virginia School Quality Profiles pages. The public Divisions Archive explicitly offers `Browse All Virginia Divisions`, shows `Showing 1 to 30 of 133 results`, and visibly lists division rows such as Accomack County Public Schools and Albemarle County Public Schools. Reviewed division detail pages such as Fairfax County Public Schools preserve the division number, mailing address, superintendent, region, and division website on the same official host. This is current first-party public district-routing evidence that replaces Virginia’s old statewide fallback.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party dLCV evidence preserves Virginia statewide protection-and-advocacy designation on the live first-party domain)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 the live first-party PEATC About page. The page explicitly states that the Parent Educational Advocacy Training Center (PEATC) `is the parent information and training center serving families and professionals of children with disabilities in the Commonwealth of Virginia` and further says PEATC has become a leader in special education, training, and advocacy throughout the Commonwealth. This resolves Virginia’s prior inventory-only PTI evidence gap with explicit first-party designation language.)
- legal_aid: verified_state_grade (reviewed first-party dLCV evidence preserves Virginia statewide disability legal-rights routing on the live first-party domain)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 first-party Virginia Department of Social Services local-agency directory pages. The live `Find Your Local Department` page tells families to use the page to find their local department of social services in Virginia and states that they can `Search by county or use the filters` to narrow results by region or department name. The same public page preserves county or local department cards such as Accomack Department of Social Services, Albemarle County Department of Social Services, and Alleghany-Covington Department of Social Services. This replaces the old DOI mirror-backed office evidence with current first-party county/local routing on the official DSS host.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dbhds.virginia.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.virginia.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.virginia.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.doe.virginia.gov/programs-services/special-education
- district_or_county_education_routing: verified_state_grade; samples=3; first=https://schoolquality.virginia.gov/divisions
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dbhds.virginia.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.dlcv.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://peatc.org/about/
- legal_aid: verified_state_grade; samples=1; first=https://www.dlcv.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=4; first=https://www.dss.virginia.gov/localagency/index.php

## Next actions

- none

## Completion decision

- Virginia is now `COMPLETE` and `index_safe=true`.
- `district_or_county_education_routing` now clears because the official Virginia School Quality Profiles host publicly enumerates all 133 divisions and exposes reviewed division detail fields including address, superintendent, region, and division website.
- `county_local_disability_resources` now clears because the official DSS local-department directory is explicitly county-searchable and preserves named local department cards on the live state host.
- `parent_training_information_center` now clears because the first-party PEATC About page explicitly identifies PEATC as Virginia’s parent information and training center.
