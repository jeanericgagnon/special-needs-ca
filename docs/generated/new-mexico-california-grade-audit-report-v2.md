# New Mexico California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 33
- primary_gap_reason: bounded_2026_06_26_live_recheck_confirms_public_ped_sharepoint_stack_still_lacks_county_or_rec_service_area_contract_and_official_vr_lanes_still_fail_closed

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live HCA Medicaid leaves now prove statewide New Mexico Medicaid coverage and application routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed HCA DDSD evidence on disk now proves statewide DD-waiver application / eligibility and HCBS disability-services routing.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed HCA DDSD evidence on disk replaced the stale dhhs.new-mexico.gov DD authority path.)
- early_intervention_part_c: verified_county_grade (The official ECECD FIT page plus the linked Regional Office Map now prove county-grade local FIT routing across all 33 counties.)
- special_education_idea_part_b: verified_state_grade (The reviewed New Mexico regional education row still points to the PED Special Education Bureau page as the statewide Part B authority, while district-grade routing remains a separate blocked family.)
- district_or_county_education_routing: blocked_live_ped_sharepoint_stack_public_and_reviewable_but_still_missing_county_crosswalk_or_rec_service_area_contract (Reviewed 2026-06-26 one more bounded live New Mexico PED pass on the exact public WebED stack. `Home.aspx`, the live `2017 NM Schools` list, and `RECHome.aspx` still return HTTP 200 on the PED-managed SharePoint host, and the same six public workbook exports still return HTTP 200: `NM Schools.xlsx`, `Superintendents.xlsx`, `REC Directors.xlsx`, `Elementary School Principals.xlsx`, `Middle School Principals.xlsx`, and `High School Principals.xlsx`. The official PED directory lane is therefore real and reviewable, not missing. But it still does not close county-grade local routing. The public SharePoint list and workbook stack still stop at district, location, address, city, zip, school, REC, and contact-style fields, and the reviewed public REC grouping page still does not publish county labels or REC service-area text. New Mexico therefore still lacks any reviewable public county-to-district or county-to-REC contract on the official PED stack.)
- vocational_rehabilitation_pre_ets: blocked_live_dvr_401_and_dws_request_rejected_with_no_public_successor (Reviewed 2026-06-26 one more bounded live New Mexico VR pass on the exact official DVR and DWS successor lanes. `https://www.dvr.nm.gov/` and `https://www.dvr.nm.gov/services` still return HTTP 401 rather than reviewable public VR or Pre-ETS content. The likely official successor family still fails closed too: `https://www.dws.state.nm.us/`, `/en-us/Job-Seekers/Vocational-Rehabilitation`, and `/en-us/Individuals-with-Disabilities` still return the same public `Request Rejected` shell instead of reviewable vocational-rehabilitation content. New Mexico therefore still lacks any reviewable public official VR or Pre-ETS lane.)
- protection_and_advocacy: verified_state_grade (Reviewed DRNM first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and intake route.)
- parent_training_information_center: verified_state_grade (The reviewed Parents Reaching Out About page explicitly preserves New Mexico PTI designation on a first-party source.)
- legal_aid: verified_state_grade (The reviewed New Mexico Legal Aid locations page preserves a statewide intake route and explicitly says it serves all counties in New Mexico.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_current_official_hca_field_offices_county_service_area_page (Reviewed 2026-06-25 the current official HCA `Field Offices` page at `https://www.hca.nm.gov/lookingforassistance/field_offices/`. Unlike the older archive-tail lane, the live page now preserves county-to-office service-area assignments in public HTML across all 33 New Mexico counties, including `County Office 10 - Serving Curry, De Baca, Harding, Quay, & Roosevelt Counties`, `County Office 4 - Serving San Miguel, Guadalupe, Taos, Union, Colfax, & Mora Counties`, and `County Office 14 - Serving Catron, Cibola, Socorro, Torrance, & Valencia Counties`, with current office names, addresses, and hours on the official HCA host.)

## Failure ledger

- district_or_county_education_routing: official_webed_sharepoint_lists_and_six_public_workbooks_verified_live_but_no_county_crosswalk_or_rec_service_area_contract :: Reviewed 2026-06-26 one more bounded live New Mexico PED pass on the exact public WebED stack. `Home.aspx`, the live `2017 NM Schools` list, and `RECHome.aspx` still return HTTP 200 on the PED-managed SharePoint host, and the same six public workbook exports still return HTTP 200: `NM Schools.xlsx`, `Superintendents.xlsx`, `REC Directors.xlsx`, `Elementary School Principals.xlsx`, `Middle School Principals.xlsx`, and `High School Principals.xlsx`. The official PED directory lane is therefore real and reviewable, not missing. But it still does not close county-grade local routing. The public SharePoint list and workbook stack still stop at district, location, address, city, zip, school, REC, and contact-style fields, and the reviewed public REC grouping page still does not publish county labels or REC service-area text. New Mexico therefore still lacks any reviewable public county-to-district or county-to-REC contract on the official PED stack.
- vocational_rehabilitation_pre_ets: official_dvr_root_returns_401_without_reviewed_public_alternate :: Reviewed 2026-06-26 one more bounded live New Mexico VR pass on the exact official DVR and DWS successor lanes. `https://www.dvr.nm.gov/` and `https://www.dvr.nm.gov/services` still return HTTP 401 rather than reviewable public VR or Pre-ETS content. The likely official successor family still fails closed too: `https://www.dws.state.nm.us/`, `/en-us/Job-Seekers/Vocational-Rehabilitation`, and `/en-us/Individuals-with-Disabilities` still return the same public `Request Rejected` shell instead of reviewable vocational-rehabilitation content. New Mexico therefore still lacks any reviewable public official VR or Pre-ETS lane.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.hca.nm.gov/turquoise-care/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hca.nm.gov/eligibility-determination/
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.hca.nm.gov/developmental-disabilities-supports-division/
- early_intervention_part_c: verified_county_grade; samples=2; first=https://www.nmececd.org/family-infant-toddler-fit-program/
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://webnew.ped.state.nm.us/bureaus/special-education/
- district_or_county_education_routing: blocked_official_sharepoint_lists_and_six_public_workbooks_live_but_verified_county_crosswalk_still_missing; samples=10; first=https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx
- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate; samples=2; first=https://www.dvr.nm.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drnm.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://parentsreachingout.org/about-us/
- legal_aid: verified_state_grade; samples=1; first=https://newmexicolegalaid.org/who-we-are/locations.html
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_current_official_hca_field_offices_county_service_area_page; samples=5; first=https://www.hca.nm.gov/lookingforassistance/field_offices/

## Next actions

- [critical] district_or_county_education_routing: author_official_county_crosswalk_from_webed_directory_or_rec_contract
- [major] vocational_rehabilitation_pre_ets: browser_assisted_or_review_alternate_official_vr_root

## Completion decision

- New Mexico remains BLOCKED and not index-safe.
- Education is still blocked because the public PED directory stack is real but still not county-grade.
- VR is still blocked because the official DVR and likely DWS successor lanes are still non-reviewable.
