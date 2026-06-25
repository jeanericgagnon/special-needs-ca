# Wisconsin California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 72
- primary_gap_reason: official_dpi_directory_and_cesa_network_are_public_but_no_reviewed_statewide_county_to_region_or_special_education_crosswalk_is_preserved_on_disk

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_directory_and_cesa_network_without_reviewable_county_or_special_education_crosswalk (Reviewed 2026-06-25 one more bounded official education-routing pass. DPI publishes a live official `Cooperative Educational Service Agency (CESA)` page with current CESA contacts, district counts, and links to all 12 CESA agency websites. DPI also publishes a live official `School Directory: Your Source for School Directory Data` page that links families to the `School Directory Public Portal`, and the reviewed public portal client assets preserve county and CESA filter surfaces. Multiple live first-party CESA sites further preserve district-owned navigation such as `Member Districts`, `Districts`, and `CESA 4 School Districts`, showing a real public regional network exists. But this pass still did not preserve a single reviewed statewide county-to-CESA contract, exported district list with county and CESA fields, or district-owned special-education crosswalk on disk. Because the current proof stops at portal and network structure instead of a reviewable statewide routing contract, Wisconsin education routing remains blocked.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 live first-party WI FACETS pages. The current staff page says Nelsinia Ramos is `Co-Director of the Wisconsin Parent Training and Information Center, which the U.S. Department of Education funds`, and says Courtney Salzer is `Co-Director of the OSEP-funded Wisconsin Parent Training and Information Center (PTI)`. The live statewide projects page states `Parent Training and Information Center (PTIC)` and says WI FACETS has been funded by the U.S. Department of Education since 2001 to support families and others with training, information, and support related to children with disabilities and IDEA. This now supplies direct first-party PTI designation evidence for Wisconsin.)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 live first-party Legal Action Wisconsin pages. The homepage preserves an `Apply for FREE legal help` route, statewide service categories including housing, employment, debt and taxes, public benefits, family law, and victim support, and a current news item titled `Legal Action of Wisconsin and Judicare Legal Aid Merge, Creating Wisconsin's Largest Statewide Civil Legal...`. The about page also states the website was made possible by generous support of the Legal Services Corporation. Together these live first-party artifacts supply current statewide legal-aid evidence for Wisconsin.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 the live official Wisconsin DHS ADRC contact directory. The page says `Call or visit your local ADRC in person`, lets families `Find your local ADRC or Tribal ADRS`, and publicly preserves contact cards with explicit `Service area` fields. Reviewed examples include `ADRC of Adams County` with `Service area Adams County`, `ADRC of Clark County` with `Service area Clark County`, and Tribal ADRS entries for Wisconsin Tribal nations. This replaces Wisconsin's old DOI-derived county-office evidence with a current first-party statewide county-local disability routing directory on the DHS host.)

## Failure ledger

- district_or_county_education_routing: official_school_directory_and_cesa_network_exist_but_no_reviewed_statewide_county_or_special_education_crosswalk_is_preserved :: Reviewed 2026-06-25 one more bounded official education-routing pass. DPI publishes a live official `Cooperative Educational Service Agency (CESA)` page with current CESA contacts, district counts, and links to all 12 CESA agency websites. DPI also publishes a live official `School Directory: Your Source for School Directory Data` page that links families to the `School Directory Public Portal`, and the reviewed public portal client assets preserve county and CESA filter surfaces. Multiple live first-party CESA sites further preserve district-owned navigation such as `Member Districts`, `Districts`, and `CESA 4 School Districts`, showing a real public regional network exists. But this pass still did not preserve a single reviewed statewide county-to-CESA contract, exported district list with county and CESA fields, or district-owned special-education crosswalk on disk. Because the current proof stops at portal and network structure instead of a reviewable statewide routing contract, Wisconsin education routing remains blocked.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dhs.wisconsin.gov/familycare/eligibility.htm
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.wisconsin.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.wisconsin.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://dpi.wi.gov/
- district_or_county_education_routing: blocked_official_directory_and_cesa_network_without_reviewable_county_or_special_education_crosswalk; samples=4; first=https://dpi.wi.gov/about-dpi/cesa
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dhs.wisconsin.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightswi.org/
- parent_training_information_center: verified_state_grade; samples=3; first=https://wifacets.org/projects/statewide/
- legal_aid: verified_state_grade; samples=3; first=https://legalaction.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=4; first=https://www.dhs.wisconsin.gov/adrc/contacts.htm

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_wisconsin_publishes_reviewable_county_to_cesa_or_district_special_education_crosswalk

## Repair decision

- Wisconsin remains `BLOCKED` and `index_safe=false`.
- `county_local_disability_resources` now clears because the official DHS ADRC contact directory publicly preserves county or Tribal service-area fields on live first-party contact cards.
- `parent_training_information_center` now clears because WI FACETS now explicitly preserves current Wisconsin PTI designation language on live first-party pages.
- `legal_aid` now clears because Legal Action Wisconsin preserves current first-party free legal-help routing, statewide service categories, and a merger notice describing Wisconsin's largest statewide civil legal organization.
- `district_or_county_education_routing` is the only remaining blocker. DPI's public CESA and School Directory surfaces prove a live network exists, but this pass still does not preserve a reviewable statewide county-to-region or district special-education routing contract on disk.
