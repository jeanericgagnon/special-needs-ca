# Utah California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 29
- primary_gap_reason: live_utah_dhhs_contacts_and_first_party_wpsl_location_api_only_prove_general_contacts_plus_non_disability_program_location_categories_while_dws_lookup_remains_zip_city_without_any_county_contract

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
- county_local_disability_resources: blocked_live_dhhs_contacts_and_wpsl_categories_still_do_not_materialize_county_local_disability_routing (Utah county-local routing remains blocked. `https://dhhs.utah.gov/contacts/` is publicly reviewable, but it acts only as a central contacts hub: it routes broad community-service discovery to Utah 211, says users can find services by clicking on a county in the map below or using a search bar by type, and later explicitly says `Please visit specific division or program pages for local office information.` One more bounded official first-party pass also confirms the live DHHS WordPress API now exposes location collections, but the current `wp/v2/wpsl_stores` and `wp/v2/wpsl_store_category` payloads only publish `Double Up Food Bucks locations` and `Home Visiting Locations`, not county disability-resource offices. The surviving DWS office-search shell still narrows public lookup to `Zip Code or City`, and its public APIs still expose only office inventory plus `All Offices`, `USOR Services`, and `Employment Centers` with no county or service-area field. Utah still has no complete public county-grade disability-resource office mapping.)

## Failure ledger

- county_local_disability_resources: live_utah_dhhs_contacts_and_first_party_wpsl_location_api_only_prove_general_contacts_plus_non_disability_program_location_categories_while_dws_lookup_remains_zip_city_without_any_county_contract :: Reviewed 2026-06-24 one more bounded official Utah county-local pass from the repo-side lane. `https://dhhs.utah.gov/contacts/` is publicly reviewable again at HTTP 200 with the title `Contacts - Utah Department of Health and Human Services`, but the page still sharpens the blocker instead of clearing it. The live page routes broad community-service discovery to `https://211utah.org/`, says users can find services by clicking on a county in the map below or using a search bar by type, and later explicitly says `Please visit specific division or program pages for local office information.` The official DHHS WordPress API is also publicly reviewable at `https://dhhs.utah.gov/wp-json/` and exposes `wpsl/v1` plus `wp/v2/wpsl_stores` / `wp/v2/wpsl_store_category` routes, but the live first-party location collections only publish two category families: `Double Up Food Bucks locations` (58 rows) and `Home Visiting Locations` (9 rows). Those live categories confirm the current first-party location API is program-specific and still does not materialize county disability-resource office routing. The surviving official local-office path remains the DWS family: `https://jobs.utah.gov/department/contact/index.html` still links users to an online `Office Map`, the legacy `/jsp/officesearch/` alias still routes into the live `https://jobs.utah.gov/office-search/` app, and the live public shell still limits lookup to `Zip Code or City`. The public API surface is still bounded to `https://officesearch-api.jobs.utah.gov/api/v1/offices` plus `https://officesearch-api.jobs.utah.gov/api/v1/services`. The offices payload still returns 99 rows covering 45 unique offices with inventory fields like `officeName`, address, city, ZIP, coordinates, serviceName, and instructions, but still exposes no `county`, `countiesServed`, or equivalent service-area field. The companion services payload only exposes three labels: `All Offices`, `USOR Services`, and `Employment Centers`. Same-host county-style probes like `/api/v1/counties`, `/api/v1/search`, and `/api/v1/offices/search` still do not materialize a county contract. Utah therefore still lacks any complete public county-to-office disability-resource mapping and remains blocked.

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
- county_local_disability_resources: legacy_state_grade; samples=10; first=https://dhhs.utah.gov/contacts/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices

## Completion decision

- Utah still keeps the education repair from the live Utah Schools Directory.
- Utah county-local routing remains the only critical blocker.
- The official Utah DHHS contacts page is live, but it still clearly acts as a central contacts hub rather than a county office directory.
- The official DHHS WordPress API is also live, but its current first-party location collections only publish `Double Up Food Bucks locations` and `Home Visiting Locations`.
- Those first-party WPSL categories are useful negative evidence because they prove the current DHHS map stack is program-specific, not a general county disability-office contract.
- The surviving official DWS office-search shell still limits public lookup to `Zip Code or City`.
- The surviving official DWS public API surface still stops at office inventory plus the three service labels: `All`, `USOR`, and `EC`.
- No same-host county endpoint, county field, or service-area field materializes on the public Utah office stack.
- Utah therefore still lacks a complete public county-to-office disability-resource mapping and remains BLOCKED / not index-safe.
