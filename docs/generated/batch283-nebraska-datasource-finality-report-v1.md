# Batch 283 Nebraska Datasource Finality Report v1

- state: Nebraska
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- lessons_updated: false

## What was confirmed

- The exact DHHS Public Assistance Offices leaf is still live.
- `https://dhhs.ne.gov/sitemap.xml` still fails and exposes no sitemap-backed successor directory.
- The public ExperienceBuilder datasource registry materializes only the shared web map plus a closest-office output and ArcGIS World Geocoding Service output.
- The paired Web Map item and both service roots still expose only the office point layer plus county boundary layer and `tables: []`.

## Repair decision

- Nebraska remains final-blocked on missing public county-assignment data.
- No hidden public datasource remains on the current ExperienceBuilder surface to reopen county-local routing.
