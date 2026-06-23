# Batch 290 Nebraska Live Finality Sync Report v1

- state: Nebraska
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- The exact DHHS Public Assistance Offices leaf is still live.
- `https://dhhs.ne.gov/sitemap.xml` still returns HTTP 404 and exposes no sitemap-backed successor directory.
- The public ExperienceBuilder datasource registry still exposes only the shared web map, a closest-office widget output, and an ArcGIS geocoding output.
- The public FeatureServer still exposes only two layers, zero relationships, and `tables: []`.
- The office layer still exposes only 37 distinct `USER_County` values, not a county-complete assignment contract.

## Repair decision

- Nebraska remains final-blocked on missing public county-assignment data.
- No official public county-to-office bridge appeared on the current DHHS or GIS surfaces, so the blocker stays exact and index-safe remains false.
