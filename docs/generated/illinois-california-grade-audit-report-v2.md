# Illinois California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
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
- parent_training_information_center: regional_only_reviewed_source (The current reviewed PTI sample https://www.fmptic.org is documented as serving downstate Illinois, while the designated statewide PTI target on disk is https://www.frcd.org; statewide PTI proof is still unverified.)
- legal_aid: missing_verified_source (Only the authored LSC planning target https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help is present; no reviewed Illinois legal-aid source has been verified into the packet.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Official IDHS Office Locator replaced the dead county-office page and now serves as the verified county/local routing surface.)

## Failure ledger

- district_or_county_education_routing: bounded_roe_leaf_packet_exhausted_before_county_grade_coverage :: Verified exact leaves remain limited to 3 reviewed ROE-owned pages; this does not truthfully prove district-grade routing statewide.
- parent_training_information_center: reviewed_pti_sample_is_regional_not_statewide_designated_source :: Reviewed PTI evidence currently points to https://www.fmptic.org, which is documented as serving downstate Illinois rather than proving the designated statewide PTI target https://www.frcd.org.
- legal_aid: authored_lsc_target_not_yet_replaced_with_reviewed_illinois_source :: Illinois legal-aid planning currently stops at the authored authoritative target https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help; no reviewed Illinois legal-aid evidence has been fetched and verified from saved artifacts.

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
- legal_aid: missing_verified_source; samples=0
- able_program: verified_state_grade; samples=1; first=https://illinoisable.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=1; first=https://www.dhs.state.il.us/page.aspx?item=26210

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored
- [major] parent_training_information_center: hold_blocked_until_reviewed_statewide_illinois_pti_source_is_verified
- [major] legal_aid: hold_blocked_until_reviewed_illinois_legal_aid_source_is_verified

## Illinois final blocker decision

- District or county education routing remains blocked because only 3 reviewed ROE-owned exact leaves have been verified; that is not enough to truthfully prove district-grade routing across all 102 Illinois counties without reopening broader district authoring.
- Protection and advocacy is no longer a blocker because Equip for Equality (https://www.equipforequality.org) is already present as reviewed first-party statewide P&A evidence.
- Vocational rehabilitation / Pre-ETS is no longer a blocker because Illinois DRS Services (https://www.dhs.state.il.us/page.aspx?item=29737) is already present as reviewed official statewide VR routing evidence.
- Parent training information center remains below California-grade because the current reviewed sample https://www.fmptic.org is only documented as serving downstate Illinois, while the designated statewide PTI target on disk is https://www.frcd.org; the packet does not yet contain reviewed statewide PTI proof for that designated family.
- Legal aid remains below California-grade because Illinois currently stops at the authored LSC planning target (https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help), not a reviewed Illinois legal-aid source.
- Illinois is therefore truthfully final-blocked and not index-safe until district-grade education leaves expand beyond the current bounded ROE set and the remaining statewide support families move from regional/planning-only to reviewed verified statewide evidence.
