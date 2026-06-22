# California California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 58
- primary_gap_reason: county_grade_leaf_packets_exhausted_and_reviewed_pti_source_still_not_statewide

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (Reviewed official DDS Early Start county directory was fetched successfully and exposes structured county coverage (67 county headings) plus Family Resource Center routing.)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Only 3 reviewed exact district leaves are verified on disk; county-grade district routing still cannot be proven statewide from the bounded authored packet.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed California Department of Rehabilitation program, student-services, office-contact, and disputes pages now provide authoritative statewide VR / Pre-ETS routing evidence.)
- protection_and_advocacy: verified_state_grade (Disability Rights California Get Help is already present as reviewed first-party statewide P&A intake evidence.)
- parent_training_information_center: missing_verified_statewide_source (Reviewed 2026-06-22 bounded statewide-equivalent parent-center candidate set. Matrix Parents still preserves explicit PTI/FEC/FRC designation text, but its own scope stays limited to Marin, Napa, Solano, and Sonoma Counties; the official DDS Family Resource Centers Network URL https://www.dds.ca.gov/rc/frcn now returns 404; frcnca.org fails TLS protocol negotiation in the current lane; and supportforfamilies.org returns 403. No live fetched statewide California PTI or equivalent parent-center source is currently verified on disk.)
- legal_aid: verified_state_grade (Reviewed California Courts and State Bar legal-help pages provide authoritative statewide legal-aid routing.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_exact_leaf_repair_exhausted (The reviewed county-local packet still proves only example county-owned leaves plus the statewide BenefitsCal intake portal, not statewide county-grade local office coverage.)

## Failure ledger

- district_or_county_education_routing: bounded_exact_leaf_packet_exhausted_before_statewide_district_grade_coverage :: Reviewed exact district leaves remain limited to 3 saved pages; that is not enough to truthfully prove county-grade district routing across all 58 California counties.
- parent_training_information_center: reviewed_pti_source_is_regional_not_statewide :: Reviewed 2026-06-22 bounded statewide-equivalent parent-center candidate set. Matrix Parents still preserves explicit PTI/FEC/FRC designation text, but its own scope stays limited to Marin, Napa, Solano, and Sonoma Counties; the official DDS Family Resource Centers Network URL https://www.dds.ca.gov/rc/frcn now returns 404; frcnca.org fails TLS protocol negotiation in the current lane; and supportforfamilies.org returns 403. No live fetched statewide California PTI or equivalent parent-center source is currently verified on disk.
- county_local_disability_resources: reviewed_county_examples_do_not_prove_statewide_county_grade_office_coverage :: The reviewed CDSS IHSS county directory https://www.cdss.ca.gov/inforesources/county-ihss-offices is live and lists county-specific links, but the packet still verifies only sample county-owned office leaves plus BenefitsCal, not statewide reviewed county-grade office coverage.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://calable.ca.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dhcs.ca.gov/services/ltc/Pages/Home-and-Community-Based-Alternatives-Waiver.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.altaregional.org
- early_intervention_part_c: verified_state_grade; samples=2; first=https://www.dds.ca.gov/services/early-start/
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.acoe.org/selpa
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=3; first=https://www.ousd.org/enroll/enroll-at-ousd/enroll-your-student-tk-12/how-it-works-placement-priorities-special-programs-resources/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=3; first=https://www.dor.ca.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsca.org/get-help
- parent_training_information_center: missing_verified_statewide_source; samples=1; first=https://www.matrixparents.org/
- legal_aid: verified_state_grade; samples=2; first=https://selfhelp.courts.ca.gov/get-free-or-low-cost-legal-help
- able_program: verified_state_grade; samples=1; first=https://calable.ca.gov
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: blocked_exact_leaf_repair_exhausted; samples=3; first=https://www.alamedacounty.ca.gov/public-health/ccs

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored
- [critical] county_local_disability_resources: hold_blocked_until_new_exact_county_local_targets_are_authored
- [major] parent_training_information_center: hold_blocked_until_statewide_pti_or_equivalent_parent_center_source_is_verified

## California final blocker decision

- Parent training information center remains blocked because the bounded statewide-equivalent candidate set is now exhausted more precisely: Matrix Parents is explicit but regional, the official DDS FRCN root returns 404, frcnca.org fails TLS in the current lane, and Support for Families returns 403.
- District or county education routing remains blocked because only 3 reviewed exact district leaves have been verified and county-grade district routing still cannot be proven statewide from the bounded authored packet.
- County-local disability resources remain blocked because the reviewed CDSS IHSS county directory still points to many county roots, but the packet verifies only sample county-owned leaves plus BenefitsCal rather than statewide reviewed county-grade office coverage.
- California is therefore still truthfully BLOCKED and not index-safe.
