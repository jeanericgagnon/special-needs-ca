# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Official Alaska DEED district-profiles directory and district map pages preserve named district detail leaves with addresses, phones, emails, and superintendent contacts for Alaska local school systems, including borough districts plus REAA routing for unorganized areas.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Law Center of Alaska pages now preserve explicit Protection and Advocacy grant designations, including PADD, PAIMI, PAIR, and related federal P&A authorities on the DLCAK funding page.)
- parent_training_information_center: verified_state_grade (Reviewed authoritative Parent Center Hub Alaska leaf explicitly labels Stone Soup Group as Alaska PTI and preserves statewide Alaska contact evidence, so the PTI family is now verified even though Stone Soup Group’s own first-party pages still emphasize support scope instead of repeating the PTI designation.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_phone_only_dfcs_relay_plus_dfcs_site_map_with_wrong_role_ocs_office_leaf_plus_search_without_public_results_plus_legacy_dpa_canonicalization_into_health_host_challenge (The live Alaska DFCS successor host is still not enough to clear county-local routing after one more bounded official recheck on 2026-06-24. `https://dfcs.alaska.gov/Pages/Services.aspx` remains reviewable but still only exposes statewide phone routing for Adult Public Assistance and Apply for Medicaid. `https://dfcs.alaska.gov/Pages/Publications.aspx` still exposes no DPA office, borough, census-area, or public-assistance office-routing material. `https://dfcs.alaska.gov/Pages/Site-Map.aspx` is now also clearly live, but the only office-looking leaf it surfaces is the wrong-service `/ocs/Pages/offices/default.aspx` page titled `OCS Regional Offices`, not a DPA or public-assistance office contract. `https://dfcs.alaska.gov/Search/default.aspx` remains publicly readable, but its results endpoint still returns SharePoint File Not Found and a bounded keyword POST still self-posts to the same generic shell without public office rows. The current `health.alaska.gov` DPA family still returns the Cloudflare `Just a moment...` shell. The legacy `dhss.alaska.gov/dpa` lane is now sharper too: exact DPA root, office, contacts, and publications paths all canonicalize into the same challenged `https://health.alaska.gov/dpa` host rather than preserving an independent reviewable legacy subtree. Alaska therefore still lacks any public borough- or census-area office-routing contract on current DFCS, current health, or legacy DHSS official surfaces.)

## Failure ledger

- county_local_disability_resources: dfcs_services_publications_search_and_site_map_still_expose_no_local_dpa_contract_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host :: Reviewed 2026-06-24 bounded official Alaska rechecks across the live DFCS successor host, the DFCS Publications / Site Map / Search surfaces, the current `health.alaska.gov` family, and the legacy `dhss.alaska.gov` DPA subtree. `https://dfcs.alaska.gov/Pages/Services.aspx` remains live and publicly reviewable, but still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid rather than borough or census-area mapping. `https://dfcs.alaska.gov/Pages/Publications.aspx` is also live, but still exposes no `public assistance`, `medicaid`, `borough`, `census`, or office-routing material. `https://dfcs.alaska.gov/Pages/Site-Map.aspx` is now also clearly live, but the only office-looking leaf it surfaces is the wrong-service `/ocs/Pages/offices/default.aspx` page titled `OCS Regional Offices`, not a DPA or public-assistance office contract. `https://dfcs.alaska.gov/Search/default.aspx` remains publicly readable, but the expected public results endpoint `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance` still returns SharePoint File Not Found and a direct POST back to `/Search/default.aspx` with `InputKeywords=public assistance` still returns HTTP 200 on the same generic Search shell with no reviewable DPA office rows. The current `health.alaska.gov` family still fails closed end to end: exact office and service leaves such as `/en/resources/division-of-public-assistance-dpa-offices/`, `/en/services/adult-public-assistance-apa/`, and `/en/services/division-of-public-assistance-services/apply-for-medicaid/` return HTTP 403 Cloudflare `Just a moment...` shells, and the same 403 applies to `robots.txt`. The legacy `dhss.alaska.gov` host is no longer even a distinct subtree lane for DPA routing: `https://dhss.alaska.gov/dpa/Pages/default.aspx`, `/office-locations.aspx`, `/contacts.aspx`, and `/Publications.aspx` now all canonically land on `https://health.alaska.gov/dpa` and still return the same Cloudflare challenge shell, while only the legacy root and `robots.txt` remain separately public. Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds/Pages/hcbw/eligibility.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.alaska.gov/sped
- district_or_county_education_routing: verified_state_grade; samples=20; first=https://education.alaska.gov/DOE_Rolodex/DistrictProfiles2000/DistrictProfilesSearch.cfm
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds
- protection_and_advocacy: verified_state_grade; samples=2; first=https://www.dlcak.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/alaska/
- legal_aid: verified_state_grade; samples=1; first=http://www.dlcak.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_phone_only_dfcs_relay_plus_dfcs_site_map_with_wrong_role_ocs_office_leaf_plus_search_without_public_results_plus_legacy_dpa_canonicalization_into_health_host_challenge; samples=26; first=https://dfcs.alaska.gov/Pages/Services.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host

## Repair decision

- Alaska remains BLOCKED and not index-safe.
- The live DFCS Services page still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid.
- The live DFCS Publications page still exposes no DPA/public-assistance office-routing material.
- The live DFCS Site Map now clearly exposes only the wrong-service `OCS Regional Offices` leaf rather than a DPA/public-assistance office-routing leaf.
- The public DFCS search page still does not open a usable public results lane.
- The current health host still returns Cloudflare `Just a moment...` 403 shells for the DPA office-routing family.
- The legacy DHSS DPA paths now canonicalize into the same challenged `health.alaska.gov/dpa` host instead of preserving an independent reviewable subtree.
- Alaska therefore still lacks any reviewable borough- or census-area office-routing contract on a public official surface.
