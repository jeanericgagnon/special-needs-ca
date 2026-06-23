# New Mexico California-Grade Audit Report v2

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
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Generic PED-root district rows and a timed-out bounded PED Bureau check do not prove district-owned or county-grade routing.)
- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate (The exact official DVR root now returns HTTP 401 in bounded fetches, and no reviewed alternate first-party VR / Pre-ETS source is preserved on disk yet.)
- protection_and_advocacy: verified_state_grade (Reviewed DRNM first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and intake route.)
- parent_training_information_center: verified_state_grade (The reviewed Parents Reaching Out About page explicitly preserves New Mexico PTI designation on a first-party source.)
- legal_aid: verified_state_grade (The reviewed New Mexico Legal Aid locations page preserves a statewide intake route and explicitly says it serves all counties in New Mexico.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: blocked_live_hca_field_office_archive_partial_county_contract (The live official HCA Field Offices archive now proves some county-specific office leaves, but the current reviewed packet still does not preserve a county-complete office contract.)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: School-district packet rows still collapse to generic PED-root evidence, and the bounded PED Bureau fetch timed out (https://webnew.ped.state.nm.us/bureaus/special-education/) before any district-owned or county-grade leaf could be verified.
- vocational_rehabilitation_pre_ets: official_dvr_root_returns_401_without_reviewed_public_alternate :: Reviewed 2026-06-22 the exact official New Mexico DVR root https://www.dvr.nm.gov/, which returned HTTP 401 Unauthorized in bounded fetches. The old packet still lacks any reviewed alternate first-party VR or Pre-ETS page on disk, so the family is no longer just missing-inventory; it is blocked on the official DVR lane requiring browser-assisted or alternate official-root review.
- county_local_disability_resources: live_hca_field_office_archive_exists_but_county_complete_contract_not_yet_preserved :: Reviewed 2026-06-22 the live official HCA Field Offices archive. The page is role-aligned and public, and it now preserves county-specific office posts such as Bernalillo County NW, Bernalillo County SW, Hidalgo County, Roosevelt County, Chaves County, Curry County, and Dona Ana variants across the first two archive pages. But the bounded review still does not preserve a single county-complete contract or a reviewed full 33-county office extraction on disk, so county_local_disability_resources remains blocked until the live HCA field-office archive is converted into a complete county-grade office map.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.hca.nm.gov/turquoise-care/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hca.nm.gov/eligibility-determination/
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.hca.nm.gov/developmental-disabilities-supports-division/
- early_intervention_part_c: verified_county_grade; samples=2; first=https://www.nmececd.org/family-infant-toddler-fit-program/
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://webnew.ped.state.nm.us/bureaus/special-education/
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=0
- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate; samples=1; first=https://www.dvr.nm.gov/
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

## New Mexico bounded refresh decision

- Parent training information center is now repaired from the first-party Parents Reaching Out About page (https://parentsreachingout.org/about-us/), which explicitly preserves New Mexico's statewide PTI designation.
- Legal aid is now repaired from the first-party New Mexico Legal Aid locations page (https://newmexicolegalaid.org/who-we-are/locations.html), which explicitly says it serves all counties in New Mexico and preserves a statewide intake route.
- Early intervention / Part C now clears county-grade routing because the official FIT page (https://www.nmececd.org/family-infant-toddler-fit-program/) links the official ECECD Regional Office Map (https://www.nmececd.org/regional-office-map/), and that map enumerates county-labeled local offices covering all 33 counties.
- County-local disability resources remain blocked, but the blocker is sharper: the live HCA Field Offices archive (https://www.hca.nm.gov/lookingforassistance/field_offices_1/) is real and role-aligned, yet the current reviewed packet still preserves only a sparse partial county subset instead of a county-complete office contract.
- Vocational rehabilitation / Pre-ETS remains blocked rather than merely missing because the exact official DVR root (https://www.dvr.nm.gov/) returns HTTP 401 and no reviewed alternate official VR source is yet preserved on disk.
- District or county education routing still lacks reviewed county-grade district or regional education leaves beyond the generic statewide PED surface.
- New Mexico therefore remains truthfully `BLOCKED` and `index_safe=false`, but three statewide/local families are now materially more complete and the remaining blockers are more exact.

