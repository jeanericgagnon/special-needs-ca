# Montana California-Grade Batch 74 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 56
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: blocked_reviewed_first_party_support_without_explicit_statewide_panda_designation (reviewed first-party statewide disability-rights evidence exists, but the fetched first-party chain still does not preserve explicit statewide P&A designation text)
- parent_training_information_center: verified_state_grade (the reviewed authoritative Parent Center Hub Montana state leaf explicitly labels PLUK as Montana PTI and preserves statewide Montana contact evidence)
- legal_aid: verified_state_grade (the reviewed Montana Legal Services Association homepage preserves statewide free civil legal services language plus a direct apply-for-services route)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 5 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- protection_and_advocacy: reviewed_first_party_support_source_lacks_explicit_statewide_panda_designation :: Reviewed Disability Rights Montana home, About, and Protection & Advocacy History pages preserve statewide disability-rights support and P&A history context, but none explicitly state that DRM is Montana's designated statewide Protection and Advocacy system.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 5 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dphhs.mt.gov/dsd/ddp/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.montana.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.montana.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://opi.mt.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://opi.mt.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dphhs.mt.gov/dsd/ddp
- protection_and_advocacy: blocked_reviewed_first_party_support_without_explicit_statewide_panda_designation; samples=2; first=https://www.disabilityrightsmt.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/montana/
- legal_aid: verified_state_grade; samples=1; first=https://www.mtlsa.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.montana.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets
- [major] protection_and_advocacy: hold_blocked_until_explicit_statewide_panda_designation_is_preserved_from_reviewed_first_party_source

## Completion decision

- Montana no longer belongs in UNSTARTED. The packet now has enough reviewed on-disk evidence to clear the statewide PTI and legal-aid lanes without pretending the local-routing lanes are stronger than the evidence supports.
- The exact Parent Center Hub Montana state leaf explicitly labels Parents, Let’s Unite For Kids as Montana PTI and preserves the full statewide Montana contact block, so PTI upgrades even though the current pluk.org root has degraded to a bare index page.
- The Montana Legal Services Association homepage now preserves statewide free civil legal services language plus a direct apply-for-services route, so legal aid also upgrades.
- Disability Rights Montana remains a real reviewed statewide disability-rights source, but the fetched first-party chain still does not preserve explicit statewide Protection and Advocacy designation text, so P&A remains blocked rather than being promoted by inference.
- Montana still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on mixed statewide/structural sources instead of reviewed county-owned local routing, and the statewide P&A lane still lacks explicit designation text on the fetched first-party chain.
- Montana is therefore terminal BLOCKED, not COMPLETE.
