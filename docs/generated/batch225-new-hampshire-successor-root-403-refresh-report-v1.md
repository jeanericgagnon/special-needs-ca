# Batch 225 New Hampshire Successor Root 403 Refresh Report v1

- classification: BLOCKED
- index_safe: false
- change: tightened the host-family blocker with explicit nh.gov successor-root failures

## Evidence

- Reviewed 2026-06-23 exact first-party checks on both the saved `dhhs.new-hampshire.gov` replacement-host family and the likely public `nh.gov` successor family. The current-looking saved hostnames `https://dhhs.new-hampshire.gov/`, `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. A fresh bounded successor probe also showed `https://www.nh.gov/`, `https://www.nh.gov/dhhs/`, `https://www.nh.gov/dhhs/contact-us/`, and `https://www.nh.gov/dhhs/district-offices/` all returning HTTP 403 Forbidden immediately. New Hampshire therefore still has no reviewed public official DHHS successor host for Medicaid, waiver, DD, early-intervention, or district-office lanes.
- Reviewed 2026-06-23 bounded browser-style probes on the official New Hampshire education host family and one likely `nh.gov` successor family. `www.education.nh.gov` root plus exact district-directory leaves and the alternate `my.doe.nh.gov` host all return the same short `Access Denied` shell. A fresh successor probe also showed `https://www.nh.gov/education/` and `https://www.nh.gov/education/doe/` returning HTTP 403 Forbidden immediately. No reviewed district- or county-grade education routing chain is publicly fetchable from the current official education family or the obvious `nh.gov` successor roots.
- Reviewed 2026-06-23 the current New Hampshire VR lane against both the existing host assumptions and one likely `nh.gov` successor family. The legacy root `dhhs.new-hampshire.gov/rehab` no longer resolves, `www.nhes.nh.gov` root plus the BVR disabilities path return the same short `Access Denied` shell, `www.nheasy.nh.gov` does not resolve, and a fresh successor probe showed `https://www.nh.gov/nhes/` plus `https://www.nh.gov/employment/` returning HTTP 403 Forbidden immediately. No reviewed first-party VR or Pre-ETS surface is publicly fetchable from the current official host family or the obvious `nh.gov` successor roots.

## Repair decision

- Kept New Hampshire BLOCKED.
- Confirmed the saved `dhhs.new-hampshire.gov` successor family is still unresolvable.
- Confirmed the obvious `nh.gov` successors are not viable rescue paths in this lane because the root and the obvious agency subpaths all return HTTP 403 Forbidden immediately.
