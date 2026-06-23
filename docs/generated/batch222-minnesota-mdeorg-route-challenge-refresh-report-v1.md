# Batch 222 Minnesota MDE-ORG Route Challenge Refresh Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: official_mdeorg_glossary_root_is_live_but_all_actionable_routes_are_radware_challenged

## Evidence

- Reviewed 2026-06-23 bounded official Minnesota MDE education surfaces at the live MDE-ORG family. The glossary root https://pub.education.mn.gov/MdeOrgView/ loads publicly with title `MDE Organization Reference Glossary` and preserves static first-party links to `/MdeOrgView/search/index`, `/MdeOrgView/search/searchContacts`, `/MdeOrgView/districts/index`, `/MdeOrgView/districts/cities`, `/MdeOrgView/reference/county`, `/MdeOrgView/contact/contactTypeList`, and `/MdeOrgView/home/howToUse`. But a fresh bounded probe showed each one of those actionable routes returning the same `Radware Captcha Page` shell with route-specific `You reached this page when trying to access` text. The older MDE-ORG description page at https://education.mn.gov/MDE/about/SchOrg/ remains useful because it explicitly describes MDE-ORG as a searchable database that can generate files from search parameters, but the live public contract we can actually verify in low-token mode is now: root glossary page visible, all actionable query/county/contact routes challenge-protected. Minnesota therefore still lacks a reviewable county-grade district routing contract.

## Repair decision

- Kept Minnesota BLOCKED.
- Confirmed the exact public MDE-ORG glossary root is live and useful as a first-party discovery surface.
- Confirmed the actionable district, county, contact, and search child routes are all Radware-protected in the low-token lane.
- Reclassified the blocker from vague embedded-directory trouble to a route-level official captcha contract.
