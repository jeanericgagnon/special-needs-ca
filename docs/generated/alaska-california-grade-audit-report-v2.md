# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: raw_health_host_challenge_persists_while_browser_reviewed_dpa_offices_page_still_lacks_borough_assignment_and_dfcs_root_sitemap_contacts_search_add_no_dpa_contract

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
- county_local_disability_resources: blocked_raw_health_host_challenge_plus_region_only_dpa_page_and_dfcs_root_sitemap_contacts_search_without_county_equivalent_contract (The live Alaska county-local blocker tightened again after one more bounded official DFCS-surface pass on 2026-06-25. The health-host DPA family still fails closed in the raw low-token lane: the exact DPA landing page, DPA offices page, and two health-host PDFs still return HTTP 403 Cloudflare challenge shells. The earlier browser-reviewed DPA offices page is still the strongest positive evidence on that host, but it still only groups offices by broad regions and still does not assign Alaska boroughs or census areas to those offices. The DFCS successor host now also looks source-final in a more explicit way. The DFCS root page still only routes into the Commissioner and Office of Children's Services branches, not public assistance or DPA office routing. The public Services page still only relays statewide phone routing for Adult Public Assistance and Apply for Medicaid back onto the challenge-blocked health host. The public Site Map still surfaces OCS offices, OCS grievance, Pioneer Homes payment assistance, and other wrong-role branches but no DPA/public-assistance office directory. The Commissioner Department Contacts page still exposes only Commissioner and OCS sections. Finally, bounded search-result guesses at `/Pages/search-results.aspx?k=public%20assistance`, `office`, `medicaid`, and `adult%20public%20assistance` all return 404, so the DFCS host does not expose a recoverable public search lane for this family either. Alaska therefore still lacks any public official borough- or census-area-to-office assignment contract.)

## Failure ledger

- county_local_disability_resources: raw_health_host_challenge_persists_and_dfcs_root_sitemap_contacts_plus_search_guesses_expose_no_dpa_borough_or_census_area_contract :: Reviewed 2026-06-25 exact official Alaska county-local surfaces again with one more bounded DFCS-root pass. The raw health-host lane still fails closed: `https://health.alaska.gov/en/division-of-public-assistance/`, `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/`, `https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf`, and `https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf` still return HTTP 403 with the Cloudflare title "Just a moment...". The prior browser-reviewed DPA offices page remains the strongest positive evidence on the same host, but it still only groups offices by broad regions and still does not map Alaska boroughs or census areas to those offices. On the DFCS successor host, `https://dfcs.alaska.gov/Pages/default.aspx` still only routes into Commissioner and OCS branches rather than any DPA/public-assistance office directory. `https://dfcs.alaska.gov/Pages/Services.aspx` still only links Adult Public Assistance and Apply for Medicaid back to the challenge-blocked health host plus statewide phone routing. `https://dfcs.alaska.gov/Pages/Site-Map.aspx` still only exposes wrong-role branches such as OCS offices, OCS grievance, and Pioneer Homes payment assistance. `https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx` still exposes only Commissioner and OCS sections rather than any DPA/public-assistance office directory or borough-assignment text. Bounded search-result guesses at `https://dfcs.alaska.gov/Pages/search-results.aspx?k=public%20assistance`, `office`, `medicaid`, and `adult%20public%20assistance` all returned 404. Alaska therefore still lacks any public official borough- or census-area-to-office assignment surface that can satisfy county-equivalent local routing.

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
- county_local_disability_resources: blocked_raw_health_host_challenge_plus_region_only_dpa_page_and_dfcs_root_sitemap_contacts_search_without_county_equivalent_contract; samples=7; first=https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_api_or_directory

## Repair decision

- Alaska remains BLOCKED and not index-safe.
- The raw low-token lane still gets Cloudflare `Just a moment...` 403 shells across the health-host DPA family.
- The earlier reviewed browser DPA offices page still exists but still only groups offices by broad regions, not boroughs or census areas.
- The DFCS root, Services, Site Map, and Department Contacts pages still expose no DPA/public-assistance office directory or borough-assignment contract.
- The bounded DFCS search-result guesses for `public assistance`, `office`, `medicaid`, and `adult public assistance` all returned 404, so there is no recoverable public search lane on that host for this family.
- Alaska therefore still lacks any public official borough- or census-area office-routing contract on a reviewable surface.
