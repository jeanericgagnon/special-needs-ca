# Batch 265 Idaho County-Bearing Sitemap Exhaustion Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: reviewed_district_special_services_leaves_hold_at_12_counties_and_remaining_county_bearing_sitemaps_expose_no_role_slug

## Evidence

- Reviewed 2026-06-22 one more bounded official Idaho district-root exhaustion pass starting from the public Idaho SDE district JSON and still-uncovered county-bearing district hosts. Bear Lake County District #33, Camas County District #121, Clark County District #161, Fremont County Joint District #215, Jefferson County Joint District #251, Oneida County District #351, and Shoshone Joint District #312 all stayed publicly reachable on district-owned roots. But Bear Lake exposed zero role-bearing sitemap slugs, Camas and Clark returned 404 on sitemap.xml, Fremont returned only a non-role `student-enrollment` sitemap hit, Jefferson returned HTTP 406 on sitemap.xml, Oneida redirected the sitemap request back to the district root with no exact role slug, and Shoshone exposed a WordPress sitemap with zero `special`, `services`, `student`, or `504` slugs. Idaho education therefore still holds at twelve reviewed county-level district-owned leaves while this bounded county-bearing root/sitemap subset is now exhausted without a new exact role leaf.

## Repair decision

- Idaho remains blocked and not index-safe.
- Education still holds at twelve reviewed county-level district-owned leaves.
- The bounded root/sitemap lane is now exhausted for seven additional county-bearing district hosts without producing a new exact role-bearing leaf.
