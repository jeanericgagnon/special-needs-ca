# Hawaii California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 5
- primary_gap_reason: official_processing_centers_pdf_covers_four_counties_but_kalawao_unresolved

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (Reviewed live Hawaii DOH Developmental Disabilities Division root now replaces the dead dhhs.hawaii.gov DD sample.)
- early_intervention_part_c: verified_state_grade (Reviewed live official Hawaii Early Intervention Section root and services leaf now replace the fake dhhs.hawaii.gov/earlystart sample and preserve Part C authority plus referral routing.)
- special_education_idea_part_b: verified_state_grade (Reviewed current HIDOE What is Special Education, Child Find, and Special Education Data and Reports pages now preserve statewide special-education authority on an accessible official host.)
- district_or_county_education_routing: verified_state_grade (Reviewed current official HIDOE Complex Area Directory now preserves district and complex-area routing from an accessible first-party page instead of the old statewide root only.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed first-party HDRC Advocacy and Assistance Application pages now preserve explicit legal representation, staff-attorney, grievance/appeals, and assistance-routing evidence for statewide legal-aid coverage.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_pdf_covers_four_counties_kalawao_unresolved (Official Hawaii DHS processing-centers PDF now replaces the DOI fallback for Honolulu, Hawaii, Kauai, and Maui counties, but Kalawao County still lacks explicit reviewed county-grade local-office proof and still points to a dead legacy locator root.)

## Failure ledger

- county_local_disability_resources: official_processing_centers_pdf_covers_four_counties_but_kalawao_unresolved :: Reviewed 2026-06-22 official Hawaii DHS local-office replacements. The official DHS State of Hawaii Processing Centers PDF at https://humanservices.hawaii.gov/wp-content/uploads/2018/04/Statewide-Processing-Centers-04-2018.pdf preserves named local processing centers with addresses and phones for Honolulu County (Kapolei, Koolau, KPT, OR&L, Pohulani, Wahiawa, Waianae, Waipahu), Kauai County (Lihue), Maui County (Maui Public Assistance, Molokai Unit, Lanai Sub-Unit), and Hawaii County (North Hilo, South Hilo, North Kona, South Kona, Kaʻu, Kamuela-Hamakua, Kohala). The only remaining Hawaii county-local gap is Kalawao County: its current row still depends on the dead legacy root https://dhhs.hawaii.gov/locations, and this bounded pass did not recover a reviewed official local-office leaf that explicitly names Kalawao County.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://health.hawaii.gov/ddd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://health.hawaii.gov/ddd/
- early_intervention_part_c: verified_state_grade; samples=2; first=https://health.hawaii.gov/eis/
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://hawaiipublicschools.org/school-services/what-is-special-education/
- district_or_county_education_routing: verified_state_grade; samples=2; first=https://hawaiipublicschools.org/contact/complex-area-directory/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://health.hawaii.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.hawaiidisabilityrights.org/
- parent_training_information_center: verified_state_grade; samples=1; first=http://www.ldahawaii.org/
- legal_aid: verified_state_grade; samples=2; first=https://hawaiidisabilityrights.org/advocacy-legal-representation-systematic-casework/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_pdf_covers_four_counties_kalawao_unresolved; samples=2; first=https://humanservices.hawaii.gov/wp-content/uploads/2018/04/Statewide-Processing-Centers-04-2018.pdf

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_kalawao_county_has_reviewed_official_local_office_or_exception_path

## Completion decision

- Hawaii no longer depends on the fake dhhs early-intervention path; the live official EIS site now preserves statewide Part C authority and referral routing.
- HIDOE special-education authority and district routing now come from accessible current official pages: What is Special Education, Child Find, Special Education Data and Reports, and the Complex Area Directory.
- HDRC now truthfully satisfies statewide legal-aid coverage because its first-party Advocacy and Assistance Application pages explicitly preserve legal representation, staff-attorney, grievance/appeals, and assistance-routing evidence.
- County/local disability resources improved materially: the official DHS processing-centers PDF now covers Honolulu, Hawaii, Kauai, and Maui counties with named local offices, but Kalawao County still lacks explicit reviewed county-grade office proof and still depends on a dead legacy locator root.
- Hawaii therefore remains BLOCKED and not index-safe until Kalawao County has explicit reviewed official local-office coverage or a reviewed official exception path.
