# Batch 312 Alaska Alt-Host Publications Finality v1

- state: Alaska
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- The live DFCS Services page still only provides statewide phone routing.
- The live DFCS Publications page still exposes no `public assistance`, `medicaid`, `adult public assistance`, `locations`, `borough`, or `census` terms and no DPA/office-routing document links.
- The public DFCS search page still exposes a real `InputKeywords` field, but the expected results endpoints still return SharePoint 404 shells that redirect into `PageNotFoundError.aspx`.
- A direct keyword POST back to the DFCS search page still self-posts to the same generic `Search` shell and exposes no reviewable DPA office results.
- `my.alaska.gov/robots.txt` returns HTTP 403 and `alaska.gov/search?query=Division+of+Public+Assistance+offices` returns HTTP 404.
- The current `health.alaska.gov` DPA family still returns Cloudflare `Just a moment...` 403 shells.
- The legacy `dhss.alaska.gov` root still canonically lands on `/Pages/default.aspx`, but the exact DPA subtree still returns Cloudflare `Just a moment...` 403 shells and `sitemap.xml` still fails closed.

## Repair decision

- Alaska remains blocked on missing reviewable borough/census-area office routing.
- No DFCS, alternate-official, current-health, or legacy-DHSS official host exposes a reviewable county-equivalent office contract in the low-token lane.
