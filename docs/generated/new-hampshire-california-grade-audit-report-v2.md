# New Hampshire California-Grade Batch 76 Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 10
- primary_gap_reason: official_education_and_dhhs_local_directory_paths_blocked_or_stale

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked (official school and district directory paths returned HTTP 403 in bounded fetch, so generic statewide fallback evidence was removed)
- vocational_rehabilitation_pre_ets: blocked (legacy VR root is unresolvable and the likely official BVR path returned HTTP 403 in bounded fetch)
- protection_and_advocacy: verified_state_grade (Disability Rights Center - New Hampshire history and funding pages preserve statewide P&A designation and PADD-backed authority)
- parent_training_information_center: verified_state_grade (reviewed first-party Parent Information Center of NH evidence preserves statewide parent-center identity, special-education support, and Department of Education funding)
- legal_aid: verified_state_grade (New Hampshire Legal Assistance plus 603 Legal Aid preserve statewide civil legal aid and statewide intake routing)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked (official DHHS district-office and contact paths returned HTTP 403 in bounded fetch, so non-county-owned fallback evidence was removed)

## Failure ledger

- district_or_county_education_routing: official_school_directory_paths_return_403_in_bounded_fetch :: `education.nh.gov` root plus exact school/district directory leaves returned HTTP 403 in bounded fetch, so generic statewide fallback evidence no longer counts.
- vocational_rehabilitation_pre_ets: legacy_vr_root_unresolvable_and_official_bvr_paths_403 :: legacy exact root `dhhs.new-hampshire.gov/rehab` no longer resolves and the likely official Bureau of Vocational Rehabilitation path on `education.nh.gov` returned HTTP 403.
- county_local_disability_resources: official_dhhs_district_office_paths_return_403_in_bounded_fetch :: official DHHS district-office and contact leaves returned HTTP 403 in bounded fetch, so DOI-backed structural fallback evidence no longer counts.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhhs.new-hampshire.gov/dd/waivers
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.new-hampshire.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.new-hampshire.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.education.nh.gov/
- district_or_county_education_routing: blocked_official_school_directory_paths_return_403_in_bounded_fetch; samples=3; first=https://www.education.nh.gov/
- vocational_rehabilitation_pre_ets: blocked_legacy_vr_root_unresolvable_and_official_bvr_paths_403; samples=2; first=https://dhhs.new-hampshire.gov/rehab
- protection_and_advocacy: verified_state_grade; samples=2; first=https://drcnh.org/about-us/history/
- parent_training_information_center: verified_state_grade; samples=1; first=https://picnh.org/
- legal_aid: verified_state_grade; samples=2; first=https://www.nhla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_dhhs_district_office_paths_return_403_in_bounded_fetch; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: browser_or_alternate_client_probe_of_official_school_directory_paths
- [major] vocational_rehabilitation_pre_ets: browser_or_alternate_client_probe_of_official_vr_paths
- [critical] county_local_disability_resources: browser_or_alternate_client_probe_of_official_dhhs_district_office_paths

## Completion decision

- New Hampshire no longer belongs in UNSTARTED because the packet already preserves reviewed first-party PTI evidence on disk instead of only legacy inventory hints.
- PICNH is preserved as strong statewide PTI-style support because the saved first-party pages explicitly preserve Parent Information Center identity, special-education support language, direct contact routing, and Department of Education funding support.
- DRCNH is now preserved as strong statewide P&A evidence because its first-party history page preserves governor designation as New Hampshire's protection and advocacy agency and its funding page preserves PADD-backed authority.
- NHLA plus 603 Legal Aid are now preserved as strong statewide legal-aid evidence because they preserve New Hampshire-specific free civil legal aid and statewide intake routing.
- New Hampshire still cannot reach California-grade or become index-safe because district or county education routing is blocked on official `education.nh.gov` directory paths returning HTTP 403, county/local disability resources are blocked on official DHHS district-office/contact paths returning HTTP 403, and vocational rehabilitation is blocked on a stale exact root plus official BVR paths returning HTTP 403.
- New Hampshire is therefore terminal BLOCKED, not COMPLETE.
