# Alaska Blocker Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_families: parent_training_information_center, county_local_disability_resources

## Evidence checks

- pti: Reviewed 2026-06-22 Stone Soup Group sitemap plus exact history/mission, parent-navigation, FAQ, and family-resource-guide leaves. The live sitemap exposes real support/history/navigation pages, but no role-pure PTI leaf, while guessed PTI-style roots and generic About roots return 404. No fetched live first-party page preserves explicit PTI / Parent Training and Information Center designation text.
- county_local: Reviewed 2026-06-22 official Alaska DPA and SDS office-directory candidates plus health.alaska.gov robots.txt and sitemap endpoints. The office leaves, robots.txt, and sitemap URLs all returned Cloudflare security-verification or 403 shells, so the local-office blocker is domain-wide in the current fetch lane rather than one broken page.
