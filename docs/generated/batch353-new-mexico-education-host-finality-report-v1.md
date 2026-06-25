# Batch 353 New Mexico Education Host Finality Report v1

- classification: BLOCKED
- index_safe: false
- change: retired the dead legacy New Mexico education host family and tightened the current PED timeout blocker

## Evidence

- Reviewed 2026-06-25 one more bounded official New Mexico education host pass. The legacy repo host family `https://education.new-mexico.gov/` is now source-finally unusable: exact probes on the root, `/regional`, `/sitemap.xml`, `/robots.txt`, `/special-education/`, and `/districts/` all fail DNS resolution. The current official PED host family remains equally non-productive for low-token local routing: earlier bounded exact probes on `https://webnew.ped.state.nm.us/` and `https://webnew.ped.state.nm.us/bureaus/special-education/` had already timed out after 25 seconds, and fresh bounded exact probes on the current host search and API-shaped routes still timed out after 15 seconds. The packet still preserves zero district-owned, county-grade, or regional local education leaves on disk, and the only retained PED-side URLs remain the generic PED root plus the statewide Special Education Bureau page. district_or_county_education_routing therefore remains blocked on authoring exact local leaves from district-owned or regional sources, not on any further state-host retries.

## Repair decision

- Kept New Mexico BLOCKED.
- Confirmed the legacy `education.new-mexico.gov` host family is unresolvable and should not remain an implied active source lane.
- Confirmed the current PED host family still times out on exact root, bureau, and search/API-shaped routes.
- Kept the repair lane on district-owned or regional local leaf authoring and same-host HCA followups for the separate county-local remainder.
