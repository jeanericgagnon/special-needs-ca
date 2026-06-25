# Minnesota California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 87
- primary_gap_reason: browser_reviewed_mdeorg_county_and_district_routes_now_clear_education_but_mn_dhs_successor_county_tribal_state_directory_is_still_bot_gated

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_browser_reviewed_official_mdeorg_county_directory_and_special_education_contacts (Minnesota education now clears from browser-reviewed official MDE-ORG pages on the public MDE host. The public `Schools and Districts` route exposes district listings plus a `Special Education Directors` contact list and extract link. The public `Counties` route lists all 87 Minnesota counties and explicitly says users can click a county name to view all organizations located within that county. County member pages then enumerate district members, and district detail leaves preserve superintendent name, email, phone, website, physical address, and county on the same official host. That combination is enough to verify county-grade district routing without relying on the unstable raw-fetch-only root or export lane.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page. It explicitly says MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in Minnesota, which is enough to verify the protection_and_advocacy family at statewide grade.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-23 the authoritative Parent Center Hub Minnesota state leaf at https://www.parentcenterhub.org/findurcenter/minnesota/. The live page explicitly preserves `Minnesota PTI`, names PACER Center, Inc., and preserves direct Minnesota contact details on an authoritative national PTI directory. That authoritative state-specific PTI designation is enough to verify the parent_training_information_center family even though PACER’s own current first-party pages no longer repeat the explicit PTI label and the older `/parent/php/PIC/` path family now returns HTTP 404.)
- legal_aid: verified_state_grade (Reviewed Mid-Minnesota Legal Aid preserves a live statewide legal-aid access route on first-party pages.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_mn_dhs_successor_county_tribal_state_directory_is_bot_gated (Minnesota county-local routing remains blocked, but the exact first-party picture is now sharper. The saved disability-services replacement URLs still return official DHS 404 pages, and the same official DHS shell exposes a likely successor route named `Minnesota Health Care Program county, Tribal and state directory`. But that exact successor route is also bot-gated behind a Radware challenge in bounded fetches, so there is still no reviewable county-grade local office contract on public first-party DHS surfaces.)

## Failure ledger

- county_local_disability_resources: official_mn_dhs_404_shell_points_to_successor_county_tribal_state_directory_but_that_route_is_radware_blocked :: Reviewed 2026-06-25 bounded official Minnesota DHS county-and-tribal surfaces. The saved disability-services replacement URLs still return official DHS 404 pages, including https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/. The official DHS shell also exposes an exact successor contact route at https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp labeled `Minnesota Health Care Program county, Tribal and state directory`, but a fresh exact recheck showed that successor returning HTTP 302 into `validate.perfdrive.com` / `Radware Bot Manager Captcha`. Minnesota therefore still lacks a reviewable county-grade county/tribal office contract on public first-party DHS surfaces.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: verified_browser_reviewed_official_mdeorg_county_directory_and_special_education_contacts; samples=6; first=https://education.mn.gov/MDE/about/SchOrg/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: verified_state_grade; samples=2; first=https://mylegalaid.org/disability-law-center/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/minnesota/
- legal_aid: verified_state_grade; samples=1; first=https://mylegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: blocked_mn_dhs_successor_county_tribal_state_directory_is_bot_gated; samples=3; first=https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_state_directory_stays_public

## Completion decision

- Minnesota remains BLOCKED and index_safe=false.
- district_or_county_education_routing is now verified from browser-reviewed official MDE-ORG county and district pages, county member pages, district detail leaves, and the public Special Education Director contact list.
- county_local_disability_resources remains blocked because the reviewed DHS disability-services replacements still 404 and the exact named successor county/tribal/state directory route is also bot-gated.
- parent_training_information_center remains verified and is not a current blocker.
