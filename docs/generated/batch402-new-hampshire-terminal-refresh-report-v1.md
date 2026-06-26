# Batch 402 New Hampshire Terminal Refresh v1

- classification: BLOCKED
- index_safe: false
- change: tied New Hampshire’s blocked terminal state to a fresh 2026-06-26 live host-family recheck

## Evidence

- Reviewed 2026-06-26 one more bounded live New Hampshire DHHS host-family pass. `https://www.dhhs.nh.gov/`, `https://dhhs.nh.gov/`, and `https://www.nh.gov/dhhs/` all still return the same public HTTP 403 `Access Denied` shell rather than any reviewable public DHHS content. The public robots lanes remain readable only: `https://www.nh.gov/robots.txt` and `https://www.dhhs.nh.gov/robots.txt` still return HTTP 200 text files, but they do not restore any local-routing, Medicaid, DD, EI, or county-local contract. New Hampshire therefore still lacks a reviewable public DHHS lane for the blocked health, DD, EI, waiver, and county-local families.
- Reviewed 2026-06-26 one more bounded live New Hampshire education host-family pass. `https://education.nh.gov/`, `https://www.education.nh.gov/`, `https://www.nh.gov/education/`, and `https://my.doe.nh.gov/ehb/` all still return the same public HTTP 403 `Access Denied` shell rather than any reviewable statewide or local education-routing content. `https://education.nh.gov/robots.txt` still returns HTTP 200 text only and does not reopen a district-grade routing contract. New Hampshire therefore still lacks a reviewable public DOE lane for statewide special education authority or district/county education routing.
- Reviewed 2026-06-26 one more bounded live New Hampshire employment-security / VR host-family pass. `https://nhes.nh.gov/`, `https://www.nhes.nh.gov/`, and `https://www.nh.gov/nhes/` all still return the same public HTTP 403 `Access Denied` shell rather than any reviewable VR or Pre-ETS content. `https://nhes.nh.gov/robots.txt` still returns HTTP 200 text only and does not restore a public vocational-rehabilitation or Pre-ETS contract. New Hampshire therefore still lacks a reviewable public VR successor lane.
