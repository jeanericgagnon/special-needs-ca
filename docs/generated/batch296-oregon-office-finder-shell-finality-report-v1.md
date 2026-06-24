# Batch 296 Oregon Office Finder Shell Finality Report v1

- classification: BLOCKED
- index_safe: false
- change: replaced the generic Oregon office-finder blocker with the live app-shell reality

## Evidence

- Reviewed 2026-06-23 one bounded official Oregon county-local replacement lane on the live ODHS office-finder stack. The old `https://dhhs.oregon.gov/locations` host still fails DNS, and the current successor root `https://www.oregon.gov/odhs/pages/office-finder.aspx` is confirmed live on the official Oregon host. But the live surface still fails closed for county-grade routing: the page returns an ASP.NET SharePoint shell titled `Find an Office`, loads Leaflet and marker-cluster libraries, and preserves only generic help text such as `Look up ODHS offices near you and get contact information and directions. Choose the kind of service you need and find an office close to you.` Bounded query-string probes like `?county=Baker` and `?city=Salem` return the same generic page, the static HTML preserves no county list, office rows, or public result payload, `robots.txt` only confirms statewide SharePoint exclusions, the obvious sitemap and search surfaces return 404, and no public endpoint or export contract is exposed in the reviewed page source. A bounded DB check still shows Oregon county-office rows split between 61 DOI-backed planning rows and only 3 dead `dhhs.oregon.gov/locations` rows. Oregon therefore remains blocked because the live successor lane is real but still only a public app shell with no county-grade office extract.

## Repair decision

- Kept Oregon BLOCKED.
- Retired the weaker “generic live office-finder root” framing for county-local routing.
- Preserved the live ODHS office-finder as real successor evidence, but held the state because the reviewed public page source still exposes no office rows, county list, result payload, or public search contract.
- Left the handoff on Oregon because the state is still only one family short of COMPLETE/index-safe.
