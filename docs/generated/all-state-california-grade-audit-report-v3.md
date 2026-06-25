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
- Minnesota remains blocked, but the blocker is now narrower and more accurate: the MDE-ORG root and `Schools and Districts` route are live while county/contact/analytics routes remain Radware-blocked, and the saved DHS county/tribal replacements now resolve to official DHS 404 pages rather than a live captcha family.
- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.
