# Nebraska California-Grade Truth Refresh v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 93
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (Live Nebraska DHHS Medicaid eligibility and overview leaves now provide the statewide application, eligibility, and coverage path on the real official domain.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Live Nebraska DHHS waiver-eligibility evidence now replaces the dead legacy waiver root.)
- developmental_disability_idd_authority: verified_state_grade (Live Nebraska DHHS Developmental Disabilities and waiver-eligibility leaves now prove the statewide DD authority and appeals path on the reviewed official domain.)
- early_intervention_part_c: verified_state_grade (The official Nebraska Early Development Network site now provides a live statewide Part C route with referral, eligibility, service-coordination, and planning-region navigation.)
- special_education_idea_part_b: verified_state_grade (Live Nebraska Department of Education special-education, complaint, mediation, and due-process leaves now replace the stale generic home-page packet sample.)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-23 the live official Nebraska NDE education-directory lane found in the public NDE sitemap. The NDE Data Services page at `dataservices/education-directory/` links directly to the official `educdirsrc.education.ne.gov` directory host. The public `QuickStaff.aspx` page exposes a county-selectable ASP.NET search contract with 93 county options, and a bounded postback for Adams County returns a live official county-specific `QuickStaffDisplay.aspx` results page with district names, county label, address, city, ZIP, phone, fax, and staff-role output. That county-selectable official directory is enough to verify district_or_county_education_routing at county grade.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Live Nebraska VR now provides the statewide vocational-rehabilitation route on the correct official subdomain.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Rights Nebraska evidence explicitly proves the statewide P&A role.)
- parent_training_information_center: verified_state_grade (Reviewed first-party PTI Nebraska evidence explicitly states that it has served as Nebraska’s Parent Training and Information Center since 2001 and that Nebraska has one federally funded Parent Center.)
- legal_aid: verified_state_grade (Reviewed first-party Legal Aid of Nebraska evidence now provides a real statewide civil legal-aid route.)
- able_program: verified_state_grade (Statewide evidence is present at the required authority level.)
- ssi_ssa_federal_reference: verified_state_grade (Statewide evidence is present at the required authority level.)
- county_local_disability_resources: verified_county_grade (Nebraska county-local routing now clears at county grade from a live official DHHS county-office region contract. The exact first-party `Public Assistance Offices` wrapper on `dhhs.ne.gov` is still weaker, but the current official Nebraska DHHS N-FOCUS TANF page publicly links `Employment First (EF) Offices` to a public GIS office app on the same DHHS owner family. That app and its backing official services now expose two complementary county-grade contracts: the `EQUUS_Office` feature layer preserves 22 office rows with office name, address, city, ZIP, phone number, hours, county, and `Nebraska County(ies) Served`, and the official `CFS_EF_OfficeRegions` polygon layer preserves 93 county rows with explicit county name plus the assigned office, address, phone, hours, and `Nebraska County(ies) Served`. Bounded live county queries for Douglas and Cherry both return exact county-specific office assignments, and a bounded count query confirms all 93 Nebraska counties appear in the official county-office region layer.)

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://dhhs.ne.gov/Pages/Medicaid-Eligibility.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhhs.ne.gov/Pages/DD-Eligibility.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://dhhs.ne.gov/Pages/Developmental-Disabilities.aspx
- early_intervention_part_c: verified_state_grade; samples=1; first=https://edn.ne.gov/cms/
- special_education_idea_part_b: verified_state_grade; samples=4; first=https://www.education.ne.gov/sped/
- district_or_county_education_routing: verified_county_grade; samples=5; first=https://www.education.ne.gov/dataservices/education-directory/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://vr.nebraska.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsnebraska.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://pti-nebraska.org/about/
- legal_aid: verified_state_grade; samples=1; first=https://legalaidofnebraska.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=6; first=https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx

## Completion decision

- Nebraska is now COMPLETE and index-safe.
- The last critical blocker, `county_local_disability_resources`, now clears from a public official DHHS county-office region contract on the current N-FOCUS TANF / Employment First stack.
- The official `Employment First (EF) Offices` page on `dhhs-cfstanf.ne.gov` links directly to a public GIS office app, the official `EQUUS_Office` feature layer preserves 22 office rows with county-served strings, and the official `CFS_EF_OfficeRegions` polygon layer preserves 93 county rows with county-specific office assignments, addresses, phone numbers, hours, and `Nebraska County(ies) Served`.
- Bounded county queries for Douglas and Cherry confirm exact county-to-office mappings on the official host, and a bounded count query confirms all 93 counties appear in the county-office region layer.

