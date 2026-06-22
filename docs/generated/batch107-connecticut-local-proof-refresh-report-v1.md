# Connecticut Local Proof Refresh Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83

## Evidence checks

- education: Reviewed 2026-06-22 bounded live checks on the current Public EdSight district-finder shell https://public-edsight.ct.gov/overview/find-schools/find-school-district and its linked official OrgSearchReport endpoint https://edsight.ct.gov/SASStoredProcess/do?_keyword=&_program=%2FCTDOE%2FEdSight%2FRelease%2FReporting%2FPublic%2FReports%2FStoredProcesses%2FOrgSearchReport_SiteCore&orgtype=&orgdistrict=&orgname=Hartford&_select=Submit. The public shell renders anonymous navigation only, while the direct district query bounces to SAS Logon instead of returning public district records, so the official state directory surface still does not preserve county- or district-grade routing contacts that can replace Connecticut's statewide SDE fallback rows.
- county_local: Reviewed 2026-06-22 bounded live checks on the current Connecticut DDS regions hub https://portal.ct.gov/dds/about/dds-regions plus its linked official regional-contact-list PDF https://portal.ct.gov/-/media/DDS/Commissioner/Regional_Contact_List.pdf and town-finder archive https://portal.ct.gov/dds/searchable-archive/general/regionstownfinder/townfinder1. The live DDS hub is real, but the actionable local-routing evidence now lives in an unparsed PDF and searchable-archive town-finder path, while the older direct regional-office URLs from the sitemap return HTTP 404. Connecticut therefore has a reviewed official replacement source family, but not yet county-grade extracted local office evidence that can truthfully replace the DOI-backed office rows.
- pti_reference: Reviewed 2026-06-22 live first-party CPAC About page https://cpacinc.org/about.aspx. The page preserves the sentence "Beth is also the Director of CPAC's federally funded Parent Training and Information (PTI) Center project," so CPAC now has explicit first-party PTI designation evidence rather than only generic statewide family-support language.
