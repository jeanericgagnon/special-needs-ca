# New York California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 62
- primary_gap_reason: official_county_directory_returns_http_403

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed BOCES-owned education exact leaves verified (3), but district-grade coverage still cannot be proven for all 62 counties from the authored exact targets.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed verified ACCES-VR program evidence already exists in the New York program spine and satisfies the statewide VR / Pre-ETS gate.)
- protection_and_advocacy: verified_state_grade (Accepted first-party Disability Rights New York evidence is already present on disk and satisfies the statewide P&A gate.)
- parent_training_information_center: blocked_reviewed_regional_source_not_statewide (Reviewed Parent Network of WNY evidence is present, but the saved first-party page limits its reach to Western New York rather than a truthful statewide PTI route.)
- legal_aid: verified_state_grade (LawHelpNY now provides reviewed New York statewide legal-help routing from a first-party portal with county-based resource lookup.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_official_directory_returns_403 (The live official LDSS county directory https://www.health.ny.gov/health_care/medicaid/ldss.htm returned HTTP 403 during bounded verification, so the current county-office rows cannot remain California-grade local proof.)

## Failure ledger

- county_local_disability_resources: live_official_ldss_directory_403_without_replacement_locator :: Official New York LDSS county directory returned HTTP 403 at https://www.health.ny.gov/health_care/medicaid/ldss.htm during bounded live verification, and no replacement live county-grade official locator is attached to the packet.
- district_or_county_education_routing: bounded_boces_leaf_packet_exhausted_before_county_grade_coverage :: Verified exact leaves remain limited to 3 reviewed BOCES-owned pages; this does not truthfully prove district-grade routing statewide.
- parent_training_information_center: reviewed_western_new_york_pti_source_not_statewide :: Reviewed Parent Network of WNY evidence from https://parentnetworkwny.org says the organization reaches families across WNY per year, which does not truthfully satisfy the statewide PTI gate.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://opwdd.ny.gov/services-support/home-community-based-services-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://opwdd.ny.gov/get-started/front-door
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.btboces.org
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=3; first=https://caboces.org/education/exceptional-education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drny.org/
- parent_training_information_center: blocked_reviewed_regional_source_not_statewide; samples=1; first=http://parentnetworkwny.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.lawhelpny.org/
- able_program: verified_state_grade; samples=1; first=https://www.mynyable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.health.ny.gov/health_care/medicaid/redesign/cdpap.htm
- county_local_disability_resources: blocked_live_official_directory_returns_403; samples=3; first=https://www.health.ny.gov/health_care/medicaid/ldss.htm

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_live_official_ldss_directory_or_county_owned_locator_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored
- [major] parent_training_information_center: hold_blocked_until_reviewed_statewide_new_york_pti_source_or_statewide_scope_proof_is_verified

## New York final blocker decision

- County-local disability resources remain blocked because the official New York LDSS county directory at https://www.health.ny.gov/health_care/medicaid/ldss.htm returned HTTP 403 during bounded live verification, and no replacement live county-grade official locator is attached to the packet evidence chain.
- District or county education routing remains blocked because only 3 reviewed BOCES-owned exact leaves have been verified; that is not enough to truthfully prove district-grade routing across all 62 New York counties without reopening broader district authoring.
- Parent training information center remains below California-grade because the reviewed Parent Network of WNY evidence at http://parentnetworkwny.org/ is still explicitly scoped to Western New York support, not a truthful statewide PTI route.
- Legal aid is now verified at the statewide support layer because LawHelpNY is a reviewed New York statewide legal-help portal with county-based resource routing and a free legal-services directory.
- ACCES-VR and Disability Rights New York remain upgraded out of the blocker list because reviewed verified evidence already existed on disk and now anchors those statewide support families truthfully.
- New York is therefore truthfully final-blocked and not index-safe until a live official county-office directory or county-owned locator is verified, district-grade education leaves expand beyond the current bounded BOCES set, and a statewide PTI route is proven beyond Western New York scope.
