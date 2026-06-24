# Batch 321 Florida Auth-Only Endpoint Finality v1

- state: florida
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What changed

- The current public MyACCESS main bundle still resolves live from the asset manifest.
- The live main bundle now re-exposes the exact county-result endpoint names `getZipCountyDetails` and `communityPartnerSearch`.
- Both exact official endpoints still return HTTP 401 `Unauthorized` on bounded anonymous GET and POST probes.
- Family Resource Center `providers.csv` still preserves only 34 distinct counties across 39 rows.

## Repair decision

- Florida remains blocked on missing county-complete public local-office proof.
- This pass corrects stale blocker language: the bundle does expose endpoint names again, but the endpoints remain authenticated-only and therefore still cannot clear county-grade routing.
