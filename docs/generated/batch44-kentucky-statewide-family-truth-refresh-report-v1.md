# Kentucky California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 16
- county_count: 120
- primary_gap_reason: stale_statewide_packet_evidence_failed_live_truth_refresh_and_county_grade_local_leafs_remain_unverified

## Family status

- medicaid_state_health_coverage: missing_reviewed_role_pure_medicaid_source (The old CHFS / DMS packet root is live-broken and the prior packet mixed unrelated ABLE and early-intervention rows into the Medicaid family.)
- medicaid_waiver_hcbs_disability_services: blocked_js_shell_waiver_target_unverified (The exact reviewed DBHDID HCBS target still renders only a loading shell and does not preserve waiver action text or eligibility proof.)
- developmental_disability_idd_authority: blocked_js_shell_dd_authority_target_unverified (The stale dhhs.kentucky.gov DD source was replaced by dbhdid.ky.gov/ddid, but the reviewed exact target still renders only a loading shell with no DD routing proof.)
- early_intervention_part_c: missing_reviewed_role_aligned_part_c_source (Kentucky still lacks a reviewed role-aligned Part C / First Steps source on disk after the stale Early Start packet family was rejected.)
- special_education_idea_part_b: missing_reviewed_state_special_education_source (The packet special-education authority row points to education.kentucky.gov, which is not a live reviewed KDE authority source.)
- district_or_county_education_routing: blocked_exact_leaf_repair_not_started (Generic statewide KDE fallback rows are still standing in for county- or district-owned routing evidence.)
- vocational_rehabilitation_pre_ets: missing_reviewed_vr_or_pre_ets_source (The old packet sample was a DD program root, not a reviewed vocational rehabilitation or Pre-ETS source.)
- protection_and_advocacy: verified_state_grade (Reviewed KYPA first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: blocked_reviewed_parent_support_source_not_explicit_pti (Reviewed KY-SPIN evidence proves statewide parent support, but not explicit PTI designation.)
- legal_aid: missing_reviewed_statewide_legal_aid_source (No reviewed statewide legal-aid source is present in the current Kentucky packet.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: blocked_generic_or_third_party_local_directory_only (County-local packet rows still rely on stale fake-domain locator evidence or DOI mirror rows rather than live county-grade official office leaves.)

## Failure ledger

- medicaid_state_health_coverage: live_medicaid_root_404_and_no_reviewed_replacement :: Reviewed 2026-06-21 targeted live probe returned HTTP 404 for the exact Kentucky Medicaid packet URL. The packet also mixed unrelated ABLE and early-intervention rows into the Medicaid family.
- medicaid_waiver_hcbs_disability_services: reviewed_exact_target_only_returns_js_loading_shell :: Reviewed 2026-06-21 Playwright render returned only "Loading to Department for Behavioral Health page." with no waiver eligibility, application, or action text.
- developmental_disability_idd_authority: reviewed_exact_target_only_returns_js_loading_shell :: Reviewed 2026-06-21 Playwright render returned only "Loading to Department for Behavioral Health page." with no headings, contact signals, or role-aligned DD routing content.
- early_intervention_part_c: legacy_early_intervention_source_dead_and_no_reviewed_replacement :: Kentucky still has no reviewed role-aligned Part C / First Steps source on disk after the old Early Start packet family went stale.
- special_education_idea_part_b: state_special_education_root_not_live_reviewed :: Reviewed 2026-06-21 targeted live probe failed DNS resolution for education.kentucky.gov, so the packet special-education root is not a live reviewed authority source.
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Kentucky district routing still depends on generic statewide KDE fallback rows; no reviewed county- or district-owned special-education leaves are on disk.
- vocational_rehabilitation_pre_ets: legacy_or_wrong_family_vr_sample :: The old packet used the DBHDID root as VR / Pre-ETS evidence, but that source is DD-related and does not prove vocational rehabilitation routing.
- parent_training_information_center: reviewed_statewide_parent_support_source_not_explicit_pti :: KY-SPIN is reviewed and statewide, but the fetched homepage proves parent-support and resource-linking scope rather than explicit PTI designation.
- legal_aid: missing_required_source_family :: No reviewed statewide Kentucky legal-aid source exists in the current packet artifacts.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: County-local packet rows still rely on stale fake-domain locator evidence or DOI mirror rows instead of reviewed county-grade official office leaves.

## Verified source samples

- medicaid_state_health_coverage: missing_reviewed_role_pure_medicaid_source; samples=0
- medicaid_waiver_hcbs_disability_services: blocked_js_shell_waiver_target_unverified; samples=0
- developmental_disability_idd_authority: blocked_js_shell_dd_authority_target_unverified; samples=0
- early_intervention_part_c: missing_reviewed_role_aligned_part_c_source; samples=0
- special_education_idea_part_b: missing_reviewed_state_special_education_source; samples=0
- district_or_county_education_routing: blocked_exact_leaf_repair_not_started; samples=0
- vocational_rehabilitation_pre_ets: missing_reviewed_vr_or_pre_ets_source; samples=0
- protection_and_advocacy: verified_state_grade; samples=1; first=https://kypa.net/
- parent_training_information_center: blocked_reviewed_parent_support_source_not_explicit_pti; samples=1; first=https://www.kyspin.com/
- legal_aid: missing_reviewed_statewide_legal_aid_source; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: blocked_generic_or_third_party_local_directory_only; samples=0

## Next actions

- [critical] medicaid_state_health_coverage: author_or_review_current_kentucky_medicaid_leaf
- [critical] medicaid_waiver_hcbs_disability_services: browser_assisted_or_api_backed_dbhdid_waiver_capture
- [critical] developmental_disability_idd_authority: browser_assisted_or_api_backed_dbhdid_dd_capture
- [critical] early_intervention_part_c: author_or_review_current_official_part_c_source
- [critical] special_education_idea_part_b: author_or_review_live_kde_special_education_leaf
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_or_review_statewide_vr_pre_ets_source
- [major] parent_training_information_center: author_or_review_designated_statewide_pti_source
- [major] legal_aid: author_or_review_statewide_legal_aid_source
- [critical] county_local_disability_resources: author_county_local_exact_targets

## Kentucky truth refresh decision

- Protection and advocacy upgrades to verified statewide evidence because the reviewed first-party KYPA page explicitly says Kentucky Protection and Advocacy is the designated protection and advocacy system in Kentucky and exposes a Get Help / Information & Referrals route.
- Parent training information center does not upgrade even though KY-SPIN is real and statewide. The reviewed homepage proves parent-support and resource-linking scope, but it does not explicitly prove PTI designation.
- Kentucky Medicaid state coverage is downgraded because the exact CHFS/DMS packet source now fails live review with HTTP 404, and the prior packet incorrectly mixed ABLE and early-intervention rows into the Medicaid family.
- Kentucky DD authority and waiver families do not upgrade from the exact DBHDID replacements because the reviewed Playwright render of both exact targets returns only a loading shell with no headings, contact signals, or role-aligned action content.
- Kentucky early intervention remains missing because the old Early Start packet source is stale and no reviewed role-aligned Part C / First Steps source is currently preserved on disk.
- Kentucky special-education authority is downgraded because the packet still points to education.kentucky.gov, which failed live DNS review and therefore is not a current reviewed state authority source.
- Kentucky district/county education routing remains blocked because no reviewed county- or district-owned special-education leaves replace the generic statewide KDE fallback rows.
- Kentucky county-local disability resources remain blocked because the packet still depends on stale fake-domain locator evidence or DOI mirror rows instead of reviewed county-grade office leaves.
- Kentucky legal aid remains missing because no reviewed statewide legal-aid source is present in the current packet artifacts.
- Kentucky is therefore truthfully BLOCKED and not index-safe. The statewide packet is now internally consistent, but the remaining blockers require new reviewed official sources rather than another rerun of the same stale packet URLs.
