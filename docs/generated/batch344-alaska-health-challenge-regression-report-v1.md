# Batch 344 Alaska Health Challenge Regression v1

- state: alaska
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What changed

- The current health.alaska.gov DPA family no longer holds the older browser-readable contract used by the prior packet.
- Raw fetches to the DPA landing page, exact offices page, Adult Public Assistance page, Apply for Medicaid page, and the public DPA dashboard / Medicaid snapshot PDFs now all return HTTP 403.
- In the reviewed browser lane, the offices and successor service pages now land on `Just a moment...` / `Performing security verification` shells instead of materializing office or service content.
- The still-readable DFCS successor pages remain public, but they still do not expose borough- or census-area office assignment fields.

## Final blocker

- Alaska remains blocked because the official health host is challenge-shelled and the readable successor host still offers no county-equivalent routing contract.

