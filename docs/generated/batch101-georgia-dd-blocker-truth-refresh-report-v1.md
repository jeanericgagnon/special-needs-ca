# Batch 101 Georgia DD Blocker Truth Refresh Report v1

This pass does not reopen Georgia DD discovery. It corrects the blocker to match current live evidence: the county lookup page still loads, but all six region pages are access-denied in both static and browser-assisted checks.

- classification: BLOCKED
- index_safe: false
- blocker_code: official_region_pages_access_denied_and_county_lookup_not_county_mapped
- next_action: hold_blocked_until_reviewed_county_to_region_source_replaces_access_denied_region_pages
- access_denied_region_pages: 6
- county_lookup_page_live: true
