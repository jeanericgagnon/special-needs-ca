# Batch 363 New Mexico Current Field Offices Remainder Clear v1

- state: new-mexico
- classification: BLOCKED
- repaired_family: county_local_disability_resources

## What changed

- Reviewed the current official HCA `Field Offices` page instead of relying on the older `field_offices_1` archive tail.
- Confirmed the current page now preserves county-to-office service-area assignments directly in public HTML across all 33 New Mexico counties.
- Cleared the previous four-county remainder: Catron, Harding, Mora, and Union.

## Repair decision

- New Mexico county-local disability resources now clear from the current official HCA host.
- The decisive page is [Field Offices](https://www.hca.nm.gov/lookingforassistance/field_offices/), which preserves rows such as:
  - `County Office 10 - Serving Curry, De Baca, Harding, Quay, & Roosevelt Counties`
  - `County Office 4 - Serving San Miguel, Guadalupe, Taos, Union, Colfax, & Mora Counties`
  - `County Office 14 - Serving Catron, Cibola, Socorro, Torrance, & Valencia Counties`
- New Mexico remains BLOCKED overall because district-grade education routing still lacks reviewed local leaves and VR still lacks a reviewed public alternate to the 401 DVR root.
