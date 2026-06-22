# Kentucky California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 50
- county_count: 120
- primary_gap_reason: stale_statewide_packet_evidence_failed_live_truth_refresh_and_county_grade_local_leafs_remain_unverified

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live CHFS / DMS leaves now provide role-pure statewide Kentucky Medicaid coverage evidence.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed live HCBS Waiver Programs leaf now provides role-pure statewide Kentucky waiver entry evidence.)
- developmental_disability_idd_authority: blocked_js_shell_dd_authority_target_unverified (The stale dhhs.kentucky.gov DD source was replaced by dbhdid.ky.gov/ddid, but the reviewed exact target still renders only a loading shell with no DD routing proof.)
- early_intervention_part_c: verified_state_grade (Reviewed live Kentucky Early Intervention System leaf now provides role-aligned Part C / First Steps evidence.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KDE Exceptional Children and Early Learning leaf now provides current state special-education authority evidence.)
- district_or_county_education_routing: blocked_exact_leaf_repair_not_started (Generic statewide KDE fallback rows are still standing in for county- or district-owned routing evidence.)
- vocational_rehabilitation_pre_ets: missing_reviewed_vr_or_pre_ets_source (The old packet sample was a DD program root, not a reviewed vocational rehabilitation or Pre-ETS source.)
- protection_and_advocacy: verified_state_grade (Reviewed KYPA first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: blocked_reviewed_parent_support_source_not_explicit_pti (Reviewed KY-SPIN evidence proves statewide parent support, but not explicit PTI designation.)
- legal_aid: missing_reviewed_statewide_legal_aid_source (No reviewed statewide legal-aid source is present in the current Kentucky packet.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: blocked_generic_or_third_party_local_directory_only (County-local packet rows still rely on stale fake-domain locator evidence or DOI mirror rows rather than live county-grade official office leaves.)

## Failure ledger

- developmental_disability_idd_authority: reviewed_exact_target_only_returns_js_loading_shell :: Reviewed 2026-06-21 Playwright render returned only "Loading to Department for Behavioral Health page." with no headings, contact signals, or role-aligned DD routing content.
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Kentucky district routing still depends on generic statewide KDE fallback rows; no reviewed county- or district-owned special-education leaves are on disk.
- vocational_rehabilitation_pre_ets: legacy_or_wrong_family_vr_sample :: The old packet used the DBHDID root as VR / Pre-ETS evidence, but that source is DD-related and does not prove vocational rehabilitation routing.
- parent_training_information_center: reviewed_statewide_parent_support_source_not_explicit_pti :: KY-SPIN is reviewed and statewide, but the fetched homepage proves parent-support and resource-linking scope rather than explicit PTI designation.
- legal_aid: missing_required_source_family :: No reviewed statewide Kentucky legal-aid source exists in the current packet artifacts.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: County-local packet rows still rely on stale fake-domain locator evidence or DOI mirror rows instead of reviewed county-grade official office leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.chfs.ky.gov/agencies/dms/Pages/default.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.chfs.ky.gov/agencies/dms/dca/Pages/HCBSWaiverPrograms.aspx
- developmental_disability_idd_authority: blocked_js_shell_dd_authority_target_unverified; samples=0
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.chfs.ky.gov/agencies/dph/dmch/ecdb/Pages/keis.aspx
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.ky.gov/specialed/Pages/default.aspx
- district_or_county_education_routing: blocked_exact_leaf_repair_not_started; samples=0
- vocational_rehabilitation_pre_ets: missing_reviewed_vr_or_pre_ets_source; samples=0
- protection_and_advocacy: verified_state_grade; samples=1; first=https://kypa.net/
- parent_training_information_center: blocked_reviewed_parent_support_source_not_explicit_pti; samples=1; first=https://www.kyspin.com/
- legal_aid: missing_reviewed_statewide_legal_aid_source; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: blocked_generic_or_third_party_local_directory_only; samples=0

## Next actions

- [critical] developmental_disability_idd_authority: browser_assisted_or_api_backed_dbhdid_dd_capture
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_or_review_statewide_vr_pre_ets_source
- [major] parent_training_information_center: author_or_review_designated_statewide_pti_source
- [major] legal_aid: author_or_review_statewide_legal_aid_source
- [critical] county_local_disability_resources: author_county_local_exact_targets

## Kentucky truth refresh decision

- Kentucky Medicaid state coverage upgrades because reviewed live CHFS / DMS leaves now provide role-pure statewide Medicaid authority and member-information evidence.
- Kentucky waiver coverage upgrades because reviewed live HCBS Waiver Programs evidence now proves statewide waiver entry and program routing without relying on the DBHDID JavaScript shell.
- Protection and advocacy upgrades to verified statewide evidence because the reviewed first-party KYPA page explicitly says Kentucky Protection and Advocacy is the designated protection and advocacy system in Kentucky and exposes a Get Help / Information & Referrals route.
- Parent training information center does not upgrade even though KY-SPIN is real and statewide. The reviewed homepage proves parent-support and resource-linking scope, but it does not explicitly prove PTI designation.
- Kentucky DD authority remains blocked because the reviewed exact DBHDID replacement still returns only a loading shell with no headings, contact signals, or role-aligned DD routing content.
- Kentucky early intervention upgrades because the reviewed live Kentucky Early Intervention System leaf preserves current Part C / First Steps and point-of-entry routing evidence.
- Kentucky special-education authority upgrades because the reviewed live KDE Exceptional Children and Early Learning leaf now provides a current state special-education authority source.
- Kentucky district/county education routing remains blocked because no reviewed county- or district-owned special-education leaves replace the generic statewide KDE fallback rows.
- Kentucky county-local disability resources remain blocked because the packet still depends on stale fake-domain locator evidence or DOI mirror rows instead of reviewed county-grade office leaves.
- Kentucky legal aid remains missing because no reviewed statewide legal-aid source is present in the current packet artifacts.
- Kentucky is therefore still truthfully BLOCKED and not index-safe. The statewide packet now carries repaired official evidence for Medicaid, waivers, Part C, and state special education, but county-grade routing and DD authority blockers still prevent California-grade completion.
