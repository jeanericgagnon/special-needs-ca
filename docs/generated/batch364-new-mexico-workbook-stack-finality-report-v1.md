# Batch 364 New Mexico Workbook Stack Finality v1

- classification: BLOCKED
- index_safe: false
- change: widened the official New Mexico PED blocker evidence from three public exports to the full six-workbook SharePoint stack plus live lists and REC page

## Evidence

- Reviewed 2026-06-25 one more bounded official New Mexico education directory pass on the live PED-managed SharePoint host. The official `2017 NM Schools` list is still live and REST-backed, and the public workbook stack is broader than the earlier packet captured: `NM Schools.xlsx`, `Superintendents.xlsx`, `REC Directors.xlsx`, `Elementary School Principals.xlsx`, `Middle School Principals.xlsx`, and `High School Principals.xlsx` all download successfully from the same official host. But that fuller official export stack still stops short of county-grade routing. `NM Schools.xlsx` preserves `District Name`, `District Code`, `District Type`, `Location Name`, `Location Address`, `Location City`, `State`, `Zip`, `School Level`, `Location Type`, `Location Status`, and `Location Phone Number`, but no county field. `Superintendents.xlsx` preserves district names, codes, contacts, and addresses, but no county field. `REC Directors.xlsx` preserves only REC number, director, addresses, phone, fax, and email, but no county-service-area field. The elementary, middle, and high school principal workbooks each preserve school/district/contact columns, but no county field. The public `RECHome.aspx` page is also live and still groups districts under REC headings rather than exposing counties or REC service-area labels. New Mexico education therefore remains blocked on a missing official county-to-district or county-to-REC crosswalk, not on absence of public PED directory artifacts.
