# Batch 293 Alaska DFCS Search Finality Report v1

- state: Alaska
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- lessons_updated: false

## What was confirmed

- The live DFCS Services page still only provides statewide phone routing.
- The public DFCS search page is readable, but bounded query replays still expose only the same generic SharePoint search shell.
- The current `health.alaska.gov` DPA family still returns the same 403 shell across exact leaves and discovery roots.
- The legacy `dhss.alaska.gov` root and robots.txt are public, but the exact DPA and DSDS subtree pages are still 403 and sitemap/search still fail closed.

## Repair decision

- Alaska remains blocked on missing reviewable borough/census-area office routing.
- No DFCS, current-health, or legacy-DHSS official host exposes a reviewable county-equivalent office contract in the low-token lane.
