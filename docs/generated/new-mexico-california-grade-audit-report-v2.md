# New Mexico Blocker Packets v4

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 33
- primary_gap_reason: district_leafs_missing_and_county_local_now_reduced_to_four_county_office_routing_remainder

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live HCA Medicaid leaves now prove statewide New Mexico Medicaid coverage and application routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed HCA DDSD evidence on disk now proves statewide DD-waiver application / eligibility and HCBS disability-services routing.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed HCA DDSD evidence on disk replaced the stale dhhs.new-mexico.gov DD authority path.)
- early_intervention_part_c: verified_county_grade (The official ECECD FIT page plus the linked Regional Office Map now prove county-grade local FIT routing across all 33 counties.)
- special_education_idea_part_b: verified_state_grade (The reviewed New Mexico regional education row still points to the PED Special Education Bureau page as the statewide Part B authority, while district-grade routing remains a separate blocked family.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Reviewed 2026-06-23 bounded live PED probes alongside the current California-grade packet. Exact official checks on both `https://webnew.ped.state.nm.us/` and `https://webnew.ped.state.nm.us/bureaus/special-education/` still timed out after 25 seconds, and the preserved New Mexico low-token queue still has zero district-owned, county-grade, or regional education leaves on disk. The only retained PED-side URLs are the generic PED root and the statewide Special Education Bureau page, while one retained candidate is still the wrong-role `https://www.nmhealth.org/about/ddsd` cross-role leak on a non-PED host. district_or_county_education_routing therefore remains blocked on authoring exact local education leaves, not on rerunning the same PED roots.)
- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate (Reviewed 2026-06-23 the New Mexico VR blocker artifacts plus the NM low-token registry. The exact official DVR root `https://www.dvr.nm.gov/` is still the only reviewed first-party VR host in the state packet and it returns HTTP 401 Unauthorized in bounded fetches. The New Mexico official-domain registry still carries no reviewed alternate VR domain, and the NM unresolved-roles ledger still shows both `vocational_rehabilitation` and `pre_ets` with `no_reviewed_allowed_domains`. New Mexico VR therefore remains blocked on missing reviewed alternate official-root evidence after the 401 lane, not on a broader discovery gap.)
- protection_and_advocacy: verified_state_grade (Reviewed DRNM first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and intake route.)
- parent_training_information_center: verified_state_grade (The reviewed Parents Reaching Out About page explicitly preserves New Mexico PTI designation on a first-party source.)
- legal_aid: verified_state_grade (The reviewed New Mexico Legal Aid locations page preserves a statewide intake route and explicitly says it serves all counties in New Mexico.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: blocked_hca_archive_29_of_33_counties_with_four_county_remainder (Reviewed 2026-06-23 the live official HCA Field Offices archive across pages 1 through 8 plus bounded same-host county searches. The archive now proves county-specific office posts for 29 of 33 New Mexico counties: Bernalillo, Roosevelt, Hidalgo, Chaves, Curry, Doña Ana, Eddy, Guadalupe, Sandoval, Lincoln, McKinley, Quay, Rio Arriba, Los Alamos, San Juan, San Miguel, Santa Fe, Socorro, Torrance, Valencia, Otero, Lea, Sierra, Taos, Grant, Cibola, De Baca, Luna, and Colfax. The remaining counties Catron, Harding, Mora, and Union still lack a reviewed office-routing leaf: HCA site search only surfaced a non-office service-expansion article for Harding/Union, a SNAP-loss article for Mora, and no Catron county office hit. county_local_disability_resources therefore remains blocked on a four-county official office-routing remainder, not on a dead or partial source.)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Reviewed 2026-06-23 bounded live PED probes alongside the current California-grade packet. Exact official checks on both `https://webnew.ped.state.nm.us/` and `https://webnew.ped.state.nm.us/bureaus/special-education/` still timed out after 25 seconds, and the preserved New Mexico low-token queue still has zero district-owned, county-grade, or regional education leaves on disk. The only retained PED-side URLs are the generic PED root and the statewide Special Education Bureau page, while one retained candidate is still the wrong-role `https://www.nmhealth.org/about/ddsd` cross-role leak on a non-PED host. district_or_county_education_routing therefore remains blocked on authoring exact local education leaves, not on rerunning the same PED roots.
- vocational_rehabilitation_pre_ets: official_dvr_root_returns_401_without_reviewed_public_alternate :: Reviewed 2026-06-23 the New Mexico VR blocker artifacts plus the NM low-token registry. The exact official DVR root `https://www.dvr.nm.gov/` is still the only reviewed first-party VR host in the state packet and it returns HTTP 401 Unauthorized in bounded fetches. The New Mexico official-domain registry still carries no reviewed alternate VR domain, and the NM unresolved-roles ledger still shows both `vocational_rehabilitation` and `pre_ets` with `no_reviewed_allowed_domains`. New Mexico VR therefore remains blocked on missing reviewed alternate official-root evidence after the 401 lane, not on a broader discovery gap.
- county_local_disability_resources: official_hca_archive_still_missing_four_county_office_routing_remainder :: Reviewed 2026-06-23 the live official HCA Field Offices archive across pages 1 through 8 plus bounded same-host county searches. The archive now proves county-specific office posts for 29 of 33 New Mexico counties: Bernalillo, Roosevelt, Hidalgo, Chaves, Curry, Doña Ana, Eddy, Guadalupe, Sandoval, Lincoln, McKinley, Quay, Rio Arriba, Los Alamos, San Juan, San Miguel, Santa Fe, Socorro, Torrance, Valencia, Otero, Lea, Sierra, Taos, Grant, Cibola, De Baca, Luna, and Colfax. The remaining counties Catron, Harding, Mora, and Union still lack a reviewed office-routing leaf: HCA site search only surfaced a non-office service-expansion article for Harding/Union, a SNAP-loss article for Mora, and no Catron county office hit. county_local_disability_resources therefore remains blocked on a four-county official office-routing remainder, not on a dead or partial source.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.hca.nm.gov/turquoise-care/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hca.nm.gov/eligibility-determination/
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.hca.nm.gov/developmental-disabilities-supports-division/
- early_intervention_part_c: verified_county_grade; samples=2; first=https://www.nmececd.org/family-infant-toddler-fit-program/
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://webnew.ped.state.nm.us/bureaus/special-education/
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=3; first=https://webnew.ped.state.nm.us/
- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate; samples=2; first=https://www.dvr.nm.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drnm.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://parentsreachingout.org/about-us/
- legal_aid: verified_state_grade; samples=1; first=https://newmexicolegalaid.org/who-we-are/locations.html
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: blocked_hca_archive_29_of_33_counties_with_four_county_remainder; samples=4; first=https://www.hca.nm.gov/lookingforassistance/field_offices_1/

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: review_official_hca_or_successor_office_roots_for_catron_harding_mora_union_only
- [major] vocational_rehabilitation_pre_ets: browser_assisted_or_review_alternate_official_vr_root

## New county-local refinement

- The official HCA Field Offices archive is no longer just a vague partial source: reviewed pages 1 through 8 preserve county-specific office posts for 29 of 33 counties.
- The exact remaining county-local blocker is now only Catron, Harding, Mora, and Union.
- Harding and Union currently surface only an HCA service-expansion article, Mora only surfaces a SNAP article, and Catron still has no reviewed HCA county-office hit in the bounded same-host search lane.

## Completion decision

- New Mexico remains `BLOCKED` and `index_safe=false`.
- Education is still blocked on missing district-owned or county-grade local leaves, and exact live PED root plus bureau probes now confirm this is not just a stale single-timeout assumption.
- County-local is now blocked on a four-county official office-routing remainder, not on a dead or partial archive assumption.
- VR remains blocked on the 401 DVR host plus zero reviewed alternate official roots.
