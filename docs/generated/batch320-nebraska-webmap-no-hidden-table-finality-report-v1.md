# Batch 320 Nebraska Web Map No Hidden Table Finality Report v1

- state: Nebraska
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- blocker_code: recovered_public_office_stack_still_has_no_hidden_table_assignment_bridge_and_only_42_offices_for_93_counties

## What was confirmed

- Confirmed the public DHHS offices page is still only a wrapper for the locator, not a county directory leaf.
- Confirmed the refreshed ExperienceBuilder app still exposes only one web map data source, one closest-feature office output, and one geocoder output.
- Confirmed the underlying public web map still contains exactly two operational layers and zero tables.
- Confirmed the closest-feature output schema simply mirrors the office contact fields rather than exposing any county-assignment table.
- Confirmed the public FeatureServer still stops at 42 office rows, 93 county rows, empty relationships, and only 37 distinct office counties.

## Why Nebraska remains blocked

- There is still no public table, related layer, popup bridge, or output schema that maps all 93 counties to offices.
- The refreshed public stack still stops at contact-card inventory plus closest-office behavior, not a statewide county contract.
- Nebraska therefore still has no public statewide county-to-office assignment bridge.

## Next action

- hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published

