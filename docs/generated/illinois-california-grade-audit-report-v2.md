# Illinois California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 102
- primary_gap_reason: bounded_roe_leaf_packet_exhausted_before_county_grade_coverage

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed ROE-owned education exact leaves verified (3), but district-grade coverage still cannot be proven for all 102 counties from the authored exact targets.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Illinois DRS Services is already present as reviewed official statewide VR routing evidence.)
- protection_and_advocacy: verified_state_grade (Equip for Equality is already present as reviewed first-party statewide P&A evidence.)
- parent_training_information_center: verified_state_grade (Reviewed current first-party successor pages now preserve statewide Illinois PTI designation. FRCD states it no longer holds the Illinois PTIC role as of October 1, 2025, and Family Matters PTIC states it is the only federally funded Parent Training and Information Center in Illinois and now covers the entire state.)
- legal_aid: verified_state_grade (Illinois Legal Aid Online now provides reviewed Illinois statewide legal-help routing from a first-party portal.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Official IDHS Office Locator replaced the dead county-office page and now serves as the verified county/local routing surface.)

## Failure ledger

- district_or_county_education_routing: bounded_roe_leaf_packet_exhausted_before_county_grade_coverage :: Verified exact leaves remain limited to 3 reviewed ROE-owned pages; this does not truthfully prove district-grade routing statewide.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=29737
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=47257
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=31182
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.dhs.state.il.us/page.aspx?item=31183
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.roe1.net
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=3; first=https://www.roe1.net/about-us/contact-us/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dhs.state.il.us/page.aspx?item=29737
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.equipforequality.org
- parent_training_information_center: verified_state_grade; samples=2; first=https://frcd.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.illinoislegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://illinoisable.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=1; first=https://www.dhs.state.il.us/page.aspx?item=26210

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored

## Illinois final blocker decision

- Parent training information center is now repaired: FRCD explicitly states it no longer holds the Illinois PTIC role as of October 1, 2025, and Family Matters PTIC now states on its own first-party site that it is the only federally funded Parent Training and Information Center in Illinois and covers the entire state.
- District or county education routing remains the only blocker because the reviewed exact ROE-owned leaves still cover only a small bounded subset and do not truthfully prove district-grade routing across all 102 Illinois counties.
- Illinois therefore remains BLOCKED and not index-safe until district-grade education leaves expand beyond the current bounded ROE set.
