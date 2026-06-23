# Kentucky California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 120
- primary_gap_reason: all_critical_families_verified

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live CHFS / DMS leaves now provide role-pure statewide Kentucky Medicaid coverage evidence.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed live HCBS Waiver Programs leaf now provides role-pure statewide Kentucky waiver entry evidence.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed live CHFS DBHDID division and Access and Referral leaves now preserve a role-pure Kentucky DD authority and intake contract: the Division of Developmental and Intellectual Disabilities page identifies DDID as the state division, the Access and Referral page explicitly tells families seeking D/ID services to contact their Community Mental Health Center (CMHC) and says A&R includes establishing eligibility and application for waiver services, and the same official DBHDID host exposes a public api/cmhc/center-info feed with named regional centers, counties served, and contact phone numbers.)
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

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.chfs.ky.gov/agencies/dms/Pages/default.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.chfs.ky.gov/agencies/dms/dca/Pages/HCBSWaiverPrograms.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.chfs.ky.gov/agencies/dbhdid/Pages/did.aspx
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

- none

## Kentucky truth refresh decision

- Kentucky DD authority now verifies on official first-party evidence because the CHFS DDID division page is role-pure, the official Access and Referral page explicitly routes families seeking D/ID services to their CMHC for eligibility and waiver application, and the same DBHDID host exposes a public center-info feed with named regional centers, counties served, and contact phone numbers.
- Kentucky district/county education routing upgrades because the official KDE Open House directory exposes exact district detail leaves and a downloadable district workbook with 178 unique district IDs, replacing the generic statewide fallback chain.
- Kentucky county-local disability resources upgrade because the official DCBS page links a public Local Office Search that lists all 120 counties and resolves to county-keyed Family Support office leaves with address, phone, and fax.
- Kentucky vocational rehabilitation upgrades because the reviewed Kentucky Career Center Vocational Rehabilitation leaf now provides a role-pure statewide VR route and direct application path.
- Kentucky PTI upgrades because the first-party KY-SPIN About page explicitly preserves Parent Training and Information (PTI) grant history and statewide center language.
- Kentucky legal aid upgrades because Kentucky Justice Online provides a statewide free legal-help route for Kentuckians and names the participating regional legal-aid organizations.
- Kentucky is therefore truthfully COMPLETE and index-safe.
