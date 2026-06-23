# Kansas California-Grade Education Leaf Rehydration v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 105
- primary_gap_reason: kdads_access_blocked_and_no_county_or_district_education_contract_preserved

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: blocked_live_waiver_source_access_denied (The reviewed exact KDADS waiver eligibility leaf is challenge-blocked and no reviewed waiver content is preserved on disk.)
- developmental_disability_idd_authority: blocked_live_dd_authority_source_access_denied (The old dhhs.kansas.gov DD root is dead and the reviewed KDADS DD replacement remains challenge-blocked.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (The live KSDE Special Education, Dispute Resolution, Parent Rights, Data Central Special Education Reports, and School District Maps leaves are again reachable. The official School District Maps page now also exposes a live USD county map PDF, but bounded extraction only recovers county names plus district numbers without a reviewable county-to-district join or district-owned special-education local-contact source, so county-grade education routing remains blocked.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- medicaid_waiver_hcbs_disability_services: reviewed_exact_waiver_leaf_access_blocked :: Reviewed 2026-06-22 live probe to the exact KDADS waiver and HCBS surfaces still returns HTTP 403 Forbidden / access denied.
- developmental_disability_idd_authority: legacy_dd_root_dead_and_reviewed_replacement_access_blocked :: The old dhhs.kansas.gov/dd root remains dead, and reviewed 2026-06-22 live probe to the exact KDADS root still returns HTTP 403 Forbidden / access denied instead of DD content.
- district_or_county_education_routing: official_statewide_education_leaves_live_but_no_county_or_district_contract_preserved :: Reviewed 2026-06-22 live probes to the exact KSDE Special Education, Dispute Resolution, Parent Rights, Data Central Special Education Reports, and School District Maps leaves now succeed. The official School District Maps page also exposes a live USD county map PDF at https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5, and bounded extraction confirms that it is not dead or image-only. But the extracted text still collapses into district numbers plus county names without a reviewable county-to-district join, and the packet still preserves no district-owned local special-education contact source.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: blocked_live_waiver_source_access_denied; samples=0
- developmental_disability_idd_authority: blocked_live_dd_authority_source_access_denied; samples=0
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=0
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] medicaid_waiver_hcbs_disability_services: browser_assisted_or_reviewed_alt_official_waiver_leaf
- [critical] developmental_disability_idd_authority: browser_assisted_or_reviewed_alt_official_dd_leaf
- [critical] district_or_county_education_routing: author_exact_district_routing_contract_from_official_datacentral_or_county_map_sources

## Completion decision

- Kansas Medicaid is no longer blocked because the live official KanCare stack again preserves Medicaid coverage, eligibility, and appeal routing in the lightweight lane.
- Kansas county-local resources are no longer blocked because the live official KanCare Ombudsman directory now publishes county-specific Community Resources guides for all 105 counties.
- Kansas remains BLOCKED and not index-safe because the KDADS DD / waiver families still return access-denied responses, and county-grade education routing still lacks a preserved county-to-district or district-owned local-contact contract.
