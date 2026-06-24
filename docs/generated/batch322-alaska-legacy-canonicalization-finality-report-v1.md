# Batch 322 Alaska Legacy Canonicalization Finality v1

- state: alaska
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What changed

- The DFCS Site Map is now explicitly confirmed live, but the only office-looking leaf it adds is the wrong-service `OCS Regional Offices` page.
- The legacy `dhss.alaska.gov/dpa/...` paths no longer behave like a separate partially live subtree for county-local review.
- Those exact legacy DPA paths now canonically land on `https://health.alaska.gov/dpa` and still return the same Cloudflare challenge shell.

## Repair decision

- Alaska remains blocked on missing reviewable borough/census-area office routing.
- This pass sharpens the blocker by collapsing the legacy DPA subtree into the same challenged current health-host family rather than treating it as a separate reviewable lane.
