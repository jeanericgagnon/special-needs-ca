# Connecticut California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 8
- primary_gap_reason: public_edsight_shell_does_not_yield_anonymous_district_records

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
- county_local_disability_resources: verified_state_grade (Connecticut DDS county-local routing is now recoverable from live official first-party pages: the DDS Regions hub names the counties served by North, South, and West, and the public regional general-contact pages preserve region headquarters, satellite offices, phones, emails, and toll-free numbers. New Haven county remains dual-routed because the official hub assigns New Haven broadly to South while explicitly assigning Northern New Haven to West.)

## Failure ledger

- district_or_county_education_routing: public_edsight_shell_does_not_yield_anonymous_district_records :: Reviewed 2026-06-22 bounded live checks on the current Public EdSight district-finder shell https://public-edsight.ct.gov/overview/find-schools/find-school-district and its linked official OrgSearchReport endpoint https://edsight.ct.gov/SASStoredProcess/do?_keyword=&_program=%2FCTDOE%2FEdSight%2FRelease%2FReporting%2FPublic%2FReports%2FStoredProcesses%2FOrgSearchReport_SiteCore&orgtype=&orgdistrict=&orgname=Hartford&_select=Submit. The public shell renders anonymous navigation only, while the direct district query bounces to SAS Logon instead of returning public district records, so the official state directory surface still does not preserve county- or district-grade routing contacts that can replace Connecticut's statewide SDE fallback rows.

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
- county_local_disability_resources: verified_state_grade; samples=9; first=https://portal.ct.gov/dds/about/dds-regions

## Next actions

- [critical] district_or_county_education_routing: author_district_owned_exact_targets_or_browser_auth_edsight_query

## Completion decision

- Connecticut still cannot reach California-grade or become index-safe because the official education directory surface stops at a public finder shell plus a SAS-logon-gated district query.
- County/local disability resources are no longer blocked: the live DDS Regions hub names the counties served by North, South, and West, and the public region contact pages preserve headquarters, satellite offices, phones, and emails for those routes.
- New Haven county remains dual-routed in the evidence chain because the official DDS hub assigns the county broadly to South while explicitly assigning Northern New Haven to West; that is preserved as a truthful multi-region county mapping rather than flattened into one fake county office.
- Connecticut therefore remains BLOCKED and not index-safe, but the remaining blocker is now narrowed to the authenticated state education directory lane only.
