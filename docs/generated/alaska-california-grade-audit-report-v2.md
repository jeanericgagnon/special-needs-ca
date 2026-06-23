# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged

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
- county_local_disability_resources: blocked_live_dfcs_phone_relay_plus_exhausted_dfcs_host_and_challenged_health_directory (The live Alaska DFCS Services page is reviewable and preserves statewide phone routing for Adult Public Assistance and Apply for Medicaid through 888-804-6330, but it still does not provide borough or census-area office mapping. A final bounded pass on the still-live `dfcs.alaska.gov` host found no alternate local-routing contract there either: `robots.txt` is public, but `sitemap.xml` is 404, the obvious SharePoint search routes 404, guessed office/contact aliases such as `/Pages/Offices.aspx`, `/Pages/Office-Locations.aspx`, `/Pages/Contacts.aspx`, and `/Pages/Public-Assistance.aspx` all 404, and the on-host Publications page does not materialize any office list, directory, or borough/census-area routing content in raw HTML. The exact service links still send users to health.alaska.gov leaves that remain Cloudflare-challenged in the low-token lane, so Alaska still lacks a scraper-safe county-equivalent routing contract.)

## Failure ledger

- county_local_disability_resources: live_dfcs_services_page_is_phone_only_and_dfcs_host_has_no_public_search_sitemap_or_office_alias_while_health_host_directory_stays_challenged :: Reviewed 2026-06-23 bounded official Alaska rechecks against both the live DFCS successor host and the challenged health host. The current DFCS Services page at https://dfcs.alaska.gov/Pages/Services.aspx is live and publicly reviewable. It preserves explicit statewide phone-only routing for `Adult Public Assistance` and `Apply for Medicaid`, both with the same statewide number `888-804-6330`, and its exact links point to https://health.alaska.gov/en/services/adult-public-assistance-apa/ and https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/. But those health-host leaves still return HTTP 403 with the Cloudflare `Just a moment...` shell in the low-token lane, just like the reviewed DPA offices directory at https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/ and the legacy office-locations page at https://health.alaska.gov/dpa/Pages/office-locations.aspx. One more bounded pass on `dfcs.alaska.gov` also exhausted the successor host itself: https://dfcs.alaska.gov/robots.txt is public, but https://dfcs.alaska.gov/sitemap.xml returns 404, SharePoint search routes like `/search/pages/results.aspx?k=public%20assistance` and `/search/pages/results.aspx?k=office` return 404, guessed office aliases like `/Pages/Offices.aspx`, `/Pages/Office-Locations.aspx`, `/Pages/Contacts.aspx`, and `/Pages/Public-Assistance.aspx` all return 404, and the live DFCS Publications page does not materialize any office list, directory, or borough/census-area routing contract in raw HTML. The DFCS Department Contacts page is also live, but it still exposes no borough names, no census-area names, and no Public Assistance or disability office-location mapping contract. So Alaska now has stronger proof that the successor host is exhausted and the office-routing lane still lives only on the challenge-blocked health host, leaving the state blocked on missing reviewable borough- or census-area-to-office mapping.

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
- county_local_disability_resources: blocked_live_dfcs_phone_relay_plus_exhausted_dfcs_host_and_challenged_health_directory; samples=10; first=https://dfcs.alaska.gov/Pages/Services.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_replaces_the_phone_only_dfcs_relay_with_a_reviewable_office_locator

## Repair decision

- Alaska remains BLOCKED and not index-safe.
- The live DFCS Services page is real and preserves statewide phone routing for Adult Public Assistance and Apply for Medicaid, but it is still only a phone relay and not a borough/census-area office map.
- The live DFCS host is now exhausted more tightly: no sitemap, no public search, no office aliases, and no office contract on the Publications page.
- The exact office-facing health-host leaves remain challenge-blocked, so Alaska still lacks a reviewable county-equivalent local-office contract.
