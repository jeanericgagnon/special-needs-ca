# New Mexico California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 41
- county_count: 33
- primary_gap_reason: stale_state_packet_sources_rejected_and_county_grade_leaf_proof_still_missing

## Family status

- medicaid_state_health_coverage: blocked_live_medicaid_replacement_not_yet_reviewed (Legacy HSD / MAD proof is dead or mixed-family, and the packet still lacks a reviewed current New Mexico Medicaid page on disk.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed HCA DDSD evidence on disk now proves statewide DD-waiver application / eligibility and HCBS disability-services routing.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed HCA DDSD evidence on disk replaced the stale dhhs.new-mexico.gov DD authority path.)
- early_intervention_part_c: missing_reviewed_role_aligned_part_c_source (The old dhhs.new-mexico.gov/earlystart path is dead and the current reviewed evidence on disk is DD-waiver routing, not Part C / FIT routing.)
- special_education_idea_part_b: verified_state_grade (The reviewed New Mexico regional education row still points to the PED Special Education Bureau page as the statewide Part B authority, while district-grade routing remains a separate blocked family.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Generic PED-root district rows and a timed-out bounded PED Bureau check do not prove district-owned or county-grade routing.)
- vocational_rehabilitation_pre_ets: missing_reviewed_vr_or_pre_ets_source (Only legacy inventory hints remain; no reviewed New Mexico VR or Pre-ETS source is verified on disk.)
- protection_and_advocacy: verified_state_grade (Reviewed DRNM first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and intake route.)
- parent_training_information_center: blocked_reviewed_parent_support_source_lacks_explicit_pti_designation (Reviewed Parents Reaching Out evidence proves statewide parent support and Family-to-Family scope, but not explicit PTI designation.)
- legal_aid: missing_reviewed_statewide_legal_aid_source (No reviewed statewide legal-aid source is present in the current New Mexico packet.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: blocked_generic_or_third_party_local_directory_only (The current packet still depends on stale HSD / dhhs paths or DOI mirrors instead of live county-grade official office leaves.)

## Failure ledger

- medicaid_state_health_coverage: legacy_medicaid_samples_dead_or_wrong_family :: The old HSD / MAD packet target returned http_404 (https://www.hsd.state.nm.us/mad) and the prior packet mixed unrelated ABLE and early-intervention samples into the Medicaid family.
- early_intervention_part_c: legacy_early_intervention_source_dead_and_no_reviewed_replacement :: The old dhhs.new-mexico.gov/earlystart packet source is dead and the reviewed HCA DDSD page is not a Part C / FIT / early-intervention source.
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: School-district packet rows still collapse to generic PED-root evidence, and the bounded PED Bureau fetch timed out (https://webnew.ped.state.nm.us/bureaus/special-education/) before any district-owned or county-grade leaf could be verified.
- vocational_rehabilitation_pre_ets: missing_reviewed_vr_or_pre_ets_source :: The only old packet sample was a DDSD page, which is not a VR or Pre-ETS source, and no reviewed New Mexico VR source is verified on disk.
- parent_training_information_center: reviewed_statewide_parent_support_source_not_explicit_pti :: Parents Reaching Out is reviewed and statewide, but the fetched homepage proves Family-to-Family and parent-support scope, not explicit PTI designation.
- legal_aid: missing_required_source_family :: No reviewed statewide legal-aid source exists in the current New Mexico packet.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: County-local packet rows still rely on stale HSD / dhhs paths or DOI mirror records instead of live county-owned or official county-grade office leaves.

## Verified source samples

- medicaid_state_health_coverage: blocked_live_medicaid_replacement_not_yet_reviewed; samples=0
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hca.nm.gov/eligibility-determination/
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.hca.nm.gov/developmental-disabilities-supports-division/
- early_intervention_part_c: missing_reviewed_role_aligned_part_c_source; samples=0
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://webnew.ped.state.nm.us/bureaus/special-education/
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=0
- vocational_rehabilitation_pre_ets: missing_reviewed_vr_or_pre_ets_source; samples=0
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drnm.org/
- parent_training_information_center: blocked_reviewed_parent_support_source_lacks_explicit_pti_designation; samples=1; first=https://parentsreachingout.org/
- legal_aid: missing_reviewed_statewide_legal_aid_source; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: blocked_generic_or_third_party_local_directory_only; samples=0

## Next actions

- [critical] medicaid_state_health_coverage: author_or_review_current_hca_medicaid_leaf
- [critical] early_intervention_part_c: author_or_review_current_official_part_c_fit_source
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_or_review_statewide_vr_pre_ets_source
- [major] parent_training_information_center: author_or_review_designated_statewide_pti_source
- [major] legal_aid: author_or_review_statewide_legal_aid_source
- [critical] county_local_disability_resources: author_county_local_exact_targets

## New Mexico truth refresh decision

- Protection and advocacy upgrades to verified statewide evidence because the reviewed DRNM first-party page explicitly states that DRNM is the federally mandated protection and advocacy system for New Mexico and exposes direct Get Help / intake routing (https://drnm.org/).
- Parent training information center does not upgrade, even though Parents Reaching Out is a real statewide family-support source, because the reviewed homepage only proves Family-to-Family healthcare information center scope and parent advocacy support, not explicit PTI designation (https://parentsreachingout.org/).
- Developmental disability / IDD authority and Medicaid waiver / HCBS disability services are repaired from the reviewed HCA DDSD evidence chain. The stale dhhs.new-mexico.gov DD sample is replaced by the live HCA DDSD page (https://www.hca.nm.gov/developmental-disabilities-supports-division/), and the same reviewed source proves DD Waiver Application/Eligibility Determination routing (https://www.hca.nm.gov/eligibility-determination/).
- Medicaid state health coverage is downgraded because the old HSD / MAD sample chain is no longer trustworthy: the legacy MAD URL now returns http_404 in the bounded New Mexico low-token lane, and the packet mixed ABLE and early-intervention samples into the Medicaid family instead of preserving a role-pure Medicaid source.
- Early intervention / Part C is downgraded because the old dhhs.new-mexico.gov/earlystart packet URL is dead and the reviewed HCA DDSD page is DD-waiver routing, not a Part C / FIT / early-intervention source.
- District or county education routing remains blocked because the packet still relies on generic PED-root district rows, and the bounded official PED Special Education Bureau checks timed out before any district-owned or county-grade education leaf could be verified (https://webnew.ped.state.nm.us/bureaus/special-education/).
- County-local disability resources remain blocked because the current packet still depends on stale HSD / dhhs office paths or DOI mirror rows rather than live county-owned or official county-grade office leaves.
- Legal aid remains missing because no reviewed statewide legal-aid source exists on disk in the current packet.
- New Mexico is therefore truthfully BLOCKED and not index-safe. The packet is now internally consistent, but it cannot move forward until new exact official Medicaid, EI, county-local, and district/county education evidence is reviewed.
