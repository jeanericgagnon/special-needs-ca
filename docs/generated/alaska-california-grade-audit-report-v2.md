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
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (Reviewed live Stone Soup and Parent Center Hub artifacts preserve statewide support scope, but no fetched first-party or authoritative page preserves explicit Alaska PTI designation text; search and map-shell near-misses are not enough.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved (Official Alaska DPA/SDS office-location, default, and contact roots all return the Cloudflare "Just a moment..." HTTP 403 shell in the current lane, so county-grade local-office evidence remains unreviewed.)

## Failure ledger

- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed 2026-06-22 live Stone Soup Group and Parent Center Hub artifacts. Stone Soup first-party pages still preserve statewide support and parent-navigation scope, but no fetched page preserves explicit PTI / Parent Training and Information Center designation text. Stone Soup search results echo the query in the page title ("Parent Training and Information") but only render generic search-results content, and the Parent Center Hub Alaska map asset only preserves the Alaska selector plus "Click to find a list of parent centers" without naming Stone Soup Group or an Alaska PTI. No fetched first-party or authoritative page yet preserves explicit Alaska PTI designation text.
- county_local_disability_resources: official_local_directory_challenge_blocks_reviewed_county_grade_evidence :: Reviewed 2026-06-22 live official Alaska DPA and SDS office-directory candidates on health.alaska.gov, including office-locations, default, and contact roots. Every checked office candidate returned HTTP 403 with the Cloudflare "Just a moment..." shell, so county-grade local-office evidence is blocked at the domain level in the current fetch lane rather than at one stale page.

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

- District or county education routing is verified from the official Alaska DEED district-profiles directory, district map, and district detail leaves.
- Protection and advocacy remains verified from the DLCAK first-party funding and statewide advocacy pages.
- Parent training and information center remains blocked because reviewed 2026-06-22 live stone soup group and parent center hub artifacts. stone soup first-party pages still preserve statewide support and parent-navigation scope, but no fetched page preserves explicit pti / parent training and information center designation text. stone soup search results echo the query in the page title ("parent training and information") but only render generic search-results content, and the parent center hub alaska map asset only preserves the alaska selector plus "click to find a list of parent centers" without naming stone soup group or an alaska pti. no fetched first-party or authoritative page yet preserves explicit alaska pti designation text.
- County-local disability resources remain blocked because reviewed 2026-06-22 live official alaska dpa and sds office-directory candidates on health.alaska.gov, including office-locations, default, and contact roots. every checked office candidate returned http 403 with the cloudflare "just a moment..." shell, so county-grade local-office evidence is blocked at the domain level in the current fetch lane rather than at one stale page.
- Alaska is therefore still BLOCKED and not index-safe, but the remaining blockers are now narrower and more exact.
