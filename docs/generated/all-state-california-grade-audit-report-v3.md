# All-State California-Grade Audit Report v3

This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.

## Packet coverage

- packet_coverage_count: 50
- packet_missing_states: none

## Classification counts

- COMPLETE: 44
- BLOCKED: 6

- index-safe states: 44
- complete states: Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New Mexico, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming
- blocked states: Alaska, Arizona, Idaho, Maine, New Hampshire, South Dakota

## Notes

- New Hampshire remains blocked after a 2026-06-26 bounded browser recheck: `www.dhhs.nh.gov`, `www.education.nh.gov`, and `www.nhes.nh.gov` each render public `Access Denied` shells in a live browser, while only the federal IDEA-by-State page remains reviewable for statewide Part B.
- New Mexico is now COMPLETE/index-safe after the reviewed PED Superintendent directory plus official Census county geographies endpoints yielded explicit county-grade district routing across all 33 counties, with Catron closed from first-party Reserve district coordinates.
- Texas remains COMPLETE/index-safe from v10.
- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.
- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.
- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.
- Arizona remains blocked on county-local routing more broadly than the prior packet implied: the current live DES in-page helper exposes explicit county fields for only 11 counties and still does not name Greenlee, La Paz, Mohave, or Yuma in a county-to-office contract, while AHCCCS remains inventory-only.
- South Dakota remains blocked after a 2026-06-26 bounded live recheck: the current `/en/localoffices` path now returns HTTP 200 but still renders a page-not-found shell, while `/en/contact-us`, `/en/contactus`, `/en/staff-directory`, and the current DHS root still expose only statewide or staff-directory routing without any county-to-office or local service-area contract.
- Idaho remains blocked after a 2026-06-26 residual attachment pass: the last Camas and Clark district-linked files now resolve to a board-zone document, an unreviewable Drive item, a federal-funds manual, generic Idaho Child Find flyers, and generic equal-education compliance policy rather than a local special-education routing contract.
