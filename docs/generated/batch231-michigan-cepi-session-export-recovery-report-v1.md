# Batch 231 Michigan CEPI Session Export Recovery Report v1

- state: michigan
- refined_family: district_or_county_education_routing
- result: COMPLETE
- index_safe: true

## What changed

- Replayed the official CEPI `PublicDatasets.aspx` form inside one session with the page-owned hidden ASP.NET fields.
- Confirmed the public contract returns real CSV attachments on `ReportViewer.aspx` for both `ISD District` and `LEA District` entity types.
- Used the LEA District export, not the older ArcGIS boundary layers, as the county-grade routing closure because it preserves county names plus district email and phone fields.

## Coverage outcome

- ISD District export rows: 58
- ISD export unique physical counties: 57
- LEA District export rows: 562
- LEA export unique counties: 83
- Counties with at least one LEA row containing both email and phone: 83

## Why this is safe

- The closure is based on a live official CEPI public export, not a guessed endpoint, generic statewide page, or boundary-only ArcGIS metadata.
- County-grade completeness is supported by explicit `EntityCountyName` plus district contact fields in the export itself.
