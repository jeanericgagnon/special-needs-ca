# Alaska California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 20
- primary_gap_reason: health_alaska_dpa_service_family_now_returns_cloudflare_challenge_shells_while_dfcs_successor_surfaces_still_add_no_borough_or_census_area_assignment_contract

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
- county_local_disability_resources: blocked_health_alaska_dpa_challenge_shells_and_dfcs_successor_surfaces_still_no_borough_or_census_area_assignment_contract (The live Alaska county-local blocker tightened again after one more bounded official recheck on 2026-06-25. The current Department of Health DPA family no longer stays browser-readable: raw fetches to `https://health.alaska.gov/dpa`, the exact DPA offices page, the Adult Public Assistance page, the Apply for Medicaid page, and the public DPA dashboard / Medicaid snapshot PDFs now return HTTP 403 on the official health host. In the reviewed browser lane, the exact DPA offices page and the successor Adult Public Assistance / Apply for Medicaid pages now land on Cloudflare `Just a moment...` challenge shells with the visible heading `Performing security verification` instead of materializing office or service content. The still-readable DFCS successor surfaces remain negative at the same time: `Services.aspx` still only points users to statewide Adult Public Assistance and Apply for Medicaid successor pages, `Publications.aspx` still exposes no DPA office-routing material, and `Site-Map.aspx` still only adds wrong-role OCS / Pioneer Homes branches rather than a borough or census-area assignment contract. Alaska therefore remains blocked because the public health host is challenge-shelled again and the readable successor host still adds no county-equivalent routing contract.)

## Failure ledger

- county_local_disability_resources: health_alaska_dpa_service_family_cloudflare_challenge_and_dfcs_successor_surfaces_still_no_county_equivalent_mapping_contract :: Reviewed 2026-06-25 official Alaska surfaces across the current Department of Health DPA host plus the DFCS successor host. Raw fetches to `https://health.alaska.gov/dpa`, `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/`, `https://health.alaska.gov/en/services/adult-public-assistance-apa/`, `https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/`, `https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf`, and `https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf` now all return HTTP 403 on the official health host. In the reviewed browser lane, the DPA offices page now lands on a Cloudflare `Just a moment...` shell with the visible heading `Performing security verification`, and the successor Adult Public Assistance and Apply for Medicaid pages also land on `Just a moment...` shells on the same host instead of materializing office or service content. The still-readable DFCS successor surfaces remain negative: `https://dfcs.alaska.gov/Pages/Services.aspx` still only points users to statewide Adult Public Assistance and Apply for Medicaid successor pages, `https://dfcs.alaska.gov/Pages/Publications.aspx` still exposes no DPA office-routing material, and `https://dfcs.alaska.gov/Pages/Site-Map.aspx` still only adds wrong-role OCS offices plus Pioneer Homes payment-assistance branches. Alaska therefore still lacks any reviewable borough- or census-area-to-office assignment contract on a public official surface, and the previously readable DPA office family is now challenge-shelled again.

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
- county_local_disability_resources: blocked_health_alaska_dpa_challenge_shells_and_dfcs_successor_surfaces_still_no_borough_or_census_area_assignment_contract; samples=30; first=https://dfcs.alaska.gov/Pages/Services.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_alaska_publishes_reviewable_public_borough_or_census_area_to_dpa_office_assignment_or_the_health_dpa_family_reopens_without_challenge_shells

## Repair decision

- Alaska remains BLOCKED and not index-safe.
- The current health.alaska.gov DPA family is no longer reliably browser-readable for this lane.
- The DPA landing page, exact DPA offices page, Adult Public Assistance page, Apply for Medicaid page, and the public DPA dashboard / Medicaid snapshot PDFs now return raw HTTP 403 on the official health host.
- In the reviewed browser lane, the DPA offices page and successor service pages land on `Just a moment...` / `Performing security verification` challenge shells instead of materializing reviewable office content.
- The DFCS successor pages are still public, but they still do not add any borough- or census-area assignment contract for DPA routing.
- Alaska therefore still lacks any reviewable county-equivalent routing contract on a public official surface.
