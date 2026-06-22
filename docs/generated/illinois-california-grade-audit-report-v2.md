# Illinois California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 102
- primary_gap_reason: county_grade_coverage_still_incomplete_after_exact_target_verification

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed ROE-owned education exact leaves verified (3), but district-grade coverage still cannot be proven for all 102 counties from the authored exact targets.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Illinois DRS Services is already present as reviewed official statewide VR routing evidence.)
- protection_and_advocacy: verified_state_grade (Equip for Equality is already present as reviewed first-party statewide P&A evidence.)
- parent_training_information_center: regional_only_reviewed_source (The reviewed Family Matters PTIC sample remains downstate-only, and FRCD now states on its own site that Family Matters PTIC became the official Illinois PTIC as of October 1, 2025. The packet still lacks reviewed statewide PTI proof for the designated family.)
- legal_aid: verified_state_grade (Illinois Legal Aid Online now provides reviewed Illinois statewide legal-help routing from a first-party portal.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Official IDHS Office Locator replaced the dead county-office page and now serves as the verified county/local routing surface.)

## Failure ledger

- district_or_county_education_routing: bounded_roe_leaf_packet_exhausted_before_county_grade_coverage :: Verified exact leaves remain limited to 3 reviewed ROE-owned pages; this does not truthfully prove district-grade routing statewide.
- parent_training_information_center: reviewed_pti_sample_is_regional_and_designated_statewide_target_now_points_to_successor :: Reviewed PTI evidence currently points to https://www.fmptic.org, which is documented as serving downstate Illinois, while https://frcd.org now states that Family Matters PTIC became the official PTIC for Illinois as of October 1, 2025. The packet still lacks reviewed statewide proof for the designated PTI family.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=29737
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=47257
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=31182
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.dhs.state.il.us/page.aspx?item=31183
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.roe1.net
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=3; first=https://www.roe1.net/about-us/contact-us/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dhs.state.il.us/page.aspx?item=29737
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.equipforequality.org
- parent_training_information_center: regional_only_reviewed_source; samples=1; first=https://www.fmptic.org
- legal_aid: verified_state_grade; samples=1; first=https://www.illinoislegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://illinoisable.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=1; first=https://www.dhs.state.il.us/page.aspx?item=26210

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored
- [major] parent_training_information_center: hold_blocked_until_reviewed_statewide_illinois_pti_source_is_verified

## Illinois final blocker decision

- District or county education routing remains blocked because only 3 reviewed ROE-owned exact leaves have been verified; that is not enough to truthfully prove district-grade routing across all 102 Illinois counties without reopening broader district authoring.
- Parent training information center remains below California-grade because the current reviewed sample https://www.fmptic.org is only documented as serving downstate Illinois, and the designated statewide target https://frcd.org now states that Family Matters PTIC became the official PTIC for Illinois as of October 1, 2025. The packet still lacks reviewed statewide PTI proof for the designated family.
- Legal aid is now verified at the statewide support layer because Illinois Legal Aid Online is a reviewed Illinois statewide legal-help portal with direct legal-help routing and legal resources for people with disabilities.
- Illinois remains blocked and not index-safe until district-grade education leaves expand beyond the current bounded ROE set and a reviewed statewide PTI source is verified.
