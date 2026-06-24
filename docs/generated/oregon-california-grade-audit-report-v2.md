# Oregon California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 36
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade_official_directory_pdf (the official Oregon School Directory PDF now clears county-grade education routing. The live ODE School Directory page links a current Combined Directory PDF and explicitly says the index allows users to search by county. Inside the PDF, Oregon education service districts and school districts are described as listed alphabetically by county, and the district example preserves phone, address, website, email, and superintendent fields. Oregon therefore now has an official county-searchable district-routing contract on disk even without district-owned special-education leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Oregon evidence preserves statewide protection-and-advocacy identity plus Oregon-specific disability legal help language)
- parent_training_information_center: verified_state_grade (authoritative Oregon PTI designation is preserved on the Parent Center Hub Oregon leaf and tied to the live FACT Oregon first-party host)
- legal_aid: verified_state_grade (reviewed first-party Oregon Law Center evidence preserves statewide legal-aid identity and help scope)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-24 exact official Oregon ODHS office-finder data contract. The live `https://www.oregon.gov/odhs/pages/office-finder.aspx` page preserves a custom `<odhs-office-finder />` component, and the same first-party stack publicly exposes the SharePoint `Office Locations` list at `https://www.oregon.gov/odhs/_api/web/lists/GetByTitle('Office Locations')/items`. That list returns 269 office rows with explicit multi-choice `County` values, office names, addresses, cities, zip codes, phone numbers, and office-type ids. The returned county arrays span all 36 Oregon counties from Baker through Yamhill, and the list itself includes exact local rows such as `Baker City Aging and People with Disabilities` with Baker County, street address, and phone. Oregon therefore now has a reviewed official county-grade ODHS office contract instead of only a custom app shell.)

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.oregon.gov/oha/hsd/ohp/pages/index.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.oregon.gov/odhs/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.oregon.gov/odhs/idd/pages/default.aspx
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.oregon.gov/ode/students-and-family/SpecialEducation/earlyintervention/Pages/default.aspx
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.oregon.gov/ode
- district_or_county_education_routing: verified_county_grade_official_directory_pdf; samples=4; first=https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.oregon.gov/odhs/vr/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://droregon.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/oregon/
- legal_aid: verified_state_grade; samples=1; first=https://oregonlawcenter.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=4; first=https://www.oregon.gov/odhs/pages/office-finder.aspx

## Next actions

- [info] maintenance: Preserve Oregon as COMPLETE/index_safe and rerun only maintenance truth audits unless the exact ODHS Office Locations API contract regresses.

## County-local repair

- The old `dhhs.oregon.gov/locations` host is dead, but the live ODHS office-finder root is now verified as a real successor lane rather than just a shell.
- The same official first-party stack publicly exposes `/_api/web/lists/GetByTitle('Office Locations')/items` and returns JSON instead of HTML.
- That `Office Locations` list returns 269 public office rows with explicit `County` arrays, office names, street addresses, ZIP codes, phone numbers, and office-type ids.
- The public county arrays span all 36 Oregon counties from Baker through Yamhill, which turns the office-finder into a verified county-grade local routing contract.

## Completion decision

- Oregon is now `COMPLETE` and `index_safe=true`.
- All critical families are verified.
- County-local disability routing is now satisfied by the official ODHS `Office Locations` SharePoint list instead of the earlier shell-only blocker.
