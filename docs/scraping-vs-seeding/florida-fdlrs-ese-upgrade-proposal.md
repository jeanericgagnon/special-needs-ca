# Upgrade Proposal: Florida FDLRS / ESE Regional Education Ingestion

This proposal outlines the ingestion and routing strategy for Florida's Exceptional Student Education (ESE) and Florida Diagnostic and Learning Resources System (FDLRS) networks.

## 1. Executive Summary
Florida's special education system is structured around 19 regional FDLRS Associate Centers and 67 school districts (one per county).
*   **Proposed State:** 19 verified FDLRS Associate Centers mapped to 67 counties.
*   **Target Staging Table:** `staging_scraped_regional_education_agencies` for FDLRS centers, and `staging_scraped_school_districts` for school districts.
*   **Verification Status:** FDLRS Centers are marked as `source_listed` / `official_locator_derived`. ESE districts have 14 verified priority districts (`source_listed`) and 53 fallback placeholders (`current_generated_fallback`).

## 2. Fallback Replacement Strategy
The 53 fallback ESE districts require another source-discovery pass to fetch official FLDOE exceptional student education contact records (such as directory listings for ESE directors) before they can be promoted.
*   **Actionable Plan:**
    1.  Crawl the official Florida Department of Education (FLDOE) ESE contacts directory (https://www.fldoe.org/academics/exceptional-student-edu/ese-contacts.stml).
    2.  Extract the ESE Director name, official email address, direct phone line, and mailing address for each of the 53 fallback counties.
    3.  Update the staging files, replace the placeholders with verified directory data, change the `verification_status` to `source_listed`, and mark `should_promote_automatically = true`.


## 3. Staging Verification (2026-06-13)
*   Staged 19 FDLRS Associate Centers and 14 verified school districts.
*   Omitted all 53 school district fallback placeholders from staging tables.
*   Generated 67-county mapping JSON artifact.
*   Completed staging validation checks successfully.


## 4. Promotion Results (2026-06-13)
*   Promoted 19 FDLRS Associate Centers to production.
*   Inserted 67 county-to-FDLRS mappings (67/67 counties covered).
*   Updated 14 verified priority ESE school districts (evidence upgraded to `source_listed`).
*   Retained 53 fallback ESE districts as `current_generated_fallback` — not deleted.
*   Readiness score: 100.0% → 100.0%.
