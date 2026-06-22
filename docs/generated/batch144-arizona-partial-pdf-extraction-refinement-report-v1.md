# Arizona Partial PDF Extraction Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: ahcccs_county_map_pdf_yields_county_text_but_admin_office_mapping_still_requires_ocr_or_reviewed_leaves

## Evidence

- Reviewed 2026-06-22 bounded official Arizona AHCCCS county-local artifacts again using the bundled workspace Python runtime. The live ALTCS Offices HTML leaf still proves seven named official offices on the accessible AHCCCS host: Chinle, Flagstaff, Kingman, Phoenix, Prescott, Tucson, and Yuma. The official ALTCS County Map PDF is not fully image-only after all: bundled pypdf extraction preserves county names such as Yuma, Mohave, La Paz, Gila, Santa Cruz, Cochise, Graham, Maricopa, Pinal, Apache, Navajo, Coconino, Yavapai, Greenlee, and Pima alongside ALTCS enrollment text. But that county-map artifact still does not preserve office addresses, phones, or a county-to-office assignment contract. The remaining official CountyAdminOffice.pdf and PimaCountyAdmin.pdf artifacts still did not yield reviewable county/admin text in the current lane, and DES remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves. Arizona county-local routing therefore narrows to admin-office OCR or reviewed AHCCCS admin leaves, not to generic source discovery.

## Repair decision

- The official ALTCS county map is partially parseable and should no longer be described as fully image-only.
- Arizona still remains blocked because the county-admin office contract itself is still trapped in OCR-only PDFs or equivalent unreviewed AHCCCS admin leaves.
