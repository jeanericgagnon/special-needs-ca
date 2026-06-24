# Batch 323 Alaska DAPH Wrong-Role Finality v1

- state: alaska
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What changed

- The live DFCS Site Map was rechecked against its extra surfaced child leaves.
- The `daph` branch is now explicitly ruled out as Alaska Pioneer Homes payment-assistance content, not DPA or public-assistance office routing.
- The only office-looking leaf still surfaced on the live DFCS host remains the wrong-role `OCS Regional Offices` page.

## Repair decision

- Alaska remains blocked on missing reviewable borough/census-area office routing.
- This pass strengthens the blocker by proving the extra DFCS sitemap branch is wrong-program content rather than a hidden DPA office lane.
