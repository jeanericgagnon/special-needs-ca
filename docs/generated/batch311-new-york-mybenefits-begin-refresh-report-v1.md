# Batch 311 New York MyBenefits Begin Refresh v1

- state: New York
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- The old `health.ny.gov` LDSS family still fails host-wide with 403 `Request blocked` shells.
- The live `ny.gov` service pages still explicitly route people toward OTDA local district contact paths and the MyBenefits online lane.
- The exact OTDA successor leaves and OTDA host roots still reset the connection in the bounded lane.
- `mybenefits.ny.gov` no longer resets and now lands publicly on `/mybenefits/begin`.
- The recovered MyBenefits begin page still only exposes portal/login navigation and links back to OTDA pages, not a county-local office contract.

## Repair decision

- New York remains blocked on missing reviewable county-local office routing.
- The successor family is sharper, but still not reviewable enough to clear county-local proof.
