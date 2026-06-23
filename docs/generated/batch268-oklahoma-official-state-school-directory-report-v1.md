# Batch 268 Oklahoma Official State School Directory Report v1

- classification: BLOCKED
- index_safe: false
- repaired_family: district_or_county_education_routing
- remaining_failure_code: dead_dhhs_locator_host_plus_doi_planning_rows

## Evidence

- Reviewed 2026-06-23 one more bounded official Oklahoma education surface on the live Oklahoma.gov host. The page at https://oklahoma.gov/education/resources/state-school-directory.html returned HTTP 200 and explicitly states that OSDE-accredited education contact information can be downloaded or browsed by district or school site, including physical addresses, mailing addresses, phone numbers, email addresses, website URLs, and more. The same live page exposes official `School Directory` and `District Directory` download links on the OSDE host. Oklahoma therefore now has an official district-routing directory contract on the current education site, and the older `special-education` URL collapse no longer defines the education family.

## Repair decision

- Oklahoma remains blocked and not index-safe.
- The official OSDE State School and District Directory page now clears county-grade education routing because it exposes current district contact fields and live directory downloads on the modern Oklahoma.gov host.
- County-local disability resources remain blocked because the former DHHS locator host is dead and no live county-grade directory has replaced it yet.
