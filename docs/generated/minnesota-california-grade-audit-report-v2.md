# Minnesota California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 87
- primary_gap_reason: mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_mdeorg_root_live_but_actionable_child_routes_are_title_only_radware_shells (The Minnesota education blocker is now narrower and more exact: the MDE-ORG description page and root are live in bounded official fetches, but the actionable child routes and analytics lane still resolve to title-bearing Radware shells without county, district, or contact content. That means the public entrypoint exists, but no reproducible county-grade directory or export contract is actually reviewable in the low-token lane.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page. It explicitly says MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in Minnesota, which is enough to verify the protection_and_advocacy family at statewide grade.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-23 the authoritative Parent Center Hub Minnesota state leaf at https://www.parentcenterhub.org/findurcenter/minnesota/. The live page explicitly preserves `Minnesota PTI`, names PACER Center, Inc., and preserves direct Minnesota contact details on an authoritative national PTI directory. That authoritative state-specific PTI designation is enough to verify the parent_training_information_center family even though PACER’s own current first-party pages no longer repeat the explicit PTI label and the older `/parent/php/PIC/` path family now returns HTTP 404.)
- legal_aid: verified_state_grade (Reviewed Mid-Minnesota Legal Aid preserves a live statewide legal-aid access route on first-party pages.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_replatformed_mn_dhs_family_on_live_radware_captcha (The Minnesota county-local blocker is now sharper: the legacy `.jsp` path is stale, and the modern DHS replacements do not merely redirect vaguely. In browser review, the exact county-and-tribal and county-tribal-directory replacements land on live `validate.perfdrive.com` / Radware Bot Manager captcha pages that demand human validation before any county-grade content is exposed. That means the replatformed official family exists, but the current low-token lane still cannot reach a reviewable county-or-tribal office contract.)

## Failure ledger

- district_or_county_education_routing: official_mdeorg_root_is_live_but_child_routes_and_analytics_are_title_only_radware_shells :: Reviewed 2026-06-23 bounded official Minnesota MDE education surfaces after the earlier flapping-root blocker. The official description page at https://education.mn.gov/MDE/about/SchOrg/ is live and still describes MDE-ORG as a searchable database that can generate files from search parameters. In the same bounded pass, the MDE-ORG root at https://pub.education.mn.gov/MdeOrgView/ also loaded live with title `MDE Organization Reference Glossary` and exposed first-party links for districts, counties, contacts, and analytics. But the actionable child routes did not produce a usable county-grade contract: https://pub.education.mn.gov/MdeOrgView/districts/index => HTTP 200 title `Schools and Districts` with Radware shell text and no real district inventory; https://pub.education.mn.gov/MdeOrgView/reference/county => HTTP 200 title `Minnesota Counties` with Radware shell text and no county list; https://pub.education.mn.gov/MdeOrgView/search/searchContacts => HTTP 200 title `Search Organization Contacts` with Radware shell text and no contact directory; https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList => HTTP 200 title `Contacts` with Radware shell text and no contact-type content; https://pub.education.mn.gov/MDEAnalytics/Data.jsp => HTTP 200 title `Data Reports and Analytics` but still only a title-bearing challenge shell rather than a stable export contract. Minnesota therefore still lacks a reproducible county-grade district routing contract, but the blocker is now precisely title-bearing Radware shells on the actionable first-party routes rather than a fully dead root.
- county_local_disability_resources: replatformed_mn_dhs_county_tribal_family_lands_on_live_radware_captcha :: Reviewed 2026-06-23 bounded browser checks on the exact Minnesota DHS county-and-tribal routing replacements. The legacy `county-and-tribal-offices.jsp` path remains stale, but the slash replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/ now lands on a live `validate.perfdrive.com` Radware Bot Manager captcha page titled `Radware Bot Manager Captcha` with body text `Please validate your request` and `Complete this task to confirm you are a human generating this request.` The adjacent replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/ also resolves into the same validate.perfdrive.com captcha family. Minnesota therefore still lacks a reviewed county-grade local office contract in bounded low-token mode, but the blocker is now precisely a live replatformed DHS family fronted by Radware captcha rather than one bad redirect guess.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: blocked_mdeorg_root_live_but_actionable_child_routes_are_title_only_radware_shells; samples=5; first=https://pub.education.mn.gov/MdeOrgView/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: verified_state_grade; samples=2; first=https://mylegalaid.org/disability-law-center/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/minnesota/
- legal_aid: verified_state_grade; samples=1; first=https://mylegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: blocked_replatformed_mn_dhs_family_on_live_radware_captcha; samples=3; first=https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_first_party_mdeorg_child_route_capture_or_stable_export_contract_exists
- [critical] county_local_disability_resources: hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_contract_exists

## Completion decision

- Minnesota remains BLOCKED and index_safe=false.
- district_or_county_education_routing remains blocked because the MDE-ORG description page and root are live, but the district, county, contact, and analytics routes still only expose title-bearing Radware shells instead of a reproducible county-grade directory or export contract.
- county_local_disability_resources remains blocked on the separate DHS county-and-tribal captcha family.
- parent_training_information_center is verified at statewide grade and is not a remaining blocker.
