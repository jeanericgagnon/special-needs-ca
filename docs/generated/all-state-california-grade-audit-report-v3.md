# All-State California-Grade Audit Report v3

This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.

## Packet coverage

- packet_coverage_count: 50
- packet_missing_states: none

## Classification counts

- COMPLETE: 26
- BLOCKED: 24

- index-safe states: 26
- complete states: Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas
- blocked states: Alaska, Arizona, Florida, Idaho, Kansas, Maine, Massachusetts, Minnesota, Nebraska, New Hampshire, New Mexico, North Dakota, Ohio, Oklahoma, Rhode Island, South Dakota, Tennessee, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## Notes

- Texas remains COMPLETE/index-safe from v10.
- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.
- Oregon remains blocked on county-local routing because the live ODHS successor is a real custom component shell with no public data contract.
- Ohio remains blocked on two families, but the top county-local blocker is now more accurate: Ohio JFS, Medicaid, and Ohio.gov roots plus their robots and sitemaps are live again, while the rendered county-directory page, search page, and sampled `cdjfs-*` local-agency leaves still 404.
- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.
- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.
- Kansas still has a strict live state-root stop signal: the current KSDE Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay all return `Request Rejected` shells in the bounded raw lane, while reviewed local district leaves now cover 22 counties after Marshall cleared through the district-hosted Marshall County Special Education Coop subtree on Marysville USD 364, so future repairs should continue only from saved district leads plus exact district-owned or district-linked local leaves.
- Florida county-local routing is still blocked: Family Resource Center remains a 34-county partial storefront, the recovered MyACCESS public shell and dataexchangeproxy still do not materialize anonymous county results, and the live main bundle now re-exposes `getZipCountyDetails` plus `communityPartnerSearch` only as authenticated-only endpoint names.
- Alaska county-local routing is still blocked: DFCS Services remains phone-only, DFCS Publications still exposes no DPA/public-assistance office material, the DFCS Site Map only adds the wrong-service `OCS Regional Offices` leaf, DFCS search still has no usable public results lane, the current health host still returns Cloudflare `Just a moment...` 403 shells, and the legacy `dhss.alaska.gov/dpa/...` paths now canonicalize into that same challenged `health.alaska.gov/dpa` host.
- Utah remains blocked because the recovered DHHS contacts hub still defers local office proof, and the current DWS office-search shell now makes the public contract even narrower: it explicitly limits lookup to `Zip Code or City` while the public APIs still expose no county or service-area field.
