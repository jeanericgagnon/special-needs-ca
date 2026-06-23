# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: browser_reviewed_dpa_directory_lacks_borough_mapping_and_all_health_host_discovery_surfaces_are_challenge_blocked

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
- county_local_disability_resources: blocked_dpa_directory_incomplete_and_health_host_challenge_locked (The reviewed official DPA offices page is real, but it still stops at five regional headings and ten office-city leaves with no borough or census-area mapping. Bounded raw fetches now confirm the same health.alaska.gov challenge shell on the page itself plus sitemap and search surfaces, so Alaska still lacks a scraper-safe county-equivalent routing contract.)

## Failure ledger

- county_local_disability_resources: browser_reviewed_dpa_directory_lacks_borough_mapping_and_all_health_host_discovery_surfaces_are_challenge_blocked :: Reviewed 2026-06-23 bounded official Alaska rechecks against the live health host plus narrow official-site probes for borough and census-area routing. The reviewed rendered DPA offices page at https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/ is still a real official directory, but its public contract remains limited to five broad regional headings (Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, Southwest Alaska) and ten office-city leaves (Homer, Kenai, Fairbanks, Nome, Anchorage, Wasilla, Juneau, Ketchikan, Sitka, Bethel, Kodiak) plus the statewide Virtual Contact Center, with no borough names, no census-area names, and no county-equivalent coverage table. A fresh bounded live probe confirmed the same Cloudflare challenge shell on the exact DPA offices page, on https://health.alaska.gov/sitemap.xml, and on health-host search URLs for Bethel Census Area, Aleutians East Borough, and Nome Census Area public-assistance queries. So Alaska now has both browser-reviewed proof that the current official page is incomplete for county-equivalent routing and raw-fetch proof that the host blocks the exact discovery surfaces needed for a low-token borough-to-office repair.

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
- county_local_disability_resources: blocked_dpa_directory_incomplete_and_health_host_challenge_locked; samples=14; first=https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_the_health_host_challenge_clears

## Repair decision

- The only remaining Alaska blocker is county/local disability resources.
- This bounded pass confirms the blocker is final for low-token repair on the current official host: the reviewed DPA offices page is incomplete for borough or census-area routing, and the same host challenge-blocks the page itself, sitemap discovery, and official-site search probes.
- That means Alaska is not missing one more scrape attempt. It is missing a different official contract: either borough or census-area mapping on the current DPA directory, or a separate official county-equivalent locator that actually names coverage.
- Alaska remains BLOCKED and not index-safe until the state publishes borough or census-area to DPA office mapping on a reviewable official surface or the health-host challenge clears and exposes a stronger county-equivalent contract.

