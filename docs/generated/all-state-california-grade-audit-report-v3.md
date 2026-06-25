# All-State California-Grade Audit Report v3

This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.

## Packet coverage

- packet_coverage_count: 50
- packet_missing_states: none

## Classification counts

- COMPLETE: 27
- BLOCKED: 23

- index-safe states: 27
- complete states: Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah
- blocked states: Alaska, Arizona, Florida, Idaho, Kansas, Maine, Massachusetts, Minnesota, Nebraska, New Hampshire, New Mexico, North Dakota, Ohio, Oklahoma, Rhode Island, South Dakota, Tennessee, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## Notes

- Texas remains COMPLETE/index-safe from v10.
- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.
- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.
- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.
- Kansas remains blocked because the live KSDE Directory Reports root, Directories page, educational-directory PDF URL, and exact district-scoped submit replay still collapse to `Request Rejected` shells; Chase County USD 284 and Woodson USD 366 now freeze as reviewed public non-matches with live sitemaps but zero role-bearing local-routing URLs, and Chanute USD 413 now freezes as a false-positive district app shell that returns HTTP 200 for arbitrary role-like slugs without any special-education content.
- Alaska county-local routing is still blocked, but the blocker sharpened: the official DPA landing page and exact DPA offices page are now browser-readable on `health.alaska.gov`, yet the offices page still groups only regional offices and addresses without any borough- or census-area assignment contract, while DFCS successor pages still add no county-equivalent mapping.
- Nebraska remains blocked because both official publication lanes now fail closed: the DHHS site has live robots but no public sitemap or searchable county-office leaf, and the GIS portal search still returns only the same office-locator trilogy with no county-assignment table or county directory leaf.
- Florida county-local routing is still blocked: Family Resource Center remains a 34-county partial storefront, the recovered MyACCESS public shell and dataexchangeproxy still do not materialize anonymous county results, and the live main bundle now re-exposes `getZipCountyDetails` plus `communityPartnerSearch` only as authenticated-only endpoint names.
- Oklahoma remains blocked on a stronger county-local truth test: the live OKDHS county widget only publishes Adair and Alfalfa, but only the Alfalfa row is independently sufficient; the broader public KML plus that salvaged row still stop at 46 benefit-capable counties, and the same host's county-complete tree is still child-support-only.
