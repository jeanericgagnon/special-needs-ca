# California California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 58
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (Reviewed official DDS Early Start county directory was fetched successfully and exposes structured county coverage (67 county headings) plus Family Resource Center routing.)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed bounded first-party replacements for every previously unresolved California district packet root. Alpine now resolves on alpinecoe.k12.ca.us with Student Support Services, Special Education Overview, and Tahoe-Alpine SELPA leaves; Butte now resolves on bcoe.org with Special Education, SELPA, and Staff Directory leaves; Colusa now resolves on ccoe.net with a live Special Education page; Fremont now resolves on fremontunified.org with live Special Education and Department Directory leaves despite the old fremont.k12.ca.us SSL failure; and Calaveras now resolves on ccoe.k12.ca.us plus calaverasusd.com with Special Education Administrative Unit, Special Education Services, Countywide Directory, Special Education, and Staff Directory leaves. With those exact replacements, the bounded California district packet is now complete enough to prove county-grade education routing statewide.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed California Department of Rehabilitation program, student-services, office-contact, and disputes pages now provide authoritative statewide VR / Pre-ETS routing evidence.)
- protection_and_advocacy: verified_state_grade (Disability Rights California Get Help is already present as reviewed first-party statewide P&A intake evidence.)
- parent_training_information_center: verified_state_grade (Reviewed official DDS Family Resource Centers pages now preserve statewide California equivalent parent-center coverage: the statewide FRC mission page names the Family Resource Center Network of California and its statewide support mission, and the regional-center intake / family-resource-center directory enumerates county-by-county California FRC routing. This satisfies the statewide equivalent parent-center requirement even though the older /rc/frcn URL still 404s.)
- legal_aid: verified_state_grade (Reviewed California Courts and State Bar legal-help pages provide authoritative statewide legal-aid routing.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed official CDSS IHSS county directory https://www.cdss.ca.gov/inforesources/county-ihss-offices was fetched successfully on 2026-06-22 and exposes 58 county-labeled IHSS routing links, giving statewide county-grade local-office routing without relying on generic statewide fallback pages.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://calable.ca.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dhcs.ca.gov/services/ltc/Pages/Home-and-Community-Based-Alternatives-Waiver.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.altaregional.org
- early_intervention_part_c: verified_state_grade; samples=2; first=https://www.dds.ca.gov/services/early-start/
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.acoe.org/selpa
- district_or_county_education_routing: verified_state_grade; samples=23; first=https://www.ousd.org/enroll/enroll-at-ousd/enroll-your-student-tk-12/how-it-works-placement-priorities-special-programs-resources/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=3; first=https://www.dor.ca.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsca.org/get-help
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.dds.ca.gov/services/early-start/family-resource-center/
- legal_aid: verified_state_grade; samples=2; first=https://selfhelp.courts.ca.gov/get-free-or-low-cost-legal-help
- able_program: verified_state_grade; samples=1; first=https://calable.ca.gov
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=1; first=https://www.cdss.ca.gov/inforesources/county-ihss-offices

## Next actions

- none; California is now California-grade complete and index-safe.

## Completion decision

- California is now COMPLETE and index-safe.
- The only previously blocked family, district or county education routing, is now covered by reviewed first-party exact leaves for every previously unresolved packet root: Alpine, Butte, Colusa, Fremont, and Calaveras all have live district- or county-owned special-education and/or directory surfaces on disk.
- Earlier statewide-equivalent parent-center, county IHSS directory, Early Start county directory, and statewide legal/P&A/VR repairs remain intact, so all critical families now pass.
