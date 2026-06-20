# Official State Domain Repair Pack

Generated: 2026-06-18

This pack turns fake/generated official source targets into an explicit repair queue instead of leaving them buried in scaffold data.

## Summary

- total repair rows: 308
- states affected: 43
- rows with exact replacement candidates: 113
- rows with first-party root-hint-only candidates: 40
- rows with weak third-party hint-only candidates: 37
- rows with no candidate yet: 118

## By Lane

- medicaid_county_directory: 40
- early_intervention: 40
- waiver_program: 40
- vocational_rehabilitation: 40
- dd_state_directory: 40
- forms_library: 37
- special_education: 35
- education_routing: 35
- official_program: 1

## By Replacement Mode

- no_candidate_yet: 118
- exact_candidate_available: 113
- first_party_root_hint_only: 40
- third_party_cross_state_hint_only: 37

## Highest-Need States

- arizona: total=8, exactCandidates=3
- colorado: total=8, exactCandidates=3
- connecticut: total=8, exactCandidates=3
- hawaii: total=8, exactCandidates=3
- indiana: total=8, exactCandidates=3
- iowa: total=8, exactCandidates=3
- kansas: total=8, exactCandidates=3
- kentucky: total=8, exactCandidates=3
- louisiana: total=8, exactCandidates=3
- maine: total=8, exactCandidates=3
- maryland: total=8, exactCandidates=3
- massachusetts: total=8, exactCandidates=3
- michigan: total=8, exactCandidates=3
- mississippi: total=8, exactCandidates=3
- missouri: total=8, exactCandidates=3
- montana: total=8, exactCandidates=3
- nebraska: total=8, exactCandidates=2
- nevada: total=8, exactCandidates=3
- new-hampshire: total=8, exactCandidates=2
- new-mexico: total=8, exactCandidates=0

## Sample Repair Rows

- alabama | programs | special_education | https://www.alabama-education.gov/ | third_party_cross_state_hint_only
- alabama | regional_education_agencies | education_routing | https://www.alabama-education.gov/regional | no_candidate_yet
- alaska | county_offices | medicaid_county_directory | https://dhhs.alaska.gov/ | first_party_root_hint_only
- alaska | programs | early_intervention | https://dhhs.alaska.gov/earlyintervention | no_candidate_yet
- alaska | programs | waiver_program | https://dhhs.alaska.gov/dd/waivers | exact_candidate_available
- alaska | programs | vocational_rehabilitation | https://dhhs.alaska.gov/rehab | no_candidate_yet
- alaska | state_resource_agencies | dd_state_directory | https://dhhs.alaska.gov/dd | exact_candidate_available
- arizona | county_offices | medicaid_county_directory | https://dhhs.arizona.gov/ | first_party_root_hint_only
- arizona | forms | forms_library | https://dhhs.arizona.gov/forms | exact_candidate_available
- arizona | programs | special_education | https://education.arizona.gov/ | third_party_cross_state_hint_only
- arizona | programs | early_intervention | https://dhhs.arizona.gov/earlyintervention | no_candidate_yet
- arizona | programs | waiver_program | https://dhhs.arizona.gov/dd/waivers | exact_candidate_available
- arizona | programs | vocational_rehabilitation | https://dhhs.arizona.gov/rehab | no_candidate_yet
- arizona | regional_education_agencies | education_routing | https://education.arizona.gov/regional | no_candidate_yet
- arizona | state_resource_agencies | dd_state_directory | https://dhhs.arizona.gov/dd | exact_candidate_available
- arkansas | county_offices | medicaid_county_directory | https://dhhs.arkansas.gov/ | first_party_root_hint_only
- arkansas | programs | special_education | https://education.arkansas.gov/ | third_party_cross_state_hint_only
- arkansas | programs | early_intervention | https://dhhs.arkansas.gov/earlyintervention | no_candidate_yet
- arkansas | programs | waiver_program | https://dhhs.arkansas.gov/dd/waivers | exact_candidate_available
- arkansas | programs | vocational_rehabilitation | https://dhhs.arkansas.gov/rehab | no_candidate_yet

## Files

- JSON pack: data/source_packs/official_state_domain_repairs.json
- Markdown report: docs/generated/official-state-domain-repair-pack-2026-06-18.md
