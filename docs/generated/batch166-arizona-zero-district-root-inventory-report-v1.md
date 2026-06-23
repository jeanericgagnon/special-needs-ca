# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: zero_district_root_inventory_and_ahcccs_sitemap_exposes_no_county_office_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_zero_local_root_inventory_before_leaf_authoring (Arizona education remains blocked because the official AZED host is challenge-blocked and the current packet still has no runnable local root inventory: all 15 live county rows and all 15 staging rows point to statewide Arizona education placeholders instead of district-owned domains. The next honest lane is county-keyed district-root authoring first, then district-owned special-education leaf authoring.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract (Arizona county-local routing remains blocked because the accessible AHCCCS host proves real ALTCS offices and a partially parseable county map, but still exposes no county-to-office contract. DES remains fully challenged, so the county packet should stay evidence-only rather than inviting new DES or generic office-locator guesses.)

## Failure ledger

- district_or_county_education_routing: no_district_owned_arizona_root_inventory_exists_in_live_or_staging_packet :: Reviewed 2026-06-22 current Arizona education blocker artifacts, the live school_districts DB rows, the staging_scraped_school_districts rows, and the on-disk district packet. All 15 live Arizona school_district rows still point at the same statewide AZED fallback source https://www.azed.gov/specialeducation, while the 13 Arizona staging rows still point at the older statewide placeholder https://www.education.arizona.gov. Neither inventory preserves a single district-owned Arizona root domain, and the packet still reports authoredExactLeafCount=0. Because the official AZED root, likely replacement leaves, robots.txt, and sitemap.xml are all challenge-blocked, Arizona cannot jump straight to district-owned leaf verification yet; it first needs county-keyed district-root authoring from outside the challenged AZED host.
- county_local_disability_resources: ahcccs_accessible_host_exposes_only_county_map_and_support_letters_no_office_contract :: Reviewed 2026-06-22 current Arizona county-local blocker artifacts plus the live county_offices DB rows and the on-disk county packet. Fourteen county rows still depend on DOI placeholders and one still uses the generic legacy locator root. The accessible AHCCCS host preserves the ALTCS Offices page, AHCCCS Contacts page, ALTCS member resource page, and the partially parseable ALTCS county map PDF, but none of those artifacts names a county-to-office assignment contract. DES remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator guesses. Arizona county-local routing therefore should stay blocked until an official county-to-office contract appears, not reopen on more DES guessing.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_zero_local_root_inventory_before_leaf_authoring; samples=4; first=https://www.azed.gov/specialeducation
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract; samples=9; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: author_county_keyed_district_owned_root_inventory_then_exact_special_education_leaves
- [critical] county_local_disability_resources: hold_blocked_until_reviewable_ahcccs_or_des_county_to_office_contract_exists

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education is now sharpened one step further: this is not yet a runnable district-leaf queue because neither live nor staging inventory preserves any district-owned Arizona roots.
- That means the next honest education lane is county-keyed district-root authoring first, then exact district-owned special-education or student-services leaves.
- County-local is still blocked on a missing official county-to-office contract, so Arizona still cannot complete until both a real district-root inventory and a real AHCCCS or DES county contract exist on reviewable official surfaces.

