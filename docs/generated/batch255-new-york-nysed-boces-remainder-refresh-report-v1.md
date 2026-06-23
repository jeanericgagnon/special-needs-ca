# New York Blocker Packets v5

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 62
- primary_gap_reason: official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_no_public_ldss_replacement

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_boces_pages_cover_non_nyc_counties_but_nyc_borough_route_missing (Reviewed 2026-06-23 one bounded official NYSED education replacement lane beyond the saved three BOCES leaves. The official Joint Management Teams page at `https://www.p12.nysed.gov/ds/jmt.html` and the official Directory of District Superintendents page at `https://www.p12.nysed.gov/ds/superintendents.html` are both live and publicly reviewable. Together they now prove county-bearing BOCES routing for the non-NYC portion of the state: the pages preserve county-cluster BOCES groupings and district-superintendent contact rows for 57 non-NYC counties such as Albany, Broome, Cattaraugus, Dutchess, Erie, Monroe, Nassau, Onondaga, Suffolk, Westchester, and Wyoming. But that same official lane still exposes no reviewed borough-specific routing for Bronx, Kings, Queens, Richmond, or a clear New York County / Manhattan special-education route. New York education therefore no longer looks like a three-leaf-only state; it is now blocked specifically on the NYC borough remainder.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed verified ACCES-VR program evidence already exists in the New York program spine and satisfies the statewide VR / Pre-ETS gate.)
- protection_and_advocacy: verified_state_grade (Accepted first-party Disability Rights New York evidence is already present on disk and satisfies the statewide P&A gate.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-23 the authoritative Parent Center Hub New York leaf plus the listed first-party Starbridge host. `https://www.parentcenterhub.org/findurcenter/new-york/` explicitly says `There are 5 PTIs serving New York State` and then lists Starbridge, Advocates for Children of New York, INCLUDEnyc, Sinergia/Metropolitan Parent Center, and Long Island Advocacy Center with their service areas. The listed Starbridge host also resolves live at `https://starbridgeinc.org/`, so New York now has reviewed authoritative statewide PTI coverage rather than only the old Western New York regional blocker.)
- legal_aid: verified_state_grade (LawHelpNY now provides reviewed New York statewide legal-help routing from a first-party portal with county-based resource lookup.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_health_hostwide_403 (Reviewed 2026-06-23 the current New York county-local blocker surfaces plus one bounded official replacement-host lane. The official health.ny.gov Medicaid lane is still blocked host-wide, not just at one LDSS page: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all returned HTTP 403 in the bounded lane. A bounded replacement-host probe also showed `https://otda.ny.gov/workingfamilies/dss.asp`, `https://otda.ny.gov/workingfamilies/`, `https://otda.ny.gov/programs/applications/`, `https://otda.ny.gov/workingfamilies/contact.asp`, `https://otda.ny.gov/`, `https://www.otda.ny.gov/workingfamilies/dss.asp`, and `https://www.otda.ny.gov/` all failing with connection resets. The old county rows that still point at `ldss.htm` therefore cannot remain as sample proof, and the obvious OTDA replacement host family cannot yet serve as a reviewed rescue path either; only a public replacement locator or county-owned directory can clear this blocker.)

## Failure ledger

- county_local_disability_resources: bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement :: Reviewed 2026-06-23 the current New York county-local blocker surfaces plus one bounded official replacement-host lane. The official health.ny.gov Medicaid lane is still blocked host-wide, not just at one LDSS page: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all returned HTTP 403 in the bounded lane. A bounded replacement-host probe also showed `https://otda.ny.gov/workingfamilies/dss.asp`, `https://otda.ny.gov/workingfamilies/`, `https://otda.ny.gov/programs/applications/`, `https://otda.ny.gov/workingfamilies/contact.asp`, `https://otda.ny.gov/`, `https://www.otda.ny.gov/workingfamilies/dss.asp`, and `https://www.otda.ny.gov/` all failing with connection resets. The old county rows that still point at `ldss.htm` therefore cannot remain as sample proof, and the obvious OTDA replacement host family cannot yet serve as a reviewed rescue path either; only a public replacement locator or county-owned directory can clear this blocker.
- district_or_county_education_routing: official_nysed_boces_pages_cover_57_non_nyc_counties_but_no_reviewed_nyc_borough_route :: Reviewed 2026-06-23 one bounded official NYSED education replacement lane beyond the saved three BOCES leaves. The official Joint Management Teams page at `https://www.p12.nysed.gov/ds/jmt.html` and the official Directory of District Superintendents page at `https://www.p12.nysed.gov/ds/superintendents.html` are both live and publicly reviewable. Together they now prove county-bearing BOCES routing for the non-NYC portion of the state: the pages preserve county-cluster BOCES groupings and district-superintendent contact rows for 57 non-NYC counties such as Albany, Broome, Cattaraugus, Dutchess, Erie, Monroe, Nassau, Onondaga, Suffolk, Westchester, and Wyoming. But that same official lane still exposes no reviewed borough-specific routing for Bronx, Kings, Queens, Richmond, or a clear New York County / Manhattan special-education route. New York education therefore no longer looks like a three-leaf-only state; it is now blocked specifically on the NYC borough remainder.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://opwdd.ny.gov/services-support/home-community-based-services-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://opwdd.ny.gov/get-started/front-door
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.btboces.org
- district_or_county_education_routing: blocked_official_boces_pages_cover_non_nyc_counties_but_nyc_borough_route_missing; samples=5; first=https://www.p12.nysed.gov/ds/jmt.html
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drny.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.parentcenterhub.org/findurcenter/new-york/
- legal_aid: verified_state_grade; samples=1; first=https://www.lawhelpny.org/
- able_program: verified_state_grade; samples=1; first=https://www.mynyable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.health.ny.gov/health_care/medicaid/redesign/cdpap.htm
- county_local_disability_resources: blocked_health_hostwide_403; samples=7; first=https://www.health.ny.gov/health_care/medicaid/ldss.htm

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_health_ny_ldss_replacement_or_county_owned_locator_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_official_nyc_borough_special_education_route_exists

## Education refinement

- The official NYSED Joint Management Teams and District Superintendents pages now prove county-bearing BOCES routing for the non-NYC portion of the state.
- That collapses the old “three exact leaves only” story into a more precise NYC-borough remainder.
- The remaining education blocker is now the lack of a reviewed official NYC borough special-education route for Bronx, Kings, New York/Manhattan, Queens, and Richmond.

## Completion decision

- New York remains `BLOCKED` and `index_safe=false`.
- County-local remains blocked because both the original `health.ny.gov` Medicaid host family and the bounded OTDA replacement-host family failed in live review.
- Education remains blocked, but now specifically on the NYC borough remainder instead of a generic statewide leaf shortage.
- PTI remains repaired and is not a blocker.
