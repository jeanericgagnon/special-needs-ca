# Nevada California-Grade Batch 75 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 17
- primary_gap_reason: legacy_local_locator_root_redirects_to_generic_dhs_homepage

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (the official Nevada School and District Information page enumerates all 17 county district websites, and bounded live probes confirmed each district-owned homepage is reachable)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party NDALC evidence explicitly identifies Nevada’s federally mandated protection and advocacy system)
- parent_training_information_center: verified_state_grade (reviewed first-party Nevada PEP evidence preserves statewide family support, training, and Department of Education-backed services)
- legal_aid: verified_state_grade (reviewed first-party NDALC evidence preserves statewide disability legal-rights routing through the Nevada Disability Advocacy and Law Center)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_legacy_local_locator_root_redirects_to_generic_dhs_homepage (the legacy Nevada local-resource root now redirects to the generic DHS homepage, and reviewed DHS contact/location guesses do not preserve county office rows)

## Failure ledger

- county_local_disability_resources: legacy_local_locator_root_redirects_to_generic_dhs_homepage :: Reviewed 2026-06-23 probes confirmed that `https://dhhs.nv.gov/locations` and `https://dhhs.nv.gov/Locations/` both redirect to the generic Nevada Department of Human Services homepage at `https://www.dhs.nv.gov/`, while reviewed DHS contact/location guesses such as `/Contact/Office_Locations/` 404 and no county office directory or county-owned local routing leaves are preserved on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://adsd.nv.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.nevada.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.nevada.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://doe.nv.gov/Special_Education/
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://doe.nv.gov/school-and-district-information
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://adsd.nv.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://ndalc.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://nvpep.org/
- legal_aid: verified_state_grade; samples=1; first=https://ndalc.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_legacy_local_locator_root_redirects_to_generic_dhs_homepage; samples=3; first=https://dhhs.nv.gov/locations

## Next actions

- [critical] county_local_disability_resources: author_exact_county_local_resource_targets

## Completion decision

- Nevada no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide evidence for protection and advocacy, parent-training support, disability legal-rights routing, and county-to-district education routing.
- NDALC is preserved as strong statewide proof because the saved first-party page explicitly says it is Nevada’s federally mandated protection and advocacy system and preserves disability legal-rights language.
- Nevada PEP is preserved as strong statewide PTI-style support because the saved first-party page preserves statewide family information, support, training, and statewide contact routing plus Department of Education support.
- Nevada education routing upgrade: the live official School and District Information page now enumerates all 17 county school district websites, and bounded live probes confirmed every listed district-owned homepage is reachable.
- Nevada still cannot reach California-grade or become index-safe because the county/local disability-resources lane now fails closed on a sharper blocker: the old `dhhs.nv.gov/locations` root redirects to the generic DHS homepage, and reviewed DHS contact/location guesses still do not preserve a county office directory or other county-owned local routing leaves.
- Nevada is therefore terminal BLOCKED, not COMPLETE.
