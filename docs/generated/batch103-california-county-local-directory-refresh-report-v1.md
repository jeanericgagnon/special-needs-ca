# California County-Local Directory Refresh Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- repaired_family: county_local_disability_resources

## Evidence checks

- county_local: Reviewed official CDSS IHSS county directory https://www.cdss.ca.gov/inforesources/county-ihss-offices was fetched successfully on 2026-06-22 and exposes 58 county-labeled IHSS routing links, giving statewide county-grade local-office routing without relying on generic statewide fallback pages.
- district_routing: Reviewed exact district leaves remain limited to 3 saved pages; that is not enough to truthfully prove county-grade district routing across all 58 California counties, and the official CDE SELPA directory root https://www.cde.ca.gov/sp/se/as/caselpas.asp now returns a Radware bot challenge in the bounded live lane instead of reviewable directory content.
