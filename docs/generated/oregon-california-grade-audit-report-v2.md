# Oregon California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 36
- primary_gap_reason: live_odhs_office_finder_is_only_a_custom_component_shell_with_no_public_county_extract_query_contract_or_api_surface

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
- county_local_disability_resources: blocked_live_office_finder_shell_without_public_county_contract (the live ODHS office-finder is a real official custom component shell, but bounded county/city/service probes and API-like probes still expose no public office rows, county list, query contract, or API surface)

## Failure ledger

- county_local_disability_resources: live_office_finder_custom_component_stays_html_shell_under_query_and_api_like_probes :: Reviewed 2026-06-23 one more bounded official Oregon county-local replacement lane on the live ODHS office-finder stack. The old `https://dhhs.oregon.gov/locations` host still fails DNS, and the current successor root `https://www.oregon.gov/odhs/pages/office-finder.aspx` is confirmed live on the official Oregon host. The reviewed page source now tightens the blocker beyond generic SharePoint status: it preserves a custom `<odhs-office-finder />` component inside the page body, loads Leaflet and marker-cluster libraries, and still exposes only generic help text such as `Look up ODHS offices near you and get contact information and directions. Choose the kind of service you need and find an office close to you.` Bounded query-string probes like `?county=Baker`, `?city=Salem`, and `?service=SNAP` still return the same component shell with no public office rows. One more bounded contract pass confirms even naïve public-contract probes like `/_api/`, `?output=1`, `?format=json`, and `?map=1` all return the same HTML shell instead of exposing a data surface. The obvious sitemap and search surfaces still fail to produce a public county extract, and the county-office rows on disk remain DOI-backed planning rows or dead-host placeholders. Oregon therefore remains blocked because the live successor lane is a real official custom app shell, but it still exposes no public county-grade office extract, query contract, or API surface.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.oregon.gov/odhs/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.oregon.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.oregon.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.oregon.gov/ode
- district_or_county_education_routing: verified_county_grade_official_directory_pdf; samples=4; first=https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.oregon.gov/odhs/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://droregon.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/oregon/
- legal_aid: verified_state_grade; samples=1; first=https://oregonlawcenter.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_office_finder_shell_without_public_county_contract; samples=6; first=https://www.oregon.gov/odhs/pages/office-finder.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_live_odhs_office_finder_exposes_public_office_rows_or_county_owned_odhs_leaves_cover_all_36_counties

## County-local refinement

- The old `dhhs.oregon.gov/locations` host is dead, but Oregon now has one live official successor lane on `https://www.oregon.gov/odhs/pages/office-finder.aspx`.
- That page is not just generic SharePoint markup; the source clearly preserves a custom `<odhs-office-finder />` component plus Leaflet libraries.
- But bounded county, city, and service query-string probes still return the same component shell rather than materializing public office rows.
- One more bounded pass also shows naïve public-contract probes like `/_api/`, `?output=1`, `?format=json`, and `?map=1` all return the same HTML shell instead of a data surface.
- Current county-office rows on disk are still DOI planning rows or dead-host placeholders, so the live component does not replace the stale office family yet.

## Completion decision

- Oregon remains `BLOCKED` and `index_safe=false`.
- Education remains cleared by the official county-searchable ODE Combined Directory PDF.
- County-local now fails on a tighter basis: the live official successor is a real custom component shell, but it still exposes no county-grade office extract, query contract, or API surface.
- Oregon therefore still cannot be marked `COMPLETE` or index-safe.
