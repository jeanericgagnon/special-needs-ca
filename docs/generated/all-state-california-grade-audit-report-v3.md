# All-State California-Grade Audit Report v3

This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.

## Packet coverage

- packet_coverage_count: 50
- packet_missing_states: none

## Classification counts

- COMPLETE: 27
- BLOCKED: 23

- index-safe states: 27
- complete states: Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah, Utah
- blocked states: Alaska, Arizona, Florida, Idaho, Kansas, Maine, Massachusetts, Minnesota, Nebraska, New Hampshire, New Mexico, North Dakota, Ohio, Oklahoma, Rhode Island, South Dakota, Tennessee, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## Notes

- Utah is now COMPLETE/index-safe because the reviewed first-party SUMH `Local Mental Health Authority Location Map` explicitly names all 29 Utah counties and the companion official `Mental Health` page defines county LMHAs as the local service authorities for residents of all ages, including Medicaid recipients.
- Texas remains COMPLETE/index-safe from v10.
- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.
- Oregon remains blocked on county-local routing because the live ODHS successor is a real custom component shell with no public data contract.
- Ohio remains blocked on two families, but the top county-local blocker is now more accurate: Ohio JFS, Medicaid, and Ohio.gov roots plus their robots and sitemaps are live again, while the rendered county-directory page, search page, and sampled `cdjfs-*` local-agency leaves still 404.
- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.
- Minnesota remains blocked, but the blocker is now narrower and more accurate: the MDE-ORG root and `Schools and Districts` route are live while county/contact/analytics routes remain Radware-blocked, and the saved DHS county/tribal replacements now resolve to official DHS 404 pages rather than a live captcha family.
- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.
- Maine remains blocked on a public-but-unmaterialized DOE contact lane: the selector and workbook are live, but the current Bangor search and export posts still both return the same HTTP 500 NEO shell, while DHHS district offices still expose no county/service-area crosswalk.
- Kansas remains blocked because the live KSDE Directory Reports root, Directories page, educational-directory PDF URL, and exact district-scoped submit replay still collapse to `Request Rejected` shells, even though reviewed local district-owned or district-linked special-education leaves now cover 25 of 105 counties, including the district-linked Burlington USD 244 `Coffey County Special Education Cooperative` route for Coffey County.
- Nebraska remains blocked because the live ExperienceBuilder item data now proves the only extra outputs are a closest-office layer and a geocoder-result layer with a `County` field, but there is still no official county-assignment datasource or county directory leaf on the current DHHS stack.
