# Batch 337 Utah LMHA County Map Report v1

- state: Utah
- classification: COMPLETE
- county_count: 29

## What was confirmed

- Confirmed `https://sumh.utah.gov/contact/location-map/` returns HTTP 200 on the current official Utah DHHS stack.
- Confirmed the live page title is `Local Mental Health Authority Location Map | Substance Use and Mental Health | Utah Department of Health and Human Services`.
- Confirmed the live page explicitly says `Click on your county to find your Local Mental Health Authority (LMHA)`.
- Confirmed the same first-party page names all 29 Utah counties and preserves county-specific LMHA contact blocks.
- Confirmed the page preserves explicit local authority details for the previously unresolved remainder, including Daggett County, Morgan County, and the Rich County lane.
- Confirmed the companion `https://sumh.utah.gov/mental-health/` page says Utah county LMHAs provide mental health services to residents of all ages, including those with Medicaid and those who are unfunded, and points families back to the location map.

## Why Utah now completes

- The official county LMHA map is county-complete on the current first-party Utah DHHS host.
- The official companion mental-health page makes the LMHA role explicit and ties the local-authority contract back to the same first-party map.
- That pair replaces the weaker generic DHHS contacts and DWS office-inventory lanes and closes the last Utah county-local blocker.

## Final decision

- Utah is COMPLETE and index-safe.

