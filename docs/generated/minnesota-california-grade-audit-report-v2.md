# Minnesota California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 87
- primary_gap_reason: live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked (Minnesota education remains blocked, but the blocker is now narrower and more truthful. A bounded 2026-06-24 live recheck showed the MDE-ORG description page, glossary root, and `Schools and Districts` route all loading publicly on official Minnesota hosts. But the county route, contact search route, contact-type route, and analytics export route still collapse into Radware captcha pages, so there is still no reproducible county-grade district routing or export contract.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page. It explicitly says MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in Minnesota, which is enough to verify the protection_and_advocacy family at statewide grade.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-23 the authoritative Parent Center Hub Minnesota state leaf at https://www.parentcenterhub.org/findurcenter/minnesota/. The live page explicitly preserves `Minnesota PTI`, names PACER Center, Inc., and preserves direct Minnesota contact details on an authoritative national PTI directory. That authoritative state-specific PTI designation is enough to verify the parent_training_information_center family even though PACER’s own current first-party pages no longer repeat the explicit PTI label and the older `/parent/php/PIC/` path family now returns HTTP 404.)
- legal_aid: verified_state_grade (Reviewed Mid-Minnesota Legal Aid preserves a live statewide legal-aid access route on first-party pages.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_mn_dhs_saved_county_tribal_replacements_are_official_404s (Minnesota county-local routing remains blocked, but the live blocker changed. The saved DHS county-and-tribal replacement URLs no longer present a reviewable public directory or even a live captcha gate in bounded fetches. On 2026-06-24 both saved replacement URLs returned official DHS 404 pages, so there is still no county-grade local office contract on the reviewed first-party replacements.)

## Failure ledger

- district_or_county_education_routing: official_mdeorg_root_and_district_page_are_live_but_county_contact_and_analytics_contracts_remain_radware_blocked :: Reviewed 2026-06-24 bounded official Minnesota MDE education surfaces. The description page at https://education.mn.gov/MDE/about/SchOrg/ returned HTTP 200 with title `Schools and Organizations (MDE-ORG)`. The glossary root at https://pub.education.mn.gov/MdeOrgView/ returned HTTP 200 with title `MDE Organization Reference Glossary`, and the district route at https://pub.education.mn.gov/MdeOrgView/districts/index returned HTTP 200 with title `Schools and Districts`. But the county route at https://pub.education.mn.gov/MdeOrgView/reference/county, the contact-search route at https://pub.education.mn.gov/MdeOrgView/search/searchContacts, the contact-type route at https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList, and the analytics route at https://pub.education.mn.gov/MDEAnalytics/Data.jsp all redirected into `validate.perfdrive.com` with title `Radware Captcha Page`. Minnesota therefore still lacks a reviewable county-grade district routing contract in low-token mode, but the current truth is live root plus live district navigation chrome with county/contact/analytics still bot-gated.
- county_local_disability_resources: official_mn_dhs_saved_county_tribal_replacements_now_resolve_to_404_without_public_county_contract :: Reviewed 2026-06-24 bounded official Minnesota DHS county-and-tribal replacements. https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/ returned HTTP 404 with title `404 / Minnesota Department of Human Services`, and https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/ returned the same official DHS 404 page. Minnesota therefore still lacks a reviewable county-grade county/tribal office contract on the saved first-party replacements, and the blocker is now official 404 replacements rather than a live captcha family.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: blocked_live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked; samples=5; first=https://education.mn.gov/MDE/about/SchOrg/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: verified_state_grade; samples=2; first=https://mylegalaid.org/disability-law-center/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/minnesota/
- legal_aid: verified_state_grade; samples=1; first=https://mylegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: blocked_mn_dhs_saved_county_tribal_replacements_are_official_404s; samples=3; first=https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_first_party_mdeorg_county_or_contact_export_contract_exists
- [critical] county_local_disability_resources: hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_successor_exists

## Completion decision

- Minnesota remains BLOCKED and index_safe=false.
- district_or_county_education_routing remains blocked because the official MDE-ORG root and district page are live, but the county, contact, and analytics routes are still Radware-blocked and do not yield a reproducible county-grade contract.
- county_local_disability_resources remains blocked because the reviewed DHS county-and-tribal replacement URLs now resolve to official DHS 404 pages and still do not expose a public local-office contract.
- parent_training_information_center remains verified and is not a current blocker.
