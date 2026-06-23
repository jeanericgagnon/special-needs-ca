# Batch 230 Michigan CEPI Export Blocker Refresh Report v1

- classification: BLOCKED
- index_safe: false
- family updated: district_or_county_education_routing

## What changed

- Confirmed the exact public MDE-linked ArcGIS stack still stops at ISD boundaries, district boundaries, and school-campus addresses.
- Confirmed an additional exact official source lane exists at CEPI Public Data Sets.
- Confirmed the exact bounded public dataset postback for ISD District and LEA District currently fails with HTTP 500 and the server message `Validation of viewstate MAC failed`.
- Sharpened Michigan’s blocker so future work does not keep treating CEPI as an assumed runnable export.

## Result

- Michigan remains BLOCKED and index_safe=false.
- The final blocker is now explicit: no local routing fields in the MDE-linked layers, plus no stable CEPI public dataset export contract yet.
