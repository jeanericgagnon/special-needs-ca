# North Carolina California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 100
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-23 the live official NC DPI EDDIE page plus the public School Report Card researcher dataset lane. The EDDIE page at `https://www.dpi.nc.gov/districts-schools/district-operations/financial-and-business-services/demographics-and-finances/eddie` explicitly says EDDIE is the authoritative source for LEA directory information and links the public School Report Card dataset resources. The official researcher page at `https://www.dpi.nc.gov/data-reports/school-report-cards/school-report-card-resources-researchers` exposes the public 2023-24 open dataset zip at `https://www.dpi.nc.gov/src-data-set-2023-2024/open`, and its `rcd_location.xlsx` workbook preserves 115 2024 `LEA` rows spanning all 100 North Carolina counties with district name, county, city, phone, website URL, and superintendent fields. Eleven counties explicitly preserve multi-district routing in the same official dataset, including Buncombe, Cabarrus, Catawba, Columbus, Davidson, Halifax, Iredell, Orange, Randolph, Sampson, and Surry. That official county-keyed dataset is strong enough to replace the old statewide DPI Exceptional Children fallback rows and verify district_or_county_education_routing at county grade.)
- vocational_rehabilitation_pre_ets: verified_state_grade (reviewed first-party EIPD evidence preserves statewide vocational rehabilitation routing and local office coverage language)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-23 the authoritative NDRN member-agencies directory plus the live Disability Rights North Carolina first-party host. The NDRN directory lists `Disability Rights North Carolina` with Raleigh contact information and the `disabilityrightsnc.org` website, and the live DRNC homepage preserves the explicit description `Disability Rights North Carolina (DRNC) is the federally designated protection and advocacy agency for the State of North Carolina.` North Carolina therefore now has reviewed statewide protection-and-advocacy proof.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-23 the authoritative Parent Center Hub North Carolina leaf plus the ECAC first-party host already preserved on disk. `https://www.parentcenterhub.org/findurcenter/north-carolina/` explicitly says `North Carolina PTI (Serving all North Carolina)` and names `ECAC, Inc. (Exceptional Children’s Assistance Center)` with direct contact information and the ECAC host. North Carolina therefore now has reviewed statewide PTI designation and scope proof.)
- legal_aid: verified_state_grade (Reviewed 2026-06-23 the live Legal Aid of North Carolina first-party host. `https://legalaidnc.org/` preserves the title `Legal Aid - Legal Aid of North Carolina` and H1 `North Carolina's Non Profit Law Firm`, while `https://legalaidnc.org/get-help/` says `We provide free legal help to low-income North Carolinians in civil cases involving basic human needs`, and `https://legalaidnc.org/about-us/` preserves `Legal Aid of North Carolina is a statewide, no...` mission statement. North Carolina therefore now has reviewed statewide legal-aid proof from a first-party source.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-23 the live official NCDHHS Local DSS Directory lane. The public root at `https://www.ncdhhs.gov/divisions/social-services/local-dss-directory` is live, and the official sitemap at `https://www.ncdhhs.gov/sitemap.xml` exposes county-specific DSS leaves across all 100 North Carolina counties, including URL variants such as `/local-dss-directory/alamance-county-department-social-services`, `/divisions/social-services/alleghany-county-department-social-services`, `/divisions/social-services/richmond-county-division-social-services`, and `/divisions/social-services/wake-county-division-human-services`. Reviewed county leaves preserve county-owned office identity plus direct contact routing, for example Alamance (`336-570-6532`), Alexander (`828-632-1080`), Alleghany (`336-372-2411`), and Richmond (`910-997-8480`). That official county-leaf contract is strong enough to replace the DOI mirror placeholders and verify county_local_disability_resources at county grade.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.ncdhhs.gov/innovations/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.north-carolina.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.north-carolina.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.dpi.nc.gov/districts-schools/classroom-resources/exceptional-children
- district_or_county_education_routing: verified_county_grade; samples=5; first=https://www.dpi.nc.gov/districts-schools/district-operations/financial-and-business-services/demographics-and-finances/eddie
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.ncdhhs.gov/divisions/eipd
- protection_and_advocacy: verified_state_grade; samples=2; first=https://www.ndrn.org/about/ndrn-member-agencies/
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.parentcenterhub.org/findurcenter/north-carolina/
- legal_aid: verified_state_grade; samples=2; first=https://legalaidnc.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=4; first=https://www.ncdhhs.gov/divisions/social-services/local-dss-directory

## Next actions

- [info] maintenance: Preserve North Carolina as COMPLETE/index_safe and rerun only maintenance truth audits unless the official NC DPI dataset or NCDHHS Local DSS contract regresses.

## Completion decision

- North Carolina now reaches California-grade and is index-safe.
- The old statewide DPI Exceptional Children fallback rows are replaced by the official NC DPI School Report Card location dataset contract for all 100 counties.
- The DOI mirror county-local placeholders are replaced by the official NCDHHS Local DSS Directory plus county-leaf sitemap contract for all 100 counties.
- Because every critical family is now verified and both local families are backed by county-bearing official evidence, North Carolina is COMPLETE/index_safe.
