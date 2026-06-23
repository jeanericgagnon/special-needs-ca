# Oregon California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 36
- primary_gap_reason: live_state_special_education_root_without_district_contract_and_live_office_finder_root_without_county_extract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_state_special_education_root_without_district_contract (the live Oregon special-education stack is role-pure but still exposes only statewide state pages, while all 36 school_district rows still share the same statewide ODE root)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Oregon evidence preserves statewide protection-and-advocacy identity plus Oregon-specific disability legal help language)
- parent_training_information_center: verified_state_grade (authoritative Oregon PTI designation is preserved on the Parent Center Hub Oregon leaf and tied to the live FACT Oregon first-party host)
- legal_aid: verified_state_grade (reviewed first-party Oregon Law Center evidence preserves statewide legal-aid identity and help scope)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_office_finder_root_without_county_extract (the live ODHS office-finder root exists, but static evidence still exposes no county list or office extract and current county rows remain DOI-backed or dead-host placeholders)

## Failure ledger

- district_or_county_education_routing: live_state_special_education_root_without_district_contract :: Reviewed 2026-06-23 bounded live Oregon education checks plus current DB inventory. `https://www.oregon.gov/ode/students-and-family/specialeducation/pages/default.aspx` is live and role-pure for statewide Special Education, but it remains a generic state page. A bounded DB check still shows all 36 Oregon school_district rows sharing the same root source URL `https://www.oregon.gov/ode` and no district-owned or county-grade special-education leaves on disk. Oregon therefore still lacks a district routing contract.
- county_local_disability_resources: live_office_finder_root_without_county_extract :: Reviewed 2026-06-23 bounded live Oregon county-local checks. The old `https://dhhs.oregon.gov/locations` host now fails DNS resolution, but the live successor root `https://www.oregon.gov/odhs/pages/office-finder.aspx` returns HTTP 200 only as a generic `Find an Office` page with no preserved county list or office extract in static HTML. A bounded DB check also shows current Oregon county-office rows split between 61 DOI-backed planning rows and only 3 dead `dhhs.oregon.gov/locations` rows. No reviewed county-grade office contract is preserved on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.oregon.gov/odhs/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.oregon.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.oregon.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.oregon.gov/ode
- district_or_county_education_routing: blocked_live_state_special_education_root_without_district_contract; samples=3; first=https://www.oregon.gov/ode
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.oregon.gov/odhs/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://droregon.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/oregon/
- legal_aid: verified_state_grade; samples=1; first=https://oregonlawcenter.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_office_finder_root_without_county_extract; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_district_owned_or_county_grade_education_leaves_are_authored
- [critical] county_local_disability_resources: hold_blocked_until_county_grade_office_contract_is_extracted_from_live_office_finder_or_county_owned_leaves

## Completion decision

- Oregon no longer lacks statewide PTI or statewide legal-aid evidence on disk.
- Oregon still cannot reach California-grade or become index-safe because district or county education routing still has no district-owned routing contract, and county/local disability resources still have no preserved county-grade office contract from the live ODHS office-finder root.
- Oregon therefore remains BLOCKED, not COMPLETE.
