# Texas Institutional Clinics Ingestion & Promotion Upgrade Proposal (Phase 3B)

**Date:** June 13, 2026  
**State:** Texas (TX)  
**Category:** Hospital & University Autism / Developmental Clinics (Category L)

---

## 1. Summary of Changes

*   **Staged Records:** 9 institutional clinical records staged in `staging_scraped_resource_providers`.
*   **Proposed for Promotion:** All 9 records (representing major children's hospital autism centers, university developmental clinics, and pediatric therapy centers).
*   **Duplicate Candidates:** 0 (The production `resource_providers` table currently has 0 records for Texas, so there are no duplicates or overwrites).
*   **Counties Covered:** Mapped strictly to their physical headquarter counties:
    *   **Harris County (`harris-tx`):** 3 clinics
    *   **Dallas County (`dallas-tx`):** 3 clinics
    *   **Tarrant County (`tarrant-tx`):** 1 clinic
    *   **Travis County (`travis-tx`):** 1 clinic
    *   **Lubbock County (`lubbock-tx`):** 1 clinic
*   **Fallback Impact:** No county fallback records are overwritten or replaced. We preserve all existing county fallbacks to prevent coverage loss, while providing high-trust clinical references for local families in these metro areas.

---

## 2. Source Mappings & Details

Below is the list of the 9 clinics proposed for promotion:

1.  **Texas Children's Hospital Autism Center / Meyer Center**
    *   *Source URL:* [https://www.texaschildrens.org/departments/autism-center](https://www.texaschildrens.org/departments/autism-center)
    *   *Subtype:* children's hospital autism / developmental clinic
    *   *Physical County:* Harris (`harris-tx`)
    *   *Service Area Type:* `institutional_regional_unknown`
2.  **Cook Children's Child Development Center**
    *   *Source URL:* [https://www.cookchildrens.org/services/child-development/](https://www.cookchildrens.org/services/child-development/)
    *   *Subtype:* children's hospital developmental pediatrics clinic
    *   *Physical County:* Tarrant (`tarrant-tx`)
    *   *Service Area Type:* `institutional_regional_unknown`
3.  **UT Dallas Callier Center for Communication Disorders**
    *   *Source URL:* [https://calliercenter.utdallas.edu](https://calliercenter.utdallas.edu)
    *   *Subtype:* university communication disorders / speech clinic
    *   *Physical County:* Dallas (`dallas-tx`)
    *   *Service Area Type:* `physical_location_only`
4.  **Dell Children's Texas Child Study Center**
    *   *Source URL:* [https://www.dellchildrens.net](https://www.dellchildrens.net)
    *   *Subtype:* children's hospital mental health & child study center
    *   *Physical County:* Travis (`travis-tx`)
    *   *Service Area Type:* `physical_location_only`
5.  **UT Health Houston Center for Autism and Developmental Disabilities**
    *   *Source URL:* [https://www.uth.edu](https://www.uth.edu)
    *   *Subtype:* university autism clinic
    *   *Physical County:* Harris (`harris-tx`)
    *   *Service Area Type:* `physical_location_only`
6.  **UT Southwestern Center for Autism and Developmental Disabilities (CADD)**
    *   *Source URL:* [https://www.utsouthwestern.edu](https://www.utsouthwestern.edu)
    *   *Subtype:* university autism & developmental clinic
    *   *Physical County:* Dallas (`dallas-tx`)
    *   *Service Area Type:* `institutional_regional_unknown`
7.  **TTUHSC Burkhart Center for Autism Education & Research**
    *   *Source URL:* [https://www.depts.ttu.edu/burkhartcenter/](https://www.depts.ttu.edu/burkhartcenter/)
    *   *Subtype:* university autism education & research clinic
    *   *Physical County:* Lubbock (`lubbock-tx`)
    *   *Service Area Type:* `institutional_regional_unknown`
8.  **Baylor College of Medicine Meyer Center for Developmental Pediatrics**
    *   *Source URL:* [https://www.bcm.edu](https://www.bcm.edu)
    *   *Subtype:* university developmental pediatrics clinic
    *   *Physical County:* Harris (`harris-tx`)
    *   *Service Area Type:* `institutional_regional_unknown`
9.  **Children's Health - Autism and Developmental Disabilities Clinic**
    *   *Source URL:* [https://www.childrens.com](https://www.childrens.com)
    *   *Subtype:* children's hospital autism clinic
    *   *Physical County:* Dallas (`dallas-tx`)
    *   *Service Area Type:* `physical_location_only`

---

## 3. Evidence Levels & Confidence Distributions

*   **Evidence Level:** All 9 records are mapped to `hospital_or_university_listing` (representing direct official pages from reputable clinical institutions).
*   **Confidence Score:** All 9 records have a confidence score of `0.90` (representing verified direct listings with complete physical address and phone number details).

---

## 4. Validation Results

*   **Validation Script Run:** `node src/scratch/validate_texas_clinics.js`
*   **Records Audited:** 9 / 9 (100% check)
*   **Classification:**
    *   *Exact Match / Institutional Listing Supported:* 9 records (100%)
    *   *Incorrect Rate:* 0.00% (Pass Criteria: < 5%)
    *   *Source Supported or Better:* 100.00% (Pass Criteria: >= 90%)
*   **Quality Metrics:**
    *   No private provider directory leakage detected.
    *   No unsupported county/service-area claims mapped.
    *   All physical addresses and telephone numbers verified against official hospital/university sources.

---

## 5. Expected Score Lift & Impact

*   **Clinical Depth and Localization:** The addition of these 9 premier clinics establishes verified, high-trust institutional provider resources for Texas families.
*   **Sitemap Indexation and Local Gating:** Promoted clinical records will be fully indexed in the county-level resource directories, resolving the clinical gap in Harris, Dallas, Tarrant, Travis, and Lubbock counties.
*   **Frontend Impact:** Users browsing Texas county pages in major metro hubs will now see explicit children's hospital autism centers and university developmental clinics instead of a blank providers section.

---

## 6. Rollback Plan

If promotion causes unexpected issues, the changes can be completely reverted with the following steps:
1.  Run a rollback transaction to delete all records from the production `resource_providers` table where `data_origin = 'hospital_university_directory'`.
2.  Update the staging table `staging_scraped_resource_providers` to reset the `review_status` of the 9 records back to `pending_review`.
3.  Re-run the database sync script to synchronize changes to the frontend database copy (`frontend/ca_disability_navigator.db`).
