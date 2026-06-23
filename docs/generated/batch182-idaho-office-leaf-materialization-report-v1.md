# Batch 182 Idaho Office Leaf Materialization Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: materialized_exact_office_leaf_packet_shows_17_clean_matches_plus_canyon_split_but_no_public_county_contract

## Evidence

- Reviewed 2026-06-23 the live official Idaho DHW sitemap at https://healthandwelfare.idaho.gov/sitemap.xml, the reviewed statewide office directory at https://healthandwelfare.idaho.gov/offices, and the live county_offices DB rows. The sitemap currently exposes 23 exact DHW office leaves, including Boise Office-Westgate Building, Pocatello Office-Horizon Building, Blackfoot Office-Blackfoot Services Complex, Sandpoint-Ponderay Office, Idaho Falls Office, Caldwell Office, Burley Office, Mountain Home Office, Grangeville Office-Camas Resource Center, Coeur d'Alene Office, Moscow Office, Salmon Office-Field Office, Rexburg Office, Lewiston Office-State Office Building, Payette Office, Kellogg Office, and Twin Falls Office-Pole Line Building. A live DB reconciliation shows 18 DOI-backed rows, but they collapse to 17 county-clean exact office leaf matches plus one duplicated Canyon County pair. Canyon's Caldwell row maps to https://healthandwelfare.idaho.gov/dhw/caldwell-office, while the only public Nampa mention still resolves only to Southwest Idaho Treatment Center (SWITC) rather than a county benefits office leaf. The remaining 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations. Idaho therefore still lacks a public county-to-office contract, but the county-local packet is now materially sharper: future repair work can start from exact office leaves for the 17 clean counties and the explicit Canyon split instead of rereading the statewide directory or DOI placeholders.

## Repair decision

- Idaho remains blocked and not index-safe.
- The county-local lane is now materially sharper: the packet contains the exact official office-leaf URLs instead of only DOI mirror names and dead legacy locators.
- Seventeen counties now have clean exact office-leaf replacements ready on disk, Canyon remains an explicit Caldwell-versus-Nampa split, and 27 legacy-locator counties remain blocked until a public county-to-office contract exists.
- Future Idaho county-local work should start from the materialized exact office-leaf packet rather than from statewide directory rereads.
