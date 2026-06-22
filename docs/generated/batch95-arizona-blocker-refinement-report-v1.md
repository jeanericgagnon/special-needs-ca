# Arizona Blocker Refinement Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- repaired_families: parent_training_information_center
- remaining_blockers: district_or_county_education_routing, county_local_disability_resources

## Evidence checks

- pti: Reviewed 2026-06-22 live Encircle Families acknowledgements page at https://encirclefamilies.org/about-us/acknowledgements/. The fetched first-party page explicitly says Encircle Families is Arizona’s Parent Training and Information (PTI) Center and cites IDEA Part D grant support, so the PTI family is now verified from live first-party designation text rather than inferred family-support scope.
- education: Reviewed 2026-06-22 live Arizona Department of Education special-education candidates. The root, parental-rights, dispute-resolution, az-find, ESSO, publications, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell, while the current 15 Arizona school_district rows still point at https://www.azed.gov/specialeducation as generic county fallback evidence rather than district-owned pages.
- county_local: Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell, while 14 Arizona county_office rows still rely on the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and one row still points at the generic legacy locations root https://dhhs.arizona.gov/locations instead of reviewed county-specific official office leaves.
