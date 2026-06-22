# California California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 58
- primary_gap_reason: district_grade_leaf_packet_exhausted_after_statewide_equivalent_parent_center_repair

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (Reviewed official DDS Early Start county directory was fetched successfully and exposes structured county coverage (67 county headings) plus Family Resource Center routing.)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed the existing bounded California district packet after the statewide CDE SELPA directory root https://www.cde.ca.gov/sp/se/as/caselpas.asp returned a Radware bot challenge. Exact district/county leaves now verify across OUSD, Amador, and Berkeley: OUSD special-education, school-directory, and ECE contact pages; Amador SELPA, special-education, and district-office-directory pages; and Berkeley special-education, student-services, and directory pages. However, AlpineCOE, ButteCOE, CalaverasCOE, and ColusaCOE SELPA roots fail DNS on both www and bare-domain checks, and Fremont USD still fails SSL handshake in the current lane. Even with 9 reviewed exact leaves, county-grade district routing still cannot be proven statewide across all 58 California counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed California Department of Rehabilitation program, student-services, office-contact, and disputes pages now provide authoritative statewide VR / Pre-ETS routing evidence.)
- protection_and_advocacy: verified_state_grade (Disability Rights California Get Help is already present as reviewed first-party statewide P&A intake evidence.)
- parent_training_information_center: verified_state_grade (Reviewed official DDS Family Resource Centers pages now preserve statewide California equivalent parent-center coverage: the statewide FRC mission page names the Family Resource Center Network of California and its statewide support mission, and the regional-center intake / family-resource-center directory enumerates county-by-county California FRC routing. This satisfies the statewide equivalent parent-center requirement even though the older /rc/frcn URL still 404s.)
- legal_aid: verified_state_grade (Reviewed California Courts and State Bar legal-help pages provide authoritative statewide legal-aid routing.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed official CDSS IHSS county directory https://www.cdss.ca.gov/inforesources/county-ihss-offices was fetched successfully on 2026-06-22 and exposes 58 county-labeled IHSS routing links, giving statewide county-grade local-office routing without relying on generic statewide fallback pages.)

## Failure ledger

- district_or_county_education_routing: bounded_exact_leaf_packet_exhausted_before_statewide_district_grade_coverage :: Reviewed the existing bounded California district packet after the statewide CDE SELPA directory root https://www.cde.ca.gov/sp/se/as/caselpas.asp returned a Radware bot challenge. Exact district/county leaves now verify across OUSD, Amador, and Berkeley: OUSD special-education, school-directory, and ECE contact pages; Amador SELPA, special-education, and district-office-directory pages; and Berkeley special-education, student-services, and directory pages. However, AlpineCOE, ButteCOE, CalaverasCOE, and ColusaCOE SELPA roots fail DNS on both www and bare-domain checks, and Fremont USD still fails SSL handshake in the current lane. Even with 9 reviewed exact leaves, county-grade district routing still cannot be proven statewide across all 58 California counties.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://calable.ca.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dhcs.ca.gov/services/ltc/Pages/Home-and-Community-Based-Alternatives-Waiver.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.altaregional.org
- early_intervention_part_c: verified_state_grade; samples=2; first=https://www.dds.ca.gov/services/early-start/
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.acoe.org/selpa
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=9; first=https://www.ousd.org/enroll/enroll-at-ousd/enroll-your-student-tk-12/how-it-works-placement-priorities-special-programs-resources/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=3; first=https://www.dor.ca.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsca.org/get-help
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.dds.ca.gov/services/early-start/family-resource-center/
- legal_aid: verified_state_grade; samples=2; first=https://selfhelp.courts.ca.gov/get-free-or-low-cost-legal-help
- able_program: verified_state_grade; samples=1; first=https://calable.ca.gov
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=1; first=https://www.cdss.ca.gov/inforesources/county-ihss-offices

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored

## California final blocker decision

- Parent training information center is now verified from the live official DDS Family Resource Centers pages, which preserve statewide California equivalent parent-center mission text plus county-by-county FRC routing.
- District or county education routing remains blocked because the bounded packet now verifies 9 exact leaves across OUSD, Amador, and Berkeley, but several county COE roots are dead on both www and bare domains, Fremont still fails TLS handshake, and county-grade district routing still cannot be proven statewide from those saved packet roots alone.
- County-local disability resources remain verified from the official CDSS IHSS county directory, which exposes county-labeled local-office links across all 58 counties.
- California is therefore still truthfully BLOCKED and not index-safe.
