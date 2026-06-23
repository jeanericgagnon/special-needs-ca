# Batch 284 Florida Dataexchangeproxy Finality Report v1

- state: Florida
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- lessons_updated: false

## What was confirmed

- `providers.csv` still preserves only 34 distinct county values across 39 rows.
- The exact `food-cash-and-medical` leaf still routes local-office discovery only into the Family Resource Center storefront lane.
- The current public MyACCESS config exposes `officeMapping: /dataexchangeproxy` and `CreateCBOAccountService: /dataexchangeproxy`.
- The public CPCPS, HCINT, config.json, swagger, swagger index, and bare dataexchangeproxy routes all replay the same SPA shell instead of a county-result contract.

## Repair decision

- Florida remains blocked on missing county-complete local-office proof.
- No anonymous MyACCESS office-mapping contract was found in this bounded pass.
