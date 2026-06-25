# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `health_alaska_dpa_service_family_now_returns_cloudflare_challenge_shells_while_dfcs_successor_surfaces_still_add_no_borough_or_census_area_assignment_contract`
- Arizona: `ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves`
- Idaho: `reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_still_lack_role_evidence`
- Maine: `official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mde_description_page_is_live_but_mdeorg_root_district_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `bounded_live_ohio_education_leaf_probe_recovers_54_strong_and_24_partial_counties_but_10_counties_still_unresolved`
- Oklahoma: `live_okdhs_public_county_widget_salvages_alfalfa_but_still_only_publishes_two_rows_while_combined_official_county_local_coverage_stops_at_46_and_leaves_31`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is the only remaining Alaska critical blocker. The current Department of Health DPA family has regressed from the older browser-readable assumption: raw fetches to `https://health.alaska.gov/dpa`, the exact DPA offices page, the Adult Public Assistance page, the Apply for Medicaid page, and the public DPA dashboard / Medicaid snapshot PDFs now return HTTP 403 on the official health host. In the reviewed browser lane, the exact DPA offices page and the successor Adult Public Assistance / Apply for Medicaid pages now land on Cloudflare `Just a moment...` shells with the visible heading `Performing security verification` instead of materializing office or service content. The still-readable DFCS successor surfaces remain negative: `Services.aspx` still only points users to statewide successor pages, `Publications.aspx` still exposes no DPA office-routing material, and `Site-Map.aspx` still only adds wrong-role OCS and Pioneer Homes branches. Alaska therefore remains BLOCKED and not index-safe because the official health host is challenge-shelled and the readable successor host still adds no borough- or census-area assignment contract.

### Exact Evidence Needed

- A reviewable public official page, export, PDF, or API that maps Alaska boroughs or census areas to DPA offices.
- A reopened non-challenged DPA office family on health.alaska.gov that materially exposes service-area or county-equivalent assignment fields.
- Any county-equivalent routing contract on a DFCS or successor host that outruns the current statewide-only service references.

### Useful Official URLs Already Tried

- [Alaska DPA landing page](https://health.alaska.gov/dpa)
- [Alaska DPA offices page](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [Adult Public Assistance page](https://health.alaska.gov/en/services/adult-public-assistance-apa/)
- [Apply for Medicaid page](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)
- [Alaska DPA dashboard PDF](https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf)
- [Alaska Medicaid enrollment monthly snapshot PDF](https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf)
- [DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)
- [DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)

### Top Remaining Source-Scouting Targets

- Any official Alaska public-assistance office export with borough or census-area assignments.
- Any reopened health.alaska.gov DPA surface that sheds the current challenge shell and exposes office/service-area fields.
- Any official DFCS successor routing surface that names boroughs or census areas alongside DPA offices.

## Next State Order After Alaska

1. Oklahoma
2. Ohio
3. Minnesota
4. Maine
5. Idaho
6. Arizona
7. Massachusetts
8. New Mexico
9. South Dakota
10. Rhode Island
