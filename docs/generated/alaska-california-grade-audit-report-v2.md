# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: browser_only_dpa_directory_lacks_borough_mapping_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves

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
- county_local_disability_resources: blocked_dpa_directory_incomplete_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves (The official Alaska DPA offices page is only recoverable in browser-reviewed rendering and still stops at five regional headings and ten office-city leaves with no borough or census-area mapping. In the low-token fetch lane, the exact page URL, health-host public-assistance search URL, and the exact Adult Public Assistance / Apply for Medicaid leaves linked from the live DFCS Services hub all fail closed through Cloudflare, while the DFCS site itself exposes no borough or census-area office contract. Alaska therefore still lacks a scraper-safe county-equivalent routing contract.)

## Failure ledger

- county_local_disability_resources: browser_only_dpa_directory_lacks_borough_mapping_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves :: Reviewed 2026-06-23 bounded official Alaska rechecks against the live health host plus the live DFCS successor hub and narrow alternate official-host probes for borough and census-area routing. The reviewed rendered DPA offices page at https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/ is a real official directory, but its public contract remains limited to five broad regional headings (Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, Southwest Alaska) and ten office-city leaves (Homer, Kenai, Fairbanks, Nome, Anchorage, Wasilla, Juneau, Ketchikan, Sitka, Bethel, Kodiak) plus the statewide Virtual Contact Center, with no borough names, no census-area names, and no county-equivalent coverage table. Fresh exact-page raw fetches of that DPA offices URL, the health-host public-assistance search URL, and exact service leaves now linked from the live DFCS Services hub, including Adult Public Assistance and Apply for Medicaid, all return HTTP 403 with the Cloudflare `Just a moment...` shell. The DFCS site itself is reachable, but its Search, Site Map, Publications, and Services pages still expose no borough or census-area office mapping; the Services page only relays users into challenge-blocked health-host leaves. Bounded alternate official-host checks also failed closed: `my.alaska.gov/robots.txt` returns an anti-bot JS gate, `alaska.gov/search?...Division+of+Public+Assistance+offices` returns the state 404 page, and the legacy `dhss.alaska.gov` host exposes only generic robots.txt with no public office successor contract. So Alaska now has browser-reviewed proof that the directory exists, live successor-hub proof that the state only relays to challenged leaves, and raw-fetch proof that no scraper-safe county-equivalent routing contract is presently exposed.

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
- county_local_disability_resources: blocked_dpa_directory_incomplete_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves; samples=13; first=https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_replaces_the_dfcs_to_health_host_relay_with_a_reviewable_office_locator

## Repair decision

- The only remaining Alaska blocker is county/local disability resources.
- This bounded pass keeps the blocker final for low-token repair on the current official host family: the DPA offices page is only recoverable in browser-reviewed rendering, remains incomplete for borough or census-area routing, and the same host challenge-blocks the exact page URL plus supporting discovery surfaces.
- The live DFCS successor hub does not repair that gap because its own HTML preserves no borough or census-area routing and its service leaves only relay families into challenge-blocked health-host pages.
- Alternate official successors also fail closed: `my.alaska.gov` exposes only an anti-bot JS gate, `alaska.gov/search` does not expose a search contract for this family, and the legacy `dhss.alaska.gov` host preserves no public office successor lane.
- Alaska remains BLOCKED and not index-safe until the state publishes borough or census-area to DPA office mapping on a reviewable official surface or the DFCS-to-health-host relay is replaced by a reviewable office locator.
