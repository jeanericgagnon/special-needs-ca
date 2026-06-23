# Batch 232 Minnesota Root Instability Refresh Report v1

- state: minnesota
- refined_family: district_or_county_education_routing
- classification: BLOCKED
- index_safe: false

## What changed

- Rechecked the exact MDE-ORG glossary root instead of relying on the earlier saved assumption that it remained stably public.
- Confirmed the glossary root itself can now return a `Radware Captcha Page` title under exact bounded fetches.
- Preserved the stronger blocker: root instability plus challenge-protected district/county/contact routes plus unstable analytics route.
