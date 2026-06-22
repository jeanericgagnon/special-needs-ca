# California California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 58
- primary_gap_reason: district_grade_leaf_packet_exhausted_and_reviewed_pti_source_still_not_statewide

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (Reviewed official DDS Early Start county directory was fetched successfully and exposes structured county coverage (67 county headings) plus Family Resource Center routing.)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed exact district leaves remain limited to 3 saved pages; that is not enough to truthfully prove county-grade district routing across all 58 California counties, and the official CDE SELPA directory root https://www.cde.ca.gov/sp/se/as/caselpas.asp now returns a Radware bot challenge in the bounded live lane instead of reviewable directory content.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed California Department of Rehabilitation program, student-services, office-contact, and disputes pages now provide authoritative statewide VR / Pre-ETS routing evidence.)
- protection_and_advocacy: verified_state_grade (Disability Rights California Get Help is already present as reviewed first-party statewide P&A intake evidence.)
- parent_training_information_center: missing_verified_statewide_source (Reviewed 2026-06-22 bounded statewide-equivalent parent-center candidate set. Matrix Parents still preserves explicit PTI/FEC/FRC designation text, but its own scope stays limited to Marin, Napa, Solano, and Sonoma Counties; the official DDS Family Resource Centers Network URL https://www.dds.ca.gov/rc/frcn now returns 404; frcnca.org fails TLS protocol negotiation in the current lane; and supportforfamilies.org returns 403. No live fetched statewide California PTI or equivalent parent-center source is currently verified on disk.)
- legal_aid: verified_state_grade (Reviewed California Courts and State Bar legal-help pages provide authoritative statewide legal-aid routing.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed official CDSS IHSS county directory https://www.cdss.ca.gov/inforesources/county-ihss-offices was fetched successfully on 2026-06-22 and exposes 58 county-labeled IHSS routing links, giving statewide county-grade local-office routing without relying on generic statewide fallback pages.)

## Failure ledger

- district_or_county_education_routing: bounded_exact_leaf_packet_exhausted_before_statewide_district_grade_coverage :: Reviewed exact district leaves remain limited to 3 saved pages; that is not enough to truthfully prove county-grade district routing across all 58 California counties, and the official CDE SELPA directory root https://www.cde.ca.gov/sp/se/as/caselpas.asp now returns a Radware bot challenge in the bounded live lane instead of reviewable directory content.
- parent_training_information_center: reviewed_pti_source_is_regional_not_statewide :: Reviewed 2026-06-22 bounded statewide-equivalent parent-center candidate set. Matrix Parents still preserves explicit PTI/FEC/FRC designation text, but its own scope stays limited to Marin, Napa, Solano, and Sonoma Counties; the official DDS Family Resource Centers Network URL https://www.dds.ca.gov/rc/frcn now returns 404; frcnca.org fails TLS protocol negotiation in the current lane; and supportforfamilies.org returns 403. No live fetched statewide California PTI or equivalent parent-center source is currently verified on disk.

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
- county_local_disability_resources: verified_state_grade; samples=1; first=https://www.cdss.ca.gov/inforesources/county-ihss-offices

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored
- [major] parent_training_information_center: hold_blocked_until_statewide_pti_or_equivalent_parent_center_source_is_verified

## California final blocker decision

- County-local disability resources no longer belong in the blocker set because the live official CDSS IHSS directory itself preserves 58 county-labeled county-routing links on one fetched official page.
- District or county education routing remains blocked because only 3 reviewed exact district leaves are verified on disk and the official CDE SELPA directory root now returns a Radware challenge in the bounded live lane.
- Parent training information center remains blocked because the reviewed statewide-equivalent candidate set still fails the statewide gate: Matrix Parents is explicit but regional, DDS FRCN returns 404, frcnca.org fails TLS, and Support for Families returns 403.
- California is therefore still truthfully BLOCKED and not index-safe.
