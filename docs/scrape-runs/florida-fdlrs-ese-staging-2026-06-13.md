# Florida FDLRS / ESE Staging Run Report (2026-06-13)

Staged FDLRS Associate Centers and Priority ESE School Districts into SQLite staging tables.

## 1. Executive Summary
*   **Staged FDLRS Centers:** 19 records (staged in `staging_scraped_regional_education_agencies`)
*   **Staged Verified ESE Districts:** 14 records (staged in `staging_scraped_school_districts`)
*   **Skipped Fallback placeholders:** 53 records (omitted from staging tables)
*   **Florida Counties Covered:** 67 / 67 counties covered by FDLRS mapping

## 2. Ingestion Evidence and Trust Distributions

### Evidence Levels
*   **official_locator_derived:** 19 record(s)
*   **source_listed:** 14 record(s)

### Confidence Scores
*   **0.9:** 33 record(s)

## 3. Staged Records Details
| Record Name | Type | Evidence Level | Confidence Score |
|---|---|---|---|
| FDLRS Action Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Alpha Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Reach Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Crown Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS East Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Emerald Coast Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Galaxy Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Gateway Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Gulfcoast Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Heartland Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Hillsborough Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Island Coast Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Miccosukee Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS NEFEC Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS PAEC Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS South Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Springs Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Suncoast Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| FDLRS Sunrise Associate Center | fdlrs_center | official_locator_derived | 0.9 |
| Leon County Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Alachua County Public Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Duval County Public Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Seminole County Public Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Orange County Public Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Brevard Public Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| School District of Palm Beach County - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Broward County Public Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Miami-Dade County Public Schools (MDCPS) - ESE Department | ese_district_verified | source_listed | 0.9 |
| School District of Lee County - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Hillsborough County Public Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Pinellas County Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Pasco County Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |
| Polk County Public Schools - Exceptional Student Education | ese_district_verified | source_listed | 0.9 |

## 4. Verification Check
*   [x] exactly 19 FDLRS centers staged
*   [x] all 67 counties covered by FDLRS mapping
*   [x] only 14 verified ESE districts staged
*   [x] 53 fallback ESE records were not inserted into staging tables
*   [x] no production records changed
*   [x] no fallback records deleted
*   [x] no sitemap/indexing changes
