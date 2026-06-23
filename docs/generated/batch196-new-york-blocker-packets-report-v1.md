# New York Blocker Packets v3

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
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
- parent_training_information_center: blocked_reviewed_regional_source_not_statewide (Reviewed 2026-06-23 the saved New York PTI evidence. The only reviewed first-party PTI candidate still on disk is Parent Network of WNY, and its scope language is explicitly Western New York rather than statewide. New York therefore remains blocked on statewide PTI scope proof, not on generic parent-support discovery.)
- legal_aid: verified_state_grade (LawHelpNY now provides reviewed New York statewide legal-help routing from a first-party portal with county-based resource lookup.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_health_hostwide_403 (Reviewed 2026-06-23 the current New York county-local blocker surfaces. The official health.ny.gov Medicaid lane is blocked host-wide, not just at one LDSS page: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all returned HTTP 403 in the bounded lane. The old county rows that still point at `ldss.htm` therefore cannot remain as sample proof; only the blocked official host family can truthfully anchor this blocker until a public replacement locator or county-owned directory is verified.)

## Failure ledger

- county_local_disability_resources: bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement :: Reviewed 2026-06-23 the current New York county-local blocker surfaces. The official health.ny.gov Medicaid lane is blocked host-wide, not just at one LDSS page: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all returned HTTP 403 in the bounded lane. The old county rows that still point at `ldss.htm` therefore cannot remain as sample proof; only the blocked official host family can truthfully anchor this blocker until a public replacement locator or county-owned directory is verified.
- district_or_county_education_routing: bounded_boces_leaf_packet_exhausted_before_county_grade_coverage :: Reviewed 2026-06-23 the current New York education blocker packet. Verified exact leaves still stop at only three BOCES-owned pages on CA BOCES, Capital Region BOCES, and Broome-Tioga BOCES. That bounded exact-leaf set is useful, but it is still far short of county-grade routing across all 62 New York counties, so the family remains blocked on broader local-leaf authoring rather than on statewide evidence.
- parent_training_information_center: reviewed_western_new_york_pti_source_not_statewide :: Reviewed 2026-06-23 the saved New York PTI evidence. The only reviewed first-party PTI candidate still on disk is Parent Network of WNY, and its scope language is explicitly Western New York rather than statewide. New York therefore remains blocked on statewide PTI scope proof, not on generic parent-support discovery.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://opwdd.ny.gov/services-support/home-community-based-services-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://opwdd.ny.gov/get-started/front-door
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.btboces.org
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=3; first=https://caboces.org/education/exceptional-education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drny.org/
- parent_training_information_center: blocked_reviewed_regional_source_not_statewide; samples=1; first=http://parentnetworkwny.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.lawhelpny.org/
- able_program: verified_state_grade; samples=1; first=https://www.mynyable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.health.ny.gov/health_care/medicaid/redesign/cdpap.htm
- county_local_disability_resources: blocked_health_hostwide_403; samples=5; first=https://www.health.ny.gov/health_care/medicaid/ldss.htm

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_health_ny_ldss_replacement_or_county_owned_locator_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored
- [major] parent_training_information_center: hold_blocked_until_reviewed_statewide_new_york_pti_source_or_statewide_scope_proof_is_verified

## Packetized blockers

- `county_local_disability_resources` now preserves the blocked `health.ny.gov` host family itself instead of reusing stale `ldss.htm` county rows as if they were live proof.
- `district_or_county_education_routing` now preserves the exact three-leaf BOCES ceiling as an authoring packet rather than implying broader county coverage.
- `parent_training_information_center` now preserves the regional-scope PTI blocker as a scope packet rather than a generic source gap.

## Completion decision

- New York remains `BLOCKED` and `index_safe=false`.
- County-local remains blocked on a host-wide official 403 plus zero reviewed replacement locators.
- Education remains blocked because three exact BOCES leaves are not enough for 62-county coverage.
- PTI remains blocked because the reviewed first-party source is regional, not statewide.
