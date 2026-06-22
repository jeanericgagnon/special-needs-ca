# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: dfcs_site_map_exposes_only_pioneer_home_local_leaves_while_public_assistance_office_routing_stays_blocked

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
- county_local_disability_resources: blocked_public_assistance_local_directory_missing_despite_other_dfcs_local_leaves (Official DFCS local leaves do exist on the reorg host, but only for the narrow Alaska Pioneer Homes program. DFCS still exposes no reviewed Public Assistance, Medicaid, Senior and Disabilities, or county office-routing leaf, its site search does not return a usable local-office result contract, and the exact health host office-locations lane remains challenged.)

## Failure ledger

- county_local_disability_resources: dfcs_site_map_exposes_only_pioneer_home_local_leaves_while_public_assistance_office_routing_stays_blocked :: Reviewed 2026-06-22 bounded live official Alaska DFCS site-map, publications, search, and Alaska Pioneer Homes location leaves after the earlier reorg-host check. The DFCS site map and Publications page now prove the reorg host can publish exact local leaves, because they expose /daph/Pages/map.aspx and six named Alaska Pioneer Home location leaves. But those leaves are narrow Pioneer Home facility pages only, not Public Assistance, Medicaid, Senior and Disabilities, or county office-routing resources. The official DFCS search lane for public assistance still returns only the generic search shell without reviewed local-office results, the DFCS Services page still relays Adult Public Assistance and Medicaid users back to challenged health.alaska.gov leaves, and the exact health host office-locations leaf still returns HTTP 403 with the Cloudflare challenge shell. So Alaska now has proof that DFCS can host local pages, but no current official county-grade Public Assistance or disability office directory was recovered.

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
- county_local_disability_resources: blocked_public_assistance_local_directory_missing_despite_other_dfcs_local_leaves; samples=9; first=https://dfcs.alaska.gov/Pages/Site-Map.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_a_reviewable_public_assistance_or_disability_office_directory_on_dfcs_or_the_health_host_challenge_clears

## Repair decision

- The only remaining Alaska blocker is county/local disability resources.
- This bounded pass proves the DFCS reorg host can publish exact local leaves, but the only reviewed local family it exposes is Alaska Pioneer Homes.
- That narrows the blocker: Alaska is not missing local leaves in general, but it still lacks a reviewed Public Assistance, Medicaid, Senior and Disabilities, or county office-routing contract on DFCS, while the matching health host remains challenged.
- Alaska remains BLOCKED and not index-safe until the state publishes a reviewable Public Assistance or disability office directory on DFCS or the challenged health host begins serving the current official office-locations content again.
