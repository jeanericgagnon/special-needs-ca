# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 15
- primary_gap_reason: bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_are_pima_support_letters_not_county_contracts

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (Reviewed 2026-06-26 the current live official U.S. Department of Education IDEA-by-State page for Arizona at `https://sites.ed.gov/idea/state/arizona/` after the older Arizona Department of Education special-education lane failed live probes behind a Cloudflare 403 shell. The current official federal page is reviewable and Arizona-specific: it preserves the exact state heading `Arizona - Individuals with Disabilities Education Act` and publishes current IDEA Part B materials, including `2025 SPP/APR and State Determination Letters, Part B — Arizona` and `2024 SPP/APR and State Determination Letters, Part B — Arizona`, on the same official host. That is enough to keep statewide IDEA Part B authority evidence current while district-grade routing remains proved separately from reviewed Arizona district-owned leaves.)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-25 one more bounded official Arizona alternative-district lane from the live AZ School Report Cards inventory plus exact district-owned leaves. Coconino County remains cleared through the official CAVIAT detail route and live `https://www.caviat.org/page/504/` leaf. Mohave County now also clears: the official Arizona report-cards detail API for Mohave Valley Elementary District (`educationOrganizationId 4379`) preserved exact coordinates (`latitude 34.9104059`, `longitude -114.6000147`), and the official Census reverse geocoder at `https://geocoding.geo.census.gov/geocoder/geographies/coordinates` returns `Mohave County` from those coordinates. The same district-owned host preserves a live `https://www.mvesd16.org/page/special-services/` leaf plus a public `https://www.mvesd16.org/documents/special-education/3674` surface. Yavapai County also clears through a better official LEA than the prior dead-end accommodation root: the public Arizona report-cards entity list exposes Prescott Unified District (`educationOrganizationId 4466`) in Prescott, its detail API preserves exact coordinates (`latitude 34.5423444`, `longitude -112.4651411`), and the official Census reverse geocoder returns `Yavapai County` from those coordinates. The same district-owned host preserves a live `https://www.prescottschools.com/district-info/departments/ess` page titled `Exceptional Student Services` with rendered `Special Education`, `Procedural Safeguards`, and `Child Find` language, plus a public `Parents Rights Handbook` page on the same host. Arizona district_or_county_education_routing therefore now clears at county grade through reviewed official local leaves across all remaining counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_des_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_prove_no_county_contract (Reviewed 2026-06-26 one more bounded live Arizona county-local pass across the exact remaining official DES and AHCCCS lanes. The official DES wrapper roots `https://des.az.gov/office-locator` and `https://des.az.gov/find-your-local-office` still return HTTP 403 `Just a moment...` shells. The linked public Salesforce-hosted DES office-locator app at `https://azdes-community.my.salesforce-sites.com/EOL/` is still live and remains the only reviewable official DES county-local lane, but it still exposes Greenlee only through locality ZIP coverage rather than an explicit county assignment. The official AHCCCS fallback lane is now clearer than in the older packet. The current official PDFs linked from the public `UniversityFamilyCare.html` oversight page are live and reviewable: `CountyAdminOffice.pdf` and `PimaCountyAdmin.pdf` both return HTTP 200 application/pdf and are readable after rendering, but they are just 2014 Pima County Administrator support letters about the University Family Care merger, not county-to-office routing contracts. The current official ALTCS county-map PDF at `https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf` is also live and text-extractable, but it only preserves county enrollment counts and contractor names, not office assignment. The live `ALTCSlocations.html` page still stops at named office cards and still does not explicitly assign Greenlee County to an office. The official Greenlee County health page plus first-party Clifton, Duncan, and Morenci town surfaces remain live, but they still do not name any DES or AHCCCS office assignment for Greenlee County. Arizona therefore still lacks one reviewed public official artifact that explicitly binds Greenlee County itself to a DES or AHCCCS office.)

## Failure ledger

- county_local_disability_resources: official_greenlee_county_assignment_still_missing_after_live_admin_pdf_review :: Reviewed 2026-06-26 one more bounded live Arizona county-local pass across the exact remaining official DES and AHCCCS lanes. The official DES wrapper roots `https://des.az.gov/office-locator` and `https://des.az.gov/find-your-local-office` still return HTTP 403 `Just a moment...` shells. The linked public Salesforce-hosted DES office-locator app at `https://azdes-community.my.salesforce-sites.com/EOL/` is still live and remains the only reviewable official DES county-local lane, but it still exposes Greenlee only through locality ZIP coverage rather than an explicit county assignment. The official AHCCCS fallback lane is now clearer than in the older packet. The current official PDFs linked from the public `UniversityFamilyCare.html` oversight page are live and reviewable: `CountyAdminOffice.pdf` and `PimaCountyAdmin.pdf` both return HTTP 200 application/pdf and are readable after rendering, but they are just 2014 Pima County Administrator support letters about the University Family Care merger, not county-to-office routing contracts. The current official ALTCS county-map PDF at `https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf` is also live and text-extractable, but it only preserves county enrollment counts and contractor names, not office assignment. The live `ALTCSlocations.html` page still stops at named office cards and still does not explicitly assign Greenlee County to an office. The official Greenlee County health page plus first-party Clifton, Duncan, and Morenci town surfaces remain live, but they still do not name any DES or AHCCCS office assignment for Greenlee County. Arizona therefore still lacks one reviewed public official artifact that explicitly binds Greenlee County itself to a DES or AHCCCS office.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=2; first=https://sites.ed.gov/idea/state/arizona/
- district_or_county_education_routing: verified_county_grade; samples=7; first=https://azreportcards.azed.gov/districts/Detail/79381
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_des_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_prove_no_county_contract; samples=16; first=https://azdes-community.my.salesforce-sites.com/EOL/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_new_reviewable_county_to_office_contract

## Completion decision

- Arizona remains BLOCKED and not index-safe.
- County-local routing is still blocked on one exact unresolved contract: a reviewed public DES or AHCCCS artifact that explicitly assigns Greenlee County to an office.
- The last AHCCCS admin-PDF lane is now exhausted truthfully: those official PDFs are readable, but they are Pima support letters rather than county-routing artifacts.
