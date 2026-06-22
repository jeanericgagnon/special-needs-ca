# Connecticut California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 8
- primary_gap_reason: authenticated_public_edsight_directory_and_dds_pdf_archive_local_routing_are_the_last_connecticut_local_proof_blockers

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_public_edsight_shell_plus_sas_logon_query (Reviewed 2026-06-22 bounded live checks on the current Public EdSight district-finder shell https://public-edsight.ct.gov/overview/find-schools/find-school-district and its linked official OrgSearchReport endpoint https://edsight.ct.gov/SASStoredProcess/do?_keyword=&_program=%2FCTDOE%2FEdSight%2FRelease%2FReporting%2FPublic%2FReports%2FStoredProcesses%2FOrgSearchReport_SiteCore&orgtype=&orgdistrict=&orgname=Hartford&_select=Submit. The public shell renders anonymous navigation only, while the direct district query bounces to SAS Logon instead of returning public district records, so the official state directory surface still does not preserve county- or district-grade routing contacts that can replace Connecticut's statewide SDE fallback rows.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (The live first-party CPAC About page now explicitly preserves federally funded Parent Training and Information (PTI) Center designation text.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_dds_replacement_needs_pdf_or_archive_extraction (Reviewed 2026-06-22 bounded live checks on the current Connecticut DDS regions hub https://portal.ct.gov/dds/about/dds-regions plus its linked official regional-contact-list PDF https://portal.ct.gov/-/media/DDS/Commissioner/Regional_Contact_List.pdf and town-finder archive https://portal.ct.gov/dds/searchable-archive/general/regionstownfinder/townfinder1. The live DDS hub is real, but the actionable local-routing evidence now lives in an unparsed PDF and searchable-archive town-finder path, while the older direct regional-office URLs from the sitemap return HTTP 404. Connecticut therefore has a reviewed official replacement source family, but not yet county-grade extracted local office evidence that can truthfully replace the DOI-backed office rows.)

## Failure ledger

- district_or_county_education_routing: public_edsight_shell_does_not_yield_anonymous_district_records :: Reviewed 2026-06-22 bounded live checks on the current Public EdSight district-finder shell https://public-edsight.ct.gov/overview/find-schools/find-school-district and its linked official OrgSearchReport endpoint https://edsight.ct.gov/SASStoredProcess/do?_keyword=&_program=%2FCTDOE%2FEdSight%2FRelease%2FReporting%2FPublic%2FReports%2FStoredProcesses%2FOrgSearchReport_SiteCore&orgtype=&orgdistrict=&orgname=Hartford&_select=Submit. The public shell renders anonymous navigation only, while the direct district query bounces to SAS Logon instead of returning public district records, so the official state directory surface still does not preserve county- or district-grade routing contacts that can replace Connecticut's statewide SDE fallback rows.
- county_local_disability_resources: dds_regions_replacement_is_pdf_plus_archive_not_county_extracted :: Reviewed 2026-06-22 bounded live checks on the current Connecticut DDS regions hub https://portal.ct.gov/dds/about/dds-regions plus its linked official regional-contact-list PDF https://portal.ct.gov/-/media/DDS/Commissioner/Regional_Contact_List.pdf and town-finder archive https://portal.ct.gov/dds/searchable-archive/general/regionstownfinder/townfinder1. The live DDS hub is real, but the actionable local-routing evidence now lives in an unparsed PDF and searchable-archive town-finder path, while the older direct regional-office URLs from the sitemap return HTTP 404. Connecticut therefore has a reviewed official replacement source family, but not yet county-grade extracted local office evidence that can truthfully replace the DOI-backed office rows.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://portal.ct.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.connecticut.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.connecticut.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://portal.ct.gov/sde/special-education
- district_or_county_education_routing: blocked_public_edsight_shell_plus_sas_logon_query; samples=2; first=https://public-edsight.ct.gov/overview/find-schools/find-school-district
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://portal.ct.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disrightsct.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://cpacinc.org/about.aspx
- legal_aid: verified_state_grade; samples=1; first=https://www.disrightsct.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_dds_replacement_needs_pdf_or_archive_extraction; samples=3; first=https://portal.ct.gov/dds/about/dds-regions

## Next actions

- [critical] district_or_county_education_routing: author_district_owned_exact_targets_or_browser_auth_edsight_query
- [critical] county_local_disability_resources: extract_dds_regions_pdf_or_archive_townfinder

## Completion decision

- Connecticut still cannot reach California-grade or become index-safe because the official education directory surface stops at a public finder shell plus a SAS-logon-gated district query, and the official DDS replacement for local office routing now lives in a PDF-plus-archive stack that has not yet been extracted into county-grade evidence.
- CPAC is no longer a blocker because the live first-party About page explicitly preserves federally funded Parent Training and Information (PTI) Center designation text.
- Connecticut is therefore still BLOCKED and not index-safe, but the remaining blockers are now narrowed to one authenticated education directory lane and one PDF/archive local-office extraction lane.
