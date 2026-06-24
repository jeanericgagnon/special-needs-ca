# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: live_dfcs_services_and_publications_surfaces_still_expose_no_dpa_or_borough_mapping_while_dfcs_search_self_posts_without_results_and_alt_health_legacy_hosts_fail_closed

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
- county_local_disability_resources: blocked_phone_only_dfcs_relay_plus_publications_without_dpa_terms_plus_dfcs_search_shell_without_public_results_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403 (The live Alaska DFCS Services page is still only a statewide phone relay, and one more bounded pass now shows the other currently public official surfaces add no borough-grade routing either. `https://dfcs.alaska.gov/Pages/Publications.aspx` remains live, but a bounded content extraction still finds no `public assistance`, `medicaid`, `adult public assistance`, `locations`, `borough`, or `census` terms and no DPA or office-routing document links. `https://dfcs.alaska.gov/Search/default.aspx` remains publicly readable and still exposes a real `InputKeywords` field, but the expected public results endpoints such as `/Search/Pages/results.aspx?k=public%20assistance`, `/Search/Pages/results.aspx?k=medicaid`, and `/Search/Pages/results.aspx?k=office%20locations` still return SharePoint 404 shells that redirect into `PageNotFoundError.aspx`. A direct POST back to `/Search/default.aspx` with `InputKeywords=public assistance` still self-posts to the same generic `Search` shell and still exposes no DPA office, office-locations, borough, or census-area results. The current `health.alaska.gov` family still returns the same Cloudflare `Just a moment...` 403 shell on exact office leaves and discovery roots such as `robots.txt`. Alternate official siblings do not reopen the lane either: `https://my.alaska.gov/robots.txt` now returns HTTP 403 and `https://alaska.gov/search?query=Division+of+Public+Assistance+offices` returns the state 404 shell. The legacy `dhss.alaska.gov` host is still only partially public: the root canonically lands on `/Pages/default.aspx`, `robots.txt` is live, but `sitemap.xml` is a SharePoint 404 shell and the exact DPA subtree still returns Cloudflare `Just a moment...` 403 shells. That means Alaska still lacks any public borough- or census-area office-routing contract on current DFCS, alternate official siblings, current health, or legacy DHSS official hosts.)

## Failure ledger

- county_local_disability_resources: dfcs_services_and_publications_still_expose_no_local_dpa_contract_while_dfcs_search_alt_hosts_and_health_legacy_dpa_lanes_fail_closed :: Reviewed 2026-06-23 bounded official Alaska rechecks across the live DFCS successor host, the DFCS Publications and public search surfaces, alternate official siblings, the current `health.alaska.gov` family, and the legacy `dhss.alaska.gov` DPA subtree. `https://dfcs.alaska.gov/Pages/Services.aspx` remains live and publicly reviewable, but still provides only statewide phone routing for `Adult Public Assistance` and `Apply for Medicaid` through `888-804-6330` with no borough or census-area mapping. `https://dfcs.alaska.gov/Pages/Publications.aspx` is also live, but a bounded content extraction still finds no `public assistance`, `medicaid`, `adult public assistance`, `locations`, `borough`, or `census` terms and no DPA or office-routing document links. `https://dfcs.alaska.gov/Search/default.aspx` remains publicly readable and exposes a real `InputKeywords` field, but the expected public results endpoints such as `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance`, `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=medicaid`, and `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=office%20locations` still return SharePoint 404 shells that redirect into `PageNotFoundError.aspx`. A direct POST back to `https://dfcs.alaska.gov/Search/default.aspx` with `InputKeywords=public assistance` still returns HTTP 200 on the same generic `Search` shell and still exposes no reviewable DPA office, office-locations, borough, or census-area result rows. The current `health.alaska.gov` family still fails closed end to end: exact office and service leaves such as `/en/resources/division-of-public-assistance-dpa-offices/`, `/en/services/adult-public-assistance-apa/`, and `/en/services/division-of-public-assistance-services/apply-for-medicaid/` return HTTP 403 Cloudflare `Just a moment...` shells, and the same 403 applies to `robots.txt`. Alternate official siblings do not reopen the lane either: `https://my.alaska.gov/robots.txt` returns HTTP 403 and `https://alaska.gov/search?query=Division+of+Public+Assistance+offices` returns HTTP 404. The legacy `dhss.alaska.gov` host is only partially public: the root canonically lands on `https://dhss.alaska.gov/Pages/default.aspx` and `robots.txt` returns 200, but `sitemap.xml` is a SharePoint 404 shell and the exact DPA subtree is still not reviewable because `/dpa/Pages/default.aspx`, `/dpa/Pages/office-locations.aspx`, and `/dpa/Pages/contacts.aspx` all return HTTP 403 Cloudflare `Just a moment...` shells. Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface.

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
- county_local_disability_resources: blocked_phone_only_dfcs_relay_plus_publications_without_dpa_terms_plus_dfcs_search_shell_without_public_results_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403; samples=24; first=https://dfcs.alaska.gov/Pages/Services.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host

## Repair decision

- Alaska remains BLOCKED and not index-safe.
- The live DFCS Services page still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid.
- The live DFCS Publications page still exposes no DPA/public-assistance office-routing material.
- The public DFCS search page still exposes a real keyword input, but the results endpoints still 404 into SharePoint PageNotFound shells and a direct keyword POST still self-posts to the same generic search shell with no DPA office results.
- Alternate official siblings still fail closed: `my.alaska.gov/robots.txt` returns 403 and `alaska.gov/search` returns 404.
- The current health host still returns Cloudflare `Just a moment...` 403 shells for the DPA office-routing family, and the legacy DHSS DPA subtree remains blocked.
- Alaska therefore still lacks any reviewable borough- or census-area office-routing contract on a public official surface.
