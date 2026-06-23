# New Jersey California-Grade County Directory Repair v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 21
- primary_gap_reason: first_party_drnj_domains_not_publicly_reviewable

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (the official NJDOE County Offices of Education page enumerates all 21 counties and links county-owned office leaves with county superintendent routing details)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: blocked_first_party_drnj_domains_not_publicly_reviewable (Reviewed 2026-06-23 bounded first-party probes for New Jersey protection and advocacy. `drnj.org` and `www.drnj.org` return Flywheel `Unknown Domain`, while `disabilityrightsnj.org` serves a Cloudflare `Just a moment...` challenge in bounded fetch. New Jersey therefore still lacks a publicly reviewable first-party DRNJ artifact on disk.)
- parent_training_information_center: verified_state_grade (reviewed first-party SPAN evidence preserves New Jersey statewide parent-to-parent identity, PTI program navigation, and direct support contact)
- legal_aid: verified_state_grade (reviewed first-party LSNJ pages preserve statewide free civil legal aid and the LSNJLAW hotline for New Jersey residents)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (the official DHS County Social Service Agencies page enumerates all 21 counties and preserves county agency addresses, phones, hours, and county-owned leaves)

## Failure ledger

- protection_and_advocacy: official_drnj_first_party_domains_unknown_or_challenge_blocked :: Reviewed 2026-06-23 bounded first-party probes for New Jersey protection and advocacy. `drnj.org` and `www.drnj.org` return Flywheel `Unknown Domain`, while `disabilityrightsnj.org` serves a Cloudflare `Just a moment...` challenge in bounded fetch. New Jersey therefore still lacks a publicly reviewable first-party DRNJ artifact on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.nj.gov/humanservices/ddd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://nj.gov/humanservices/ddd/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.nj.gov/health/fhs/eis/
- special_education_idea_part_b: verified_state_grade; samples=2; first=https://www.bergen.org/bcss
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://www.nj.gov/education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.nj.gov/humanservices/ddd
- protection_and_advocacy: blocked_first_party_drnj_domains_not_publicly_reviewable; samples=3; first=http://drnj.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://spanadvocacy.org/programs/p2p/
- legal_aid: verified_state_grade; samples=2; first=https://www.lsnj.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.nj.gov/humanservices/dmahs
- county_local_disability_resources: verified_state_grade; samples=4; first=https://www.nj.gov/humanservices/dfd/

## Next actions

- [critical] protection_and_advocacy: hold_blocked_until_public_drnj_first_party_page_is_reviewable

## Completion decision

- New Jersey remains `BLOCKED` and `index_safe=false`.
- The critical county-grade blockers are repaired: the official NJDOE County Offices of Education page and the official DHS County Social Service Agencies page both preserve all 21 counties with county-specific routing evidence on disk.
- Statewide legal aid is now verified from live first-party LSNJ pages, including the free statewide hotline.
- New Jersey still cannot become index-safe because the statewide protection-and-advocacy lane lacks a publicly reviewable first-party DRNJ page: the legacy domains fail and the current disabilityrightsnj.org host serves a challenge shell in bounded fetch.
