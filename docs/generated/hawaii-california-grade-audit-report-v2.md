# Hawaii California-Grade Batch 64 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 67
- county_count: 5
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- legal_aid: blocked_reviewed_statewide_support_source_not_explicit_legal_aid_route (reviewed first-party statewide support evidence exists, but the saved artifact does not preserve an explicit statewide legal-aid route)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- special_education_idea_part_b: legacy_or_inventory_only_evidence :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- legal_aid: reviewed_statewide_support_source_not_explicit_legal_aid_route :: Reviewed Hawaii Disability Rights Center evidence proves statewide rights-routing, casework scope, and apply-for-assistance routing, but the saved first-party artifact does not preserve an explicit statewide legal-aid or legal-representation statement strong enough to satisfy the legal-aid family.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://health.hawaii.gov/ddd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.hawaii.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.hawaii.gov/earlystart
- special_education_idea_part_b: legacy_state_grade; samples=0
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.hawaiipublicschools.org/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://health.hawaii.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.hawaiidisabilityrights.org/
- parent_training_information_center: verified_state_grade; samples=1; first=http://www.ldahawaii.org/
- legal_aid: blocked_reviewed_statewide_support_source_not_explicit_legal_aid_route; samples=1; first=http://www.hawaiidisabilityrights.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.hawaii.gov/locations

## Next actions

- [major] special_education_idea_part_b: author_verified_state_manifest
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] legal_aid: hold_blocked_until_reviewed_first_party_legal_help_route_is_verified
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Hawaii no longer belongs in UNSTARTED. Reviewed first-party Hawaii Disability Rights Center and LDAH evidence already on disk now truthfully upgrades statewide Protection and Advocacy plus the Parent Training and Information Center from stale missing or inventory-only packet states.
- Hawaii Disability Rights Center is explicit enough for Protection and Advocacy because the saved first-party artifact preserves that the organization was created to provide protection and advocacy for people with disabilities in Hawaii and exposes direct apply-for-assistance routing.
- LDAH is explicit enough for PTI because the saved first-party artifact preserves Hawai'i & Pacific Island Parent Training & Information Center designation text and direct Honolulu office contact details, even though the lightweight parser originally rejected the page after missing contact signals rendered through injected footer markup.
- Hawaii legal aid remains blocked because the reviewed Hawaii Disability Rights Center homepage preserves rights, casework, and assistance-routing language, but it does not preserve an explicit statewide legal-aid or legal-representation route strong enough to satisfy the legal-aid family by itself.
- Hawaii still cannot reach California-grade or become index-safe because statewide special-education authority remains legacy-only, district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or statewide locator-style evidence, and statewide legal aid still lacks a reviewed first-party legal-help route.
- Hawaii is therefore terminal BLOCKED, not COMPLETE.
