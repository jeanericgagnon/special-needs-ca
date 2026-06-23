# Michigan California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 83
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-23 the official Michigan CEPI Educational Entity Master Public Data Sets page with a session-backed ASP.NET replay that preserved the page-owned hidden fields and session cookie. The exact public download contract returned real CSV attachments for both ISD District and LEA District entity types on ReportViewer.aspx instead of a viewstate error. The LEA District export preserves EntityCountyName, district names, district email, district phone, and physical address fields, and a bounded completeness check confirmed at least one LEA row with both email and phone in all 83 Michigan counties. Michigan therefore now has a reproducible official county-grade education-routing contract.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Michigan Legal Help first-party homepage preserves a statewide legal-help and legal-aid access route.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-22 the official MDHHS county-offices root, the East Michigan, Urban Counties, U.P. and Northern Michigan, and West Michigan region pages, and the exact missing county leaves for Alger, Alpena, Ingham, Lenawee, and St. Joseph. Those reviewed first-party leaf pages close the previous 78-county plus one combined-leaf contract and now preserve a full 83-county official MDHHS county-office lane.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.michigan.gov/mde/services/special-education
- district_or_county_education_routing: verified_county_grade; samples=83; first=https://cepi.state.mi.us/EEM/PublicDatasets.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drmich.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.michiganallianceforfamilies.org/
- legal_aid: verified_state_grade; samples=1; first=https://michiganlegalhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=6; first=https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices

## Next actions

- [info] maintenance: Preserve Michigan as COMPLETE/index_safe and rerun only maintenance truth audits unless CEPI export behavior regresses.

## Michigan repair decision

- District or county education routing is now verified because the official CEPI public dataset page returns stable ISD District and LEA District CSV attachments when replayed inside one session with the page-owned hidden fields.
- County-grade completeness is satisfied because the live LEA District export preserves county names plus district email and phone coverage across 83/83 Michigan counties.
- The ArcGIS boundary stack remains supporting evidence only; the actual county-grade routing closure comes from the stable official CEPI export rather than generic statewide fallback pages.
- Michigan is therefore California-grade COMPLETE and index-safe so long as future maintenance audits keep the official CEPI export contract live.

## Evidence checks

- CEPI public dataset lane: Reviewed 2026-06-23 the live `PublicDatasets.aspx` page and confirmed it exposes public ISD District and LEA District entity types plus CSV, Excel, and XML format choices.
- Stable replay: A bounded session-backed replay posted the page-owned hidden ASP.NET fields plus the selected entity-type checkbox and returned `ReportViewer.aspx` CSV attachments instead of a viewstate MAC error.
- County-grade coverage: The LEA District export preserves `EntityCountyName`, district names, district email, district phone, and physical address fields; a bounded completeness audit confirmed at least one email-and-phone district row in all 83 Michigan counties.

## Final family count

- strong_critical_families: 12
- weak_critical_families: 0
- missing_critical_families: 0
- district_or_county_education_routing: verified_county_grade
