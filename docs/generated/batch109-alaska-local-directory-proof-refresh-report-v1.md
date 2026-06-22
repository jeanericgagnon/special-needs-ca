# Alaska Local Directory Proof Refresh Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: official_local_directory_domainwide_cloudflare_challenge_and_legacy_locator_404

## Evidence

- Reviewed 2026-06-22 live official Alaska DPA and SDS office-directory candidates on health.alaska.gov, including office-locations, default, contact, newer /en/ paths, and the host-level robots.txt plus sitemap.xml surfaces. Every live health.alaska.gov candidate returned HTTP 403 with cf-mitigated: challenge and the Cloudflare "Just a moment..." shell, while the legacy official locator https://dhss.alaska.gov/locations returned HTTP 404 and the legacy dhss.alaska.gov DPA/DSDS aliases only 302 back into the same challenged host. A bounded browser-assisted check on the exact office-locations leaf still returned HTTP 403 plus the same Cloudflare "Performing security verification" shell, so the current official host is blocked in both static and browser-assisted lanes. No alternate official county-grade office leaf or document was recovered in this bounded pass.
