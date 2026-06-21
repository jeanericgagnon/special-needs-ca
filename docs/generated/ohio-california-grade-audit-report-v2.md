# Ohio California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 50
- county_count: 88
- primary_gap_reason: official_county_directory_targets_unresolved_after_bounded_live_check

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed ESC-owned education exact leaves verified (6) across 8 bounded Ohio packet roots, but district-grade coverage still cannot be proven for all 88 counties from the authored exact targets.)
- vocational_rehabilitation_pre_ets: planning_target_only (Only the planning target https://ood.ohio.gov is present; no reviewed verified OOD leaf has been fetched into the packet evidence chain.)
- protection_and_advocacy: missing_verified_source (Only the planning target https://www.disabilityrightsohio.org is present; no reviewed verified Disability Rights Ohio source is attached to the packet.)
- parent_training_information_center: planning_target_only (Only the planning target https://www.ocecd.org is present; no reviewed verified OCECD source is attached to the packet.)
- legal_aid: missing_verified_source (Only the authored LSC planning target https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help is present; no reviewed Ohio legal-aid source has been verified into the packet.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_missing_live_official_county_directory (Bounded live Ohio JFS county-directory roots all failed or returned 404, and the remaining DOI-hosted dataset mirror is planning evidence only rather than live official county-grade office proof.)

## Failure ledger

- county_local_disability_resources: official_county_directory_failed_and_only_non_official_dataset_remains :: Bounded live Ohio JFS county-directory targets failed or returned 404, and the only remaining county-local packet root is the non-official DOI dataset https://doi.org/.
- district_or_county_education_routing: bounded_esc_leaf_packet_exhausted_before_county_grade_coverage :: Verified exact leaves remain limited to 6 reviewed ESC-owned pages across 8 bounded Ohio packet roots (soesc.org, allencountyesc.org, youresc.k12.oh.us, ashtabulaesc.org, athensmeigs.com, auglaizeesc.org, ecoesc.org, brown.k12.oh.us); this does not truthfully prove district-grade routing statewide.
- vocational_rehabilitation_pre_ets: official_ood_target_not_yet_reviewed_verified :: Planning target https://ood.ohio.gov exists, but no reviewed verified OOD leaf has been fetched into the packet evidence chain.
- protection_and_advocacy: reviewed_disability_rights_ohio_source_missing :: Planning target https://www.disabilityrightsohio.org exists, but no reviewed verified Disability Rights Ohio source is attached to the packet.
- parent_training_information_center: reviewed_ocecd_source_missing :: Planning target https://www.ocecd.org exists, but no reviewed verified OCECD source is attached to the packet.
- legal_aid: authored_lsc_target_not_yet_replaced_with_reviewed_ohio_source :: Ohio legal-aid planning currently stops at the authored authoritative target https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help; no reviewed Ohio legal-aid evidence has been fetched and verified from saved artifacts.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://dodd.ohio.gov/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://ohioearlyintervention.org/
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.allencountyesc.org
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=6; first=https://www.youresc.k12.oh.us/special-education-student-services/
- vocational_rehabilitation_pre_ets: planning_target_only; samples=0
- protection_and_advocacy: missing_verified_source; samples=0
- parent_training_information_center: planning_target_only; samples=0
- legal_aid: missing_verified_source; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.stableaccount.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: blocked_missing_live_official_county_directory; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_live_official_county_directory_or_locator_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored
- [major] vocational_rehabilitation_pre_ets: hold_blocked_until_reviewed_ood_leaf_is_verified
- [major] protection_and_advocacy: hold_blocked_until_reviewed_disability_rights_ohio_source_is_verified
- [major] parent_training_information_center: hold_blocked_until_reviewed_ocecd_source_is_verified
- [major] legal_aid: hold_blocked_until_reviewed_ohio_legal_aid_source_is_verified

## Ohio final blocker decision

- County-local disability resources remain blocked because the bounded live Ohio JFS county-directory roots all failed or returned 404, and the remaining fallback packet evidence is only a DOI-hosted dataset mirror (https://doi.org/), not live official county-grade office proof.
- District or county education routing remains blocked because only 6 reviewed ESC-owned exact leaves across 8 bounded Ohio packet roots have been verified; that is not enough to truthfully prove district-grade routing across all 88 Ohio counties without reopening broader district authoring.
- Vocational rehabilitation / Pre-ETS remains below California-grade because the repo currently has only a planning target for Opportunities for Ohioans with Disabilities (https://ood.ohio.gov), not a reviewed verified-source row in the packet evidence chain.
- Protection and advocacy remains below California-grade because the repo currently has only the planning target for Disability Rights Ohio (https://www.disabilityrightsohio.org), not reviewed packet-grade evidence.
- Parent training information center remains below California-grade because the repo currently has only the planning target for OCECD (https://www.ocecd.org), not reviewed packet-grade evidence.
- Legal aid remains below California-grade because the repo currently stops at an authored LSC planning target (https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help), not a reviewed Ohio legal-aid source.
- Ohio is therefore truthfully final-blocked and not index-safe until new exact official county-office or district leaf targets are authored and the statewide support families are upgraded from planning-only to reviewed verified evidence.
