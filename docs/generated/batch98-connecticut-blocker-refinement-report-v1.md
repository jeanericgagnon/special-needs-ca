# Connecticut Blocker Refinement Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75

## Evidence checks

- education: Reviewed current Connecticut school_district rows on 2026-06-22. Six county-linked rows still point to the statewide CDE special-education leaf https://portal.ct.gov/sde/special-education, and the remaining Fairfield and Hartford rows still point only to the generic CT SDE root https://portal.ct.gov/sde, so no district-owned education leaf is currently verified for any of Connecticut’s 8 counties.
- pti: Reviewed 2026-06-22 live CPAC homepage plus bounded same-domain follow-ups. The homepage exposed only two same-domain links, likely About roots and sitemap endpoints returned 404, and no fetched first-party page preserved explicit PTI / Parent Training and Information designation text. CPAC still proves statewide Connecticut family-support and training scope, but not the exact PTI designation required for California-grade statewide support.
- county_local: Reviewed current Connecticut county_offices rows on 2026-06-22. Eleven county-office rows still use the DOI mirror https://doi.org/10.7910/DVN/AVRHMI with source_listed evidence, and the remaining Tolland row still points only to the generic locations root https://dhhs.connecticut.gov/locations, so county-local office routing is not yet backed by reviewed county-owned leaves.
