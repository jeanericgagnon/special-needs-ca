# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract

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
- county_local_disability_resources: blocked_live_dpa_offices_page_region_only_with_raw_403_regression_and_dfcs_without_county_equivalent_contract (The live Alaska county-local blocker is now dual-lane final rather than challenge-only. In the reviewed browser lane on 2026-06-26, the official Department of Health DPA offices page at `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/` is publicly readable and truthfully preserves regional offices, hours, addresses, fax numbers, virtual contact-center routing, and secure upload options on the current official host. But the page still only groups offices by broad regions like Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, and Southwest Alaska. It still does not assign boroughs or census areas to those offices, and it still exposes no county-equivalent assignment contract anywhere on the page. The reviewed public page also still contains no borough or census-area contract terms such as `borough`, `census area`, `Anchorage Municipality`, `Kenai Peninsula Borough`, `Bethel Census Area`, or `Nome Census Area`; it stops at region labels plus office-city groups like Homer/Kenai, Fairbanks/Nome, Anchorage/Matanuska-Susitna Valley, Juneau/Ketchikan/Sitka, and Bethel/Kodiak. In the raw low-token lane, the same health-host family still fails closed: the exact DPA landing page, DPA offices page, and the two related PDFs still return HTTP 403 Cloudflare shells with the title "Just a moment...". The DFCS successor host remains negative too: the root page still routes only into Commissioner and OCS branches, Services still only relays statewide phone routing, Site Map still only adds wrong-role branches such as OCS offices and Pioneer Homes payment assistance, Department Contacts still exposes only Commissioner and OCS sections, and the live public search page at `https://dfcs.alaska.gov/pages/search.aspx` now materializes only generic site-navigation results like Home, Divisions, Commissioner's Office, Alaska Pioneer Homes, Alaska Psychiatric Institute, Finance & Management Services, Juvenile Justice, and Office of Children's Services for bounded `public assistance`, `office`, `medicaid`, `adult public assistance`, and `virtual contact center` queries. Alaska therefore still lacks any public official borough- or census-area-to-office assignment contract.)

## Failure ledger

- county_local_disability_resources: reviewed_live_dpa_offices_page_proves_regional_offices_but_no_borough_assignment_and_raw_health_fetches_still_403 :: Reviewed 2026-06-26 exact official Alaska county-local surfaces again across both the browser-readable and raw low-token lanes. In the browser-reviewed lane, `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/` is still publicly readable on the current official Department of Health host and preserves regional offices, office hours, street addresses, fax numbers, virtual contact-center routing, and secure document upload options. The live page still groups offices only by broad regions such as Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, and Southwest Alaska, with office-city lists like Homer and Kenai, Fairbanks and Nome, Anchorage and Matanuska-Susitna Valley, Juneau/Ketchikan/Sitka, and Bethel/Kodiak. But it still does not map Alaska boroughs or census areas to those offices. The same reviewed public page also still contains no borough or census-area contract terms such as `borough`, `census area`, `Anchorage Municipality`, `Kenai Peninsula Borough`, `Bethel Census Area`, or `Nome Census Area`; it stops at region labels and office-city groupings. In the raw low-token lane, the health-host family still fails closed: `https://health.alaska.gov/en/division-of-public-assistance/`, `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/`, `https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf`, and `https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf` still return HTTP 403 with the Cloudflare title "Just a moment...". The DFCS successor host remains negative on official public review: `https://dfcs.alaska.gov/Pages/default.aspx` still only routes into Commissioner and OCS branches rather than any DPA/public-assistance office directory; `https://dfcs.alaska.gov/Pages/Services.aspx` still only links Adult Public Assistance and Apply for Medicaid back to the health host plus statewide phone routing; `https://dfcs.alaska.gov/Pages/Site-Map.aspx` still only exposes wrong-role branches such as OCS offices, OCS grievance, and Pioneer Homes payment assistance; and `https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx` still exposes only Commissioner and OCS sections rather than any borough-assignment text. The live public search lane at `https://dfcs.alaska.gov/pages/search.aspx` is real, but the bounded query pages for "public assistance", "office", "medicaid", "adult public assistance", "virtual contact center" now materialize only generic site-navigation results such as Home, Divisions, Commissioner's Office, Alaska Pioneer Homes, Alaska Psychiatric Institute, Finance & Management Services, Juvenile Justice, and Office of Children's Services, with no role-bearing DPA, public-assistance office, or borough-assignment results. Alaska therefore still lacks any public official borough- or census-area-to-office assignment surface that can satisfy county-equivalent local routing.

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

## Repair decision

- Alaska remains BLOCKED and not index-safe.
- The official Department of Health DPA offices page is publicly readable in the reviewed browser lane.
- That live page proves regional offices, hours, addresses, fax numbers, and virtual routing, but it still does not assign boroughs or census areas to those offices and still exposes no borough/census-area contract terms on the reviewed page.
- The raw low-token lane still gets Cloudflare `Just a moment...` 403 shells across the same health-host family, so there is no reusable raw export lane from that host yet.
- The DFCS root, Services, Site Map, Department Contacts, and live public search page still expose no borough- or census-area DPA office contract; the search lane now only returns generic site navigation.
- Alaska therefore still lacks any public official county-equivalent office-assignment contract.
