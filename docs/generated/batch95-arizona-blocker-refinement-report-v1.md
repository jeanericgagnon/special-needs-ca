# Arizona Blocker Refinement Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- repaired_families: parent_training_information_center
- remaining_blockers: district_or_county_education_routing, county_local_disability_resources

## Evidence checks

- pti: Reviewed 2026-06-22 live Encircle Families acknowledgements page at https://encirclefamilies.org/about-us/acknowledgements/. The fetched first-party page explicitly says Encircle Families is Arizona’s Parent Training and Information (PTI) Center and cites IDEA Part D grant support, so the PTI family is now verified from live first-party designation text rather than inferred family-support scope.
- education: Reviewed 2026-06-22 live Arizona Department of Education special-education candidates. The root, parental-rights, dispute-resolution, az-find, ESSO, publications, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live school_district table currently contains 15/15 Arizona rows still pointing at https://www.azed.gov/specialeducation as generic county fallback evidence, and no authored district-owned Arizona leaf packet is currently present on disk to replace them.
- county_local: Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations, and no authored Arizona county-office leaf packet is currently present on disk to replace them.
