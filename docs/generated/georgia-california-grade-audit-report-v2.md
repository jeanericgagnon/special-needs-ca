# Georgia California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 159
- primary_gap_reason: official_county_page_points_to_unpublished_region_leaves

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: blocked_unpublished_official_region_links (The live official DBHDD county lookup page still fails county-grade proof: county cells are blank and the repeated Region links themselves are marked data-status-unpublished=1 with aria-label "Not visible to public", so the page points to unpublished region leaves rather than preserving a public county-to-region routing contract.)
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

- developmental_disability_idd_authority: official_county_page_points_to_unpublished_region_leaves :: Reviewed 2026-06-22 bounded live official HTML on https://dbhdd.georgia.gov/regional-field-office-county. The county table still renders empty county cells and repeated Region 1-6 links, but the live anchor markup now makes the failure mode explicit: each reviewed region link carries data-status-unpublished="1", data-status-in-trash="1", and aria-label="Not visible to public". That means the current official county page is not exposing a public county-to-region routing contract, and the linked region leaves remain non-public/access-denied. A deterministic 159-county county-to-region map still cannot be verified from the current public official evidence.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dph.georgia.gov/babies-cant-wait
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dbhdd.georgia.gov/nowcomp
- developmental_disability_idd_authority: blocked_unpublished_official_region_links; samples=7; first=https://dbhdd.georgia.gov/regional-field-office-county
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

- [critical] developmental_disability_idd_authority: hold_blocked_until_public_county_to_region_source_replaces_unpublished_region_links

## Georgia final blocker decision

- Developmental disability routing remains blocked because the live DBHDD county lookup page itself points only to unpublished region leaves and still does not expose a public county-to-region routing contract.
- District or county education routing is now verified from the official GaDOE RESA county map, whose embedded first-party JSON covers 159/159 Georgia counties and links them to named RESA regional routing sites.
- Georgia remains blocked and not index-safe because one critical DD family is still unresolved, not because education lacks county-grade proof.
