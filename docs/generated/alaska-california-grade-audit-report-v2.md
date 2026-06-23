# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: live_dfcs_services_page_only_provides_statewide_phone_relay_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked

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
- county_local_disability_resources: blocked_phone_only_dfcs_relay_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403 (The live Alaska DFCS Services page is still only a statewide phone relay, and one more bounded pass now proves both official DPA directory host families fail closed in low-token mode. The current `health.alaska.gov` family still returns the same Cloudflare 403 shell on exact office leaves, service/resource roots, `robots.txt`, `sitemap.xml`, `wp-json`, and `wp-sitemap.xml`. The legacy `dhss.alaska.gov` root and `robots.txt` remain publicly readable, but the exact DPA subtree is also not reviewable: `/dpa/Pages/default.aspx`, `/dpa/Pages/office-locations.aspx`, `/dpa/Pages/contacts.aspx`, and `/dpa/Pages/Publications.aspx` all return HTTP 403, while `sitemap.xml` and SharePoint search routes return 404. That means Alaska still lacks any public borough- or census-area office-routing contract on either the current or legacy official DPA hosts.)

## Failure ledger

- county_local_disability_resources: live_dfcs_services_page_is_phone_only_while_current_health_host_and_legacy_dhss_dpa_subtree_both_fail_closed :: Reviewed 2026-06-23 bounded official Alaska rechecks across the live DFCS successor host, the current `health.alaska.gov` family, and the legacy `dhss.alaska.gov` DPA subtree. `https://dfcs.alaska.gov/Pages/Services.aspx` remains live and publicly reviewable, but still provides only statewide phone routing for `Adult Public Assistance` and `Apply for Medicaid` through `888-804-6330` with no borough or census-area mapping. The current `health.alaska.gov` family still fails closed end to end: exact office and service leaves such as `/en/resources/division-of-public-assistance-dpa-offices/`, `/en/services/adult-public-assistance-apa/`, and `/en/services/division-of-public-assistance-services/apply-for-medicaid/` return HTTP 403, and the same 403 applies to `robots.txt`, `sitemap.xml`, `wp-json`, `wp-sitemap.xml`, and the parent `/en/resources/` and `/en/services/` roots. The legacy `dhss.alaska.gov` host is only partially public: the root and `robots.txt` return 200, but `sitemap.xml` and SharePoint search routes return 404, and the exact DPA subtree is still not reviewable because `/dpa/Pages/default.aspx`, `/dpa/Pages/office-locations.aspx`, `/dpa/Pages/contacts.aspx`, `/dpa/Pages/Publications.aspx`, and `/dsds/Pages/default.aspx` all return HTTP 403. Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface, and the blocker is now sharper because both the current and legacy DPA directory host families fail closed in different ways.

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
- county_local_disability_resources: blocked_phone_only_dfcs_relay_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403; samples=18; first=https://dfcs.alaska.gov/Pages/Services.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host

## Repair decision

- Alaska remains BLOCKED and not index-safe.
- The live DFCS Services page still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid.
- The current health host remains fully challenge-blocked for the DPA office-routing family.
- The legacy DHSS root is only partially live: root and robots are public, but the exact DPA subtree is still 403-blocked and sitemap/search still fail closed.
- Alaska therefore still lacks any reviewable borough- or census-area office-routing contract on a public official surface.
