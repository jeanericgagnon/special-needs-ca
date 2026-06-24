# Batch 317 Nebraska Republished Config Finality Report v1

- state: Nebraska
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- blocker_code: freshly_republished_public_office_experience_still_only_wraps_42_offices_37_distinct_counties_and_no_statewide_assignment_contract

## What was confirmed

- Confirmed the official public office FeatureServer still exposes 42 office rows against 93 county rows.
- Confirmed both public layers still expose empty relationships.
- Confirmed the distinct office-county query still returns only 37 county values.
- Confirmed the public ExperienceBuilder item and `config/config.json` now carry fresh publication timestamps.
- Confirmed the refreshed experience still contains only `config/config.json` plus image assets and no county-assignment artifact.

## Why Nebraska remains blocked

- The fresh publication did not add any service-area field, related table, assignment bridge, or county-coverage artifact.
- The public stack still stops at office contact inventory, county boundaries, and a closest-office/geocoding wrapper.
- Nebraska therefore still has no public statewide county-to-office assignment contract.

## Next action

- hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published

