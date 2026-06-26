# All-State California-Grade Audit Report v3

This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.

## Packet coverage

- packet_coverage_count: 50
- packet_missing_states: none

## Classification counts

- COMPLETE: 43
- BLOCKED: 7

- index-safe states: 43
- complete states: Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming
- blocked states: Alaska, Arizona, Idaho, Maine, New Hampshire, New Mexico, South Dakota

## Notes

- New Hampshire remains blocked after a 2026-06-26 bounded live repair pass: statewide IDEA Part B now clears from the official federal IDEA-by-State New Hampshire pages, but DHHS roots, NHES roots, and live local education-routing surfaces still do not expose a reviewable New Hampshire public contract.
- Texas remains COMPLETE/index-safe from v10.
- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.
- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.
- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.
- New Mexico remains blocked after the latest refresh because DVR and statewide Part B now clear, but the PED local-routing lane still lacks an explicit geography contract and still fails clean live TLS certification.
- Arizona remains blocked after a 2026-06-26 bounded live recheck: DES wrapper roots still return HTTP 403 `Just a moment...` shells, the public Salesforce locator app remains live but still exposes Greenlee only through locality ZIP coverage, the current AHCCCS admin PDFs are live and readable but prove to be 2014 Pima support letters rather than county-routing contracts, and no reviewed public DES or AHCCCS artifact explicitly assigns Greenlee County to an office.
