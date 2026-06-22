# Ohio California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 88
- primary_gap_reason: official_jfs_root_domain_retired_and_replacement_domains_unresolved

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed ESC-owned education exact leaves verified (6) across 8 bounded Ohio packet roots, but district-grade coverage still cannot be proven for all 88 counties from the authored exact targets.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed verified OOD program evidence already exists in the Ohio program spine and satisfies the statewide VR / Pre-ETS gate.)
- protection_and_advocacy: verified_state_grade (Accepted first-party Disability Rights Ohio evidence is already present on disk and satisfies the statewide P&A gate.)
- parent_training_information_center: verified_state_grade (Reviewed verified OCECD nonprofit evidence already exists in the database and satisfies the statewide PTI gate.)
- legal_aid: verified_state_grade (Ohio Legal Help now provides reviewed Ohio-specific statewide legal-help routing from a first-party portal.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_retired_official_county_domain_family (The live official Ohio county-office family is now a root-retirement blocker, not just a stale PDF path. jfs.ohio.gov returns HTTP 404 across the root, sitemap, robots, county directory, and county-agencies paths, while the obvious odjfs.ohio.gov and jobandfamilyservices.ohio.gov replacement domains do not resolve.)

## Failure ledger

- county_local_disability_resources: official_jfs_root_domain_retired_and_replacement_domains_unresolved :: Reviewed 2026-06-22 bounded live official checks on https://jfs.ohio.gov/, https://jfs.ohio.gov/sitemap.xml, https://jfs.ohio.gov/robots.txt, https://jfs.ohio.gov/county-agencies, https://jfs.ohio.gov/county/, https://jfs.ohio.gov/county/county_directory.pdf, https://jfs.ohio.gov/wps/portal/gov/jfs/, and https://jfs.ohio.gov/wps/portal/gov/jfs/county-agencies. All jfs.ohio.gov roots returned HTTP 404, while the obvious replacement authority domains https://odjfs.ohio.gov/ and https://jobandfamilyservices.ohio.gov/ failed DNS resolution. The remaining DOI-hosted county dataset is therefore planning evidence only, and no live official county-office directory or locator was verified in this bounded pass.
- district_or_county_education_routing: bounded_esc_leaf_packet_exhausted_before_county_grade_coverage :: Verified exact leaves remain limited to 6 reviewed ESC-owned pages across 8 bounded Ohio packet roots (soesc.org, allencountyesc.org, youresc.k12.oh.us, ashtabulaesc.org, athensmeigs.com, auglaizeesc.org, ecoesc.org, brown.k12.oh.us); this does not truthfully prove district-grade routing statewide.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://dodd.ohio.gov/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://ohioearlyintervention.org/
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.allencountyesc.org
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=6; first=https://www.youresc.k12.oh.us/special-education-student-services/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ood.ohio.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsohio.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.ocecd.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ohiolegalhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.stableaccount.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: blocked_retired_official_county_domain_family; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_new_live_official_ohio_county_directory_or_locator_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored

## Ohio final blocker decision

- County-local disability resources remain blocked because the live official Ohio JFS county-directory family now looks retired at the domain level: the root and all bounded child paths return 404, while the obvious replacement domains do not resolve.
- District or county education routing remains blocked because only 6 reviewed ESC-owned exact leaves across 8 bounded Ohio packet roots have been verified; that is not enough to truthfully prove district-grade routing across all 88 Ohio counties without reopening broader district authoring.
- Ohio is therefore truthfully final-blocked and not index-safe until a new live official county-office directory or locator is verified and new exact district-owned education leaves are authored.
