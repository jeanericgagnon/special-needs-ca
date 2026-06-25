# West Virginia California-Grade Independent Re-Audit Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 55
- strong_critical_families: 11
- weak_critical_families: 0
- missing_critical_families: 1
- reviewed_at: 2026-06-25

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed 2026-06-25 the live official West Virginia Bureau for Medical Services healthcare-application page. It explicitly states that there are several types of Medicaid, preserves multiple official application routes, and states that SSI recipients are automatically eligible for Medicaid through the West Virginia Department of Human Services.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed 2026-06-25 the live official BMS HCBS/waivers page. It explains that Medicaid waiver programs let members remain at home and explicitly lists the Aged and Disabled Waiver, Children with Serious Emotional Disorder Waiver, Intellectual/Developmental Disabilities Waiver, and Traumatic Brain Injury Waiver.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed 2026-06-25 the live official Bureau for Behavioral Health I/DD page. The DoHS service directory now points directly to BBH's Intellectual and Developmental Disabilities page, which preserves the current state I/DD program hub and linked statewide disability resources.)
- early_intervention_part_c: verified_state_grade (Reviewed 2026-06-25 the live official West Virginia Birth to Three referral, state staff, and Regional Administrative Units map pages. The referral page directs families to a local regional office via the office map, while the RAU map explicitly assigns counties to regional administrative units and names the office serving each county group.)
- special_education_idea_part_b: verified_state_grade (Reviewed 2026-06-25 the live official WVDE Special Education office page. It explicitly says the Office of Special Education provides leadership, guidance, and oversight to local educational agencies and guarantees services and protections under IDEA and Policy 2419.)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 first-party West Virginia education routing surfaces. The live WVDE homepage links directly to the official School Directory host, the directory publicly browses schools by county, and county pages such as Barbour County Schools preserve county office address, phone, superintendent, county website, and school list routing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed 2026-06-25 the live official WV Division of Rehabilitation Services student services page. It states that DRS helps students with disabilities beginning at age 14 and explicitly lists the five Pre-Employment Transition Services activities.)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-25 the live first-party Disability Rights of West Virginia homepage in browser mode. The page states that DRWV is the federally mandated protection and advocacy system for people with disabilities in West Virginia and that its services are confidential and free of charge.)
- parent_training_information_center: blocked_first_party_pti_domain_redirects_unrelated (Rechecked 2026-06-25 the inherited WVPTI first-party host. The legacy domain now returns HTTP 301 to an unrelated body-shop site, and no current first-party West Virginia PTI designation page was preserved in this bounded official-source pass. West Virginia therefore cannot stay COMPLETE because the PTI family no longer has live first-party evidence.)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 the live first-party Legal Aid WV domain after the legacy lawv.net root redirected to legalaidwv.org. The homepage preserves statewide justice language, Apply For Help routing, and education and health-care help language on the same first-party domain.)
- able_program: verified_state_grade (Reviewed 2026-06-25 the live official West Virginia State Treasurer WVABLE page. It states that many people with disabilities can save and invest without losing eligibility for public benefits like SSI or Medicare and that the Treasurer's office offers WVABLE for people with disabilities.)
- ssi_ssa_federal_reference: verified_state_grade (Reviewed 2026-06-25 the live official West Virginia Medicaid application page. It explicitly states that people receiving Supplemental Security Income are automatically eligible for Medicaid in West Virginia.)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 official successor West Virginia Department of Human Services field-office surfaces. The live directory exposes a county selector covering Barbour through Wyoming and county-filtered pages preserve county-specific office cards with local addresses and phone numbers.)

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=1; first=https://bms.wv.gov/members/applying-healthcare
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://bms.wv.gov/photo-call-out/home-and-community-based-services-hcbswaivers
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://bbh.wv.gov/intellectual-and-developmental-disabilities-idd
- early_intervention_part_c: verified_state_grade; samples=2; first=https://www.wvdhhr.org/birth23/referral.asp
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://wvde.us/divisions-offices/division-directory/division-federal-programs-support/special-education
- district_or_county_education_routing: verified_state_grade; samples=3; first=https://wvde.us/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://wvdrs.org/students/services/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drofwv.org/
- parent_training_information_center: blocked_first_party_pti_domain_redirects_unrelated; samples=1; first=https://wvpti.org/
- legal_aid: verified_state_grade; samples=1; first=https://legalaidwv.org/
- able_program: verified_state_grade; samples=1; first=https://wvtreasury.gov/Citizens/WVABLE
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://bms.wv.gov/members/applying-healthcare
- county_local_disability_resources: verified_state_grade; samples=3; first=https://dohs.wv.gov/field-offices

## Failure ledger

- parent_training_information_center: legacy_wvpti_domain_redirects_unrelated_and_no_current_first_party_pti_designation_preserved :: Rechecked 2026-06-25 the inherited WVPTI first-party host. The legacy domain now returns HTTP 301 to an unrelated body-shop site, and no current first-party West Virginia PTI designation page was preserved in this bounded official-source pass. West Virginia therefore cannot stay COMPLETE because the PTI family no longer has live first-party evidence.

## Next actions

- [critical] parent_training_information_center: hold_blocked_until_current_first_party_west_virginia_pti_designation_page_is_preserved

## Completion decision

- West Virginia no longer qualifies as `COMPLETE` or `index_safe=true` after an independent re-audit of the current live sources.
- The state packet now uses current official BMS, BBH, Birth to Three, WVDE, WV School Directory, WVDRS, DoHS, Legal Aid WV, and WVABLE evidence instead of the inherited fake `dhhs.west-virginia.gov` placeholders and generic hub rows.
- District routing and county-local routing both remain cleared because the public county school directory and county-filtered DoHS office pages still preserve explicit county-to-local routing on live official hosts.
- The single remaining critical blocker is `parent_training_information_center`: the old `wvpti.org` first-party domain now returns HTTP 301 to an unrelated body-shop site, and this bounded official-source pass did not preserve any current first-party West Virginia PTI designation page.
- West Virginia therefore must be frozen back to `BLOCKED` until a live first-party PTI successor or designation artifact is preserved.

## Browser-reviewed exceptions

- protection_and_advocacy: https://www.drofwv.org/ :: Disability Rights of West Virginia (DRWV) is the federally mandated protection and advocacy system for people with disabilities in West Virginia. DRWV is a private, nonprofit agency. Our services are confidential and free of charge.
