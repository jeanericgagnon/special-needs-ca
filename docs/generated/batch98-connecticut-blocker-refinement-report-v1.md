# Connecticut Blocker Refinement Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83

## Evidence checks

- education: Reviewed 2026-06-22 bounded live checks on the exact Connecticut SDE special-education leaf https://portal.ct.gov/sde/special-education, the generic SDE root https://portal.ct.gov/sde, and the official EdSight portal https://edsight.ct.gov/. The special-education leaf exposed no district-directory links beyond itself, the SDE root exposed only statewide Bureau/central-office and data-portal links, and EdSight described statewide reports about schools and districts but did not preserve district-owned special-education routing contacts. No district-grade education leaf is currently verified for any of Connecticut’s 8 counties.
- county_local: Reviewed 2026-06-22 bounded live checks on the Connecticut DSS root https://portal.ct.gov/dss/home plus likely office-location leaves https://portal.ct.gov/dss/common-elements/office-locations and https://portal.ct.gov/dss/common-elements/search-dss-office-locations. The DSS home exposed statewide program/help and hearing links only, and both office-location guesses returned HTTP 404, so no reviewed official county office directory leaf currently replaces the DOI mirror office rows.
- pti_repair: Reviewed 2026-06-22 live first-party CPAC About page https://cpacinc.org/about.aspx. The page preserves the sentence "Beth is also the Director of CPAC's federally funded Parent Training and Information (PTI) Center project," so CPAC now has explicit first-party PTI designation evidence rather than only generic statewide family-support language.
