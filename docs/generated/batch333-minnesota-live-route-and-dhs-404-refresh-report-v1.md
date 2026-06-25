# Batch 333 Minnesota Live Route And DHS 404 Refresh Report v1

- state: minnesota
- classification: BLOCKED
- index_safe: false
- refined_families: district_or_county_education_routing, county_local_disability_resources

## What changed

- Cleared `district_or_county_education_routing` from browser-reviewed public MDE-ORG routes: the schools-and-districts page, counties page, county member pages, district detail leaves, and the special-education-director contact list are all publicly readable on the official host.
- Narrowed Minnesota to one remaining critical blocker: the DHS county/tribal/state directory successor is still bot-gated and the saved disability-services replacements still 404.
