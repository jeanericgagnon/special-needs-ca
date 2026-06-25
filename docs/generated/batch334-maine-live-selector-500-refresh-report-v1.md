# Batch 334 Maine Live Selector 500 Refresh Report v1

- state: maine
- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing

## What changed

- Rechecked the live Primary Contacts selector, Superintendent selectors, and official SAU workbook on 2026-06-25.
- Confirmed the current contact selector still exposes the anti-forgery token, the `OrgId` selector, the `SAUs[*]` hidden inventory, and the literal `action:CSearchBySAU` / `action:SAUExport` submit controls.
- Confirmed fresh Bangor search and export posts on the Primary Contacts lane still fall into the NEO `Home/CustomError` shell.
- Confirmed fresh Bangor submits on both the Superintendent by SAU and Superintendent by Town selectors now materialize local superintendent rows with address, phone, fax, and email on the official host.
