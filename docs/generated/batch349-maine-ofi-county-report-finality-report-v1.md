# Batch 349 Maine OFI County Report Finality v1

- classification: BLOCKED
- index_safe: false
- change: strengthened the Maine county-local blocker by adding the official OFI Data & Reports lane and sampled county / county-and-town workbooks

## Evidence

- Reviewed 2026-06-25 one more bounded official Maine DHHS/OFI county-local pass. The public DHHS office stack still behaves exactly as before: the district office page preserves office towns, addresses, phones, emails, map shortlinks, and OFI program links, but no county-served or service-area fields; the same-host contact root, administrative offices page, offices/divisions hub, and DHHS sitemap also stay public while exposing no county crosswalk. The newly surfaced official OFI Data & Reports page adds real county-structured artifacts on the same host, including downloadable `Summary Counts By County.xlsx` and `Summary Counts By County And Town.xlsx` files. But those workbooks only preserve TANF/Food Supplement count columns by county and town; they expose zero office names, zero district-office identifiers, zero service-area labels, and zero county-to-office routing fields. Maine therefore still lacks any truthful county-to-office or county-to-service-area routing contract on the official public host family.
