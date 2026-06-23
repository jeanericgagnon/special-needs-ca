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
- county_local_disability_resources: blocked_live_dfcs_phone_relay_plus_exhausted_dfcs_host_and_challenged_health_directory (The live Alaska DFCS Services page is still only a statewide phone relay, and one more bounded health-host family pass shows the office-routing lane remains completely challenge-blocked on the current official health host. Not just the exact office and service leaves, but also `robots.txt`, `sitemap.xml`, `wp-json`, `wp-sitemap.xml`, and the parent `en/resources` and `en/services` roots all return the same HTTP 403 Cloudflare `Just a moment...` shell. That means the county-equivalent office directory family is not merely blocked on one leaf; the entire current health-host discovery surface is unavailable in the low-token lane.)

## Failure ledger

- county_local_disability_resources: live_dfcs_services_page_is_phone_only_and_entire_health_host_family_stays_403_challenged :: Reviewed 2026-06-23 one more bounded official Alaska county-local pass on the current health host family. The exact office and service leaves still return HTTP 403 with the Cloudflare `Just a moment...` shell, but now the surrounding discovery surfaces prove the same thing: https://health.alaska.gov/robots.txt, https://health.alaska.gov/sitemap.xml, https://health.alaska.gov/wp-json/, https://health.alaska.gov/wp-sitemap.xml, https://health.alaska.gov/en/resources/, and https://health.alaska.gov/en/services/ all return that same 403 shell. Together with the already-exhausted `dfcs.alaska.gov` successor host, that means the current official office-routing lane is blocked across the entire health-host family, not just on one directory leaf. Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface.

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
- county_local_disability_resources: blocked_live_dfcs_phone_relay_plus_exhausted_dfcs_host_and_challenged_health_directory; samples=14; first=https://dfcs.alaska.gov/Pages/Services.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_replaces_the_phone_only_dfcs_relay_with_a_reviewable_office_locator

## Repair decision

- Alaska remains BLOCKED and not index-safe.
- The live DFCS Services page still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid.
- The health host is now source-final more tightly: not only the office leaves, but also robots, sitemap, wp-json, wp-sitemap, and parent resources/services roots all return the same 403 Cloudflare shell.
- Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface.
