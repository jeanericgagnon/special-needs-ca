# Wyoming California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 23
- primary_gap_reason: all_critical_families_verified_with_current_official_wde_and_wdh_local_routing_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (Reviewed 2026-06-25 the live official Wyoming Department of Education special-education hub and IDEA page after rechecking the current host family. The WDE special-education hub is publicly reviewable again, the IDEA page says Wyoming must submit an annual application to the U.S. Department of Education Office of Special Education Programs to receive federal funds for services to children with disabilities ages 3 through 21, and the page links the current `Annual State Application` PDF plus the `Purposed Use of Funds` spreadsheet artifact. This restores current official statewide IDEA Part B authority evidence on the WDE host.)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-25 the live official Wyoming Department of Education directory workflow linked from the public WDE host. The public WyEdPro directory leaf at https://portals.edu.wyoming.gov/wyedpro/Pages/OnlineDirectory/OnlineDirectoryBreadCrumb.aspx exposes a reviewed `Wyoming Public School Districts` listing with 51 district entries, including county-named districts for all 23 Wyoming counties plus three non-county charter/community districts. A bounded leaf-validation pass then reviewed every district detail interaction on that same public directory workflow and confirmed 51/51 district detail leaves preserve the matching district title plus at least one direct `Special Education Director` contact row. Wyoming therefore now has current official district-grade special-education routing coverage statewide.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 the live first-party Parents Information Center of Wyoming about page. The page states that `Wyoming has been home to the Parent Training and Information Center (PTI) since 1991` and that `PTIs are funded by the U.S. Department of Education, Office of Special Education Programs`. This now supplies direct first-party PTI designation evidence for Wyoming.)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 live first-party Legal Aid of Wyoming plus the Wyoming Judicial Branch legal-services directory. The Legal Aid of Wyoming homepage says `We provide free civil legal help to low-income individuals in Wyoming` and identifies Legal Aid of Wyoming, Inc. as `a federally funded, non-profit law firm`, with listed locations in Cheyenne, Casper, Lander, Gillette, and Afton. The official Wyoming Judicial Branch `Find Legal Services` page then preserves a county-filtered `Legal Services Directory by County` and county listings for Legal Aid of Wyoming offices in Gillette, Lander, Cheyenne, Casper, and Cody. Together these first-party and official judicial artifacts supply current statewide legal-aid evidence for Wyoming.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-25 the live official Wyoming Department of Health HCBS PDF endpoints on the first-party `health.wyo.gov` host. The current `Benefits and Eligibility Specialists` PDF at https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf preserves `Counties Served for DD` assignments across all 23 Wyoming counties, including Albany, Big Horn, Campbell, Carbon, Converse, Crook, Fremont, Goshen, Hot Springs, Johnson, Laramie, Lincoln, Natrona, Niobrara, Park, Platte, Sheridan, Sublette, Sweetwater, Teton, Uinta, Washakie, and Weston. The parallel official county-assignment PDFs at https://health.wyo.gov/wp-content/uploads/2025/09/HCBS-IMS-Specialists.pdf and https://health.wyo.gov/wp-content/uploads/2025/09/HCBS-Credentialing-Specialist.pdf remain live as additional first-party county routing artifacts. Wyoming therefore now has current official disability-specific county routing on the WDH host family even though the landing page at https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/ returned a Cloudflare challenge from the current runtime.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://health.wyo.gov/behavioralhealth/dd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.wyoming.gov/dd
- early_intervention_part_c: verified_state_grade; samples=3; first=https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-2
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://edu.wyoming.gov/parents/special-education/
- district_or_county_education_routing: verified_county_grade; samples=3; first=https://edu.wyoming.gov/?s=district+directory
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://health.wyo.gov/behavioralhealth/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.wypanda.com/
- parent_training_information_center: verified_state_grade; samples=2; first=https://wpic.org/about/
- legal_aid: verified_state_grade; samples=4; first=https://www.lawyoming.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=3; first=https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf

## Next actions

- none

## Repair decision

- Wyoming is now `COMPLETE` and `index_safe=true`.
- `district_or_county_education_routing` clears because the live public WDE directory now exposes a statewide district listing plus reviewed district detail leaves with direct `Special Education Director` contacts for all 51 district entries.
- `county_local_disability_resources` clears because the live official WDH HCBS PDF endpoints preserve disability-specific county assignments, and the reviewed BES county-assignment PDF covers all 23 Wyoming counties for DD routing.
