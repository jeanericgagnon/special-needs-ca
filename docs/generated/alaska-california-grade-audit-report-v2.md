# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: official_local_directory_domainwide_cloudflare_challenge_and_legacy_locator_404

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
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved (Official Alaska DPA/SDS office-location, default, contact, newer /en/ paths, robots.txt, and sitemap.xml all return the same Cloudflare challenge shell, while the legacy dhss.alaska.gov/locations locator is HTTP 404, so county-grade local-office evidence is blocked at the host level rather than at one stale leaf.)

## Failure ledger

- county_local_disability_resources: official_local_directory_domainwide_cloudflare_challenge_and_legacy_locator_404 :: Reviewed 2026-06-22 live official Alaska DPA and SDS office-directory candidates on health.alaska.gov, including office-locations, default, contact, newer /en/ paths, and the host-level robots.txt plus sitemap.xml surfaces. Every live health.alaska.gov candidate returned HTTP 403 with cf-mitigated: challenge and the Cloudflare "Just a moment..." shell, while the legacy official locator https://dhss.alaska.gov/locations returned HTTP 404 and the legacy dhss.alaska.gov DPA/DSDS aliases only 302 back into the same challenged host. No alternate official county-grade office leaf or document was recovered in this bounded pass.

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
- county_local_disability_resources: blocked_official_local_directory_challenge_unresolved; samples=4; first=https://health.alaska.gov/dpa/Pages/office-locations.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_local_office_directory_is_republished_or_browser-readable_from_a_reviewable_official_host

## Repair decision

- The only remaining Alaska blocker is county/local disability resources.
- This bounded pass confirmed the blocker is host-level on the current official Alaska DPA/SDS web stack, not one bad office leaf.
- No alternate official county-grade office leaf or downloadable office directory was recovered during this pass.
- Alaska remains BLOCKED and not index-safe until the official local-office directory is republished on a reviewable host or a reviewable official browser lane can preserve county-grade evidence.
