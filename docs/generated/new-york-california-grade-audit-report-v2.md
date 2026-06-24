# New York Blocker Packets v8

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 62
- primary_gap_reason: nygov_links_exact_otda_successor_leaves_that_still_reset_while_mybenefits_begin_page_recovers_without_county_local_contract_and_health_ny_ldss_family_remains_unusable

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-23 one more bounded official NYC education lane on the live `https://www.schools.nyc.gov/learning/special-education/help/committees-on-special-education` page. The existing NYSED Joint Management Teams and District Superintendents pages already proved county-bearing BOCES routing for the 57 non-NYC counties. The live NYC DOE CSE page now closes the five-borough remainder directly: it publishes CPSE/CSE district groupings, emails, addresses, and phone numbers for Bronx (`CSE1` districts 7, 9, 10 and `CSE2` districts 8, 11, 12), Queens (`CSE3` districts 25, 26, 28, 29 and `CSE4` districts 24, 27, 30), Brooklyn (`CSE5` districts 19, 23, 32; `CSE6` districts 17, 18, 22; `CSE7` districts 20, 21; `CSE8` districts 13, 14, 15, 16), Manhattan / New York County (`CSE9` districts 1, 2, 4 and `CSE10` districts 3, 5, 6), and Staten Island / Richmond County (`CSE11` district 31). New York education therefore now has reviewed official routing across all 62 counties through one county-cluster BOCES lane plus one borough-explicit NYC DOE CSE lane.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed verified ACCES-VR program evidence already exists in the New York program spine and satisfies the statewide VR / Pre-ETS gate.)
- protection_and_advocacy: verified_state_grade (Accepted first-party Disability Rights New York evidence is already present on disk and satisfies the statewide P&A gate.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-23 the authoritative Parent Center Hub New York leaf plus the listed first-party Starbridge host. `https://www.parentcenterhub.org/findurcenter/new-york/` explicitly says `There are 5 PTIs serving New York State` and then lists Starbridge, Advocates for Children of New York, INCLUDEnyc, Sinergia/Metropolitan Parent Center, and Long Island Advocacy Center with their service areas. The listed Starbridge host also resolves live at `https://starbridgeinc.org/`, so New York now has reviewed authoritative statewide PTI coverage rather than only the old Western New York regional blocker.)
- legal_aid: verified_state_grade (LawHelpNY now provides reviewed New York statewide legal-help routing from a first-party portal with county-based resource lookup.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_health_hostwide_403_plus_otda_successor_resets_plus_mybenefits_begin_without_county_local_contract (Reviewed 2026-06-23 one more bounded official New York county-local replacement lane using the public `ny.gov` service stack plus the recovered MyBenefits root. The original `health.ny.gov` Medicaid lane is still blocked host-wide: `ldss.htm`, `robots.txt`, `sitemap.xml`, and `/health_care/medicaid/` still return CloudFront-style 403 `Request blocked` shells and remain unusable for county-local proof. The live `https://www.ny.gov/services/social-programs` page and `https://www.ny.gov/services/apply-cooling-assistance` still strengthen the blocker instead of clearing it: the cooling-assistance page explicitly says people may apply in person at their local district office and publicly links both `https://otda.ny.gov/programs/heap/contacts/` as `HEAP Local District Contact` and `https://mybenefits.ny.gov/` as the online benefits lane. The exact OTDA benefit and contact leaves still fail on the current successor family, including `otda.ny.gov/programs/heap/contacts/`, `otda.ny.gov/programs/heap/`, `otda.ny.gov/programs/applications/4826.pdf`, `otda.ny.gov/workingfamilies/dss.asp`, and the apex `otda.ny.gov` plus `www.otda.ny.gov` roots, all of which still reset the connection in the bounded lane. `https://mybenefits.ny.gov/` has changed: it now lands publicly on `https://mybenefits.ny.gov/mybenefits/begin`, but the recovered page is still only an online portal surface rather than a county-local contract. Its live HTML only exposes account/login and portal navigation plus links back to OTDA pages like `workingfamilies/dss.asp`; it still preserves no county names, district-office directory, local-office table, or county-keyed routing contract. New York therefore remains blocked on county-local not because the successor path is unknown, but because the public New York portal still points to exact OTDA surfaces that reset while the recovered MyBenefits begin page still does not materialize county-local proof.)

## Failure ledger

- county_local_disability_resources: nygov_links_exact_otda_successor_leaves_that_still_reset_while_mybenefits_begin_only_exposes_online_portal_and_health_ny_ldss_family_stays_blocked :: Reviewed 2026-06-23 bounded official New York rechecks across `https://www.health.ny.gov/health_care/medicaid/ldss.htm`, `https://www.health.ny.gov/robots.txt`, `https://www.health.ny.gov/sitemap.xml`, `https://www.health.ny.gov/health_care/medicaid/`, `https://www.ny.gov/services/social-programs`, `https://www.ny.gov/services/apply-cooling-assistance`, `https://otda.ny.gov/programs/heap/contacts/`, `https://otda.ny.gov/programs/heap/`, `https://otda.ny.gov/programs/applications/4826.pdf`, `https://otda.ny.gov/workingfamilies/dss.asp`, `https://otda.ny.gov/`, `https://www.otda.ny.gov/`, and `https://mybenefits.ny.gov/`. The old `health.ny.gov` Medicaid lane still fails host-wide with 403 `Request blocked` shells. The live `ny.gov` service pages still explicitly route people toward `HEAP Local District Contact` on OTDA and the online benefits lane. The exact OTDA successor leaves still reset the connection in the bounded lane. `https://mybenefits.ny.gov/` no longer resets; it now lands publicly on `https://mybenefits.ny.gov/mybenefits/begin` with title `myBenefits`. But the recovered begin page still only exposes portal/login navigation and links back to OTDA pages such as `https://otda.ny.gov/workingfamilies/dss.asp`; it preserves no county names, district office table, or local district contact contract. The linked `Apply for Cooling Assistance` page still says applicants may apply by phone or in person at their `HEAP Local District Contact`, which proves the county-local contract is still expected to exist outside the recovered portal begin page. New York therefore remains blocked because the old health-host lane is unusable, the exact OTDA successor leaves still reset, and the recovered MyBenefits root still does not itself expose county-local routing proof.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://opwdd.ny.gov/services-support/home-community-based-services-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://opwdd.ny.gov/get-started/front-door
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.btboces.org
- district_or_county_education_routing: verified_state_grade; samples=7; first=https://www.p12.nysed.gov/ds/jmt.html
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drny.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.parentcenterhub.org/findurcenter/new-york/
- legal_aid: verified_state_grade; samples=1; first=https://www.lawhelpny.org/
- able_program: verified_state_grade; samples=1; first=https://www.mynyable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.health.ny.gov/health_care/medicaid/redesign/cdpap.htm
- county_local_disability_resources: blocked_health_hostwide_403_plus_otda_successor_resets_plus_mybenefits_begin_without_county_local_contract; samples=14; first=https://www.health.ny.gov/health_care/medicaid/ldss.htm

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified

## Education refinement

- The official NYSED Joint Management Teams and District Superintendents pages still prove county-bearing BOCES routing for the 57 non-NYC counties.
- The live NYC DOE Committees on Special Education page already closes the five-borough remainder directly, so education is no longer a New York blocker.

## County-local refinement

- The live `ny.gov` service stack still proves New York intends OTDA and MyBenefits to be the successor county-local lane: `Apply for Cooling Assistance` explicitly tells people they may apply in person at a local district office and links both `HEAP Local District Contact` and `mybenefits.ny.gov`.
- `mybenefits.ny.gov` has recovered to a public `begin` page, but that recovered page is still only an online benefits portal surface and does not itself expose county-local district office proof.
- The exact OTDA contact, application, benefit, and apex surfaces still fail in bounded live review, so the successor county-local contract remains unverified.

## Completion decision

- New York remains `BLOCKED` and `index_safe=false`.
- Education is verified across all 62 counties.
- County-local remains blocked because the old `health.ny.gov` LDSS family is unusable, the exact OTDA successor leaves still reset, and the recovered MyBenefits begin page still does not materialize county-local routing proof.
- PTI remains repaired and is not a blocker.
