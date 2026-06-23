# Batch 287 New York ny.gov OTDA Successor Finality Report v1

- classification: BLOCKED
- index_safe: false
- change: tightened the New York county-local blocker from a generic failed replacement-host search into an exact successor-family failure confirmed from live ny.gov service pages

## Evidence

- Reviewed 2026-06-23 one more bounded official New York county-local replacement lane using the public `ny.gov` service stack as the discovery surface rather than speculative OTDA host guessing. The original `health.ny.gov` Medicaid lane is still blocked host-wide: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all remain unusable for county-local proof. The live `https://www.ny.gov/services/social-programs` page and `https://www.ny.gov/services/apply-cooling-assistance` now strengthen the blocker instead of clearing it: both public state pages explicitly link exact OTDA successor leaves such as `https://otda.ny.gov/programs/heap/contacts/`, `https://otda.ny.gov/programs/applications/4826.pdf`, `https://otda.ny.gov/programs/snap/work-requirements.asp`, and `https://mybenefits.ny.gov/`. But the exact OTDA benefit and contact leaves still fail on the current host family, including `otda.ny.gov/programs/heap/contacts/`, `otda.ny.gov/programs/heap/`, `otda.ny.gov/programs/applications/4826.pdf`, `otda.ny.gov/workingfamilies/dss.asp`, and the apex `otda.ny.gov` plus `www.otda.ny.gov` roots, all of which reset the connection in the bounded lane. New York therefore remains blocked on county-local not because a successor path is unknown, but because the public New York portal points to an exact official OTDA successor family that is still not reviewable from the repo-side verification lane.

## Repair decision

- Kept New York BLOCKED.
- Confirmed the original `health.ny.gov` Medicaid host family is still unusable for county-local proof.
- Confirmed the live `ny.gov` service stack points to exact OTDA successor leaves, but those exact OTDA contact and application leaves still fail in the bounded verification lane.
- Advanced the handoff to Oklahoma because New York now has a sharper, more final county-local blocker artifact on disk.
