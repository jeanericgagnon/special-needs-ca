# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: raw_health_host_challenge_persists_while_browser_reviewed_dpa_offices_page_still_lacks_borough_or_census_area_assignment_and_dfcs_contacts_add_no_local_contract

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
- county_local_disability_resources: blocked_raw_health_host_challenge_plus_browser_reviewed_region_only_offices_page_and_dfcs_contacts_without_county_equivalent_contract (The live Alaska county-local blocker tightened again after one more bounded official recheck on 2026-06-25. In the raw low-token lane, the current Department of Health DPA landing page, the exact DPA offices page, and the two previously reviewed DPA PDFs now all return HTTP 403 Cloudflare challenge shells with the browser title "Just a moment...". That means the same health-host family is still not reproducibly fetchable in the low-token lane even though the reviewed browser lane had already shown a real DPA offices page. The reviewed browser evidence still matters because it proves the official offices page exists, but that page still only groups offices by broad regions and still does not assign Alaska boroughs or census areas to those offices. The DFCS successor host remains public but still adds no county-equivalent contract: `Services.aspx` is still a statewide phone relay for Adult Public Assistance and Apply for Medicaid, the Site Map still only surfaces wrong-role OCS and Pioneer Homes branches, and the Commissioner Department Contacts page still exposes no DPA/public-assistance office directory, no borough mapping, and no census-area assignment text. Alaska therefore remains blocked because there is still no public official borough- or census-area-to-office assignment contract, and the health-host family is still challenge-blocked in the raw low-token lane.)

## Failure ledger

- county_local_disability_resources: raw_health_host_still_returns_challenge_shells_and_dfcs_contacts_add_no_borough_or_census_area_contract :: Reviewed 2026-06-25 exact official Alaska surfaces in both the raw low-token lane and the previously recovered browser-reviewed lane. The raw lane still fails closed on the health host: `https://health.alaska.gov/en/division-of-public-assistance/`, `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/`, `https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf`, and `https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf` all returned HTTP 403 with the Cloudflare title "Just a moment...". The prior browser-reviewed DPA offices page remains the strongest positive evidence on the same host, but it still only groups offices by broad regions and still does not map Alaska boroughs or census areas to those offices. The DFCS successor surfaces remain negative at the same time: `https://dfcs.alaska.gov/Pages/Services.aspx` still only provides statewide phone routing for Adult Public Assistance and Apply for Medicaid, `https://dfcs.alaska.gov/Pages/Site-Map.aspx` still only surfaces wrong-role OCS and Pioneer Homes branches, and `https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx` still exposes only general department-contact sections rather than any DPA/public-assistance office directory or borough/census-area assignment contract. Alaska therefore still lacks any public official borough- or census-area-to-office assignment surface that can satisfy county-equivalent local routing.

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
- county_local_disability_resources: blocked_reviewed_live_dpa_offices_page_lists_regional_offices_but_no_borough_or_census_area_assignments_and_dfcs_surfaces_add_no_local_mapping_contract; samples=41; first=https://dfcs.alaska.gov/Pages/Services.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_or_api

## Repair decision

- Alaska remains BLOCKED and not index-safe.
- The raw low-token lane still gets Cloudflare `Just a moment...` 403 shells on the health-host DPA landing page, exact DPA offices page, and both health-host PDFs.
- The earlier reviewed browser lane still proves a real official DPA offices page exists, but that page is still only a regional office grouping and still does not assign boroughs or census areas.
- The DFCS Services page still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid.
- The DFCS Site Map still exposes only wrong-role local branches (`OCS Regional Offices` plus Alaska Pioneer Homes payment-assistance leaves), not a DPA county-equivalent contract.
- The DFCS Department Contacts page still exposes no DPA/public-assistance office directory and no borough or census-area assignment text.
- Alaska therefore still lacks any public official borough- or census-area office-routing contract on a reviewable surface.
