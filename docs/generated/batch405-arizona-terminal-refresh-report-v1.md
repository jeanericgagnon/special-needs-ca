# Batch 405 Arizona Terminal Refresh v1

- classification: BLOCKED
- index_safe: false
- change: tied Arizona’s blocked terminal state to a fresh 2026-06-26 live recheck of the DES wrapper, Salesforce app, AHCCCS fallbacks, and Greenlee-locality surfaces

## Evidence

- Reviewed 2026-06-26 one more bounded live Arizona county-local pass across the exact official DES, Salesforce, AHCCCS, and Greenlee-locality lanes. The official DES wrapper roots `https://des.az.gov/office-locator` and `https://des.az.gov/find-your-local-office` still return HTTP 403 `Just a moment...` shells. The linked public Salesforce-hosted DES office-locator app at `https://azdes-community.my.salesforce-sites.com/EOL/` still returns HTTP 200 and remains the only reviewable official DES county-local lane. The AHCCCS fallback family also remains unchanged: `https://www.azahcccs.gov/Members/ALTCSlocations.html` is still live, while the older `ALTCS_CountyMap.pdf` and `AHCCCScontacts.html` URLs still return HTTP 200 HTML stale shells instead of usable office-routing documents. The official Greenlee County health page plus first-party Clifton, Duncan, and Morenci town surfaces remain live, but they still do not name any DES or AHCCCS office assignment for Greenlee County. Arizona therefore still lacks one reviewed public official artifact that explicitly binds Greenlee County itself to a DES or AHCCCS office.
