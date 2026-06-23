# Batch 267 Oregon County-Searchable School Directory Report v1

- classification: BLOCKED
- index_safe: false
- repaired_family: district_or_county_education_routing
- remaining_failure_code: live_office_finder_root_without_county_extract

## Evidence

- Reviewed 2026-06-23 one more bounded official Oregon education surface from the live ODE special-education root. The live School Directory page at https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx links the current Combined Directory PDF at https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf. The page explicitly says the PDF index allows users to search by county. In the PDF itself, the public-schools section says Oregon education service districts and school districts are listed alphabetically by county, with staff members, addresses, phone numbers, websites, and grade ranges. The example district block for Baker SD 5J preserves institution ID, phone, fax, street address, website, and superintendent. Oregon therefore now has a reviewed official county-grade district-routing contract on disk.

## Repair decision

- Oregon remains blocked and not index-safe.
- The official ODE School Directory PDF now clears county-grade education routing because it explicitly organizes districts by county and preserves district contact blocks.
- County-local disability resources remain blocked because the live ODHS office-finder root still exposes no county extract or county-to-office contract in static HTML.
