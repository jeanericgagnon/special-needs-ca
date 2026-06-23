# Kentucky California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 120
- primary_gap_reason: dbhdid_public_api_exposes_provider_directory_but_no_dd_authority_routing_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live CHFS / DMS leaves now provide role-pure statewide Kentucky Medicaid coverage evidence.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed live HCBS Waiver Programs leaf now provides role-pure statewide Kentucky waiver entry evidence.)
- developmental_disability_idd_authority: blocked_public_provider_directory_api_without_dd_authority_routing (The stale dhhs.kentucky.gov DD source was replaced by dbhdid.ky.gov/ddid. The reviewed exact target still renders only a JS shell in HTML, but the shipped first-party bundle now exposes public provider-directory APIs for counties and services. Those endpoints sharpen the lane beyond a dead shell, yet they still do not preserve role-pure DD authority routing, intake contacts, or county-to-authority proof.)
- early_intervention_part_c: verified_state_grade (Reviewed live Kentucky Early Intervention System leaf now provides role-aligned Part C / First Steps evidence.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KDE Exceptional Children and Early Learning leaf now provides current state special-education authority evidence.)
- district_or_county_education_routing: verified_state_grade (Reviewed live KDE Open House directory now exposes exact district detail leaves plus an official downloadable district workbook, replacing generic statewide fallback rows with district-grade routing evidence.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live Kentucky Career Center Vocational Rehabilitation leaf now provides role-pure statewide VR routing and application entry evidence.)
- protection_and_advocacy: verified_state_grade (Reviewed KYPA first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party KY-SPIN About page explicitly preserves PTI grant designation and statewide center language.)
- legal_aid: verified_state_grade (Reviewed Kentucky Justice Online now provides a statewide free legal-help route for Kentuckians and names the participating legal-aid organizations.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (Reviewed live DCBS county-office chain now proves county-grade local routing with a statewide office root, 120 county query targets, and county detail leaves showing Family Support office address, phone, and fax.)

## Failure ledger

- developmental_disability_idd_authority: public_dbhdid_provider_directory_api_exposes_counties_and_services_but_not_dd_authority_routing :: Reviewed 2026-06-23 bounded live checks on https://dbhdid.ky.gov/ddid, the shipped first-party JS bundle /static/js/main.858758f2.js, and the public provider-directory endpoints exposed by that bundle. The reviewed exact target still renders only a JavaScript loading shell in HTML, but the bundle now proves public first-party API endpoints such as https://dbhdid.ky.gov/provdirapi/providers/counties and https://dbhdid.ky.gov/provdirapi/providers/services. Those endpoints return county IDs, region IDs, and provider-service taxonomy, which sharpens the lane beyond a dead shell. However, the reviewed public contract still does not preserve a role-pure DD authority/intake page, regional DD office names, intake contacts, or county-to-authority routing text, so California-grade DD authority proof is still missing.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.chfs.ky.gov/agencies/dms/Pages/default.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.chfs.ky.gov/agencies/dms/dca/Pages/HCBSWaiverPrograms.aspx
- developmental_disability_idd_authority: blocked_public_provider_directory_api_without_dd_authority_routing; samples=3; first=https://dbhdid.ky.gov/ddid
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.chfs.ky.gov/agencies/dph/dmch/ecdb/Pages/keis.aspx
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.ky.gov/specialed/Pages/default.aspx
- district_or_county_education_routing: verified_state_grade; samples=178; first=https://openhouse.education.ky.gov/Home/SearchByLetter?districtLetter=A
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://kcc.ky.gov/Vocational-Rehabilitation/Pages/Kentucky-Office-of-Vocational-Rehabilitation.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://kypa.net/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.kyspin.com/about/
- legal_aid: verified_state_grade; samples=1; first=https://www.kyjustice.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=120; first=https://www.chfs.ky.gov/agencies/dcbs/Pages/default.aspx

## Next actions

- [critical] developmental_disability_idd_authority: capture_api_backed_dbhdid_provider_profiles_or_find_role_pure_dd_authority_leaf

## Kentucky truth refresh decision

- Kentucky DD authority remains blocked because the reviewed exact DBHDID replacement still renders as a JS shell and the newly exposed public provider-directory API still does not preserve role-pure DD authority routing or intake/contact proof.
- Kentucky district/county education routing upgrades because the official KDE Open House directory exposes exact district detail leaves and a downloadable district workbook with 178 unique district IDs, replacing the generic statewide fallback chain.
- Kentucky county-local disability resources upgrade because the official DCBS page links a public Local Office Search that lists all 120 counties and resolves to county-keyed Family Support office leaves with address, phone, and fax.
- Kentucky vocational rehabilitation upgrades because the reviewed Kentucky Career Center Vocational Rehabilitation leaf now provides a role-pure statewide VR route and direct application path.
- Kentucky PTI upgrades because the first-party KY-SPIN About page explicitly preserves Parent Training and Information (PTI) grant history and statewide center language.
- Kentucky legal aid upgrades because Kentucky Justice Online provides a statewide free legal-help route for Kentuckians and names the participating regional legal-aid organizations.
- Kentucky is therefore still truthfully BLOCKED and not index-safe. The packet now carries repaired district-grade education routing and county-grade local office routing, but California-grade completion still requires reviewed DD authority evidence instead of the current DBHDID JavaScript shell.
