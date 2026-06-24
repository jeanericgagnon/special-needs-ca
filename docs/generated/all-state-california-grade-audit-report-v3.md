# All-State California-Grade Audit Report v3

This v3 audit tracks packet-backed California-grade truth across all 50 states. A state is only index-safe when every critical family is verified by current official or first-party evidence.

## Packet coverage

- packet_coverage_count: 50
- packet_missing_states: none

## Classification counts

- COMPLETE: 26
- BLOCKED: 24
- index-safe states: 26

## State lists

- complete states: Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas
- blocked states: Alaska, Arizona, Florida, Idaho, Kansas, Maine, Massachusetts, Minnesota, Nebraska, New Hampshire, New Mexico, North Dakota, Ohio, Oklahoma, Rhode Island, South Dakota, Tennessee, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## Notes

- Texas remains COMPLETE/index-safe from v10.
- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.
- New York remains COMPLETE/index-safe from the official OTDA county-local successor leaves.
- Oregon is now COMPLETE/index-safe because the live ODHS office-finder exposes a public `Office Locations` SharePoint list with county arrays covering all 36 counties.
- Oklahoma remains blocked because the live OKDHS KML only proves 45 benefit-capable counties and the remaining 32 counties still lack a verified public disability/local-routing contract.
- Ohio is now the next focus state because county-local routing is still root-dead and district/ESC routing is still mostly inventory-only.
- Kansas now has a stricter live state-root stop signal again: the current KSDE Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay all return `Request Rejected` shells in the bounded raw lane, so future repairs should continue only from saved district leads plus exact district-owned leaves.
- Nebraska remains blocked because the public ExperienceBuilder config itself still references only one web map plus a closest-feature output and geocoder search, while the underlying FeatureServer still exposes no county-assignment bridge beyond the same 42-office / 93-county mismatch.
- Utah remains blocked because the recovered DHHS contacts hub still defers local office proof, and the current DWS office-search shell now makes the public contract even narrower: it explicitly limits lookup to `Zip Code or City` while the public APIs still expose no county or service-area field.
