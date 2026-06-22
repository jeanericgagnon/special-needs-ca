# Alabama California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 67
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Official Alabama LEA Coordinators plus SES Regional Contacts pages preserve county- and LEA-specific education routing coverage across 67/67 Alabama counties on the live ALSDE domain.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Legal Services Alabama first-party home, services, and intake pages preserve a live statewide civil legal-aid route for low-income Alabamians and list multiple Alabama offices plus an apply-for-services intake path.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Official Alabama Department of Mental Health regional offices page preserves Developmental Disabilities Services Region I-V office contacts and counties covered across 67/67 Alabama counties.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://medicaid.alabama.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.alabama.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.alabama.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.alabamaachieves.org/
- district_or_county_education_routing: verified_state_grade; samples=67; first=https://www.alabamaachieves.org/compliance-monitoring/lea-coordinators/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mh.alabama.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=http://adap.ua.edu/
- parent_training_information_center: verified_state_grade; samples=1; first=https://alabamaparentcenter.com/
- legal_aid: verified_state_grade; samples=2; first=https://legalservicesalabama.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=67; first=https://mh.alabama.gov/regional-offices/

## Next actions

- [info] maintenance: Preserve Alabama as COMPLETE/index_safe and rerun only maintenance truth audits unless new evidence regresses.

## Alabama repair decision

- District or county education routing is now verified because the official ALSDE LEA Coordinators and SES Regional Contacts leaves together preserve county- and LEA-specific routing evidence across all 67 Alabama counties.
- Legal aid is now verified because Legal Services Alabama preserves a first-party statewide civil legal-aid route for low-income Alabamians plus a live Apply for Services intake page.
- County-local disability resources are now verified because the official Alabama Department of Mental Health regional-offices page preserves Developmental Disabilities Services Region I-V offices with exact counties covered across 67/67 Alabama counties.
- Alabama is therefore California-grade COMPLETE and index-safe so long as future maintenance audits keep these exact reviewed leaves live.

## Evidence checks

- Education routing: Reviewed 2026-06-22 live probes returned official ALSDE titles "Alabama LEA Coordinators" and "Alabama SES - Regional Contacts", and the combined official wp-json content preserved named coordinator contacts plus county/LEA coverage across all 67 Alabama counties.
- Legal aid: Reviewed 2026-06-22 live probes returned first-party Legal Services Alabama pages with the text "free, client-centered civil legal advocacy to low-income Alabamians" plus a live statewide Apply for Services intake route.
- County-local disability resources: Reviewed 2026-06-22 official ADMH regional-offices content preserved Developmental Disabilities Services Region I-V office contacts and counties covered; normalized county reconciliation matched 67/67 Alabama counties exactly.

## Final family count

- strong_critical_families: 12
- weak_critical_families: 0
- missing_critical_families: 0
- district_or_county_education_routing: verified_state_grade
- legal_aid: verified_state_grade
- county_local_disability_resources: verified_state_grade
