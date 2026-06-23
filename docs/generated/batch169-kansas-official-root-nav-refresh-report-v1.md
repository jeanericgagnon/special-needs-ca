# Kansas Official Root Navigation Refresh Report v1

- classification: BLOCKED
- index_safe: false
- refreshed_families: developmental_disability_idd_authority, district_or_county_education_routing

## DD outcome

- Reviewed 2026-06-23 bounded live official Kansas DD probes on https://www.kdads.ks.gov/, https://www.kdads.ks.gov/services/developmental-disabilities, https://www.kdads.ks.gov/robots.txt, https://www.kancare.ks.gov/, and https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000. Every one of those exact official roots and leaves now returns HTTP 403 Forbidden / access denied under the same low-token fetch contract. Kansas therefore still lacks any raw-fetch-reviewable official DD authority leaf, and the blocker is now a uniform 403 host-stack pattern rather than a content-discovery problem.

## Education outcome

- Reviewed 2026-06-23 bounded live official Kansas education probes on https://www.ksde.gov/, https://www.ksde.gov/policy-and-funding/special-education, https://www.ksde.gov/policy-and-funding/school-transportation/school-district-maps, https://www.ksde.gov/data-and-reporting/directories, https://www.ksde.gov/data-and-reporting/data-central, https://datacentral.ksde.gov/default.aspx, https://uapps.ksde.gov/Directory_Rpts/default.aspx, https://www.ksde.gov/policy-and-funding/special-education/special-education-law/dispute-resolution, https://www.ksde.gov/policy-and-funding/special-education/special-education-law/notices-and-forms/parents-rights, and the live USD county map PDF at https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5. The current KSDE roots are live and preserve better statewide authoring surfaces than the older stale paths, including a live Data Central root and a linked public Directory Reports app. But a live DB reconciliation still shows all 105 Kansas school_district rows pointing at the same statewide placeholder website https://www.ksde.org/Default.aspx?tabid=101, and the refreshed official roots still do not preserve a county-to-district join or district-owned special-education routing leaf on disk.

## Result

- Kansas remains BLOCKED and not index-safe.
- The Kansas DD stack is now documented as a uniform 403 blocker across the exact official root and child leaves that matter.
- The Kansas education packet now points at current live KSDE authoring roots instead of stale deep links, but the county-grade local contract is still missing.
