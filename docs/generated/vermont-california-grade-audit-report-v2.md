# Vermont California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 14
- primary_gap_reason: official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 the official Vermont Education Dashboard Organization Information dataset on `data.vermont.gov`. The public dataset describes itself as `Organization information from 2004-2025`, its schema exposes `SchoolCity`, `SchoolOrganizationName`, `SchoolAddress`, `SchoolYear`, `SupervisoryUnionOrganizationName`, and `SupervisoryUnionOrganizationIdentifier`, and current 2025 rows publicly map local schools in New Haven, Bristol, Monkton, Ferrisburgh, and Vergennes to named supervisory unions and districts. This replaces Vermont's old statewide education fallback with current official district-routing evidence on a Vermont government open-data host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-25 the live first-party Disability Rights Vermont homepage. The page states `Advocating for the legal rights of Vermonters with disabilities`, says `Disability Rights Vermont (DRVT) is part of the national Protection and Advocacy (P&A) system`, and explains that DRVT provides information, referrals, advocacy services, and legal representation when appropriate to individuals with disabilities across Vermont. This now supplies direct first-party protection-and-advocacy designation evidence for Vermont.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 the live first-party Vermont Family Network workshops page and its metadata. The page description states that Vermont Family Network is the `federally designated Parent Training and Information Center`, the Family-to-Family Health Information Center, and a statewide family support organization. This replaces Vermont's old inventory-only PTI hint with current first-party designation evidence.)
- legal_aid: verified_state_grade (reviewed first-party Vermont Legal Aid evidence preserves statewide free civil legal-help routing on the live first-party domain)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_ahs_district_codes_without_public_office_crosswalk (Reviewed 2026-06-25 one more bounded official Vermont county-local pass. The official DCF Vermont Child Care Provider Data dataset on `data.vermont.gov` publicly preserves both `County` and `AHS District` fields, and its field description says `AHS District` is `The three-letter abbreviation for which Agency of Human Services district office jurisdiction the provider's town is in.` Sample rows publicly show town-and-county jurisdiction pairs such as Williston / Chittenden / BDO, East Montpelier / Washington / MDO, North Hero / Grand Isle / ADO, and Bethel / Windsor / HDO. But the live AHS root `https://humanservices.vermont.gov/` and the DCF offices page `https://dcf.vermont.gov/contacts/partners/offices` both returned HTTP 403 CloudFront error pages in this pass, and no reviewed public official dataset or page decodes those AHS district abbreviations into office names, addresses, contacts, or county-served assignments. Vermont therefore still lacks a reviewable public county-to-office assignment contract.)

## Failure ledger

- county_local_disability_resources: official_ahs_district_jurisdiction_codes_exist_but_public_office_crosswalk_is_unavailable_or_403 :: Reviewed 2026-06-25 one more bounded official Vermont county-local pass. The official DCF Vermont Child Care Provider Data dataset on `data.vermont.gov` publicly preserves both `County` and `AHS District` fields, and its field description says `AHS District` is `The three-letter abbreviation for which Agency of Human Services district office jurisdiction the provider's town is in.` Sample rows publicly show town-and-county jurisdiction pairs such as Williston / Chittenden / BDO, East Montpelier / Washington / MDO, North Hero / Grand Isle / ADO, and Bethel / Windsor / HDO. But the live AHS root `https://humanservices.vermont.gov/` and the DCF offices page `https://dcf.vermont.gov/contacts/partners/offices` both returned HTTP 403 CloudFront error pages in this pass, and no reviewed public official dataset or page decodes those AHS district abbreviations into office names, addresses, contacts, or county-served assignments. Vermont therefore still lacks a reviewable public county-to-office assignment contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://ddsd.vermont.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.vermont.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.vermont.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.vermont.gov/
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://data.vermont.gov/Education/Vermont-Education-Dashboard-Organization-Informati/9uwi-evpg
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ddsd.vermont.gov
- protection_and_advocacy: verified_state_grade; samples=3; first=https://disabilityrightsvt.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.vermontfamilynetwork.org/what-we-do/family-support/workshops-consultation/
- legal_aid: verified_state_grade; samples=1; first=https://www.vtlegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_ahs_district_codes_without_public_office_crosswalk; samples=5; first=https://data.vermont.gov/Education/Vermont-Child-Care-Provider-Data/ctdw-tmfz

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_vermont_publishes_public_ahs_district_code_to_office_or_county_service_area_contract

## Repair decision

- Vermont remains BLOCKED and not index-safe.
- `district_or_county_education_routing` now clears because the official Vermont Education Dashboard dataset publicly maps local schools and school cities to named supervisory unions and districts on `data.vermont.gov`.
- `protection_and_advocacy` now clears because Disability Rights Vermont explicitly identifies itself as part of the national Protection and Advocacy system on the live first-party homepage.
- `parent_training_information_center` now clears because Vermont Family Network's live first-party page explicitly preserves its federally designated PTI status.
- `county_local_disability_resources` is the only remaining critical blocker. Official Vermont data proves AHS district jurisdiction codes exist, but the reviewed public AHS and DCF office-directory surfaces returned raw HTTP 403 pages and no reviewed public source decodes the district abbreviations into office names, contacts, or county-served assignments.
