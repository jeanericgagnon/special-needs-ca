# Pennsylvania California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 67
- primary_gap_reason: exact_leaf_packet_exhausted_for_iu19_and_no_reviewed_statewide_legal_aid_source

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Official IU and district exact education leaves now cover 64/67 Pennsylvania counties, but the remaining three counties still collapse to one unresolved IU 19 root after the bounded official repair packet was exhausted.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Official statewide OVR transition and vocational rehabilitation source is present and verified.)
- protection_and_advocacy: verified_state_grade (Disability Rights Pennsylvania is already present as a verified first-party statewide P&A source.)
- parent_training_information_center: verified_state_grade (PEAL Center is already present as a verified first-party statewide PTI source.)
- legal_aid: missing_verified_source (Pennsylvania legal aid currently stops at the authored planning target https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help; no reviewed statewide legal-aid source has been verified into the packet.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Official county MH/ID offices page lists verified county office coverage across 67/67 Pennsylvania counties.)

## Failure ledger

- district_or_county_education_routing: iu19_root_unresolved_after_bounded_exact_leaf_repair :: Verified official IU/district exact leaves cover 64/67 counties. Remaining unresolved counties Lackawanna, Susquehanna, and Wayne all depend on the same unresolved Northeastern Educational Intermediate Unit 19 root after bounded official repair.
- legal_aid: authored_lsc_target_not_yet_replaced_with_reviewed_pennsylvania_source :: Pennsylvania legal-aid planning currently stops at the authored authoritative target https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help; no reviewed Pennsylvania statewide legal-aid source has been fetched and verified from saved artifacts.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.alleghenycounty.us/Human-Services/About/Offices/Developmental-Disabilities.aspx
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=20; first=https://www.iu08.org/page/special-education-services
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dli.pa.gov/Individuals/Disability-Services/ovr/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=3; first=https://www.disabilityrightspa.org
- parent_training_information_center: verified_state_grade; samples=3; first=https://pealcenter.org
- legal_aid: missing_verified_source; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.paable.gov/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=67; first=https://www.pa.gov/agencies/dhs/contact/county-mh-id-offices

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_iu19_exact_leaf_is_verified
- [major] legal_aid: hold_blocked_until_reviewed_pennsylvania_legal_aid_source_is_verified

## Pennsylvania final blocker decision

- District or county education routing remains blocked because the reviewed exact-leaf packet still stops at 64/67 counties, with Lackawanna County, Susquehanna County, and Wayne County all depending on the same unresolved official Northeastern Educational Intermediate Unit 19 root (https://www.neiu19.org/).
- Legal aid remains blocked because Pennsylvania currently stops at the authored planning target https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help; the packet does not yet contain a reviewed Pennsylvania statewide legal-aid source with fetched first-party evidence.
- Pennsylvania is therefore truthfully final-blocked and not index-safe until an exact IU 19 district-grade education leaf is verified for the remaining three counties and a reviewed statewide legal-aid source is added to the packet.
