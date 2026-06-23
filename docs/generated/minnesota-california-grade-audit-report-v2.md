# Minnesota California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 87
- primary_gap_reason: official_mdeorg_directory_root_is_live_but_linked_child_is_miswired_or_challenged_and_mn_dhs_county_tribal_replatform_lands_on_live_radware_captcha

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_mdeorg_root_with_miswired_or_challenged_child_contracts (The Minnesota education blocker is now sharper: the official MDE-ORG root is live, clearly describes a searchable directory that can generate files from search parameters, and exposes exact child surfaces including `MDEAnalytics/Data.jsp`, `MDEAnalytics/Summary.jsp`, `MDEAnalytics/Sleds.jsp`, and `MdeOrgView/`. But the exact embedded front-end it points to is not a usable public directory contract. In bounded review, `/mdeprod/groups/communications/documents/unzip/048426/index.html` renders as an unrelated slide-style course shell instead of district or organization search results, while the public analytics and org-view children land on live Radware captcha pages. Minnesota therefore still lacks a reviewed county-mapped district-routing artifact on exact first-party surfaces.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page. It explicitly says MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in Minnesota, which is enough to verify the protection_and_advocacy family at statewide grade.)
- parent_training_information_center: blocked_current_first_party_support_without_explicit_pti_designation (Minnesota PTI remains blocked after a current first-party recheck: the live PACER homepage and About page are public and current, and the old `/parent/` route now resolves into a general advice-and-guidance hub, but none of those saved first-party surfaces preserves explicit Parent Training and Information Center designation text. The older PTI-style path family under `/parent/php/PIC/` now 404s, so PACER still remains support-only evidence until a live first-party PTI designation page is preserved.)
- legal_aid: verified_state_grade (Reviewed Mid-Minnesota Legal Aid preserves a live statewide legal-aid access route on first-party pages.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_replatformed_mn_dhs_family_on_live_radware_captcha (The Minnesota county-local blocker is now sharper: the legacy `.jsp` path is stale, and the modern DHS replacements do not merely redirect vaguely. In browser review, the exact county-and-tribal and county-tribal-directory replacements land on live `validate.perfdrive.com` / Radware Bot Manager captcha pages that demand human validation before any county-grade content is exposed. That means the replatformed official family exists, but the current low-token lane still cannot reach a reviewable county-or-tribal office contract.)

## Failure ledger

- district_or_county_education_routing: official_mdeorg_root_live_but_child_contract_is_miswired_or_challenged :: Reviewed 2026-06-23 bounded browser and exact-root HTML checks on the live official Minnesota education lane. The root page at https://education.mn.gov/MDE/about/SchOrg/ is live, titled `Schools and Organizations (MDE-ORG)`, explicitly says MDE-ORG is a searchable database that includes school, district, and education-related organization directories and can generate files from search parameters, and exposes exact child surfaces `https://pub.education.mn.gov/MDEAnalytics/Data.jsp`, `https://pub.education.mn.gov/MDEAnalytics/DataSecure.jsp`, `https://pub.education.mn.gov/MDEAnalytics/Sleds.jsp`, `https://pub.education.mn.gov/MDEAnalytics/Summary.jsp`, and `https://pub.education.mn.gov/MdeOrgView/`. But the exact embedded front-end it points to at https://education.mn.gov/mdeprod/groups/communications/documents/unzip/048426/index.html does not render a directory in browser mode either; it opens as a slide-style course shell with text like `This course is designed to be accessible...` and `Progress, Slide 1 of 25`. The public analytics and org-view children land on live Radware captcha pages rather than a public search or export contract. Minnesota therefore still lacks a reviewed first-party county-to-district routing artifact, but the blocker is now correctly narrowed to a live directory root whose exact linked child surfaces are either miswired or challenge-protected.
- parent_training_information_center: current_pacer_pages_and_retired_pti_paths_do_not_preserve_explicit_pti_designation :: Reviewed 2026-06-23 bounded current PACER first-party probes on https://www.pacer.org/, https://www.pacer.org/about/, https://www.pacer.org/parent/, https://www.pacer.org/advice-guidance/topic-iep-and-504/, https://www.pacer.org/parent/php/PIC/, and https://www.pacer.org/parent/php/PIC/fedfund.asp. The live PACER homepage and About page remain public and current, and the old `/parent/` route now resolves into the general advice-and-guidance page at https://www.pacer.org/advice-guidance/topic-iep-and-504/. However, the rechecked current pages still do not preserve explicit Parent Training and Information Center designation text, while the older `/parent/php/PIC/` and `/parent/php/PIC/fedfund.asp` PTI path family now returns HTTP 404. Minnesota therefore still lacks a saved live first-party PTI designation artifact even though statewide support evidence remains strong.
- county_local_disability_resources: replatformed_mn_dhs_county_tribal_family_lands_on_live_radware_captcha :: Reviewed 2026-06-23 bounded browser checks on the exact Minnesota DHS county-and-tribal routing replacements. The legacy `county-and-tribal-offices.jsp` path remains stale, but the slash replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/ now lands on a live `validate.perfdrive.com` Radware Bot Manager captcha page titled `Radware Bot Manager Captcha` with body text `Please validate your request` and `Complete this task to confirm you are a human generating this request.` The adjacent replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/ also resolves into the same validate.perfdrive.com captcha family. Minnesota therefore still lacks a reviewed county-grade local office contract in bounded low-token mode, but the blocker is now precisely a live replatformed DHS family fronted by Radware captcha rather than one bad redirect guess.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: blocked_live_mdeorg_root_with_miswired_or_challenged_child_contracts; samples=3; first=https://education.mn.gov/MDE/about/SchOrg/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: verified_state_grade; samples=2; first=https://mylegalaid.org/disability-law-center/
- parent_training_information_center: blocked_current_first_party_support_without_explicit_pti_designation; samples=2; first=https://www.pacer.org/
- legal_aid: verified_state_grade; samples=1; first=https://mylegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: blocked_replatformed_mn_dhs_family_on_live_radware_captcha; samples=3; first=https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_first_party_mdeorg_query_or_export_contract_exists
- [major] parent_training_information_center: hold_blocked_until_live_first_party_pti_designation_page_is_preserved
- [critical] county_local_disability_resources: hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_contract_exists

## Completion decision

- Minnesota remains BLOCKED and index_safe=false.
- Education is still blocked because the live MDE-ORG root points to exact child surfaces that are either miswired into unrelated course content or challenge-protected instead of exposing a county-grade routing contract.
- County-local is still blocked because the replatformed DHS county-and-tribal family now resolves to a live Radware captcha gate before any local office content appears.
- PTI remains blocked on missing live first-party PTI designation text.
