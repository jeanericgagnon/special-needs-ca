# Georgia California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 159
- primary_gap_reason: official_county_page_omits_county_labels_while_public_region_replacements_lack_county_service_area_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: blocked_county_page_without_county_labels (Georgia DBHDD now exposes public official replacement leaves for every region under /contacts/region-*-field-office and /locations/region-*-field-office, but the county-grade contract is still missing. The live county page still renders 159 blank first-column rows with only repeated legacy region-* links and no county labels in fetched HTML. The public replacement contact/location leaves preserve office identity, address, and phone, but they do not expose counties served, service area, or another county-to-region map in fetched public source, so a deterministic 159-county routing map still cannot be verified.)
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

- developmental_disability_idd_authority: official_county_page_omits_county_labels_while_public_region_replacements_lack_county_service_area_contract :: Reviewed 2026-06-22 bounded live official DBHDD sources: the county lookup page https://dbhdd.georgia.gov/regional-field-office-county, official sitemap entries under https://dbhdd.georgia.gov/sitemap.xml, public replacement leaves such as https://dbhdd.georgia.gov/contacts/region-1-field-office and https://dbhdd.georgia.gov/locations/region-1-field-office, and legacy region-* links. The county lookup page still contains 159 table rows whose first column is blank and whose second column repeats only legacy region-1 through region-6 links; fetched HTML still exposes no county labels. DBHDD now does publish public replacement leaves under /contacts/region-*-field-office and /locations/region-*-field-office, and those pages preserve region office titles plus contact/location details. But the reviewed public replacement leaves still do not expose counties served, service area, or another county-to-region contract, so Georgia still lacks verified county-grade DD routing evidence for all 159 counties.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dph.georgia.gov/babies-cant-wait
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dbhdd.georgia.gov/nowcomp
- developmental_disability_idd_authority: blocked_county_page_without_county_labels; samples=13; first=https://dbhdd.georgia.gov/regional-field-office-county
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

- [critical] developmental_disability_idd_authority: hold_blocked_until_public_county_to_region_mapping_or_counties_served_contract_is_republished

## Georgia final blocker decision

- Developmental disability routing remains blocked.
- DBHDD now exposes public official region contact and location leaves, so the old “all region leaves are inaccessible” story is no longer true.
- But the live county page still exposes only 159 blank county rows plus repeated region links, and the public replacement region leaves do not publish counties served or another county-to-region contract.
- Georgia should reopen this family only if DBHDD republishes a public county-to-region mapping or adds counties-served evidence to a public official regional source.
