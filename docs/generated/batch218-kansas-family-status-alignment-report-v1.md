# Kansas Family Status Alignment Report v1

- state: kansas
- aligned_family: district_or_county_education_routing
- previous_stale_status: blocked_live_ksde_directory_roots_without_local_contract
- aligned_status: blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade

This pass fixes a stale summary-only blocker shape. Kansas is still BLOCKED and not index-safe, but the summary now matches the current packet truth: the state is past a root-only education blocker and already has a small set of reviewed district-owned leaves on disk.

