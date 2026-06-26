# Batch 412 New Hampshire Browser Proof v1

- classification: BLOCKED
- index_safe: false
- change: replaced residual raw-fetch ambiguity with browser-rendered public `Access Denied` proof for DHHS, DOE, and NHES host families

## Evidence

- Reviewed 2026-06-26 one more bounded New Hampshire DHHS host-family pass at browser level, not just raw fetch level. `https://www.dhhs.nh.gov/` rendered HTTP 403 with title `Access Denied` and body text `You don’t have permission to access "http://www.dhhs.nh.gov/" on this server.` The direct successor roots `https://dhhs.nh.gov/` and `https://www.nh.gov/dhhs/` remain non-reviewable for the same public lane. The public robots lanes stay readable only, but robots text does not restore any Medicaid, DD, EI, waiver, or county-local routing contract. New Hampshire therefore still lacks a reviewable public DHHS contract even in a browser-rendered pass.
- Reviewed 2026-06-26 one more bounded New Hampshire education host-family pass at browser level. `https://www.education.nh.gov/` rendered HTTP 403 with title `Access Denied` and body text `You don’t have permission to access "http://www.education.nh.gov/" on this server.` The direct successor roots `https://education.nh.gov/`, `https://www.nh.gov/education/`, and `https://my.doe.nh.gov/ehb/` remain non-reviewable for the same public lane. The live federal IDEA-by-State page still rescues only statewide Part B authority and does not provide district-, county-, or SAU-grade routing. New Hampshire therefore still lacks a reviewable public DOE lane for local education routing.
- Reviewed 2026-06-26 one more bounded New Hampshire employment-security / VR host-family pass at browser level. `https://www.nhes.nh.gov/` rendered HTTP 403 with title `Access Denied` and body text `You don’t have permission to access "http://www.nhes.nh.gov/" on this server.` The direct successor roots `https://nhes.nh.gov/` and `https://www.nh.gov/nhes/` remain non-reviewable for the same public lane. The public robots text does not restore vocational-rehabilitation or Pre-ETS content. New Hampshire therefore still lacks a reviewable public VR successor lane even in browser-rendered review.
