# Batch 263 Maine Workbook Mapping-Only Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: official_workbook_is_mapping_only_and_search_export_contact_lane_still_500

## Evidence

- Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The official workbook is live, stable, and directly inspectable. Its workbook tables prove a real municipality-to-organization mapping contract, but not a local contact contract: `ByMunicipality_IncludingEUT` and `ByMunicipality_NoEUT` carry only `YearCode`, `Municipality`, `TownCode`, `GEOCode`, `OrganizationId`, and `OrganizationName`; `BySAU_IncludingEUT` and `BySAU_NoEUT` carry only the same mapping fields in reversed order; and `SAUs Only & Charters` adds only `Organization Type`. No workbook table preserves county names, superintendent contacts, special-education contacts, phones, emails, or district routing rows. The public selector HTML still exposes a real anti-forgery token, the full hidden `SAUs[*]` inventory, `OrgId` as the organization selector, and the exact first-party submit controls `action:CSearchBySAU` (`Search`) and `action:SAUExport` (`Export to Excel`). But fresh bounded Bangor replays with `OrgId=42` and those literal named submit values still return HTTP 500 and only the generic NEO Contact Search error shell rather than local contact rows or `SAUSearchResults.xls`. Maine therefore no longer has a discovery blocker and does have a stable official mapping workbook, but the county-grade contact materialization lane is still not recovered.

## Repair decision

- Maine remains blocked and not index-safe.
- The official workbook is real and stable.
- But it is only a mapping workbook, and the local contact materialization lane is still not recovered.
