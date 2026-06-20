# Master Source Target Ledger

Generated: 2026-06-19

This artifact answers the concrete execution question:

Which exact URLs should we scrape to fill the repo gaps, and which URLs should we avoid, review manually, or treat only as discovery seeds?

## Summary

- state source-target files present: 50/50
- missing state source-target files: none
- total ledger rows: 2371
- unique duplicate groups: 1693
- ready rows: 1858
- lightweight-ready rows: 1466
- discovery-only rows: 103
- manual-review rows: 4
- source-repair rows: 0
- blocked rows: 406

## What "Ready" Means

- `ready_lightweight`: safe to scrape with normal HTTP + HTML parsing.
- `ready_pdf`: safe to scrape as a forms/document source.
- `ready_js_heavy`: scrape-worthy, but likely needs Playwright.
- `discovery_only`: usable to discover real targets, not for direct promotion.
- `manual_review`: known source, but do not automate blindly.
- `source_repair`: exact target exists in the ledger, but the current URL pattern is stale, synthetic, or otherwise needs deterministic replacement before fetch.
- `do_not_use`: quarantined target; do not include in the scraping queue.

## Counts By Status

- ready_lightweight: 1459
- do_not_use: 406
- ready_js_heavy: 392
- discovery_only: 103
- ready_pdf: 7
- manual_review: 4

## Counts By Gap Family

- nonprofit_support: 1396
- providers_care: 196
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

- alaska: https://anmc.org/ (Alaska Native Medical Center; static_fetch; ready_lightweight)
- alaska: https://anthc.org/patient-care/bhwc (Behavioral Health Wellness Clinic at ANMC; static_fetch; ready_lightweight)
- alaska: https://anthc.org/patient-care/specialty-care (ANMC and Specialty Care; static_fetch; ready_lightweight)
- west-virginia: https://cabellhuntington.org/ (Hoops Family Children's Hospital; static_fetch; ready_lightweight)
- texas: https://calliercenter.utdallas.edu/ (UT Dallas Callier Center for Communication Disorders; static_fetch; ready_lightweight)
- west-virginia: https://camc.org/ (CAMC Women and Children's Hospital; static_fetch; ready_lightweight)
- new-hampshire: https://childrens.dartmouth-health.org/ (The Children's Hospital at Dartmouth Hitchcock Medical Center; static_fetch; ready_lightweight)
- west-virginia: https://childrens.wvumedicine.org/ (WVU Medicine Children's; static_fetch; ready_lightweight)
- new-york: https://childrenshospital.northwell.edu/departments-services (Cohen Children's Medical Center Departments and Services; static_fetch; ready_lightweight)
- wisconsin: https://childrenswi.org/ (Children's Wisconsin; static_fetch; ready_lightweight)
- delaware: https://christianacare.org/ (ChristianaCare; static_fetch; ready_lightweight)
- north-carolina: https://cidd.unc.edu/ (UNC Carolina Institute for Developmental Disabilities; static_fetch; ready_lightweight)
- wyoming: https://evanstonregionalhospital.com/ (Evanston Regional Hospital; static_fetch; ready_lightweight)
- california: https://health.ucdavis.edu/mindinstitute (UC Davis MIND Institute; static_fetch; ready_lightweight)
- connecticut: https://health.uconn.edu/ (UConn Health; static_fetch; ready_lightweight)
- indiana: https://healthcare.ascension.org/locations/indiana/inasc/pmch/departments-and-services/departments/pediatric-neurology (Peyton Manning Children's Hospital Pediatric Neurology; static_fetch; ready_lightweight)
- utah: https://healthcare.utah.edu/locations/hospital (University of Utah Hospital; static_fetch; ready_lightweight)
- oklahoma: https://integrishealth.org/ (INTEGRIS Health; static_fetch; ready_lightweight)
- utah: https://intermountainhealthcare.org/ (Intermountain Health; static_fetch; ready_lightweight)
- utah: https://intermountainhealthcare.org/locations/primary-childrens-lehi (Primary Children's Hospital - Lehi; static_fetch; ready_lightweight)

## Provider Source-Repair Targets


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

- nevada: https://adsd.nv.gov/Programs/Intellectual/Intellectual (state_resource_agencies; playwright; ready_js_heavy)
- rhode-island: https://bhddh.ri.gov/developmental-disabilities (state_resource_agencies; playwright; ready_js_heavy)
- new-york: https://data.nysed.gov/ (school_districts; playwright; ready_js_heavy)
- kentucky: https://dbhdid.ky.gov/ddid (state_resource_agencies; playwright; ready_js_heavy)
- virginia: https://dbhds.virginia.gov/ (state_resource_agencies; playwright; ready_js_heavy)
- maryland: https://dda.health.maryland.gov/ (state_resource_agencies; playwright; ready_js_heavy)
- vermont: https://ddsd.vermont.gov/ (state_resource_agencies; playwright; ready_js_heavy)
- south-carolina: https://ddsn.sc.gov/ (state_resource_agencies; playwright; ready_js_heavy)
- arizona: https://des.az.gov/ddd (state_resource_agencies; playwright; ready_js_heavy)
- west-virginia: https://dhhr.wv.gov/bms (state_resource_agencies; playwright; ready_js_heavy)
- nebraska: https://dhhs.ne.gov/Pages/DD (state_resource_agencies; playwright; ready_js_heavy)
- south-dakota: https://dhs.sd.gov/dd (state_resource_agencies; playwright; ready_js_heavy)
- alaska: https://dhss.alaska.gov/dsds/Pages/dd/default.aspx (state_resource_agencies; playwright; ready_js_heavy)
- delaware: https://dhss.delaware.gov/ddds (state_resource_agencies; playwright; ready_js_heavy)
- missouri: https://dmh.mo.gov/dev-disabilities (state_resource_agencies; playwright; ready_js_heavy)
- montana: https://dphhs.mt.gov/dsd/ddp (state_resource_agencies; playwright; ready_js_heavy)
- utah: https://dspd.utah.gov/ (state_resource_agencies; playwright; ready_js_heavy)
- alaska: https://education.alaska.gov/regional (regional_education_agencies; playwright; ready_js_heavy)
- delaware: https://education.delaware.gov/regional (regional_education_agencies; playwright; ready_js_heavy)
- minnesota: https://education.minnesota.gov/regional (regional_education_agencies; playwright; ready_js_heavy)

## Highest-Value Ready Form URLs

- alaska: https://health.alaska.gov/dsds (Alaska Division of Senior and Disabilities Services; ready_pdf)
- idaho: https://healthandwelfare.idaho.gov/ (Idaho Ei Referral Guide; ready_pdf)
- arkansas: https://humanservices.arkansas.gov/wp-content/uploads/DDS.docx (Arkansas Division of Developmental Disabilities Services; ready_pdf)
- alabama: https://medicaid.alabama.gov/forms (Alabama Medicaid & Special Education Forms; ready_pdf)
- california: https://www.dhcs.ca.gov/formsandpubs/Pages/default.aspx (California DHCS Forms and Publications; ready_pdf)
- new-jersey: https://www.nj.gov/humanservices/ddd/forms (New Jersey DDD Eligibility Application & Appeals Guide; ready_pdf)

## Files

- JSON ledger: docs/generated/master-source-target-ledger-2026-06-19.json
- CSV ledger: docs/generated/master-source-target-ledger-2026-06-19.csv
- Markdown report: docs/generated/master-source-target-ledger-2026-06-19.md
