# Batch 330 Nebraska Sibling Leaf Finality Report v1

- state: Nebraska
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- blocker_code: public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties

## What was confirmed

- Confirmed the public ExperienceBuilder resource config still references only one web map item, one `closest feature` output layer, and the geocoder search widget.
- Confirmed no additional county-assignment datasource, service-area table, or coverage output appears in the public config.
- Confirmed the exact same-host DHHS sibling leaves `economic-assistance.aspx`, `Contact-DHHS.aspx`, and `DD-Contact-Us.aspx` all preserve `Local DHHS Offices` only as a link back to `Public-Assistance-Offices.aspx`.
- Confirmed the only alternate locality leaf exposed beside that loop is `Local Health Departments`, which is the wrong role for county-local disability/public-assistance routing.

## Why Nebraska remains blocked

- There is still no public county-assignment datasource anywhere on the official stack.
- The public app still resolves only to office contact cards plus closest-office behavior, not a statewide county-to-office contract.
- The same-host DHHS sibling leaves do not expose a county directory either.

## Next action

- hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published

