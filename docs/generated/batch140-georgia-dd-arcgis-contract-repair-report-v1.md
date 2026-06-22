# Batch 140 Georgia DD ArcGIS Contract Repair Report v1

This pass reopens only Georgia’s final DD blocker and upgrades it from blocked to verified using the public first-party ArcGIS contract behind the official DBHDD lookup app.

- classification: COMPLETE
- index_safe: true
- repaired_family: developmental_disability_idd_authority
- arcgis_county_features: 159
- arcgis_region_values: 6

## Decision

- The HTML app shell was not enough, but the public item-data endpoint exposed the live FeatureServer contract.
- The bounded query returned all 159 Georgia counties with region labels and DD office/contact fields.
- Georgia is now COMPLETE/index-safe without reopening broad discovery.
