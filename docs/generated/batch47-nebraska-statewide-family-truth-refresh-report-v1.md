# Nebraska California-Grade Truth Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 93
- primary_gap_reason: district_grade_education_and_interactive_county_locator_still_unverified

## Family status

- medicaid_state_health_coverage: verified_state_grade (Live Nebraska DHHS Medicaid eligibility and overview leaves now provide the statewide application, eligibility, and coverage path on the real official domain.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Live Nebraska DHHS waiver-eligibility evidence now replaces the dead legacy waiver root.)
- developmental_disability_idd_authority: verified_state_grade (Live Nebraska DHHS Developmental Disabilities and waiver-eligibility leaves now prove the statewide DD authority and appeals path on the reviewed official domain.)
- early_intervention_part_c: verified_state_grade (The official Nebraska Early Development Network site now provides a live statewide Part C route with referral, eligibility, service-coordination, and planning-region navigation.)
- special_education_idea_part_b: verified_state_grade (Live Nebraska Department of Education special-education, complaint, mediation, and due-process leaves now replace the stale generic home-page packet sample.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Reviewed NDE leaves prove statewide special-education dispute paths only; no reviewed district-owned or county-grade education-routing leaf is preserved on disk.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Live Nebraska VR now provides the statewide vocational-rehabilitation route on the correct official subdomain.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Rights Nebraska evidence explicitly proves the statewide P&A role.)
- parent_training_information_center: verified_state_grade (Reviewed first-party PTI Nebraska evidence explicitly states that it has served as Nebraska’s Parent Training and Information Center since 2001 and that Nebraska has one federally funded Parent Center.)
- legal_aid: verified_state_grade (Reviewed first-party Legal Aid of Nebraska evidence now provides a real statewide civil legal-aid route.)
- able_program: verified_state_grade (Statewide evidence is present at the required authority level.)
- ssi_ssa_federal_reference: verified_state_grade (Statewide evidence is present at the required authority level.)
- county_local_disability_resources: blocked_official_interactive_locator_not_reviewed_county_grade (The reviewed Nebraska Public Assistance Offices chain is live, but the official GIS locator still renders only an interactive shell in the reviewed HTML and does not preserve county office rows.)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Reviewed NDE special-education, complaint, mediation, and due-process leaves are live and role-pure, but no district-owned or county-grade education-routing leaf is currently preserved on disk.
- county_local_disability_resources: official_interactive_locator_not_reviewed_county_grade :: Reviewed 2026-06-21 live probe returned title "Public Assistance Offices" and linked the official Nebraska Public Office Location Lookup, but the fetched page did not itself preserve county office rows. Reviewed 2026-06-21 live probe to the official Nebraska Public Office Location Lookup only rendered the generic title "Experience" and did not preserve county-grade office data in the reviewed HTML artifact.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://dhhs.ne.gov/Pages/Medicaid-Eligibility.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhhs.ne.gov/Pages/DD-Eligibility.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://dhhs.ne.gov/Pages/Developmental-Disabilities.aspx
- early_intervention_part_c: verified_state_grade; samples=1; first=https://edn.ne.gov/cms/
- special_education_idea_part_b: verified_state_grade; samples=4; first=https://www.education.ne.gov/sped/
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=4; first=https://www.education.ne.gov/sped/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://vr.nebraska.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsnebraska.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://pti-nebraska.org/about/
- legal_aid: verified_state_grade; samples=1; first=https://legalaidofnebraska.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_interactive_locator_not_reviewed_county_grade; samples=2; first=https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: extract_or_review_county_rows_from_official_locator

## Completion decision

- Nebraska is no longer UNSTARTED. The statewide packet has been truth-refreshed onto live first-party official or authoritative support evidence.
- PTI upgrade: PTI Nebraska has served as Nebraska’s Parent Training and Information Center since 2001, and its reviewed first-party About page also states that Nebraska has one federally funded Parent Center.
- VR upgrade: `vr.nebraska.gov` is live and now replaces the stale legacy DHHS rehab packet sample with a reviewed Nebraska VR statewide route.
- Early intervention upgrade: `edn.ne.gov` is live and now replaces the dead legacy early-intervention packet sample with the reviewed Nebraska Early Development Network route.
- Nebraska remains BLOCKED and not index-safe because two county-grade critical families still fail closed:
  - district_or_county_education_routing: Reviewed NDE special-education, complaint, mediation, and due-process leaves are live and role-pure, but no district-owned or county-grade education-routing leaf is currently preserved on disk.
  - county_local_disability_resources: Reviewed 2026-06-21 live probe returned title "Public Assistance Offices" and linked the official Nebraska Public Office Location Lookup, but the fetched page did not itself preserve county office rows. Reviewed 2026-06-21 live probe to the official Nebraska Public Office Location Lookup only rendered the generic title "Experience" and did not preserve county-grade office data in the reviewed HTML artifact.
- The old dead `dhhs.nebraska.gov` packet roots have been replaced where live official successors were reviewable, including `dhhs.ne.gov`, `vr.nebraska.gov`, and `edn.ne.gov`.

