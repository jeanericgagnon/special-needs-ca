# West Virginia California-Grade Batch 90 Report v1

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 55
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 first-party West Virginia education routing surfaces. The live WVDE homepage links directly to the official `School Directory/Closings` host. The public WV School Directory then exposes `Browse schools by county` and visibly lists county entries including Barbour, Berkeley, Boone, Kanawha, and Wyoming, plus a linked superintendent listing asset. Reviewed county pages such as Barbour County Schools preserve the county office address, phone, county website, superintendent name, and linked school list on the same official directory host. This replaces West Virginia’s old statewide education fallback with current public county-grade routing evidence.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party DRWV artifact explicitly preserves statewide protection-and-advocacy rights and referral language on the live domain)
- parent_training_information_center: verified_state_grade (reviewed first-party WVPTI artifact explicitly preserves the state Parent Training Center role on the live domain)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 the live first-party Legal Aid WV domain after the legacy `lawv.net` root redirected to `legalaidwv.org`. The homepage states that `We believe all West Virginians deserve an equal chance at justice, in the courtroom and in their communities`, and the Legal Services page states that Legal Aid of WV provides free information, advice and representation on civil legal issues while helping people receive the education and health care they need. The Get Help section also preserves direct Apply For Help and Eligibility routes on the same first-party domain. This supplies current statewide legal-aid evidence for West Virginia.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 official successor West Virginia Department of Human Services surfaces. The live DoHS homepage now links directly to `Find Field Offices`, and the public Field Offices page exposes a county selector with all 55 counties, including Barbour County through Wyoming County. Reviewed county-filtered pages preserve county-specific office records such as Barbour County DoHS Office at 49 Mattaliano Drive in Philippi with phone 304-457-9030 and Berkeley County DoHS Office at 433 Mid Atlantic Pkwy in Martinsburg with phone 304-267-0100, alongside child-support office variants on the same host. This replaces the old generic or structural county-office evidence with current official county-filtered local office routing on the live DoHS host family.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhhr.wv.gov/bms/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.west-virginia.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.west-virginia.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://wvde.us/
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://wvde.us/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhhr.wv.gov/bms
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drofwv.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://wvpti.org
- legal_aid: verified_state_grade; samples=3; first=https://legalaidwv.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=4; first=https://dohs.wv.gov/

## Next actions

- none

## Completion decision

- West Virginia is now `COMPLETE` and `index_safe=true`.
- `district_or_county_education_routing` now clears because the official WV School Directory publicly browses county school systems and preserves county office address, phone, superintendent, county website, and school-list routing on reviewed county pages.
- `county_local_disability_resources` now clears because the successor DoHS Field Offices directory exposes all 55 counties and returns county-filtered office cards with direct local addresses and phone numbers on the official host.
- `legal_aid` now clears because Legal Aid WV preserves statewide justice, get-help, and free civil legal-services language on its first-party domain.
