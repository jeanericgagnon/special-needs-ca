# Batch 301 Alaska DFCS Search Contract Finality Report v1

- state: Alaska
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- The live DFCS Services page still only provides statewide phone routing.
- The public DFCS search page exposes a real `InputKeywords` field, but the expected public results endpoints still 404.
- A direct keyword POST back to the DFCS search page still self-posts to the same generic shell and exposes no reviewable DPA office results.
- The current `health.alaska.gov` DPA family still returns the same 403 shell across exact leaves and discovery roots.
- The legacy `dhss.alaska.gov` root and robots.txt are public, but the exact DPA and DSDS subtree pages are still 403 and sitemap/search still fail closed.

## Repair decision

- Alaska remains blocked on missing reviewable borough/census-area office routing.
- No DFCS, current-health, or legacy-DHSS official host exposes a reviewable county-equivalent office contract in the low-token lane.
