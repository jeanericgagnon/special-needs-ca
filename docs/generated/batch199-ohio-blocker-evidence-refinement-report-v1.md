# Ohio California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 88
- primary_gap_reason: retired_official_county_family_no_live_successor_and_education_inventory_still_root_only

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
- county_local_disability_resources: blocked_retired_official_county_family (The retired Ohio JFS county-office family still has no live official successor on the legacy JFS host, guessed JFS child locator path, Medicaid-host guesses, or Ohio.gov resident-resource guess.)

## Failure ledger

- county_local_disability_resources: retired_official_county_family_no_live_successor_verified :: Reviewed 2026-06-23 bounded live official successor-path checks after the earlier JFS retirement finding. Legacy and guessed successor pages all resolved to the same dead family: https://jfs.ohio.gov/home/local-agencies-directory => HTTP 404; https://jfs.ohio.gov/home/local-agencies-directory/ => HTTP 404; https://medicaid.ohio.gov/families-and-individuals/county-agencies => HTTP 404; https://medicaid.ohio.gov/families-and-individuals/county-agencies/ => HTTP 404; https://medicaid.ohio.gov/resources/county-agencies => HTTP 404; https://medicaid.ohio.gov/resources/county-agencies/ => HTTP 404; https://ohio.gov/residents/resources/job-family-services-directory => HTTP 404; https://ohio.gov/residents/resources/job-family-services-directory/ => HTTP 404. This adds eight more 404 confirmations on top of the prior jfs.ohio.gov root/sitemap/robots and NXDOMAIN checks for odjfs.ohio.gov and jobandfamilyservices.ohio.gov, so the remaining DOI-hosted county dataset is still planning evidence only and no live official county-office directory or locator is verified.
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
- county_local_disability_resources: blocked_retired_official_county_family; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_new_live_official_ohio_county_directory_or_locator_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_more_exact_district_or_esc_leaf_targets_are_authored

## Ohio final blocker decision

- County-local disability resources remain blocked because the retired Ohio JFS family still has no live official successor: the legacy root/path failures remain in place, the guessed JFS child locator path now also returns 404, the guessed Medicaid-host county-agency paths return 404, and an Ohio.gov resident-resource guess also returns 404.
- District or county education routing remains blocked because only 4 distinct Ohio school-district source URLs on disk preserve path-level leaf signal, covering just 8 county rows, while 49 distinct URLs remain root-only.
- Ohio is still truthfully BLOCKED and not index-safe.
