# Batch 189 Kansas Directory Dropdown Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: public_directory_reports_dropdown_and_annual_directory_pdfs_exist_but_no_reviewed_local_special_education_leaves

## Evidence

- Reviewed 2026-06-23 bounded live official Kansas education probes on https://uapps.ksde.gov/Directory_Rpts/default.aspx, https://datacentral.ksde.gov/default.aspx, and https://www.ksde.gov/data-and-reporting/directories, in addition to the existing live KSDE Special Education and School District Maps roots already preserved on disk. The public Directory Reports app is not just an empty root: its HTML preserves a real `Kansas Educational Directory Reports` home page with `Organizational Directory Reports`, `Educator Directory Reports`, a `Complete Directory` link, and a public district selector that includes `***ALL DISTRICTS***` plus specific district IDs and names such as `D0435 :: ABILENE USD 435`, `D0385 :: ANDOVER USD 385`, `D0409 :: ATCHISON PUBLIC SCHOOLS USD 409`, and many more. The official KSDE Directories page also publishes current annual `Kansas Educational Directory` PDFs for 2025-2026, 2024-2025, and 2023-2024, plus pictorial superintendent directory PDFs. So Kansas now has a concrete first-party district inventory lane. But a live DB reconciliation still shows all 105 Kansas school_district rows pointing at the same statewide placeholder website https://www.ksde.org/Default.aspx?tabid=101, and no reviewed district-owned special-education or student-services leaves are preserved on disk. Kansas education therefore remains blocked, but the next lane should start from the public dropdown and annual directory artifacts rather than from re-reading statewide KSDE roots.

## Repair decision

- Kansas remains blocked and not index-safe.
- The DD blocker is unchanged and remains transport-final.
- The public education lane is now sharper: KSDE exposes a real district dropdown inventory and annual directory PDFs on first-party surfaces.
- That inventory still does not itself prove county-grade routing or district-owned special-education contacts, so the next lane remains exact district-owned leaf authoring.
