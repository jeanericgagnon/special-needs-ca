# Minnesota California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 87
- primary_gap_reason: official_mde_directory_family_now_only_resolves_to_moved_shell_or_dead_guesses_and_mn_dhs_local_office_family_is_stale_or_radware_challenged

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_mde_directory_family_moved_without_live_replacement (The Minnesota education blocker is now sharper: both reviewed legacy MDE school-directory roots under `/MDE/SchSup/` and `/MDE/SchSup/SchDir/` only 302 into the generic `SchSupHasMoved.html` shell, guessed replacement directory roots return 404, and one analytics-style path times out without yielding a county-mapped district contract. The current packet still falls back to statewide MDE special-education evidence instead of district- or county-grade routing leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page. It explicitly says MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in Minnesota, which is enough to verify the protection_and_advocacy family at statewide grade.)
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (reviewed first-party statewide family-support evidence exists, but the saved artifact does not preserve explicit PTI designation text)
- legal_aid: verified_state_grade (Reviewed Mid-Minnesota Legal Aid preserves a live statewide legal-aid access route on first-party pages.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_mn_dhs_replatform_family_stale_or_radware_challenged (The Minnesota county-local blocker is now sharper: the old `.jsp` county-and-tribal-offices path is simply stale 404, but the slash-style replacement and multiple adjacent DHS county/tribal provider routes all 302 into the same Radware validation host. That means the official family exists as a replatformed lane, but every bounded low-token entrypoint still resolves to either dead legacy markup or bot-challenged replacement pages instead of county-grade office content.)

## Failure ledger

- district_or_county_education_routing: official_school_directory_family_only_returns_moved_shell_or_dead_guesses :: Reviewed 2026-06-23 bounded Minnesota MDE replacement probes. The legacy roots https://education.mn.gov/MDE/SchSup/SchDir/ and https://education.mn.gov/MDE/SchSup/ both 302 into the generic https://education.mn.gov/SchSupHasMoved.html shell instead of a live district directory. Additional bounded replacement guesses such as https://education.mn.gov/MDE/about/MDEpages/Directories/ and https://education.mn.gov/MDE/about/adv/dirs/ return HTTP 404, while https://education.mn.gov/MDE/SchSup/Analytics/ timed out in bounded fetches and still did not yield a reviewed county-mapped district contract. Minnesota therefore still lacks a live official district-directory replacement or county-to-district routing table, and the current packet still falls back to statewide special-education evidence rather than local routing leaves.
- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed PACER Center evidence preserves Minnesota family-support language, special-education guidance, and direct advocate/help routing, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.
- county_local_disability_resources: minnesota_dhs_local_office_family_is_stale_jsp_plus_radware_replatform :: Reviewed 2026-06-23 bounded Minnesota DHS path variants for county and tribal office routing. The legacy https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices.jsp path now returns HTTP 404. But the slash replacement https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/ and adjacent variants such as county-and-tribal-agencies.jsp, tribal-nations.jsp, partners-and-providers/county-tribal-nation-links/, partners-and-providers/county-tribal-nation-directory/, and partners-and-providers/continuing-care/county-tribal-contacts/ all 302 into the same validate.perfdrive.com / Radware bot-manager challenge. Minnesota therefore still lacks a reviewed county-grade local office contract in bounded low-token mode, but the blocker is now correctly classified as a mixed stale-legacy plus bot-challenged replatform pattern rather than one bad URL.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: blocked_official_mde_directory_family_moved_without_live_replacement; samples=3; first=https://education.mn.gov/MDE/dse/sped/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: verified_state_grade; samples=2; first=https://mylegalaid.org/disability-law-center/
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=1; first=https://www.pacer.org/
- legal_aid: verified_state_grade; samples=1; first=https://mylegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: blocked_mn_dhs_replatform_family_stale_or_radware_challenged; samples=3; first=https://mn.gov/dhs/people-we-serve/adults/services/disability-services/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_live_official_mde_directory_replacement_or_county_mapped_contract_is_reviewed
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source
- [critical] county_local_disability_resources: browser_assisted_or_cached_capture_only_for_replatformed_mn_dhs_county_tribal_family

## Completion decision

- Minnesota remains `BLOCKED` and `index_safe=false`.
- Education is still blocked because the old MDE directory family now resolves only to moved-shell and dead-guess patterns, with no reviewed live county-mapped replacement contract on disk.
- County-local is still blocked because the DHS county-and-tribal-office family now shows a mixed stale-legacy plus Radware-replatform pattern instead of a fetchable county-grade office directory in bounded low-token mode.
- PACER still remains support-only evidence for PTI because the saved reviewed artifact does not preserve explicit PTI designation text.

