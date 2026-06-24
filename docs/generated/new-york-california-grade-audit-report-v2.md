# New York California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 62
- primary_gap_reason: none

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
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-24 exact official OTDA successor leaves and confirmed New York now has a public county-local contract. `https://otda.ny.gov/workingfamilies/dss.asp` is publicly reviewable and preserves Local Departments of Social Services rows directly in the HTML from Albany County DSS through Yates County DSS, including New York City Human Resources Administration. The page itself provides county/local district names, addresses, phones, and county-owned or city-owned local links. `https://otda.ny.gov/programs/heap/contacts/` is also publicly reviewable and preserves the county index for the same local-district contact lane, corroborating Albany through Yates plus New York City on the current official OTDA host. `https://mybenefits.ny.gov/mybenefits/begin` remains a public online portal surface rather than a county directory, but it now cleanly points families to the same exact OTDA successor family instead of contradicting it. New York therefore now has reviewed official county-local routing across all 62 counties.)

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
- county_local_disability_resources: verified_county_grade; samples=3; first=https://otda.ny.gov/workingfamilies/dss.asp

## Next actions

- [info] maintenance: Preserve New York as COMPLETE/index_safe and rerun only maintenance truth audits unless the exact official OTDA county-local leaves regress.

## County-local repair

- The official OTDA `Local Departments of Social Services` page is publicly readable and preserves county/local district rows directly in HTML from Albany County through Yates County, including New York City Human Resources Administration.
- The official OTDA `HEAP Contacts` page is also publicly readable and preserves the current county index for the same local-district contact lane on the current OTDA host.
- `mybenefits.ny.gov/mybenefits/begin` remains an online portal surface, but it now cleanly points families back to the same OTDA successor family rather than undermining the county-local contract.

## Completion decision

- New York is now `COMPLETE` and `index_safe=true`.
- All critical families are verified.
- County-local disability routing is now satisfied by exact official OTDA successor leaves rather than legacy `health.ny.gov` LDSS evidence.
