# South Dakota California-Grade Packet v4

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 66
- primary_gap_reason: official_doe_special_education_directory_and_first_party_legal_aid_are_verified_but_no_public_dhs_county_or_region_disability_office_contract_exists

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 the live official South Dakota Educational Directory root and district result pages on the DOE host. The public directory root lists Public School Districts including Aberdeen 06-1, Bennett County 03-1, and Sioux Falls 49-5. The official district result pages preserve district website links, mailing and physical addresses, and named `Special Education Director` contacts, including Nicole Olson for Aberdeen, Stacy Allen for Bennett County, and Denise Kennedy for Sioux Falls. This replaces South Dakota’s old generic `doe.sd.gov/` fallback with reviewed official district-routing pages on the DOE host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights South Dakota evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: verified_state_grade (authoritative Parent Center Hub South Dakota leaf explicitly labels South Dakota Parent Connection as the South Dakota PTI)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 the live first-party Dakota Plains Legal Services homepage. That page says Dakota Plains Legal Services is a non-profit legal services organization that provides free legal assistance to low-income individuals, older Americans, and veterans, and further says DPLS has eight offices and serves communities across South Dakota and North Dakota, including nine tribal nations. The same page preserves direct application and office-contact routing. This repairs South Dakota’s missing statewide legal-aid family with current first-party legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_no_public_county_or_region_disability_office_contract (Reviewed 2026-06-25 another bounded official South Dakota DHS pass. The old `https://dhhs.south-dakota.gov/locations` host is unresolvable. The successor `https://dhs.sd.gov/en/localoffices` route resolves to a South Dakota DHS app state titled `Page Not Found` saying `We have updated our website and this page does not exist.` The live `https://dhs.sd.gov/en/division-developmental-disabilities` page now explicitly says the first step to receiving many services is choosing a case management provider and that the case manager helps identify and access available providers and resources, but the page still routes families only to statewide Dakota at Home intake and email rather than to any public county or regional provider directory. The related `https://dhs.sd.gov/en/get-help-person-with-disability/get-help-for-someone-with-a-developmental-disability` page repeats the same statewide Dakota at Home intake pattern. The public `https://dhs.sd.gov/en/contact-us` page exposes only statewide phone, email, and mail channels, and the public `https://dhs.sd.gov/en/staff-directory` page exposes division staff tables including DD intake leadership, but neither page publishes county-by-county, city-by-city, or regional service-area contracts for local disability office routing. The public provider-portal division links such as `https://dhs.sd.gov/en/provider-portal/division-of-developmental-disabilities-provider-portal` also resolve back to the generic Provider Portal hub instead of a distinct local-routing directory. South Dakota therefore still lacks a reviewable public official county-to-office or region-to-county disability routing contract.)

## Failure ledger

- county_local_disability_resources: official_dhs_successor_lanes_lack_public_county_or_region_disability_office_contract :: Reviewed 2026-06-25 another bounded official South Dakota DHS pass. The old `https://dhhs.south-dakota.gov/locations` host is unresolvable. The successor `https://dhs.sd.gov/en/localoffices` route resolves to a South Dakota DHS app state titled `Page Not Found` saying `We have updated our website and this page does not exist.` The live `https://dhs.sd.gov/en/division-developmental-disabilities` page now explicitly says the first step to receiving many services is choosing a case management provider and that the case manager helps identify and access available providers and resources, but the page still routes families only to statewide Dakota at Home intake and email rather than to any public county or regional provider directory. The related `https://dhs.sd.gov/en/get-help-person-with-disability/get-help-for-someone-with-a-developmental-disability` page repeats the same statewide Dakota at Home intake pattern. The public `https://dhs.sd.gov/en/contact-us` page exposes only statewide phone, email, and mail channels, and the public `https://dhs.sd.gov/en/staff-directory` page exposes division staff tables including DD intake leadership, but neither page publishes county-by-county, city-by-city, or regional service-area contracts for local disability office routing. The public provider-portal division links such as `https://dhs.sd.gov/en/provider-portal/division-of-developmental-disabilities-provider-portal` also resolve back to the generic Provider Portal hub instead of a distinct local-routing directory. South Dakota therefore still lacks a reviewable public official county-to-office or region-to-county disability routing contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhs.sd.gov/dd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.south-dakota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.south-dakota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://doe.sd.gov/
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://doe.sd.gov/ofm/edudir.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhs.sd.gov/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drsdlaw.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/south-dakota/
- legal_aid: verified_state_grade; samples=2; first=https://www.dpls.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_no_public_county_or_region_disability_office_contract; samples=7; first=https://dhhs.south-dakota.gov/locations

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_south_dakota_publishes_public_county_or_region_disability_office_contract

## Completion decision

- South Dakota remains `BLOCKED` and `index_safe=false`.
- `district_or_county_education_routing` now clears because the official DOE directory exposes district-specific pages with named special-education directors, addresses, and district website links.
- `legal_aid` now clears because the first-party Dakota Plains Legal Services site explicitly preserves free legal-aid scope plus statewide office routing.
- `county_local_disability_resources` remains the only blocker because the reviewed official DHS successor lanes still do not publish a county-to-office or region-to-county local disability routing contract.
