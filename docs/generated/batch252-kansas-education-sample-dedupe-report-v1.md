# Batch 252 Kansas Education Sample Dedupe Report v1

- classification: BLOCKED
- index_safe: false
- family updated: district_or_county_education_routing

## What changed

- Removed repeated Atchison, Butler, Douglas, Finney, Johnson, and Shawnee district-owned sample rows from the live Kansas verified-sources artifact.
- Recomputed the verified education sample count from the deduped sample array so the live report matches the actual seven reviewed district-owned leaves plus the explicit non-matching probes.

## Result

- Kansas remains BLOCKED and index_safe=false.
- The Kansas education blocker is unchanged in substance: seven reviewed district-owned leaves are preserved, but county-grade education coverage is still incomplete across the 105-county packet.
