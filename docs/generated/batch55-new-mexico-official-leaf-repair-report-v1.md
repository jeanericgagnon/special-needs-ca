# New Mexico California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 50
- county_count: 33
- primary_gap_reason: county_grade_leaf_proof_still_missing_after_official_statewide_repairs

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live HCA Medicaid leaves now prove statewide New Mexico Medicaid coverage and application routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed HCA DDSD evidence on disk now proves statewide DD-waiver application / eligibility and HCBS disability-services routing.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed HCA DDSD evidence on disk replaced the stale dhhs.new-mexico.gov DD authority path.)
- early_intervention_part_c: blocked_county_grade_fit_local_routing_unverified (The official ECECD FIT program page is now reviewed, but the packet still lacks county-grade FIT local-office or local-provider routing proof.)
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

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: School-district packet rows still collapse to generic PED-root evidence, and the bounded PED Bureau fetch timed out (https://webnew.ped.state.nm.us/bureaus/special-education/) before any district-owned or county-grade leaf could be verified.
- vocational_rehabilitation_pre_ets: missing_reviewed_vr_or_pre_ets_source :: The only old packet sample was a DDSD page, which is not a VR or Pre-ETS source, and no reviewed New Mexico VR source is verified on disk.
- parent_training_information_center: reviewed_statewide_parent_support_source_not_explicit_pti :: Parents Reaching Out is reviewed and statewide, but the fetched homepage proves Family-to-Family and parent-support scope, not explicit PTI designation.
- legal_aid: missing_required_source_family :: No reviewed statewide legal-aid source exists in the current New Mexico packet.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: County-local packet rows still rely on stale HSD / dhhs paths or DOI mirror records instead of live county-owned or official county-grade office leaves.
- early_intervention_part_c: statewide_fit_program_verified_but_county_grade_local_routing_missing :: The official ECECD FIT program page is live and role-aligned, but the packet still lacks reviewed county-grade FIT local-office or local-provider coverage.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.hca.nm.gov/turquoise-care/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hca.nm.gov/eligibility-determination/
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.hca.nm.gov/developmental-disabilities-supports-division/
- early_intervention_part_c: blocked_county_grade_fit_local_routing_unverified; samples=1; first=https://www.nmececd.org/family-infant-toddler-fit-program/
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

- [critical] early_intervention_part_c: author_county_grade_fit_local_targets
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_or_review_statewide_vr_pre_ets_source
- [major] parent_training_information_center: author_or_review_designated_statewide_pti_source
- [major] legal_aid: author_or_review_statewide_legal_aid_source
- [critical] county_local_disability_resources: author_county_local_exact_targets

## New Mexico official leaf repair decision

- Medicaid state health coverage is now repaired from reviewed live HCA leaves: the Turquoise Care overview explicitly identifies the New Mexico Medicaid managed care program (https://www.hca.nm.gov/turquoise-care/) and the HCA Apply For Benefits page preserves the official statewide benefits application route (https://www.hca.nm.gov/lookingforassistance/apply-for-benefits/).
- Early intervention / Part C is no longer missing a role-aligned statewide source because the official ECECD Family Infant Toddler (FIT) page is live and explicitly proves New Mexico’s early-intervention program plus referral context (https://www.nmececd.org/family-infant-toddler-fit-program/).
- Early intervention still does not clear California-grade county gating because the packet still lacks reviewed county-grade FIT local office or local-provider coverage; a statewide FIT program page is not enough to infer county routing.
- Developmental disability / IDD authority, DD waiver / HCBS routing, protection and advocacy, statewide special education authority, ABLE, and SSA remain unchanged from the prior hardened packet and still rely on reviewed role-aligned evidence.
- District or county education routing remains blocked because New Mexico still lacks reviewed district-owned or county-grade education leaves beyond the generic PED statewide surface.
- County-local disability resources remain blocked because the packet still lacks live county-owned or official county-grade office leaves.
- Parent training information center remains blocked because the reviewed Parents Reaching Out page still proves statewide parent support but not explicit PTI designation.
- Legal aid and vocational rehabilitation / Pre-ETS remain missing because the packet still lacks reviewed statewide first-party evidence for those families.
- New Mexico therefore remains truthfully BLOCKED and not index-safe, but the packet is now more accurate: the statewide Medicaid and FIT source families are repaired while the remaining county-grade and statewide-support blockers stay explicit.
