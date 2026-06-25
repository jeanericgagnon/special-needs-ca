# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: reviewed_live_dpa_regions_cross_multiple_borough_or_census_area_boundaries_and_raw_health_page_sitemap_robots_search_all_403

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
- county_local_disability_resources: blocked_dpa_regions_cross_county_equivalent_boundaries_without_borough_assignment_contract (The live Alaska county-local blocker is now more specific than a generic missing-label problem. In the reviewed browser lane on 2026-06-25, the official Department of Health DPA offices page at `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/` is publicly readable and truthfully preserves regional offices, hours, addresses, fax numbers, virtual contact-center routing, and secure upload options on the current official host. But the reviewed office groupings themselves cross or mismatch county-equivalent boundaries: `Alaska Peninsula` groups Homer and Kenai, `Northern Alaska` groups Fairbanks and Nome, `Southcentral Alaska` groups Anchorage and Matanuska-Susitna Valley, `Southeast Alaska` groups Juneau, Ketchikan, and Sitka, and `Southwest Alaska` groups Bethel and Kodiak. Those region buckets are not a borough or census-area contract, so the office cities cannot be safely projected into county-equivalent coverage. In the raw low-token lane, the same health-host family still fails closed: the exact DPA landing page, DPA offices page, and the related discovery surfaces still return HTTP 403 Cloudflare shells with the title \"Just a moment...\". The DFCS successor host remains negative too: the root page still routes only into Commissioner and OCS branches, Services still only relays statewide phone routing, Site Map still only adds wrong-role branches such as OCS offices and Pioneer Homes payment assistance, Department Contacts still exposes only Commissioner and OCS sections, and bounded search-result guesses still 404. Alaska therefore still lacks any public official borough- or census-area-to-office assignment contract.)

## Failure ledger

- county_local_disability_resources: reviewed_live_dpa_regions_cross_county_equivalent_boundaries_and_raw_health_page_sitemap_robots_search_still_403 :: Reviewed 2026-06-25 one more bounded official Alaska county-local pass across both browser-readable and raw low-token lanes. In the browser-reviewed lane, the official Department of Health DPA Offices page is publicly readable and the office buckets themselves prove why the lane still fails county-equivalent routing: `Alaska Peninsula` groups Homer and Kenai, `Northern Alaska` groups Fairbanks and Nome, `Southcentral Alaska` groups Anchorage and Matanuska-Susitna Valley, `Southeast Alaska` groups Juneau, Ketchikan, and Sitka, and `Southwest Alaska` groups Bethel and Kodiak. Those reviewed regions cross or mismatch multiple borough and census-area boundaries, so the office cities cannot be safely projected into county-equivalent coverage. In the raw low-token lane, the same host still fails closed more broadly than the page itself: the exact DPA landing page, DPA offices page, `sitemap.xml`, `robots.txt`, and bounded site-search URLs all return HTTP 403 Cloudflare shells with the title \"Just a moment...\". The DFCS successor host remains negative too: the root page still routes only into Commissioner and OCS branches, Services still only relays statewide phone routing, Site Map still only adds wrong-role branches such as OCS offices and Pioneer Homes payment assistance, Department Contacts still exposes only Commissioner and OCS sections, and bounded search-result guesses still 404. Alaska therefore still lacks any public official borough- or census-area-to-office assignment contract.

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
- county_local_disability_resources: blocked_dpa_regions_cross_county_equivalent_boundaries_without_borough_assignment_contract; samples=11; first=https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_or_api

## Repair decision

- Alaska remains BLOCKED and not index-safe.
- The official Department of Health DPA offices page is publicly readable in the reviewed browser lane.
- That live page proves regional offices, hours, addresses, and virtual routing, but its reviewed region buckets cross multiple borough and census-area boundaries and still do not create a county-equivalent assignment contract.
- The raw low-token lane still gets Cloudflare `Just a moment...` 403 shells across the same health-host family, so there is no reusable raw export lane from that host yet.
- The DFCS root, Services, Site Map, Department Contacts, and bounded search-result guesses still expose no borough- or census-area DPA office contract.
- Alaska therefore still lacks any public official county-equivalent office-assignment contract.
