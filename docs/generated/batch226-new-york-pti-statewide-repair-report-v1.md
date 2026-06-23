# New York Blocker Packets v4

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 62
- primary_gap_reason: bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed 2026-06-23 the current New York education blocker packet. Verified exact leaves still stop at only three BOCES-owned pages on CA BOCES, Capital Region BOCES, and Broome-Tioga BOCES. That bounded exact-leaf set is useful, but it is still far short of county-grade routing across all 62 New York counties, so the family remains blocked on broader local-leaf authoring rather than on statewide evidence.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed verified ACCES-VR program evidence already exists in the New York program spine and satisfies the statewide VR / Pre-ETS gate.)
- protection_and_advocacy: verified_state_grade (Accepted first-party Disability Rights New York evidence is already present on disk and satisfies the statewide P&A gate.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-23 the authoritative Parent Center Hub New York leaf plus the listed first-party Starbridge host. `https://www.parentcenterhub.org/findurcenter/new-york/` explicitly says `There are 5 PTIs serving New York State` and then lists Starbridge, Advocates for Children of New York, INCLUDEnyc, Sinergia/Metropolitan Parent Center, and Long Island Advocacy Center with their service areas. The listed Starbridge host also resolves live at `https://starbridgeinc.org/`, so New York now has reviewed authoritative statewide PTI coverage rather than only the old Western New York regional blocker.)
- legal_aid: verified_state_grade (LawHelpNY now provides reviewed New York statewide legal-help routing from a first-party portal with county-based resource lookup.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_health_hostwide_403 (Reviewed 2026-06-23 the current New York county-local blocker surfaces. The official health.ny.gov Medicaid lane is blocked host-wide, not just at one LDSS page: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all returned HTTP 403 in the bounded lane. The old county rows that still point at `ldss.htm` therefore cannot remain as sample proof; only the blocked official host family can truthfully anchor this blocker until a public replacement locator or county-owned directory is verified.)

## Failure ledger

- county_local_disability_resources: bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement :: Reviewed 2026-06-23 the current New York county-local blocker surfaces. The official health.ny.gov Medicaid lane is blocked host-wide, not just at one LDSS page: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all returned HTTP 403 in the bounded lane. The old county rows that still point at `ldss.htm` therefore cannot remain as sample proof; only the blocked official host family can truthfully anchor this blocker until a public replacement locator or county-owned directory is verified.
- district_or_county_education_routing: bounded_boces_leaf_packet_exhausted_before_county_grade_coverage :: Reviewed 2026-06-23 the current New York education blocker packet. Verified exact leaves still stop at only three BOCES-owned pages on CA BOCES, Capital Region BOCES, and Broome-Tioga BOCES. That bounded exact-leaf set is useful, but it is still far short of county-grade routing across all 62 New York counties, so the family remains blocked on broader local-leaf authoring rather than on statewide evidence.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://opwdd.ny.gov/services-support/home-community-based-services-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://opwdd.ny.gov/get-started/front-door
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.btboces.org
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=3; first=https://caboces.org/education/exceptional-education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drny.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.parentcenterhub.org/findurcenter/new-york/
- legal_aid: verified_state_grade; samples=1; first=https://www.lawhelpny.org/
- able_program: verified_state_grade; samples=1; first=https://www.mynyable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.health.ny.gov/health_care/medicaid/redesign/cdpap.htm
- county_local_disability_resources: blocked_health_hostwide_403; samples=5; first=https://www.health.ny.gov/health_care/medicaid/ldss.htm

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_health_ny_ldss_replacement_or_county_owned_locator_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored

## PTI repair

- `parent_training_information_center` is now verified from the authoritative Parent Center Hub New York state leaf plus the live listed first-party Starbridge host.
- The authoritative leaf explicitly says `There are 5 PTIs serving New York State`, so the PTI gate is now statewide by reviewed coverage split rather than blocked on one regional center.

## Completion decision

- New York remains `BLOCKED` and `index_safe=false`.
- County-local remains blocked on a host-wide official 403 plus zero reviewed replacement locators.
- Education remains blocked because three exact BOCES leaves are not enough for 62-county coverage.
- PTI is no longer a blocker.
