# Master Source Target Ledger

Generated: 2026-06-17

This artifact answers the concrete execution question:

Which exact URLs should we scrape to fill the repo gaps, and which URLs should we avoid, review manually, or treat only as discovery seeds?

## Summary

- state source-target files present: 50/50
- missing state source-target files: none
- total ledger rows: 2374
- unique duplicate groups: 1694
- ready rows: 1773
- lightweight-ready rows: 1422
- discovery-only rows: 103
- manual-review rows: 5
- blocked rows: 493

## What "Ready" Means

- `ready_lightweight`: safe to scrape with normal HTTP + HTML parsing.
- `ready_pdf`: safe to scrape as a forms/document source.
- `ready_js_heavy`: scrape-worthy, but likely needs Playwright.
- `discovery_only`: usable to discover real targets, not for direct promotion.
- `manual_review`: known source, but do not automate blindly.
- `do_not_use`: quarantined target; do not include in the scraping queue.

## Counts By Status

- ready_lightweight: 1418
- do_not_use: 493
- ready_js_heavy: 351
- discovery_only: 103
- manual_review: 5
- ready_pdf: 4

## Counts By Gap Family

- nonprofit_support: 1396
- providers_care: 199
- programs_benefits: 83
- parent_training_nonprofits: 67
- condition_nonprofits: 61
- geography_counties: 59
- general_gap_fill: 58
- transition_programs: 57
- dd_routing: 55
- waivers: 53
- medicaid_hhs_offices: 50
- early_intervention_programs: 50
- education_routing: 50
- source_registry: 49
- advocates_legal: 44
- forms_guides: 43

## Missing Exact-URL Coverage


## Highest-Value Ready Provider URLs

- georgia: https://dch.georgia.gov/specialized-roster-1 (GEORGIA Specialized Clinic Roster #1; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-10 (GEORGIA Specialized Clinic Roster #10; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-11 (GEORGIA Specialized Clinic Roster #11; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-12 (GEORGIA Specialized Clinic Roster #12; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-13 (GEORGIA Specialized Clinic Roster #13; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-14 (GEORGIA Specialized Clinic Roster #14; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-15 (GEORGIA Specialized Clinic Roster #15; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-16 (GEORGIA Specialized Clinic Roster #16; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-17 (GEORGIA Specialized Clinic Roster #17; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-18 (GEORGIA Specialized Clinic Roster #18; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-19 (GEORGIA Specialized Clinic Roster #19; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-2 (GEORGIA Specialized Clinic Roster #2; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-20 (GEORGIA Specialized Clinic Roster #20; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-21 (GEORGIA Specialized Clinic Roster #21; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-3 (GEORGIA Specialized Clinic Roster #3; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-4 (GEORGIA Specialized Clinic Roster #4; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-5 (GEORGIA Specialized Clinic Roster #5; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-6 (GEORGIA Specialized Clinic Roster #6; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-7 (GEORGIA Specialized Clinic Roster #7; static_fetch; ready_lightweight)
- georgia: https://dch.georgia.gov/specialized-roster-8 (GEORGIA Specialized Clinic Roster #8; static_fetch; ready_lightweight)

## Highest-Value Ready Nonprofit URLs

- texas: https://www.texasautismsociety.org/ (texasautismsociety.org; missing=509; ready_js_heavy)
- texas: https://www.txp2p.org/ (txp2p.org; missing=508; ready_js_heavy)
- texas: https://thearcoftexas.org/ (thearcoftexas.org; missing=259; ready_js_heavy)
- texas: https://prntexas.org/ (prntexas.org; missing=254; ready_js_heavy)
- texas: https://thearc.org/chapter/the-arc-of-dallas-fort-worth (thearc.org; missing=254; ready_lightweight)
- texas: https://thearc.org/chapter/the-arc-of-greater-beaumont (thearc.org; missing=254; ready_lightweight)
- texas: https://thearc.org/chapter/the-arc-of-katy (thearc.org; missing=254; ready_lightweight)
- texas: https://thearc.org/chapter/the-arc-of-the-gulf-coast (thearc.org; missing=254; ready_lightweight)
- texas: https://www.disabilityrightstx.org/ (disabilityrightstx.org; missing=254; ready_js_heavy)
- texas: https://www.navigatelifetexas.org/ (navigatelifetexas.org; missing=254; ready_js_heavy)
- texas: https://thearc.org/chapter/the-arc-of-bryan-college-station (thearc.org; missing=248; ready_lightweight)
- texas: https://thearc.org/chapter/the-arc-of-san-antonio (thearc.org; missing=248; ready_lightweight)
- illinois: http://www.autismqc.org/ (autismqc.org; missing=201; ready_js_heavy)
- georgia: https://www.p2pga.org/ (p2pga.org; missing=159; ready_js_heavy)
- georgia: https://thearc.org/chapter/the-arc-southwest-georgia (thearc.org; missing=158; ready_lightweight)
- georgia: https://thearc.org/chapter/the-arc-of-northeast-georgia (thearc.org; missing=153; ready_lightweight)
- kentucky: http://www.ask-lou.org/ (ask-lou.org; missing=120; ready_js_heavy)
- kentucky: http://www.kypa.net/ (kypa.net; missing=120; ready_js_heavy)
- kentucky: https://arcofky.org/ (arcofky.org; missing=120; ready_js_heavy)
- kentucky: https://asbg.org/ (asbg.org; missing=120; ready_js_heavy)

## Highest-Value Ready Official Routing URLs

- new-york: https://data.nysed.gov/ (school_districts; playwright; ready_js_heavy)
- alaska: https://education.alaska.gov/regional (regional_education_agencies; playwright; ready_js_heavy)
- delaware: https://education.delaware.gov/regional (regional_education_agencies; playwright; ready_js_heavy)
- minnesota: https://education.minnesota.gov/regional (regional_education_agencies; playwright; ready_js_heavy)
- oregon: https://education.oregon.gov/regional (regional_education_agencies; playwright; ready_js_heavy)
- vermont: https://education.vermont.gov/regional (regional_education_agencies; playwright; ready_js_heavy)
- virginia: https://education.virginia.gov/regional (regional_education_agencies; playwright; ready_js_heavy)
- alabama: https://medicaid.alabama.gov/ (county_offices; playwright; ready_js_heavy)
- alabama: https://mh.alabama.gov/ (state_resource_agencies; playwright; ready_js_heavy)
- texas: https://tea.texas.gov/reports-and-data/school-performance/accountability-research/school-district-locator (school_districts; playwright; ready_js_heavy)
- california: https://www.dds.ca.gov/rc/frcn (state_resource_agencies; static_fetch; ready_lightweight)
- florida: https://www.fldoe.org/contact-us/districts.shtml (school_districts; playwright; ready_js_heavy)
- north-carolina: https://www.ncdhhs.gov/divisions/social-services/local-county-social-services-departments (county_offices; playwright; ready_js_heavy)
- north-carolina: https://www.ncdhhs.gov/providers/lme-mco-directory (state_resource_agencies; playwright; ready_js_heavy)
- florida: https://apd.myflorida.com/region (state_resource_agencies; static_fetch; ready_lightweight)
- georgia: https://dbhdd.georgia.gov/locations/regional-offices (state_resource_agencies; static_fetch; ready_lightweight)
- georgia: https://dfcs.georgia.gov/locations (county_offices; playwright; ready_js_heavy)
- ohio: https://dodd.ohio.gov/your-county-board/county-boards-map (state_resource_agencies; playwright; ready_js_heavy)
- texas: https://hhs.texas.gov/services/financial/social-services-offices (county_offices; playwright; ready_js_heavy)
- ohio: https://jfs.ohio.gov/county/county_directory.pdf (county_offices; pdf_extract; ready_pdf)

## Highest-Value Ready Form URLs

- alabama: https://medicaid.alabama.gov/forms (Alabama Medicaid & Special Education Forms; ready_pdf)
- california: https://www.dhcs.ca.gov/formsandpubs/Pages/default.aspx (California DHCS Forms and Publications; ready_pdf)
- new-jersey: https://www.nj.gov/humanservices/ddd/forms (New Jersey DDD Eligibility Application & Appeals Guide; ready_pdf)

## Files

- JSON ledger: docs/generated/master-source-target-ledger-2026-06-17.json
- CSV ledger: docs/generated/master-source-target-ledger-2026-06-17.csv
- Markdown report: docs/generated/master-source-target-ledger-2026-06-17.md
