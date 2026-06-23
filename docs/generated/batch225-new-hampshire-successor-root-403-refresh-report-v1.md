# Batch 225 New Hampshire Successor Root 403 Refresh Report v1

- classification: BLOCKED
- index_safe: false
- change: tightened the host-family blocker with explicit nh.gov successor-root failures

## Evidence

- Reviewed 2026-06-23 exact first-party checks across the saved `dhhs.new-hampshire.gov` replacement-host family, the direct `dhhs.nh.gov` agency subdomain family, and the likely public `nh.gov` successor family. The current-looking saved hostnames `https://dhhs.new-hampshire.gov/`, `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. Direct agency roots `https://www.dhhs.nh.gov/` and `https://dhhs.nh.gov/` both return HTTP 403 Forbidden, and a bounded successor probe also showed `https://www.nh.gov/`, `https://www.nh.gov/dhhs/`, `https://www.nh.gov/dhhs/contact-us/`, and `https://www.nh.gov/dhhs/district-offices/` all returning HTTP 403 Forbidden immediately. New Hampshire therefore still has no reviewed public official DHHS successor host for Medicaid, waiver, DD, early-intervention, or district-office lanes.
- Reviewed 2026-06-23 bounded browser-style probes on the official New Hampshire education host family, both `education.nh.gov` subdomain variants, and one likely `nh.gov` successor family. `https://www.education.nh.gov/`, `https://education.nh.gov/`, exact district-directory leaves under `www.education.nh.gov`, and the alternate `https://my.doe.nh.gov/ehb/` host all return the same short `Access Denied` shell or HTTP 403. A fresh successor probe also showed `https://www.nh.gov/education/` and `https://www.nh.gov/education/doe/` returning HTTP 403 Forbidden immediately. No reviewed district- or county-grade education routing chain is publicly fetchable from the current official education family or the obvious `nh.gov` successor roots.
- Reviewed 2026-06-23 the current New Hampshire VR lane against the legacy host assumptions, both `nhes.nh.gov` subdomain variants, and one likely `nh.gov` successor family. The legacy root `dhhs.new-hampshire.gov/rehab` no longer resolves, `https://www.nhes.nh.gov/`, `https://nhes.nh.gov/`, and the BVR disabilities path return the same short `Access Denied` shell or HTTP 403, `www.nheasy.nh.gov` does not resolve, and a fresh successor probe showed `https://www.nh.gov/nhes/` plus `https://www.nh.gov/employment/` returning HTTP 403 Forbidden immediately. No reviewed first-party VR or Pre-ETS surface is publicly fetchable from the current official host family or the obvious `nh.gov` successor roots.

## Repair decision

- Kept New Hampshire BLOCKED.
- Confirmed the saved `dhhs.new-hampshire.gov` successor family is still unresolvable.
- Confirmed the direct `*.nh.gov` agency roots and the obvious `nh.gov` agency successors are not viable rescue paths in this lane because they all return HTTP 403 Forbidden immediately.
