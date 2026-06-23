# All-State California-Grade Audit Report v3

This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.

## Packet coverage

- packet_coverage_count: 50
- packet_missing_states: none

## Classification counts

- COMPLETE: 24
- BLOCKED: 26

- index-safe states: 24
- complete states: Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, North Carolina, Pennsylvania, South Carolina, Texas
- blocked states: Alaska, Arizona, Florida, Idaho, Kansas, Maine, Massachusetts, Minnesota, Nebraska, New Hampshire, New Mexico, New York, North Dakota, Ohio, Oklahoma, Oregon, Rhode Island, South Dakota, Tennessee, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## Notes

- Texas remains COMPLETE/index-safe from v10.
- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.
- North Carolina now reaches COMPLETE/index-safe because two public county-bearing contracts replaced both local blockers: the DPI School Report Card location dataset for district routing and the NCDHHS Local DSS sitemap lane for county-local routing.
- New York remains blocked, but the county-local blocker is now tighter: `ny.gov` points to exact OTDA successor leaves, and those exact OTDA contact/benefit targets still fail in the bounded verification lane.
- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.
- Kansas remains blocked, but reviewed local education-routing proof now covers 14 of 105 counties after Newton USD 373 and Emporia USD 253 added two more district-host local leaves.
- Nebraska remains blocked because the official county-local office stack still exposes no public county-to-office assignment contract beyond locator outputs.
- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.
