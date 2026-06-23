# Idaho District Directory Nuance Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: official_district_directory_and_page_json_expose_links_and_some_county_bearing_names_but_no_county_contract_or_special_education_fields

## Evidence

- Reviewed 2026-06-23 bounded live official Idaho SDE probes on https://www.sde.idaho.gov/school-districts/, https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049, and the live DB fallback inventory. The rendered School Districts page and the public page JSON both preserve district names plus exact outbound district website links, including county-bearing names such as Blaine County District #61, Boundary County District #101, Butte County District #111, and Camas County District #121. That makes the official directory stronger than a generic statewide shell. But the same public surfaces still expose no explicit county field, no county filter or county-to-district mapping contract, and no district special-education contact fields. A live DB reconciliation still shows all 44 Idaho county rows pointing at statewide fallbacks rather than district-owned leaves: 42 rows use https://www.sde.idaho.gov/sped/ and 2 rows (Ada and Canyon) still use the generic SDE root https://www.sde.idaho.gov/. Idaho education therefore remains blocked until reviewed district-owned special-education or student-services leaves are attached.

## Repair decision

- Idaho’s SDE School Districts page is now documented as a real public district-link contract and not just a generic statewide shell.
- That still does not clear county-grade education routing because the same public surfaces lack a county mapping contract and role-specific special-education fields.
- Idaho remains blocked until reviewed district-owned leaves are attached.
