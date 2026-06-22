# Colorado Blocker Refinement Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83

## Evidence checks

- education: Reviewed current Colorado school_district rows on 2026-06-22. All 64 county-linked school_district rows still collapse to the same statewide CDE special-education URL https://www.cde.state.co.us/cdesped, including county fallback names like Adams, Alamosa, and Arapahoe, so no district-owned education leaf is currently verified for California-grade county routing.
- county_local: Reviewed current Colorado county_offices rows on 2026-06-22. At least 67 county-office rows for Colorado counties still use the DOI mirror https://doi.org/10.7910/DVN/AVRHMI with source_listed evidence levels, including Adams, Alamosa, Arapahoe, and Boulder, so county-local office routing is still backed by mirror data rather than reviewed county-owned leaves.
