# Batch 266 Massachusetts City/Town Finder No County Contract Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: exact_dese_hidden_postback_replay_and_live_city_town_finder_still_do_not_expose_county_grade_local_rows

## Evidence

- Reviewed 2026-06-23 one more bounded official Massachusetts DESE surface after the hidden-postback replay failed. https://profiles.doe.mass.edu/search/get_closest_orgs.aspx returned HTTP 200 as a live official School Finder page. Its rendered HTML explicitly asks users to enter an address, city or town, and distance, and it preserves superintendent and address-oriented local search behavior. But the raw page contains zero `county` or `Counties` occurrences, no county selector, and no export or mailing-label lane. Combined with the earlier finding that https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238 now only replays to the generic `Profiles Search` shell with zero local rows, Massachusetts still lacks any reusable official county-grade DESE route in the low-token lane.

## Repair decision

- Massachusetts remains blocked and not index-safe.
- One more bounded official DESE pass found a live School Finder, but it is only address/city/town based and still does not expose a county contract or export lane.
- The hidden district-directory replay still does not materialize local rows, so the official education lane remains source-final for low-token work.
