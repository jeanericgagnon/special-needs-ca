# Batch 245 New York OTDA Replacement Refresh Report v1

- classification: BLOCKED
- index_safe: false
- change: tightened the New York county-local blocker with bounded OTDA replacement-host failures

## Evidence

- Reviewed 2026-06-23 the current New York county-local blocker surfaces plus one bounded official replacement-host lane. The official health.ny.gov Medicaid lane is still blocked host-wide, not just at one LDSS page: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all returned HTTP 403 in the bounded lane. A bounded replacement-host probe also showed `https://otda.ny.gov/workingfamilies/dss.asp`, `https://otda.ny.gov/workingfamilies/`, `https://otda.ny.gov/programs/applications/`, `https://otda.ny.gov/workingfamilies/contact.asp`, `https://otda.ny.gov/`, `https://www.otda.ny.gov/workingfamilies/dss.asp`, and `https://www.otda.ny.gov/` all failing with connection resets. The old county rows that still point at `ldss.htm` therefore cannot remain as sample proof, and the obvious OTDA replacement host family cannot yet serve as a reviewed rescue path either; only a public replacement locator or county-owned directory can clear this blocker.

## Repair decision

- Kept New York BLOCKED.
- Confirmed the original `health.ny.gov` Medicaid host family is still unusable for county-local proof.
- Confirmed the obvious OTDA replacement-host family also fails in bounded live review, so it cannot yet be treated as a rescue path.
