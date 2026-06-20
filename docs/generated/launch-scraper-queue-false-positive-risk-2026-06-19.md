# Launch Scraper Queue False-Positive Risk

Generated: 2026-06-19T23:21:10.076Z

Queue-side false-positive risk audit for launch scraper execution so scrape spend goes only to exact targets that do not resemble known placeholder, blocked-shell, or generic-shell patterns.

## Queue Safety

- actionableRows: 2799
- actionableRiskRows: 513
- readyTargetScrapeRows: 551
- readyTargetScrapeRiskRows: 49
- liveRefreshCandidateRows: 2248
- liveRefreshRiskRows: 464
- placeholderReadyRows: 0
- placeholderLiveRefreshRows: 136
- safeToSpendReadyScrapeVolume: true
- safeToSpendLiveRefreshVolume: false

## Summary

- rowCount: 900
- byRiskClass: contactless_directory_shell_risk=25, generic_program_shell_risk=319, knowledge_blocked_source_risk=65, known_rejected_url_reentered_actionable_queue=5, live_refresh_placeholder_domain=136, quarantined_placeholder_domain=322, taxonomy_example_match:contactless_directory_shell=1, taxonomy_example_match:generic_program_shell=3, taxonomy_example_match:thin_or_untrusted_knowledge_shell=24
- byFamily: dd_routing=93, early_intervention_programs=40, education_routing=8, forms_guides=101, knowledge_content=66, medicaid_hhs_offices=83, program_waitlists=76, programs_benefits=335, providers_care=10, transition_programs=40, waivers=48
- byLaunchNeedClass: author_first=11, defer_blocked_source=54, do_not_scrape_quarantined=230, launch_adjacent_deprioritized=80, live_refresh_candidate=464, manual_review=4, ready_target_scrape=49, repair_first=8
- bySeverity: high=141, medium=759
- byRecommendedLane: author_first=358, defer_blocked_source=54, repair_first=488

## Highest Risk Queue Rows

| risk class | severity | family | state | queue class | recommended lane | url |
|---|---|---|---|---|---|---|
| known_rejected_url_reentered_actionable_queue | high | forms_guides | california | live_refresh_candidate | repair_first | https://www.dhcs.ca.gov/services/medi-cal/pages/apply_for_medi-cal.aspx |
| known_rejected_url_reentered_actionable_queue | high | forms_guides | california | ready_target_scrape | repair_first | https://www.dhcs.ca.gov/services/medi-cal/pages/apply_for_medi-cal.aspx |
| known_rejected_url_reentered_actionable_queue | high | forms_guides | new-jersey | live_refresh_candidate | repair_first | https://www.nj.gov/humanservices/ddd |
| known_rejected_url_reentered_actionable_queue | high | program_waitlists |  | live_refresh_candidate | repair_first | https://www.nj.gov/humanservices/ddd |
| known_rejected_url_reentered_actionable_queue | high | programs_benefits | new-jersey | live_refresh_candidate | repair_first | https://www.nj.gov/humanservices/ddd |
| live_refresh_placeholder_domain | high | dd_routing | alabama | live_refresh_candidate | repair_first | https://dhhs.alabama.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | alabama | live_refresh_candidate | repair_first | https://dhhs.alabama.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | alaska | live_refresh_candidate | repair_first | https://dhhs.alaska.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | alaska | live_refresh_candidate | repair_first | https://dhhs.alaska.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | arizona | live_refresh_candidate | repair_first | https://dhhs.arizona.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | arizona | live_refresh_candidate | repair_first | https://dhhs.arizona.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | arkansas | live_refresh_candidate | repair_first | https://dhhs.arkansas.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | arkansas | live_refresh_candidate | repair_first | https://dhhs.arkansas.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | colorado | live_refresh_candidate | repair_first | https://dhhs.colorado.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | colorado | live_refresh_candidate | repair_first | https://dhhs.colorado.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | connecticut | live_refresh_candidate | repair_first | https://dhhs.connecticut.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | connecticut | live_refresh_candidate | repair_first | https://dhhs.connecticut.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | delaware | live_refresh_candidate | repair_first | https://dhhs.delaware.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | delaware | live_refresh_candidate | repair_first | https://dhhs.delaware.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | hawaii | live_refresh_candidate | repair_first | https://dhhs.hawaii.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | hawaii | live_refresh_candidate | repair_first | https://dhhs.hawaii.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | idaho | live_refresh_candidate | repair_first | https://dhhs.idaho.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | idaho | live_refresh_candidate | repair_first | https://dhhs.idaho.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | indiana | live_refresh_candidate | repair_first | https://dhhs.indiana.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | indiana | live_refresh_candidate | repair_first | https://dhhs.indiana.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | iowa | live_refresh_candidate | repair_first | https://dhhs.iowa.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | iowa | live_refresh_candidate | repair_first | https://dhhs.iowa.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | kansas | live_refresh_candidate | repair_first | https://dhhs.kansas.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | kansas | live_refresh_candidate | repair_first | https://dhhs.kansas.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | kentucky | live_refresh_candidate | repair_first | https://dhhs.kentucky.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | kentucky | live_refresh_candidate | repair_first | https://dhhs.kentucky.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | louisiana | live_refresh_candidate | repair_first | https://dhhs.louisiana.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | louisiana | live_refresh_candidate | repair_first | https://dhhs.louisiana.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | maine | live_refresh_candidate | repair_first | https://dhhs.maine.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | maine | live_refresh_candidate | repair_first | https://dhhs.maine.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | maryland | live_refresh_candidate | repair_first | https://dhhs.maryland.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | maryland | live_refresh_candidate | repair_first | https://dhhs.maryland.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | massachusetts | live_refresh_candidate | repair_first | https://dhhs.massachusetts.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | massachusetts | live_refresh_candidate | repair_first | https://dhhs.massachusetts.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | michigan | live_refresh_candidate | repair_first | https://dhhs.michigan.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | michigan | live_refresh_candidate | repair_first | https://dhhs.michigan.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | minnesota | live_refresh_candidate | repair_first | https://dhhs.minnesota.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | minnesota | live_refresh_candidate | repair_first | https://dhhs.minnesota.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | mississippi | live_refresh_candidate | repair_first | https://dhhs.mississippi.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | mississippi | live_refresh_candidate | repair_first | https://dhhs.mississippi.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | missouri | live_refresh_candidate | repair_first | https://dhhs.missouri.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | missouri | live_refresh_candidate | repair_first | https://dhhs.missouri.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | montana | live_refresh_candidate | repair_first | https://dhhs.montana.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | montana | live_refresh_candidate | repair_first | https://dhhs.montana.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | nebraska | live_refresh_candidate | repair_first | https://dhhs.nebraska.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | nebraska | live_refresh_candidate | repair_first | https://dhhs.nebraska.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | nevada | live_refresh_candidate | repair_first | https://dhhs.nevada.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | nevada | live_refresh_candidate | repair_first | https://dhhs.nevada.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | new-hampshire | live_refresh_candidate | repair_first | https://dhhs.new-hampshire.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | new-hampshire | live_refresh_candidate | repair_first | https://dhhs.new-hampshire.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | new-jersey | live_refresh_candidate | repair_first | https://dhhs.new-jersey.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | new-jersey | live_refresh_candidate | repair_first | https://dhhs.new-jersey.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | new-mexico | live_refresh_candidate | repair_first | https://dhhs.new-mexico.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | new-mexico | live_refresh_candidate | repair_first | https://dhhs.new-mexico.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | north-carolina | live_refresh_candidate | repair_first | https://dhhs.north-carolina.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | north-carolina | live_refresh_candidate | repair_first | https://dhhs.north-carolina.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | north-dakota | live_refresh_candidate | repair_first | https://dhhs.north-dakota.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | north-dakota | live_refresh_candidate | repair_first | https://dhhs.north-dakota.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | oklahoma | live_refresh_candidate | repair_first | https://dhhs.oklahoma.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | oklahoma | live_refresh_candidate | repair_first | https://dhhs.oklahoma.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | oregon | live_refresh_candidate | repair_first | https://dhhs.oregon.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | oregon | live_refresh_candidate | repair_first | https://dhhs.oregon.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | rhode-island | live_refresh_candidate | repair_first | https://dhhs.rhode-island.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | rhode-island | live_refresh_candidate | repair_first | https://dhhs.rhode-island.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | south-carolina | live_refresh_candidate | repair_first | https://dhhs.south-carolina.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | south-carolina | live_refresh_candidate | repair_first | https://dhhs.south-carolina.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | south-dakota | live_refresh_candidate | repair_first | https://dhhs.south-dakota.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | south-dakota | live_refresh_candidate | repair_first | https://dhhs.south-dakota.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | tennessee | live_refresh_candidate | repair_first | https://dhhs.tennessee.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | tennessee | live_refresh_candidate | repair_first | https://dhhs.tennessee.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | utah | live_refresh_candidate | repair_first | https://dhhs.utah.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | utah | live_refresh_candidate | repair_first | https://dhhs.utah.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | vermont | live_refresh_candidate | repair_first | https://dhhs.vermont.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | vermont | live_refresh_candidate | repair_first | https://dhhs.vermont.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | virginia | live_refresh_candidate | repair_first | https://dhhs.virginia.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | virginia | live_refresh_candidate | repair_first | https://dhhs.virginia.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | washington | live_refresh_candidate | repair_first | https://dhhs.washington.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | washington | live_refresh_candidate | repair_first | https://dhhs.washington.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | west-virginia | live_refresh_candidate | repair_first | https://dhhs.west-virginia.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | west-virginia | live_refresh_candidate | repair_first | https://dhhs.west-virginia.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | wisconsin | live_refresh_candidate | repair_first | https://dhhs.wisconsin.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | wisconsin | live_refresh_candidate | repair_first | https://dhhs.wisconsin.gov/earlystart |
| live_refresh_placeholder_domain | high | dd_routing | wyoming | live_refresh_candidate | repair_first | https://dhhs.wyoming.gov/dd |
| live_refresh_placeholder_domain | high | dd_routing | wyoming | live_refresh_candidate | repair_first | https://dhhs.wyoming.gov/earlystart |
| live_refresh_placeholder_domain | high | forms_guides | nebraska | live_refresh_candidate | repair_first | https://dhhs.nebraska.gov/ |
| live_refresh_placeholder_domain | high | forms_guides | nebraska | live_refresh_candidate | repair_first | https://dhhs.nebraska.gov/dd/waivers |
| live_refresh_placeholder_domain | high | forms_guides | nebraska | live_refresh_candidate | repair_first | https://dhhs.nebraska.gov/earlyintervention |
| live_refresh_placeholder_domain | high | forms_guides | nebraska | live_refresh_candidate | repair_first | https://dhhs.nebraska.gov/rehab |
| live_refresh_placeholder_domain | high | forms_guides | new-hampshire | live_refresh_candidate | repair_first | https://dhhs.new-hampshire.gov/ |
| live_refresh_placeholder_domain | high | forms_guides | new-hampshire | live_refresh_candidate | repair_first | https://dhhs.new-hampshire.gov/dd/waivers |
| live_refresh_placeholder_domain | high | forms_guides | new-hampshire | live_refresh_candidate | repair_first | https://dhhs.new-hampshire.gov/earlyintervention |
| live_refresh_placeholder_domain | high | forms_guides | new-hampshire | live_refresh_candidate | repair_first | https://dhhs.new-hampshire.gov/rehab |
| live_refresh_placeholder_domain | high | medicaid_hhs_offices |  | live_refresh_candidate | repair_first | https://dhhs.alabama.gov/locations |
| live_refresh_placeholder_domain | high | medicaid_hhs_offices |  | live_refresh_candidate | repair_first | https://dhhs.alaska.gov/locations |
| live_refresh_placeholder_domain | high | medicaid_hhs_offices |  | live_refresh_candidate | repair_first | https://dhhs.arizona.gov/locations |

## Operator Rules

- Spend scrape volume on `ready_target_scrape` only when `safeToSpendReadyScrapeVolume=true`.
- Do not spend live-refresh volume while `placeholderLiveRefreshRows > 0`; repair or quarantine those URLs first.
- Treat `generic_program_shell_risk` and `contactless_directory_shell_risk` as target-quality problems, not parser failures.
