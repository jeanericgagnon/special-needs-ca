# Batch 262 Minnesota MDE Title Shell Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: official_mdeorg_root_is_live_but_child_routes_and_analytics_are_title_only_radware_shells

## Evidence

- Reviewed 2026-06-23 bounded official Minnesota MDE education surfaces after the earlier flapping-root blocker. The official description page at https://education.mn.gov/MDE/about/SchOrg/ is live and still describes MDE-ORG as a searchable database that can generate files from search parameters. In the same bounded pass, the MDE-ORG root at https://pub.education.mn.gov/MdeOrgView/ also loaded live with title `MDE Organization Reference Glossary` and exposed first-party links for districts, counties, contacts, and analytics. But the actionable child routes did not produce a usable county-grade contract: https://pub.education.mn.gov/MdeOrgView/districts/index => HTTP 200 title `Schools and Districts` with Radware shell text and no real district inventory; https://pub.education.mn.gov/MdeOrgView/reference/county => HTTP 200 title `Minnesota Counties` with Radware shell text and no county list; https://pub.education.mn.gov/MdeOrgView/search/searchContacts => HTTP 200 title `Search Organization Contacts` with Radware shell text and no contact directory; https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList => HTTP 200 title `Contacts` with Radware shell text and no contact-type content; https://pub.education.mn.gov/MDEAnalytics/Data.jsp => HTTP 200 title `Data Reports and Analytics` but still only a title-bearing challenge shell rather than a stable export contract. Minnesota therefore still lacks a reproducible county-grade district routing contract, but the blocker is now precisely title-bearing Radware shells on the actionable first-party routes rather than a fully dead root.

## Repair decision

- Minnesota remains blocked and not index-safe.
- The MDE-ORG description page and root are live.
- But the district, county, contact, and analytics routes still only expose title-bearing Radware shells rather than real routing or export content.
