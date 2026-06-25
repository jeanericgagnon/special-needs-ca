# New Mexico Blocker Packets v7

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 33
- primary_gap_reason: official_webed_directory_rest_list_and_rec_home_are_live_but_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live HCA Medicaid leaves now prove statewide New Mexico Medicaid coverage and application routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed HCA DDSD evidence on disk now proves statewide DD-waiver application / eligibility and HCBS disability-services routing.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed HCA DDSD evidence on disk replaced the stale dhhs.new-mexico.gov DD authority path.)
- early_intervention_part_c: verified_county_grade (The official ECECD FIT page plus the linked Regional Office Map now prove county-grade local FIT routing across all 33 counties.)
- special_education_idea_part_b: verified_state_grade (The reviewed New Mexico regional education row still points to the PED Special Education Bureau page as the statewide Part B authority, while district-grade routing remains a separate blocked family.)
- district_or_county_education_routing: blocked_official_directory_rest_list_and_rec_groupings_live_but_verified_county_crosswalk_still_missing (Reviewed 2026-06-25 one bounded official New Mexico education directory pass beyond the previously failing PED hosts, then rechecked the live PED-managed SharePoint directory surfaces directly. The public school-directory host `https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx` is live and returns HTTP 200. Its visible `NM Schools` page at `/Lists/2017 NM Schools/AllItems.aspx` is backed by a public SharePoint REST list with `ItemCount: 935` and live `items` plus `RenderListDataAsStream` responses, but that live list schema still exposes only district/location columns and no county field. The official public downloads `NM Schools.xlsx`, `Superintendents.xlsx`, and `REC Directors.xlsx` also remain live and still carry no county field or REC county-service-area field. The public `RECHome.aspx` page is also live but only groups districts under REC headings rather than exposing counties or REC service-area labels. The legacy `education.new-mexico.gov` host family remains DNS-dead, and the current `webnew.ped.state.nm.us/bureaus/special-education/` page still does not itself supply county-grade local routing. New Mexico education therefore remains blocked on an official county-to-district or county-to-REC crosswalk, not on total absence of a public PED directory lane.)
- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate (Reviewed 2026-06-23 the New Mexico VR blocker artifacts plus the NM low-token registry. The exact official DVR root `https://www.dvr.nm.gov/` is still the only reviewed first-party VR host in the state packet and it returns HTTP 401 Unauthorized in bounded fetches. The New Mexico official-domain registry still carries no reviewed alternate VR domain, and the NM unresolved-roles ledger still shows both `vocational_rehabilitation` and `pre_ets` with `no_reviewed_allowed_domains`. New Mexico VR therefore remains blocked on missing reviewed alternate official-root evidence after the 401 lane, not on a broader discovery gap.)
- protection_and_advocacy: verified_state_grade (Reviewed DRNM first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and intake route.)
- parent_training_information_center: verified_state_grade (The reviewed Parents Reaching Out About page explicitly preserves New Mexico PTI designation on a first-party source.)
- legal_aid: verified_state_grade (The reviewed New Mexico Legal Aid locations page preserves a statewide intake route and explicitly says it serves all counties in New Mexico.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_current_official_hca_field_offices_county_service_area_page (Reviewed 2026-06-25 the current official HCA `Field Offices` page at `https://www.hca.nm.gov/lookingforassistance/field_offices/`. The live page now preserves county-to-office service-area assignments in public HTML across all 33 New Mexico counties, including `County Office 10 - Serving Curry, De Baca, Harding, Quay, & Roosevelt Counties`, `County Office 4 - Serving San Miguel, Guadalupe, Taos, Union, Colfax, & Mora Counties`, and `County Office 14 - Serving Catron, Cibola, Socorro, Torrance, & Valencia Counties`, each with current office names, addresses, and hours on the official HCA host.)

## Failure ledger

- district_or_county_education_routing: official_webed_directory_rest_list_and_rec_home_verified_no_county_field_or_rec_service_area_contract :: Reviewed 2026-06-25 one bounded official New Mexico education directory pass beyond the previously failing PED hosts, then rechecked the live PED-managed SharePoint directory surfaces directly. The visible `NM Schools` page is backed by a public SharePoint REST list with `ItemCount: 935` plus live `items` and `RenderListDataAsStream` responses, but that live list schema still exposes only district/location columns and no county field. The public `RECHome.aspx` page is also live but only groups districts under REC headings without county or REC service-area labels. New Mexico education therefore remains blocked on an official county-to-district or county-to-REC crosswalk, not on total absence of a public PED directory lane.
- vocational_rehabilitation_pre_ets: official_dvr_root_returns_401_without_reviewed_public_alternate :: Reviewed 2026-06-23 the New Mexico VR blocker artifacts plus the NM low-token registry. The exact official DVR root `https://www.dvr.nm.gov/` is still the only reviewed first-party VR host in the state packet and it returns HTTP 401 Unauthorized in bounded fetches. The New Mexico official-domain registry still carries no reviewed alternate VR domain, and the NM unresolved-roles ledger still shows both `vocational_rehabilitation` and `pre_ets` with `no_reviewed_allowed_domains`. New Mexico VR therefore remains blocked on missing reviewed alternate official-root evidence after the 401 lane, not on a broader discovery gap.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.hca.nm.gov/turquoise-care/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hca.nm.gov/eligibility-determination/
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.hca.nm.gov/developmental-disabilities-supports-division/
- early_intervention_part_c: verified_county_grade; samples=2; first=https://www.nmececd.org/family-infant-toddler-fit-program/
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://webnew.ped.state.nm.us/bureaus/special-education/
- district_or_county_education_routing: blocked_official_directory_rest_list_and_rec_groupings_live_but_verified_county_crosswalk_still_missing; samples=7; first=https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx
- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate; samples=2; first=https://www.dvr.nm.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drnm.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://parentsreachingout.org/about-us/
- legal_aid: verified_state_grade; samples=1; first=https://newmexicolegalaid.org/who-we-are/locations.html
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_current_official_hca_field_offices_county_service_area_page; samples=4; first=https://www.hca.nm.gov/lookingforassistance/field_offices/

## Next actions

- [critical] district_or_county_education_routing: author_official_county_crosswalk_from_webed_directory_or_rec_contract
- [major] vocational_rehabilitation_pre_ets: browser_assisted_or_review_alternate_official_vr_root

## Current education-host finality

- The legacy `education.new-mexico.gov` host family remains explicitly retired as an active source lane because exact probes on the root, regional, sitemap, robots, and likely child routes all failed DNS resolution.
- The current `webnew.ped.state.nm.us` host family is still not producing county-grade local routing under bounded exact probes; the bureau page remains statewide-only and the root/search/API-shaped routes are still not the lane to trust for local proof.
- A sibling official PED-managed directory host is now confirmed live: `https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx` returns HTTP 200 and publicly exposes district, superintendent, and REC workbook downloads.
- Those official workbook downloads are now confirmed single-sheet exports that still preserve no county field and no county-service-area labels, so the blocker is the missing county crosswalk or county-labeled local contract, not the absence of a public education directory.

## Completion decision

- New Mexico remains `BLOCKED` and `index_safe=false`.
- County-local now clears from the current official HCA `Field Offices` page, which closes the earlier four-county remainder with explicit county-service-area assignments on the official host.
- Education remains the highest-priority blocker because the live official directory, its public SharePoint REST list, and the public REC grouping page still stop short of a county crosswalk or county-labeled local routing contract.
- VR remains blocked on the 401 DVR host plus zero reviewed alternate official roots.
