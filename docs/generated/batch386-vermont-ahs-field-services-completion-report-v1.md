# Batch 386 Vermont AHS Field Services Completion v1

- classification: COMPLETE
- index_safe: true
- change: cleared Vermont county-local disability routing with the official public AHS Field Services ArcGIS map, district-contact polygons, office locations, and office-services table

## Evidence

- Reviewed 2026-06-25 the public Vermont `AHS Field Services Map` item metadata at `https://www.arcgis.com/sharing/rest/content/items/e65275f532ee44ebbb96b2bc36e6ecd5?f=json`. That official item says it provides up-to-date AHS Field Office district boundaries, field office locations, field services, and district contact information, and further says twelve Agency of Human Services Field Offices serve as the administrative centers for programs and services locally in Vermont and that each office covers individuals within towns included in the field office's district.
- Reviewed 2026-06-25 the public Vermont AHS Field Services MapServer at `https://maps.healthvermont.gov/arcgis/rest/services/AHS/AHSFieldServices/MapServer?f=json`. The official service exposes a `Service Office` point layer and an `AHS District Contacts` polygon layer for the live field-services map.
- Reviewed 2026-06-25 the public district-contact layer query at `https://maps.healthvermont.gov/arcgis/rest/services/AHS/AHSFieldServices/MapServer/1/query?where=1%3D1&outFields=*&returnGeometry=false&f=json`. That official layer returns 12 AHS districts with district labels plus director names, phones, emails, and district websites, including Barre District, Bennington District, Burlington District, Hartford District, and the remaining statewide districts.
- Reviewed 2026-06-25 the public office-location layer query at `https://maps.healthvermont.gov/arcgis/rest/services/AHS/AHSFieldServices/MapServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&f=json`. That official layer returns 23 service-office locations statewide, including Barre, Bennington, Brattleboro, Burlington, Williston, White River Junction, Middlebury, Morrisville, Newport, Rutland, Springfield, and St. Johnsbury locations.
- Reviewed 2026-06-25 the public office-services table query at `https://maps.healthvermont.gov/arcgis/rest/services/AHS/AHSFieldServices/MapServer/2/query?where=1%3D1&outFields=*&returnGeometry=false&f=json`. The table lists named services and divisions at each local office location, including AHS District Office entries and Department of Disabilities, Aging, and Independent Living HireAbility entries such as Barre at 5 Perry Street, Suite 100.
