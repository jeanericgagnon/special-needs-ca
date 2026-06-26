# Wyoming California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 23
- primary_gap_reason: official_wde_public_again_but_no_reviewable_county_to_district_special_education_crosswalk_or_district_owned_special_education_leaf_set_exists

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed 2026-06-25 the current official HCBS public participant-facing stack on `https://health.wyo.gov/healthcarefin/hcbs/`. The live `HCBS Welcomes You` page now preserves a public `Apply for DD Waivers` lane, explains that the Supports and Comprehensive Waiver programs are the Developmental Disability Waivers, and links the current `Supports Waiver Guide and Application` PDF plus online and paper application paths on the official WDH host.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed 2026-06-25 the current official Wyoming HCBS public stack after confirming the older `dhhs.wyoming.gov/dd` host no longer resolves. The live WDH HCBS pages now expose the active state disability-waiver authority surface through the official `HCBS Welcomes You` page and `Contact Staff, Subscribe or Suggest` page, including the HCBS Section purpose, statewide section contact information, Section Administrator, Benefits and Eligibility Unit leadership, and county-keyed DD specialist assignments.)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (Reviewed 2026-06-25 one more bounded live check of the exact official Wyoming Department of Education special-education and IDEA pages. Both `https://edu.wyoming.gov/parents/special-education/` and `https://edu.wyoming.gov/parents/special-education/idea/` now return HTTP 200 again in the replayable lane, preserving current statewide Part B authority evidence on the official WDE host. The lane is still not sufficient for local county or district routing, but it does restore reviewable statewide IDEA authority evidence.)
- district_or_county_education_routing: blocked_official_wde_public_but_without_reviewable_county_to_district_special_education_crosswalk (Reviewed 2026-06-25 a bounded official Wyoming district-routing recheck on the exact WDE host family. The `special-education` hub, `IDEA` page, and `School District Enrollment & Staffing Data` page all return HTTP 200 in the replayable lane, but the reviewed WDE artifacts still do not preserve a statewide county-to-district crosswalk, district directory, or district-owned special-education leaf set. Existing Wyoming district evidence still stops at generic district roots such as Albany County School District #1, Big Horn County School District #1, and Campbell County School District #1. Wyoming district or county education routing therefore remains blocked on the missing local routing contract, not on a dead WDE host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 the live first-party Parents Information Center of Wyoming about page. The page states that `Wyoming has been home to the Parent Training and Information Center (PTI) since 1991` and that `PTIs are funded by the U.S. Department of Education, Office of Special Education Programs`. This now supplies direct first-party PTI designation evidence for Wyoming.)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 live first-party Legal Aid of Wyoming plus the Wyoming Judicial Branch legal-services directory. The Legal Aid of Wyoming homepage says `We provide free civil legal help to low-income individuals in Wyoming` and identifies Legal Aid of Wyoming, Inc. as `a federally funded, non-profit law firm`, with listed locations in Cheyenne, Casper, Lander, Gillette, and Afton. The official Wyoming Judicial Branch `Find Legal Services` page then preserves a county-filtered `Legal Services Directory by County` and county listings for Legal Aid of Wyoming offices in Gillette, Lander, Cheyenne, Casper, and Cody. Together these first-party and official judicial artifacts supply current statewide legal-aid evidence for Wyoming.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_official_hcbs_bes_county_assignments_pdf (Reviewed 2026-06-25 the live official Wyoming HCBS contact stack and linked county-assignment PDF. The official `Contact Staff, Subscribe or Suggest` page on `https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/` is publicly reviewable and links a live official PDF at `https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf`. That PDF is titled `HCBS Benefits and Eligibility Specialists (BES) Assistance & Eligibility County Assignments` and explicitly lists `Counties Served for DD` across all 23 Wyoming counties, including `Crook, Johnson, Lincoln, Niobrara, Uinta`, `Carbon, Laramie (A-L), Weston`, `Big Horn, Platte, Sublette, Sweetwater, Washakie`, `Campbell, Converse, Goshen`, `Natrona`, `Fremont, Hot Springs`, `Albany, Sheridan, Teton`, and `Laramie (M-Z), Park`. Together the live official HCBS page, county-keyed DD assignment PDF, and current Supports Waiver application guide now provide a disability-specific county-to-contact contract on the official WDH host.)

## Failure ledger

- district_or_county_education_routing: official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk :: Reviewed 2026-06-25 a bounded official Wyoming district-routing recheck on the exact WDE host family. The `special-education` hub, `IDEA` page, and `School District Enrollment & Staffing Data` page all return HTTP 200 in the replayable lane, but the reviewed WDE artifacts still do not preserve a statewide county-to-district crosswalk, district directory, or district-owned special-education leaf set. Existing Wyoming district evidence still stops at generic district roots such as Albany County School District #1, Big Horn County School District #1, and Campbell County School District #1. Wyoming district or county education routing therefore remains blocked on the missing local routing contract, not on a dead WDE host.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://health.wyo.gov/healthcarefin/hcbs/
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://health.wyo.gov/healthcarefin/hcbs/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-2
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://edu.wyoming.gov/parents/special-education/
- district_or_county_education_routing: blocked_official_wde_public_but_without_reviewable_county_to_district_special_education_crosswalk; samples=5; first=https://edu.wyoming.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://health.wyo.gov/behavioralhealth/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.wypanda.com/
- parent_training_information_center: verified_state_grade; samples=2; first=https://wpic.org/about/
- legal_aid: verified_state_grade; samples=4; first=https://www.lawyoming.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_official_hcbs_bes_county_assignments_pdf; samples=8; first=https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_wde_or_district_hosts_publish_reviewable_county_to_district_or_special_education_leaf_crosswalk

## Repair decision

- Wyoming remains `BLOCKED` and `index_safe=false`.
- `county_local_disability_resources` now clears from the live official HCBS county-assignment PDF for DD and CCW Benefits and Eligibility Specialists across all 23 counties.
- `medicaid_waiver_hcbs_disability_services` and `developmental_disability_idd_authority` now rely on the current live WDH HCBS stack instead of stale dead `dhhs.wyoming.gov/dd` or 404 waiver leaves.
- `district_or_county_education_routing` remains blocked because reviewed WDE artifacts still do not provide a county-to-district crosswalk, statewide district directory, or district-owned special-education leaf set.
