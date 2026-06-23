# Minnesota California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 87
- primary_gap_reason: mdeorg_root_and_analytics_routes_flap_to_radware_plus_mn_dhs_local_office_family_is_radware_challenged

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_mdeorg_root_and_analytics_routes_flap_to_radware_without_stable_county_contract (The Minnesota education blocker is now tighter and more current: exact bounded probes no longer support treating the MDE-ORG glossary root as a stable public entrypoint. A fresh 2026-06-23 exact fetch of `https://pub.education.mn.gov/MdeOrgView/` returned the `Radware Captcha Page` title, while a separate bounded session-backed probe reached the same root with HTTP 200 before the child analytics route flipped to `validate.perfdrive.com`. The district, county, and contact routes remain Radware-protected, and `MDEAnalytics/Data.jsp` still resolves into the same captcha family under exact recheck. Minnesota therefore still lacks a reproducible county-grade district routing contract, and the live blocker is now root instability plus route-level Radware protection rather than a stable public glossary root.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page. It explicitly says MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in Minnesota, which is enough to verify the protection_and_advocacy family at statewide grade.)
- parent_training_information_center: blocked_current_first_party_support_without_explicit_pti_designation (Minnesota PTI remains blocked after a current first-party recheck: the live PACER homepage and About page are public and current, and the old `/parent/` route now resolves into a general advice-and-guidance hub, but none of those saved first-party surfaces preserves explicit Parent Training and Information Center designation text. The older PTI-style path family under `/parent/php/PIC/` now 404s, so PACER still remains support-only evidence until a live first-party PTI designation page is preserved.)
- legal_aid: verified_state_grade (Reviewed Mid-Minnesota Legal Aid preserves a live statewide legal-aid access route on first-party pages.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_replatformed_mn_dhs_family_on_live_radware_captcha (The Minnesota county-local blocker is now sharper: the legacy `.jsp` path is stale, and the modern DHS replacements do not merely redirect vaguely. In browser review, the exact county-and-tribal and county-tribal-directory replacements land on live `validate.perfdrive.com` / Radware Bot Manager captcha pages that demand human validation before any county-grade content is exposed. That means the replatformed official family exists, but the current low-token lane still cannot reach a reviewable county-or-tribal office contract.)

## Failure ledger

- district_or_county_education_routing: official_mdeorg_root_itself_now_flaps_to_radware_and_no_stable_export_contract_exists :: Reviewed 2026-06-23 bounded official Minnesota MDE education surfaces at the MDE-ORG family. A fresh exact fetch of https://pub.education.mn.gov/MdeOrgView/ returned title `Radware Captcha Page`, which is stronger blocker evidence than the prior assumption that the glossary root stayed stably public. A separate bounded session-backed probe still reached the same root with HTTP 200, but the child analytics route at https://pub.education.mn.gov/MDEAnalytics/Data.jsp immediately flipped to validate.perfdrive.com with title `Radware Captcha Page`, and the district, county, and contact routes remain challenge-protected. The older MDE-ORG description page at https://education.mn.gov/MDE/about/SchOrg/ still describes MDE-ORG as a searchable database that can generate files from search parameters, but the live first-party contract we can actually verify in low-token mode is now: root flaps between public and captcha responses, child routes challenge, and no stable county-grade export or directory capture is reproducible.
- parent_training_information_center: current_pacer_pages_and_retired_pti_paths_do_not_preserve_explicit_pti_designation :: Reviewed 2026-06-23 bounded current PACER first-party probes on https://www.pacer.org/, https://www.pacer.org/about/, https://www.pacer.org/parent/, https://www.pacer.org/advice-guidance/topic-iep-and-504/, https://www.pacer.org/parent/php/PIC/, and https://www.pacer.org/parent/php/PIC/fedfund.asp. The live PACER homepage and About page remain public and current, and the old `/parent/` route now resolves into the general advice-and-guidance page at https://www.pacer.org/advice-guidance/topic-iep-and-504/. However, the rechecked current pages still do not preserve explicit Parent Training and Information Center designation text, while the older `/parent/php/PIC/` and `/parent/php/PIC/fedfund.asp` PTI path family now returns HTTP 404. Minnesota therefore still lacks a saved live first-party PTI designation artifact even though statewide support evidence remains strong.
- county_local_disability_resources: replatformed_mn_dhs_county_tribal_family_lands_on_live_radware_captcha :: Reviewed 2026-06-23 bounded browser checks on the exact Minnesota DHS county-and-tribal routing replacements. The legacy `county-and-tribal-offices.jsp` path remains stale, but the slash replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/ now lands on a live `validate.perfdrive.com` Radware Bot Manager captcha page titled `Radware Bot Manager Captcha` with body text `Please validate your request` and `Complete this task to confirm you are a human generating this request.` The adjacent replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/ also resolves into the same validate.perfdrive.com captcha family. Minnesota therefore still lacks a reviewed county-grade local office contract in bounded low-token mode, but the blocker is now precisely a live replatformed DHS family fronted by Radware captcha rather than one bad redirect guess.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: blocked_mdeorg_root_and_analytics_routes_flap_to_radware_without_stable_county_contract; samples=5; first=https://pub.education.mn.gov/MdeOrgView/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: verified_state_grade; samples=2; first=https://mylegalaid.org/disability-law-center/
- parent_training_information_center: blocked_current_first_party_support_without_explicit_pti_designation; samples=2; first=https://www.pacer.org/
- legal_aid: verified_state_grade; samples=1; first=https://mylegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: blocked_replatformed_mn_dhs_family_on_live_radware_captcha; samples=3; first=https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_first_party_mdeorg_route_capture_or_stable_export_contract_exists
- [major] parent_training_information_center: hold_blocked_until_live_first_party_pti_designation_page_is_preserved
- [critical] county_local_disability_resources: hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_contract_exists

## Completion decision

- Minnesota remains BLOCKED and index_safe=false.
- district_or_county_education_routing remains blocked because exact bounded rechecks now show the MDE-ORG root itself flapping into Radware, while the child routes and analytics lane still do not yield a stable county-grade contract.
- county_local_disability_resources remains blocked on the separate DHS county-and-tribal captcha family.
- parent_training_information_center remains below standard because current PACER first-party pages still do not preserve explicit PTI designation text.
