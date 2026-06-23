# Batch 251 Idaho Education Sample Dedupe Report v1

- classification: BLOCKED
- index_safe: false
- family updated: district_or_county_education_routing

## What changed

- Removed duplicate Blaine County education samples from the live Idaho verified-sources artifact.
- Recomputed the verified education sample count from the deduped sample array so the live report matches the actual reviewed evidence set.

## Result

- Idaho remains BLOCKED and index_safe=false.
- The Idaho education blocker is unchanged in substance: eleven reviewed district-owned leaves are preserved, but county-grade coverage is still incomplete.
