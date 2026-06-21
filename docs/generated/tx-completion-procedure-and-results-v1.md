# Texas Completion Procedure And Results v1

## 1. Executive summary

Texas was re-run as a manifest-first, source-of-truth completion lane. This pass did not use broad autopilot scraping. It reviewed a bounded Texas manifest, re-expressed the existing Texas official backbone into machine-readable county-gated artifacts, and logged every failure or unresolved issue.

## 2. Starting Texas counts

- counties: 254
- county_offices: 416
- routing_agencies: 78
- programs: 12
- forms_guides: 26
- school_districts: 255
- nonprofits: 4505
- providers: 10
- waitlists: 8
- verified_records: 5305
- manual_review_records: 0
- allowlist_indexing_policy_rows: 254
- existing_texas_audit_artifacts: 17
- source_records: {"sourcePackRows":145,"sourcePackStatusCounts":{"verified_target":73,"target_candidate":17,"needs_review":16,"blocked_known":39},"seedTargetRows":54}

## 3. California baseline comparison

- counties: 58
- county_offices: 174
- routing_agencies: 21
- programs: 10
- forms_guides: 22
- school_districts: 80
- nonprofits: 871
- providers: 2
- verified_programs: 10
- verified_offices: 174
- verified_agencies: 21
- verified_forms: 22

## 4. Reviewed source manifest summary

- Manifest rows: 20
- Manifest review rows written: 23
- Fetch ok rows: 22
- Fetch failed rows: 1
- Redirect/domain review rows: 0

## 5. What was harvested

- LIDDA county map rows: 39
- ECI county map rows: 39
- AskTED district map rows: 255
- HHS office map rows: 254
- Official statewide program source rows: 13
- Texas county baseline rows: 254

## 6. Entity counts after harvest

- Counties baseline rows: 254
- PASS counties: 254
- PARTIAL counties: 0
- BLOCKED counties: 0

## 7. County gate results

- PASS: 254
- PARTIAL: 0
- BLOCKED: 0

## 8. PASS / PARTIAL / BLOCKED counts

- PASS counties: 254
- PARTIAL counties: 0
- BLOCKED counties: 0

## 9. Source failures and why they happened

- source_fetch_failed | tx_project_first | https://texasprojectfirst.org/ | http_403
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- wrong_domain | county_office_nonofficial_secondary | https://doi.org/10.7910/DVN/AVRHMI | secondary county office row uses non-official source
- duplicate_entity | pecos-tx | https://apps.hhs.texas.gov/contact/la.cfm | multiple LIDDA mappings: permiacare,west-texas
- duplicate_entity | terrell-tx | https://apps.hhs.texas.gov/contact/la.cfm | multiple LIDDA mappings: permiacare,west-texas
- duplicate_entity | ward-tx | https://apps.hhs.texas.gov/contact/la.cfm | multiple LIDDA mappings: permiacare,west-texas
- duplicate_entity | winkler-tx | https://apps.hhs.texas.gov/contact/la.cfm | multiple LIDDA mappings: permiacare,west-texas

## 10. What worked

- Texas already had a strong official backbone in the DB for LIDDA, ECI, county offices, and ESC fallback routing.
- Existing structured Texas source files allowed a bounded manifest-first run without broad scraping.
- County baseline generation reached all 254 counties.

## 11. What failed

- tx_project_first: http_403
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- county_office_nonofficial_secondary: secondary county office row uses non-official source
- pecos-tx: multiple LIDDA mappings: permiacare,west-texas
- terrell-tx: multiple LIDDA mappings: permiacare,west-texas
- ward-tx: multiple LIDDA mappings: permiacare,west-texas
- winkler-tx: multiple LIDDA mappings: permiacare,west-texas

## 12. Procedure rules learned

- official skeleton before enrichment
- reviewed manifest beats historical repo hints
- search result does not equal verified source
- commercial/provider rows are candidates by default
- no indexing until county gate passes
- every verified field needs source URL, final URL, fetched date, evidence snippet, and verification status
- every run must update the run log, gap matrix, failure ledger, procedure rules, and next action queue
- source-specific harvesters beat generic crawlers
- directory pages should be parsed into structured county joins

## 13. Reusable rules for other states

- Start with the reviewed role manifest, not old queue rows.
- Use existing structured state seeds where available, but re-verify the authority pages live.
- Build county gates from explicit county joins and statewide reviewed routes.

## 14. P0 next actions

- tx_texas_project_first | tx_project_first | review official URL and retry source-specific fetch | http_403
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source
- tx_hhs_benefits_medicaid | county_office_nonofficial_secondary | review redirect or domain mismatch before trust | secondary county office row uses non-official source

## 15. Files created/updated

- docs/generated/tx-completion-procedure-and-results-v1.md
- data/generated/tx_gap_matrix_v1.json
- data/generated/tx_run_log_v1.jsonl
- data/generated/tx_source_manifest_review_v1.jsonl
- data/generated/tx_failure_ledger_v1.jsonl
- data/generated/tx_procedure_rules_v1.jsonl
- data/generated/tx_next_action_queue_v1.jsonl
- data/source_targets/tx_role_target_manifest_v1.jsonl
- data/generated/tx_lidda_county_map_v1.jsonl
- data/generated/tx_eci_county_map_v1.jsonl
- data/generated/tx_askted_district_map_v1.jsonl
- data/generated/tx_hhs_office_map_v1.jsonl
- data/generated/tx_official_program_source_pack_v1.jsonl
- data/generated/tx_county_baseline_v1.jsonl
- data/generated/tx_verification_summary_v1.json

## 16. Commands run

- `node scripts/run-texas-completion-lane.mjs`
- `node scripts/test-texas-completion-lane.mjs`

## 17. Tests/checks run

- Manifest JSONL validation
- County baseline count equals 254
- PASS counties require source URLs
- PASS counties require LIDDA and ECI routing or explicit fallback
- Verified manifest/program rows require evidence fields

## 18. Remaining risks

- Existing legacy audits currently mark Texas as gold/index-safe; this lane does not trust those older verdicts by default.
- Some county office secondary rows still point to non-official DOI-backed sources and remain logged for repair.
- County PASS does not imply nonprofit/provider long-tail completeness; this pass is only the official backbone plus trusted statewide routes.
