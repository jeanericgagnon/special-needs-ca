# New Mexico Blocker Packets v3

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 33
- primary_gap_reason: district_and_county_local_leaf_proof_still_missing_after_statewide_and_fit_regional_repairs

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live HCA Medicaid leaves now prove statewide New Mexico Medicaid coverage and application routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed HCA DDSD evidence on disk now proves statewide DD-waiver application / eligibility and HCBS disability-services routing.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed HCA DDSD evidence on disk replaced the stale dhhs.new-mexico.gov DD authority path.)
- early_intervention_part_c: verified_county_grade (The official ECECD FIT page plus the linked Regional Office Map now prove county-grade local FIT routing across all 33 counties.)
- special_education_idea_part_b: verified_state_grade (The reviewed New Mexico regional education row still points to the PED Special Education Bureau page as the statewide Part B authority, while district-grade routing remains a separate blocked family.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Reviewed 2026-06-23 the New Mexico low-token education artifacts plus the current California-grade packet. The only retained PED education candidates on disk are still the generic `https://webnew.ped.state.nm.us/` root and the statewide Special Education Bureau leaf, while one retained candidate is a wrong-role `https://www.nmhealth.org/about/ddsd` cross-role leak on a non-PED host. No district-owned, county-grade, or regional education exact leaf is preserved in the current queue, so district_or_county_education_routing remains blocked on missing local leaf authoring rather than on another PED root retry.)
- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate (Reviewed 2026-06-23 the New Mexico VR blocker artifacts plus the NM low-token registry. The exact official DVR root `https://www.dvr.nm.gov/` is still the only reviewed first-party VR host in the state packet and it returns HTTP 401 Unauthorized in bounded fetches. The New Mexico official-domain registry still carries no reviewed alternate VR domain, and the NM unresolved-roles ledger still shows both `vocational_rehabilitation` and `pre_ets` with `no_reviewed_allowed_domains`. New Mexico VR therefore remains blocked on missing reviewed alternate official-root evidence after the 401 lane, not on a broader discovery gap.)
- protection_and_advocacy: verified_state_grade (Reviewed DRNM first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and intake route.)
- parent_training_information_center: verified_state_grade (The reviewed Parents Reaching Out About page explicitly preserves New Mexico PTI designation on a first-party source.)
- legal_aid: verified_state_grade (The reviewed New Mexico Legal Aid locations page preserves a statewide intake route and explicitly says it serves all counties in New Mexico.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: blocked_live_hca_field_office_archive_partial_county_contract (Reviewed 2026-06-23 the live HCA field-office blocker artifacts plus the existing New Mexico report. The official HCA field-office archive is publicly reachable and already preserves county-specific office posts across page 1 and page 2, including Bernalillo County NW, Bernalillo County SW, Hidalgo County, Roosevelt County, Chaves County, Curry County, and Dona Ana variants. But no reviewed county-complete 33-county office map or deterministic archive extraction is preserved on disk yet, so county_local_disability_resources remains blocked on exact county-complete authoring, not on a dead source.)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Reviewed 2026-06-23 the New Mexico low-token education artifacts plus the current California-grade packet. The only retained PED education candidates on disk are still the generic `https://webnew.ped.state.nm.us/` root and the statewide Special Education Bureau leaf, while one retained candidate is a wrong-role `https://www.nmhealth.org/about/ddsd` cross-role leak on a non-PED host. No district-owned, county-grade, or regional education exact leaf is preserved in the current queue, so district_or_county_education_routing remains blocked on missing local leaf authoring rather than on another PED root retry.
- vocational_rehabilitation_pre_ets: official_dvr_root_returns_401_without_reviewed_public_alternate :: Reviewed 2026-06-23 the New Mexico VR blocker artifacts plus the NM low-token registry. The exact official DVR root `https://www.dvr.nm.gov/` is still the only reviewed first-party VR host in the state packet and it returns HTTP 401 Unauthorized in bounded fetches. The New Mexico official-domain registry still carries no reviewed alternate VR domain, and the NM unresolved-roles ledger still shows both `vocational_rehabilitation` and `pre_ets` with `no_reviewed_allowed_domains`. New Mexico VR therefore remains blocked on missing reviewed alternate official-root evidence after the 401 lane, not on a broader discovery gap.
- county_local_disability_resources: live_hca_field_office_archive_exists_but_county_complete_contract_not_yet_preserved :: Reviewed 2026-06-23 the live HCA field-office blocker artifacts plus the existing New Mexico report. The official HCA field-office archive is publicly reachable and already preserves county-specific office posts across page 1 and page 2, including Bernalillo County NW, Bernalillo County SW, Hidalgo County, Roosevelt County, Chaves County, Curry County, and Dona Ana variants. But no reviewed county-complete 33-county office map or deterministic archive extraction is preserved on disk yet, so county_local_disability_resources remains blocked on exact county-complete authoring, not on a dead source.

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
- county_local_disability_resources: blocked_live_hca_field_office_archive_partial_county_contract; samples=2; first=https://www.hca.nm.gov/lookingforassistance/field_offices_1/

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_local_exact_targets_from_live_hca_field_office_archive
- [major] vocational_rehabilitation_pre_ets: browser_assisted_or_review_alternate_official_vr_root

## Packetized blockers

- `district_or_county_education_routing` now has a leaf-authoring packet that explicitly rejects the wrong-role `nmhealth.org/about/ddsd` candidate and preserves that the queue still has zero district-owned leaves on disk.
- `county_local_disability_resources` now has a county-complete archive packet that treats the HCA field-office archive as a live source needing full extraction, not a dead-source blocker.
- `vocational_rehabilitation_pre_ets` now has a host packet separating the DVR 401 from the missing reviewed alternate-domain problem.

## Completion decision

- New Mexico remains `BLOCKED` and `index_safe=false`.
- Education is still blocked on missing district-owned or county-grade local leaves, not on more statewide PED retries.
- County-local remains blocked on preserving a full 33-county HCA office contract, not on source discovery.
- VR remains blocked on the 401 DVR host plus zero reviewed alternate official roots.
