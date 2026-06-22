# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: official_local_directory_challenge_blocks_reviewed_county_grade_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Official Alaska DEED district-profiles directory and district map pages preserve named district detail leaves with addresses, phones, emails, and superintendent contacts for Alaska local school systems, including borough districts plus REAA routing for unorganized areas.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Law Center of Alaska pages now preserve explicit Protection and Advocacy grant designations, including PADD, PAIMI, PAIR, and related federal P&A authorities on the DLCAK funding page.)
- parent_training_information_center: verified_state_grade (Reviewed authoritative Parent Center Hub Alaska leaf explicitly labels Stone Soup Group as Alaska PTI and preserves statewide Alaska contact evidence, so the PTI family is now verified even though Stone Soup Group’s own first-party pages still emphasize support scope instead of repeating the PTI designation.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved (Official Alaska DPA/SDS office-location, default, contact, and legacy dhss.alaska.gov alias roots all resolve to the same Cloudflare "Just a moment..." HTTP 403 shell in the current lane, so county-grade local-office evidence remains blocked at the domain level.)

## Failure ledger

- county_local_disability_resources: official_local_directory_challenge_blocks_reviewed_county_grade_evidence :: Reviewed 2026-06-22 live official Alaska DPA and SDS office-directory candidates on health.alaska.gov, including office-locations, default, and contact roots, plus legacy dhss.alaska.gov aliases that now redirect back to the same health.alaska.gov surfaces. Every checked office candidate returned HTTP 403 with the Cloudflare "Just a moment..." shell, so county-grade local-office evidence is blocked at the domain level rather than at one stale page.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds/Pages/hcbw/eligibility.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.alaska.gov/sped
- district_or_county_education_routing: verified_state_grade; samples=20; first=https://education.alaska.gov/DOE_Rolodex/DistrictProfiles2000/DistrictProfilesSearch.cfm
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds
- protection_and_advocacy: verified_state_grade; samples=2; first=https://www.dlcak.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/alaska/
- legal_aid: verified_state_grade; samples=1; first=http://www.dlcak.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved; samples=3; first=https://health.alaska.gov/dpa/Pages/office-locations.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_local_office_directory_is_rehydrated_or_replaced_with_reviewed_first_party_office_listing

## Repair decision

- District or county education routing is verified from the official Alaska DEED district-profiles directory, district map, and district detail leaves.
- Protection and advocacy remains verified from the DLCAK first-party funding and statewide advocacy pages.
- Parent training and information center is now verified from the authoritative Parent Center Hub Alaska leaf, which explicitly labels Stone Soup Group as Alaska PTI and preserves Alaska contact evidence.
- County-local disability resources remain blocked because reviewed 2026-06-22 live official alaska dpa and sds office-directory candidates on health.alaska.gov, including office-locations, default, and contact roots, plus legacy dhss.alaska.gov aliases that now redirect back to the same health.alaska.gov surfaces. every checked office candidate returned http 403 with the cloudflare "just a moment..." shell, so county-grade local-office evidence is blocked at the domain level rather than at one stale page.
- Alaska is therefore still BLOCKED and not index-safe because one critical county-local family remains unresolved, but the PTI blocker is now cleared.
