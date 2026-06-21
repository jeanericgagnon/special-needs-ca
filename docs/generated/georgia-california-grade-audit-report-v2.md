# Georgia California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 159
- primary_gap_reason: official_county_lookup_table_has_empty_county_cells

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: blocked_official_county_table_blank (Official DBHDD county mapping remains unprovable because the live county table renders blank county cells in static HTML and the obvious same-domain region field-office leaves do not close county coverage.)
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

- developmental_disability_idd_authority: official_county_lookup_table_has_empty_county_cells :: Official DBHDD county table renders 159 region rows but 159/159 county cells are blank in static HTML, and the obvious same-domain region field-office leaves return 2 HTTP 403 responses, so county-to-region coverage remains unprovable from current official evidence.
- district_or_county_education_routing: bounded_official_district_leaf_packet_exhausted_before_county_grade_coverage :: Verified district-owned exact leaves remain limited to 5 reviewed pages across bounded Georgia packet evidence; that does not truthfully prove county-grade district routing statewide.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dph.georgia.gov/babies-cant-wait
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dbhdd.georgia.gov/nowcomp
- developmental_disability_idd_authority: blocked_official_county_table_blank; samples=3; first=https://dbhdd.georgia.gov/regional-field-office-county
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

- [critical] developmental_disability_idd_authority: keep_blocked_until_official_county_names_or_machine_readable_mapping_are_exposed
- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored

## Georgia final blocker decision

- Developmental disability routing remains blocked because the official DBHDD county table still renders 159/159 blank county cells in static HTML, and the obvious same-domain region field-office leaves remain non-proving or forbidden.
- District or county education routing remains blocked because only 5 reviewed district-owned leaves across the bounded packet evidence have been verified; that is not enough to truthfully prove county-grade routing across 159 Georgia counties without reopening broad district discovery.
- Legal aid is now verified at the statewide support layer because Georgia Legal Services Program proves 154 counties outside Metro Atlanta and Atlanta Legal Aid proves Clayton, Cobb, DeKalb, Fulton, and Gwinnett county legal-aid routing from first-party pages.
- Georgia remains blocked and not index-safe until the DD county mapping and district-grade education families have county-grade proof.
