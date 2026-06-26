# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: bounded_2026_06_26_live_recheck_confirms_dpa_offices_page_is_browser_readable_but_region_only_while_raw_health_fetches_still_403_and_dfcs_successor_surfaces_expose_no_borough_or_census_area_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (Programs table rows with verified state program evidence.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Waiver-like program rows or fallback to verified program rows when the state stores waiver entry in the general spine.)
- developmental_disability_idd_authority: verified_state_grade (Verified DD/IDD state-resource-agency rows.)
- early_intervention_part_c: verified_state_grade (Verified early-intervention or Part C agency rows.)
- special_education_idea_part_b: verified_state_grade (Verified regional education or district pages with special-education routing.)
- district_or_county_education_routing: verified_state_grade (Reviewed official Alaska DEED district profile pages, district map pages, and district-specific pages; borough-named county rows match official district entries and REAA routing is preserved for unorganized areas.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Verified programs with VR or Pre-ETS context.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Law Center of Alaska pages now preserve explicit P&A system language and named federal Protection and Advocacy grant authorities.)
- parent_training_information_center: verified_state_grade (Reviewed authoritative Parent Center Hub Alaska leaf explicitly labels Stone Soup Group as Alaska PTI and preserves statewide Alaska contact evidence.)
- legal_aid: verified_state_grade (Reviewed first-party DLCAK artifact on disk explicitly proves statewide disability legal advocacy plus intake and grievance routes, which truthfully satisfies the statewide legal-aid family.)
- able_program: verified_state_grade (Verified ABLE program pages from the program spine.)
- ssi_ssa_federal_reference: verified_state_grade (Verified federal/state crossover program rows.)
- county_local_disability_resources: blocked_reviewable_dpa_offices_regions_without_borough_assignment_and_raw_health_fetches_403 (Reviewed 2026-06-26 one more bounded live Alaska county-local pass. In the reviewed browser lane, the exact official DPA offices page at `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/` is publicly readable again and truthfully proves named regional offices, office hours, full street addresses, fax numbers, a virtual contact center, and secure upload routing on the current health host. But the same page still groups offices only by broad regions such as Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, and Southwest Alaska, and it still does not assign any Alaska boroughs or census areas to those offices. In the raw low-token lane, the wider health-host family still fails closed: `https://health.alaska.gov/en/division-of-public-assistance/`, `https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf`, and `https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf` still return HTTP 403 with the Cloudflare `Just a moment...` shell. The DFCS successor family is still publicly reachable but still does not restore county-equivalent routing: `https://dfcs.alaska.gov/Pages/default.aspx`, `/Pages/Services.aspx`, `/pages/search.aspx`, and `/Commissioner/Pages/Contacts/default.aspx` still return HTTP 200 SharePoint pages, but `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance` still returns HTTP 404 and the reviewed successor surfaces still expose no borough or census-area assignment contract for DPA or Medicaid office routing. The freshly rechecked DFCS Site Map branch also still fails closed as a repair lane: `https://dfcs.alaska.gov/Pages/Site-Map.aspx` is live, but the extra surfaced DAPH leaves `/daph/Pages/services.aspx` and `/daph/Pages/paymentassistance/default.aspx` resolve to Alaska Pioneer Homes services and payment-assistance content rather than public-assistance office routing, while the only office-looking DFCS child lane remains the wrong-role OCS Regional Offices page. Alaska therefore still lacks any reviewable public borough- or census-area-to-office contract.)

## Failure ledger

- county_local_disability_resources: reviewed_live_dpa_offices_page_proves_regional_offices_but_no_borough_assignment_and_raw_health_fetches_still_403 :: Reviewed 2026-06-26 one more bounded live Alaska county-local pass. In the reviewed browser lane, the exact official DPA offices page at `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/` is publicly readable again and truthfully proves named regional offices, office hours, full street addresses, fax numbers, a virtual contact center, and secure upload routing on the current health host. But the same page still groups offices only by broad regions such as Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, and Southwest Alaska, and it still does not assign any Alaska boroughs or census areas to those offices. In the raw low-token lane, the wider health-host family still fails closed: `https://health.alaska.gov/en/division-of-public-assistance/`, `https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf`, and `https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf` still return HTTP 403 with the Cloudflare `Just a moment...` shell. The DFCS successor family is still publicly reachable but still does not restore county-equivalent routing: `https://dfcs.alaska.gov/Pages/default.aspx`, `/Pages/Services.aspx`, `/pages/search.aspx`, and `/Commissioner/Pages/Contacts/default.aspx` still return HTTP 200 SharePoint pages, but `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance` still returns HTTP 404 and the reviewed successor surfaces still expose no borough or census-area assignment contract for DPA or Medicaid office routing. The freshly rechecked DFCS Site Map branch also still fails closed as a repair lane: `https://dfcs.alaska.gov/Pages/Site-Map.aspx` is live, but the extra surfaced DAPH leaves `/daph/Pages/services.aspx` and `/daph/Pages/paymentassistance/default.aspx` resolve to Alaska Pioneer Homes services and payment-assistance content rather than public-assistance office routing, while the only office-looking DFCS child lane remains the wrong-role OCS Regional Offices page. Alaska therefore still lacks any reviewable public borough- or census-area-to-office contract.

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
- county_local_disability_resources: blocked_reviewable_dpa_offices_regions_without_borough_assignment_and_raw_health_fetches_403; samples=16; first=https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_or_api

## Completion decision

- Alaska remains BLOCKED and not index-safe.
- County-local routing is still blocked because the exact DPA offices page only proves broad regional office groupings without any borough or census-area assignment, the wider health-host raw lane still fails closed on related DPA leaves and PDFs, the DFCS successor still does not publish a borough or census-area contract, and the extra DAPH branch is still wrong-role Alaska Pioneer Homes content rather than a hidden DPA office lane.
