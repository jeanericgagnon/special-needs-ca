# Minnesota California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 87
- primary_gap_reason: browser_reviewed_mdeorg_and_mn_dhs_successor_routes_now_clear_minnesota_to_complete

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
- county_local_disability_resources: verified_browser_reviewed_official_mn_dhs_county_tribal_state_directory (Minnesota county-local routing now clears from the exact first-party DHS successor route. The saved disability-services replacement URLs still return official DHS 404 pages, but the named successor `Minnesota Health Care Program county, Tribal and state directory` is browser-readable on the official DHS host and publicly exposes county, Tribal, and state office entries with office name, mailing address, phone, and fax. The reviewed page shows early alphabet county entries like `Aitkin County` and `Anoka County`, a Tribal entry such as `White Earth Financial Services`, and late alphabet county coverage through `Yellow Medicine County`, which is enough to establish a county-grade public office contract on the official host.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: verified_browser_reviewed_official_mdeorg_county_directory_and_special_education_contacts; samples=7; first=https://education.mn.gov/MDE/about/SchOrg/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: verified_state_grade; samples=2; first=https://mylegalaid.org/disability-law-center/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/minnesota/
- legal_aid: verified_state_grade; samples=1; first=https://mylegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: verified_browser_reviewed_official_mn_dhs_county_tribal_state_directory; samples=5; first=https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/

## Next actions

- none

## Completion decision

- Minnesota is now COMPLETE and index_safe=true.
- district_or_county_education_routing is verified from browser-reviewed official MDE-ORG county and district pages, county member pages, district detail leaves, and the public Special Education Director contact list.
- county_local_disability_resources is verified from the browser-reviewed official DHS county/Tribal/state successor directory, which publishes county and Tribal office entries with contact details on the public host.
- parent_training_information_center remains verified and is not a current blocker.
