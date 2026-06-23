# Batch 232 Nebraska Public Directory Clearance Report v1

- classification: BLOCKED
- index_safe: false
- family cleared: district_or_county_education_routing

## What changed

- Found a stronger exact official leaf through the live NDE sitemap: `dataservices/education-directory/`.
- Verified that the linked `educdirsrc.education.ne.gov` host is public and runnable.
- Verified that `QuickStaff.aspx` exposes a county selector with 93 county options.
- Verified that a bounded Adams County selection returns a live official `QuickStaffDisplay.aspx` results page with county-specific directory content.

## Result

- Nebraska education routing is now verified_county_grade.
- Nebraska remains BLOCKED only on county_local_disability_resources because the public office layers still lack service-area relationships.
