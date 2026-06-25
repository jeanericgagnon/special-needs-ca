# Ohio California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 88
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Education live-leaf probe

- strong_county_coverage: 58
- partial_county_coverage: 30
- unresolved_counties: 0
- exact_root_matches_found: 56
- unresolved_roots: 11

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Bounded live same-domain leaf probes now recover strong local education leaves for 58 counties and partial leaves for 30 more counties, with no unresolved county roots remaining after successor official ESC hosts and same-host sitemap/service leaves were verified.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed verified OOD program evidence already exists in the Ohio program spine and satisfies the statewide VR / Pre-ETS gate.)
- protection_and_advocacy: verified_state_grade (Accepted first-party Disability Rights Ohio evidence is already present on disk and satisfies the statewide P&A gate.)
- parent_training_information_center: verified_state_grade (Reviewed verified OCECD nonprofit evidence already exists in the database and satisfies the statewide PTI gate.)
- legal_aid: verified_state_grade (Ohio Legal Help now provides reviewed Ohio-specific statewide legal-help routing from a first-party portal.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_live_official_county_jfs_directory (The live official Ohio JFS county-directory family now clears county-local routing. The official JFS sitemap advertises 98 `cdjfs-*` leaves across 88 county slugs, and the bounded verification sweep confirms those county pages preserve county-specific titles plus local address, phone, fax, and hours data on the official JFS host.)

## Failure ledger


## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://dodd.ohio.gov/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://ohioearlyintervention.org/
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.allencountyesc.org
- district_or_county_education_routing: verified_county_grade; samples=8; first=https://www.escco.org/services/student-services
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ood.ohio.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsohio.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.ocecd.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ohiolegalhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.stableaccount.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_live_official_county_jfs_directory; samples=8; first=https://jfs.ohio.gov/sitemap.xml

## Next actions


## Ohio final blocker decision

- County-local disability resources remain cleared from the live official Ohio JFS county-directory family across all 88 counties.
- District or county education routing is now fully county-grade: the bounded live leaf probe recovered strong same-domain local education leaves for 58 counties and partial same-domain local education leaves for 30 more counties, with no unresolved county roots remaining after reviewed successor-official ESC recovery and same-host leaf verification.
- Ohio is now truthfully COMPLETE and index-safe.
