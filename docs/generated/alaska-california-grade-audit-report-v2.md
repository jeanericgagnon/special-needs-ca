# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 20
- primary_gap_reason: official_local_office_directory_challenge_and_live_first_party_pti_designation_gap

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Official Alaska DEED district-profiles directory and district map pages preserve named district detail leaves with addresses, phones, emails, and superintendent contacts for Alaska local school systems, including borough districts plus REAA routing for unorganized areas.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Law Center of Alaska pages now preserve explicit Protection and Advocacy grant designations, including PADD, PAIMI, PAIR, and related federal P&A authorities on the DLCAK funding page.)
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (reviewed live Stone Soup Group support, contact, and parent-navigation leaves preserve statewide support scope and offices, but no fetched first-party page preserves explicit PTI designation text and likely PTI-style leaves return 404)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved (Official Alaska DPA and SDS office-directory surfaces still return Cloudflare security-verification shells in both static and bounded browser-assisted fetch lanes, so county-grade local disability routing still lacks reviewed office-by-area evidence.)

## Failure ledger

- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed 2026-06-22 live Stone Soup Group homepage, contact, history/mission, parent-navigation, FAQ, and family-resource-guide leaves preserve statewide support, intake, and office evidence, but no fetched first-party page preserves explicit PTI / Parent Training and Information Center designation text; likely PTI-style leaves such as /parent-training-and-information-center/ return 404.
- county_local_disability_resources: official_local_directory_challenge_blocks_reviewed_county_grade_evidence :: Reviewed 2026-06-22 static and bounded browser-assisted checks both returned Cloudflare security-verification shells on official Alaska DPA and SDS office-directory candidates, including office-locations and contact leaves on health.alaska.gov; no reviewed county-or-area office directory artifact is preserved yet.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds/Pages/hcbw/eligibility.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.alaska.gov/sped
- district_or_county_education_routing: verified_state_grade; samples=20; first=https://education.alaska.gov/DOE_Rolodex/DistrictProfiles2000/DistrictProfilesSearch.cfm
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds
- protection_and_advocacy: verified_state_grade; samples=2; first=https://www.dlcak.org/
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=3; first=https://www.stonesoupgroup.org/
- legal_aid: verified_state_grade; samples=1; first=http://www.dlcak.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved; samples=3; first=https://health.alaska.gov/dpa/Pages/office-locations.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_local_office_directory_is_rehydrated_or_replaced_with_reviewed_first_party_office_listing
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_live_first_party_source

## Repair decision

- District or county education routing is now verified because the official Alaska DEED district-profiles search, district map, and district detail leaves preserve district-owned contact routing for borough districts and enumerate REAA systems for unorganized areas.
- Protection and advocacy is now verified because the first-party Disability Law Center of Alaska funding page explicitly preserves federal Protection and Advocacy grant authorities, not just generic legal-advocacy language.
- Parent training and information center remains blocked because live Stone Soup Group support, contact, and parent-navigation leaves now prove statewide support and offices, but the reviewed first-party chain still does not preserve explicit PTI / Parent Training and Information Center designation text and likely PTI-style leaves return 404.
- County-local disability resources remain blocked because the official Alaska DPA/SDS office-directory surfaces still return Cloudflare security-verification shells in both static and bounded browser-assisted lanes.
- Alaska is therefore still BLOCKED and not index-safe, but the remaining blockers are now narrower and more exact.

## Evidence checks

- Education routing: Reviewed 2026-06-22 official DEED district-profiles search lists borough school districts plus REAA systems, and district detail leaves such as Aleutians East Borough, Fairbanks North Star Borough, and Denali Borough preserve address, phone, email, website, and superintendent contact fields.
- Protection and advocacy: Reviewed 2026-06-22 first-party DLCAK about and funding pages preserve both P&A system language and named federal PADD, PAIMI, PAIR, PABSS, and related advocacy grants on the DLCAK domain.
- Parent training and information center: Reviewed 2026-06-22 live Stone Soup Group homepage, contact, history/mission, parent-navigation, FAQ, and family-resource-guide leaves; likely PTI-style leaves such as `/parent-training-and-information-center/` returned 404 while the live fetched leaves preserved statewide support and office evidence only.
- County-local disability resources: Reviewed 2026-06-22 static probes and bounded browser-assisted checks both returned Cloudflare verification shells titled "Just a moment..." or "Performing security verification" on official Alaska DPA/SDS local-office pages.

## Final family count

- strong_critical_families: 10
- weak_critical_families: 2
- missing_critical_families: 0
- district_or_county_education_routing: verified_state_grade
- protection_and_advocacy: verified_state_grade
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved
