# Batch 362 Massachusetts DDS Locality Capture Remainder v1

- state: massachusetts
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What changed

- Rechecked the live official DDS locations lane in the browser-readable path across all four paginated results pages.
- Confirmed the page exposes real area-office locality coverage text, not just office names and addresses.
- Reduced the blocker from a generic “live browser lane without raw county contract” to a narrower 13-of-14 county locality capture remainder.

## Evidence

- The live `Department of Developmental Services Locations` page now preserves 21 distinct `DDS ... Area Office` cards with explicit `This area office serves the following towns and communities:` text.
- A bounded reviewed bridge from those live town/community lists into the official Census TIGERweb Massachusetts county-subdivision layer covered 13 counties:
  - `barnstable-ma`
  - `berkshire-ma`
  - `bristol-ma`
  - `dukes-ma`
  - `essex-ma`
  - `franklin-ma`
  - `hampden-ma`
  - `hampshire-ma`
  - `middlesex-ma`
  - `nantucket-ma`
  - `norfolk-ma`
  - `plymouth-ma`
  - `worcester-ma`
- The remaining live locality gap is `suffolk-ma`. The reviewed paginated DDS cards still do not preserve a Suffolk-serving town/community list, and bounded Boston/Chelsea/Revere/Winthrop/Charlestown scans on the same locations pages only surfaced Boston in Central Office text or region labels, not in a Suffolk-serving area-office contract.

## Repair decision

- Massachusetts remains BLOCKED and not index-safe.
- The live DDS lane is stronger than the older blocker implied: it now truthfully supports reviewed town/community-to-area-office capture for 13 of 14 counties.
- Massachusetts should reopen toward COMPLETE only when an official Suffolk-serving DDS locality contract appears on the live locations lane, the interactive DDS map, or another current Mass.gov DDS export or page that preserves Suffolk town/community coverage directly.
