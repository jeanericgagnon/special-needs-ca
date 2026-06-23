# Batch 185 Massachusetts Live DDS Location Lane Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: live_dds_locations_and_interactive_map_without_county_contract

## Evidence

- Reviewed 2026-06-23 bounded browser checks on the live Massachusetts DDS first-party lane. The org page at https://www.mass.gov/orgs/department-of-developmental-services now renders normally and links exact child surfaces, including `Contact a DDS Area Office`, `Find Your Regional and Area Office`, and `/orgs/department-of-developmental-services/locations`. The old guessed page https://www.mass.gov/info-details/dds-area-offices is not a host-403 lane after all; it is a real 404 `We can't find that page`. The live locations index at https://www.mass.gov/orgs/department-of-developmental-services/locations renders 28 results, including named leaves such as DDS Berkshire Area Office, DDS Brockton Area Office, DDS Cape Cod/Islands Area Office, DDS Central Middlesex Area Office, DDS Fall River Area Office, and DDS Franklin/Hampshire Area Office with office addresses. The live interactive map page at https://www.mass.gov/info-details/interactive-dds-regional-map also renders and explicitly says it is used to find which DDS Regional Office and Area Office serves your town or city, but the rendered HTML still preserves no county names, no machine-readable town list, and no county-to-office export contract. Massachusetts therefore still lacks county-grade local routing proof in the low-token lane, but the blocker is now correctly narrowed to a live town/city DDS mapping surface without a reusable county contract.

## Repair decision

- Massachusetts remains blocked and not index-safe.
- The old Mass.gov DDS blocker was overstated: the org page, locations index, and interactive regional map are live and reviewable.
- The real blocker is narrower: those live surfaces still do not preserve a county-grade export or machine-readable town list that can be reused safely in the low-token lane.
- The next honest lane is reviewed browser or cached capture from the live DDS locations and interactive map surfaces, not more host-403 guessing.
