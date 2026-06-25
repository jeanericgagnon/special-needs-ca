# Minnesota California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 87
- primary_gap_reason: mde_description_page_is_live_but_mdeorg_root_district_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_mde_description_page_live_but_mdeorg_root_and_child_routes_are_radware_blocked (Minnesota education remains blocked, and the live public contract is now narrower than the prior packet implied. A bounded 2026-06-25 recheck showed the MDE description page still loading publicly on the official host, but the MDE-ORG glossary root itself and every actionable child route checked in low-token mode now redirect into Radware captcha pages. That includes the root, district, county, contact-search, contact-type, and analytics routes, so there is still no reproducible county-grade district routing or export contract.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page. It explicitly says MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in Minnesota, which is enough to verify the protection_and_advocacy family at statewide grade.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-23 the authoritative Parent Center Hub Minnesota state leaf at https://www.parentcenterhub.org/findurcenter/minnesota/. The live page explicitly preserves `Minnesota PTI`, names PACER Center, Inc., and preserves direct Minnesota contact details on an authoritative national PTI directory. That authoritative state-specific PTI designation is enough to verify the parent_training_information_center family even though PACER’s own current first-party pages no longer repeat the explicit PTI label and the older `/parent/php/PIC/` path family now returns HTTP 404.)
- legal_aid: verified_state_grade (Reviewed Mid-Minnesota Legal Aid preserves a live statewide legal-aid access route on first-party pages.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_mn_dhs_successor_county_tribal_state_directory_is_bot_gated (Minnesota county-local routing remains blocked, but the exact first-party picture is now sharper. The saved disability-services replacement URLs still return official DHS 404 pages, and the same official DHS shell exposes a likely successor route named `Minnesota Health Care Program county, Tribal and state directory`. But that exact successor route is also bot-gated behind a Radware challenge in bounded fetches, so there is still no reviewable county-grade local office contract on public first-party DHS surfaces.)

## Failure ledger

- district_or_county_education_routing: official_mde_description_page_is_live_but_mdeorg_root_district_county_contact_and_analytics_routes_are_all_radware_blocked :: Reviewed 2026-06-25 bounded official Minnesota MDE education surfaces. The description page at https://education.mn.gov/MDE/about/SchOrg/ returned HTTP 200 with title `Schools and Organizations (MDE-ORG)`. But a fresh exact recheck showed the MDE-ORG glossary root at https://pub.education.mn.gov/MdeOrgView/, the district route at https://pub.education.mn.gov/MdeOrgView/districts/index, the county route at https://pub.education.mn.gov/MdeOrgView/reference/county, the contact-search route at https://pub.education.mn.gov/MdeOrgView/search/searchContacts, the contact-type route at https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList, and the analytics route at https://pub.education.mn.gov/MDEAnalytics/Data.jsp all returning HTTP 302 redirects into `validate.perfdrive.com` with title `Radware Captcha Page`. Minnesota therefore still lacks a reviewable county-grade district routing contract in low-token mode, and the current truth is stricter than the prior packet: only the description page is stably public while the root plus all actionable MDE-ORG child routes are bot-gated.
- county_local_disability_resources: official_mn_dhs_404_shell_points_to_successor_county_tribal_state_directory_but_that_route_is_radware_blocked :: Reviewed 2026-06-25 bounded official Minnesota DHS county-and-tribal surfaces. The saved disability-services replacement URLs still return official DHS 404 pages, including https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/. The official DHS shell also exposes an exact successor contact route at https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp labeled `Minnesota Health Care Program county, Tribal and state directory`, but a fresh exact recheck showed that successor returning HTTP 302 into `validate.perfdrive.com` / `Radware Bot Manager Captcha`. Minnesota therefore still lacks a reviewable county-grade county/tribal office contract on public first-party DHS surfaces.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: blocked_mde_description_page_live_but_mdeorg_root_and_child_routes_are_radware_blocked; samples=5; first=https://education.mn.gov/MDE/about/SchOrg/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: verified_state_grade; samples=2; first=https://mylegalaid.org/disability-law-center/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/minnesota/
- legal_aid: verified_state_grade; samples=1; first=https://mylegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: blocked_mn_dhs_successor_county_tribal_state_directory_is_bot_gated; samples=3; first=https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_first_party_mdeorg_root_or_export_contract_stays_public
- [critical] county_local_disability_resources: hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_state_directory_stays_public

## Completion decision

- Minnesota remains BLOCKED and index_safe=false.
- district_or_county_education_routing remains blocked because only the official MDE description page is stably public in bounded fetches; the MDE-ORG root plus district, county, contact, and analytics routes all redirect into Radware and do not yield a reproducible county-grade contract.
- county_local_disability_resources remains blocked because the reviewed DHS disability-services replacements still 404 and the exact named successor county/tribal/state directory route is also bot-gated.
- parent_training_information_center remains verified and is not a current blocker.
