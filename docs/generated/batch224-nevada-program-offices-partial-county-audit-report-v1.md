# Batch 224 Nevada Program Offices Partial County Audit Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: official_program_offices_page_adds_partial_county_partners_but_no_full_county_to_welfare_contract

## Evidence

- Reviewed 2026-06-23 bounded live probes on the official Nevada DSS welfare-office stack and one sibling official contact page. The live Contact hub plus `Welfare District Offices-North` and `Welfare District Offices-South` pages remain exact office leaves with real addresses and phones but zero county-served labels, zero county filter, and no county assignment. A fresh bounded probe on the sibling official page https://www.dss.nv.gov/contact/program-offices/ showed that Nevada DSS does expose some county-named local partners on the same host, including Churchill County Social Services, Douglas County Social Services, Elko County Human & Social Services, Eureka County Social Services, Lincoln County Community Connection, Lyon County Human Services, Nye County Health & Human Services, Pershing County Senior Center, and White Pine County Social Services, along with Carson City and other locality-specific partners. But the page still does not provide a complete 17-county county-to-office or county-to-welfare-office contract: a bounded county-coverage check found only 11 of Nevada’s 17 county-equivalent names on the page, leaving Clark, Esmeralda, Humboldt, Lander, Storey, and Washoe without a county-named contract there. Nevada therefore remains blocked, but the blocker is now precisely a partial county-bearing sibling page plus incomplete county coverage rather than zero county signal anywhere on the host.

## Repair decision

- Kept Nevada BLOCKED.
- Confirmed the sibling Program Offices page adds real county-bearing local partners on the same official DSS host.
- Confirmed that county-bearing coverage is still incomplete at 11 of 17 counties and does not replace the missing welfare-office county mapping.
