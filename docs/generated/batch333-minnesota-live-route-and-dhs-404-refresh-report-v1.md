# Batch 333 Minnesota Live Route And DHS 404 Refresh Report v1

- state: minnesota
- classification: BLOCKED
- index_safe: false
- refined_families: district_or_county_education_routing, county_local_disability_resources

## What changed

- Rechecked the official MDE-ORG family live and confirmed the description page is public while the glossary root itself is unstable: one exact probe returned the live glossary title and a second exact probe flipped into Radware.
- Confirmed the district, county, contact, and analytics routes still collapse into `validate.perfdrive.com` / `Radware Captcha Page`.
- Rechecked the saved DHS county-and-tribal replacements and confirmed both now resolve to official DHS 404 pages instead of a live captcha family.
