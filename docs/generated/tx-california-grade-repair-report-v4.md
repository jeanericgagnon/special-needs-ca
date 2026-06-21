# Texas California-Grade Repair Report v4

This v4 pass keeps the hardened county gate and applies a stricter district-grade education rule: only direct, live district education evidence counts for PASS.

## Result history

- v1: PASS 254, PARTIAL 0, BLOCKED 0
- v2: PASS 0, PARTIAL 0, BLOCKED 254
- v3: PASS 254, PARTIAL 0, BLOCKED 0
- v4: PASS 10, PARTIAL 244, BLOCKED 0

## What changed in v4

- Direct district-grade education evidence is now required for PASS.
- ESC fallback, county fallback, and TEA fallback education rows no longer satisfy California-grade PASS.
- LIDDA, ECI, HHS, statewide legal/PTI/ABLE evidence remains as repaired in v3.

## Strict education breakdown

- Direct live district-grade counties: 10
- Fallback or non-district education counties: 244

## County status

- Counties still below California-grade: 244
- Texas is index-safe: no

## Exact next actions

- Parse direct district-grade Texas education routes for remaining counties: 244 counties still rely on ESC/TEA fallback rather than live district-grade evidence.
- Keep Texas county pages gated and noindex: Texas is not California-grade under the stricter district-grade bar.

## Standard applied

- PASS requires verified LIDDA, verified ECI, verified Medicaid/HHS, statewide legal/PTI/ABLE, and a direct live district-grade education route.
- PARTIAL means the official skeleton exists but the education layer is still fallback-grade.
- BLOCKED is reserved for counties missing core official routing outside education fallback.
