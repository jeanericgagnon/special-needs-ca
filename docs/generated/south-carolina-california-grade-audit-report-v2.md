# South Carolina California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 46
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-23 the live official South Carolina School Directory page, its public `getDistricts` JSON method, and the public ArcGIS district layer it exposes. Together they preserve 72 live district rows for school year 2026 with district names, superintendent names, phone numbers, and websites, and a bounded county reconciliation matches all 46 South Carolina counties to one or more official district rows. That official district-directory contract clears district_or_county_education_routing at county grade without relying on the old statewide fallback page.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights South Carolina evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: verified_state_grade (authoritative Parent Center Hub South Carolina leaf explicitly labels Family Connection of SC as the South Carolina PTI serving the entire state)
- legal_aid: verified_state_grade (reviewed first-party South Carolina Legal Services evidence preserves statewide low-income civil legal-aid identity plus direct intake routing on the live first-party domain)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (reviewed live official SCDSS contact hub now links 46 county-named DSS office leaves with county-specific office addresses and county-specific DSS email routing)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://ddsn.sc.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.south-carolina.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.south-carolina.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://ed.sc.gov/
- district_or_county_education_routing: verified_county_grade; samples=5; first=https://ed.sc.gov/districts-schools/schools/school-directory/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ddsn.sc.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightssc.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/south-carolina/
- legal_aid: verified_state_grade; samples=1; first=https://sclegal.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=46; first=https://dss.sc.gov/contact-dss/

## Next actions

- [info] maintenance: Preserve South Carolina as COMPLETE/index_safe and rerun only maintenance truth audits unless the official School Directory page, its CFC methods, or the ArcGIS district layer regress.

## Completion decision

- South Carolina now reaches California-grade and is index-safe.
- The old statewide `ed.sc.gov` fallback is no longer the governing evidence surface for education routing.
- The live official School Directory page, its public `getDistricts` backend, and the linked ArcGIS district layer together preserve county-covering district routing with real district phone and website fields.
- Because all 46 counties now match one or more official district rows from that public state-managed directory stack, the last South Carolina critical blocker is cleared.
