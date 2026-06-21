# New York California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 50
- county_count: 62
- primary_gap_reason: official_county_directory_returns_http_403

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed BOCES-owned education exact leaves verified (3), but district-grade coverage still cannot be proven for all 62 counties from the authored exact targets.)
- vocational_rehabilitation_pre_ets: planning_target_only (Only the planning target http://www.acces.nysed.gov/vr/ is present; no reviewed verified ACCES-VR source is attached to the packet.)
- protection_and_advocacy: missing_verified_source (Only the planning target https://www.disabilityrightsny.org is present; current packet samples are not reviewed Disability Rights New York evidence.)
- parent_training_information_center: planning_target_only (Only the planning target https://parentnetworkwny.org is present; no reviewed verified PTI source is attached to the packet.)
- legal_aid: missing_verified_source (Only the authored LSC planning target https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help is present; no reviewed New York legal-aid source has been verified into the packet.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_official_directory_returns_403 (The live official LDSS county directory https://www.health.ny.gov/health_care/medicaid/ldss.htm returned HTTP 403 during bounded verification, so the current county-office rows cannot remain California-grade local proof.)

## Failure ledger

- county_local_disability_resources: live_official_ldss_directory_403_without_replacement_locator :: Official New York LDSS county directory returned HTTP 403 at https://www.health.ny.gov/health_care/medicaid/ldss.htm during bounded live verification, and no replacement live county-grade official locator is attached to the packet.
- district_or_county_education_routing: bounded_boces_leaf_packet_exhausted_before_county_grade_coverage :: Verified exact leaves remain limited to 3 reviewed BOCES-owned pages; this does not truthfully prove district-grade routing statewide.
- vocational_rehabilitation_pre_ets: official_acces_vr_target_not_yet_reviewed_verified :: Planning target http://www.acces.nysed.gov/vr/ exists, but no reviewed verified ACCES-VR leaf has been fetched into the packet evidence chain.
- protection_and_advocacy: reviewed_drny_source_missing :: Planning target https://www.disabilityrightsny.org exists, but no reviewed verified Disability Rights New York source is attached to the packet.
- parent_training_information_center: reviewed_new_york_pti_source_missing :: Planning target https://parentnetworkwny.org exists, but no reviewed verified PTI source is attached to the packet.
- legal_aid: authored_lsc_target_not_yet_replaced_with_reviewed_new_york_source :: New York legal-aid planning currently stops at the authored authoritative target https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help; no reviewed New York legal-aid evidence has been fetched and verified from saved artifacts.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://opwdd.ny.gov/services-support/home-community-based-services-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://opwdd.ny.gov/get-started/front-door
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.btboces.org
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=3; first=https://caboces.org/education/exceptional-education/
- vocational_rehabilitation_pre_ets: planning_target_only; samples=0
- protection_and_advocacy: missing_verified_source; samples=3; first=https://thearc.org/chapter/advocacy-and-resource-center/
- parent_training_information_center: planning_target_only; samples=3; first=http://www.parentnetworkwny.org
- legal_aid: missing_verified_source; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.mynyable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.health.ny.gov/health_care/medicaid/redesign/cdpap.htm
- county_local_disability_resources: blocked_live_official_directory_returns_403; samples=3; first=https://www.health.ny.gov/health_care/medicaid/ldss.htm

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_live_official_ldss_directory_or_county_owned_locator_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored
- [major] vocational_rehabilitation_pre_ets: hold_blocked_until_reviewed_acces_vr_leaf_is_verified
- [major] protection_and_advocacy: hold_blocked_until_reviewed_drny_source_is_verified
- [major] parent_training_information_center: hold_blocked_until_reviewed_new_york_pti_source_is_verified
- [major] legal_aid: hold_blocked_until_reviewed_new_york_legal_aid_source_is_verified

## New York final blocker decision

- County-local disability resources remain blocked because the official New York LDSS county directory at https://www.health.ny.gov/health_care/medicaid/ldss.htm returned HTTP 403 during bounded live verification, and no replacement live county-grade official locator is attached to the packet evidence chain.
- District or county education routing remains blocked because only 3 reviewed BOCES-owned exact leaves have been verified; that is not enough to truthfully prove district-grade routing across all 62 New York counties without reopening broader district authoring.
- Vocational rehabilitation / Pre-ETS remains below California-grade because the repo currently has only the planning target for ACCES-VR (http://www.acces.nysed.gov/vr/), not a reviewed verified-source row in the packet evidence chain.
- Protection and advocacy remains below California-grade because the repo currently has only the planning target for Disability Rights New York (https://www.disabilityrightsny.org), while the existing packet samples point to unrelated advocacy organizations rather than a reviewed DRNY source.
- Parent training information center remains below California-grade because the repo currently has only the planning target for Parent Network of WNY (https://parentnetworkwny.org), not a reviewed packet-grade PTI source that can justify statewide support.
- Legal aid remains below California-grade because New York currently stops at the authored LSC planning target (https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help), not a reviewed New York legal-aid source.
- New York is therefore truthfully final-blocked and not index-safe until a live official county-office directory or county-owned locator is verified, district-grade education leaves expand beyond the current bounded BOCES set, and the statewide support families are upgraded from planning-only to reviewed verified evidence.
