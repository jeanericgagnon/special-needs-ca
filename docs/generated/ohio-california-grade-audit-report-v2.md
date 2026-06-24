# Ohio California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 88
- primary_gap_reason: live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_inventory_still_root_only (Only 4 distinct Ohio school-district source URLs on disk preserve path-level leaf signal, covering 8 county rows, while 49 distinct URLs remain root-only.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed verified OOD program evidence already exists in the Ohio program spine and satisfies the statewide VR / Pre-ETS gate.)
- protection_and_advocacy: verified_state_grade (Accepted first-party Disability Rights Ohio evidence is already present on disk and satisfies the statewide P&A gate.)
- parent_training_information_center: verified_state_grade (Reviewed verified OCECD nonprofit evidence already exists in the database and satisfies the statewide PTI gate.)
- legal_aid: verified_state_grade (Ohio Legal Help now provides reviewed Ohio-specific statewide legal-help routing from a first-party portal.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_root_and_sitemap_family_with_dead_directory_and_sample_cdjfs_leafs (Ohio JFS, Medicaid, and Ohio.gov roots plus robots and sitemaps are publicly live again, but the rendered county-directory page, search page, JFS local-agencies root, and sampled `cdjfs-*` county leaves still render public 404 pages, so the county-local contract remains unverified.)

## Failure ledger

- county_local_disability_resources: live_root_robots_and_sitemap_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404 :: Reviewed 2026-06-24 one more bounded live official Ohio county-local pass after the earlier stale-root blocker. The official discovery family is now publicly alive again, so the old 404-at-root claim is no longer true: `https://jfs.ohio.gov/`, `https://medicaid.ohio.gov/`, and `https://ohio.gov/` all return HTTP 200, `robots.txt` now returns HTTP 200 on each host family, and `https://jfs.ohio.gov/sitemap.xml`, `https://medicaid.ohio.gov/sitemap.xml`, and `https://ohio.gov/sitemap.xml` are all publicly reviewable. The live JFS sitemap is materially stronger than before because it now advertises 98 `cdjfs-*` local-agency-directory URLs spanning 88 distinct county slugs. But the rendered county-office lane still fails closed: the current `https://ohio.gov/residents/resources/job-family-services-directory` page renders a public `404 Error Page`, the live `https://ohio.gov/search?query=county%20job%20and%20family%20services` page also renders the same public 404, the parent `https://jfs.ohio.gov/about/local-agencies-directory` root renders a public 404, and sampled exact county leaves such as `https://jfs.ohio.gov/about/local-agencies-directory/cdjfs-adams`, `.../cdjfs-cuyahoga-3`, and `.../cdjfs-wood` each render the same public 404 page. This means Ohio no longer lacks official roots or discovery surfaces; instead, it now has a live but stale discovery family whose rendered county-directory pages still do not materialize a reviewable county-local office contract. The county-local blocker therefore remains, but with corrected live-root evidence rather than stale all-root 404 claims.
- district_or_county_education_routing: education_inventory_still_mostly_root_only_after_bounded_leaf_review :: Reviewed 2026-06-23 Ohio school_district source inventory from disk. Only 4 distinct source URLs still preserve any path-level leaf signal, covering just 8 county rows total, while 49 distinct URLs remain generic roots only. The leaf-like URLs are https://www.npesc.org/vnews/display.v/SEC/Member%20%26%20Partner%20School%20Districts, https://www.scoesc.org/districts, https://www.wbesc.org/our-schools, https://www.mresc.org/districts-we-serve/; that is still not enough county-grade coverage to truthfully clear district_or_county_education_routing statewide.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://dodd.ohio.gov/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://ohioearlyintervention.org/
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.allencountyesc.org
- district_or_county_education_routing: blocked_exact_leaf_inventory_still_root_only; samples=6; first=https://www.youresc.k12.oh.us/special-education-student-services/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ood.ohio.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsohio.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.ocecd.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ohiolegalhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.stableaccount.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: blocked_live_root_and_sitemap_family_with_dead_directory_and_sample_cdjfs_leafs; samples=8; first=https://jfs.ohio.gov/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_live_rendered_ohio_county_directory_or_new_public_county_jfs_successor_leaf_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_more_exact_district_or_esc_leaf_targets_are_authored

## Ohio final blocker decision

- County-local disability resources remain blocked, but the blocker changed shape: the official roots, robots, and sitemaps are live again.
- The current rendered Ohio county-directory lane still fails closed: the `job-family-services-directory` page, Ohio search results page, JFS `about/local-agencies-directory` root, and sampled `cdjfs-*` county leaves all render public 404 pages.
- The live JFS sitemap is now discovery evidence only. It advertises 98 `cdjfs-*` entries across 88 county slugs, but those sitemap URLs are not self-proving because sampled rendered leaves remain dead.
- District or county education routing remains blocked because only a small exact-leaf inventory is on disk and most surviving education URLs are still root-only.
- Ohio is still truthfully BLOCKED and not index-safe.
