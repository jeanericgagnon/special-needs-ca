# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 20
- primary_gap_reason: official_local_office_directory_challenge_and_missing_explicit_pti_designation

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Official Alaska DEED district-profiles directory and district map pages preserve named district detail leaves with addresses, phones, emails, and superintendent contacts for Alaska local school systems, including borough districts plus REAA routing for unorganized areas.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Law Center of Alaska pages now preserve explicit Protection and Advocacy grant designations, including PADD, PAIMI, PAIR, and related federal P&A authorities on the DLCAK funding page.)
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (reviewed first-party statewide family-support evidence exists, but the saved artifact still does not preserve explicit PTI designation text)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved (Official Alaska local office directory surfaces remain challenge-blocked in both static and bounded browser-assisted fetch lanes, so county-grade local disability routing still lacks reviewed office-by-area evidence.)

## Failure ledger

- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed Stone Soup Group evidence proves statewide family-support, training, and intake scope, but the saved first-party artifact still does not preserve explicit PTI / Parent Training and Information Center designation text.
- county_local_disability_resources: official_local_directory_challenge_blocks_reviewed_county_grade_evidence :: Official Alaska DPA and SDS office-directory pages return static 403 responses, a bounded browser-assisted pass still renders only a Cloudflare security-verification shell, and the alternate family.alaska.gov office-location host fails certificate validation; no reviewed county-or-area office directory artifact is preserved yet.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds/Pages/hcbw/eligibility.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.alaska.gov/sped
- district_or_county_education_routing: verified_state_grade; samples=20; first=https://education.alaska.gov/DOE_Rolodex/DistrictProfiles2000/DistrictProfilesSearch.cfm
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds
- protection_and_advocacy: verified_state_grade; samples=2; first=https://www.dlcak.org/
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=1; first=https://stonesoupgroup.org/
- legal_aid: verified_state_grade; samples=1; first=http://www.dlcak.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved; samples=1; first=https://health.alaska.gov/dpa/Pages/office-locations.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_local_office_directory_is_rehydrated_or_replaced_with_reviewed_first_party_office_listing
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source

## Repair decision

- District or county education routing is now verified because the official Alaska DEED district-profiles search, district map, and district detail leaves preserve district-owned contact routing for borough districts and enumerate REAA systems for unorganized areas.
- Protection and advocacy is now verified because the first-party Disability Law Center of Alaska funding page explicitly preserves federal Protection and Advocacy grant authorities, not just generic legal-advocacy language.
- Parent training and information center remains blocked because Stone Soup Group still does not preserve explicit PTI / Parent Training and Information Center designation text on the fetched first-party pages reviewed in this pass.
- County-local disability resources remain blocked because the official Alaska DPA/SDS office-directory surfaces are still challenge-blocked or certificate-broken in both static and bounded browser-assisted lanes.
- Alaska is therefore still BLOCKED and not index-safe, but the remaining blockers are now narrower and more exact.

## Evidence checks

- Education routing: Reviewed 2026-06-22 official DEED district-profiles search lists borough school districts plus REAA systems, and district detail leaves such as Aleutians East Borough, Fairbanks North Star Borough, and Denali Borough preserve address, phone, email, website, and superintendent contact fields.
- Protection and advocacy: Reviewed 2026-06-22 first-party DLCAK about and funding pages preserve both P&A system language and named federal PADD, PAIMI, PAIR, PABSS, and related advocacy grants on the DLCAK domain.
- County-local disability resources: Reviewed 2026-06-22 static probes returned 403 on official health.alaska.gov local-office pages; a bounded browser-assisted pass still rendered only a Cloudflare verification shell titled "Just a moment..."; the alternate family.alaska.gov office-location host failed certificate validation.

## Final family count

- strong_critical_families: 10
- weak_critical_families: 2
- missing_critical_families: 0
- district_or_county_education_routing: verified_state_grade
- protection_and_advocacy: verified_state_grade
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved
