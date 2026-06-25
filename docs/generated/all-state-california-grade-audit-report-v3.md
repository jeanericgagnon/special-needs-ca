# All-State California-Grade Audit Report v3

This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.

## Packet coverage

- packet_coverage_count: 50
- packet_missing_states: none

## Classification counts

- COMPLETE: 29
- BLOCKED: 21

- index-safe states: 29
- complete states: Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah
- blocked states: Alaska, Arizona, Florida, Idaho, Maine, Massachusetts, Minnesota, New Hampshire, New Mexico, North Dakota, Ohio, Oklahoma, Rhode Island, South Dakota, Tennessee, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## Notes

- Texas remains COMPLETE/index-safe from v10.
- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.
- Kansas is COMPLETE/index-safe from the live official KSDE county-grade district export contract.
- Nebraska is now COMPLETE/index-safe because the official DHHS N-FOCUS TANF `Employment First (EF) Offices` lane exposes a public county-office region contract across all 93 counties, with explicit county-specific office assignments and `Counties Served` fields on the official GIS owner family.
- Florida remains blocked on county-local routing because the Family Resource Center storefront is still partial and the live MyACCESS county-result endpoints remain authenticated-only.
- Ohio remains blocked only on education routing. A bounded live same-domain education leaf probe now recovers strong exact local education leaves for 54 counties and partial exact local education leaves for 24 more counties, but 10 counties still resolve to dead, unresolvable, transport-broken, or no-leaf roots, so Ohio remains not index-safe.
- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.
- Minnesota remains blocked, and the stricter live truth is now: only the MDE description page is public while the MDE-ORG root plus district/county/contact/analytics routes all redirect into Radware, and the DHS disability-services 404 shell points to a named county/tribal/state successor route that is also bot-gated.
- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.
- Alaska county-local routing is still blocked, but the blocker sharpened: the official DPA landing page and exact DPA offices page are now browser-readable on `health.alaska.gov`, yet the offices page still groups only regional offices and addresses without any borough- or census-area assignment contract, while DFCS successor pages still add no county-equivalent mapping.
- Oklahoma remains blocked on a stronger county-local truth test: the live OKDHS county widget only publishes Adair and Alfalfa, but only the Alfalfa row is independently sufficient; the broader public KML plus that salvaged row still stop at 46 benefit-capable counties, and the same host's county-complete tree is still child-support-only.
- Florida county-local routing is still blocked: Family Resource Center remains a 34-county partial storefront, the recovered MyACCESS public shell and dataexchangeproxy still do not materialize anonymous county results, and the live main bundle now re-exposes `getZipCountyDetails` plus `communityPartnerSearch` only as authenticated-only endpoint names.
- Maine remains blocked on a broader public-but-unmaterialized DOE lane: the contact selector, superintendent selectors, and workbook are live, but current Bangor materialization submits across those first-party pages still return the same HTTP 500 NEO shell, while DHHS district offices still expose no county/service-area crosswalk.
