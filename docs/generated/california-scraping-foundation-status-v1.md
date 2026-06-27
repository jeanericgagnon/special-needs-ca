# California Scraping Foundation Status v1

Generated: 2026-06-27T22:32:09.126Z

## Registry And Queue
- Registry families: `10`
- Registry seed entries: `18`
- Queue rows: `18`
- Alignment status: `pass`
- Alignment failures: none

### Queue By Family
- ihss: 2
- selpa: 2
- ccs_mtu: 2
- dhcs_epsdt: 2
- ssi: 2
- calable: 2
- frcnca: 1
- pti_cprc: 2
- help_me_grow: 1
- local_nonprofits: 2

## Publish Decisions
- Prefix: `ca_county_office_refresh_v1`
- Stage-ready rows: `5`
- Published rows: `5`
- Needs review rows: `0`

### Publish Decisions By Family
- medicaid_hhs_offices: 5

### Publish Decisions By Status
- published: 5

### County Office Trust Check
- Published county office rows: `5`
- Unsafe published county office rows: `0`
- Unsafe published county office agencies: none

## Live Upsert
- Run id(s): `ca-v3, ca-county-office-fetch-now-v5, ca-county-office-review-first-v1`
- Mode: `apply`
- Actionable rows: `13`
- Skipped rows: `5`

### Upsert Runs
- ca-v3: actionable=`8`, skipped=`0`, mode=`apply`
- ca-county-office-fetch-now-v5: actionable=`2`, skipped=`3`, mode=`apply`
- ca-county-office-review-first-v1: actionable=`3`, skipped=`2`, mode=`apply`

### Upserted By Table
- state_resource_agencies: 5
- forms_and_guides: 1
- county_offices: 6
- programs: 1

## Published-Only Query Guards
- countyOfficesBulkPublishedOnly: `pass`
- schoolDistrictsBulkPublishedOnly: `pass`
- schoolDistrictByIdPublishedOnly: `pass`
- schoolDistrictLitigationListPublishedOnly: `pass`
- schoolDistrictBySlugPublishedOnly: `pass`
- selpasByCountyPublishedOnly: `pass`
- waitlistsPublishedOnly: `pass`
- localProvidersPublishedOnly: `pass`
- programsBulkPublishedOnly: `pass`
- programBySlugPublishedOnly: `pass`

## Nationwide Gate Snapshot
- COMPLETE: `45`
- BLOCKED: `5`
- index-safe: `45`
