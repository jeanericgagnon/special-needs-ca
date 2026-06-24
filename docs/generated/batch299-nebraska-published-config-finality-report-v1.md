# Batch 299 Nebraska Published Config Finality v1

- state: nebraska
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- The exact DHHS Public Assistance Offices leaf is still live.
- The published ExperienceBuilder config still binds only one web map, one closest-office widget output, and one geocoder output.
- The published config utilities are routing and geocoding only, not county-assignment or service-area sources.
- The public related-items endpoints for both the Web Experience item and the paired Web Map item both return `total: 0`.
- The public FeatureServer still exposes only two layers, zero relationships, and `tables: []`.

## Repair decision

- Nebraska remains final-blocked on missing public county-assignment data.
- No hidden public sibling item remains on the current published office-locator stack.
