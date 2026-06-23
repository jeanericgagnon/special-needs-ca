# New York Blocker Packets v6

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
- county_local_disability_resources: blocked_health_hostwide_403 (Reviewed 2026-06-23 one more bounded official New York county-local replacement lane using the public `ny.gov` service stack as the discovery surface rather than speculative OTDA host guessing. The original `health.ny.gov` Medicaid lane is still blocked host-wide: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all remain unusable for county-local proof. The live `https://www.ny.gov/services/social-programs` page and `https://www.ny.gov/services/apply-cooling-assistance` now strengthen the blocker instead of clearing it: both public state pages explicitly link exact OTDA successor leaves such as `https://otda.ny.gov/programs/heap/contacts/`, `https://otda.ny.gov/programs/applications/4826.pdf`, `https://otda.ny.gov/programs/snap/work-requirements.asp`, and `https://mybenefits.ny.gov/`. But the exact OTDA benefit and contact leaves still fail on the current host family, including `otda.ny.gov/programs/heap/contacts/`, `otda.ny.gov/programs/heap/`, `otda.ny.gov/programs/applications/4826.pdf`, `otda.ny.gov/workingfamilies/dss.asp`, and the apex `otda.ny.gov` plus `www.otda.ny.gov` roots, all of which reset the connection in the bounded lane. New York therefore remains blocked on county-local not because a successor path is unknown, but because the public New York portal points to an exact official OTDA successor family that is still not reviewable from the repo-side verification lane.)

## Failure ledger

- county_local_disability_resources: nygov_links_exact_otda_successor_leaves_but_successor_host_still_resets :: Reviewed 2026-06-23 one more bounded official New York county-local replacement lane using the public `ny.gov` service stack as the discovery surface rather than speculative OTDA host guessing. The original `health.ny.gov` Medicaid lane is still blocked host-wide: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all remain unusable for county-local proof. The live `https://www.ny.gov/services/social-programs` page and `https://www.ny.gov/services/apply-cooling-assistance` now strengthen the blocker instead of clearing it: both public state pages explicitly link exact OTDA successor leaves such as `https://otda.ny.gov/programs/heap/contacts/`, `https://otda.ny.gov/programs/applications/4826.pdf`, `https://otda.ny.gov/programs/snap/work-requirements.asp`, and `https://mybenefits.ny.gov/`. But the exact OTDA benefit and contact leaves still fail on the current host family, including `otda.ny.gov/programs/heap/contacts/`, `otda.ny.gov/programs/heap/`, `otda.ny.gov/programs/applications/4826.pdf`, `otda.ny.gov/workingfamilies/dss.asp`, and the apex `otda.ny.gov` plus `www.otda.ny.gov` roots, all of which reset the connection in the bounded lane. New York therefore remains blocked on county-local not because a successor path is unknown, but because the public New York portal points to an exact official OTDA successor family that is still not reviewable from the repo-side verification lane.
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
- county_local_disability_resources: blocked_health_hostwide_403; samples=9; first=https://www.health.ny.gov/health_care/medicaid/ldss.htm

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified
- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_official_nyc_borough_special_education_route_exists

## Education refinement

- The official NYSED Joint Management Teams and District Superintendents pages still prove county-bearing BOCES routing for the 57 non-NYC counties.
- The remaining education blocker is still just the NYC borough remainder, not a statewide education inventory shortage.

## County-local refinement

- The live `ny.gov` service stack now proves New York still intends OTDA to be the successor local-district lane: `Social Programs` and `Apply for Cooling Assistance` both link exact OTDA contact or application leaves.
- The `Apply for Cooling Assistance` page specifically labels the OTDA successor contact path as `HEAP Local District Contact`, which makes the replacement lane exact enough to test but still not reviewable enough to clear.
- But those exact OTDA successor leaves still fail in bounded live review, so the blocker remains on the successor host family rather than on an unknown replacement search.

## Completion decision

- New York remains `BLOCKED` and `index_safe=false`.
- County-local remains blocked because the old `health.ny.gov` LDSS family is unusable and the exact OTDA successor leaves publicly linked by `ny.gov` still reset the connection.
- Education remains blocked only on the NYC borough special-education routing remainder.
- PTI remains repaired and is not a blocker.
