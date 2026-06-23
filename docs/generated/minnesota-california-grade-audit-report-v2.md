# Minnesota California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 87
- primary_gap_reason: official_mdeorg_directory_root_is_live_but_public_directory_contract_is_embedded_or_challenged_and_mn_dhs_local_office_family_is_stale_or_radware_challenged

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_mdeorg_glossary_root_with_radware_protected_child_routes (The Minnesota education blocker is now narrower and more concrete: the official MDE-ORG glossary root at `/MdeOrgView/` is live and public, but every actionable route needed for county-grade district routing is currently challenge-protected. A bounded 2026-06-23 recheck showed the root glossary page loading normally with district, county, city, contact, and search route links in static HTML, while `/MdeOrgView/search/index`, `/MdeOrgView/search/searchContacts`, `/MdeOrgView/districts/index`, `/MdeOrgView/districts/cities`, `/MdeOrgView/reference/county`, `/MdeOrgView/contact/contactTypeList`, and `/MdeOrgView/home/howToUse` each resolved to a Radware captcha page. Minnesota therefore still lacks a reviewed county-mapped district routing artifact, but the blocker is now precisely the live glossary root plus route-level Radware protection rather than a vague dead-directory assumption.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page. It explicitly says MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in Minnesota, which is enough to verify the protection_and_advocacy family at statewide grade.)
- parent_training_information_center: blocked_current_first_party_support_without_explicit_pti_designation (Minnesota PTI remains blocked after a current first-party recheck: the live PACER homepage and About page are public and current, and the old `/parent/` route now resolves into a general advice-and-guidance hub, but none of those saved first-party surfaces preserves explicit Parent Training and Information Center designation text. The older PTI-style path family under `/parent/php/PIC/` now 404s, so PACER still remains support-only evidence until a live first-party PTI designation page is preserved.)
- legal_aid: verified_state_grade (Reviewed Mid-Minnesota Legal Aid preserves a live statewide legal-aid access route on first-party pages.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_replatformed_mn_dhs_family_on_live_radware_captcha (The Minnesota county-local blocker is now sharper: the legacy `.jsp` path is stale, and the modern DHS replacements do not merely redirect vaguely. In browser review, the exact county-and-tribal and county-tribal-directory replacements land on live `validate.perfdrive.com` / Radware Bot Manager captcha pages that demand human validation before any county-grade content is exposed. That means the replatformed official family exists, but the current low-token lane still cannot reach a reviewable county-or-tribal office contract.)

## Failure ledger

- district_or_county_education_routing: official_mdeorg_glossary_root_is_live_but_all_actionable_routes_are_radware_challenged :: Reviewed 2026-06-23 bounded official Minnesota MDE education surfaces at the live MDE-ORG family. The glossary root https://pub.education.mn.gov/MdeOrgView/ loads publicly with title `MDE Organization Reference Glossary` and preserves static first-party links to `/MdeOrgView/search/index`, `/MdeOrgView/search/searchContacts`, `/MdeOrgView/districts/index`, `/MdeOrgView/districts/cities`, `/MdeOrgView/reference/county`, `/MdeOrgView/contact/contactTypeList`, and `/MdeOrgView/home/howToUse`. But a fresh bounded probe showed each one of those actionable routes returning the same `Radware Captcha Page` shell with route-specific `You reached this page when trying to access` text. The older MDE-ORG description page at https://education.mn.gov/MDE/about/SchOrg/ remains useful because it explicitly describes MDE-ORG as a searchable database that can generate files from search parameters, but the live public contract we can actually verify in low-token mode is now: root glossary page visible, all actionable query/county/contact routes challenge-protected. Minnesota therefore still lacks a reviewable county-grade district routing contract.
- parent_training_information_center: current_pacer_pages_and_retired_pti_paths_do_not_preserve_explicit_pti_designation :: Reviewed 2026-06-23 bounded current PACER first-party probes on https://www.pacer.org/, https://www.pacer.org/about/, https://www.pacer.org/parent/, https://www.pacer.org/advice-guidance/topic-iep-and-504/, https://www.pacer.org/parent/php/PIC/, and https://www.pacer.org/parent/php/PIC/fedfund.asp. The live PACER homepage and About page remain public and current, and the old `/parent/` route now resolves into the general advice-and-guidance page at https://www.pacer.org/advice-guidance/topic-iep-and-504/. However, the rechecked current pages still do not preserve explicit Parent Training and Information Center designation text, while the older `/parent/php/PIC/` and `/parent/php/PIC/fedfund.asp` PTI path family now returns HTTP 404. Minnesota therefore still lacks a saved live first-party PTI designation artifact even though statewide support evidence remains strong.
- county_local_disability_resources: replatformed_mn_dhs_county_tribal_family_lands_on_live_radware_captcha :: Reviewed 2026-06-23 bounded browser checks on the exact Minnesota DHS county-and-tribal routing replacements. The legacy `county-and-tribal-offices.jsp` path remains stale, but the slash replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/ now lands on a live `validate.perfdrive.com` Radware Bot Manager captcha page titled `Radware Bot Manager Captcha` with body text `Please validate your request` and `Complete this task to confirm you are a human generating this request.` The adjacent replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/ also resolves into the same validate.perfdrive.com captcha family. Minnesota therefore still lacks a reviewed county-grade local office contract in bounded low-token mode, but the blocker is now precisely a live replatformed DHS family fronted by Radware captcha rather than one bad redirect guess.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: blocked_live_mdeorg_glossary_root_with_radware_protected_child_routes; samples=4; first=https://pub.education.mn.gov/MdeOrgView/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: verified_state_grade; samples=2; first=https://mylegalaid.org/disability-law-center/
- parent_training_information_center: blocked_current_first_party_support_without_explicit_pti_designation; samples=2; first=https://www.pacer.org/
- legal_aid: verified_state_grade; samples=1; first=https://mylegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: blocked_replatformed_mn_dhs_family_on_live_radware_captcha; samples=3; first=https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_first_party_mdeorg_route_capture_or_export_contract_exists
- [major] parent_training_information_center: hold_blocked_until_live_first_party_pti_designation_page_is_preserved
- [critical] county_local_disability_resources: hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_contract_exists

## Completion decision

- Minnesota remains BLOCKED and index_safe=false.
- The district_or_county_education_routing blocker is sharper: the public MDE-ORG glossary root is live, but every actionable district, county, contact, and search child route we tested is Radware-protected.
- county_local_disability_resources remains blocked on the separate DHS county-and-tribal captcha family.
- parent_training_information_center remains below standard because current PACER first-party pages still do not preserve explicit PTI designation text.
