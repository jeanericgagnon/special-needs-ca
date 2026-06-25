# Batch 360 Idaho Numeric 504 False-Positive Finality v1

- state: idaho
- classification: BLOCKED
- blocker_family: district_or_county_education_routing

## What changed

- Rechecked the four remaining live Idaho district hosts with one bounded root plus robots/sitemap pass.
- Confirmed that none of those public surfaces materialized a same-host special-education, student-services, 504, Child Find, or procedural-safeguards leaf.
- Tightened the last ambiguous root-level `504` hits on Camas and Shoshone: they are text noise, not recoverable routing evidence.

## Evidence

- `https://www.camascountyschools.org/` stayed live, but the only root-level `504` hit was a numeric token sequence in the raw page text rather than a same-host 504 link or education leaf.
- `https://shoshonesd.org/` stayed live, but the only `504` root hit came from SVG/path markup numbers rather than a district-owned 504 or special-education leaf.
- `https://www.clarkcountyschools161.org/` and `https://www.sd215.net/` also stayed live, and their public root/sitemap surfaces still exposed no role-bearing education URLs.

## Repair decision

- Idaho remains BLOCKED and not index-safe.
- The highest-priority blocker is still the residual district-routing remainder on Camas, Clark, Fremont, and Shoshone.
- This pass removes one more false-positive lane: bare `504` text on a root page does not count unless it materializes a same-host role-bearing leaf or document.
