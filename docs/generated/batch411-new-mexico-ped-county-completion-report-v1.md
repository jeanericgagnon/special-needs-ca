# Batch 411 New Mexico PED County Completion v1

- classification: COMPLETE
- index_safe: true
- change: cleared New Mexico district/county education routing from the reviewed PED Superintendent directory plus official Census county geographies, with Catron closed from first-party Reserve district coordinates

## Evidence

- Reviewed 2026-06-26 the live official New Mexico PED Superintendent directory items API at `https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists/getbytitle('Superintendents')/items?$top=5000` together with the official Census county geographies endpoints. The PED items contract preserves 144 district-office address rows with district code, district name, office address, city, ZIP, and superintendent email on the official PED host. The official Census `geographies/onelineaddress` endpoint resolved those reviewed PED district-office addresses directly to 32 distinct New Mexico counties. Catron County stayed unmatched through one-line address geocoding because the rural Reserve and Quemado office addresses did not resolve there, so the final county was closed through reviewed first-party district evidence instead: the live Reserve Independent Schools page preserves the district office address `24 MOUNTAINEER RD, RESERVE, NM 87830` and embedded coordinates `(33.710737,-108.761857)`, and the official Census `geographies/coordinates` endpoint returns `Catron County` from those first-party coordinates. Together this yields explicit county-grade local education routing coverage across all 33 New Mexico counties without guessing from district names, towns, or stale exports.

## Coverage

- county-grade district routing rows: 33
- Catron County closure lane: Reserve Independent Schools first-party coordinates -> official Census reverse geocoder -> Catron County
