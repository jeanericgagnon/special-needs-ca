# Georgia California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 159
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (The official DBHDD ArcGIS app is now verified as a county-grade DD routing contract. Its public sharing/rest item data exposes the RegionAndCounties FeatureServer layer, and the bounded layer query returns 159 Georgia county features with region labels plus office address, main phone, DDIE manager, and DDIE phone fields. That preserves a deterministic official county-to-region routing map without relying on unpublished region leaves.)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (The official GaDOE RESA page now preserves county-grade education routing from one first-party source: its embedded AcfGeoMap JSON maps 159 unique Georgia county IDs across 16 RESA regions and links each county cluster to an official RESA site, so county-grade regional education routing can be verified without reopening broad district-leaf discovery.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Georgia Advocacy Office is already present as a verified first-party statewide P&A source.)
- parent_training_information_center: verified_state_grade (Parent to Parent of Georgia is already present as a verified first-party statewide PTI source.)
- legal_aid: verified_state_grade (Georgia Legal Services Program plus Atlanta Legal Aid now provide reviewed first-party statewide legal-aid routing for Georgia.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Official DFCS county offices directory lists county office coverage across 159/159 Georgia counties.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dph.georgia.gov/babies-cant-wait
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dbhdd.georgia.gov/nowcomp
- developmental_disability_idd_authority: verified_state_grade; samples=159; first=https://dbhdd.georgia.gov/regional-field-office-county
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dph.georgia.gov/babies-cant-wait
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.csraresa.org
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://gadoe.org/contact/georgia-resa/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://gvs.georgia.gov/
- protection_and_advocacy: verified_state_grade; samples=3; first=https://thegao.org
- parent_training_information_center: verified_state_grade; samples=3; first=https://www.p2pga.org
- legal_aid: verified_state_grade; samples=2; first=https://www.glsp.org/need-help/
- able_program: verified_state_grade; samples=1; first=https://www.georgiaable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=160; first=https://dfcs.georgia.gov/locations/appling-county

## Next actions

- [info] maintenance: Preserve Georgia as COMPLETE/index_safe and rerun only maintenance truth audits unless new evidence regresses.

## Georgia final decision

- Georgia is now COMPLETE and index-safe.
- The last DD blocker was resolved by the live official DBHDD ArcGIS contract, not by the unpublished CMS region leaves.
- The public item-data and FeatureServer query preserve a deterministic 159-county county-to-region map with office and DD contact fields, which satisfies county-grade DD routing.
