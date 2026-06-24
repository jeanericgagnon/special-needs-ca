# Batch 314 Nebraska Export Format Finality Report v1

- state: Nebraska
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- The public FeatureServer root is live and advertises export formats including CSV, GeoJSON, shapefile, and FileGDB.
- The office layer schema still exposes only contact-style fields plus `USER_County`.
- The distinct county query still returns only 37 county values.
- None of the distinct county values are multi-county service-area strings.

## Repair decision

- Nebraska remains final-blocked on missing public county-assignment data.
- The office layer may be exportable, but exporting the current schema still cannot materialize a statewide county-to-office assignment contract.
