# Utah California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 29
- primary_gap_reason: utah_dhhs_contacts_cloudflare_403_and_live_dws_public_api_surface_still_stops_at_inventory_and_three_service_labels_without_any_county_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_current_official_district_lea_directory (the live Utah Schools Directory now clears district-grade education routing. The official page title is `Utah Schools Directory`, its description says the data is provided from the District or Local Education Agency (LEA) in the CACTUS system and directs corrections back to the District/LEA, the page exposes a District or LEA filter control, and it provides an export-to-CSV action on the current schools.utah.gov host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Law Center evidence explicitly preserves Utah's Protection and Advocacy agency designation)
- parent_training_information_center: verified_state_grade (reviewed first-party Utah Parent Center PTI leaf explicitly preserves Parent Training and Information identity plus Utah contact evidence)
- legal_aid: verified_state_grade (reviewed first-party Disability Law Center evidence preserves statewide disability legal-rights help plus Apply for Help intake routing)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_utah_dhhs_cloudflare_plus_dws_inventory_and_service_taxonomy_without_county_contract (Utah county-local routing remains blocked in the current repo-side lane. `https://dhhs.utah.gov/contacts/` now serves a Cloudflare `403 Attention Required` shell instead of a reviewable public county-contact surface. The surviving official local-office lane is still the DWS office stack: `jobs.utah.gov/department/contact/index.html` still points users to an `Office Map`, the redirected `jobs.utah.gov/office-search/` shell is still live, `https://officesearch-api.jobs.utah.gov/api/v1/offices` still returns office inventory rows, and `https://officesearch-api.jobs.utah.gov/api/v1/services` exposes only the three public service labels `All`, `USOR`, and `EC`. But that official public API surface still exposes no `county`, `countiesServed`, or equivalent service-area contract, and same-host county-style endpoints still do not materialize. Utah therefore still has no complete public county-grade disability-resource office contract.)

## Failure ledger

- county_local_disability_resources: utah_dhhs_contacts_cloudflare_403_and_live_dws_public_api_surface_still_stops_at_inventory_and_three_service_labels_without_any_county_contract :: Reviewed 2026-06-23 one more bounded official Utah county-local pass from the repo-side lane. `https://dhhs.utah.gov/contacts/` now returns HTTP 403 with a Cloudflare `Attention Required` shell, so the former DHHS contacts text is no longer reviewable as a live county-contact source in this lane. The surviving official local-office path remains the DWS family: `https://jobs.utah.gov/department/contact/index.html` still links users to an online `Office Map`, the legacy `/jsp/officesearch/` alias still routes into the live `https://jobs.utah.gov/office-search/` app, and the public API surface is still bounded to `https://officesearch-api.jobs.utah.gov/api/v1/offices` plus `https://officesearch-api.jobs.utah.gov/api/v1/services`. The offices payload still returns 99 rows covering 45 unique offices with inventory fields like `officeName`, address, city, ZIP, coordinates, serviceName, and instructions, but still exposes no `county`, `countiesServed`, or equivalent service-area field. The companion services payload only exposes three labels: `All Offices`, `USOR Services`, and `Employment Centers`. Same-host county-style probes like `/api/v1/counties`, `/api/v1/search`, and `/api/v1/offices/search` still do not materialize a county contract. A bounded payload audit still finds only two unique county-like office labels in the public inventory: `Emery County (Castle Dale)` and `South County (Taylorsville)`. Those facts still do not provide a complete 29-county mapping or reusable county-to-office contract, so Utah remains blocked.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dspd.utah.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.utah.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.utah.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://schools.utah.gov/
- district_or_county_education_routing: verified_current_official_district_lea_directory; samples=3; first=https://schools.utah.gov/schoolsdirectory
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dspd.utah.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=http://disabilitylawcenter.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://utahparentcenter.org/projects/pti
- legal_aid: verified_state_grade; samples=1; first=http://disabilitylawcenter.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=5; first=https://dhhs.utah.gov/contacts/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices

## Completion decision

- Utah still keeps the education repair from the live Utah Schools Directory.
- Utah county-local routing remains the only critical blocker.
- The former DHHS contacts surface is no longer reviewable in the repo-side lane because it now serves a Cloudflare 403 challenge shell.
- The surviving official local-office lane is still the DWS office stack, but its public API surface is still bounded to office inventory plus three service labels: `All`, `USOR`, and `EC`.
- No same-host county endpoint, county field, or service-area field materializes on the public Utah office stack.
- Utah therefore still lacks a complete public county-to-office disability-resource mapping and remains BLOCKED / not index-safe.
