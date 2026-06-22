# Arizona ALTCS HTML And PDF Lane Refresh Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: ahcccs_html_office_lane_is_live_but_county_mapping_remains_trapped_in_image_pdfs

## Evidence

- Reviewed 2026-06-22 bounded live official Arizona AHCCCS county-local artifacts after the earlier DES/AHCCCS host split. The live ALTCS Offices HTML leaf now proves seven named official offices on the accessible AHCCCS host: Chinle, Flagstaff, Kingman, Phoenix, Prescott, Tucson, and Yuma. But the fetched HTML does not preserve counties served or a county-to-office contract. The remaining county-specific official artifacts are the AHCCCS ALTCS County Map PDF and county-admin PDFs such as CountyAdminOffice.pdf and PimaCountyAdmin.pdf, and both fetched as image-heavy PDFs in the current local toolchain with no usable county/admin text extraction. DES remains fully challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves, so Arizona still has no reviewable DES county-office lane. That leaves the county-local family blocked not by a total source void but by unparsed official county-mapping PDFs and unreviewed county-admin leaves on the accessible AHCCCS host.
