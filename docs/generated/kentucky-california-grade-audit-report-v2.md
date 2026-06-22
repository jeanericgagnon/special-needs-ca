# Kentucky California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 120
- primary_gap_reason: dbhdid_js_shell_and_county_grade_local_leafs_remain_unverified

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live CHFS / DMS leaves now provide role-pure statewide Kentucky Medicaid coverage evidence.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed live HCBS Waiver Programs leaf now provides role-pure statewide Kentucky waiver entry evidence.)
- developmental_disability_idd_authority: blocked_js_shell_dd_authority_target_unverified (The stale dhhs.kentucky.gov DD source was replaced by dbhdid.ky.gov/ddid, but the reviewed exact target still renders only a loading shell with no DD routing proof.)
- early_intervention_part_c: verified_state_grade (Reviewed live Kentucky Early Intervention System leaf now provides role-aligned Part C / First Steps evidence.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KDE Exceptional Children and Early Learning leaf now provides current state special-education authority evidence.)
- district_or_county_education_routing: blocked_exact_leaf_repair_not_started (Generic statewide KDE fallback rows are still standing in for county- or district-owned routing evidence.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live Kentucky Career Center Vocational Rehabilitation leaf now provides role-pure statewide VR routing and application entry evidence.)
- protection_and_advocacy: verified_state_grade (Reviewed KYPA first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party KY-SPIN About page explicitly preserves PTI grant designation and statewide center language.)
- legal_aid: verified_state_grade (Reviewed Kentucky Justice Online now provides a statewide free legal-help route for Kentuckians and names the participating legal-aid organizations.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: blocked_generic_or_third_party_local_directory_only (County-local packet rows still rely on stale fake-domain locator evidence or DOI mirror rows rather than live county-grade official office leaves.)

## Failure ledger

- developmental_disability_idd_authority: reviewed_exact_target_only_returns_js_loading_shell :: Reviewed 2026-06-21 Playwright render returned only "Loading to Department for Behavioral Health page." with no headings, contact signals, or role-aligned DD routing content.
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Kentucky district routing still depends on generic statewide KDE fallback rows; no reviewed county- or district-owned special-education leaves are on disk.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: County-local packet rows still rely on stale fake-domain locator evidence or DOI mirror rows instead of reviewed county-grade official office leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.chfs.ky.gov/agencies/dms/Pages/default.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.chfs.ky.gov/agencies/dms/dca/Pages/HCBSWaiverPrograms.aspx
- developmental_disability_idd_authority: blocked_js_shell_dd_authority_target_unverified; samples=0
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.chfs.ky.gov/agencies/dph/dmch/ecdb/Pages/keis.aspx
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.ky.gov/specialed/Pages/default.aspx
- district_or_county_education_routing: blocked_exact_leaf_repair_not_started; samples=0
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://kcc.ky.gov/Vocational-Rehabilitation/Pages/Kentucky-Office-of-Vocational-Rehabilitation.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://kypa.net/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.kyspin.com/about/
- legal_aid: verified_state_grade; samples=1; first=https://www.kyjustice.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: blocked_generic_or_third_party_local_directory_only; samples=0

## Next actions

- [critical] developmental_disability_idd_authority: browser_assisted_or_api_backed_dbhdid_dd_capture
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_local_exact_targets

## Kentucky truth refresh decision

- Kentucky DD authority remains blocked because the reviewed exact DBHDID replacement still returns only a loading shell with no headings, contact signals, or role-aligned DD routing content.
- Kentucky district/county education routing remains blocked because no reviewed county- or district-owned special-education leaves replace the generic statewide KDE fallback rows.
- Kentucky county-local disability resources remain blocked because the packet still depends on stale fake-domain locator evidence or DOI mirror rows instead of reviewed county-grade office leaves.
- Kentucky vocational rehabilitation upgrades because the reviewed Kentucky Career Center Vocational Rehabilitation leaf now provides a role-pure statewide VR route and direct application path.
- Kentucky PTI upgrades because the first-party KY-SPIN About page explicitly preserves Parent Training and Information (PTI) grant history and statewide center language.
- Kentucky legal aid upgrades because Kentucky Justice Online provides a statewide free legal-help route for Kentuckians and names the participating regional legal-aid organizations.
- Kentucky is therefore still truthfully BLOCKED and not index-safe. The statewide packet now carries repaired VR, PTI, and legal-aid evidence, but California-grade completion still requires DD authority, district-grade education routing, and county-grade local disability routing.
