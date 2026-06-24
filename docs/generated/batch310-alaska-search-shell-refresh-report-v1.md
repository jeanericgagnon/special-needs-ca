# Batch 310 Alaska Search Shell Refresh v1

- state: Alaska
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- The live DFCS Services page still only provides statewide phone routing.
- The public DFCS search page still exposes a real `InputKeywords` field, but the expected results endpoints still return SharePoint 404 shells that redirect into `PageNotFoundError.aspx`.
- A direct keyword POST back to the DFCS search page still self-posts to the same generic `Search` shell and exposes no reviewable DPA office results.
- The current `health.alaska.gov` DPA family still returns Cloudflare `Just a moment...` 403 shells, including on `robots.txt`.
- The legacy `dhss.alaska.gov` root still canonically lands on `/Pages/default.aspx`, but the exact DPA subtree still returns Cloudflare `Just a moment...` 403 shells and `sitemap.xml` still fails closed.

## Repair decision

- Alaska remains blocked on missing reviewable borough/census-area office routing.
- No DFCS, current-health, or legacy-DHSS official host exposes a reviewable county-equivalent office contract in the low-token lane.
