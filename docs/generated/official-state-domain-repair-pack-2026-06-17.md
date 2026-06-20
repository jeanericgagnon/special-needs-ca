# Official State Domain Repair Pack

Generated: 2026-06-17

This pack turns fake/generated official source targets into an explicit repair queue instead of leaving them buried in scaffold data.

## Summary

- total repair rows: 313
- states affected: 43
- rows with exact replacement candidates: 1
- rows with first-party root-hint-only candidates: 1
- rows with weak third-party hint-only candidates: 35
- rows with no candidate yet: 276

## By Lane

- early_intervention: 41
- medicaid_county_directory: 40
- forms_library: 40
- waiver_program: 40
- vocational_rehabilitation: 40
- dd_state_directory: 40
- education_routing: 36
- special_education: 35
- official_program: 1

## By Replacement Mode

- no_candidate_yet: 276
- third_party_cross_state_hint_only: 35
- first_party_root_hint_only: 1
- exact_candidate_available: 1

## Highest-Need States

- arizona: total=8, exactCandidates=0
- arkansas: total=8, exactCandidates=0
- colorado: total=8, exactCandidates=0
- connecticut: total=8, exactCandidates=0
- hawaii: total=8, exactCandidates=0
- idaho: total=8, exactCandidates=0
- indiana: total=8, exactCandidates=0
- iowa: total=8, exactCandidates=0
- kansas: total=8, exactCandidates=0
- kentucky: total=8, exactCandidates=0
- louisiana: total=8, exactCandidates=0
- maine: total=8, exactCandidates=0
- maryland: total=8, exactCandidates=0
- massachusetts: total=8, exactCandidates=0
- michigan: total=8, exactCandidates=0
- mississippi: total=8, exactCandidates=0
- missouri: total=8, exactCandidates=0
- montana: total=8, exactCandidates=0
- nebraska: total=8, exactCandidates=0
- nevada: total=8, exactCandidates=0

## Sample Repair Rows

- alabama | programs | special_education | https://www.alabama-education.gov/ | third_party_cross_state_hint_only
- alabama | regional_education_agencies | education_routing | https://www.alabama-education.gov/regional | no_candidate_yet
- alaska | county_offices | medicaid_county_directory | https://dhhs.alaska.gov/ | no_candidate_yet
- alaska | forms | forms_library | https://dhhs.alaska.gov/forms | no_candidate_yet
- alaska | programs | early_intervention | https://dhhs.alaska.gov/earlyintervention | no_candidate_yet
- alaska | programs | waiver_program | https://dhhs.alaska.gov/dd/waivers | no_candidate_yet
- alaska | programs | vocational_rehabilitation | https://dhhs.alaska.gov/rehab | no_candidate_yet
- alaska | state_resource_agencies | dd_state_directory | https://dhhs.alaska.gov/dd | no_candidate_yet
- arizona | county_offices | medicaid_county_directory | https://dhhs.arizona.gov/ | no_candidate_yet
- arizona | forms | forms_library | https://dhhs.arizona.gov/forms | no_candidate_yet
- arizona | programs | special_education | https://education.arizona.gov/ | third_party_cross_state_hint_only
- arizona | programs | early_intervention | https://dhhs.arizona.gov/earlyintervention | no_candidate_yet
- arizona | programs | waiver_program | https://dhhs.arizona.gov/dd/waivers | no_candidate_yet
- arizona | programs | vocational_rehabilitation | https://dhhs.arizona.gov/rehab | no_candidate_yet
- arizona | regional_education_agencies | education_routing | https://education.arizona.gov/regional | no_candidate_yet
- arizona | state_resource_agencies | dd_state_directory | https://dhhs.arizona.gov/dd | no_candidate_yet
- arkansas | county_offices | medicaid_county_directory | https://dhhs.arkansas.gov/ | no_candidate_yet
- arkansas | forms | forms_library | https://dhhs.arkansas.gov/forms | no_candidate_yet
- arkansas | programs | special_education | https://education.arkansas.gov/ | third_party_cross_state_hint_only
- arkansas | programs | early_intervention | https://dhhs.arkansas.gov/earlyintervention | no_candidate_yet

## Files

- JSON pack: data/source_packs/official_state_domain_repairs.json
- Markdown report: docs/generated/official-state-domain-repair-pack-2026-06-17.md
