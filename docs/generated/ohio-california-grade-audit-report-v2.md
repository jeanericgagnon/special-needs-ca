# Ohio California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 88
- primary_gap_reason: official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only

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
- county_local_disability_resources: blocked_retired_official_county_family_and_dead_public_search_surfaces (The retired Ohio JFS county-office family now fails at the root/discovery level too: official JFS, Medicaid, and Ohio.gov roots plus robots/sitemaps all return 404, so no live county-office successor contract is verified.)

## Failure ledger

- county_local_disability_resources: official_root_and_discovery_surfaces_all_404_after_county_directory_retirement :: Reviewed 2026-06-23 one more bounded live official Ohio county-local pass after the earlier JFS retirement finding. The blocker is now stronger than dead guessed county-directory paths alone: in the current repo-side verification lane, even the official root and discovery surfaces fail closed. `https://jfs.ohio.gov/`, `https://medicaid.ohio.gov/`, and `https://ohio.gov/` all return HTTP 404, and the same is true for `robots.txt` and `sitemap.xml` on each host family. The already-tried legacy and guessed county-directory paths remain dead as well, including `https://jfs.ohio.gov/home/local-agencies-directory`, `https://medicaid.ohio.gov/families-and-individuals/county-agencies`, `https://medicaid.ohio.gov/resources/county-agencies`, and `https://ohio.gov/residents/resources/job-family-services-directory`, all of which still return HTTP 404. This means the blocker is no longer just that a county-office page moved; the bounded lane currently has no live official JFS, Medicaid, or Ohio.gov root/discovery contract from which to verify a county-office successor. The DOI-hosted county dataset therefore remains planning evidence only.
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
- county_local_disability_resources: blocked_retired_official_county_family_and_dead_public_search_surfaces; samples=6; first=https://jfs.ohio.gov/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_new_live_official_ohio_county_directory_locator_or_search_index_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_more_exact_district_or_esc_leaf_targets_are_authored

## Ohio final blocker decision

- County-local disability resources remain blocked because the retired county-office family now fails at the root/discovery level as well: the official JFS, Medicaid, and Ohio.gov roots plus their `robots.txt` and `sitemap.xml` surfaces all return 404 in the bounded lane.
- The legacy county-directory guesses remain dead, so there is still no live official county-office successor contract to verify.
- District or county education routing remains blocked because only a small exact-leaf inventory is on disk and most surviving education URLs are still root-only.
- Ohio is still truthfully BLOCKED and not index-safe.
