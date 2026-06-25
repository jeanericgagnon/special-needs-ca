# Oklahoma California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 77
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_current_official_state_school_directory (the official Oklahoma State School and District Directory now clears county-grade education routing. The live OSDE State School Directory page explicitly says OSDE-accredited education contact information can be downloaded or browsed by district or school site and includes physical addresses, mailing addresses, phone numbers, email addresses, website URLs and more. That page also exposes live official School Directory and District Directory download links on the current Oklahoma.gov education host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Oklahoma evidence preserves statewide disability-rights and advocacy identity)
- parent_training_information_center: verified_state_grade (reviewed first-party Oklahoma Parents Center evidence preserves statewide Parent Training and Information identity and Oklahoma special-education support language)
- legal_aid: verified_state_grade (reviewed first-party Legal Aid Services of Oklahoma evidence preserves statewide legal-aid identity and Oklahoma-specific help language)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-25 exact official Oklahoma county health department fallback pairs for the remaining county-local gap. Each previously unresolved county now has a live county-specific root on `oklahoma.gov/health/locations/county-health-departments/*` that preserves county identity plus local address and phone, and each same-county root or services leaf preserves disability/benefit-adjacent routing evidence such as `SoonerStart`, `SoonerCare`, `Oklahoma Medicaid`, `Community Health Worker`, or explicit applications-and-referrals language. The reviewed county health department pair therefore provides a truthful county-local fallback contract for all 31 previously unresolved Oklahoma counties instead of relying on the partial OKDHS widget or child-support-only tree.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://oklahoma.gov/okdhs/services/dds/hcbs/eligibility.html
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.oklahoma.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.oklahoma.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://sde.ok.gov/
- district_or_county_education_routing: verified_current_official_state_school_directory; samples=4; first=https://oklahoma.gov/education/resources/state-school-directory.html
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://oklahoma.gov/okdhs/services/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://okdlc.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://oklahomaparentscenter.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.legalaidok.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=5; first=https://oklahoma.gov/health/locations/county-health-departments/adair-county-health-department

## Next actions

- [info] maintenance: Preserve Oklahoma as COMPLETE/index_safe and rerun only maintenance truth audits unless the official Oklahoma county health department office or services contracts regress.

## County-local repair

- Reviewed 2026-06-25 exact official Oklahoma county health department fallback pairs for the remaining county-local gap. Each previously unresolved county now has a live county-specific root on `oklahoma.gov/health/locations/county-health-departments/*` that preserves county identity plus local address and phone, and each same-county root or services leaf preserves disability/benefit-adjacent routing evidence such as `SoonerStart`, `SoonerCare`, `Oklahoma Medicaid`, `Community Health Worker`, or explicit applications-and-referrals language. The reviewed county health department pair therefore provides a truthful county-local fallback contract for all 31 previously unresolved Oklahoma counties instead of relying on the partial OKDHS widget or child-support-only tree.
- The county-health fallback explicitly closes these 31 previously unresolved counties: Adair, Beaver, Blaine, Cimarron, Coal, Dewey, Ellis, Grant, Greer, Harmon, Harper, Haskell, Hughes, Jefferson, Kingfisher, Kiowa, Logan, Major, Marshall, McClain, McIntosh, Murray, Noble, Nowata, Okfuskee, Pawnee, Roger Mills, Seminole, Tillman, Washita, Woods.
- The fallback is county-grade because each county now has a county-named official root plus a same-county services page or root carrying disability/benefit-adjacent routing evidence.
- This replaces the partial OKDHS widget and child-support-only county tree as the controlling local proof lane.

## Completion decision

- Oklahoma is now `COMPLETE` and `index_safe=true`.
- Education remains cleared by the current official OSDE State School and District Directory.
- County-local now clears from the official Oklahoma county health department root-plus-services fallback across the full 77-county baseline.
- Oklahoma can therefore remain broadly indexed under the current California-grade gate.
