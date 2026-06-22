# Georgia California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 159
- primary_gap_reason: official_region_pages_access_denied_and_county_lookup_not_county_mapped

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: blocked_official_access_denied_region_pages (Live static and browser-assisted checks now agree that all six official DBHDD region field-office pages return access-denied shells instead of counties-served and intake content. The official county lookup page remains live, but its current rendered content only exposes repeated region links and no county names, so a deterministic 159-county county-to-region map still cannot be verified from the current official evidence.)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed district-owned education exact leaves verified (5) across the bounded Georgia packet evidence, but county-grade coverage still cannot be proven for all 159 counties without reopening broader district discovery.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Georgia Advocacy Office is already present as a verified first-party statewide P&A source.)
- parent_training_information_center: verified_state_grade (Parent to Parent of Georgia is already present as a verified first-party statewide PTI source.)
- legal_aid: verified_state_grade (Georgia Legal Services Program plus Atlanta Legal Aid now provide reviewed first-party statewide legal-aid routing for Georgia.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Official DFCS county offices directory lists county office coverage across 159/159 Georgia counties.)

## Failure ledger

- developmental_disability_idd_authority: official_region_pages_access_denied_and_county_lookup_not_county_mapped :: Live static and browser-assisted checks now agree that all six official DBHDD region field-office pages return access-denied shells instead of counties-served and intake content. The official county lookup page remains live, but its current rendered content only exposes repeated region links and no county names, so a deterministic 159-county county-to-region map still cannot be verified from the current official evidence.
- district_or_county_education_routing: bounded_official_district_leaf_packet_exhausted_before_county_grade_coverage :: Verified district-owned exact leaves remain limited to 5 reviewed pages across bounded Georgia packet evidence; that does not truthfully prove county-grade district routing statewide.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dph.georgia.gov/babies-cant-wait
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dbhdd.georgia.gov/nowcomp
- developmental_disability_idd_authority: blocked_official_access_denied_region_pages; samples=7; first=https://dbhdd.georgia.gov/regional-field-office-county
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dph.georgia.gov/babies-cant-wait
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.csraresa.org
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=5; first=https://www.cherokeek12.net/divisions/curriculum-instruction/special-educationsection-504
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://gvs.georgia.gov/
- protection_and_advocacy: verified_state_grade; samples=3; first=https://thegao.org
- parent_training_information_center: verified_state_grade; samples=3; first=https://www.p2pga.org
- legal_aid: verified_state_grade; samples=2; first=https://www.glsp.org/need-help/
- able_program: verified_state_grade; samples=1; first=https://www.georgiaable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=160; first=https://dfcs.georgia.gov/locations/appling-county

## Next actions

- [critical] developmental_disability_idd_authority: hold_blocked_until_reviewed_county_to_region_source_replaces_access_denied_region_pages
- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored

## Georgia final blocker decision

- Developmental disability routing remains blocked, and the older “browser-visible region pages are active” claim is no longer accurate.
- Live static and browser-assisted checks now agree that all six reviewed official DBHDD region field-office pages resolve to access-denied shells. Those pages preserve region identity in breadcrumbs, but they do not preserve counties served or intake content strongly enough to clear the family.
- The official county lookup page still loads, but the current rendered content exposes repeated region links rather than county names, so the 159-county county-to-region map is still unverified.
- District or county education routing remains blocked because only 5 reviewed district-owned exact leaves across the bounded Georgia packet evidence have been verified; that is not enough to truthfully prove county-grade routing across 159 Georgia counties without reopening broad district discovery.
- Georgia remains blocked and not index-safe until a reviewed county-to-region source replaces the access-denied region pages and education gains new exact district-owned county leaves.
