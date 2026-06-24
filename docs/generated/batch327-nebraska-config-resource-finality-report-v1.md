# Batch 327 Nebraska Config Resource Finality Report v1

- state: Nebraska
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- blocker_code: public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties

## What was confirmed

- Confirmed the public ExperienceBuilder resource list exposes `config/config.json` on the current official app item.
- Confirmed that public config still references only one web map item, one `closest feature` output layer, and the geocoder search widget.
- Confirmed no additional county-assignment datasource, service-area table, or coverage output appears in the public config.
- Confirmed the underlying public stack still stops at two operational layers, zero tables, 42 office rows, 93 county rows, empty relationships, and 37 distinct office counties.

## Why Nebraska remains blocked

- There is still no public county-assignment datasource anywhere on the official stack.
- The public app still resolves only to office contact cards plus closest-office behavior, not a statewide county-to-office contract.
- Nebraska therefore still has no public statewide county-to-office assignment bridge.

## Next action

- hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published

