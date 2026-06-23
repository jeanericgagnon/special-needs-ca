# Batch 191 Michigan ArcGIS Field Contract Audit Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: official_mde_arcgis_layers_expose_boundaries_and_codes_without_local_contact_contract

## What was confirmed

- The live official MDE ISD Plans leaf is real.
- That leaf links a statewide policy-resources page and one generic Michigan Schools and Districts ArcGIS app.
- The public ArcGIS app item-data resolves to exact ISD and district boundary services on `gisagocss.state.mi.us`.
- The ISD layer exposes only identifier fields such as `NAME`, `LABEL`, `TYPE`, `ISD`, and `ISDCode`.
- The district layers expose only identifier and boundary fields such as `NAME`, `LABEL`, `DCODE`, `ISD`, and `FIPSCODE`.

## Why Michigan stays blocked

- Reviewed 2026-06-23 the official Michigan MDE ISD Plans leaf plus the exact public ArcGIS app item-data and Schools_Districts service layers. The ISD Plans page links only to statewide policy resources and the generic Michigan Schools and Districts ArcGIS app. The app config resolves to public ISD and district boundary services, but the ISD layer exposes only fields like NAME, LABEL, TYPE, ISD, and ISDCode, while the district layers expose NAME, LABEL, DCODE, ISD, FIPSCODE, and boundary metadata only. No phone, website, email, special-education contact, or local routing URL fields are present, so the official stack still lacks a district-or-county routing contract.

## Completion decision

- Michigan remains BLOCKED and index_safe=false.
