# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: bounded_2026_06_26_live_recheck_confirms_current_dpa_page_and_related_health_surfaces_all_return_403_while_dfcs_successor_surfaces_still_expose_no_borough_or_census_area_contract

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
- county_local_disability_resources: blocked_current_health_host_fully_403_again_and_dfcs_successor_surfaces_still_only_statewide_or_search_shell (Reviewed 2026-06-26 one more bounded live Alaska county-local pass. The current official health-host DPA family still fails closed end to end: `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/`, `https://health.alaska.gov/en/division-of-public-assistance/`, `https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf`, and `https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf` all now return HTTP 403 with the Cloudflare `Just a moment...` shell. The DFCS successor family is still publicly reachable but still does not restore county-equivalent routing: `https://dfcs.alaska.gov/Pages/default.aspx`, `/Pages/Services.aspx`, `/pages/search.aspx`, and `/Commissioner/Pages/Contacts/default.aspx` still return HTTP 200 SharePoint pages, but `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance` still returns HTTP 404 and the reviewed successor surfaces still expose no borough or census-area assignment contract for DPA or Medicaid office routing. Alaska therefore still lacks any reviewable public borough- or census-area-to-office contract.)

## Failure ledger

- county_local_disability_resources: reviewed_live_dpa_offices_page_proves_regional_offices_but_no_borough_assignment_and_raw_health_fetches_still_403 :: Reviewed 2026-06-26 one more bounded live Alaska county-local pass. The current official health-host DPA family still fails closed end to end: `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/`, `https://health.alaska.gov/en/division-of-public-assistance/`, `https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf`, and `https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf` all now return HTTP 403 with the Cloudflare `Just a moment...` shell. The DFCS successor family is still publicly reachable but still does not restore county-equivalent routing: `https://dfcs.alaska.gov/Pages/default.aspx`, `/Pages/Services.aspx`, `/pages/search.aspx`, and `/Commissioner/Pages/Contacts/default.aspx` still return HTTP 200 SharePoint pages, but `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance` still returns HTTP 404 and the reviewed successor surfaces still expose no borough or census-area assignment contract for DPA or Medicaid office routing. Alaska therefore still lacks any reviewable public borough- or census-area-to-office contract.

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
- county_local_disability_resources: blocked_live_dpa_offices_page_region_only_with_raw_403_regression_and_dfcs_without_county_equivalent_contract; samples=16; first=https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_or_api

## Completion decision

- Alaska remains BLOCKED and not index-safe.
- County-local routing is still blocked because the current health-host family is now fully 403 again and the DFCS successor still does not publish a borough or census-area contract.
