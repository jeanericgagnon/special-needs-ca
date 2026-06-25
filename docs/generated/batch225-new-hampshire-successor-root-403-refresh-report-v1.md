# Batch 225 New Hampshire Successor Root 403 Refresh Report v1

- classification: BLOCKED
- index_safe: false
- change: tightened the host-family blocker with explicit nh.gov successor-root failures

## Evidence

- Reviewed 2026-06-25 bounded exact first-party rechecks across the saved `dhhs.new-hampshire.gov` replacement-host family, the direct `dhhs.nh.gov` agency subdomain family, and the likely public `nh.gov` successor family. The current-looking saved hostnames `https://dhhs.new-hampshire.gov/`, `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` still fail DNS resolution. Direct agency roots `https://www.dhhs.nh.gov/` and `https://dhhs.nh.gov/` still return the same short `Access Denied` shell with HTTP 403, and exact successor probes `https://www.nh.gov/`, `https://www.nh.gov/dhhs/`, `https://www.nh.gov/dhhs/contact-us/`, and `https://www.nh.gov/dhhs/district-offices/` do the same. New Hampshire therefore still has no reviewed public official DHHS successor host for Medicaid, waiver, DD, early-intervention, or district-office lanes.
- Reviewed 2026-06-25 bounded exact first-party rechecks on the official New Hampshire education host family, both `education.nh.gov` subdomain variants, exact district-directory leaves, the alternate `https://my.doe.nh.gov/ehb/` host, and the likely `nh.gov` successor family. `https://www.education.nh.gov/`, `https://education.nh.gov/`, exact district-directory leaves under `www.education.nh.gov`, and `https://my.doe.nh.gov/ehb/` all still return the same short `Access Denied` shell with HTTP 403. Exact successor probes `https://www.nh.gov/education/` and `https://www.nh.gov/education/doe/` still do the same. No reviewed district- or county-grade education routing chain is publicly fetchable from the current official education family or the obvious `nh.gov` successor roots.
- Reviewed 2026-06-25 the current New Hampshire VR lane against the legacy host assumptions, both `nhes.nh.gov` subdomain variants, and the likely `nh.gov` successor family. The legacy root `dhhs.new-hampshire.gov/rehab` still does not resolve, `https://www.nhes.nh.gov/`, `https://nhes.nh.gov/`, and the BVR disabilities path still return the same short `Access Denied` shell with HTTP 403, `https://www.nheasy.nh.gov/` still does not resolve, and exact successor probes `https://www.nh.gov/nhes/` plus `https://www.nh.gov/employment/` still return the same short `Access Denied` shell with HTTP 403. No reviewed first-party VR or Pre-ETS surface is publicly fetchable from the current official host family or the obvious `nh.gov` successor roots.

## Repair decision

- Kept New Hampshire BLOCKED.
- Confirmed the saved `dhhs.new-hampshire.gov` successor family is still unresolvable.
- Confirmed the direct `*.nh.gov` agency roots and the obvious `nh.gov` agency successors are not viable rescue paths in this lane because they all return HTTP 403 Forbidden immediately.
