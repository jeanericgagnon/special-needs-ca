# Batch 286 North Carolina Official County Contract Completion Report v1

- classification: COMPLETE
- index_safe: true
- change: replaced both North Carolina local blockers with official county-bearing state contracts

## Evidence

- Reviewed 2026-06-23 the live official NC DPI EDDIE page plus the public School Report Card researcher dataset lane. The EDDIE page at `https://www.dpi.nc.gov/districts-schools/district-operations/financial-and-business-services/demographics-and-finances/eddie` explicitly says EDDIE is the authoritative source for LEA directory information and links the public School Report Card dataset resources. The official researcher page at `https://www.dpi.nc.gov/data-reports/school-report-cards/school-report-card-resources-researchers` exposes the public 2023-24 open dataset zip at `https://www.dpi.nc.gov/src-data-set-2023-2024/open`, and its `rcd_location.xlsx` workbook preserves 115 2024 `LEA` rows spanning all 100 North Carolina counties with district name, county, city, phone, website URL, and superintendent fields. Eleven counties explicitly preserve multi-district routing in the same official dataset, including Buncombe, Cabarrus, Catawba, Columbus, Davidson, Halifax, Iredell, Orange, Randolph, Sampson, and Surry. That official county-keyed dataset is strong enough to replace the old statewide DPI Exceptional Children fallback rows and verify district_or_county_education_routing at county grade.
- Reviewed 2026-06-23 the live official NCDHHS Local DSS Directory lane. The public root at `https://www.ncdhhs.gov/divisions/social-services/local-dss-directory` is live, and the official sitemap at `https://www.ncdhhs.gov/sitemap.xml` exposes county-specific DSS leaves across all 100 North Carolina counties, including URL variants such as `/local-dss-directory/alamance-county-department-social-services`, `/divisions/social-services/alleghany-county-department-social-services`, `/divisions/social-services/richmond-county-division-social-services`, and `/divisions/social-services/wake-county-division-human-services`. Reviewed county leaves preserve county-owned office identity plus direct contact routing, for example Alamance (`336-570-6532`), Alexander (`828-632-1080`), Alleghany (`336-372-2411`), and Richmond (`910-997-8480`). That official county-leaf contract is strong enough to replace the DOI mirror placeholders and verify county_local_disability_resources at county grade.

## Completion decision

- North Carolina is now COMPLETE/index_safe.
- Education now clears from the official DPI School Report Card dataset contract instead of district-by-district leaf authoring.
- County-local now clears from the official NCDHHS Local DSS sitemap contract instead of DOI mirror placeholders.
