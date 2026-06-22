# Indiana California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 92
- primary_gap_reason: official_special_education_contact_lane_removed_and_no_official_search_replacement

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_contact_lane_removed (Reviewed 2026-06-22 bounded official Indiana DOE special-education and data-center lanes. The Special Education Director and Local Administrator Contact List is now preserved only inside commented-out HTML on the live special-education page, and the linked Google Sheets edit, export, csv, and preview URLs each return HTTP 410 Gone. The official Indiana DOE site-search lane for this contact-list phrase also returns 404, and the live 2025-2026 Indiana School Directory XLSX remains a generic school/corporation directory rather than a special-education routing source.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed authoritative Parent Center Hub Indiana state leaf plus current INSOURCE first-party pages now preserve both the PTI designation and statewide Indiana family-support routing.)
- legal_aid: verified_state_grade (Indiana Legal Services now provides reviewed statewide first-party legal-aid routing from a live homepage.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed current official Indiana DFR county-map page now preserves county-by-county office details directly in the fetched HTML for all 92 counties. Although the embedded county href paths currently 404, the live official county-map surface itself contains the address, phone, office hours, and zip-routing details needed for county-grade local-office proof.)

## Failure ledger

- district_or_county_education_routing: official_special_education_contact_lane_removed_and_no_official_search_replacement :: Reviewed 2026-06-22 official Indiana DOE Special Education and Data Center pages. The page preserves the Special Education Director and Local Administrator Contact List only inside commented-out HTML, the Google Sheets edit/export/csv/preview paths for spreadsheet 1hRtp2zsG3WtdCf2ma69awNDkxTc65jLn all return HTTP 410 Gone, the bounded Indiana DOE site-search lane for the contact-list phrase returns 404, and the live 2025-2026 Indiana School Directory XLSX remains generic school/corporation metadata instead of district-grade special-education routing evidence.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.in.gov/fssa/ddrs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.indiana.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.indiana.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.in.gov/doe/students/special-education/
- district_or_county_education_routing: blocked_official_contact_lane_removed; samples=3; first=https://www.in.gov/doe/students/special-education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.in.gov/fssa/ddrs
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.in.gov/idr/
- parent_training_information_center: verified_state_grade; samples=3; first=https://www.parentcenterhub.org/findurcenter/indiana/
- legal_aid: verified_state_grade; samples=1; first=https://www.indianalegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=3; first=https://www.in.gov/fssa/dfr/ebt-hoosier-works-card/find-my-local-dfr-office/

## Completion decision

- Indiana still cannot reach California-grade or become index-safe because district-or-county education routing remains unresolved.
- The prior blocker is now sharper: the contact-list lane is not just stale, it is retired across the live Indiana DOE page, all Google Sheets access modes, and the bounded official site-search lane.
- Indiana therefore remains BLOCKED and not index-safe until a reviewed district-grade education routing source replaces the removed contact-list lane.
