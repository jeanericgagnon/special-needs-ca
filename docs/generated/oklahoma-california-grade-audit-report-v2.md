# Oklahoma California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 77
- primary_gap_reason: live_okdhs_general_office_map_only_materializes_46_counties_while_same_host_child_support_tree_proves_county_contracts_exist_but_not_for_disability_local_routing

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_current_official_state_school_directory (the official Oklahoma State School and District Directory now clears county-grade education routing. The live OSDE State School Directory page explicitly says OSDE-accredited education contact information can be downloaded or browsed by district or school site and includes physical addresses, mailing addresses, phone numbers, email addresses, website URLs and more. That page also exposes live official School Directory and District Directory download links on the current Oklahoma.gov education host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Oklahoma evidence preserves statewide disability-rights and advocacy identity)
- parent_training_information_center: verified_state_grade (reviewed first-party Oklahoma Parents Center evidence preserves statewide Parent Training and Information identity and Oklahoma special-education support language)
- legal_aid: verified_state_grade (reviewed first-party Legal Aid Services of Oklahoma evidence preserves statewide legal-aid identity and Oklahoma-specific help language)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_office_map_incomplete_county_contract (the live Oklahoma Human Services general office-map lane is real but only materializes 46 county-keyed locations, while the same host only exposes a full county tree for child-support-specific offices and not for disability/local routing)

## Failure ledger

- county_local_disability_resources: live_okdhs_general_office_map_stops_at_46_counties_while_only_child_support_publishes_full_county_tree :: Reviewed 2026-06-23 one more bounded official Oklahoma county-local replacement lane on the live Oklahoma Human Services host. The old `https://dhhs.oklahoma.gov/locations` host still fails DNS, but the current successor root is no longer unknown: `https://oklahoma.gov/okdhs/contact-us.html` explicitly says `If you’re looking for your local office, you’re in the right place` and embeds a public Google My Maps dataset. That KML feed is publicly reachable at `https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1` and preserves real office evidence, but only for 60 placemarks and 46 county-keyed locations after bounded review of `County Name` fields plus county-named `Access Point` rows. One more bounded host recheck now sharpens the blocker further: the same `oklahoma.gov/okdhs` host does publish a county-grade contract when it intends to, because `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html` exposes a `By County` accordion with county-named leaves across the state. But that tree is explicitly `Child Support District Offices`, so it cannot be substituted as disability-resource proof. The live DDS apply page at `https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html` is still only a statewide intake route with one phone/email and no county-served matrix. Oklahoma therefore remains blocked because the general Human Services local-office lane still does not materialize a full 77-county disability/local-routing contract even though the same host proves county trees are technically publishable for service-specific programs.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://oklahoma.gov/okdhs/services/dds/hcbs/eligibility.html
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.oklahoma.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.oklahoma.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://sde.ok.gov/
- district_or_county_education_routing: verified_current_official_state_school_directory; samples=4; first=https://oklahoma.gov/education/resources/state-school-directory.html
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://oklahoma.gov/okdhs/services/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://okdlc.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://oklahomaparentscenter.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.legalaidok.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_office_map_incomplete_county_contract; samples=5; first=https://oklahoma.gov/okdhs/contact-us.html

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_31_counties

## County-local refinement

- The old `dhhs.oklahoma.gov/locations` host is dead, but Oklahoma now has one live official general-office successor lane on `oklahoma.gov/okdhs/contact-us.html`.
- That live page explicitly points users looking for their local office to a public map and the backing KML feed is fetchable, so the lane is no longer speculative.
- The public KML only materializes 46 county-keyed locations from 60 placemarks after bounded review, which is not enough to clear all 77 counties.
- The same `oklahoma.gov/okdhs` host proves that county trees are technically publishable: the child-support office-locations page exposes a `By County` accordion with county-named leaves across the state.
- But that county tree is explicitly `Child Support District Offices`, while the DDS apply page is still only a statewide intake route with no county-served matrix, so neither surface closes disability/local routing for the missing 31 counties.

## Completion decision

- Oklahoma remains `BLOCKED` and `index_safe=false`.
- Education remains cleared by the current official OSDE State School and District Directory.
- County-local no longer fails because Oklahoma lacks any county-publishing ability; it now fails because the general local-office lane still stops at 46 county-keyed offices and the only full county tree on the same host is child-support-specific.
- Oklahoma therefore still cannot be marked `COMPLETE` or index-safe.
