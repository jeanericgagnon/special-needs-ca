# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: dfcs_reorg_root_relays_back_to_challenged_health_host_and_no_public_assistance_contacts_exist

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
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved (The live Alaska DFCS reorg root does not repair county-grade office routing: its Services page only relays Adult Public Assistance and Medicaid users back to challenged health.alaska.gov leaves, its Department Contacts page has no Public Assistance or disability office-routing section, the exact health host office-locations leaf still returns the Cloudflare verification shell, and the legacy locator is HTTP 404.)

## Failure ledger

- county_local_disability_resources: dfcs_reorg_root_relays_back_to_challenged_health_host_and_no_public_assistance_contacts_exist :: Reviewed 2026-06-22 bounded live official Alaska reorg-host checks on https://dfcs.alaska.gov/Pages/default.aspx, https://dfcs.alaska.gov/Pages/Services.aspx, and https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx, plus the already-blocked exact health host leaf https://health.alaska.gov/dpa/Pages/office-locations.aspx. The reorg DFCS root is live and the Services page exposes Adult Public Assistance and Apply for Medicaid links, but both point families back to health.alaska.gov leaves instead of a reviewable local office directory. The DFCS Department Contacts page contains no Public Assistance, Medicaid, Senior and Disabilities, or office-location routing terms, while the exact health host office-locations leaf still returns HTTP 403 with the Cloudflare "Just a moment..." shell. The legacy official locator https://dhss.alaska.gov/locations remains HTTP 404, so no current official county-grade local-office replacement was recovered.

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
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved; samples=7; first=https://dfcs.alaska.gov/Pages/default.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_a_reviewable_public_assistance_or_disability_office_directory_on_dfcs_or_the_health_host_challenge_clears

## Repair decision

- The only remaining Alaska blocker is county/local disability resources.
- This bounded pass confirms the live DFCS reorg host is real but does not provide a Public Assistance or disability office directory that repairs county-grade routing.
- The DFCS Services page only relays Adult Public Assistance and Medicaid users back to the same challenged health host, and the DFCS contacts page carries no program-specific office-routing section.
- Alaska remains BLOCKED and not index-safe until the state publishes a reviewable office directory on DFCS or the challenged health host begins serving the current official office-locations content again.
