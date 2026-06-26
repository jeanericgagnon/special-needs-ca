# Wyoming California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 23
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed 2026-06-25 the current official HCBS public participant-facing stack on `https://health.wyo.gov/healthcarefin/hcbs/`. The live `HCBS Welcomes You` page now preserves a public `Apply for DD Waivers` lane, explains that the Supports and Comprehensive Waiver programs are the Developmental Disability Waivers, and links the current `Supports Waiver Guide and Application` PDF plus online and paper application paths on the official WDH host.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed 2026-06-25 the current official Wyoming HCBS public stack after confirming the older `dhhs.wyoming.gov/dd` host no longer resolves. The live WDH HCBS pages now expose the active state disability-waiver authority surface through the official `HCBS Welcomes You` page and `Contact Staff, Subscribe or Suggest` page, including the HCBS Section purpose, statewide section contact information, Section Administrator, Benefits and Eligibility Unit leadership, and county-keyed DD specialist assignments.)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (Reviewed 2026-06-25 one more bounded live check of the exact official Wyoming Department of Education special-education and IDEA pages. Both `https://edu.wyoming.gov/parents/special-education/` and `https://edu.wyoming.gov/parents/special-education/idea/` now return HTTP 200 again in the replayable lane, preserving current statewide Part B authority evidence on the official WDE host. The lane is still not sufficient for local county or district routing, but it does restore reviewable statewide IDEA authority evidence.)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-25 the live official Wyoming Department of Education public `OnlineDirectory People Search` lane on `https://portals.edu.wyoming.gov/wyedpro/Pages/OnlineDirectory/OnlineDirectoryPeopleSearch.aspx`. The public directory exposes a live `Special Education Director` role selector and county-named district organization options. A bounded replay against the reviewed public role and organization selectors now returns district-specific `Special Education Director` contacts for all 23 Wyoming counties, including Albany County School District #1, Big Horn County School District #1, Campbell County School District #1, Carbon County School District #1, Converse County School District #1, Crook County School District #1, Fremont County School District # 1, Goshen County School District #1, Hot Springs County School District #1, Johnson County School District #1, Laramie County School District #1, Lincoln County School District #1, Natrona County School District #1, Niobrara County School District #1, Park County School District # 1, Platte County School District #1, Sheridan County School District #1, Sublette County School District #1, Sweetwater County School District #1, Teton County School District #1, Uinta County School District #1, Washakie County School District #1, and Weston County School District #1. The returned official results preserve district names plus live special-education-director emails, phones, and district mailing addresses on the official WDE host, which is enough to clear county-grade district education routing without inference.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 the live first-party Parents Information Center of Wyoming about page. The page states that `Wyoming has been home to the Parent Training and Information Center (PTI) since 1991` and that `PTIs are funded by the U.S. Department of Education, Office of Special Education Programs`. This now supplies direct first-party PTI designation evidence for Wyoming.)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 live first-party Legal Aid of Wyoming plus the Wyoming Judicial Branch legal-services directory. The Legal Aid of Wyoming homepage says `We provide free civil legal help to low-income individuals in Wyoming` and identifies Legal Aid of Wyoming, Inc. as `a federally funded, non-profit law firm`, with listed locations in Cheyenne, Casper, Lander, Gillette, and Afton. The official Wyoming Judicial Branch `Find Legal Services` page then preserves a county-filtered `Legal Services Directory by County` and county listings for Legal Aid of Wyoming offices in Gillette, Lander, Cheyenne, Casper, and Cody. Together these first-party and official judicial artifacts supply current statewide legal-aid evidence for Wyoming.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_official_hcbs_bes_county_assignments_pdf (Reviewed 2026-06-25 the live official Wyoming HCBS contact stack and linked county-assignment PDF. The official `Contact Staff, Subscribe or Suggest` page on `https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/` is publicly reviewable and links a live official PDF at `https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf`. That PDF is titled `HCBS Benefits and Eligibility Specialists (BES) Assistance & Eligibility County Assignments` and explicitly lists `Counties Served for DD` across all 23 Wyoming counties, including `Crook, Johnson, Lincoln, Niobrara, Uinta`, `Carbon, Laramie (A-L), Weston`, `Big Horn, Platte, Sublette, Sweetwater, Washakie`, `Campbell, Converse, Goshen`, `Natrona`, `Fremont, Hot Springs`, `Albany, Sheridan, Teton`, and `Laramie (M-Z), Park`. Together the live official HCBS page, county-keyed DD assignment PDF, and current Supports Waiver application guide now provide a disability-specific county-to-contact contract on the official WDH host.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://health.wyo.gov/healthcarefin/hcbs/
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://health.wyo.gov/healthcarefin/hcbs/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-2
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://edu.wyoming.gov/parents/special-education/
- district_or_county_education_routing: verified_county_grade; samples=23; first=https://portals.edu.wyoming.gov/wyedpro/Pages/OnlineDirectory/OnlineDirectoryPeopleSearch.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://health.wyo.gov/behavioralhealth/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.wypanda.com/
- parent_training_information_center: verified_state_grade; samples=2; first=https://wpic.org/about/
- legal_aid: verified_state_grade; samples=4; first=https://www.lawyoming.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_official_hcbs_bes_county_assignments_pdf; samples=8; first=https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/

## County-grade education coverage

- counties covered: 23/23
- covered counties: Albany, Big Horn, Campbell, Carbon, Converse, Crook, Fremont, Goshen, Hot Springs, Johnson, Laramie, Lincoln, Natrona, Niobrara, Park, Platte, Sheridan, Sublette, Sweetwater, Teton, Uinta, Washakie, Weston
- source lane: public WDE People Search role=`Special Education Director` + county-named district organizations on https://portals.edu.wyoming.gov/wyedpro/Pages/OnlineDirectory/OnlineDirectoryPeopleSearch.aspx

## Next actions

- none

## Completion decision

- Wyoming is now COMPLETE and index_safe=true.
- The last remaining blocker, `district_or_county_education_routing`, now clears from the reviewed public WDE People Search directory because county-named district organization results return live special-education-director contacts for all 23 Wyoming counties on the official WDE host.
- No critical families remain weak or missing, and Wyoming is now truthful California-grade complete on the current reviewed packet.
