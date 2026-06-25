# New Mexico Blocker Packets v6

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 33
- primary_gap_reason: current_ped_host_timeouts_plus_dead_legacy_education_host_leave_zero_local_education_leaves_and_hca_four_county_remainder_persists

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live HCA Medicaid leaves now prove statewide New Mexico Medicaid coverage and application routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed HCA DDSD evidence on disk now proves statewide DD-waiver application / eligibility and HCBS disability-services routing.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed HCA DDSD evidence on disk replaced the stale dhhs.new-mexico.gov DD authority path.)
- early_intervention_part_c: verified_county_grade (The official ECECD FIT page plus the linked Regional Office Map now prove county-grade local FIT routing across all 33 counties.)
- special_education_idea_part_b: verified_state_grade (The reviewed New Mexico regional education row still points to the PED Special Education Bureau page as the statewide Part B authority, while district-grade routing remains a separate blocked family.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Reviewed 2026-06-25 one more bounded official New Mexico education host pass. The legacy repo host family `https://education.new-mexico.gov/` is now source-finally unusable: exact probes on the root, `/regional`, `/sitemap.xml`, `/robots.txt`, `/special-education/`, and `/districts/` all fail DNS resolution. The current official PED host family remains equally non-productive for low-token local routing: earlier bounded exact probes on `https://webnew.ped.state.nm.us/` and `https://webnew.ped.state.nm.us/bureaus/special-education/` had already timed out after 25 seconds, and fresh bounded exact probes on the current host search and API-shaped routes still timed out after 15 seconds. The packet still preserves zero district-owned, county-grade, or regional local education leaves on disk, and the only retained PED-side URLs remain the generic PED root plus the statewide Special Education Bureau page. district_or_county_education_routing therefore remains blocked on authoring exact local leaves from district-owned or regional sources, not on any further state-host retries.)
- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate (Reviewed 2026-06-23 the New Mexico VR blocker artifacts plus the NM low-token registry. The exact official DVR root `https://www.dvr.nm.gov/` is still the only reviewed first-party VR host in the state packet and it returns HTTP 401 Unauthorized in bounded fetches. The New Mexico official-domain registry still carries no reviewed alternate VR domain, and the NM unresolved-roles ledger still shows both `vocational_rehabilitation` and `pre_ets` with `no_reviewed_allowed_domains`. New Mexico VR therefore remains blocked on missing reviewed alternate official-root evidence after the 401 lane, not on a broader discovery gap.)
- protection_and_advocacy: verified_state_grade (Reviewed DRNM first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and intake route.)
- parent_training_information_center: verified_state_grade (The reviewed Parents Reaching Out About page explicitly preserves New Mexico PTI designation on a first-party source.)
- legal_aid: verified_state_grade (The reviewed New Mexico Legal Aid locations page preserves a statewide intake route and explicitly says it serves all counties in New Mexico.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: blocked_hca_archive_29_of_33_counties_with_four_county_remainder_and_empty_tail (Reviewed 2026-06-23 the live official HCA Field Offices archive across pages 1 through 12 plus bounded same-host county searches. Pages 1 through 8 still prove county-specific office posts for 29 of 33 New Mexico counties: Bernalillo, Roosevelt, Hidalgo, Chaves, Curry, Doña Ana, Eddy, Guadalupe, Sandoval, Lincoln, McKinley, Quay, Rio Arriba, Los Alamos, San Juan, San Miguel, Santa Fe, Socorro, Torrance, Valencia, Otero, Lea, Sierra, Taos, Grant, Cibola, De Baca, Luna, and Colfax. Fresh exact probes on pages 9 through 12 all returned HTTP 200 with the same generic `Field Offices` archive shell but no additional county office posts and no Catron, Harding, Mora, or Union office-routing text. Bounded same-host search still only surfaced a non-office service-expansion article for Harding/Union, a SNAP-loss article for Mora, and no Catron county office hit. county_local_disability_resources therefore remains blocked on a four-county official office-routing remainder, and the archive tail itself is now proven empty rather than merely unreviewed.)

## Failure ledger

- district_or_county_education_routing: current_ped_host_timeouts_and_legacy_education_host_unresolvable_without_local_leafs :: Reviewed 2026-06-25 one more bounded official New Mexico education host pass. The legacy repo host family `https://education.new-mexico.gov/` is now source-finally unusable: exact probes on the root, `/regional`, `/sitemap.xml`, `/robots.txt`, `/special-education/`, and `/districts/` all fail DNS resolution. The current official PED host family remains equally non-productive for low-token local routing: earlier bounded exact probes on `https://webnew.ped.state.nm.us/` and `https://webnew.ped.state.nm.us/bureaus/special-education/` had already timed out after 25 seconds, and fresh bounded exact probes on the current host search and API-shaped routes still timed out after 15 seconds. The packet still preserves zero district-owned, county-grade, or regional local education leaves on disk, and the only retained PED-side URLs remain the generic PED root plus the statewide Special Education Bureau page. district_or_county_education_routing therefore remains blocked on authoring exact local leaves from district-owned or regional sources, not on any further state-host retries.
- vocational_rehabilitation_pre_ets: official_dvr_root_returns_401_without_reviewed_public_alternate :: Reviewed 2026-06-23 the New Mexico VR blocker artifacts plus the NM low-token registry. The exact official DVR root `https://www.dvr.nm.gov/` is still the only reviewed first-party VR host in the state packet and it returns HTTP 401 Unauthorized in bounded fetches. The New Mexico official-domain registry still carries no reviewed alternate VR domain, and the NM unresolved-roles ledger still shows both `vocational_rehabilitation` and `pre_ets` with `no_reviewed_allowed_domains`. New Mexico VR therefore remains blocked on missing reviewed alternate official-root evidence after the 401 lane, not on a broader discovery gap.
- county_local_disability_resources: official_hca_archive_still_missing_four_county_office_routing_remainder_and_tail_pages_are_empty :: Reviewed 2026-06-23 the live official HCA Field Offices archive across pages 1 through 12 plus bounded same-host county searches. Pages 1 through 8 still prove county-specific office posts for 29 of 33 New Mexico counties: Bernalillo, Roosevelt, Hidalgo, Chaves, Curry, Doña Ana, Eddy, Guadalupe, Sandoval, Lincoln, McKinley, Quay, Rio Arriba, Los Alamos, San Juan, San Miguel, Santa Fe, Socorro, Torrance, Valencia, Otero, Lea, Sierra, Taos, Grant, Cibola, De Baca, Luna, and Colfax. Fresh exact probes on pages 9 through 12 all returned HTTP 200 with the same generic `Field Offices` archive shell but no additional county office posts and no Catron, Harding, Mora, or Union office-routing text. Bounded same-host search still only surfaced a non-office service-expansion article for Harding/Union, a SNAP-loss article for Mora, and no Catron county office hit. county_local_disability_resources therefore remains blocked on a four-county official office-routing remainder, and the archive tail itself is now proven empty rather than merely unreviewed.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.hca.nm.gov/turquoise-care/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hca.nm.gov/eligibility-determination/
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.hca.nm.gov/developmental-disabilities-supports-division/
- early_intervention_part_c: verified_county_grade; samples=2; first=https://www.nmececd.org/family-infant-toddler-fit-program/
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://webnew.ped.state.nm.us/bureaus/special-education/
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=5; first=https://webnew.ped.state.nm.us/
- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate; samples=2; first=https://www.dvr.nm.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drnm.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://parentsreachingout.org/about-us/
- legal_aid: verified_state_grade; samples=1; first=https://newmexicolegalaid.org/who-we-are/locations.html
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: blocked_hca_archive_29_of_33_counties_with_four_county_remainder_and_empty_tail; samples=5; first=https://www.hca.nm.gov/lookingforassistance/field_offices_1/

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: review_official_hca_or_successor_office_roots_for_catron_harding_mora_union_only
- [major] vocational_rehabilitation_pre_ets: browser_assisted_or_review_alternate_official_vr_root

## Current education-host finality

- The legacy `education.new-mexico.gov` host family is now explicitly retired as an active source lane because exact probes on the root, regional, sitemap, robots, and likely child routes all failed DNS resolution.
- The current `webnew.ped.state.nm.us` host family is still not producing any local routing contract under bounded exact probes; the root, bureau, search, and API-shaped routes still time out instead of returning a usable district directory or export.
- The state packet still preserves zero district-owned or regional local education leaves on disk, so further progress depends on exact district-owned or regional leaf authoring rather than more PED host retries.

## Completion decision

- New Mexico remains `BLOCKED` and `index_safe=false`.
- Education remains the highest-priority blocker because both official state-host families now fail closed while zero reviewed local leaves are preserved on disk.
- County-local remains separately blocked on the four-county HCA remainder: Catron, Harding, Mora, and Union.
- VR remains blocked on the 401 DVR host plus zero reviewed alternate official roots.
