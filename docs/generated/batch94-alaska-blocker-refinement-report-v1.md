# Alaska Blocker Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_families: parent_training_information_center, county_local_disability_resources

## Evidence checks

- pti: Reviewed 2026-06-22 live Stone Soup Group and Parent Center Hub artifacts. Stone Soup first-party pages still preserve statewide support and parent-navigation scope, but no fetched page preserves explicit PTI / Parent Training and Information Center designation text. Stone Soup search results echo the query in the page title ("Parent Training and Information") but only render generic search-results content, and the Parent Center Hub Alaska map asset only preserves the Alaska selector plus "Click to find a list of parent centers" without naming Stone Soup Group or an Alaska PTI. No fetched first-party or authoritative page yet preserves explicit Alaska PTI designation text.
- county_local: Reviewed 2026-06-22 live official Alaska DPA and SDS office-directory candidates on health.alaska.gov, including office-locations, default, and contact roots. Every checked office candidate returned HTTP 403 with the Cloudflare "Just a moment..." shell, so county-grade local-office evidence is blocked at the domain level in the current fetch lane rather than at one stale page.
