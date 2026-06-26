# Batch 402 New Hampshire Terminal Refresh v1

- classification: BLOCKED
- index_safe: false
- change: tied New Hampshire’s blocked terminal state to a fresh 2026-06-26 live host-family recheck showing the state host families and robots lanes all still fail closed while federal IDEA remains live

## Evidence

- Reviewed 2026-06-26 one more bounded live New Hampshire DHHS host-family pass. `https://www.dhhs.nh.gov/`, `https://dhhs.nh.gov/`, and `https://www.nh.gov/dhhs/` all still return the same public HTTP 403 `Access Denied` shell rather than any reviewable public DHHS content. The robots lanes no longer reopen anything either: `https://www.nh.gov/robots.txt` and `https://www.dhhs.nh.gov/robots.txt` now also return HTTP 403. New Hampshire therefore still lacks a reviewable public DHHS lane for the blocked health, DD, EI, waiver, and county-local families.
- Reviewed 2026-06-26 one more bounded live New Hampshire education host-family pass. `https://education.nh.gov/`, `https://www.education.nh.gov/`, `https://www.nh.gov/education/`, and `https://my.doe.nh.gov/ehb/` all still return the same public HTTP 403 `Access Denied` shell rather than any reviewable statewide or local education-routing content. `https://education.nh.gov/robots.txt` now also returns HTTP 403 and does not reopen a district-grade routing contract. The separate official federal IDEA-by-State page at `https://sites.ed.gov/idea/state/new-hampshire/` remains live and keeps statewide IDEA Part B authority verified, but it still does not provide district-, county-, or SAU-grade routing. New Hampshire therefore still lacks a reviewable public DOE lane for local education routing.
- Reviewed 2026-06-26 one more bounded live New Hampshire employment-security / VR host-family pass. `https://nhes.nh.gov/`, `https://www.nhes.nh.gov/`, and `https://www.nh.gov/nhes/` all still return the same public HTTP 403 `Access Denied` shell rather than any reviewable VR or Pre-ETS content. `https://nhes.nh.gov/robots.txt` now also returns HTTP 403 and does not restore a public vocational-rehabilitation or Pre-ETS contract. New Hampshire therefore still lacks a reviewable public VR successor lane.
