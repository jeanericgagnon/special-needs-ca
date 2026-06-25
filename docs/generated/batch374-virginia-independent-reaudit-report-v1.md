# Virginia California-Grade Independent Re-Audit Report v1

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 95
- strong_critical_families: 12
- weak_critical_families: 0
- missing_critical_families: 0
- reviewed_at: 2026-06-25

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed 2026-06-25 live Virginia Medicaid member pages. The official Benefits and Services page states that benefits and services are available to Medicaid members, and the same page includes Virginia's maternal and child health insurance programs, including FAMIS and children's Medicaid.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed 2026-06-25 live Virginia Medicaid waiver pages. The official Waivers page states that Medicaid waivers are home and community based and explicitly points families to CCC+ and Developmental Disability waivers.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed 2026-06-25 live DBHDS developmental services pages. The official DBHDS developmental-services page states that DBHDS strives to ensure that all individuals with developmental disabilities have access to quality support and services and publishes developmental services staff and waiver network supports contacts.)
- early_intervention_part_c: verified_state_grade (Reviewed 2026-06-25 live ITCVA pages. The ITCVA homepage identifies itself as the Commonwealth's early intervention system and says services are provided under Part C of IDEA; the Central Directory page routes referrals through local central points of entry and publicly lists county and city links; the Local System Managers directory publishes local managers with explicit county-and-city coverage crosswalks.)
- special_education_idea_part_b: verified_state_grade (Reviewed 2026-06-25 the live official VDOE Special Education page in browser mode after raw fetch remained blocked. The page exposes the statewide Special Education landing page with parent resources, evaluation and eligibility, IEP and instruction, resolving disputes, reports and statistics, and IDEA Part B fiscal links on the official VDOE host.)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 live Virginia School Quality Profiles division routing pages. The official divisions archive publicly enumerates 133 Virginia divisions and the Fairfax County Public Schools detail page preserves the division number, address, superintendent, region, and division website.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed 2026-06-25 the live official DARS For Students page in browser mode after raw fetch remained blocked. The page states that DARS serves students with disabilities as early as age 14, explicitly labels Pre-Employment Transition Services, and describes Vocational Rehabilitation Services for eligible students.)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-25 live first-party dLCV pages. The dLCV homepage explicitly identifies itself as the designated Protection and Advocacy organization of Virginia.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 live first-party PEATC pages. The About page explicitly states that PEATC is the parent information and training center serving families and professionals of children with disabilities in the Commonwealth of Virginia.)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 live first-party dLCV pages. The homepage says dLCV helps clients with disability-related problems and provides legal services and direct representation as resources allow.)
- able_program: verified_state_grade (Reviewed 2026-06-25 live ABLEnow and Commonwealth Savers pages. The ABLEnow homepage identifies the national ABLEnow program, and the same page states that ABLEnow is administered by Commonwealth Savers Plan; Commonwealth Savers in turn states that Virginia529 is now Commonwealth Savers.)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 live Virginia DSS local department directory pages. The official Find Your Local Department page tells families to find their local department of social services in Virginia, says they can search by county or use filters, and exposes 121 results including Accomack, Albemarle, and Alleghany-Covington department cards.)

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.dmas.virginia.gov/for-members/benefits-and-services/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.dmas.virginia.gov/for-members/benefits-and-services/waivers/
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://dbhds.virginia.gov/developmental-services-for-individuals-and-families/
- early_intervention_part_c: verified_state_grade; samples=4; first=https://itcva.online/
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.doe.virginia.gov/programs-services/special-education
- district_or_county_education_routing: verified_state_grade; samples=2; first=https://schoolquality.virginia.gov/divisions
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dars.virginia.gov/employment-services/for-students/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.dlcv.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://peatc.org/about/
- legal_aid: verified_state_grade; samples=1; first=https://www.dlcv.org/
- able_program: verified_state_grade; samples=2; first=https://www.ablenow.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=3; first=https://www.dss.virginia.gov/localagency/index.php

## Evidence modes

- medicaid_state_health_coverage: raw_fetch
- medicaid_waiver_hcbs_disability_services: raw_fetch
- developmental_disability_idd_authority: raw_fetch
- early_intervention_part_c: raw_fetch
- special_education_idea_part_b: browser_reviewed
- district_or_county_education_routing: raw_fetch
- vocational_rehabilitation_pre_ets: browser_reviewed
- protection_and_advocacy: raw_fetch
- parent_training_information_center: raw_fetch
- legal_aid: raw_fetch
- able_program: raw_fetch
- county_local_disability_resources: raw_fetch

## Completion decision

- Virginia remains `COMPLETE` and `index_safe=true` after an independent re-audit of all 12 critical families.
- The packet no longer depends on the fake `dhhs.virginia.gov` placeholders for developmental-disability and early-intervention routing.
- The Part C family now rests on current ITCVA statewide, central-directory, and local-system-manager coverage pages instead of inherited synthetic domains.
- The ABLE family now rests on ABLEnow plus Commonwealth Savers / Virginia529 sponsorship evidence instead of the generic ABLE NRC hub.
- VDOE special education and DARS student employment evidence are preserved as browser-reviewed official exceptions because raw fetches were blocked while the official pages remained reviewable in browser mode.

## Browser-reviewed exceptions

- special_education_idea_part_b: https://www.doe.virginia.gov/programs-services/special-education :: The official page lists Special Education subpages including Information for Families, Evaluation and Eligibility, IEP and Instruction, Resolving Disputes, Reports, Plans and Statistics, and Virginia's Application for IDEA Part B Funds.
- vocational_rehabilitation_pre_ets: https://dars.virginia.gov/employment-services/for-students/ :: The official DARS page says services are available for students with disabilities as early as age 14, labels Pre-Employment Transition Services, and states that Vocational Rehabilitation Services help eligible students find and maintain employment.

## Failure ledger

- none

## Next actions

- none
