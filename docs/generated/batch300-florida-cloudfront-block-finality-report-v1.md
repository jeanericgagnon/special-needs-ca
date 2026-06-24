# Batch 300 Florida CloudFront Block Finality v1

- state: florida
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- `providers.csv` still preserves only 34 distinct county values across 39 rows.
- `Public/CPCPS` now returns a CloudFront 403 `Request blocked` response.
- `config/appconfig.js` now returns a CloudFront 403 `Request blocked` response.
- `static/js/UXModule.flPartnerLocation.85b7166d.js` now returns a CloudFront 403 `Request blocked` response.
- `asset-manifest.json` and `dataexchangeproxy/swagger/index.html` also return the same CloudFront 403 body.

## Repair decision

- Florida remains blocked on missing county-complete local-office proof.
- The current official MyACCESS public lane is edge-blocked rather than even a readable anonymous shell contract.
