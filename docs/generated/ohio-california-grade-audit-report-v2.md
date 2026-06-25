# Ohio California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 88
- primary_gap_reason: bounded_live_ohio_education_leaf_probe_recovers_51_strong_and_24_partial_counties_but_13_counties_still_unresolved

## Education live-leaf probe

- strong_county_coverage: 51
- partial_county_coverage: 24
- unresolved_counties: 13
- exact_root_matches_found: 44
- unresolved_roots: 23

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_exact_leaf_probe_partial_county_coverage (Bounded live same-domain leaf probes now recover strong local education leaves for 51 counties and partial leaves for 24 more counties, but 13 counties still point to dead, unresolvable, transport-broken, or no-leaf roots.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed verified OOD program evidence already exists in the Ohio program spine and satisfies the statewide VR / Pre-ETS gate.)
- protection_and_advocacy: verified_state_grade (Accepted first-party Disability Rights Ohio evidence is already present on disk and satisfies the statewide P&A gate.)
- parent_training_information_center: verified_state_grade (Reviewed verified OCECD nonprofit evidence already exists in the database and satisfies the statewide PTI gate.)
- legal_aid: verified_state_grade (Ohio Legal Help now provides reviewed Ohio-specific statewide legal-help routing from a first-party portal.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_live_official_county_jfs_directory (The live official Ohio JFS county-directory family now clears county-local routing. The official JFS sitemap advertises 98 `cdjfs-*` leaves across 88 county slugs, and the bounded verification sweep confirms those county pages preserve county-specific titles plus local address, phone, fax, and hours data on the official JFS host.)

## Failure ledger

- district_or_county_education_routing: bounded_live_education_leaf_probe_partial_county_coverage :: Reviewed 2026-06-24 bounded live same-domain education leaf probes across 67 saved Ohio district or ESC roots. Exact local education leaves now verify strong county-grade routing for 51 counties and partial local routing for 24 more counties, but 13 counties still point to dead, unresolvable, transport-broken, or no-leaf roots (brown-oh => https://www.brown.k12.oh.us; clermont-oh => https://www.ccesc.org; columbiana-oh => https://www.ccesc.k12.oh.us; darke-oh => https://www.darkeesc.org; fairfield-oh => https://www.fairfieldesc.org; gallia-oh => https://www.gvesc.org; lawrence-oh => https://www.lawrenceesc.org; medina-oh => https://www.medina-esc.org; mercer-oh => https://www.merceresc.org; preble-oh => https://www.preblecountyesc.org; putnam-oh => https://www.putnamesc.org; trumbull-oh => https://www.trumbull.k12.oh.us; …).

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://dodd.ohio.gov/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://ohioearlyintervention.org/
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.allencountyesc.org
- district_or_county_education_routing: blocked_live_exact_leaf_probe_partial_county_coverage; samples=8; first=https://www.escco.org/services/student-services
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ood.ohio.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsohio.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.ocecd.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ohiolegalhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.stableaccount.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_live_official_county_jfs_directory; samples=8; first=https://jfs.ohio.gov/sitemap.xml

## Next actions

- [critical] district_or_county_education_routing: author_or_verify_exact_local_education_leaves_for_remaining_13_counties_or_keep_ohio_blocked

## Ohio final blocker decision

- County-local disability resources remain cleared from the live official Ohio JFS county-directory family across all 88 counties.
- District or county education routing improved, but is still blocked: the bounded live leaf probe recovered strong same-domain local education leaves for 51 counties and partial same-domain local education leaves for 24 more counties, while 13 counties still point to dead, unresolvable, transport-broken, or no-leaf roots.
- Ohio is still truthfully BLOCKED and not index-safe.
