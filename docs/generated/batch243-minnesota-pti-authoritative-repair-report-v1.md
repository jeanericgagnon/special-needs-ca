# Batch 243 Minnesota PTI Authoritative Repair Report v1

- classification: BLOCKED
- index_safe: false
- repaired_family: parent_training_information_center

## Evidence

- Reviewed 2026-06-23 the authoritative Parent Center Hub Minnesota state leaf at https://www.parentcenterhub.org/findurcenter/minnesota/. The live page explicitly preserves `Minnesota PTI`, names PACER Center, Inc., and preserves direct Minnesota contact details on an authoritative national PTI directory. That authoritative state-specific PTI designation is enough to verify the parent_training_information_center family even though PACER’s own current first-party pages no longer repeat the explicit PTI label and the older `/parent/php/PIC/` path family now returns HTTP 404.

## Repair decision

- Minnesota remains blocked because the two critical Radware families are unchanged.
- The PTI family now clears from the authoritative Parent Center Hub Minnesota leaf, which explicitly labels `Minnesota PTI` and names PACER Center with direct contact details.
